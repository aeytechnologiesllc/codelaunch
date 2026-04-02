import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { readRequiredEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  const url = readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components can read cookies but cannot always mutate them.
        }
      },
    },
  });
}
