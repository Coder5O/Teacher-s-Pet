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
  getIdToken,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { getUserProfile, upsertUserProfile } from '@/lib/firestore';
import { useAuthStore } from '@/store/authStore';
import type { UserProfile } from '@/types';

// Sets the auth-token cookie the middleware reads
async function setSessionCookie(firebaseUser: { getIdToken: () => Promise<string> }) {
  const idToken = await getIdToken(firebaseUser as Parameters<typeof getIdToken>[0]);
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}

export function useAuth() {
  const { user, isLoading, isInitialized, setUser, setLoading, setInitialized, clearUser } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Set the cookie so middleware recognises this session
          await setSessionCookie(firebaseUser);

          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
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
        // Clear the cookie on sign-out
        await fetch('/api/auth/session', { method: 'DELETE' });
        clearUser();
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setInitialized, clearUser]);

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