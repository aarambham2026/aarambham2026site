import { NextResponse } from 'next/server';
import { isRequestAuthorized } from '@/lib/security';

export async function GET() {
  const authorized = await isRequestAuthorized();
  if (authorized) {
    return NextResponse.json(
      { authenticated: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      }
    );
  }
  return NextResponse.json(
    { authenticated: false },
    {
      status: 401,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    }
  );
}
