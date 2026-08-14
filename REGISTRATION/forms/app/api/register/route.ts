import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { allocateSlot } from '@/lib/slotAllocator';
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

    const sanitizedEmail = sanitizeInput(validated.email).toLowerCase();
    const sanitizedPhone = sanitizeInput(validated.phone);

    // Atomic duplicate check, slot allocation, and registration creation inside Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      const duplicate = await tx.registration.findFirst({
        where: {
          eventCategory: categoryUpper,
          status: 'REGISTERED',
          OR: [
            { email: sanitizedEmail },
            { phone: sanitizedPhone }
          ]
        }
      });

      if (duplicate) {
        throw new Error(`DUPLICATE_REGISTRATION:${duplicate.registrationId}`);
      }

      const slot = await allocateSlot(
        categoryUpper,
        requestedDuration,
        validated.clientQueuePos,
        validated.clientEndMins,
        tx
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
        email: sanitizedEmail,
        phone: sanitizedPhone,
        membersList: sanitizeInput(validated.membersList) || '',
        queuePosition,
        slotStartTime,
        slotEndTime,
        status: 'REGISTERED'
      };

      const created = await tx.registration.create({ data: regRecord });

      // Create persistent database AuditLog entry
      await tx.auditLog.create({
        data: {
          action: 'REGISTRATION_CREATED',
          actor: 'user',
          targetId: registrationId,
          description: `New registration ${registrationId} created for ${sanitizeInput(validated.teamLeaderName)} (${categoryUpper})`,
          details: JSON.stringify({
            email: sanitizedEmail,
            queuePosition,
            slotStartTime,
            slotEndTime
          })
        }
      });

      return {
        created,
        slot,
        registrationId,
        slotStartTime,
        slotEndTime,
        queuePosition
      };
    });

    const buildTicketUrl = (id: string, name: string, members: number, start: string, end: string, cat: string) => 
      `/api/ticket/${id}?name=${encodeURIComponent(name)}&members=${members}&slotStart=${encodeURIComponent(start)}&slotEnd=${encodeURIComponent(end)}&event=${encodeURIComponent(cat)}`;

    return NextResponse.json({
      success: true,
      registrationId: result.registrationId,
      slotStart: result.slotStartTime,
      slotEnd: result.slotEndTime,
      queuePosition: result.queuePosition,
      lastEndMinutes: result.slot.endMinutes,
      ticketUrl: buildTicketUrl(
        result.registrationId,
        validated.teamLeaderName.trim(),
        validated.numberOfMembers,
        result.slotStartTime,
        result.slotEndTime,
        categoryUpper
      )
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (typeof error.message === 'string' && error.message.startsWith('DUPLICATE_REGISTRATION:')) {
      const existingId = error.message.split(':')[1];
      return NextResponse.json(
        {
          success: false,
          error: `A registration for this event category already exists for this email or phone number (ID: ${existingId}).`
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Registration processing failed. Please try again.' },
      { status: 400 }
    );
  }
}
