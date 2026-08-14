import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { isRequestAuthorized, addAuditLog } from '@/lib/security';

export async function POST() {
  try {
    const authorized = await isRequestAuthorized();
    if (!authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    // Permanently delete all registration records from PostgreSQL
    await prisma.registration.deleteMany();

    addAuditLog('RESET_ALL', 'Admin executed permanent system reset of all database registrations');

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
