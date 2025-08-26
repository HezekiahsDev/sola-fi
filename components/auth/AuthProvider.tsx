import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextValue {
  user: any; // Supabase user type (avoid importing types to keep tree small)
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>; 
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchSession();
      if (mounted) setLoading(false);
    })();
  const { data: sub } = supabase.auth.onAuthStateChange((_event: any, sess: any) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [fetchSession]);

  // Route guard effect
  useEffect(() => {
    if (loading) return; // wait for session fetch
    const inAuth = segments[0] === 'auth';
    const inTabs = segments[0] === '(tabs)';
    if (!user && inTabs) {
      router.replace('/auth/login');
    } else if (user && inAuth) {
      router.replace('/(tabs)');
    }
  }, [segments, user, loading, router]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    } catch (e: any) {
      return { error: e.message || 'Unknown error' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try { await supabase.auth.signOut(); } catch {}
    // local clear
    setSession(null);
    setUser(null);
    try { (supabase as any).auth?.storage?.removeItem?.('sb-' + (supabase as any)._storageKey + '-auth-token'); } catch {}
  }, []);

  const refresh = useCallback(async () => { await fetchSession(); }, [fetchSession]);

  const value: AuthContextValue = { user, session, loading, signIn, signOut, refresh };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider missing');
  return ctx;
}
