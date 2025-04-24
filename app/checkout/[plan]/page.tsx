"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage({ params }: { params: { plan: string } }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { plan } = params

  useEffect(() => {
    // If URL has a success parameter, show a success message
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      // Handle success
    }
    
    if (query.get('canceled')) {
      setError('Payment canceled. Please try again.')
    }
  }, [])

  const handleCheckout = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get price ID based on plan
      let priceId
      switch (plan.toLowerCase()) {
        case 'premium':
          priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
          break
        case 'business':
          priceId = process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID
          break
        default:
          throw new Error('Invalid plan selected')
      }

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'An error occurred during checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Complete Your Subscription
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You're signing up for the {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>
              Click the button below to proceed to secure payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 text-sm text-red-600">
                {error}
              </div>
            )}
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}