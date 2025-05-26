import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import * as UserRepository from '@/lib/db/repositories/users';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Haal user data op
    const dbUser = await UserRepository.findUserByFirebaseUid(user.firebase_uid);
    if (!dbUser) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 404 }
      );
    }

    // Haal credit geschiedenis op
    const creditHistory = await UserRepository.getUserCreditHistory(user.firebase_uid, 10);

    return NextResponse.json({
      credits_remaining: dbUser.credits_remaining,
      plan_type: dbUser.plan_type,
      recent_transactions: creditHistory,
      user_info: {
        email: dbUser.email,
        created_at: dbUser.created_at,
        updated_at: dbUser.updated_at,
      },
    });

  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het ophalen van credit informatie' },
      { status: 500 }
    );
  }
}); 