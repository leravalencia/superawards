import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard' // Default redirect to dashboard

  console.log('Auth callback received:', { code, origin, next })

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`)

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

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Auth exchange result:', { error })
    
    if (!error) {
      // After successful authentication, redirect to dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
} 