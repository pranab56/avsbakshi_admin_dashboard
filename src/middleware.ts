import { NextRequest, NextResponse } from 'next/server';

/**
 * Safely decodes JWT payload in Edge runtime using atob.
 */
const decodeJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload) as { exp?: number; role?: string; id?: string };
  } catch {
    return null;
  }
};

/**
 * Helper to determine if the path is a public authentication route.
 */
const isPublicAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith('/auth') || pathname === '/login' || pathname === '/register';
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle legacy /login route by forwarding to /auth/login
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Retrieve authentication token from cookies
  const token =
    request.cookies.get('salon-admin-token')?.value ||
    request.cookies.get('realState-token')?.value;

  let isValidSession = false;

  if (token && token.trim() !== '') {
    const payload = decodeJwt(token);
    if (payload) {
      if (payload.exp) {
        // Expiration is in seconds, Date.now() is in milliseconds
        isValidSession = payload.exp * 1000 > Date.now();
      } else {
        isValidSession = true;
      }
    } else {
      // Fallback for non-JWT string tokens
      isValidSession = true;
    }
  }

  const isAuth = isPublicAuthRoute(pathname);

  // 1. If user is NOT authenticated and trying to access a protected route -> Redirect to /auth/login
  if (!isValidSession && !isAuth) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user IS authenticated and trying to access an auth route (e.g. /auth/login) -> Redirect to main dashboard (/)
  if (isValidSession && isAuth) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes (/api/*)
     * 2. /_next (Next.js internals & static assets)
     * 3. Static files (favicon.ico, images, icons, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
