const KVDB_URL = 'https://kvdb.io/2stKqCptjpPySco2fWozui/registrations';

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

export async function fetchCloudRegistrations(): Promise<CloudStoreRecord[]> {
  try {
    const res = await fetch(KVDB_URL, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) {
        return json;
      }
    }
  } catch (err) {
    console.warn('Cloud store fetch warning:', err);
  }
  return [];
}

export async function saveCloudRegistration(record: CloudStoreRecord): Promise<CloudStoreRecord[]> {
  try {
    const current = await fetchCloudRegistrations();
    const filtered = current.filter((r) => r.registrationId !== record.registrationId);
    const updated = [...filtered, record];
    updated.sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0));

    await fetch(KVDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    return updated;
  } catch (err) {
    console.error('Cloud store save error:', err);
    return [];
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

    await fetch(KVDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    return updated;
  } catch (err) {
    console.error('Cloud store update error:', err);
    return [];
  }
}

export async function deleteCloudRegistration(registrationId: string): Promise<CloudStoreRecord[]> {
  try {
    const current = await fetchCloudRegistrations();
    const updated = current.filter((item) => item.registrationId !== registrationId);

    await fetch(KVDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    return updated;
  } catch (err) {
    console.error('Cloud store delete error:', err);
    return [];
  }
}

export async function resetCloudRegistrations(): Promise<void> {
  try {
    await fetch(KVDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    });
  } catch (err) {
    console.error('Cloud store reset error:', err);
  }
}
