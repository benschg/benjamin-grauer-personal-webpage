'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

const AUTH_REDIRECT_KEY = 'auth_redirect_path';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isWhitelisted: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isWhitelisted: false,
    loading: true,
    error: null,
  });

  const supabase = createClient();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Cache whitelisted emails from database
  const whitelistedEmailsRef = useRef<string[]>([]);
  const whitelistFetchedRef = useRef(false);

  // Fetch whitelisted emails from database
  const fetchWhitelistedEmails = useCallback(async () => {
    if (whitelistFetchedRef.current) return whitelistedEmailsRef.current;

    try {
      const response = await fetch('/api/whitelisted-emails');
      if (response.ok) {
        const data = await response.json();
        whitelistedEmailsRef.current = (data.emails || []).map((e: { email: string }) => e.email.toLowerCase());
        whitelistFetchedRef.current = true;
      }
    } catch (err) {
      console.error('Failed to fetch whitelisted emails:', err);
    }
    return whitelistedEmailsRef.current;
  }, []);

  const checkWhitelisted = useCallback(async (email: string | undefined): Promise<boolean> => {
    if (!email) return false;
    const lowerEmail = email.toLowerCase();
    // Admin is always whitelisted
    if (lowerEmail === adminEmail?.toLowerCase()) return true;

    const whitelistedEmails = await fetchWhitelistedEmails();
    return whitelistedEmails.includes(lowerEmail);
  }, [adminEmail, fetchWhitelistedEmails]);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return;
      }

      const user = session?.user ?? null;
      const isWhitelisted = await checkWhitelisted(user?.email);
      setState({
        user,
        isAdmin: user?.email === adminEmail,
        isWhitelisted,
        loading: false,
        error: null,
      });
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        const isWhitelisted = await checkWhitelisted(user?.email);
        setState({
          user,
          isAdmin: user?.email === adminEmail,
          isWhitelisted,
          loading: false,
          error: null,
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, adminEmail, checkWhitelisted]);

  const signIn = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Store current path in localStorage for retrieval after OAuth callback
    const currentPath = window.location.pathname;
    localStorage.setItem(AUTH_REDIRECT_KEY, currentPath);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      localStorage.removeItem(AUTH_REDIRECT_KEY);
      setState(prev => ({ ...prev, loading: false, error: error.message }));
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const { error } = await supabase.auth.signOut();

    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
    }
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the key for use in the callback route
export { AUTH_REDIRECT_KEY };
