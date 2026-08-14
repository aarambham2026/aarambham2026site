import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isRequestAuthorized } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized admin access. Session expired or missing.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const category = searchParams.get('category')?.trim().toUpperCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '25', 10);

    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const limit = Math.max(1, Math.min(100, isNaN(limitParam) ? 25 : limitParam));
    const skip = (page - 1) * limit;

    const sortBy = searchParams.get('sortBy') || 'queuePosition';
    const sortOrder = (searchParams.get('sortOrder') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';

    const whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.eventCategory = category;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { teamLeaderName: { contains: search, mode: 'insensitive' } },
        { rollNo: { contains: search, mode: 'insensitive' } },
        { registrationId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { performanceName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const orderByField: any = {};
    if (['queuePosition', 'createdAt', 'slotStartTime', 'status', 'eventCategory', 'teamLeaderName'].includes(sortBy)) {
      orderByField[sortBy] = sortOrder;
    } else {
      orderByField.queuePosition = 'asc';
    }

    const [registrations, totalCount, allRecords] = await Promise.all([
      prisma.registration.findMany({
        where: whereClause,
        orderBy: orderByField,
        skip,
        take: limit
      }),
      prisma.registration.count({ where: whereClause }),
      prisma.registration.findMany({
        select: { eventCategory: true, status: true }
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    const stats = {
      total: allRecords.length,
      registered: allRecords.filter((r) => r.status === 'REGISTERED').length,
      scheduled: allRecords.filter((r) => r.status === 'SCHEDULED').length,
      completed: allRecords.filter((r) => r.status === 'COMPLETED').length,
      cancelled: allRecords.filter((r) => r.status === 'CANCELLED').length,
      music: allRecords.filter((r) => r.eventCategory?.toUpperCase() === 'MUSIC').length,
      dance: allRecords.filter((r) => r.eventCategory?.toUpperCase() === 'DANCE').length
    };

    return NextResponse.json(
      {
        success: true,
        data: registrations,
        registrations, // Dual format compatibility
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages
        },
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
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch registrations from database' },
      { status: 500 }
    );
  }
}
