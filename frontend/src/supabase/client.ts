import { createBrowserClient } from "@supabase/ssr";

const FALLBACK_URL = "https://dummy-gqt-project.supabase.co";
const FALLBACK_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-fallback";

export function getSanitizedSupabaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!rawUrl.trim()) return FALLBACK_URL;
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseAnonKey(): string {
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  return key || FALLBACK_ANON_KEY;
}

export function isSupabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("dummy-gqt-project"));
}

export const isSupabaseConfigured = isSupabaseReady();

/**
 * Creates and returns the Supabase browser client with cookie session persistence.
 */
export function createClient() {
  const supabaseUrl = getSanitizedSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
