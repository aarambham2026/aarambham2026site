import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPersistentQueueStore } from '@/lib/slotAllocator';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const category = searchParams.get('category')?.trim().toUpperCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';

    let dbRegistrations: any[] = [];
    try {
      dbRegistrations = await prisma.registration.findMany({
        orderBy: { createdAt: 'asc' }
      });
    } catch (e) {
      // Ignore Prisma DB read error on serverless fallback
    }

    // Read persistent serverless store
    const store = getPersistentQueueStore();
    const storeRegistrations = Object.values(store.registrations || {});

    // Combine and deduplicate by registrationId
    const regMap = new Map<string, any>();
    
    dbRegistrations.forEach((reg) => {
      if (reg.registrationId) regMap.set(reg.registrationId, reg);
    });

    storeRegistrations.forEach((reg: any) => {
      if (reg.registrationId && !regMap.has(reg.registrationId)) {
        regMap.set(reg.registrationId, {
          id: reg.registrationId,
          createdAt: new Date().toISOString(),
          ...reg
        });
      }
    });

    let combinedList = Array.from(regMap.values());

    // Apply filtering
    if (category && category !== 'ALL') {
      combinedList = combinedList.filter((item) => item.eventCategory?.toUpperCase() === category);
    }

    if (status && status !== 'ALL') {
      combinedList = combinedList.filter((item) => item.status?.toUpperCase() === status);
    }

    if (search) {
      combinedList = combinedList.filter((item) => 
        (item.teamLeaderName && item.teamLeaderName.toLowerCase().includes(search)) ||
        (item.registrationId && item.registrationId.toLowerCase().includes(search)) ||
        (item.email && item.email.toLowerCase().includes(search)) ||
        (item.phone && item.phone.toLowerCase().includes(search))
      );
    }

    // Sort by queuePosition or registrationId
    combinedList.sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0));

    // Stats calculation
    const totalCount = combinedList.length;
    const musicCount = combinedList.filter((r) => r.eventCategory?.toUpperCase() === 'MUSIC' && r.status !== 'CANCELLED').length;
    const danceCount = combinedList.filter((r) => r.eventCategory?.toUpperCase() === 'DANCE' && r.status !== 'CANCELLED').length;
    const cancelledCount = combinedList.filter((r) => r.status?.toUpperCase() === 'CANCELLED').length;

    return NextResponse.json({
      success: true,
      data: combinedList,
      stats: {
        total: totalCount,
        music: musicCount,
        dance: danceCount,
        cancelled: cancelledCount
      }
    });
  } catch (error: any) {
    console.error('Fetch Registrations Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
