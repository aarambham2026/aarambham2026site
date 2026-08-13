import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { allocateSlot } from '@/lib/slotAllocator';

const registerSchema = z.object({
  teamLeaderName: z.string().min(1, 'Team leader name is required'),
  numberOfMembers: z.number().int().positive('Number of members must be greater than 0'),
  eventCategory: z.string().min(1, 'Event category is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Invalid phone number')
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const categoryUpper = validated.eventCategory.toUpperCase();

    // Use Prisma transaction for atomic queue positioning & slot calculation
    const registration = await prisma.$transaction(async (tx) => {
      // 1. Get total registrations to determine queue position
      const totalCount = await tx.registration.count();
      const queuePosition = totalCount + 1;

      // 2. Generate unique Registration ID (EVT-0001, EVT-0002, ...)
      const registrationId = `EVT-${String(queuePosition).padStart(4, '0')}`;

      // 3. Allocate slot based on category and current queue state
      const slot = await allocateSlot(categoryUpper, tx as any);

      // 4. Create registration record
      const created = await tx.registration.create({
        data: {
          registrationId,
          teamLeaderName: validated.teamLeaderName.trim(),
          numberOfMembers: validated.numberOfMembers,
          eventCategory: categoryUpper,
          email: validated.email.trim().toLowerCase(),
          phone: validated.phone.trim(),
          queuePosition,
          slotStartTime: slot.slotStartTime,
          slotEndTime: slot.slotEndTime,
          status: 'REGISTERED'
        }
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      registrationId: registration.registrationId,
      slotStart: registration.slotStartTime,
      slotEnd: registration.slotEndTime,
      ticketUrl: `/api/ticket/${registration.registrationId}`
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
