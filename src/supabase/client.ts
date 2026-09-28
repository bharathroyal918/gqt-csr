import { createBrowserClient } from "@supabase/ssr";

export function getSanitizedSupabaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
}

export function isSupabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
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
