import { NextResponse } from 'next/server';
import { isRequestAuthorized } from '@/lib/security';

export async function GET() {
  const authorized = await isRequestAuthorized();
  if (authorized) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
