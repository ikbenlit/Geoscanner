import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

// Firebase Admin configuration
let adminApp: App;
let adminAuth: Auth;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Check for required environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      'Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL environment variables.'
    );
  }

  try {
    const app = initializeApp({
      credential: cert({
        projectId,
        privateKey,
        clientEmail,
      }),
      projectId,
    });

    console.log('🔥 Firebase Admin SDK initialized successfully');
    return app;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
}

/**
 * Get Firebase Admin Auth instance
 */
export function getAdminAuth(): Auth {
  if (!adminAuth) {
    adminApp = initializeFirebaseAdmin();
    adminAuth = getAuth(adminApp);
  }
  return adminAuth;
}

/**
 * Verify Firebase ID token
 */
export async function verifyIdToken(idToken: string): Promise<{
  uid: string;
  email?: string;
  email_verified?: boolean;
  firebase: {
    sign_in_provider: string;
  };
}> {
  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    
    console.log('✅ Token verified for user:', decodedToken.uid);
    return decodedToken;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Get user by UID
 */
export async function getUser(uid: string) {
  try {
    const auth = getAdminAuth();
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('❌ Failed to get user:', error);
    throw new Error('User not found');
  }
}

/**
 * Create custom token for user
 */
export async function createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
  try {
    const auth = getAdminAuth();
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('❌ Failed to create custom token:', error);
    throw new Error('Failed to create custom token');
  }
}

/**
 * Set custom user claims (for role-based access)
 */
export async function setCustomUserClaims(uid: string, customClaims: object): Promise<void> {
  try {
    const auth = getAdminAuth();
    await auth.setCustomUserClaims(uid, customClaims);
    console.log('✅ Custom claims set for user:', uid);
  } catch (error) {
    console.error('❌ Failed to set custom claims:', error);
    throw new Error('Failed to set custom claims');
  }
}

/**
 * Delete user account
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    const auth = getAdminAuth();
    await auth.deleteUser(uid);
    console.log('✅ User deleted:', uid);
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
    throw new Error('Failed to delete user');
  }
}

// Export admin app for other admin operations
export { adminApp }; 