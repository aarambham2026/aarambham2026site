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

    // Permanently delete all registration records from Prisma DB
    try {
      await prisma.registration.deleteMany();
    } catch (dbErr: any) {
      console.warn('Database reset notice:', dbErr?.message || dbErr);
    }

    // Reset 24/7 cloud persistent store
    try {
      await resetCloudRegistrations();
    } catch (cloudErr) {
      console.warn('Cloud store reset warning:', cloudErr);
    }

    // Clear persistent queue store and reset queue state to 0
    clearPersistentQueueStore();

    const { addAuditLog } = await import('@/lib/security');
    addAuditLog('RESET_ALL', 'Admin executed full system reset of all registrations');

    // Remove any reset blocking cookie
    const cookieStore = await cookies();
    cookieStore.delete('aarambham_reset');

    return NextResponse.json({
      success: true,
      message: 'All registrations have been reset successfully.'
    });
  } catch (error: any) {
    console.error('Reset Registrations Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset registrations' },
      { status: 500 }
    );
  }
}
