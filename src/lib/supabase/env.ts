/**
 * Supabase env validation. Auth and database use only Supabase — no other auth URL.
 * NEXT_PUBLIC_SUPABASE_URL must be your project URL from Supabase (e.g. https://xxxx.supabase.co).
 */

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) console.error("DEBUG: NEXT_PUBLIC_SUPABASE_URL is missing in process.env");
  return url;
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function assertSupabaseUrl(url: string | undefined) {
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
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  assertSupabaseUrl(url);
  if (!anonKey?.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in .env.local and in Vercel to your Supabase anon (public) key."
    );
  }
  return { url: url!.trim(), anonKey: anonKey!.trim() };
}

export function getSupabaseServerConfig() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  assertSupabaseUrl(url);
  if (!anonKey?.trim()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return { url: url!.trim(), anonKey: anonKey!.trim() };
}

export function getSupabaseAdminConfig() {
  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  assertSupabaseUrl(url);
  if (!serviceRoleKey?.trim()) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Required for admin actions (create company, etc.)."
    );
  }
  return { url: (url || "").trim(), serviceRoleKey: (serviceRoleKey || "").trim() };
}
