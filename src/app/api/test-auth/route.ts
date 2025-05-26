import { NextResponse } from 'next/server';
import { withAuth, withOptionalAuth } from '@/lib/middleware/auth';

// Test authenticated endpoint
export const GET = withAuth(async (request) => {
  const { user, firebaseUid } = request;
  
  return NextResponse.json({
    message: 'Authentication successful!',
    user: {
      id: user.id,
      firebase_uid: user.firebase_uid,
      email: user.email,
      plan_type: user.plan_type,
      credits_remaining: user.credits_remaining,
    },
    firebase_uid: firebaseUid,
  });
});

// Test optional auth endpoint
export const POST = withOptionalAuth(async (request) => {
  const user = (request as any).user;
  const firebaseUid = (request as any).firebaseUid;
  
  if (user) {
    return NextResponse.json({
      message: 'User is authenticated',
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        plan_type: user.plan_type,
        credits_remaining: user.credits_remaining,
      },
    });
  } else {
    return NextResponse.json({
      message: 'User is not authenticated (anonymous access)',
      authenticated: false,
    });
  }
}); 