import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

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
            response.cookies.set({
              name,
              value,
              ...options,
              // Add these options for better security in production
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              domain: process.env.NODE_ENV === 'production' 
                ? '.vercel.app' // Adjust this to your domain
                : undefined
            })
          },
          remove(name: string, options: CookieOptions) {
            console.log(`Removing cookie ${name}`)
            response.cookies.set({
              name,
              value: '',
              ...options,
              secure: true,
              sameSite: 'none',
              path: '/',
              // Remove domain restriction
              domain: undefined
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Auth exchange result:', { error })
    
    if (!error) {
      return response
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 