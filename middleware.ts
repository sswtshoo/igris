import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request });

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  if (!token && pathname !== '/signin') {
    const signInUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (token && pathname === '/signin') {
    const songsUrl = new URL('/songs', request.url);
    return NextResponse.redirect(songsUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
