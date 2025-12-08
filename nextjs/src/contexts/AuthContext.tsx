'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

  // Check if current user is whitelisted via secure API endpoint
  const checkWhitelisted = useCallback(async (email: string | undefined): Promise<boolean> => {
    if (!email) return false;

    // Admin is always whitelisted (client-side check for immediate feedback)
    if (email.toLowerCase() === adminEmail?.toLowerCase()) return true;

    // Check whitelist status via secure API (only checks current user's email)
    try {
      const response = await fetch('/api/check-whitelist');
      if (response.ok) {
        const data = await response.json();
        return data.isWhitelisted === true;
      }
    } catch (err) {
      console.error('Failed to check whitelist status:', err);
    }
    return false;
  }, [adminEmail]);

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
