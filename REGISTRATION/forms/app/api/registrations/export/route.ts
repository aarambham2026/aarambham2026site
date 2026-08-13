import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.trim().toUpperCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';

    const where: any = {};
    if (category && category !== 'ALL') where.eventCategory = category;
    if (status && status !== 'ALL') where.status = status;

    const registrations = await prisma.registration.findMany({
      where,
      orderBy: {
        createdAt: 'asc'
      }
    });

    const dataRows = registrations.map((reg) => ({
      'Queue #': reg.queuePosition,
      'Registration ID': reg.registrationId,
      'Team Leader Name': reg.teamLeaderName,
      'Email Address': reg.email,
      'Phone Number': reg.phone,
      'Number of Members': reg.numberOfMembers,
      'Event Category': reg.eventCategory,
      'Performance Duration (mins)': reg.performanceDuration || 10,
      'Slot Start Time': reg.slotStartTime,
      'Slot End Time': reg.slotEndTime,
      'Registration Date & Time': new Date(reg.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      'Status': reg.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    
    // Auto-fit column widths
    const colWidths = [
      { wch: 10 }, // Queue #
      { wch: 18 }, // Reg ID
      { wch: 25 }, // Leader Name
      { wch: 30 }, // Email
      { wch: 16 }, // Phone
      { wch: 12 }, // Members
      { wch: 15 }, // Category
      { wch: 24 }, // Duration
      { wch: 16 }, // Slot Start
      { wch: 16 }, // Slot End
      { wch: 25 }, // Reg Date & Time
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
        'Content-Disposition': `attachment; filename="registrations_${new Date().toISOString().slice(0, 10)}.xlsx"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('Export Registrations Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
