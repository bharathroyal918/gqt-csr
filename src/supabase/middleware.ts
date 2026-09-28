import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSanitizedSupabaseUrl, getSupabaseAnonKey } from "./client";
import { UserRole } from "@/types";

/**
 * Middleware session updater for Supabase Auth in Next.js
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = getSanitizedSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  let userRole: UserRole | undefined;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userRole = (user.user_metadata?.role as UserRole) || undefined;
    }
  } catch (error) {
    // If Supabase is offline or fails, middleware continues gracefully
    console.warn("Supabase middleware auth check failed:", error);
  }

  return { response, userRole };
}
