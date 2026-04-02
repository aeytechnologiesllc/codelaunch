import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function signUp(email: string, password: string, metadata?: { full_name?: string; company?: string }) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUser() {
  const supabase = createSupabaseBrowserClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getSession() {
  const supabase = createSupabaseBrowserClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}
