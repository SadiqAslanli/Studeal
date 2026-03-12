"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseBrowserConfig } from "./env";

// Singleton instance to avoid "Lock broken" AbortErrors from multiple clients
// competing for the Web Locks API during auth state changes.
let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClientInstance) return browserClientInstance;
  const { url, anonKey } = getSupabaseBrowserConfig();
  browserClientInstance = createBrowserClient(url, anonKey);
  return browserClientInstance;
}
