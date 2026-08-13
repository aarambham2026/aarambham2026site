import { prisma } from './db';

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 14 * 60; // Default 2:00 PM (840 mins)

  const trimmed = timeStr.trim();
  
  // Handles 12-hour format e.g. "2:10 PM" or "02:10 PM"
  const twelveHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    let hours = parseInt(twelveHourMatch[1], 10);
    const minutes = parseInt(twelveHourMatch[2], 10);
    const period = twelveHourMatch[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Handles 24-hour format e.g. "14:00"
  const twentyFourMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourMatch) {
    const hours = parseInt(twentyFourMatch[1], 10);
    const minutes = parseInt(twentyFourMatch[2], 10);
    return hours * 60 + minutes;
  }

  return 14 * 60;
}

export function formatMinutesTo12Hour(totalMinutes: number): string {
  const normalizedMinutes = totalMinutes % (24 * 60);
  let hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutesStr} ${period}`;
}

// In-memory settings cache to avoid DB reads on every registration
let cachedSettings: {
  eventStartTime: string;
  musicDuration: number;
  danceDuration: number;
  setupGap: number;
} | null = null;

export function invalidateSettingsCache() {
  cachedSettings = null;
}

export async function getEventSettings(dbClient: any = prisma) {
  if (cachedSettings) return cachedSettings;
  let settings = await dbClient.eventSettings.findUnique({
    where: { id: 'default' }
  });

  if (!settings) {
    settings = await dbClient.eventSettings.create({
      data: {
        id: 'default',
        eventStartTime: '14:00',
        musicDuration: 10,
        danceDuration: 10,
        setupGap: 2
      }
    });
  }

  cachedSettings = {
    eventStartTime: settings.eventStartTime,
    musicDuration: settings.musicDuration,
    danceDuration: settings.danceDuration,
    setupGap: settings.setupGap
  };

  return cachedSettings;
}

export async function allocateSlot(category: string, requestedDuration?: number, dbClient: any = prisma) {
  const settings = await getEventSettings(dbClient);
  const categoryUpper = category.toUpperCase();

  // Find the last active registration in a single fast query
  const previousRegistration = await dbClient.registration.findFirst({
    where: {
      status: 'REGISTERED'
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      slotEndTime: true,
      queuePosition: true
    }
  });

  let startMinutes: number;
  if (!previousRegistration) {
    startMinutes = parseTimeToMinutes(settings.eventStartTime);
  } else {
    const prevEndMinutes = parseTimeToMinutes(previousRegistration.slotEndTime);
    startMinutes = prevEndMinutes + settings.setupGap;
  }

  let duration = requestedDuration && requestedDuration > 0
    ? requestedDuration
    : (categoryUpper === 'DANCE' ? settings.danceDuration : settings.musicDuration);

  const endMinutes = startMinutes + duration;

  const slotStartTime = formatMinutesTo12Hour(startMinutes);
  const slotEndTime = formatMinutesTo12Hour(endMinutes);

  return {
    slotStartTime,
    slotEndTime,
    startMinutes,
    endMinutes,
    lastQueuePosition: previousRegistration ? previousRegistration.queuePosition : 0
  };
}
