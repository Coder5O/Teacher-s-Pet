'use client';
/**
 * AuthProvider — initializes the Firebase auth listener app-wide.
 * Wrap at root level so auth state is available everywhere.
 */
import { useAuth } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // This call sets up the onAuthStateChanged listener for the whole app
  useAuth();
  return <>{children}</>;
}
