import { NextResponse } from 'next/server';
import { createAdminToken, timingSafeCompare } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'aarambham2026';

    const isUserValid = timingSafeCompare(String(username || ''), validUsername);
    const isPassValid = timingSafeCompare(String(password || ''), validPassword);

    if (isUserValid && isPassValid) {
      const response = NextResponse.json({
        success: true,
        message: 'Admin authentication successful'
      });

      const secureToken = createAdminToken();

      response.cookies.set('admin_session', secureToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin username or password' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
