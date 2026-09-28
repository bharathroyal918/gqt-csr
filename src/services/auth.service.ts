import { supabase, isSupabaseConfigured } from "@/supabase/client";
import { UserRole } from "@/types";

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const authService = {
  /**
   * Enterprise email and password authentication
   */
  async signInWithEmail(email: string, password?: string): Promise<AuthResponse<{ email: string; role?: UserRole; id?: string }>> {
    const trimmedEmail = email.trim();

    if (!isSupabaseConfigured) {
      // In local mode without Supabase connection
      return {
        success: true,
        data: { email: trimmedEmail },
      };
    }

    try {
      const pwd = password || "GqtCsr@2026";
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: pwd,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const role = data.user?.user_metadata?.role as UserRole | undefined;

      return {
        success: true,
        data: {
          id: data.user?.id,
          email: data.user?.email || trimmedEmail,
          role,
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      return { success: false, error: msg };
    }
  },

  /**
   * Phone OTP Request (future ready)
   */
  async requestPhoneOtp(phone: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.trim(),
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to send OTP" };
    }
  },

  /**
   * Verify Phone OTP (future ready)
   */
  async verifyPhoneOtp(phone: string, token: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.trim(),
        token: token.trim(),
        type: "sms",
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "OTP verification failed" };
    }
  },

  /**
   * Magic Link Authentication (future ready)
   */
  async sendMagicLink(email: string, redirectTo?: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo || (typeof window !== "undefined" ? window.location.origin : undefined),
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to send magic link" };
    }
  },

  /**
   * Password Reset Request
   */
  async sendPasswordResetEmail(email: string, redirectTo?: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectTo || `${typeof window !== "undefined" ? window.location.origin : ""}/auth/reset-password`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Reset email failed" };
    }
  },

  /**
   * Update User Password
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Password update failed" };
    }
  },

  /**
   * Sign out (with option to sign out everywhere)
   */
  async signOut(options: { everywhere?: boolean } = {}): Promise<AuthResponse> {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut({
          scope: options.everywhere ? "global" : "local",
        });
      }
      // Clear local role cookies if in browser
      if (typeof document !== "undefined") {
        document.cookie = "gqt_active_role=; path=/; max-age=0";
        document.cookie = "gqt_auth_user=; path=/; max-age=0";
      }
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Sign out error" };
    }
  },

  /**
   * Get active session
   */
  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Get current authenticated user
   */
  async getUser() {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  /**
   * Refresh authentication token
   */
  async refreshSession() {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.refreshSession();
    return data.session;
  },
};
