import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-Side Access Protection & Time Window Enforcement for /registration & /registrations routes
 *
 * Registration Window (Asia/Kolkata / IST / UTC+05:30):
 * - ALLOWED: 1:30 PM IST (13:30:00) to 3:59:59 PM IST (15:59:59)
 * - BLOCKED: Before 1:30 PM IST or at/after 4:00 PM IST (16:00:00)
 */
function isRegistrationAllowed(nowMs: number = Date.now()): boolean {
  const istDateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(new Date(nowMs));

  const parts = istDateStr.split(':').map(Number);
  const hour = parts[0];
  const minute = parts[1];
  const second = parts[2];

  const secondsInDay = hour * 3600 + minute * 60 + second;
  const startSecondsInDay = 13 * 3600 + 30 * 60; // 13:30:00 IST (1:30 PM IST)
  const endSecondsInDay = 16 * 3600;            // 16:00:00 IST (4:00 PM IST)

  return secondsInDay >= startSecondsInDay && secondsInDay < endSecondsInDay;
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
