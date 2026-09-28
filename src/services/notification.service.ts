import { supabase, isSupabaseConfigured } from "@/supabase/client";
import { DatabaseNotification, UserRole } from "@/types";

export const notificationService = {
  /**
   * Fetch active notifications for a role or specific user
   */
  async getNotifications(role?: UserRole, userId?: string): Promise<DatabaseNotification[]> {
    if (!isSupabaseConfigured) {
      // Fallback in-memory notification seed
      return [
        {
          id: "notif-1",
          title: "CSR Drive Approved",
          message: "RVCE Bangalore CSR Drive 2026 has been approved by CSR Director.",
          category: "drives",
          channel: "in_app",
          type: "success",
          actionUrl: "/csr-manager/drives",
          read: false,
          archived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: "notif-2",
          title: "Interviews Scheduled",
          message: "14 candidates shortlisted for Technical Round 1 tomorrow at 10:00 AM.",
          category: "hr",
          channel: "in_app",
          type: "info",
          actionUrl: "/hr/interviews",
          read: false,
          archived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
        {
          id: "notif-3",
          title: "Offer Acceptance Confirmed",
          message: "Bharath Royal (1RV22CS101) accepted GQT Software Engineer Offer.",
          category: "offers",
          channel: "in_app",
          type: "success",
          actionUrl: "/hr/offer-letters",
          read: true,
          archived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        },
        {
          id: "notif-4",
          title: "System Maintenance Notice",
          message: "Scheduled cloud database optimization at 02:00 AM IST.",
          category: "system",
          channel: "in_app",
          type: "warning",
          read: true,
          archived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
        },
      ];
    }

    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(30);

      if (role) {
        query = query.or(`target_role.eq.${role},target_role.is.null`);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((item) => ({
        id: item.id,
        userId: item.user_id,
        targetRole: item.target_role,
        title: item.title,
        message: item.message,
        category: item.category || "system",
        channel: item.channel || "in_app",
        type: item.type || "info",
        actionUrl: item.action_url,
        read: Boolean(item.read),
        archived: Boolean(item.archived),
        createdAt: item.created_at,
      }));
    } catch (err) {
      console.warn("Error fetching notifications:", err);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      return !error;
    } catch (err) {
      console.error("Error updating notification:", err);
      return false;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(role?: UserRole, userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      let query = supabase
        .from("notifications")
        .update({ read: true })
        .eq("read", false);

      if (role) {
        query = query.eq("target_role", role);
      }
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { error } = await query;
      return !error;
    } catch (err) {
      console.error("Error marking all read:", err);
      return false;
    }
  },

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ archived: true })
        .eq("id", notificationId);

      return !error;
    } catch (err) {
      console.error("Error archiving notification:", err);
      return false;
    }
  },

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    onNewNotification: (notif: DatabaseNotification) => void,
    role?: UserRole
  ) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newRow = payload.new as any;
          if (!role || !newRow.target_role || newRow.target_role === role) {
            onNewNotification({
              id: newRow.id,
              userId: newRow.user_id,
              targetRole: newRow.target_role,
              title: newRow.title,
              message: newRow.message,
              category: newRow.category || "system",
              channel: newRow.channel || "in_app",
              type: newRow.type || "info",
              actionUrl: newRow.action_url,
              read: false,
              archived: false,
              createdAt: newRow.created_at || new Date().toISOString(),
            });
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};
