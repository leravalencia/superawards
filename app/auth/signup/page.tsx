"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { loadStripe } from '@stripe/stripe-js'
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Initialize Stripe
let stripePromise: Promise<any> | null = null
const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.error('Stripe publishable key is not defined')
      return null
    }
    try {
      stripePromise = loadStripe(publishableKey)
    } catch (error) {
      console.error('Failed to load Stripe:', error)
      return null
    }
  }
  return stripePromise
}

interface PricingTier {
  title: string
  description: string
  price: string
  features: string[]
  priceId: string
  isPopular?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    title: "Free",
    description: "Perfect for getting started",
    price: "$0",
    features: [
      "5 awards per month",
      "Basic templates",
      "Email support",
      "Community access"
    ],
    priceId: ""
  },
  {
    title: "Premium",
    description: "Best for growing teams",
    price: "$29",
    features: [
      "Unlimited awards",
      "Premium templates",
      "Priority support",
      "Custom branding",
      "Analytics dashboard"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    isPopular: true
  },
  {
    title: "Business",
    description: "For large organizations",
    price: "$99",
    features: [
      "Everything in Premium",
      "Team management",
      "API access",
      "Custom integrations",
      "Dedicated support"
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!
  }
]

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState<PricingTier>(pricingTiers[0])
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const supabase = createClient()

  // Set initial tier based on URL parameter
  useState(() => {
    if (plan) {
      const tier = pricingTiers.find(t => t.title.toLowerCase() === plan.toLowerCase())
      if (tier) setSelectedTier(tier)
    }
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      
      // First, sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            plan: selectedTier.title.toLowerCase()
          }
        },
      })

      if (signUpError) throw signUpError

      // If it's a free plan, just show success message
      if (!selectedTier.priceId) {
        setError("Check your email for the confirmation link!")
        router.push('/auth/login')
        return
      }

      // For paid plans, create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedTier.priceId,
          email,
          successUrl: `${siteUrl}/dashboard?subscription=success`,
          cancelUrl: `${siteUrl}/auth/signup?canceled=true`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const stripe = await getStripe()
      
      if (!stripe) {
        throw new Error('Failed to load Stripe. Please try again later.')
      }

      // Redirect to Stripe checkout
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      
      if (stripeError) {
        throw stripeError
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your plan and start your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.title}
              className={`cursor-pointer transition-all ${
                selectedTier.title === tier.title 
                  ? 'ring-2 ring-indigo-600' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedTier(tier)}
            >
              <CardHeader>
                <CardTitle>{tier.title}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{tier.price}<span className="text-sm text-gray-500">/month</span></div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className={`text-sm text-center ${error.includes('Check your email') ? 'text-green-600' : 'text-red-500'}`}>
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Creating account..." : `Sign up for ${selectedTier.title}`}
            </Button>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 