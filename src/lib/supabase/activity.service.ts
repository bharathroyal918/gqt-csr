import { supabase, isSupabaseConfigured } from "./client";

export interface StudentActivityItem {
  id: string;
  studentId: string;
  title: string;
  description: string;
  type: "registration" | "document" | "exam_start" | "exam_submit" | "interview" | "offer" | "system";
  timestamp: string;
  metadata?: Record<string, any>;
}

export const activityService = {
  async logStudentActivity(
    studentId: string,
    studentName: string,
    title: string,
    description: string,
    type: StudentActivityItem["type"],
    metadata?: Record<string, any>
  ): Promise<void> {
    const item: StudentActivityItem = {
      id: `act-${Date.now()}`,
      studentId,
      title,
      description,
      type,
      timestamp: new Date().toISOString(),
      metadata,
    };

    // 1. Cache locally
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`gqt_activities_${studentId}`);
        const list: StudentActivityItem[] = stored ? JSON.parse(stored) : [];
        list.unshift(item);
        localStorage.setItem(`gqt_activities_${studentId}`, JSON.stringify(list.slice(0, 50)));
      } catch {}
    }

    // 2. Persist to Supabase activities & audit_logs
    if (isSupabaseConfigured) {
      try {
        await supabase.from("activities").insert([
          {
            actor_name: studentName,
            actor_role: "student",
            action_type: type.toUpperCase(),
            description,
            metadata: { studentId, title, ...metadata },
          },
        ]);
      } catch {}

      try {
        await supabase.from("audit_logs").insert([
          {
            action: title.toUpperCase().replace(/ /g, "_"),
            entity_type: "Student",
            entity_id: studentId,
            performed_by: studentName,
            performed_by_role: "student",
            details: description,
          },
        ]);
      } catch {}
    }
  },

  async getStudentActivities(studentId: string): Promise<StudentActivityItem[]> {
    const list: StudentActivityItem[] = [];

    // Local cached activities
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`gqt_activities_${studentId}`);
        if (stored) list.push(...JSON.parse(stored));
      } catch {}
    }

    return list;
  },
};
