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

    const sanitizedEmail = sanitizeInput(validated.email).toLowerCase();
    const sanitizedPhone = sanitizeInput(validated.phone);

    // Duplicate submission check against persistent store
    try {
      const { fetchCloudRegistrations } = await import('@/lib/cloudStore');
      const existingCloud = await fetchCloudRegistrations();
      const duplicate = existingCloud.find(
        (r) =>
          r.eventCategory?.toUpperCase() === categoryUpper &&
          (r.email?.toLowerCase() === sanitizedEmail || r.phone === sanitizedPhone) &&
          r.status === 'REGISTERED'
      );
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `A registration for ${categoryUpper} already exists for this email/phone (ID: ${duplicate.registrationId}).`
          },
          { status: 409 }
        );
      }
    } catch (dupCheckErr) {
      // Continue if duplicate check fetch warning
    }

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
        email: sanitizedEmail,
        phone: sanitizedPhone,
        membersList: sanitizeInput(validated.membersList) || '',
        queuePosition,
        slotStartTime,
        slotEndTime,
        status: 'REGISTERED'
      };

      let dbSaved = false;
      try {
        await prisma.registration.create({ data: regRecord });
        dbSaved = true;
      } catch (dbErr) {
        console.warn('Prisma DB save warning:', dbErr);
      }

      // Save to persistent queue store
      savePersistentQueueStore(queuePosition, slot.endMinutes, regRecord);

      // Save to 24/7 cloud persistent store so page reloads on Vercel NEVER lose data
      let cloudSaved = false;
      try {
        const { saveCloudRegistration } = await import('@/lib/cloudStore');
        const resRecords = await saveCloudRegistration({
          id: registrationId,
          ...regRecord,
          createdAt: new Date().toISOString()
        });
        if (resRecords && resRecords.length > 0) cloudSaved = true;
      } catch (cloudErr) {
        console.warn('Cloud store async save warning:', cloudErr);
      }

      if (!dbSaved && !cloudSaved) {
        throw new Error('Database persistence temporary failure. Please retry your submission.');
      }

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
