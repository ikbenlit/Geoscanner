import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug Firebase config (alleen voor troubleshooting)
console.log('🔥 Firebase config geladen, API key aanwezig:', !!firebaseConfig.apiKey);
console.log('🔥 Firebase config params aanwezig:', 
  Object.keys(firebaseConfig).map(key => `${key}: ${!!firebaseConfig[key as keyof typeof firebaseConfig]}`).join(', ')
);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Debug informatie
console.log('🔥 Firebase app geïnitialiseerd:', !!app);

// Initialize Auth
const auth = getAuth(app);
console.log('🔥 Firebase auth geïnitialiseerd:', !!auth);

export { auth };
