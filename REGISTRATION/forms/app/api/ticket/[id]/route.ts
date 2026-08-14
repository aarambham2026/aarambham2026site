import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateTicketPdf } from '@/lib/ticketGenerator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reg = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId: id },
          { id: id }
        ]
      }
    });

    if (!reg) {
      return NextResponse.json(
        { success: false, error: 'Registration not found in database' },
        { status: 404 }
      );
    }

    const teamLeaderName = reg.teamLeaderName;
    const numberOfMembers = reg.numberOfMembers;
    const slotStartTime = reg.slotStartTime;
    const slotEndTime = reg.slotEndTime;
    const registrationId = reg.registrationId;
    const eventName = reg.performanceName 
      ? `${reg.eventCategory} (${reg.performanceName.toUpperCase()})` 
      : reg.eventCategory;

    const pdfBytes = await generateTicketPdf({
      teamLeaderName,
      numberOfMembers,
      slotStartTime,
      slotEndTime,
      registrationId,
      eventName
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${registrationId}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('Ticket generation endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate ticket' },
      { status: 500 }
    );
  }
}
