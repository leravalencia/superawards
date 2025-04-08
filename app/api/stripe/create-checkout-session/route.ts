// app/api/stripe/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { priceId, successUrl, cancelUrl } = await request.json();
    
    // Get the user from Supabase auth
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a checkout session' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Check if user already has a Stripe customer ID
    const { data: customerData } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();
    
    let customerId;
    
    if (customerData?.stripe_customer_id) {
      // Use existing customer
      customerId = customerData.stripe_customer_id;
    } else {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId,
        },
      });
      
      customerId = customer.id;
      
      // Save the customer ID to the database
      await supabase.from('stripe_customers').insert({
        user_id: userId,
        stripe_customer_id: customerId,
      });
    }
    
    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });
    
    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}