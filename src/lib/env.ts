export function normalizeEnvValue(value?: string | null) {
  if (!value) return "";

  const trimmed = value.trim();
  const unwrapped =
    trimmed.startsWith('"') && trimmed.endsWith('"')
      ? trimmed.slice(1, -1)
      : trimmed.startsWith("'") && trimmed.endsWith("'")
        ? trimmed.slice(1, -1)
        : trimmed;

  return unwrapped.replace(/\\n/g, "\n").trim();
}

export function readEnv(name: string, fallback = "") {
  return normalizeEnvValue(process.env[name]) || fallback;
}

export function readRequiredEnv(name: string) {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export function readListEnv(name: string) {
  return readEnv(name)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export const publicEnv = {
  siteUrl: normalizeEnvValue(process.env.NEXT_PUBLIC_SITE_URL),
  supabaseUrl: normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
};
