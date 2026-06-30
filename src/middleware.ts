import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/paciente", "/doctor", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get("_session")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/paciente/:path*", "/doctor/:path*", "/admin/:path*"],
};
