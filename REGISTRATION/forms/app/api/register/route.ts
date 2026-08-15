import { NextResponse } from 'next/server';
import crypto from 'crypto';
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
  membersList: z.string().max(1000).optional()
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

    console.log(`[REGISTRATION_INIT] Received registration request for category: ${categoryUpper}, email: ${sanitizedEmail}`);

    // Atomic duplicate check, slot allocation, and registration creation inside Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log(`[REGISTRATION_TX_START] Commencing PostgreSQL transaction for ${sanitizedEmail}...`);

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
        console.warn(`[REGISTRATION_DUPLICATE] Duplicate registration blocked for ${sanitizedEmail} (Existing ID: ${duplicate.registrationId})`);
        throw new Error(`DUPLICATE_REGISTRATION:${duplicate.registrationId}`);
      }

      const slot = await allocateSlot(
        categoryUpper,
        requestedDuration,
        tx
      );

      const queuePosition = slot.nextQueuePosition;

      // Server-side atomic sequential EVT-XXXX generation
      const totalCount = await tx.registration.count();
      const registrationId = `EVT-${String(totalCount + 1).padStart(4, '0')}`;

      const slotStartTime = slot.slotStartTime;
      const slotEndTime = slot.slotEndTime;

      console.log(`[REGISTRATION_ALLOCATED] ID: ${registrationId}, Queue: #${queuePosition}, Slot: ${slotStartTime} - ${slotEndTime}`);

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
      console.log(`[REGISTRATION_TX_SUCCESS] Record successfully inserted into PostgreSQL. ID: ${created.registrationId}, DB ID: ${created.id}`);

      return {
        created,
        slot,
        registrationId,
        slotStartTime,
        slotEndTime,
        queuePosition
      };
    });

    // Write AuditLog AFTER the transaction — non-blocking, never kills registrations
    prisma.auditLog.create({
      data: {
        action: 'REGISTRATION_CREATED',
        actor: 'user',
        targetId: result.registrationId,
        description: `New registration ${result.registrationId} created for ${sanitizeInput(validated.teamLeaderName)} (${categoryUpper})`,
        details: JSON.stringify({
          email: sanitizedEmail,
          queuePosition: result.queuePosition,
          slotStartTime: result.slotStartTime,
          slotEndTime: result.slotEndTime
        })
      }
    }).catch((auditErr: any) => {
      console.error('AuditLog write failed (non-blocking, registration already saved):', auditErr?.message);
    });

    return NextResponse.json({
      success: true,
      registrationId: result.registrationId,
      slotStart: result.slotStartTime,
      slotEnd: result.slotEndTime,
      queuePosition: result.queuePosition,
      lastEndMinutes: result.slot.endMinutes,
      ticketUrl: `/api/ticket/${result.registrationId}`
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

    console.error('[REGISTRATION_TX_ERROR] Unhandled exception during registration persistence:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database registration processing failed. Please try again.' },
      { status: 500 }
    );
  }
}
