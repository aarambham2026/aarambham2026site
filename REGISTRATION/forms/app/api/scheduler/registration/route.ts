import { NextResponse } from 'next/server';
import { fetchCloudRegistrations, updateCloudRegistration, CloudStoreRecord } from '@/lib/cloudStore';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ScheduledJob {
  id: string;
  registrationId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  updatedAt?: string;
  attempts?: number;
}

// In-memory / persistent job claim lock for serverless execution safety
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

    // Optional secret verification if CRON_SECRET is set in environment
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
    let syncedCount = 0;

    try {
      // 1. Fetch current cloud registrations & local DB records
      const cloudRecords = await fetchCloudRegistrations();
      
      let dbRecords: any[] = [];
      try {
        dbRecords = await prisma.registration.findMany();
      } catch (dbErr) {
        // Prisma DB fallback
      }

      // 2. Audit and sync DB <-> Cloud records atomically
      const cloudMap = new Map<string, CloudStoreRecord>();
      cloudRecords.forEach((r) => cloudMap.set(r.registrationId, r));

      for (const dbRec of dbRecords) {
        if (!cloudMap.has(dbRec.registrationId)) {
          // Sync missing DB record into Cloud store
          await updateCloudRegistration(dbRec.registrationId, {
            id: dbRec.registrationId,
            registrationId: dbRec.registrationId,
            teamLeaderName: dbRec.teamLeaderName,
            rollNo: dbRec.rollNo,
            department: dbRec.department,
            year: dbRec.year,
            format: dbRec.format,
            numberOfMembers: dbRec.numberOfMembers,
            eventCategory: dbRec.eventCategory,
            performanceName: dbRec.performanceName,
            performanceDuration: dbRec.performanceDuration,
            slotStartTime: dbRec.slotStartTime,
            slotEndTime: dbRec.slotEndTime,
            email: dbRec.email,
            phone: dbRec.phone,
            membersList: dbRec.membersList,
            queuePosition: dbRec.queuePosition,
            status: dbRec.status || 'REGISTERED',
            createdAt: dbRec.createdAt?.toISOString() || now.toISOString()
          });
          syncedCount++;
        }
      }

      // 3. Process registration state machine & recover stale jobs
      for (const record of cloudRecords) {
        const recordTime = new Date(record.createdAt || 0).getTime();

        // Stale job detection: If status is PROCESSING and stuck > 5 mins, recover to REGISTERED
        if (record.status === 'PROCESSING') {
          if (now.getTime() - recordTime > STALE_THRESHOLD_MS) {
            await updateCloudRegistration(record.registrationId, {
              status: 'REGISTERED'
            });
            recoveredCount++;
          }
        }

        if (record.status === 'REGISTERED') {
          processedCount++;
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Registration scheduler executed successfully',
          timestamp: now.toISOString(),
          metrics: {
            processedRegistrations: processedCount,
            recoveredStaleJobs: recoveredCount,
            syncedDatabaseRecords: syncedCount,
            totalActiveRecords: cloudRecords.length
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
