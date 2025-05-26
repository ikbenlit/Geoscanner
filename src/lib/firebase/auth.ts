import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import { auth } from '../firebase';

// Auth error types
export class AuthenticationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// User registration data
export interface RegisterUserData {
  email: string;
  password: string;
  displayName?: string;
}

// Login data
export interface LoginUserData {
  email: string;
  password: string;
}

/**
 * Sign in anonymously (for free tier)
 */
export async function signInAnonymous(): Promise<UserCredential> {
  try {
    console.log('🔐 Attempting anonymous sign in...');
    const result = await signInAnonymously(auth);
    console.log('✅ Anonymous sign in successful:', result.user.uid);
    return result;
  } catch (error) {
    console.error('❌ Anonymous sign in failed:', error);
    const authError = error as AuthError;
    throw new AuthenticationError(
      'Failed to sign in anonymously',
      authError.code
    );
  }
}

/**
 * Register new user with email and password
 */
export async function registerWithEmail(userData: RegisterUserData): Promise<UserCredential> {
  try {
    console.log('🔐 Attempting email registration for:', userData.email);
    
    // Create user account
    const result = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    // Update display name if provided
    if (userData.displayName && result.user) {
      await updateProfile(result.user, {
        displayName: userData.displayName,
      });
    }
    
    console.log('✅ Email registration successful:', result.user.uid);
    return result;
  } catch (error) {
    console.error('❌ Email registration failed:', error);
    const authError = error as AuthError;
    
    // Provide user-friendly error messages
    let message = 'Registration failed';
    switch (authError.code) {
      case 'auth/email-already-in-use':
        message = 'Dit email adres is al in gebruik';
        break;
      case 'auth/invalid-email':
        message = 'Ongeldig email adres';
        break;
      case 'auth/weak-password':
        message = 'Wachtwoord is te zwak (minimaal 6 karakters)';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email registratie is niet ingeschakeld';
        break;
    }
    
    throw new AuthenticationError(message, authError.code);
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(loginData: LoginUserData): Promise<UserCredential> {
  try {
    console.log('🔐 Attempting email sign in for:', loginData.email);
    
    const result = await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password
    );
    
    console.log('✅ Email sign in successful:', result.user.uid);
    return result;
  } catch (error) {
    console.error('❌ Email sign in failed:', error);
    const authError = error as AuthError;
    
    // Provide user-friendly error messages
    let message = 'Login failed';
    switch (authError.code) {
      case 'auth/user-not-found':
        message = 'Geen account gevonden met dit email adres';
        break;
      case 'auth/wrong-password':
        message = 'Onjuist wachtwoord';
        break;
      case 'auth/invalid-email':
        message = 'Ongeldig email adres';
        break;
      case 'auth/user-disabled':
        message = 'Dit account is uitgeschakeld';
        break;
      case 'auth/too-many-requests':
        message = 'Te veel login pogingen. Probeer later opnieuw';
        break;
    }
    
    throw new AuthenticationError(message, authError.code);
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    console.log('🔐 Sending password reset email to:', email);
    
    await sendPasswordResetEmail(auth, email);
    
    console.log('✅ Password reset email sent');
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    const authError = error as AuthError;
    
    let message = 'Failed to send password reset email';
    switch (authError.code) {
      case 'auth/user-not-found':
        message = 'Geen account gevonden met dit email adres';
        break;
      case 'auth/invalid-email':
        message = 'Ongeldig email adres';
        break;
    }
    
    throw new AuthenticationError(message, authError.code);
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    console.log('🔐 Signing out user...');
    await signOut(auth);
    console.log('✅ Sign out successful');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
    throw new AuthenticationError('Failed to sign out');
  }
}

/**
 * Get current user's ID token for API calls
 */
export async function getCurrentUserToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('❌ Failed to get user token:', error);
    return null;
  }
}

/**
 * Check if current user is anonymous
 */
export function isAnonymousUser(user: User | null): boolean {
  return user?.isAnonymous ?? false;
}

/**
 * Check if current user is authenticated (not anonymous)
 */
export function isAuthenticatedUser(user: User | null): boolean {
  return user !== null && !user.isAnonymous;
}

/**
 * Get user display name or fallback
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  if (user.isAnonymous) return 'Anonymous User';
  return user.displayName || user.email || 'User';
}

/**
 * Convert anonymous user to registered user
 */
export async function upgradeAnonymousUser(userData: RegisterUserData): Promise<UserCredential> {
  try {
    const user = auth.currentUser;
    if (!user || !user.isAnonymous) {
      throw new Error('No anonymous user to upgrade');
    }
    
    console.log('🔐 Upgrading anonymous user to registered user...');
    
    // For now, we'll sign out and create a new account
    // In the future, we could use linkWithCredential for a seamless upgrade
    await signOutUser();
    const result = await registerWithEmail(userData);
    
    console.log('✅ Anonymous user upgrade successful');
    return result;
  } catch (error) {
    console.error('❌ Anonymous user upgrade failed:', error);
    throw new AuthenticationError('Failed to upgrade anonymous user');
  }
}

// Auth state helpers
export const AuthHelpers = {
  isAnonymous: isAnonymousUser,
  isAuthenticated: isAuthenticatedUser,
  getDisplayName: getUserDisplayName,
  getToken: getCurrentUserToken,
}; 