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

// Optional secure storage (if expo-secure-store installed). Falls back to memory map.
let memoryStore: Record<string,string> = {};
let SecureStoreAdapter: any = {
  getItem: async (k: string) => memoryStore[k] ?? null,
  setItem: async (k: string, v: string) => { memoryStore[k] = v; },
  removeItem: async (k: string) => { delete memoryStore[k]; },
};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SecureStore = require('expo-secure-store');
  if (SecureStore?.getItemAsync) {
    SecureStoreAdapter = {
      getItem: (k: string) => SecureStore.getItemAsync(k),
      setItem: (k: string, v: string) => SecureStore.setItemAsync(k, v),
      removeItem: (k: string) => SecureStore.deleteItemAsync(k),
    };
  }
} catch {
  // module not installed; memory fallback active
}

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

export const supabase = url && key ? createClient(url, key, {
  auth: {
    storage: SecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // not needed for native
  },
}) : makeMissingStub('Supabase not configured: set SUPABASE_URL & SUPABASE_ANON_KEY (or EXPO_PUBLIC_ variants)');
