import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSanitizedSupabaseUrl, getSupabaseAnonKey } from "./client";

/**
 * Server-side Supabase client for Next.js Server Components (Read-only cookies)
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getSanitizedSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Handled for Server Components where cookies cannot be directly mutated
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Handled for Server Components
        }
      },
    },
  });
}

/**
 * Server Actions Supabase client (Writable cookies)
 */
export async function createActionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getSanitizedSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}

/**
 * Administrative Supabase client using Service Role Key (when provided)
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined, falling back to anon client.");
    return createServerSupabaseClient();
  }
  const supabaseUrl = getSanitizedSupabaseUrl();
  return createServerClient(supabaseUrl, serviceKey, {
    cookies: {
      get: () => undefined,
      set: () => {},
      remove: () => {},
    },
  });
}
