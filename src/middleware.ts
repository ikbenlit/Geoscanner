import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|login).*)',
  ],
  runtime: 'nodejs'
};

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  // Redirect naar login als er geen sessie is
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
} 