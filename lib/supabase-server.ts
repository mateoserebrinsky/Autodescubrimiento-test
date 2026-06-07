import { createClient } from '@supabase/supabase-js';

// Server-side client using service role key for trusted writes from route handlers
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
