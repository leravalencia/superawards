// /app/api/stripe/webhook/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          
          // Get customer
          const customerId = session.customer as string;
          
          // Get subscription
          const subscriptionId = session.subscription as string;
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0].price.id;
            
            // Get user from customer
            const { data: customerData } = await supabase
              .from('customers')
              .select('user_id')
              .eq('stripe_customer_id', customerId)
              .single();
            
            if (customerData) {
              // Determine subscription level based on price ID
              let plan = 'free';
              
              if (priceId === process.env.STRIPE_PREMIUM_PRICE) {
                plan = 'premium';
              } else if (priceId === process.env.STRIPE_BUSINESS_PRICE) {
                plan = 'business';
              }
              
              // Update user profile with subscription info
              await supabase
                .from('profiles')
                .upsert({
                  id: customerData.user_id,
                  subscription_status: 'active',
                  subscription_plan: plan,
                  stripe_subscription_id: subscriptionId,
                  stripe_customer_id: customerId,
                  subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
                  updated_at: new Date().toISOString(),
                });
            }
          }
          break;
        }
        
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const status = subscription.status;
          const priceId = subscription.items.data[0].price.id;
          
          // Get user from customer
          const { data: customerData } = await supabase
            .from('customers')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single();
          
          if (customerData) {
            // Determine subscription level based on price ID
            let plan = 'free';
            
            if (priceId === process.env.STRIPE_PREMIUM_PRICE) {
              plan = 'premium';
            } else if (priceId === process.env.STRIPE_BUSINESS_PRICE) {
              plan = 'business';
            }
            
            // Update user profile with subscription info
            await supabase
              .from('profiles')
              .upsert({
                id: customerData.user_id,
                subscription_status: status,
                subscription_plan: status === 'active' ? plan : 'free',
                subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              });
          }
          break;
        }
      }

      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};