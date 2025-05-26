import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config';
import * as UserRepository from '@/lib/db/repositories/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Ontbrekende Stripe signature' },
        { status: 400 }
      );
    }

    // Verificeer webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Ongeldige webhook signature' },
        { status: 400 }
      );
    }

    // Verwerk verschillende event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  try {
    console.log('Processing checkout completion:', session.id);

    const { user_id, firebase_uid, package_type, credits } = session.metadata;

    if (!user_id || !firebase_uid || !package_type || !credits) {
      throw new Error('Ontbrekende metadata in checkout session');
    }

    // Voeg credits toe aan gebruiker
    const result = await UserRepository.addCredits(
      firebase_uid,
      parseInt(credits),
      session.payment_intent,
      `Credit purchase: ${package_type} package`
    );

    console.log(`Credits toegevoegd voor gebruiker ${firebase_uid}:`, {
      credits_added: parseInt(credits),
      new_balance: result.remaining_credits,
      transaction_id: result.transaction?.id,
    });

  } catch (error) {
    console.error('Error processing checkout completion:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Hier kunnen we extra logging of notificaties toevoegen
    // De credits zijn al toegevoegd in handleCheckoutCompleted
    
  } catch (error) {
    console.error('Error processing payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error);
    
    // Hier kunnen we failure logging of notificaties toevoegen
    // Mogelijk credits terugdraaien als ze al toegevoegd waren
    
  } catch (error) {
    console.error('Error processing payment failure:', error);
  }
} 