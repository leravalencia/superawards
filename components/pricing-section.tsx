"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PricingTierProps {
  title: string
  description: string
  price: string
  features: string[]
  ctaText: string
  ctaLink: string
  isPopular?: boolean
  variant?: 'default' | 'outline'
  priceId?: string
}

function PricingTier({
  title,
  description,
  price,
  features,
  ctaText,
  ctaLink,
  isPopular = false,
  variant = 'default',
  priceId
}: PricingTierProps) {
  const handleCheckout = async () => {
    if (!priceId) {
      window.location.href = ctaLink
      return
    }

    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const { sessionId } = await response.json()
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) throw error
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  return (
    <div className={`flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white ${isPopular ? 'ring-2 ring-blue-600' : ''}`}>
      <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{description}</p>
      <div className="flex justify-center items-baseline my-8">
        <span className="mr-2 text-5xl font-extrabold">{price}</span>
        <span className="text-gray-500 dark:text-gray-400">/month</span>
      </div>
      <ul role="list" className="mb-8 space-y-4 text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={variant}
        className="w-full"
        onClick={handleCheckout}
      >
        {ctaText}
      </Button>
    </div>
  )
}

interface PricingSectionProps {
  currentPlan: string
  isAuthenticated: boolean
}

export function PricingSection({ currentPlan, isAuthenticated }: PricingSectionProps) {
  const pricingTiers = [
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
      ctaText: isAuthenticated ? (currentPlan === 'free' ? 'Current Plan' : 'Downgrade') : 'Get Started',
      ctaLink: isAuthenticated ? '#' : '/auth/signup',
      variant: 'outline' as const
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
      ctaText: isAuthenticated ? (currentPlan === 'premium' ? 'Current Plan' : 'Upgrade') : 'Get Started',
      ctaLink: isAuthenticated ? '#' : '/auth/signup?plan=premium',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
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
      ctaText: isAuthenticated ? (currentPlan === 'business' ? 'Current Plan' : 'Upgrade') : 'Get Started',
      ctaLink: isAuthenticated ? '#' : '/auth/signup?plan=business',
      priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID
    }
  ]

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Choose the plan that best fits your needs
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </section>
  )
} 