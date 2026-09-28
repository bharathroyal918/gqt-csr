import { useEffect } from "react";
import { supabase, isSupabaseConfigured } from "./client";

export interface RealtimeSubscriptionOptions {
  table: string;
  schema?: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

/**
 * Custom hook for subscribing to Supabase Realtime postgres changes
 */
export function useRealtimeSubscription({
  table,
  schema = "public",
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: RealtimeSubscriptionOptions) {
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channelName = `realtime:${table}${filter ? `:${filter}` : ""}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema,
          table,
          filter,
        },
        (payload: any) => {
          if (payload.eventType === "INSERT" && onInsert) {
            onInsert(payload.new);
          } else if (payload.eventType === "UPDATE" && onUpdate) {
            onUpdate(payload.new);
          } else if (payload.eventType === "DELETE" && onDelete) {
            onDelete(payload.old);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, filter, onInsert, onUpdate, onDelete]);
}

/**
 * Hook for real-time notification alerts
 */
export function useNotificationsRealtime(onNewNotification: (notification: any) => void) {
  useRealtimeSubscription({
    table: "notifications",
    onInsert: onNewNotification,
  });
}

/**
 * Hook for live interview queue updates
 */
export function useInterviewQueueRealtime(onQueueChange: (interview: any) => void) {
  useRealtimeSubscription({
    table: "interviews",
    onInsert: onQueueChange,
    onUpdate: onQueueChange,
  });
}

/**
 * Hook for live exam attendance tracking
 */
export function useAttendanceRealtime(onAttendanceUpdate: (record: any) => void) {
  useRealtimeSubscription({
    table: "attendance_records",
    onInsert: onAttendanceUpdate,
    onUpdate: onAttendanceUpdate,
  });
}
