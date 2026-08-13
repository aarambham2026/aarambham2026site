import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('aarambham_admin_session');

  if (!session || session.value !== 'authenticated') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized admin access' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const targetApi = process.env.REGISTRATION_API_URL || 'https://aarambham2026registration.vercel.app/api/registrations';

  try {
    const res = await fetch(`${targetApi}?${searchParams.toString()}`, {
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn('Backend API proxy notice:', err);
  }

  // Fallback demo data if backend API URL is not configured yet
  return NextResponse.json({
    success: true,
    data: [
      {
        id: '1',
        registrationId: 'EVT-0001',
        teamLeaderName: 'Aarav Nair',
        numberOfMembers: 1,
        eventCategory: 'MUSIC',
        performanceName: 'Classical Flute Solo',
        performanceDuration: 5,
        email: 'aarav@amrita.edu',
        phone: '9876543210',
        queuePosition: 1,
        slotStartTime: '2:00 PM',
        slotEndTime: '2:05 PM',
        status: 'REGISTERED',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        registrationId: 'EVT-0002',
        teamLeaderName: 'Meera Krishnan',
        numberOfMembers: 6,
        eventCategory: 'DANCE',
        performanceName: 'Thiruvathira Group Dance',
        performanceDuration: 8,
        email: 'meera@amrita.edu',
        phone: '9123456789',
        queuePosition: 2,
        slotStartTime: '2:07 PM',
        slotEndTime: '2:15 PM',
        status: 'REGISTERED',
        createdAt: new Date().toISOString()
      }
    ],
    stats: {
      total: 2,
      music: 1,
      dance: 1,
      cancelled: 0
    }
  });
}
