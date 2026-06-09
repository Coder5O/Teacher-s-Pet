/**
 * Next.js Middleware — protects routes requiring authentication.
 * Runs on the server edge before each page request.
 * Redirects unauthenticated users to /login.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/lesson-planner',
  '/worksheet',
  '/assessment',
  '/rubric',
  '/comments',
  '/quiz',
  '/unit-planner',
  '/curriculum',
  '/resources',
  '/assistant',
  '/files',
  '/calendar',
  '/analytics',
  '/billing',
  '/settings',
  '/admin',
  '/onboarding',
];

// Routes only for authenticated users who should NOT see (auth pages)
const AUTH_ROUTES = ['/login', '/signup', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for our custom auth cookie (set after Firebase login)
  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!authToken;

  // If trying to access a protected route without auth — redirect to login
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and trying to access auth pages — redirect to dashboard
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
