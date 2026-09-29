import { UserRole } from "@/types";

/**
 * Row Level Security (RLS) Policy Architecture & Helpers
 *
 * These helpers define the enterprise security boundaries for the GQT CSR Drive Platform.
 * They prepare client-side and server-side query filters, and serve as templates
 * for future Supabase SQL Row Level Security policies.
 */

export interface SecurityContext {
  userId: string;
  role: UserRole;
  collegeId?: string;
  department?: string;
}

/**
 * Student Policy Helper
 * Strict isolation: Students can only read/write their own records,
 * their assigned exam, their own interview status, and their own offer letter.
 */
export const studentPolicyHelper = {
  canAccessProfile: (context: SecurityContext, targetStudentId: string): boolean => {
    return context.role === "student" && context.userId === targetStudentId;
  },

  canAccessExam: (context: SecurityContext, studentId: string): boolean => {
    return context.role === "student" && context.userId === studentId;
  },

  canAccessOfferLetter: (context: SecurityContext, studentId: string): boolean => {
    return context.role === "student" && context.userId === studentId;
  },

  getSqlPolicyCondition: (): string => {
    return `auth.uid() = student_id`;
  },
};

/**
 * HR Policy Helper
 * Scoped access: HR recruiters can access candidates, interviews, and offers
 * for drives/colleges assigned to their recruiter ID or team.
 */
export const hrPolicyHelper = {
  canAccessCandidate: (context: SecurityContext, candidateId: string, assignedRecruiterId?: string): boolean => {
    if (context.role !== "hr" && context.role !== "hr_recruiter") return false;
    if (!assignedRecruiterId) return true; // team-wide drive access
    return assignedRecruiterId === context.userId;
  },

  canEvaluateInterview: (context: SecurityContext, interviewerId: string): boolean => {
    return (context.role === "hr" || context.role === "hr_recruiter") && context.userId === interviewerId;
  },

  getSqlPolicyCondition: (): string => {
    return `auth.jwt() ->> 'role' IN ('hr', 'hr_recruiter') AND (assigned_hr_id = auth.uid() OR is_shared_drive = true)`;
  },
};

/**
 * Super Admin Policy Helper
 * Omnipresent clearance: Super Admins bypass tenant/college restrictions
 * and have unrestricted access across all portals and tables.
 */
export const adminPolicyHelper = {
  hasFullAccess: (context: SecurityContext): boolean => {
    return context.role === "super_admin";
  },

  getSqlPolicyCondition: (): string => {
    return `auth.jwt() ->> 'role' = 'super_admin'`;
  },
};

/**
 * Management Policy Helper
 * Read-only policy: Executive leadership has read-only clearance to aggregated metrics,
 * reports, audit trails, and college partnerships, but zero mutation access.
 */
export const managementPolicyHelper = {
  isReadOnlyAuthorized: (context: SecurityContext, action: "select" | "insert" | "update" | "delete"): boolean => {
    if (context.role !== "management") return false;
    return action === "select";
  },

  getSqlPolicyCondition: (action: "SELECT" | "INSERT" | "UPDATE" | "DELETE"): string => {
    if (action === "SELECT") {
      return `auth.jwt() ->> 'role' = 'management'`;
    }
    return `false`; // Strict write prevention for management
  },
};

/**
 * Placement Officer (PTO) Policy Helper
 * Scoped to the officer's specific college
 */
export const ptoPolicyHelper = {
  canAccessCollegeData: (context: SecurityContext, collegeId: string): boolean => {
    if (context.role !== "pto" && context.role !== "placement_officer") return false;
    return context.collegeId === collegeId;
  },
};
