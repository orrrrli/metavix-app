import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/paciente', '/doctor'];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has('_session');
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/paciente/:path*', '/doctor/:path*'],
};
