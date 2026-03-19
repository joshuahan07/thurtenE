import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't throw hard to avoid breaking local dev if env isn't set yet.
  // Callers should still handle failures from inserts/selects.
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

