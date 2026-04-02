"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const supabase = new Proxy(
  {} as ReturnType<typeof createSupabaseBrowserClient>,
  {
    get(_target, property) {
      const client = createSupabaseBrowserClient();
      const value = client[property as keyof typeof client];

      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);
