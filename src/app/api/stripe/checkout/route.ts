import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { stripe, STRIPE_CONFIG, type CreditPackage } from '@/lib/stripe/config';
import * as UserRepository from '@/lib/db/repositories/users';

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const { packageType } = await request.json();
    const user = (request as any).user;

    // Valideer package type
    if (!packageType || !STRIPE_CONFIG.CREDIT_PACKAGES[packageType as CreditPackage]) {
      return NextResponse.json(
        { error: 'Ongeldig credit pakket' },
        { status: 400 }
      );
    }

    const package_ = STRIPE_CONFIG.CREDIT_PACKAGES[packageType as CreditPackage];

    // Haal volledige user data op
    const dbUser = await UserRepository.findUserByFirebaseUid(user.firebase_uid);
    if (!dbUser) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 404 }
      );
    }

    // Maak Stripe customer aan als deze nog niet bestaat
    let customerId = dbUser.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        metadata: {
          firebase_uid: user.firebase_uid,
          user_id: dbUser.id.toString(),
        },
      });
      customerId = customer.id;

      // Update user met customer ID
      await updateUserStripeCustomerId(dbUser.id, customerId);
    }

    // Maak checkout sessie
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price: package_.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: STRIPE_CONFIG.SUCCESS_URL,
      cancel_url: STRIPE_CONFIG.CANCEL_URL,
      metadata: {
        user_id: dbUser.id.toString(),
        firebase_uid: user.firebase_uid,
        package_type: packageType,
        credits: package_.credits.toString(),
      },
      locale: 'nl',
      currency: 'eur',
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het aanmaken van de checkout sessie' },
      { status: 500 }
    );
  }
});

// Helper functie om customer ID bij te werken
async function updateUserStripeCustomerId(userId: number, customerId: string) {
  const { query } = await import('@/lib/db');
  await query(
    'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
    [customerId, userId]
  );
} 