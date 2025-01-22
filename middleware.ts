import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  if (token?.accessToken && pathname === '/signin') {
    const response = NextResponse.redirect(new URL('/songs', request.url));
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  if (!token?.accessToken && pathname !== '/signin') {
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
