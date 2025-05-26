import { NextRequest, NextResponse } from 'next/server';
import { withOptionalAuth } from '@/lib/middleware/auth';
import { syncUserFromFirebase } from '@/lib/db/repositories/users';

// Tijdelijke mock mode voor development
const MOCK_MODE = process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL;

export const POST = async (request: NextRequest) => {
  try {
    console.log('🔄 Auth sync endpoint called');
    
    let body;
    try {
      const text = await request.text();
      console.log('📝 Request body text:', text);
      
      if (text.trim()) {
        body = JSON.parse(text);
      } else {
        console.log('⚠️ Empty request body, using empty object');
        body = {};
      }
    } catch (error) {
      console.log('⚠️ JSON parse error, using empty object:', error);
      body = {};
    }
    
    const { firebaseUid, email, displayName } = body;
    console.log('🔄 Auth sync request data:', { firebaseUid, email, displayName });
    
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Creating mock user for auth sync');
      
      // In mock mode, we need at least firebaseUid or email
      const mockFirebaseUid = firebaseUid || `mock_${Date.now()}`;
      const mockEmail = email || `${mockFirebaseUid}@example.com`;
      
      // Return mock user data
      const mockUser = {
        id: Date.now(),
        firebase_uid: mockFirebaseUid,
        email: mockEmail,
        plan_type: 'free' as const,
        credits_remaining: 1,
        stripe_customer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      console.log('✅ Mock user created:', mockUser);
      
      return NextResponse.json({
        success: true,
        user: mockUser,
        message: 'User synced successfully (mock mode)'
      });
    }
    
    // For production mode, we need proper Firebase data
    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firebaseUid and email' },
        { status: 400 }
      );
    }
    
    const user = await syncUserFromFirebase(firebaseUid, email, displayName);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        plan_type: user.plan_type,
        credits_remaining: user.credits_remaining,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      message: 'User synced successfully'
    });
  } catch (error) {
    console.error('❌ User sync error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to sync user',
        code: 'SYNC_FAILED',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}; 