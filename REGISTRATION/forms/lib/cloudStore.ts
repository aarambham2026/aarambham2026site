import { prisma } from './db';

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
    const dbRecords = await prisma.registration.findMany({
      orderBy: { queuePosition: 'asc' }
    });
    return dbRecords.map((r) => ({
      id: r.id,
      registrationId: r.registrationId,
      queuePosition: r.queuePosition,
      teamLeaderName: r.teamLeaderName,
      rollNo: r.rollNo,
      department: r.department,
      year: r.year,
      format: r.format,
      numberOfMembers: r.numberOfMembers,
      eventCategory: r.eventCategory,
      performanceName: r.performanceName,
      performanceDuration: r.performanceDuration,
      slotStartTime: r.slotStartTime,
      slotEndTime: r.slotEndTime,
      email: r.email,
      phone: r.phone,
      membersList: r.membersList,
      status: r.status,
      createdAt: r.createdAt.toISOString()
    }));
  } catch (err) {
    console.warn('PostgreSQL fetch error in cloudStore:', err);
    return [];
  }
}

export async function saveCloudRegistration(record: CloudStoreRecord): Promise<CloudStoreRecord[]> {
  try {
    await prisma.registration.upsert({
      where: { registrationId: record.registrationId },
      update: {
        teamLeaderName: record.teamLeaderName,
        rollNo: record.rollNo,
        department: record.department,
        year: record.year,
        format: record.format,
        numberOfMembers: record.numberOfMembers,
        eventCategory: record.eventCategory,
        performanceName: record.performanceName,
        performanceDuration: record.performanceDuration,
        slotStartTime: record.slotStartTime,
        slotEndTime: record.slotEndTime,
        email: record.email,
        phone: record.phone,
        membersList: record.membersList,
        queuePosition: record.queuePosition,
        status: record.status
      },
      create: {
        registrationId: record.registrationId,
        teamLeaderName: record.teamLeaderName,
        rollNo: record.rollNo || 'N/A',
        department: record.department || 'N/A',
        year: record.year || 'N/A',
        format: record.format || 'SOLO',
        numberOfMembers: record.numberOfMembers,
        eventCategory: record.eventCategory,
        performanceName: record.performanceName,
        performanceDuration: record.performanceDuration,
        slotStartTime: record.slotStartTime,
        slotEndTime: record.slotEndTime,
        email: record.email,
        phone: record.phone,
        membersList: record.membersList || '',
        queuePosition: record.queuePosition,
        status: record.status || 'REGISTERED'
      }
    });
  } catch (err) {
    console.error('PostgreSQL save error in cloudStore:', err);
  }
  return fetchCloudRegistrations();
}

export async function updateCloudRegistration(
  registrationId: string,
  patchData: Partial<CloudStoreRecord>
): Promise<CloudStoreRecord[]> {
  try {
    const existing = await prisma.registration.findFirst({
      where: { OR: [{ registrationId }, { id: registrationId }] }
    });
    if (existing) {
      await prisma.registration.update({
        where: { id: existing.id },
        data: patchData as any
      });
    }
  } catch (err) {
    console.error('PostgreSQL update error in cloudStore:', err);
  }
  return fetchCloudRegistrations();
}

export async function deleteCloudRegistration(registrationId: string): Promise<CloudStoreRecord[]> {
  try {
    const existing = await prisma.registration.findFirst({
      where: { OR: [{ registrationId }, { id: registrationId }] }
    });
    if (existing) {
      await prisma.registration.delete({ where: { id: existing.id } });
    }
  } catch (err) {
    console.error('PostgreSQL delete error in cloudStore:', err);
  }
  return fetchCloudRegistrations();
}

export async function resetCloudRegistrations(): Promise<void> {
  try {
    await prisma.registration.deleteMany();
  } catch (err) {
    console.error('PostgreSQL reset error in cloudStore:', err);
  }
}
