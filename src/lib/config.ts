export const appConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  projectFilesBucket: process.env.SUPABASE_PROJECT_FILES_BUCKET || "project-files",
  adminEmails: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
};

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return appConfig.adminEmails.includes(email.toLowerCase());
}
