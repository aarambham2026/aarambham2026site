import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isRequestAuthorized } from '@/lib/security';
import { updateCloudRegistration } from '@/lib/cloudStore';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { id } = await params;

    let updated = null;
    try {
      const existing = await prisma.registration.findFirst({
        where: {
          OR: [
            { registrationId: id },
            { id: id }
          ]
        }
      });

      if (existing) {
        updated = await prisma.registration.update({
          where: { id: existing.id },
          data: { status: 'CANCELLED' }
        });
      }
    } catch (e) {}

    // Update status in Cloud persistent store
    try {
      await updateCloudRegistration(id, { status: 'CANCELLED' });
    } catch (cloudErr) {
      console.warn('Cloud cancel warning:', cloudErr);
    }

    return NextResponse.json({ success: true, data: updated || { registrationId: id, status: 'CANCELLED' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
