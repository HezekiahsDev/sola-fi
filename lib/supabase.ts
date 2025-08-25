import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Resolve configuration from multiple possible sources (process.env, Expo constants, or global)
const getConfig = () => {
  const fromProcess = {
    url: process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
  const expoExtra = (Constants?.expoConfig?.extra as any) ?? (Constants?.manifest?.extra as any) ?? {};
  const fromExpo = {
    url: expoExtra.SUPABASE_URL || expoExtra.EXPO_PUBLIC_SUPABASE_URL,
    key: expoExtra.SUPABASE_ANON_KEY || expoExtra.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
  const fromGlobal = {
    url: (globalThis as any).SUPABASE_URL || (globalThis as any).EXPO_PUBLIC_SUPABASE_URL,
    key: (globalThis as any).SUPABASE_ANON_KEY || (globalThis as any).EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };

  const url = (fromProcess.url || fromExpo.url || fromGlobal.url || '').trim();
  const key = (fromProcess.key || fromExpo.key || fromGlobal.key || '').trim();
  return { url, key };
};

const { url, key } = getConfig();

if (!url || !key) {
  console.warn('[supabase] Missing config. Set SUPABASE_URL & SUPABASE_ANON_KEY (or EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY). Auth calls will return stub errors.');
}

// Provide a safe stub when configuration is missing so the app doesn't crash at import time.
function makeMissingStub(message: string) {
  const err = { message };
  return {
    auth: {
      signUp: async () => ({ data: null, error: err }),
      signInWithPassword: async () => ({ data: null, error: err }),
      getUser: async () => ({ data: { user: null }, error: err }),
    },
    from: () => ({ insert: async () => ({ data: null, error: err }) }),
  } as any;
}

export const supabase = url && key ? createClient(url, key) : makeMissingStub('Supabase not configured: set SUPABASE_URL & SUPABASE_ANON_KEY (or EXPO_PUBLIC_ variants)');
