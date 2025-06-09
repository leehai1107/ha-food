import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function middleware(request: NextRequest) {
  // Only run on /api/auth/me
  if (request.nextUrl.pathname === '/api/auth/me') {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'No token provided'
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      // Add the user info to the request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.accountId.toString());
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid token'
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/auth/me',
}; 