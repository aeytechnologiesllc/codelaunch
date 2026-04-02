"use client";

import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    const url = publicEnv.supabaseUrl;
    const anonKey = publicEnv.supabaseAnonKey;

    if (!url || !anonKey) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
