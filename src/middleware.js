import { NextResponse } from 'next/server';

export function middleware(request) {
  // Define public routes that authenticated users shouldn't visit (like login/setup pages)
  // "/" is usually your login page based on your code structure
  const publicAuthRoutes = [
    '/',
    '/verify-email',
    '/verification-code',
    '/new-password',
    '/password-successfully',
  ];

  // Routes that start with these prefixes are also public
  const publicAuthPrefixes = ['/signup'];

  const protectedRoutes = [
    '/dashboard',
    '/accounts',
    '/profit-sharing',
    '/contact-us',
    '/faqs',
    '/tutorials',
    '/economic-Calendar',
    '/transactions',
    '/introducing-broker',
    '/recommended-broker',
  ];

  const token = request.cookies.get('auth_user')?.value;
  const { pathname } = request.nextUrl;

  // Check if the current route starts with any of our protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Exact match for public auth routes (login, signup, etc.)
  const isPublicAuthRoute =
    publicAuthRoutes.includes(pathname) ||
    publicAuthPrefixes.some((prefix) => pathname.startsWith(prefix));

  // 1. If user doesn't have a token, but tries to access private routes
  if (!token && isProtectedRoute) {
    // Redirect them to login
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. If user DOES have a token, but tries to access login/signup
  if (token && isPublicAuthRoute) {
    // Redirect them directly to their dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all paths except for static assets, Next.js internal files, and APIs
     * (We exclude API routes since they might have their own token validation logic)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|sitemap.xml|robots.txt).*)',
  ],
};
