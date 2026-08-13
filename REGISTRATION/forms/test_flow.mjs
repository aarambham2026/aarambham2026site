import { PrismaClient } from '@prisma/client';
import { allocateSlot } from './lib/slotAllocator.ts';
import { generateTicketPdf } from './lib/ticketGenerator.ts';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runTests() {
  console.log('=== VERIFYING TICKET GENERATION & SLOT ALLOCATION ===\n');

  // Get or create default settings without deleting existing registrations
  let settings = await prisma.eventSettings.findUnique({ where: { id: 'default' } });
  if (!settings) {
    settings = await prisma.eventSettings.create({
      data: {
        id: 'default',
        eventStartTime: '14:00',
        musicDuration: 10,
        danceDuration: 10,
        setupGap: 2
      }
    });
  }

  // Allocate sample slot to verify allocation logic
  const sampleSlot = await allocateSlot('MUSIC', 5, prisma);
  console.log(`Sample Slot Allocation: ${sampleSlot.slotStartTime} - ${sampleSlot.slotEndTime}`);

  // Generate sample PDF Ticket
  const pdfBytes = await generateTicketPdf({
    teamLeaderName: 'Gautham Suresh',
    numberOfMembers: 1,
    slotStartTime: sampleSlot.slotStartTime,
    slotEndTime: sampleSlot.slotEndTime,
    registrationId: 'EVT-TEST',
    eventName: 'MUSIC'
  });

  const scratchDir = path.join(process.cwd(), 'scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }
  const testPdfPath = path.join(scratchDir, `sample_ticket_test.pdf`);
  fs.writeFileSync(testPdfPath, pdfBytes);
  console.log(`✅ Saved sample ticket PDF to ${testPdfPath}`);

  await prisma.$disconnect();
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
