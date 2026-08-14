import { NextResponse } from 'next/server';
import { addAuditLog } from '@/lib/security';

export async function POST() {
  await addAuditLog('ADMIN_LOGOUT', 'Admin session terminated');

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
