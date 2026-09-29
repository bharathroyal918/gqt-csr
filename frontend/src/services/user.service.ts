import { supabase, isSupabaseConfigured } from "@/supabase/client";
import { UserProfile, UserRole } from "@/types";

export const userService = {
  /**
   * Fetch user profile from Supabase profiles table
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name || data.name || (data.email ? data.email.split("@")[0] : ""),
        avatarUrl: data.avatar_url,
        role: (data.role as UserRole) || "student",
        phone: data.phone,
        collegeId: data.college_id,
        collegeName: data.college_name,
        department: data.department,
        status: data.status || "active",
        twoFactorEnabled: data.two_factor_enabled || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.warn("Error fetching user profile:", err);
      return null;
    }
  },

  /**
   * Update profile details
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.fullName) payload.full_name = updates.fullName;
      if (updates.phone) payload.phone = updates.phone;
      if (updates.avatarUrl) payload.avatar_url = updates.avatarUrl;
      if (updates.department) payload.department = updates.department;

      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId);

      return !error;
    } catch (err) {
      console.error("Error updating profile:", err);
      return false;
    }
  },

  /**
   * Admin: List users across the enterprise
   */
  async listUsers(roleFilter?: UserRole): Promise<UserProfile[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (roleFilter) {
        query = query.eq("role", roleFilter);
      }
      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((d) => ({
        id: d.id,
        email: d.email,
        fullName: d.full_name || d.name || (d.email ? d.email.split("@")[0] : ""),
        avatarUrl: d.avatar_url,
        role: d.role as UserRole,
        phone: d.phone,
        collegeId: d.college_id,
        collegeName: d.college_name,
        department: d.department,
        status: d.status || "active",
        twoFactorEnabled: d.two_factor_enabled || false,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch (err) {
      console.error("Error listing users:", err);
      return [];
    }
  },
};
