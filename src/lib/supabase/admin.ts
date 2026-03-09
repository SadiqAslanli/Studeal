import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "./env";

/**
 * Server-only. Use for admin actions (e.g. creating Company users).
 * Auth and DB use only Supabase — no other URL.
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
