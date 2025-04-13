"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with award discovery",
    features: [
      "Basic award search",
      "Up to 5 saved awards",
      "Email notifications",
      "Basic application templates"
    ],
    priceId: "free",
    buttonText: "Get Started"
  },
  {
    name: "Premium",
    price: "$49",
    description: "For businesses serious about winning awards",
    features: [
      "Advanced award search",
      "Unlimited saved awards",
      "AI-powered application support",
      "Priority email support",
      "Basic PR package",
      "Analytics dashboard"
    ],
    priceId: "price_1P8X2XKX8X8X8X8X8X8X8X8X",
    buttonText: "Start Free Trial"
  },
  {
    name: "Business",
    price: "$99",
    description: "For organizations with multiple award goals",
    features: [
      "Everything in Premium",
      "Team collaboration",
      "Advanced PR package",
      "Dedicated account manager",
      "Custom award strategy",
      "Priority application review"
    ],
    priceId: "price_1P8X2XKX8X8X8X8X8X8X8X8X8",
    buttonText: "Start Free Trial"
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true)
      setError("")

      if (priceId === "free") {
        router.push("/auth/signup")
        return
      }

      // Get Stripe instance
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to initialize")
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw stripeError
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your award goals and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleCheckout(plan.priceId)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Loading..." : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {error && (
          <div className="mt-8 text-center text-red-500">
            {error}
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-600 mb-8">
            Contact us for enterprise pricing and custom features
          </p>
          <Button
            onClick={() => router.push("/contact")}
            variant="outline"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  )
}

