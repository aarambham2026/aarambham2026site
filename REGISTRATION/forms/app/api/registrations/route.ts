import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category')?.trim().toUpperCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';

    // Build Prisma query conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { teamLeaderName: { contains: search } },
        { registrationId: { contains: search } }
      ];
    }

    if (category && category !== 'ALL') {
      where.eventCategory = category;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const registrations = await prisma.registration.findMany({
      where,
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Compute real-time statistics
    const totalCount = await prisma.registration.count();
    const musicCount = await prisma.registration.count({
      where: { eventCategory: 'MUSIC', status: 'REGISTERED' }
    });
    const danceCount = await prisma.registration.count({
      where: { eventCategory: 'DANCE', status: 'REGISTERED' }
    });
    const cancelledCount = await prisma.registration.count({
      where: { status: 'CANCELLED' }
    });

    return NextResponse.json({
      success: true,
      data: registrations,
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
