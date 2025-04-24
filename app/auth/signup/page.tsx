"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Stripe } from 'stripe'

type PriceWithProduct = Stripe.Price & {
  product: Stripe.Product
}

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [prices, setPrices] = useState<PriceWithProduct[]>([])
  const [selectedPrice, setSelectedPrice] = useState<PriceWithProduct | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const supabase = createClient()

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      console.log('Fetching prices from Stripe...')
      const response = await fetch('/api/stripe/get-prices')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.error || 'Failed to fetch prices')
      }
      
      const data = await response.json()
      console.log('Fetched prices:', data)
      
      if (!data.prices || !Array.isArray(data.prices)) {
        console.error('Invalid prices data:', data)
        throw new Error('Invalid pricing data received')
      }
      
      setPrices(data.prices)
      
      // Set initial selected price based on URL parameter
      if (plan && data.prices.length > 0) {
        const matchingPrice = data.prices.find(
          (p: PriceWithProduct) => p.product.name.toLowerCase() === plan.toLowerCase()
        )
        if (matchingPrice) {
          setSelectedPrice(matchingPrice)
        }
      }
    } catch (err) {
      console.error('Error fetching prices:', err)
      setError('Failed to load pricing information')
    }
  }

  const getFeatures = (price: PriceWithProduct | { nickname: string, product?: { name: string } }) => {
    // Default features for each tier
    const defaultFeatures: Record<string, string[]> = {
      free: [
        "5 awards per month",
        "Basic templates",
        "Email support",
        "Community access"
      ],
      premium: [
        "Unlimited awards",
        "Premium templates",
        "Priority support",
        "Custom branding",
        "Analytics dashboard"
      ],
      business: [
        "Everything in Premium",
        "Team management",
        "API access",
        "Custom integrations",
        "Dedicated support"
      ]
    }

    // If it's a Stripe price object
    if ('product' in price && price.product) {
      const productName = price.product.name?.toLowerCase() || ''
      // Try to get features from metadata if available
      const stripeProduct = price.product as Stripe.Product
      if (stripeProduct.metadata?.features) {
        try {
          return JSON.parse(stripeProduct.metadata.features)
        } catch (e) {
          console.warn('Failed to parse features from metadata')
        }
      }
      // Fall back to default features based on product name
      if (productName.includes('premium')) return defaultFeatures.premium
      if (productName.includes('business')) return defaultFeatures.business
      if (productName.includes('free')) return defaultFeatures.free
    }

    // For the hardcoded free plan
    if ('nickname' in price && price.nickname) {
      const plan = price.nickname.toLowerCase() as keyof typeof defaultFeatures
      return defaultFeatures[plan] || defaultFeatures.free
    }

    return defaultFeatures.free
  }

  const formatPrice = (price: PriceWithProduct) => {
    const amount = (price.unit_amount || 0) / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(amount)
  }

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
            plan: selectedPrice?.product.name.toLowerCase() || 'free'
          }
        },
      })

      if (signUpError) {
        console.error('Supabase signup error:', signUpError)
        throw new Error(signUpError.message)
      }

      if (!signUpData?.user) {
        throw new Error('Failed to create user account')
      }

      // If it's a free plan or no plan selected, just show success message
      if (!selectedPrice?.id) {
        setError("Check your email for the confirmation link!")
        router.push('/auth/login')
        return
      }

      // For paid plans, redirect to checkout
      router.push(`/checkout/${selectedPrice.product.name.toLowerCase()}`)
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
            Choose Your Plan
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select a plan and create your account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card 
            className={`cursor-pointer transition-all ${
              !selectedPrice 
                ? 'ring-2 ring-indigo-600' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedPrice(null)}
          >
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">
                $0<span className="text-sm text-gray-500">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {getFeatures({ nickname: 'free' }).map((feature: string) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Stripe Plans */}
          {prices.map((price) => (
            <Card 
              key={price.id}
              className={`cursor-pointer transition-all ${
                selectedPrice?.id === price.id 
                  ? 'ring-2 ring-indigo-600' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPrice(price)}
            >
              <CardHeader>
                <CardTitle>{price.product.name}</CardTitle>
                <CardDescription>{price.product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {formatPrice(price)}<span className="text-sm text-gray-500">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {getFeatures(price).map((feature: string) => (
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
              {loading ? "Creating account..." : `Sign up${selectedPrice ? ` for ${selectedPrice.product.name}` : ''}`}
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