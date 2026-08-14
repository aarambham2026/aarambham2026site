import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { isRequestAuthorized, addAuditLog } from '@/lib/security';
import { getEventSettings, parseTimeToMinutes, formatMinutesTo12Hour } from '@/lib/slotAllocator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const reorderSchema = z.object({
  registrationId: z.string().min(1, 'Registration ID is required'),
  newPosition: z.number().int().positive('New position must be positive')
});

export async function POST(req: Request) {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await req.json();
    const { registrationId, newPosition } = reorderSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      const target = await tx.registration.findFirst({
        where: { OR: [{ registrationId }, { id: registrationId }] }
      });

      if (!target) {
        throw new Error('Registration record not found');
      }

      const allActive = await tx.registration.findMany({
        where: { status: { in: ['REGISTERED', 'SCHEDULED'] } },
        orderBy: { queuePosition: 'asc' }
      });

      // Filter out target record
      const remaining = allActive.filter((r) => r.id !== target.id);

      // Clamp newPosition between 1 and total count
      const targetIdx = Math.max(0, Math.min(newPosition - 1, remaining.length));

      // Insert target record at desired position
      remaining.splice(targetIdx, 0, target);

      const settings = await getEventSettings(tx);
      let currentEndMinutes = parseTimeToMinutes(settings.eventStartTime);

      // Re-assign queuePosition and recalculate slots transactionally
      for (let i = 0; i < remaining.length; i++) {
        const reg = remaining[i];
        const newQueuePos = i + 1;

        const duration = reg.performanceDuration && reg.performanceDuration > 0
          ? reg.performanceDuration
          : (reg.eventCategory?.toUpperCase() === 'DANCE' ? settings.danceDuration : settings.musicDuration);

        const startMins = currentEndMinutes;
        const endMins = startMins + duration;
        const newSlotStart = formatMinutesTo12Hour(startMins);
        const newSlotEnd = formatMinutesTo12Hour(endMins);

        if (
          reg.queuePosition !== newQueuePos ||
          reg.slotStartTime !== newSlotStart ||
          reg.slotEndTime !== newSlotEnd
        ) {
          await tx.registration.update({
            where: { id: reg.id },
            data: {
              queuePosition: newQueuePos,
              slotStartTime: newSlotStart,
              slotEndTime: newSlotEnd
            }
          });
        }

        currentEndMinutes = endMins + settings.setupGap;
      }
    });

    await addAuditLog(
      'REORDER_QUEUE',
      `Admin reordered registration ${registrationId} to queue position #${newPosition}`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully reordered registration ${registrationId} to position #${newPosition}`
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error('Reorder Queue Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reorder registration queue' },
      { status: 500 }
    );
  }
}
