import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE } from '@/constants';

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // ✅ If logged in and trying to access login page → redirect to dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ❌ If not logged in and trying to access protected routes → redirect to login
  if (!token && pathname.startsWith('/') && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Otherwise, continue to the requested page
  return NextResponse.next();
}

/**
 * Apply this proxy only to routes that need protection or auth-based redirects.
 */
export const config = {
  matcher: [
    '/login', // intercept login route
    '/:path*', // protect dashboard and subroutes
  ],
};
