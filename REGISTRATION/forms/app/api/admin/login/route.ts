import { NextResponse } from 'next/server';
import { createAdminToken, timingSafeCompare, addAuditLog, checkLoginRateLimit } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous_ip';
    const rateCheck = checkLoginRateLimit(clientIp, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'aarambham2026';

    const isUserValid = timingSafeCompare(String(username || ''), expectedUser);
    const isPassValid = timingSafeCompare(String(password || ''), expectedPass);

    if (isUserValid && isPassValid) {
      const secureToken = createAdminToken();
      if (!secureToken) {
        return NextResponse.json(
          { success: false, error: 'Admin JWT configuration failure' },
          { status: 500 }
        );
      }

      await addAuditLog('ADMIN_LOGIN', `Admin user logged in successfully from IP: ${clientIp}`, { username });

      const response = NextResponse.json({
        success: true,
        token: secureToken,
        message: 'Admin authentication successful'
      });

      response.cookies.set('admin_session', secureToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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
