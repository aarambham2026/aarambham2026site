import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { isRequestAuthorized } = await import('@/lib/security');
    const authorized = await isRequestAuthorized(req);
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.trim().toUpperCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';

    const whereClause: any = {};
    if (category && category !== 'ALL') whereClause.eventCategory = category;
    if (status && status !== 'ALL') whereClause.status = status;

    const registrations = await prisma.registration.findMany({
      where: whereClause,
      orderBy: { queuePosition: 'asc' }
    });

    const dataRows = registrations.map((reg) => ({
      'Queue #': reg.queuePosition || 0,
      'Registration ID': reg.registrationId || 'N/A',
      'Team Leader Name': reg.teamLeaderName || 'N/A',
      'Roll Number': reg.rollNo || 'N/A',
      'Department': reg.department || 'N/A',
      'Year / Semester': reg.year || 'N/A',
      'Performance Format': reg.format || 'SOLO',
      'Number of Members': reg.numberOfMembers || 1,
      'Event Category': reg.eventCategory || 'N/A',
      'Performance Title': reg.performanceName || 'N/A',
      'Performance Duration': reg.performanceDuration || 10,
      'Email Address': reg.email || 'N/A',
      'Phone Number': reg.phone || 'N/A',
      'Team Members Roster': reg.membersList || 'N/A',
      'Registration Date & Time (IST)': reg.createdAt
        ? new Date(reg.createdAt).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        : 'N/A',
      'Status': reg.status || 'REGISTERED'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    
    const colWidths = [
      { wch: 10 }, // Queue #
      { wch: 16 }, // Registration ID
      { wch: 24 }, // Team Leader Name
      { wch: 16 }, // Roll Number
      { wch: 20 }, // Department
      { wch: 20 }, // Year / Semester
      { wch: 18 }, // Performance Format
      { wch: 18 }, // Number of Members
      { wch: 16 }, // Event Category
      { wch: 24 }, // Performance Title
      { wch: 20 }, // Performance Duration
      { wch: 16 }, // Slot Start Time
      { wch: 16 }, // Slot End Time
      { wch: 28 }, // Email Address
      { wch: 18 }, // Phone Number
      { wch: 40 }, // Team Members Roster
      { wch: 26 }, // Registration Date & Time
      { wch: 14 }  // Status
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Aarambham_2026_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('Export Registrations Error:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}
