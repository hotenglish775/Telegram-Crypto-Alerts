import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || 
      req.nextUrl.pathname.startsWith('/alerts') ||
      req.nextUrl.pathname.startsWith('/telegram') ||
      req.nextUrl.pathname.startsWith('/billing') ||
      req.nextUrl.pathname.startsWith('/settings') ||
      req.nextUrl.pathname.startsWith('/admin')) {
    
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Check admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const userRole = session.user.user_metadata?.role || 'user'
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && (req.nextUrl.pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/alerts/:path*',
    '/telegram/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ]
}