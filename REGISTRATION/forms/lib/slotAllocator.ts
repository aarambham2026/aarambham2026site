import { prisma } from './db';

export interface QueueStoreData {
  counter: number;
  lastEndMinutes: number;
  registrations: Record<string, any>;
}

// Backward-compatible stubs (PostgreSQL is the single source of truth)
export function getPersistentQueueStore(): QueueStoreData {
  return { counter: 0, lastEndMinutes: 14 * 60, registrations: {} };
}

export function savePersistentQueueStore(_counter: number, _lastEndMinutes: number, _regData?: any) {
  // No-op
}

export function clearPersistentQueueStore() {
  // No-op
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 14 * 60; // Default 2:00 PM (840 mins)

  const trimmed = timeStr.trim();
  
  // Extract end time if timeStr is a range like "2:38 PM – 2:43 PM"
  const parts = trimmed.split(/[-–—]/);
  const target = parts[parts.length - 1].trim();

  // Handles 12-hour format e.g. "2:10 PM" or "02:10 PM"
  const twelveHourMatch = target.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    let hours = parseInt(twelveHourMatch[1], 10);
    const minutes = parseInt(twelveHourMatch[2], 10);
    const period = twelveHourMatch[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Handles 24-hour format e.g. "14:00"
  const twentyFourMatch = target.match(/^(\d{1,2}):(\d{2})$/);
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

let cachedSettings: {
  eventStartTime: string;
  eventEndTime: string;
  registrationOpen: boolean;
  musicDuration: number;
  danceDuration: number;
  setupGap: number;
} | null = null;

export function invalidateSettingsCache() {
  cachedSettings = null;
}

export async function getEventSettings(dbClient: any = prisma) {
  if (cachedSettings) return cachedSettings;
  try {
    let settings = await dbClient.eventSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await dbClient.eventSettings.create({
        data: {
          id: 'default',
          eventStartTime: '14:00',
          eventEndTime: '17:30',
          registrationOpen: true,
          musicDuration: 10,
          danceDuration: 10,
          setupGap: 2
        }
      });
    }

    cachedSettings = {
      eventStartTime: settings.eventStartTime,
      eventEndTime: settings.eventEndTime || '17:30',
      registrationOpen: settings.registrationOpen ?? true,
      musicDuration: settings.musicDuration,
      danceDuration: settings.danceDuration,
      setupGap: settings.setupGap
    };

    return cachedSettings;
  } catch (e) {
    return {
      eventStartTime: '14:00',
      eventEndTime: '17:30',
      registrationOpen: true,
      musicDuration: 10,
      danceDuration: 10,
      setupGap: 2
    };
  }
}

export async function allocateSlot(
  category: string,
  requestedDuration?: number,
  _clientQueuePos?: number,
  _clientEndMins?: number,
  dbClient: any = prisma
) {
  const settings = await getEventSettings(dbClient);

  if (!settings.registrationOpen) {
    throw new Error('Registration is currently closed by event administration.');
  }

  const categoryUpper = category.toUpperCase();
  const duration = requestedDuration && requestedDuration > 0
    ? requestedDuration
    : (categoryUpper === 'DANCE' ? settings.danceDuration : settings.musicDuration);

  let lastQueuePosition = 0;
  let lastEndMinutes = 0;

  try {
    const previousRegistration = await dbClient.registration.findFirst({
      where: { status: { in: ['REGISTERED', 'SCHEDULED'] } },
      orderBy: { queuePosition: 'desc' },
      select: { slotEndTime: true, queuePosition: true }
    });

    if (previousRegistration) {
      lastQueuePosition = previousRegistration.queuePosition;
      lastEndMinutes = parseTimeToMinutes(previousRegistration.slotEndTime);
    }
  } catch (e) {
    // Database fallback if uninitialized
  }

  let startMinutes: number;
  if (lastQueuePosition === 0) {
    startMinutes = parseTimeToMinutes(settings.eventStartTime);
  } else {
    startMinutes = lastEndMinutes + settings.setupGap;
  }

  const endMinutes = startMinutes + duration;

  // Dynamic Cutoff based on EventSettings.eventEndTime
  const cutoffMinutes = parseTimeToMinutes(settings.eventEndTime);
  if (endMinutes > cutoffMinutes) {
    const formattedCutoff = formatMinutesTo12Hour(cutoffMinutes);
    throw new Error(`All available performance slots up to ${formattedCutoff} have been fully allocated.`);
  }

  const nextQueuePosition = lastQueuePosition + 1;
  const slotStartTime = formatMinutesTo12Hour(startMinutes);
  const slotEndTime = formatMinutesTo12Hour(endMinutes);

  return {
    slotStartTime,
    slotEndTime,
    startMinutes,
    endMinutes,
    nextQueuePosition,
    lastQueuePosition
  };
}
