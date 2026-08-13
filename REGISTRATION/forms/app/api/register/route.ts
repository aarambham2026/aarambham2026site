import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { allocateSlot, savePersistentQueueStore } from '@/lib/slotAllocator';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

const registerSchema = z.object({
  teamLeaderName: z.string().min(1, 'Team leader name is required').max(100, 'Name too long'),
  rollNo: z.string().max(30).optional(),
  department: z.string().max(80).optional(),
  year: z.string().max(30).optional(),
  format: z.string().max(20).optional(),
  numberOfMembers: z.number().int().positive('Number of members must be greater than 0').max(50, 'Max 50 members allowed'),
  eventCategory: z.string().min(1, 'Event category is required').max(30),
  performanceName: z.string().max(150).optional(),
  performanceDuration: z.number().int().positive().max(30).optional(),
  email: z.string().email('Invalid email address').max(100),
  phone: z.string().min(5, 'Invalid phone number').max(20),
  membersList: z.string().max(1000).optional(),
  clientQueuePos: z.number().optional(),
  clientEndMins: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous_ip';
    const rateCheck = checkRateLimit(clientIp, 10, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = registerSchema.parse(body);

    const categoryUpper = sanitizeInput(validated.eventCategory).toUpperCase();
    const requestedDuration = validated.performanceDuration && validated.performanceDuration > 0
      ? Math.min(validated.performanceDuration, 30)
      : 10;
    const perfName = validated.performanceName ? sanitizeInput(validated.performanceName) : null;

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
        teamLeaderName: sanitizeInput(validated.teamLeaderName),
        rollNo: sanitizeInput(validated.rollNo) || 'N/A',
        department: sanitizeInput(validated.department) || 'N/A',
        year: sanitizeInput(validated.year) || 'N/A',
        format: (sanitizeInput(validated.format) || 'SOLO').toUpperCase(),
        numberOfMembers: validated.numberOfMembers,
        eventCategory: categoryUpper,
        performanceName: perfName,
        performanceDuration: requestedDuration,
        email: sanitizeInput(validated.email).toLowerCase(),
        phone: sanitizeInput(validated.phone),
        membersList: sanitizeInput(validated.membersList) || '',
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
