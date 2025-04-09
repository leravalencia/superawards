import Stripe from 'stripe';

// Check for required environment variables
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_FREE_PRICE',
  'STRIPE_PREMIUM_PRICE',
  'STRIPE_BUSINESS_PRICE'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is not set in environment variables`);
  }
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});

export const getStripeInstance = () => {
  return stripe;
};

export const STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID!;

export const STRIPE_PRICES = {
  free: process.env.STRIPE_FREE_PRICE!,
  premium: process.env.STRIPE_PREMIUM_PRICE!,
  business: process.env.STRIPE_BUSINESS_PRICE!,
}; 
