import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateTicketPdf } from '@/lib/ticketGenerator';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    
    let teamLeaderName = url.searchParams.get('name') || 'Participant';
    let numberOfMembers = parseInt(url.searchParams.get('members') || '1', 10);
    let slotStartTime = url.searchParams.get('slotStart') || '2:00 PM';
    let slotEndTime = url.searchParams.get('slotEnd') || '2:15 PM';
    let registrationId = id;
    let eventName = url.searchParams.get('event') || 'CULTURAL EVENT';

    try {
      const reg = await prisma.registration.findFirst({
        where: {
          OR: [
            { registrationId: id },
            { id: id }
          ]
        }
      });

      if (reg) {
        teamLeaderName = reg.teamLeaderName;
        numberOfMembers = reg.numberOfMembers;
        slotStartTime = reg.slotStartTime;
        slotEndTime = reg.slotEndTime;
        registrationId = reg.registrationId;
        eventName = reg.performanceName 
          ? `${reg.eventCategory} (${reg.performanceName.toUpperCase()})` 
          : reg.eventCategory;
      }
    } catch (e) {
      console.warn('Prisma lookup fallback for ticket download:', e);
    }

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
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'ETag': `W/"ticket-${registrationId}"`
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
