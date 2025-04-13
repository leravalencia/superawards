"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface CheckoutPageProps {
  params: {
    plan: string
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleCheckout = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push('/auth/login')
          return
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const res = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            priceId: getPriceId(params.plan),
            successUrl: `${siteUrl}/dashboard?subscription=success`,
            cancelUrl: `${siteUrl}/checkout/${params.plan}?canceled=true`,
          }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to create checkout session')
        }

        const { url } = await res.json()
        if (url) {
          window.location.href = url
        } else {
          throw new Error('Failed to get checkout URL')
        }
      } catch (error: any) {
        console.error('Checkout error:', error)
        setError(error.message || 'An error occurred during checkout')
      } finally {
        setLoading(false)
      }
    }

    handleCheckout()
  }, [params.plan, router, supabase])

  const getPriceId = (plan: string) => {
    switch (plan) {
      case 'premium':
        return process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
      case 'business':
        return process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID
      default:
        throw new Error('Invalid plan')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Preparing your checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Checkout Error</CardTitle>
            <CardDescription>There was an error processing your checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.push('/pricing')}>
              Back to Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
