// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json(
      { message: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id

        // Update user's subscription status in Supabase
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: subscription.status,
            subscription_tier: getSubscriptionTier(priceId),
            subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
          })
          .eq('email', session.customer_email)

        if (updateError) throw updateError
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0].price.id

        // Update user's subscription status in Supabase
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            subscription_tier: getSubscriptionTier(priceId),
            subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) throw updateError
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { message: 'Error processing webhook' },
      { status: 500 }
    )
  }
}

function getSubscriptionTier(priceId: string): string {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
    return 'premium'
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID) {
    return 'business'
  }
  return 'free'
}