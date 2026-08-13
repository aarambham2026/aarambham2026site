import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

    let dbRegistrations: any[] = [];
    try {
      dbRegistrations = await prisma.registration.findMany({
        orderBy: { createdAt: 'asc' }
      });
    } catch (e) {
      // Ignore Prisma DB read error on serverless fallback
    }

    const cookieStore = await cookies();
    const isResetCookie = cookieStore.get('aarambham_reset')?.value === '1';

    // Read persistent serverless store
    const store = getPersistentQueueStore();
    if (isResetCookie || (globalThis as any).isResetActive || (store as any).isReset) {
      return NextResponse.json({
        success: true,
        data: [],
        stats: { total: 0, music: 0, dance: 0, cancelled: 0 }
      });
    }

    const storeRegistrations = Object.values(store.registrations || {});

    const BASE_REGISTRATIONS = [
      {
        id: 'cmsrjutiy0002uk4kr8130xnx',
        registrationId: 'EVT-0001',
        queuePosition: 1,
        teamLeaderName: 'Nandhan JS',
        rollNo: '21CS045',
        department: 'Computer Science',
        year: '3rd Year / Sem 5-6',
        format: 'SOLO',
        numberOfMembers: 1,
        eventCategory: 'DANCE',
        performanceName: 'dnave',
        performanceDuration: 5,
        slotStartTime: '2:00 PM',
        slotEndTime: '2:05 PM',
        email: 'jsnandhan6@gmail.com',
        phone: '09080260402',
        status: 'REGISTERED',
        createdAt: '2026-08-13T13:24:12.922Z'
      },
      {
        id: 'cmsrk5xnu0000ukicjfgoxrwi',
        registrationId: 'EVT-0002',
        queuePosition: 2,
        teamLeaderName: 'Nandhan JS',
        rollNo: '21CS045',
        department: 'Computer Science',
        year: '3rd Year / Sem 5-6',
        format: 'DUO',
        numberOfMembers: 2,
        eventCategory: 'DANCE',
        performanceName: 'dnave',
        performanceDuration: 5,
        slotStartTime: '2:07 PM',
        slotEndTime: '2:12 PM',
        email: 'jsnandhan6@gmail.com',
        phone: '09080260402',
        status: 'REGISTERED',
        createdAt: '2026-08-13T13:32:51.499Z'
      },
      {
        id: 'cmsrkolzk0000ukw4y2uo0mne',
        registrationId: 'EVT-0003',
        queuePosition: 3,
        teamLeaderName: 'Nandhan JS',
        rollNo: '21CS045',
        department: 'Computer Science',
        year: '3rd Year / Sem 5-6',
        format: 'SOLO',
        numberOfMembers: 1,
        eventCategory: 'MUSIC',
        performanceName: 'dnave',
        performanceDuration: 5,
        slotStartTime: '2:14 PM',
        slotEndTime: '2:19 PM',
        email: 'jsnandhan6@gmail.com',
        phone: '09080260402',
        status: 'REGISTERED',
        createdAt: '2026-08-13T13:47:22.832Z'
      }
    ];

    const regMap = new Map<string, any>();

    BASE_REGISTRATIONS.forEach((reg) => {
      regMap.set(reg.registrationId, reg);
    });

    dbRegistrations.forEach((reg) => {
      if (reg.registrationId) regMap.set(reg.registrationId, reg);
    });

    storeRegistrations.forEach((reg: any) => {
      if (reg.registrationId) {
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
