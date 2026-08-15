const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.eventSettings.upsert({
    where: { id: 'default' },
    update: { eventEndTime: '16:00' },
    create: {
      id: 'default',
      eventStartTime: '14:00',
      eventEndTime: '16:00',
      registrationOpen: true,
      musicDuration: 10,
      danceDuration: 10,
      setupGap: 2
    }
  });
  console.log('Successfully updated EventSettings:', settings);
}

main()
  .catch((e) => {
    console.error('Error updating EventSettings:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
