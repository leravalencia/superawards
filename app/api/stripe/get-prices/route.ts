import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Validate environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not configured')
  throw new Error('STRIPE_SECRET_KEY is not configured')
}

// Initialize Stripe with proper typing
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
})

export async function GET() {
  try {
    console.log('Fetching Stripe prices...')
    
    const prices = await stripe.prices.list({
      active: true,
      type: 'recurring',
      expand: ['data.product'],
      limit: 10
    })

    console.log(`Found ${prices.data.length} active prices`)

    if (!prices.data || prices.data.length === 0) {
      console.log('No active prices found in Stripe')
      return NextResponse.json({ 
        prices: [],
        message: 'No active prices found'
      })
    }

    // Sort prices by amount
    const sortedPrices = prices.data.sort((a, b) => {
      return (a.unit_amount || 0) - (b.unit_amount || 0)
    })

    // Log the prices we're returning (without sensitive data)
    const sanitizedPrices = sortedPrices.map(p => ({
      id: p.id,
      amount: p.unit_amount,
      product_name: typeof p.product === 'object' && p.product && !('deleted' in p.product) ? (p.product as Stripe.Product).name : null
    }))
    console.log('Returning prices:', sanitizedPrices)

    return NextResponse.json({ prices: sortedPrices })
  } catch (error: any) {
    console.error('Stripe API error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    })

    return NextResponse.json(
      { 
        error: 'Failed to fetch prices',
        details: error.message
      },
      { status: error.statusCode || 500 }
    )
  }
} 