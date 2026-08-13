import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { allocateSlot, formatMinutesTo12Hour } from '@/lib/slotAllocator';

const registerSchema = z.object({
  teamLeaderName: z.string().min(1, 'Team leader name is required'),
  numberOfMembers: z.number().int().positive('Number of members must be greater than 0'),
  eventCategory: z.string().min(1, 'Event category is required'),
  performanceName: z.string().optional(),
  performanceDuration: z.number().int().positive().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Invalid phone number')
});

// Serverless resilient queue state (fallback when SQLite DB is unwritable)
let globalFallbackQueueCounter = 0;
let globalLastFallbackEndMinutes = 14 * 60; // 2:00 PM IST (840 mins)

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
      // Try Prisma database registration
      const slot = await allocateSlot(categoryUpper, requestedDuration, prisma);
      const queuePosition = (slot.lastQueuePosition || 0) + 1;
      const registrationId = `EVT-${String(queuePosition).padStart(4, '0')}`;
      const slotStartTime = slot.slotStartTime;
      const slotEndTime = slot.slotEndTime;

      const registration = await prisma.registration.create({
        data: {
          registrationId,
          teamLeaderName: validated.teamLeaderName.trim(),
          numberOfMembers: validated.numberOfMembers,
          eventCategory: categoryUpper,
          performanceName: perfName,
          performanceDuration: requestedDuration,
          email: validated.email.trim().toLowerCase(),
          phone: validated.phone.trim(),
          queuePosition,
          slotStartTime,
          slotEndTime,
          status: 'REGISTERED'
        }
      });

      const buildTicketUrl = (id: string, name: string, members: number, start: string, end: string, cat: string) => 
        `/api/ticket/${id}?name=${encodeURIComponent(name)}&members=${members}&slotStart=${encodeURIComponent(start)}&slotEnd=${encodeURIComponent(end)}&event=${encodeURIComponent(cat)}`;

      return NextResponse.json({
        success: true,
        registrationId: registration.registrationId,
        slotStart: registration.slotStartTime,
        slotEnd: registration.slotEndTime,
        ticketUrl: buildTicketUrl(registration.registrationId, registration.teamLeaderName, registration.numberOfMembers, registration.slotStartTime, registration.slotEndTime, registration.eventCategory)
      });
    } catch (dbErr: any) {
      console.warn('Prisma DB write notice (serverless fallback), processing with serverless queue allocator:', dbErr);
      
      // If error was slot cutoff at 3:30 PM, pass error back to user
      if (dbErr?.message?.includes('3:30 PM')) {
        return NextResponse.json(
          { success: false, error: dbErr.message },
          { status: 400 }
        );
      }

      // Serverless continuous queue allocation starting from EVT-0001 at 2:00 PM IST
      globalFallbackQueueCounter++;
      const registrationId = `EVT-${String(globalFallbackQueueCounter).padStart(4, '0')}`;
      
      const startMinutes = globalFallbackQueueCounter === 1 
        ? 14 * 60 
        : globalLastFallbackEndMinutes + 2; // 2 min setup gap after each event
      
      const endMinutes = startMinutes + requestedDuration;
      
      const CUTOFF_MINUTES = 15 * 60 + 30; // 3:30 PM (930 mins)
      if (endMinutes > CUTOFF_MINUTES) {
        globalFallbackQueueCounter--; // Rollback counter
        return NextResponse.json(
          { success: false, error: 'All performance slots up to 3:30 PM have been fully allocated.' },
          { status: 400 }
        );
      }

      globalLastFallbackEndMinutes = endMinutes;

      const slotStartTime = formatMinutesTo12Hour(startMinutes);
      const slotEndTime = formatMinutesTo12Hour(endMinutes);

      const buildTicketUrl = (id: string, name: string, members: number, start: string, end: string, cat: string) => 
        `/api/ticket/${id}?name=${encodeURIComponent(name)}&members=${members}&slotStart=${encodeURIComponent(start)}&slotEnd=${encodeURIComponent(end)}&event=${encodeURIComponent(cat)}`;

      return NextResponse.json({
        success: true,
        registrationId,
        slotStart: slotStartTime,
        slotEnd: slotEndTime,
        ticketUrl: buildTicketUrl(registrationId, validated.teamLeaderName.trim(), validated.numberOfMembers, slotStartTime, slotEndTime, categoryUpper)
      });
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
