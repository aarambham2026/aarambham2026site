import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'aarambham2026';

    if (username === validUsername && password === validPassword) {
      const response = NextResponse.json({
        success: true,
        message: 'Admin authentication successful'
      });

      response.cookies.set('aarambham_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
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
      { success: false, error: error.message || 'Login error' },
      { status: 500 }
    );
  }
}
