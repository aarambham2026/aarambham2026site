import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isRequestAuthorized, addAuditLog } from '@/lib/security';

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId: id },
          { id: id }
        ]
      }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Registration record not found' }, { status: 404 });
    }

    const updated = await prisma.registration.update({
      where: { id: existing.id },
      data: { status: 'CANCELLED' }
    });

    addAuditLog('CANCEL_REGISTRATION', `Admin cancelled registration ${id}`);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
