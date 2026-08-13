import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { allocateSlot, savePersistentQueueStore } from '@/lib/slotAllocator';

const registerSchema = z.object({
  teamLeaderName: z.string().min(1, 'Team leader name is required'),
  rollNo: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  format: z.string().optional(),
  numberOfMembers: z.number().int().positive('Number of members must be greater than 0'),
  eventCategory: z.string().min(1, 'Event category is required'),
  performanceName: z.string().optional(),
  performanceDuration: z.number().int().positive().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Invalid phone number'),
  membersList: z.string().optional(),
  clientQueuePos: z.number().optional(),
  clientEndMins: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const categoryUpper = validated.eventCategory.toUpperCase();
    const requestedDuration = validated.performanceDuration && validated.performanceDuration > 0
      ? validated.performanceDuration
      : 10;
    const perfName = validated.performanceName ? validated.performanceName.trim() : null;

    try {
      const slot = await allocateSlot(
        categoryUpper,
        requestedDuration,
        validated.clientQueuePos,
        validated.clientEndMins,
        prisma
      );

      const queuePosition = slot.nextQueuePosition;
      const registrationId = `EVT-${String(queuePosition).padStart(4, '0')}`;
      const slotStartTime = slot.slotStartTime;
      const slotEndTime = slot.slotEndTime;

      const regRecord = {
        registrationId,
        teamLeaderName: validated.teamLeaderName.trim(),
        rollNo: validated.rollNo || 'N/A',
        department: validated.department || 'N/A',
        year: validated.year || 'N/A',
        format: (validated.format || 'SOLO').toUpperCase(),
        numberOfMembers: validated.numberOfMembers,
        eventCategory: categoryUpper,
        performanceName: perfName,
        performanceDuration: requestedDuration,
        email: validated.email.trim().toLowerCase(),
        phone: validated.phone.trim(),
        membersList: validated.membersList || '',
        queuePosition,
        slotStartTime,
        slotEndTime,
        status: 'REGISTERED'
      };

      try {
        await prisma.registration.create({ data: regRecord });
      } catch (dbErr) {
        // Ignore DB save error on serverless read-only SQLite
      }

      // Save to persistent file store on disk (/tmp)
      savePersistentQueueStore(queuePosition, slot.endMinutes, regRecord);

      const buildTicketUrl = (id: string, name: string, members: number, start: string, end: string, cat: string) => 
        `/api/ticket/${id}?name=${encodeURIComponent(name)}&members=${members}&slotStart=${encodeURIComponent(start)}&slotEnd=${encodeURIComponent(end)}&event=${encodeURIComponent(cat)}`;

      return NextResponse.json({
        success: true,
        registrationId,
        slotStart: slotStartTime,
        slotEnd: slotEndTime,
        queuePosition,
        lastEndMinutes: slot.endMinutes,
        ticketUrl: buildTicketUrl(registrationId, validated.teamLeaderName.trim(), validated.numberOfMembers, slotStartTime, slotEndTime, categoryUpper)
      });
    } catch (allocErr: any) {
      return NextResponse.json(
        { success: false, error: allocErr.message || 'Slot allocation failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Registration processing failed' },
      { status: 500 }
    );
  }
}
