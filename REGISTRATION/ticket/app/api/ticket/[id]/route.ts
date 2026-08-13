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

    const pdfBytes = await generateTicketPdf({
      teamLeaderName: reg.teamLeaderName,
      numberOfMembers: reg.numberOfMembers,
      slotStartTime: reg.slotStartTime,
      slotEndTime: reg.slotEndTime,
      registrationId: reg.registrationId
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket-${reg.registrationId}.pdf"`,
        'Cache-Control': 'no-store, max-age=0'
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
