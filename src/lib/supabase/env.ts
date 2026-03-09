/**
 * Supabase env validation. Auth and database use only Supabase — no other auth URL.
 * NEXT_PUBLIC_SUPABASE_URL must be your project URL from Supabase (e.g. https://xxxx.supabase.co).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertSupabaseUrl(url: string | undefined): asserts url is string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Set it in .env.local (and in Vercel for production) to your Supabase project URL, e.g. https://xxxx.supabase.co"
    );
  }
  if (!url.includes("supabase.co")) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL: must be your Supabase project URL (e.g. https://xxxx.supabase.co). Got: ${url}. Do not use any other auth or API URL.`
    );
  }
}

export function getSupabaseBrowserConfig() {
  assertSupabaseUrl(SUPABASE_URL);
  if (!SUPABASE_ANON_KEY?.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in .env.local and in Vercel to your Supabase anon (public) key."
    );
  }
  return { url: SUPABASE_URL.trim(), anonKey: SUPABASE_ANON_KEY.trim() };
}

export function getSupabaseServerConfig() {
  assertSupabaseUrl(SUPABASE_URL);
  if (!SUPABASE_ANON_KEY?.trim()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return { url: SUPABASE_URL.trim(), anonKey: SUPABASE_ANON_KEY.trim() };
}

export function getSupabaseAdminConfig() {
  assertSupabaseUrl(SUPABASE_URL);
  if (!SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Required for admin actions (create company, etc.)."
    );
  }
  return { url: SUPABASE_URL.trim(), serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY.trim() };
}
