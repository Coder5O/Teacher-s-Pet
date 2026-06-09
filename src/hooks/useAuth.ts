/**
 * useAuth hook — manages Firebase authentication state.
 * This hook listens to auth changes and syncs with Zustand store.
 * Import this in your root layout to initialize auth.
 */

'use client';

import { useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { getUserProfile, upsertUserProfile } from '@/lib/firestore';
import { useAuthStore } from '@/store/authStore';
import type { UserProfile } from '@/types';

export function useAuth() {
  const { user, isLoading, isInitialized, setUser, setLoading, setInitialized, clearUser } =
    useAuthStore();

  // Listen for Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Try to fetch existing Firestore profile
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            // First time login — create basic profile
            const newProfile: Partial<UserProfile> = {
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? '',
              photoURL: firebaseUser.photoURL ?? undefined,
              role: 'teacher',
              subscription: 'free',
              onboardingComplete: false,
              generationsThisMonth: 0,
            };
            await upsertUserProfile(firebaseUser.uid, newProfile);
            profile = await getUserProfile(firebaseUser.uid);
          }
          setUser(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        clearUser();
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setInitialized, clearUser]);

  // ─── Auth Methods ────────────────────────────────────────────────────────────

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(firebaseUser, { displayName });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    clearUser();
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
  };
}
