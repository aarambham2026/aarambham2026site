import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPersistentQueueStore } from '@/lib/slotAllocator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const category = searchParams.get('category')?.trim().toUpperCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';

    // Fetch real registrations directly from Prisma DB
    let dbRegistrations: any[] = [];
    try {
      dbRegistrations = await prisma.registration.findMany({
        orderBy: { queuePosition: 'asc' }
      });
    } catch (e) {
      console.warn('Prisma DB fetch warning:', e);
    }

    // Read persistent serverless store
    const store = getPersistentQueueStore();
    const storeRegistrations = Object.values(store.registrations || {});

    const regMap = new Map<string, any>();

    // Add DB registrations first
    dbRegistrations.forEach((reg) => {
      if (reg.registrationId) regMap.set(reg.registrationId, reg);
    });

    // Merge in-memory serverless store registrations
    storeRegistrations.forEach((reg: any) => {
      if (reg.registrationId) {
        const existing = regMap.get(reg.registrationId) || {};
        regMap.set(reg.registrationId, {
          id: reg.id || reg.registrationId,
          createdAt: new Date().toISOString(),
          ...existing,
          ...reg
        });
      }
    });

    let registrations = Array.from(regMap.values());

    // Apply Search Filter
    if (search) {
      registrations = registrations.filter(
        (r) =>
          r.teamLeaderName?.toLowerCase().includes(search) ||
          r.rollNo?.toLowerCase().includes(search) ||
          r.registrationId?.toLowerCase().includes(search) ||
          r.email?.toLowerCase().includes(search) ||
          r.phone?.includes(search)
      );
    }

    // Apply Category Filter
    if (category && category !== 'ALL') {
      registrations = registrations.filter((r) => r.eventCategory?.toUpperCase() === category);
    }

    // Apply Status Filter
    if (status && status !== 'ALL') {
      registrations = registrations.filter((r) => r.status?.toUpperCase() === status);
    }

    // Sort by queuePosition ascending
    registrations.sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0));

    // Calculate live stats from active registrations
    const allRecords = Array.from(regMap.values());
    const stats = {
      total: allRecords.length,
      music: allRecords.filter((r) => r.eventCategory?.toUpperCase() === 'MUSIC' && r.status === 'REGISTERED').length,
      dance: allRecords.filter((r) => r.eventCategory?.toUpperCase() === 'DANCE' && r.status === 'REGISTERED').length,
      cancelled: allRecords.filter((r) => r.status === 'CANCELLED').length
    };

    return NextResponse.json(
      {
        success: true,
        data: registrations,
        stats
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  } catch (error: any) {
    console.error('Get Registrations Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
