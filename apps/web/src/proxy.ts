import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Auth middleware for protecting dashboard routes
 * Uses Better Auth session cookie to check authentication
 */

const publicPaths = [
  '/',
  '/features',
  '/login',
  '/signup',
  '/canvas',  // Public canvas editor
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.includes(pathname) || pathname.startsWith('/invite/')) {
    return NextResponse.next()
  }

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check Better Auth session cookie
  const sessionToken = request.cookies.get('better-auth.session_token')

  if (!sessionToken) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Session exists, allow access
  // Note: API will validate session on each request
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/canvases/:path*',
    '/documents/:path*',
    '/runs/:path*',
    '/workspaces/:path*',
    '/templates/:path*',
  ]
}
