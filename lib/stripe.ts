import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe initialization
let stripePromise: Promise<any> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.error('Stripe publishable key is not defined')
      return null
    }
    try {
      stripePromise = loadStripe(publishableKey, {
        stripeAccount: undefined,
        locale: 'en',
      })
    } catch (error) {
      console.error('Failed to load Stripe:', error)
      return null
    }
  }
  return stripePromise
}

// Server-side Stripe initialization (only used in API routes)
export const getServerStripe = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerStripe should only be used in server-side code')
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-03-31.basil',
    typescript: true,
  })
}

// Price IDs (only used in server-side code)
export const getStripePrices = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getStripePrices should only be used in server-side code')
  }

  const requiredEnvVars = [
    'STRIPE_FREE_PRICE',
    'STRIPE_PREMIUM_PRICE',
    'STRIPE_BUSINESS_PRICE'
  ]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not set in environment variables`)
    }
  }

  return {
    free: process.env.STRIPE_FREE_PRICE!,
    premium: process.env.STRIPE_PREMIUM_PRICE!,
    business: process.env.STRIPE_BUSINESS_PRICE!,
  }
}

export const STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID!

export const STRIPE_PRICES = {
  free: process.env.STRIPE_FREE_PRICE!,
  premium: process.env.STRIPE_PREMIUM_PRICE!,
  business: process.env.STRIPE_BUSINESS_PRICE!,
} 
