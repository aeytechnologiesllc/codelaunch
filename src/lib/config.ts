import { publicEnv, readEnv, readListEnv } from "@/lib/env";

export const appConfig = {
  siteUrl: publicEnv.siteUrl || "http://localhost:3000",
  projectFilesBucket: readEnv("SUPABASE_PROJECT_FILES_BUCKET", "project-files"),
  adminEmails: readListEnv("ADMIN_EMAILS").map((value) => value.toLowerCase()),
};

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return appConfig.adminEmails.includes(email.toLowerCase());
}
