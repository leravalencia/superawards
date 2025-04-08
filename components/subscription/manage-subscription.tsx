// components/subscription/manage-subscription.tsx
"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, CreditCard } from 'lucide-react'

interface SubscriptionDetails {
  tier: string
  status: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  amount: number
  currency: string
  interval: string
}

interface ManageSubscriptionProps {
  subscription: SubscriptionDetails
}

export default function ManageSubscription({ subscription }: ManageSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const handleManageSubscription = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/dashboard/settings`,
        }),
      })
      
      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error('Failed to create portal session')
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
      toast({
        title: "Error",
        description: "Failed to access billing portal",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>Manage your subscription</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Current Plan</div>
            <div className="text-xl font-bold capitalize">{subscription.tier}</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div className="text-xl font-bold capitalize">
              {subscription.status}
              {subscription.cancelAtPeriodEnd && " (Cancels soon)"}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Billing Amount</div>
            <div className="text-xl font-bold">
              {subscription.amount > 0 
                ? `${formatCurrency(subscription.amount, subscription.currency)}/${subscription.interval}`
                : "Free"}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg flex items-start">
            <Calendar className="h-5 w-5 text-indigo-600 mr-2 mt-1" />
            <div>
              <div className="text-sm text-gray-500 mb-1">Next Billing Date</div>
              <div className="text-xl font-bold">
                {subscription.amount > 0 
                  ? formatDate(subscription.currentPeriodEnd)
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {subscription.tier !== 'free' && (
          <Button 
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isLoading ? "Loading..." : "Manage Billing"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}