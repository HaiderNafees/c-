import { createClient } from '@supabase/supabase-js'

/* ============================================================
   Supabase Client (singleton)
   Single shared instance — avoids "Multiple GoTrueClient"
   warnings and keeps auth session consistent across the app.
   ============================================================ */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
