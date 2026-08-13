import fs from 'fs';
import path from 'path';
import os from 'os';
import { prisma } from './db';

const TMP_FILE = path.join(os.tmpdir(), 'onam_serverless_queue.json');

export interface QueueStoreData {
  counter: number;
  lastEndMinutes: number;
  registrations: Record<string, any>;
}

export function getPersistentQueueStore(): QueueStoreData {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (typeof parsed.counter === 'number' && typeof parsed.lastEndMinutes === 'number') {
        return {
          counter: parsed.counter || 0,
          lastEndMinutes: parsed.lastEndMinutes || 14 * 60,
          registrations: parsed.registrations || {},
          isReset: parsed.isReset || false
        } as any;
      }
    }
  } catch (e) {
    // Ignore read errors
  }
  return { counter: 0, lastEndMinutes: 14 * 60, registrations: {} };
}

export function savePersistentQueueStore(counter: number, lastEndMinutes: number, regData?: any) {
  try {
    const store = getPersistentQueueStore();
    const isReset = (store as any).isReset || (globalThis as any).isResetActive;

    if (isReset) {
      store.counter = counter;
      store.lastEndMinutes = lastEndMinutes;
      store.registrations = {};
      delete (store as any).isReset;
      (globalThis as any).isResetActive = false;
    } else {
      store.counter = Math.max(store.counter, counter);
      store.lastEndMinutes = Math.max(store.lastEndMinutes, lastEndMinutes);
    }

    if (regData && regData.registrationId) {
      store.registrations[regData.registrationId] = regData;
    }
    fs.writeFileSync(TMP_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    // Ignore write errors
  }
}

export function clearPersistentQueueStore() {
  try {
    (globalThis as any).isResetActive = true;
    const resetStore = { counter: 0, lastEndMinutes: 14 * 60, registrations: {}, isReset: true };
    fs.writeFileSync(TMP_FILE, JSON.stringify(resetStore, null, 2), 'utf-8');
  } catch (e) {}
}

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
  try {
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
  } catch (e) {
    return {
      eventStartTime: '14:00',
      musicDuration: 10,
      danceDuration: 10,
      setupGap: 2
    };
  }
}

export async function allocateSlot(
  category: string,
  requestedDuration?: number,
  clientQueuePos?: number,
  clientEndMins?: number,
  dbClient: any = prisma
) {
  const settings = await getEventSettings(dbClient);
  const categoryUpper = category.toUpperCase();

  let duration = requestedDuration && requestedDuration > 0
    ? requestedDuration
    : (categoryUpper === 'DANCE' ? settings.danceDuration : settings.musicDuration);

  const store = getPersistentQueueStore();
  const isResetActive = (store as any).isReset || (globalThis as any).isResetActive;

  let lastQueuePosition = 0;
  let lastEndMinutes = 0;

  if (!isResetActive) {
    try {
      const previousRegistration = await dbClient.registration.findFirst({
        where: { status: 'REGISTERED' },
        orderBy: { createdAt: 'desc' },
        select: { slotEndTime: true, queuePosition: true }
      });

      if (previousRegistration) {
        lastQueuePosition = previousRegistration.queuePosition;
        lastEndMinutes = parseTimeToMinutes(previousRegistration.slotEndTime);
      }
    } catch (e) {
      // DB offline fallback
    }
  }

  // If reset is active, IGNORE any previous store counters, client queue positions, and old DB records
  const effectiveStoreCounter = isResetActive ? 0 : store.counter;
  const effectiveStoreEndMins = isResetActive ? 0 : store.lastEndMinutes;
  const effectiveClientQueuePos = isResetActive ? 0 : (clientQueuePos || 0);
  const effectiveClientEndMins = isResetActive ? 0 : (clientEndMins || 0);

  const maxQueuePosition = Math.max(lastQueuePosition, effectiveStoreCounter, effectiveClientQueuePos);
  const maxEndMinutes = Math.max(lastEndMinutes, effectiveStoreEndMins, effectiveClientEndMins);

  let startMinutes: number;
  if (maxQueuePosition === 0) {
    startMinutes = parseTimeToMinutes(settings.eventStartTime); // 14:00 (2:00 PM IST = 840 mins)
  } else {
    startMinutes = maxEndMinutes + settings.setupGap; // setup gap mins
  }

  const endMinutes = startMinutes + duration;

  const CUTOFF_MINUTES = 15 * 60 + 30; // 3:30 PM IST (930 minutes)
  if (endMinutes > CUTOFF_MINUTES) {
    throw new Error('All available performance slots up to 3:30 PM have been fully allocated.');
  }

  const nextQueuePosition = maxQueuePosition + 1;
  const slotStartTime = formatMinutesTo12Hour(startMinutes);
  const slotEndTime = formatMinutesTo12Hour(endMinutes);

  return {
    slotStartTime,
    slotEndTime,
    startMinutes,
    endMinutes,
    nextQueuePosition,
    lastQueuePosition: maxQueuePosition
  };
}
