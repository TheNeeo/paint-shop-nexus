import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const OFFLINE_AUTH_STORAGE_KEY = 'paint-shop-offline-auth';

// Helper functions for offline preview mode
const buildOfflineUser = (email: string): User => ({
  id: `offline-${email}`,
  app_metadata: { provider: 'offline-preview' },
  user_metadata: { full_name: email.split('@')[0], offlinePreview: true },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email,
}) as User;

const buildOfflineSession = (email: string): Session => ({
  access_token: `offline-access-token-${email}`,
  refresh_token: `offline-refresh-token-${email}`,
  expires_in: 60 * 60 * 24,
  expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  token_type: 'bearer',
  user: buildOfflineUser(email),
});

// Exported utility functions for offline preview mode
export const isNetworkAuthError = (error: { message?: string; status?: number } | null | undefined) =>
  Boolean(
    error?.status === 503 ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('Load failed') ||
    error?.message?.includes('NETWORK_FAILURE') ||
    error?.message?.includes('Service Unavailable')
  );

export const getStoredOfflineSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(OFFLINE_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.user?.email) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const persistOfflineSession = (email: string) => {
  const session = buildOfflineSession(email);
  localStorage.setItem(OFFLINE_AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
};

export const clearOfflineSession = () => {
  localStorage.removeItem(OFFLINE_AUTH_STORAGE_KEY);
};

export const isOfflinePreviewUser = (user: User | null) => 
  Boolean(user?.app_metadata?.provider === 'offline-preview');

export const isPreviewHostname = () =>
  window.location.hostname.includes('fly.dev') || window.location.hostname.includes('builder.codes');

export const shouldUseOfflinePreviewAuth = (error: { message?: string; status?: number } | null | undefined) =>
  isPreviewHostname() && isNetworkAuthError(error);

export const getOfflinePreviewNotice = () =>
  'Signed in using preview mode because the live auth service is temporarily unreachable.';

export const hasOfflinePreviewSession = () => 
  Boolean(getStoredOfflineSession());

// Auth Context and Provider
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            if (isMounted) {
              setSession(newSession);
              setUser(newSession?.user ?? null);
              setLoading(false);
            }
          }
        );

        unsubscribe = () => subscription.unsubscribe();

        // Try to get current session with timeout
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
          );

          const { data: { session: currentSession } } = await Promise.race([
            supabase.auth.getSession(),
            timeoutPromise
          ]);

          if (isMounted) {
            if (currentSession) {
              setSession(currentSession);
              setUser(currentSession.user ?? null);
            } else {
              // Check for offline preview session
              const offlineSession = getStoredOfflineSession();
              if (offlineSession) {
                setSession(offlineSession);
                setUser(offlineSession.user ?? null);
              }
            }
            setLoading(false);
          }
        } catch (error) {
          // Session fetch failed or timed out
          if (isMounted) {
            const offlineSession = getStoredOfflineSession();
            if (offlineSession) {
              setSession(offlineSession);
              setUser(offlineSession.user ?? null);
            }
            setLoading(false);
          }
        }
      } catch (error) {
        console.warn('Auth initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Sign out error:', error);
    } finally {
      clearOfflineSession();
      setSession(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
