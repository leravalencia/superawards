import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          console.log(`Getting cookie ${name}:`, cookie?.value)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`Setting cookie ${name}:`, value)
          // Get the site URL from environment variable
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          const domain = new URL(siteUrl).hostname
          
          response.cookies.set({
            name,
            value,
            ...options,
            secure: true,
            sameSite: 'lax',
            path: '/',
            // Set domain only in production
            domain: process.env.NODE_ENV === 'production' ? domain : undefined,
            httpOnly: true
          })
        },
        remove(name: string, options: CookieOptions) {
          console.log(`Removing cookie ${name}`)
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          const domain = new URL(siteUrl).hostname
          
          response.cookies.set({
            name,
            value: '',
            ...options,
            secure: true,
            sameSite: 'lax',
            path: '/',
            // Set domain only in production
            domain: process.env.NODE_ENV === 'production' ? domain : undefined,
            httpOnly: true
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  console.log('Session in middleware:', session)

  // If user is signed in and the current path is / redirect the user to /dashboard
  if (session && request.nextUrl.pathname === "/") {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // If user is not signed in and the current path is /dashboard redirect the user to /auth/login
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}