import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = request.nextUrl;

  console.log({
    path: pathname,
    hasToken: !!token,
    search,
    fullUrl: request.url,
  });

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (!token && pathname !== '/signin') {
    console.log('Redirecting to signin - No token');
    const url = new URL('/signin', request.url);
    return NextResponse.redirect(url);
  }

  if (token && pathname === '/signin') {
    console.log('Redirecting to songs - Has token');
    const url = new URL('/songs', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
