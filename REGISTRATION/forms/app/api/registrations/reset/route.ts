import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { isRequestAuthorized } from '@/lib/security';
import { clearPersistentQueueStore } from '@/lib/slotAllocator';
import { resetCloudRegistrations } from '@/lib/cloudStore';

export async function POST() {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    // 1. Permanently delete all registration records from Prisma DB
    try {
      await prisma.registration.deleteMany();
    } catch (dbErr: any) {
      console.warn('Prisma DB reset warning:', dbErr?.message || dbErr);
    }

    // 2. Permanently delete all records from 24/7 Cloud Store
    try {
      await resetCloudRegistrations();
    } catch (cloudErr) {
      console.warn('Cloud store reset warning:', cloudErr);
    }

    // 3. Reset persistent queue store counters to 0
    clearPersistentQueueStore();

    // 4. Add Audit Log entry for the reset action
    const { addAuditLog } = await import('@/lib/security');
    addAuditLog('RESET_ALL', 'Admin executed permanent system reset of all database and cloud registrations');

    // 5. Remove any lingering reset blocking cookie
    const cookieStore = await cookies();
    cookieStore.delete('aarambham_reset');

    return NextResponse.json({
      success: true,
      message: 'All registrations and database records have been permanently deleted.'
    });
  } catch (error: any) {
    console.error('Reset Registrations Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset database registrations' },
      { status: 500 }
    );
  }
}
