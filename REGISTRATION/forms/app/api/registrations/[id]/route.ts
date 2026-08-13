import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
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
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
