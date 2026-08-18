import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-Side Access Protection & Time Window Enforcement for /registration & /registrations routes
 *
 * Registration Opening Instant (Asia/Kolkata / IST / UTC+05:30):
 * - OPENING TIME: 18 August 2026, 9:00 PM IST (2026-08-18T21:00:00+05:30)
 * - BLOCKED: Before 2026-08-18 21:00:00 IST
 * - OPEN: At and after 2026-08-18 21:00:00 IST
 */
function isRegistrationAllowed(nowMs: number = Date.now()): boolean {
  const openingInstantMs = new Date('2026-08-18T21:00:00+05:30').getTime();
  return nowMs >= openingInstantMs;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalizedPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';

  // 1. Explicitly BLOCK legacy /registration/admin and /admin URLs with HTTP 404
  if (
    normalizedPath === '/registration/admin' ||
    normalizedPath === '/admin' ||
    normalizedPath.startsWith('/registration/admin/') ||
    normalizedPath.startsWith('/admin/')
  ) {
    return new NextResponse('This page could not be found.', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  }

  // 2. Protect /registration and /registrations with IST 1:30 PM -> 4:00 PM window gate
  if (normalizedPath === '/registration' || normalizedPath === '/registrations') {
    if (!isRegistrationAllowed()) {
      return new NextResponse('Registrations are temporarily unavailable.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/registration',
    '/registration/',
    '/registrations',
    '/registrations/',
    '/registration/admin',
    '/registration/admin/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
