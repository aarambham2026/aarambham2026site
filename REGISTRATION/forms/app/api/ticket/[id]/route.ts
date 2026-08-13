import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateTicketPdf } from '@/lib/ticketGenerator';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find registration by registrationId (e.g. EVT-0001) or cuid id
    const reg = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId: id },
          { id: id }
        ]
      }
    });

    if (!reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const displayName = reg.performanceName 
      ? `${reg.eventCategory} (${reg.performanceName.toUpperCase()})` 
      : reg.eventCategory;

    const pdfBytes = await generateTicketPdf({
      teamLeaderName: reg.teamLeaderName,
      numberOfMembers: reg.numberOfMembers,
      slotStartTime: reg.slotStartTime,
      slotEndTime: reg.slotEndTime,
      registrationId: reg.registrationId,
      eventName: displayName
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${reg.registrationId}.pdf"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'ETag': `W/"ticket-${reg.registrationId}"`
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
