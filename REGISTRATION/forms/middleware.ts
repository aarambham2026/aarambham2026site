import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-Side Access Protection for /registration & /registrations routes
 *
 * Target Opening Instant: 18 August 2026 at 9:25 PM IST (Asia/Kolkata / UTC+05:30)
 * ISO 8601 String: 2026-08-18T21:25:00+05:30
 * Unix Epoch Timestamp: 1787068500000 ms UTC
 */
const REGISTRATION_OPENING_TIMESTAMP_MS = new Date('2026-08-18T21:25:00+05:30').getTime();

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

  // 2. Protect /registration and /registrations before 18 Aug 2026 9:25 PM IST
  if (normalizedPath === '/registration' || normalizedPath === '/registrations') {
    const currentServerTimeMs = Date.now();

    // BEFORE 18 Aug 2026, 9:25 PM IST -> Return HTTP 403 Forbidden
    if (currentServerTimeMs < REGISTRATION_OPENING_TIMESTAMP_MS) {
      return new NextResponse('Registrations are temporarily unavailable.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      });
    }
  }

  // AT or AFTER 18 Aug 2026, 9:25 PM IST (or any other route) -> Proceed normally
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
