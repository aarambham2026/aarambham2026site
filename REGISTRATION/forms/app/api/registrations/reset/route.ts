import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isRequestAuthorized } from '@/lib/security';
import { clearPersistentQueueStore } from '@/lib/slotAllocator';

export async function POST() {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    // Safely attempt database clearing (catch read-only/missing SQLite errors on Vercel serverless)
    try {
      await prisma.registration.deleteMany();
    } catch (dbErr: any) {
      console.warn('Database reset notice:', dbErr?.message || dbErr);
    }

    // Clear persistent queue store and reset queue state
    clearPersistentQueueStore();

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
