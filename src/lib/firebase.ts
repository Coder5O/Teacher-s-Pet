/**
 * Firebase configuration and initialization.
 * Hardcoded credentials version.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase project configuration with your actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyCxpaWEr0JdtTcQajvzkCI3JGxCJPLysLY",
  authDomain: "teacher-s-pet-ee773.firebaseapp.com",
  projectId: "teacher-s-pet-ee773",
  storageBucket: "teacher-s-pet-ee773.firebasestorage.app",
  messagingSenderId: "1070592708644",
  appId: "1:1070592708644:web:3fba4eaf80cfbbbfe748b1",
  measurementId: "G-3PT916HY6W",
};

// Initialize Firebase app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);         
export const db = getFirestore(app);      
export const storage = getStorage(app);   

// Google OAuth provider for social login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;