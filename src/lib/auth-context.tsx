'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { 
  signInAnonymous, 
  registerWithEmail, 
  signInWithEmail, 
  signOutUser,
  resetPassword,
  upgradeAnonymousUser,
  AuthHelpers,
  RegisterUserData,
  LoginUserData,
  AuthenticationError
} from './firebase/auth';
import { User as DbUser } from './db/types';

interface AuthContextType {
  // Firebase user
  user: User | null;
  loading: boolean;
  
  // Database user (synced)
  dbUser: DbUser | null;
  
  // Auth state helpers
  isAnonymous: boolean;
  isAuthenticated: boolean;
  displayName: string;
  
  // Auth actions
  signInAnonymously: () => Promise<void>;
  registerUser: (userData: RegisterUserData) => Promise<void>;
  signInUser: (loginData: LoginUserData) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  upgradeAnonymous: (userData: RegisterUserData) => Promise<void>;
  
  // Token management
  getToken: () => Promise<string | null>;
  
  // Error state
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  dbUser: null,
  isAnonymous: false,
  isAuthenticated: false,
  displayName: 'Guest',
  signInAnonymously: async () => {},
  registerUser: async () => {},
  signInUser: async () => {},
  signOut: async () => {},
  sendPasswordReset: async () => {},
  upgradeAnonymous: async () => {},
  getToken: async () => null,
  error: null,
  clearError: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync database user when Firebase user changes
  const syncDatabaseUser = async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setDbUser(null);
      return;
    }

    try {
      console.log('🔄 Syncing database user for:', firebaseUser.uid);
      console.log('🔄 Firebase user data:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        isAnonymous: firebaseUser.isAnonymous
      });
      
      // Prepare request data
      const requestData = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      };
      
      console.log('📤 Sending sync request with data:', requestData);
      
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📥 Sync response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Database user synced:', userData.user);
        setDbUser(userData.user);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to sync database user:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Error syncing database user:', error);
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await syncDatabaseUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to handle auth errors
  const handleAuthError = (error: any) => {
    if (error instanceof AuthenticationError) {
      setError(error.message);
    } else {
      setError('Er is een onbekende fout opgetreden');
    }
    console.error('Auth error:', error);
  };

  // Auth actions
  const signInAnonymously = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInAnonymous();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData: RegisterUserData) => {
    try {
      setError(null);
      setLoading(true);
      await registerWithEmail(userData);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (loginData: LoginUserData) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmail(loginData);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await signOutUser();
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      handleAuthError(error);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const upgradeAnonymous = async (userData: RegisterUserData) => {
    try {
      setError(null);
      setLoading(true);
      await upgradeAnonymousUser(userData);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async (): Promise<string | null> => {
    return AuthHelpers.getToken();
  };

  const clearError = () => {
    setError(null);
  };

  // Computed values
  const isAnonymous = AuthHelpers.isAnonymous(user);
  const isAuthenticated = AuthHelpers.isAuthenticated(user);
  const displayName = AuthHelpers.getDisplayName(user);

  const value: AuthContextType = {
    user,
    loading,
    dbUser,
    isAnonymous,
    isAuthenticated,
    displayName,
    signInAnonymously,
    registerUser,
    signInUser,
    signOut,
    sendPasswordReset,
    upgradeAnonymous,
    getToken,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
