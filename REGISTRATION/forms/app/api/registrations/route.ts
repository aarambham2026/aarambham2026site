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

    if (combinedList.length === 0) {
      combinedList = [
        {
          id: 'seed-1',
          registrationId: 'EVT-0001',
          queuePosition: 1,
          teamLeaderName: 'Aarav Nair',
          rollNo: '21CS045',
          department: 'Computer Science',
          year: '3rd Year',
          format: 'SOLO',
          numberOfMembers: 1,
          eventCategory: 'MUSIC',
          performanceName: 'Classical Flute Solo',
          performanceDuration: 5,
          slotStartTime: '2:00 PM',
          slotEndTime: '2:05 PM',
          email: 'aarav@amrita.edu',
          phone: '9876543210',
          status: 'REGISTERED',
          createdAt: new Date().toISOString()
        },
        {
          id: 'seed-2',
          registrationId: 'EVT-0002',
          queuePosition: 2,
          teamLeaderName: 'Meera Krishnan',
          rollNo: '22EC012',
          department: 'Electronics & Comm.',
          year: '2nd Year',
          format: 'GROUP',
          numberOfMembers: 6,
          eventCategory: 'DANCE',
          performanceName: 'Thiruvathira Group Dance',
          performanceDuration: 8,
          slotStartTime: '2:07 PM',
          slotEndTime: '2:15 PM',
          email: 'meera@amrita.edu',
          phone: '9123456789',
          membersList: 'Member 2: Anjali (22EC015); Member 3: Kavya (22EC018)',
          status: 'REGISTERED',
          createdAt: new Date().toISOString()
        }
      ];
    }

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
