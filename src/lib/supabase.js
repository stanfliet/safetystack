import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client only if credentials exist, otherwise create a dummy that shows a helpful message
let supabase;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "%cSafetyStack: Missing Supabase credentials!\n%cCopy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
    "color: #1e40af; font-size: 16px; font-weight: bold;",
    "color: #b91c1c; font-size: 14px;"
  );
  // Create a mock supabase client so the app doesn't crash
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.reject(new Error("Supabase not configured. See console for instructions.")),
      signUp: () => Promise.reject(new Error("Supabase not configured. See console for instructions.")),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ error: null }),
      update: () => Promise.resolve({ error: null }),
      delete: () => Promise.resolve({ error: null }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null }),
      not: () => Promise.resolve({ data: [], error: null })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
