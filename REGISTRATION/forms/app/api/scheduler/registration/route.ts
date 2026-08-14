import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEventSettings, parseTimeToMinutes, formatMinutesTo12Hour } from '@/lib/slotAllocator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let schedulerLock: Promise<any> = Promise.resolve();

function withSchedulerLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = schedulerLock.then(fn, fn);
  schedulerLock = next.catch(() => {});
  return next;
}

export async function GET(req: Request) {
  return handleSchedulerExecution(req);
}

export async function POST(req: Request) {
  return handleSchedulerExecution(req);
}

async function handleSchedulerExecution(req: Request) {
  return withSchedulerLock(async () => {
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

    const now = new Date();
    const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

    let processedCount = 0;
    let recoveredCount = 0;
    let rescheduledCount = 0;

    try {
      // 1. Read event settings from PostgreSQL
      const settings = await getEventSettings(prisma);

      // 2. Fetch all active registrations ordered by queuePosition
      const registrations = await prisma.registration.findMany({
        orderBy: { queuePosition: 'asc' }
      });

      // 3. Process stale records & re-verify slot timings against event settings
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

        if (reg.status === 'REGISTERED') {
          processedCount++;

          // Recalculate expected start & end times
          const duration = reg.performanceDuration && reg.performanceDuration > 0
            ? reg.performanceDuration
            : (reg.eventCategory?.toUpperCase() === 'DANCE' ? settings.danceDuration : settings.musicDuration);

          const expectedStartMinutes = currentEndMinutes;
          const expectedEndMinutes = expectedStartMinutes + duration;

          const expectedSlotStart = formatMinutesTo12Hour(expectedStartMinutes);
          const expectedSlotEnd = formatMinutesTo12Hour(expectedEndMinutes);

          // If timing or queue position drifted, align with source of truth
          if (
            reg.slotStartTime !== expectedSlotStart ||
            reg.slotEndTime !== expectedSlotEnd ||
            reg.queuePosition !== expectedQueuePosition
          ) {
            await prisma.registration.update({
              where: { id: reg.id },
              data: {
                slotStartTime: expectedSlotStart,
                slotEndTime: expectedSlotEnd,
                queuePosition: expectedQueuePosition
              }
            });
            rescheduledCount++;
          }

          currentEndMinutes = expectedEndMinutes + settings.setupGap;
          expectedQueuePosition++;
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Registration scheduler executed successfully against PostgreSQL',
          timestamp: now.toISOString(),
          metrics: {
            processedRegistrations: processedCount,
            recoveredStaleJobs: recoveredCount,
            rescheduledSlots: rescheduledCount,
            totalRecords: registrations.length
          }
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
    }
  });
}
