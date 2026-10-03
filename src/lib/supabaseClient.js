import { createClient } from '@supabase/supabase-js';

// These environment variables will be stored in a .env file later
// For now, these are placeholders so the app doesn't crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



// Globally wipe sensitive OAuth tokens from the URL instantly upon sign in
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }
});
