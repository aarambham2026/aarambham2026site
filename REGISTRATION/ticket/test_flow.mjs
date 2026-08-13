import { PrismaClient } from '@prisma/client';
import { allocateSlot } from './lib/slotAllocator.ts';
import { generateTicketPdf } from './lib/ticketGenerator.ts';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runTests() {
  console.log('--- STARTING SYSTEM INTEGRATION TESTS ---');

  // Clean DB before test
  await prisma.registration.deleteMany();
  await prisma.eventSettings.deleteMany();

  // Initialize Default Settings
  await prisma.eventSettings.create({
    data: {
      id: 'default',
      eventStartTime: '14:00',
      musicDuration: 10,
      danceDuration: 10,
      setupGap: 2
    }
  });

  const testCases = [
    { teamLeaderName: 'Kashi Nath', numberOfMembers: 4, eventCategory: 'MUSIC', email: 'kashi@uni.edu', phone: '9876543210' },
    { teamLeaderName: 'Test User 2', numberOfMembers: 3, eventCategory: 'MUSIC', email: 'user2@uni.edu', phone: '9876543211' },
    { teamLeaderName: 'Test User 3', numberOfMembers: 5, eventCategory: 'MUSIC', email: 'user3@uni.edu', phone: '9876543212' },
  ];

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const queuePosition = i + 1;
    const registrationId = `EVT-${String(queuePosition).padStart(4, '0')}`;

    const slot = await allocateSlot(tc.eventCategory, prisma);

    const created = await prisma.registration.create({
      data: {
        registrationId,
        teamLeaderName: tc.teamLeaderName,
        numberOfMembers: tc.numberOfMembers,
        eventCategory: tc.eventCategory,
        email: tc.email,
        phone: tc.phone,
        queuePosition,
        slotStartTime: slot.slotStartTime,
        slotEndTime: slot.slotEndTime,
        status: 'REGISTERED'
      }
    });

    results.push(created);

    console.log(`Test ${i + 1}: Leader=${created.teamLeaderName}, RegID=${created.registrationId}, Slot=${created.slotStartTime} - ${created.slotEndTime}`);

    // Generate PDF Ticket
    const pdfBytes = await generateTicketPdf({
      teamLeaderName: created.teamLeaderName,
      numberOfMembers: created.numberOfMembers,
      slotStartTime: created.slotStartTime,
      slotEndTime: created.slotEndTime,
      registrationId: created.registrationId
    });

    const testPdfPath = path.join(process.cwd(), 'scratch', `test_ticket_${created.registrationId}.pdf`);
    if (!fs.existsSync(path.join(process.cwd(), 'scratch'))) {
      fs.mkdirSync(path.join(process.cwd(), 'scratch'), { recursive: true });
    }
    fs.writeFileSync(testPdfPath, pdfBytes);
    console.log(`Saved generated ticket PDF to ${testPdfPath}`);
  }

  // Assertions
  console.log('\n--- VERIFYING TEST RESULTS ---');
  if (results[0].slotStartTime === '2:00 PM' && results[0].slotEndTime === '2:10 PM') {
    console.log('✅ Test 1 Slot PASSED (2:00 PM - 2:10 PM)');
  } else {
    console.error(`❌ Test 1 Slot FAILED: Got ${results[0].slotStartTime} - ${results[0].slotEndTime}`);
  }

  if (results[1].slotStartTime === '2:12 PM' && results[1].slotEndTime === '2:22 PM') {
    console.log('✅ Test 2 Slot PASSED (2:12 PM - 2:22 PM)');
  } else {
    console.error(`❌ Test 2 Slot FAILED: Got ${results[1].slotStartTime} - ${results[1].slotEndTime}`);
  }

  if (results[2].slotStartTime === '2:24 PM' && results[2].slotEndTime === '2:34 PM') {
    console.log('✅ Test 3 Slot PASSED (2:24 PM - 2:34 PM)');
  } else {
    console.error(`❌ Test 3 Slot FAILED: Got ${results[2].slotStartTime} - ${results[2].slotEndTime}`);
  }

  await prisma.$disconnect();
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
