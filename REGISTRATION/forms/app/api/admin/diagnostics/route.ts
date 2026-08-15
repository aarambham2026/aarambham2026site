import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isRequestAuthorized } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const [registrationCount, eventSettingsCount, auditLogCount, latestRegistration] = await Promise.all([
      prisma.registration.count().catch(() => -1),
      prisma.eventSettings.count().catch(() => -1),
      prisma.auditLog.count().catch(() => -1),
      prisma.registration.findFirst({
        orderBy: { createdAt: 'desc' },
        select: {
          registrationId: true,
          queuePosition: true,
          eventCategory: true,
          status: true,
          createdAt: true
        }
      }).catch(() => null)
    ]);

    return NextResponse.json(
      {
        success: true,
        databaseProvider: 'postgresql',
        databaseConfigured: true,
        prismaConnected: registrationCount >= 0,
        tables: {
          Registration: registrationCount >= 0,
          EventSettings: eventSettingsCount >= 0,
          AuditLog: auditLogCount >= 0
        },
        counts: {
          registrations: registrationCount >= 0 ? registrationCount : 0,
          eventSettings: eventSettingsCount >= 0 ? eventSettingsCount : 0,
          auditLogs: auditLogCount >= 0 ? auditLogCount : 0
        },
        latestRegistrationId: latestRegistration?.registrationId || 'NONE',
        latestQueuePosition: latestRegistration?.queuePosition || 0,
        latestCategory: latestRegistration?.eventCategory || 'N/A',
        latestStatus: latestRegistration?.status || 'N/A',
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  } catch (error: any) {
    console.error('Database Diagnostic Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Diagnostic database query failed' },
      { status: 500 }
    );
  }
}
