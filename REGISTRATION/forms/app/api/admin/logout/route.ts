import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addAuditLog } from '@/lib/security';

async function performLogout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    cookieStore.delete('aarambham_admin_session');
  } catch (e) {
    // Ignore cookieStore deletion errors
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  });

  response.cookies.set('aarambham_admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  });

  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  return response;
}

export async function POST() {
  await addAuditLog('ADMIN_LOGOUT', 'Admin session terminated');
  return performLogout();
}

export async function GET() {
  return performLogout();
}
