import { supabase } from "./supabase";

export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return !!data;
}

export async function setupAdmin(): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // Check if any admin already exists
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    return { success: false, error: "Admin already exists" };
  }

  // First user becomes admin
  const { error } = await supabase
    .from("admin_users")
    .insert({ user_id: user.id, email: user.email });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export const MILESTONE_STAGES = [
  "Project Received",
  "Requirements Review",
  "Design",
  "Frontend Development",
  "Backend Development",
  "Integration & Testing",
  "Client Review",
  "Launch",
] as const;
