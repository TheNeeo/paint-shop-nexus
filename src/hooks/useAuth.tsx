import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (isMounted) {
              setSession(session);
              setUser(session?.user ?? null);
              setLoading(false);
            }
          }
        );

        // THEN check for existing session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (isMounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        } catch (error) {
          console.warn('Failed to get session:', error);
          // If we fail to get session, still mark as not loading
          if (isMounted) {
            setLoading(false);
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.warn('Auth initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    Promise.resolve(cleanup).then(fn => fn?.());

    return () => {
      isMounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Sign out error:', error);
      // Clear session locally even if sign out fails
      setSession(null);
      setUser(null);
    }
  };

  // Manual token refresh on an interval
  useEffect(() => {
    if (!session?.refresh_token) return;

    const refreshInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          console.warn('Token refresh failed:', error);
          // On error, check if session is still valid
          try {
            const { data: currentSession } = await supabase.auth.getSession();
            if (!currentSession.session) {
              setSession(null);
              setUser(null);
            }
          } catch (e) {
            console.warn('Failed to check session:', e);
          }
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (error) {
        console.warn('Token refresh error:', error);
      }
    }, 120000); // Refresh every 2 minutes instead of 1 to reduce network load

    return () => clearInterval(refreshInterval);
  }, [session?.refresh_token]);

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
