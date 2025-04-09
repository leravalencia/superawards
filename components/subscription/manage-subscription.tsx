// components/subscription/manage-subscription.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { loadStripe } from '@stripe/stripe-js'
import { useState } from "react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionTier {
  title: string
  description: string
  price: string
  features: string[]
  priceId: string
  isCurrent?: boolean
}

export function ManageSubscription({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState(false)

  const tiers: SubscriptionTier[] = [
    {
      title: "Free",
      description: "Basic features for getting started",
      price: "$0",
      features: [
        "5 awards per month",
        "Basic templates",
        "Email support"
      ],
      priceId: "",
      isCurrent: currentPlan === 'free'
    },
    {
      title: "Premium",
      description: "Advanced features for growing teams",
      price: "$29",
      features: [
        "Unlimited awards",
        "Premium templates",
        "Priority support",
        "Custom branding"
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
      isCurrent: currentPlan === 'premium'
    },
    {
      title: "Business",
      description: "Complete solution for organizations",
      price: "$99",
      features: [
        "Everything in Premium",
        "Team management",
        "API access",
        "Custom integrations"
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!,
      isCurrent: currentPlan === 'business'
    }
  ]

  const handleUpgrade = async (priceId: string) => {
    if (!priceId) return

    try {
      setLoading(true)
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const { sessionId } = await response.json()
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) throw error
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/portal-session', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to create portal session')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p className="text-gray-500">Manage your subscription and billing</p>
        </div>
        {currentPlan !== 'free' && (
          <Button 
            onClick={handleManageSubscription}
            disabled={loading}
          >
            Manage Subscription
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.title} className={tier.isCurrent ? 'ring-2 ring-primary' : ''}>
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
              <Button
                className="w-full"
                variant={tier.isCurrent ? "outline" : "default"}
                onClick={() => handleUpgrade(tier.priceId)}
                disabled={tier.isCurrent || loading || !tier.priceId}
              >
                {tier.isCurrent ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}