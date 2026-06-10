/**
 * Firebase configuration and initialization for Next.js.
 * Uses process.env.NEXT_PUBLIC_ to securely read variables.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Next.js reads these from .env.local locally, and from Vercel settings in production
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app (prevents duplicate initialization during Next.js hot reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase services setup
export const auth = getAuth(app);         // Authentication service
export const db = getFirestore(app);      // Firestore database
export const storage = getStorage(app);   // Cloud Storage

// Google OAuth provider for social login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;