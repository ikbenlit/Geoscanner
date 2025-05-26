import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// Stripe configuratie
export const STRIPE_CONFIG = {
  // Credit pakketten
  CREDIT_PACKAGES: {
    starter: {
      credits: 2,
      price: 1995, // €19.95 in cents
      priceId: process.env.STRIPE_STARTER_PRICE_ID!,
      name: 'Starter Pack',
      description: '2 credits voor uitgebreide scans',
    },
    pro: {
      credits: 5,
      price: 4995, // €49.95 in cents
      priceId: process.env.STRIPE_PRO_PRICE_ID!,
      name: 'Pro Pack',
      description: '5 credits voor AI-enhanced scans',
    },
    extra_credits: {
      credits: 1,
      price: 995, // €9.95 per extra credit
      priceId: process.env.STRIPE_EXTRA_CREDIT_PRICE_ID!,
      name: 'Extra Credit',
      description: '1 extra credit',
    },
  },
  
  // Webhook configuratie
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // Success/Cancel URLs
  SUCCESS_URL: process.env.NEXT_PUBLIC_APP_URL + '/dashboard?payment=success',
  CANCEL_URL: process.env.NEXT_PUBLIC_APP_URL + '/dashboard?payment=cancelled',
} as const;

// Type definitions
export type CreditPackage = keyof typeof STRIPE_CONFIG.CREDIT_PACKAGES;

export interface CheckoutSessionData {
  userId: number;
  firebaseUid: string;
  packageType: CreditPackage;
  credits: number;
  amount: number;
} 