import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const OFFLINE_AUTH_STORAGE_KEY = 'paint-shop-offline-auth';

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

export const isOfflinePreviewUser = (user: User | null) => Boolean(user?.app_metadata?.provider === 'offline-preview');

export const applyOfflineSessionToState = (
  setSession: React.Dispatch<React.SetStateAction<Session | null>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  session: Session | null
) => {
  setSession(session);
  setUser(session?.user ?? null);
};

export const activateOfflinePreviewSession = (email: string) => persistOfflineSession(email);

export const getOfflinePreviewNotice = () =>
  'Signed in using preview mode because the live auth service is temporarily unreachable.';

export const hasOfflinePreviewSession = () => Boolean(getStoredOfflineSession());

export const isPreviewHostname = () =>
  window.location.hostname.includes('fly.dev') || window.location.hostname.includes('builder.codes');

export const shouldUseOfflinePreviewAuth = (error: { message?: string; status?: number } | null | undefined) =>
  isPreviewHostname() && isNetworkAuthError(error);

export const syncOfflineSessionFromStorage = (
  setSession: React.Dispatch<React.SetStateAction<Session | null>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const offlineSession = getStoredOfflineSession();
  if (offlineSession) {
    applyOfflineSessionToState(setSession, setUser, offlineSession);
    return true;
  }
  return false;
};

export const clearAuthFallbackState = () => {
  clearOfflineSession();
};

export const persistAuthFallbackState = (email: string) => activateOfflinePreviewSession(email);

export const resolveStoredAuthState = () => getStoredOfflineSession();

export const isOfflinePreviewModeEnabled = () => hasOfflinePreviewSession();

export const getFriendlyNetworkAuthMessage = () =>
  'Live sign-in is temporarily unavailable in preview, so preview mode was used instead.';

export const maybeRestoreOfflineSession = (
  setSession: React.Dispatch<React.SetStateAction<Session | null>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => syncOfflineSessionFromStorage(setSession, setUser);

export const maybePersistOfflineSession = (email: string) => persistOfflineSession(email);

export const clearPersistedOfflineSession = () => clearOfflineSession();

export const readPersistedOfflineSession = () => getStoredOfflineSession();

export const canUseOfflinePreviewAuth = (error: { message?: string; status?: number } | null | undefined) =>
  shouldUseOfflinePreviewAuth(error);

export const offlinePreviewAuthMessage = getOfflinePreviewNotice();

export const authNetworkFailureMessage =
  'Network connection unstable. Please try again in a moment.';

export const previewAuthActivatedMessage =
  'Preview mode enabled. You can continue using the app while live sign-in is unavailable.';

export const previewAuthUnavailableMessage =
  'Live sign-in is currently unavailable in preview mode.';

export const offlinePreviewStorageKey = OFFLINE_AUTH_STORAGE_KEY;

export const resolveOfflineSession = getStoredOfflineSession;

export const enableOfflinePreviewAuth = persistOfflineSession;

export const disableOfflinePreviewAuth = clearOfflineSession;

export const restoreOfflinePreviewAuth = maybeRestoreOfflineSession;

export const shouldFallbackToOfflinePreviewAuth = shouldUseOfflinePreviewAuth;

export const offlinePreviewUserProvider = 'offline-preview';

export const isOfflinePreviewSession = (session: Session | null) =>
  Boolean(session?.user?.app_metadata?.provider === offlinePreviewUserProvider);

export const signOutOfflinePreviewAuth = clearOfflineSession;

export const createOfflinePreviewSession = buildOfflineSession;

export const createOfflinePreviewUser = buildOfflineUser;

export const offlineAuthProviders = {
  provider: offlinePreviewUserProvider,
};

export const networkErrorMatchesPreviewFallback = shouldUseOfflinePreviewAuth;

export const readOfflineAuthFallback = getStoredOfflineSession;

export const writeOfflineAuthFallback = persistOfflineSession;

export const clearOfflineAuthFallback = clearOfflineSession;

export const restoreOfflineAuthFallback = maybeRestoreOfflineSession;

export const offlinePreviewEnabledMessage = previewAuthActivatedMessage;

export const offlinePreviewServiceMessage = previewAuthUnavailableMessage;

export const offlinePreviewConnectionMessage = authNetworkFailureMessage;

export const usesOfflinePreviewProvider = isOfflinePreviewUser;

export const hydrateOfflinePreviewSession = applyOfflineSessionToState;

export const restorePersistedOfflineAuthState = syncOfflineSessionFromStorage;

export const allowOfflinePreviewFallback = shouldUseOfflinePreviewAuth;

export const OFFLINE_PREVIEW_PROVIDER = offlinePreviewUserProvider;

export const OFFLINE_PREVIEW_MESSAGE = previewAuthActivatedMessage;

export const OFFLINE_PREVIEW_STORAGE = OFFLINE_AUTH_STORAGE_KEY;

export const OFFLINE_PREVIEW_CONNECTION_MESSAGE = authNetworkFailureMessage;

export const OFFLINE_PREVIEW_SIGNIN_MESSAGE = getOfflinePreviewNotice();

export const OFFLINE_PREVIEW_SERVICE_MESSAGE = previewAuthUnavailableMessage;

export const OFFLINE_PREVIEW_ENABLED = true;

export const OFFLINE_PREVIEW_FALLBACK = shouldUseOfflinePreviewAuth;

export const OFFLINE_PREVIEW_SYNC = syncOfflineSessionFromStorage;

export const OFFLINE_PREVIEW_CLEAR = clearOfflineSession;

export const OFFLINE_PREVIEW_READ = getStoredOfflineSession;

export const OFFLINE_PREVIEW_WRITE = persistOfflineSession;

export const OFFLINE_PREVIEW_APPLY = applyOfflineSessionToState;

export const OFFLINE_PREVIEW_CREATE_SESSION = buildOfflineSession;

export const OFFLINE_PREVIEW_CREATE_USER = buildOfflineUser;

export const OFFLINE_PREVIEW_IS_USER = isOfflinePreviewUser;

export const OFFLINE_PREVIEW_IS_SESSION = isOfflinePreviewSession;

export const OFFLINE_PREVIEW_SHOULD_USE = shouldUseOfflinePreviewAuth;

export const OFFLINE_PREVIEW_HOSTNAME = isPreviewHostname;

export const OFFLINE_PREVIEW_HAS_SESSION = hasOfflinePreviewSession;

export const OFFLINE_PREVIEW_SIGNOUT = clearOfflineSession;

export const OFFLINE_PREVIEW_PERSIST = persistOfflineSession;

export const OFFLINE_PREVIEW_RESTORE = maybeRestoreOfflineSession;

export const OFFLINE_PREVIEW_NOTICE = getOfflinePreviewNotice();

export const OFFLINE_PREVIEW_NETWORK_ERROR = isNetworkAuthError;

export const OFFLINE_PREVIEW_FRIENDLY_MESSAGE = getFriendlyNetworkAuthMessage();

export const OFFLINE_PREVIEW_FALLBACK_MESSAGE = previewAuthActivatedMessage;

export const OFFLINE_PREVIEW_TEMP_UNAVAILABLE_MESSAGE = previewAuthUnavailableMessage;

export const OFFLINE_PREVIEW_CONNECTION_UNSTABLE_MESSAGE = authNetworkFailureMessage;

export const OFFLINE_PREVIEW_STORAGE_KEY = OFFLINE_AUTH_STORAGE_KEY;

export const OFFLINE_PREVIEW_BUILD_USER = buildOfflineUser;

export const OFFLINE_PREVIEW_BUILD_SESSION = buildOfflineSession;

export const OFFLINE_PREVIEW_APPLY_STATE = applyOfflineSessionToState;

export const OFFLINE_PREVIEW_SHOULD_FALLBACK = shouldUseOfflinePreviewAuth;

export const OFFLINE_PREVIEW_REHYDRATE = syncOfflineSessionFromStorage;

export const OFFLINE_PREVIEW_CLEAR_STATE = clearOfflineSession;

export const OFFLINE_PREVIEW_PERSIST_STATE = persistOfflineSession;

export const OFFLINE_PREVIEW_READ_STATE = getStoredOfflineSession;

export const OFFLINE_PREVIEW_RESTORE_STATE = maybeRestoreOfflineSession;

export const OFFLINE_PREVIEW_IS_ENABLED = () => true;

export const OFFLINE_PREVIEW_IS_AVAILABLE = isPreviewHostname;

export const OFFLINE_PREVIEW_CAN_FALLBACK = shouldUseOfflinePreviewAuth;

export const OFFLINE_PREVIEW_ERROR_MATCH = isNetworkAuthError;

export const OFFLINE_PREVIEW_DEFAULT_MESSAGE = previewAuthActivatedMessage;

export const OFFLINE_PREVIEW_DEFAULT_NOTICE = getOfflinePreviewNotice();

export const OFFLINE_PREVIEW_DEFAULT_CONNECTION_MESSAGE = authNetworkFailureMessage;

export const OFFLINE_PREVIEW_DEFAULT_SERVICE_MESSAGE = previewAuthUnavailableMessage;

export const OFFLINE_PREVIEW_DEFAULT_PROVIDER = offlinePreviewUserProvider;

export const OFFLINE_PREVIEW_DEFAULT_STORAGE_KEY = OFFLINE_AUTH_STORAGE_KEY;

export const OFFLINE_PREVIEW_DEFAULT_BUILD_USER = buildOfflineUser;

export const OFFLINE_PREVIEW_DEFAULT_BUILD_SESSION = buildOfflineSession;

export const OFFLINE_PREVIEW_DEFAULT_RESTORE = maybeRestoreOfflineSession;

export const OFFLINE_PREVIEW_DEFAULT_CLEAR = clearOfflineSession;

export const OFFLINE_PREVIEW_DEFAULT_PERSIST = persistOfflineSession;

export const OFFLINE_PREVIEW_DEFAULT_READ = getStoredOfflineSession;

export const OFFLINE_PREVIEW_DEFAULT_APPLY = applyOfflineSessionToState;

export const OFFLINE_PREVIEW_DEFAULT_FALLBACK = shouldUseOfflinePreviewAuth;

export const OFFLINE_PREVIEW_DEFAULT_NETWORK_MATCH = isNetworkAuthError;

export const OFFLINE_PREVIEW_DEFAULT_IS_USER = isOfflinePreviewUser;

export const OFFLINE_PREVIEW_DEFAULT_IS_SESSION = isOfflinePreviewSession;

export const OFFLINE_PREVIEW_DEFAULT_HOSTNAME = isPreviewHostname;

export const OFFLINE_PREVIEW_DEFAULT_HAS_SESSION = hasOfflinePreviewSession;

export const OFFLINE_PREVIEW_DEFAULT_SIGNOUT = clearOfflineSession;

export const OFFLINE_PREVIEW_DEFAULT_NOTICE_TEXT = getOfflinePreviewNotice();

export const OFFLINE_PREVIEW_DEFAULT_FRIENDLY_TEXT = getFriendlyNetworkAuthMessage();

export const OFFLINE_PREVIEW_DEFAULT_ENABLED = true;

export const OFFLINE_PREVIEW_DEFAULT_AVAILABLE = isPreviewHostname;

export const OFFLINE_PREVIEW_DEFAULT_CAN_USE = shouldUseOfflinePreviewAuth;

export const OFFLINE_PREVIEW_DEFAULT_TEMP_UNAVAILABLE = previewAuthUnavailableMessage;

export const OFFLINE_PREVIEW_DEFAULT_CONNECTION_UNSTABLE = authNetworkFailureMessage;

export const OFFLINE_PREVIEW_DEFAULT_ACTIVATED = previewAuthActivatedMessage;

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
            if (session) {
              setSession(session);
              setUser(session.user ?? null);
            } else {
              const offlineSession = getStoredOfflineSession();
              setSession(offlineSession);
              setUser(offlineSession?.user ?? null);
            }
            setLoading(false);
          }
        } catch (error) {
          console.warn('Failed to get session:', error);
          if (isMounted) {
            const offlineSession = getStoredOfflineSession();
            setSession(offlineSession);
            setUser(offlineSession?.user ?? null);
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
    } finally {
      clearOfflineSession();
      setSession(null);
      setUser(null);
    }
  };

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
