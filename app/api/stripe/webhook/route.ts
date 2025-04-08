// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Initialize Supabase client with service role for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  try {
    // Handle the event
    switch (event.type) {
      case 'product.created':
      case 'product.updated':
        await handleProductChange(event.data.object as Stripe.Product);
        break;
        
      case 'price.created':
      case 'price.updated':
        await handlePriceChange(event.data.object as Stripe.Price);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

async function handleProductChange(product: Stripe.Product) {
  await supabase.from('stripe_products').upsert({
    stripe_product_id: product.id,
    name: product.name,
    description: product.description || null,
    active: product.active,
    metadata: product.metadata,
  });
}

async function handlePriceChange(price: Stripe.Price) {
  if (price.type === 'recurring') {
    await supabase.from('stripe_prices').upsert({
      stripe_price_id: price.id,
      stripe_product_id: price.product as string,
      currency: price.currency,
      unit_amount: price.unit_amount || 0,
      recurring_interval: price.recurring?.interval,
      recurring_interval_count: price.recurring?.interval_count,
      active: price.active,
      metadata: price.metadata,
    });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  // Get the customer ID
  const stripeCustomerId = subscription.customer as string;
  
  // Find the user ID associated with this customer
  const { data: customerData } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single();
  
  if (!customerData) {
    console.error(`No user found for Stripe customer: ${stripeCustomerId}`);
    return;
  }
  
  const userId = customerData.user_id;
  
  // Get the subscription item (assuming one item per subscription)
  const item = subscription.items.data[0];
  const priceId = item.price.id;
  
  // Update or insert the subscription
  await supabase.from('stripe_subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: stripeCustomerId,
    stripe_price_id: priceId,
    status: subscription.status,
    current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
    current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at 
      ? new Date(subscription.canceled_at * 1000).toISOString() 
      : null,
    trial_start: subscription.trial_start 
      ? new Date(subscription.trial_start * 1000).toISOString() 
      : null,
    trial_end: subscription.trial_end 
      ? new Date(subscription.trial_end * 1000).toISOString() 
      : null,
    metadata: subscription.metadata,
  });
  
  // Update the user's subscription tier in the profiles table
  // Get the product details to determine the tier
  const { data: priceData } = await supabase
    .from('stripe_prices')
    .select('stripe_product_id')
    .eq('stripe_price_id', priceId)
    .single();
    
  if (priceData) {
    const { data: productData } = await supabase
      .from('stripe_products')
      .select('name, metadata')
      .eq('stripe_product_id', priceData.stripe_product_id)
      .single();
      
    if (productData) {
      // Determine tier from product name or metadata
      let tier = 'free';
      if (productData.metadata?.tier) {
        tier = productData.metadata.tier;
      } else if (productData.name.toLowerCase().includes('premium')) {
        tier = 'premium';
      } else if (productData.name.toLowerCase().includes('custom')) {
        tier = 'custom';
      }
      
      // Only update if subscription is active
      if (subscription.status === 'active' || subscription.status === 'trialing') {
        await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', userId);
      }
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Update the subscription status to canceled
  await supabase
    .from('stripe_subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);
    
  // Get the user ID for this subscription
  const { data: subscriptionData } = await supabase
    .from('stripe_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();
    
  if (subscriptionData) {
    // Reset the user's subscription tier to free
    await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .eq('id', subscriptionData.user_id);
  }
}