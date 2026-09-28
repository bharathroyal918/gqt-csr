/**
 * Sanitizes and normalizes the Supabase URL.
 * Removes any accidental '/rest/v1/' or trailing slash appended in environment variables.
 */
export function getSanitizedSupabaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!rawUrl) return "https://dummy-gqt-project.supabase.co";
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim() || "dummy-anon-key-for-local-fallback";
}

export function isSupabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("dummy-gqt-project"));
}
