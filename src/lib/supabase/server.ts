import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseServerConfig } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseServerConfig();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
<<<<<<< HEAD
        setAll(cookiesToSet: any[]) {
=======
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
>>>>>>> 95e31d7443cd26e1ad1eea4ef2a750952a83b7f4
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore in Server Components
          }
        },
      },
    }
  );
}
