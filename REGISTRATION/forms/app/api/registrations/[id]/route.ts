import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId: id },
          { id: id }
        ]
      }
    });

    if (!registration) {
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isRequestAuthorized, addAuditLog, sanitizeInput } = await import('@/lib/security');

    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const sanitizedData: any = {};
    if (body.teamLeaderName) sanitizedData.teamLeaderName = sanitizeInput(body.teamLeaderName);
    if (body.rollNo) sanitizedData.rollNo = sanitizeInput(body.rollNo);
    if (body.department) sanitizedData.department = sanitizeInput(body.department);
    if (body.year) sanitizedData.year = sanitizeInput(body.year);
    if (body.eventCategory) sanitizedData.eventCategory = sanitizeInput(body.eventCategory).toUpperCase();
    if (body.performanceName) sanitizedData.performanceName = sanitizeInput(body.performanceName);
    if (body.format) sanitizedData.format = sanitizeInput(body.format).toUpperCase();
    if (body.numberOfMembers !== undefined) sanitizedData.numberOfMembers = Number(body.numberOfMembers);
    if (body.slotStartTime) sanitizedData.slotStartTime = sanitizeInput(body.slotStartTime);
    if (body.slotEndTime) sanitizedData.slotEndTime = sanitizeInput(body.slotEndTime);
    if (body.email) sanitizedData.email = sanitizeInput(body.email).toLowerCase();
    if (body.phone) sanitizedData.phone = sanitizeInput(body.phone);
    if (body.status) sanitizedData.status = sanitizeInput(body.status).toUpperCase();

    const existing = await prisma.registration.findFirst({
      where: { OR: [{ registrationId: id }, { id: id }] }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Registration record not found' }, { status: 404 });
    }

    const updatedDb = await prisma.registration.update({
      where: { id: existing.id },
      data: sanitizedData
    });

    const name = sanitizedData.teamLeaderName || id;
    addAuditLog('EDIT_REGISTRATION', `Admin updated participant ${id} (${name})`, sanitizedData);

    return NextResponse.json({ success: true, data: updatedDb });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isRequestAuthorized, addAuditLog } = await import('@/lib/security');

    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.registration.findFirst({
      where: { OR: [{ registrationId: id }, { id: id }] }
    });

    if (existing) {
      await prisma.registration.delete({ where: { id: existing.id } });
    }

    addAuditLog('CANCEL_REGISTRATION', `Admin deleted registration record ${id}`);

    return NextResponse.json({ success: true, message: `Registration ${id} deleted` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
