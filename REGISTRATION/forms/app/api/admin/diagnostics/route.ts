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

    const [registrationCount, latestRegistration] = await Promise.all([
      prisma.registration.count(),
      prisma.registration.findFirst({
        orderBy: { createdAt: 'desc' },
        select: {
          registrationId: true,
          queuePosition: true,
          eventCategory: true,
          status: true,
          createdAt: true
        }
      })
    ]);

    return NextResponse.json(
      {
        success: true,
        databaseConfigured: true,
        prismaConnected: true,
        registrationCount,
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
