import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    // Clear all registration records from SQLite database
    await prisma.registration.deleteMany();

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
