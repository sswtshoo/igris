import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith('https://') ?? false,
  });

  console.log('Middleware Details:', {
    path: request.nextUrl.pathname,
    hasToken: !!token,
    hasAccessToken: token ? !!token.accessToken : false,
  });

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (!token?.accessToken) {
    if (pathname !== '/signin') {
      console.log('No valid token, redirecting to signin');
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }

  if (token.accessToken && pathname === '/signin') {
    console.log('Valid token on signin, redirecting to songs');
    return NextResponse.redirect(new URL('/songs', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
