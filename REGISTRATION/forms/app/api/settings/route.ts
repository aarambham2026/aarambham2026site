import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { invalidateSettingsCache } from '@/lib/slotAllocator';
import { isRequestAuthorized } from '@/lib/security';

const settingsSchema = z.object({
  eventStartTime: z.string().min(1, 'Event start time is required'),
  musicDuration: z.number().int().positive('Music duration must be positive'),
  danceDuration: z.number().int().positive('Dance duration must be positive'),
  setupGap: z.number().int().nonnegative('Setup gap must be non-negative')
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let settings = await prisma.eventSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await prisma.eventSettings.create({
        data: {
          id: 'default',
          eventStartTime: '13:30',
          musicDuration: 10,
          danceDuration: 10,
          setupGap: 2
        }
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await req.json();
    const validated = settingsSchema.parse(body);

    const updated = await prisma.eventSettings.upsert({
      where: { id: 'default' },
      update: validated,
      create: {
        id: 'default',
        ...validated
      }
    });

    invalidateSettingsCache();

    const { addAuditLog } = await import('@/lib/security');
    addAuditLog(
      'UPDATE_SETTINGS',
      `Admin updated slot timing parameters: Start Time ${validated.eventStartTime}, Music ${validated.musicDuration}m, Dance ${validated.danceDuration}m, Setup Gap ${validated.setupGap}m`,
      validated
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
