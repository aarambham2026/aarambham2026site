const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b110019ffca0f66f14bc';

export interface CloudStoreRecord {
  id: string;
  registrationId: string;
  queuePosition: number;
  teamLeaderName: string;
  rollNo?: string | null;
  department?: string | null;
  year?: string | null;
  format?: string | null;
  numberOfMembers: number;
  eventCategory: string;
  performanceName?: string | null;
  performanceDuration: number;
  slotStartTime: string;
  slotEndTime: string;
  email: string;
  phone: string;
  membersList?: string | null;
  status: string;
  createdAt: string;
}

// In-memory cache for fast serverless responses
let memoryCache: CloudStoreRecord[] = [];
let lastFetchTime = 0;

export async function fetchCloudRegistrations(): Promise<CloudStoreRecord[]> {
  const now = Date.now();
  // Return memory cache if fetched within 2 seconds
  if (memoryCache.length > 0 && now - lastFetchTime < 2000) {
    return memoryCache;
  }

  try {
    const res = await fetch(CLOUD_STORE_URL, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data.registrations)) {
        memoryCache = json.data.registrations;
        lastFetchTime = now;
        return memoryCache;
      }
    }
  } catch (err) {
    console.warn('Cloud store fetch warning:', err);
  }
  return memoryCache;
}

export async function saveCloudRegistration(record: CloudStoreRecord): Promise<CloudStoreRecord[]> {
  try {
    const current = await fetchCloudRegistrations();
    // Prevent duplicates
    const filtered = current.filter((r) => r.registrationId !== record.registrationId);
    const updated = [...filtered, record];
    updated.sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0));

    memoryCache = updated;
    lastFetchTime = Date.now();

    await fetch(CLOUD_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'aarambham_2026_store',
        data: { registrations: updated }
      })
    });
    return updated;
  } catch (err) {
    console.error('Cloud store save error:', err);
    return memoryCache;
  }
}

export async function updateCloudRegistration(
  registrationId: string,
  patchData: Partial<CloudStoreRecord>
): Promise<CloudStoreRecord[]> {
  try {
    const current = await fetchCloudRegistrations();
    const updated = current.map((item) => {
      if (item.registrationId === registrationId) {
        return { ...item, ...patchData };
      }
      return item;
    });

    memoryCache = updated;
    lastFetchTime = Date.now();

    await fetch(CLOUD_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'aarambham_2026_store',
        data: { registrations: updated }
      })
    });
    return updated;
  } catch (err) {
    console.error('Cloud store update error:', err);
    return memoryCache;
  }
}

export async function deleteCloudRegistration(registrationId: string): Promise<CloudStoreRecord[]> {
  try {
    const current = await fetchCloudRegistrations();
    const updated = current.filter((item) => item.registrationId !== registrationId);

    memoryCache = updated;
    lastFetchTime = Date.now();

    await fetch(CLOUD_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'aarambham_2026_store',
        data: { registrations: updated }
      })
    });
    return updated;
  } catch (err) {
    console.error('Cloud store delete error:', err);
    return memoryCache;
  }
}

export async function resetCloudRegistrations(): Promise<void> {
  try {
    memoryCache = [];
    lastFetchTime = Date.now();

    await fetch(CLOUD_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'aarambham_2026_store',
        data: { registrations: [] }
      })
    });
  } catch (err) {
    console.error('Cloud store reset error:', err);
  }
}
