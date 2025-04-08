// components/subscription/pricing-table.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PricingPlan {
  name: string
  description: string
  price: string | null
  interval?: string
  features: string[]
  stripePriceId?: string
  popular?: boolean
}

interface PricingTableProps {
  currentPlan?: string
}

export default function PricingTable({ currentPlan = 'free' }: PricingTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      name: "Free",
      description: "Basic features",
      price: null,
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3"
      ],
      stripePriceId: undefined
    },
    {
      name: "Premium",
      description: "Enhanced features",
      price: "$19.99",
      interval: "month",
      features: [
        "All Free tier features",
        "Premium feature 1",
        "Premium feature 2",
        "Premium feature 3"
      ],
      stripePriceId: "price_1234567890",
      popular: true
    },
    {
      name: "Custom",
      description: "Full features",
      price: "$99.99",
      interval: "month",
      features: [
        "All Premium tier features",
        "Custom feature 1",
        "Custom feature 2",
        "Custom feature 3",
        "Custom feature 4"
      ],
      stripePriceId: "price_0987654321"
    }
  ])
  const router = useRouter()
  const { toast } = useToast()

  // You can fetch plans from your API if needed
  // useEffect(() => {
  //   const fetchPlans = async () => {
  //     const response = await fetch('/api/stripe/plans')
  //     const data = await response.json()
  //     if (data.plans) setPlans(data.plans)
  //   }
  //   fetchPlans()
  // }, [])

  const handleSubscribe = async (planName: string, priceId?: string) => {
    if (!priceId) {
      if (planName.toLowerCase() === 'free') {
        // Handle free plan signup
        router.push('/dashboard')
        return
      }
      
      // For custom plan without a price ID
      router.push('/contact?plan=custom')
      return
    }
    
    setIsLoading(planName)
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      })
      
      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast({
        title: "Error",
        description: "Failed to start subscription process",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => {
        const isCurrentPlan = currentPlan.toLowerCase() === plan.name.toLowerCase()
        
        return (
          <Card 
            key={plan.name}
            className={`flex flex-col border-2 ${
              plan.popular 
                ? 'border-indigo-500 shadow-lg shadow-indigo-100' 
                : 'border-gray-200'
            } ${isCurrentPlan ? 'bg-indigo-50' : ''}`}
          >
            {plan.popular && (
              <div className="bg-indigo-500 text-white text-center py-1 text-sm font-medium">
                MOST POPULAR
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {plan.price || 'Free'}
                </span>
                {plan.interval && (
                  <span className="text-gray-500 ml-2">/{plan.interval}</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-indigo-500 mr-3 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                className={`w-full ${
                  isCurrentPlan 
                    ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={isLoading === plan.name || isCurrentPlan}
                onClick={() => handleSubscribe(plan.name, plan.stripePriceId)}
              >
                {isLoading === plan.name ? (
                  "Processing..."
                ) : isCurrentPlan ? (
                  "Current Plan"
                ) : plan.name.toLowerCase() === 'free' ? (
                  "Get Started"
                ) : plan.name.toLowerCase() === 'custom' ? (
                  "Contact Us"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}