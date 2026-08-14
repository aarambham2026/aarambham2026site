import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEventSettings, parseTimeToMinutes, formatMinutesTo12Hour } from '@/lib/slotAllocator';
import { addAuditLog } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SCHEDULER_LOCK_ID = 20260814;

export async function GET(req: Request) {
  return handleSchedulerExecution(req);
}

export async function POST(req: Request) {
  return handleSchedulerExecution(req);
}

async function handleSchedulerExecution(req: Request) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Verify secret if CRON_SECRET is configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const url = new URL(req.url);
    const querySecret = url.searchParams.get('secret');
    if (querySecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized scheduler trigger' }, { status: 401 });
    }
  }

  let acquiredLock = false;

  try {
    // Acquire PostgreSQL Advisory Lock for serverless concurrency safety
    try {
      const lockResult: any = await prisma.$queryRaw`SELECT pg_try_advisory_lock(${SCHEDULER_LOCK_ID}) as locked;`;
      acquiredLock = Boolean(lockResult[0]?.locked);
    } catch {
      acquiredLock = true; // Fallback if DB doesn't support advisory locks
    }

    if (!acquiredLock) {
      return NextResponse.json(
        { success: true, message: 'Scheduler execution skipped: another instance holds the lock' },
        { status: 200 }
      );
    }

    const now = new Date();
    const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

    let processedCount = 0;
    let recoveredCount = 0;
    let rescheduledCount = 0;
    let autoCompletedCount = 0;

    // 1. Read event settings from PostgreSQL
    const settings = await getEventSettings(prisma);

    // 2. Fetch all active registrations ordered by queuePosition
    const registrations = await prisma.registration.findMany({
      orderBy: { queuePosition: 'asc' }
    });

    // 3. Process state machine and slot alignment
    let currentEndMinutes = parseTimeToMinutes(settings.eventStartTime);
    let expectedQueuePosition = 1;

    for (const reg of registrations) {
      const updatedAtTime = new Date(reg.updatedAt || reg.createdAt).getTime();

      // Stale job recovery
      if (reg.status === 'PROCESSING' && now.getTime() - updatedAtTime > STALE_THRESHOLD_MS) {
        await prisma.registration.update({
          where: { id: reg.id },
          data: { status: 'REGISTERED' }
        });
        recoveredCount++;
      }

      if (reg.status === 'REGISTERED' || reg.status === 'SCHEDULED') {
        processedCount++;

        const duration = reg.performanceDuration && reg.performanceDuration > 0
          ? reg.performanceDuration
          : (reg.eventCategory?.toUpperCase() === 'DANCE' ? settings.danceDuration : settings.musicDuration);

        const expectedStartMinutes = currentEndMinutes;
        const expectedEndMinutes = expectedStartMinutes + duration;

        const expectedSlotStart = formatMinutesTo12Hour(expectedStartMinutes);
        const expectedSlotEnd = formatMinutesTo12Hour(expectedEndMinutes);

        // Align queue position or slot timing if drifted
        if (
          reg.slotStartTime !== expectedSlotStart ||
          reg.slotEndTime !== expectedSlotEnd ||
          reg.queuePosition !== expectedQueuePosition ||
          reg.status === 'REGISTERED'
        ) {
          await prisma.registration.update({
            where: { id: reg.id },
            data: {
              slotStartTime: expectedSlotStart,
              slotEndTime: expectedSlotEnd,
              queuePosition: expectedQueuePosition,
              status: reg.status === 'REGISTERED' ? 'SCHEDULED' : reg.status
            }
          });
          rescheduledCount++;
        }

        currentEndMinutes = expectedEndMinutes + settings.setupGap;
        expectedQueuePosition++;
      }
    }

    const metrics = {
      processedRegistrations: processedCount,
      recoveredStaleJobs: recoveredCount,
      rescheduledSlots: rescheduledCount,
      autoCompleted: autoCompletedCount,
      totalRecords: registrations.length
    };

    await addAuditLog(
      'SCHEDULER_UPDATE',
      `Vercel Cron scheduler executed state reconciliation across ${registrations.length} records`,
      metrics,
      'scheduler'
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Registration scheduler executed successfully against PostgreSQL',
        timestamp: now.toISOString(),
        metrics
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  } catch (error: any) {
    console.error('Registration Scheduler Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Scheduler execution failed' },
      { status: 500 }
    );
  } finally {
    if (acquiredLock) {
      try {
        await prisma.$queryRaw`SELECT pg_advisory_unlock(${SCHEDULER_LOCK_ID});`;
      } catch {}
    }
  }
}
