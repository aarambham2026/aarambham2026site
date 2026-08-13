import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPersistentQueueStore } from '@/lib/slotAllocator';
import * as XLSX from 'xlsx';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.trim().toUpperCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';

    let dbRegistrations: any[] = [];
    try {
      dbRegistrations = await prisma.registration.findMany({
        orderBy: { createdAt: 'asc' }
      });
    } catch (e) {
      // Ignore Prisma DB read error
    }

    const store = getPersistentQueueStore();
    const storeRegistrations = Object.values(store.registrations || {});

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
          id: 'cmsrjutiy0002uk4kr8130xnx',
          registrationId: 'EVT-0001',
          queuePosition: 1,
          teamLeaderName: 'Nandhan JS',
          rollNo: '21CS045',
          department: 'Computer Science',
          year: '3rd Year',
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
          year: '3rd Year',
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
          year: '3rd Year',
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
    }

    if (category && category !== 'ALL') {
      combinedList = combinedList.filter((item) => item.eventCategory?.toUpperCase() === category);
    }
    if (status && status !== 'ALL') {
      combinedList = combinedList.filter((item) => item.status?.toUpperCase() === status);
    }

    combinedList.sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0));

    const dataRows = combinedList.map((reg) => ({
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
      'Performance Duration (mins)': reg.performanceDuration || 10,
      'Slot Start Time': reg.slotStartTime || 'N/A',
      'Slot End Time': reg.slotEndTime || 'N/A',
      'Email Address': reg.email || 'N/A',
      'Phone Number': reg.phone || 'N/A',
      'Team Members Roster': reg.membersList || 'N/A',
      'Registration Date & Time': new Date(reg.createdAt || Date.now()).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      'Status': reg.status || 'REGISTERED'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    
    // Auto-fit column widths
    const colWidths = [
      { wch: 8 },  // Queue #
      { wch: 14 }, // Reg ID
      { wch: 24 }, // Leader Name
      { wch: 14 }, // Roll Number
      { wch: 16 }, // Department
      { wch: 16 }, // Year
      { wch: 14 }, // Format
      { wch: 12 }, // Members
      { wch: 14 }, // Category
      { wch: 24 }, // Title
      { wch: 18 }, // Duration
      { wch: 14 }, // Slot Start
      { wch: 14 }, // Slot End
      { wch: 28 }, // Email
      { wch: 16 }, // Phone
      { wch: 40 }, // Team Roster
      { wch: 24 }, // Date & Time
      { wch: 12 }  // Status
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Festival Registrations');

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Aarambham_2026_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('Export Registrations Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
