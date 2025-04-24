// /app/api/stripe/webhook/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('Stripe-Signature') as string;
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get: async (name) => (await cookies()).get(name)?.value,
          set: () => {},
          remove: () => {},
        },
      }
    );
    
    // Handle the event
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
                updated_at: new Date().toISOString(),
              });
            
            // Update user metadata
            await supabase.auth.admin.updateUserById(customerData.user_id, {
              user_metadata: {
                subscription_status: 'active',
                subscription_plan: plan,
              }
            });
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
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
              updated_at: new Date().toISOString(),
            });
          
          // Update user metadata
          await supabase.auth.admin.updateUserById(customerData.user_id, {
            user_metadata: {
              subscription_status: status,
              subscription_plan: status === 'active' ? plan : 'free',
            }
          });
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get user from customer
        const { data: customerData } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (customerData) {
          // Update user profile with subscription info
          await supabase
            .from('profiles')
            .upsert({
              id: customerData.user_id,
              subscription_status: 'canceled',
              subscription_plan: 'free',
              updated_at: new Date().toISOString(),
            });
          
          // Update user metadata
          await supabase.auth.admin.updateUserById(customerData.user_id, {
            user_metadata: {
              subscription_status: 'canceled',
              subscription_plan: 'free',
            }
          });
        }
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};