import { NextRequest } from 'next/server';
import { verifyIdToken } from '../firebase/admin';
import { findUserByFirebaseUid, syncUserFromFirebase } from '../db/repositories/users';
import { User } from '../db/types';

export interface AuthenticatedRequest extends NextRequest {
  user: User;
  firebaseUid: string;
}

export class AuthenticationError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Authenticate user from Firebase token
 */
export async function authenticateUser(request: NextRequest): Promise<{
  firebaseUid: string;
  user: User;
}> {
  // Extract token from Authorization header
  const token = extractBearerToken(request);
  
  if (!token) {
    throw new AuthenticationError('Missing authorization token');
  }
  
  try {
    // Verify Firebase token
    const decodedToken = await verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    
    // Get or create user in our database
    let user = await findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      // Sync user from Firebase if not exists
      const email = decodedToken.email || `${firebaseUid}@anonymous.local`;
      user = await syncUserFromFirebase(firebaseUid, email);
    }
    
    return { firebaseUid, user };
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    throw new AuthenticationError('Invalid or expired token');
  }
}

/**
 * Middleware wrapper for authenticated API routes
 */
export function withAuth<T extends any[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const { firebaseUid, user } = await authenticateUser(request);
      
      // Add user data to request
      (request as AuthenticatedRequest).user = user;
      (request as AuthenticatedRequest).firebaseUid = firebaseUid;
      
      return await handler(request as AuthenticatedRequest, ...args);
    } catch (error) {
      console.error('❌ Auth middleware error:', error);
      
      if (error instanceof AuthenticationError) {
        return new Response(
          JSON.stringify({ 
            error: error.message,
            code: 'AUTHENTICATION_FAILED'
          }),
          { 
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Optional auth middleware (allows both authenticated and anonymous users)
 */
export function withOptionalAuth<T extends any[]>(
  handler: (request: NextRequest & { user?: User; firebaseUid?: string }, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const token = extractBearerToken(request);
      
      if (token) {
        // Try to authenticate if token is provided
        try {
          const { firebaseUid, user } = await authenticateUser(request);
          (request as any).user = user;
          (request as any).firebaseUid = firebaseUid;
        } catch (error) {
          // Continue without authentication if token is invalid
          console.warn('⚠️ Optional auth failed, continuing without auth:', error);
        }
      }
      
      return await handler(request as any, ...args);
    } catch (error) {
      console.error('❌ Optional auth middleware error:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Check if user has required plan type
 */
export function requirePlan(requiredPlan: 'starter' | 'pro') {
  return function<T extends any[]>(
    handler: (request: AuthenticatedRequest, ...args: T) => Promise<Response>
  ) {
    return withAuth(async (request: AuthenticatedRequest, ...args: T): Promise<Response> => {
      const userPlan = request.user.plan_type;
      
      // Check plan hierarchy: pro > starter > free
      const planHierarchy = { free: 0, starter: 1, pro: 2 };
      const userLevel = planHierarchy[userPlan];
      const requiredLevel = planHierarchy[requiredPlan];
      
      if (userLevel < requiredLevel) {
        return new Response(
          JSON.stringify({ 
            error: `${requiredPlan} plan required`,
            code: 'INSUFFICIENT_PLAN',
            current_plan: userPlan,
            required_plan: requiredPlan
          }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return await handler(request, ...args);
    });
  };
}

/**
 * Rate limiting middleware
 */
export function withRateLimit(requestsPerHour: number = 60) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();
  
  return function<T extends any[]>(
    handler: (request: NextRequest, ...args: T) => Promise<Response>
  ) {
    return async (request: NextRequest, ...args: T): Promise<Response> => {
      const clientId = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;
      
      const clientData = requestCounts.get(clientId);
      
      if (!clientData || now > clientData.resetTime) {
        // Reset or initialize counter
        requestCounts.set(clientId, {
          count: 1,
          resetTime: now + hourInMs
        });
      } else {
        // Increment counter
        clientData.count++;
        
        if (clientData.count > requestsPerHour) {
          return new Response(
            JSON.stringify({ 
              error: 'Rate limit exceeded',
              code: 'RATE_LIMIT_EXCEEDED',
              retry_after: Math.ceil((clientData.resetTime - now) / 1000)
            }),
            { 
              status: 429,
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
              }
            }
          );
        }
      }
      
      return await handler(request, ...args);
    };
  };
} 