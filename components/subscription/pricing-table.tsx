// components/subscription/pricing-table.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { toast } from "sonner"

interface PricingTableProps {
  currentPlan: string
  isAuthenticated: boolean
}

export function PricingTable({ currentPlan, isAuthenticated }: PricingTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async (priceId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: isAuthenticated ? 'user_id_here' : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/stripe/portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_id_here',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Basic features',
        'Limited usage',
        'Community support',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID,
    },
    {
      name: 'Premium',
      price: '$9.99',
      description: 'Best for professionals',
      features: [
        'All Free features',
        'Advanced features',
        'Priority support',
        'Custom branding',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    },
    {
      name: 'Business',
      price: '$29.99',
      description: 'For growing businesses',
      features: [
        'All Premium features',
        'Team collaboration',
        'API access',
        'Dedicated support',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <Card key={plan.name} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {currentPlan === plan.name.toLowerCase() ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isLoading}
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleCheckout(plan.priceId!)}
                disabled={isLoading || !isAuthenticated}
              >
                {isAuthenticated ? 'Upgrade' : 'Sign Up'}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}