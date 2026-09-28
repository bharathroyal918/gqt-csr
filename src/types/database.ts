import { UserRole } from "./index";

/**
 * Enterprise User Profile matching Supabase `profiles` table schema
 */
export interface UserProfile {
  id: string; // references auth.users.id
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  phone?: string;
  collegeId?: string;
  collegeName?: string;
  department?: string;
  status: "active" | "inactive" | "suspended";
  twoFactorEnabled: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Enterprise Roles table schema
 */
export interface RoleRecord {
  id: string;
  roleKey: UserRole;
  displayName: string;
  description: string;
  portalPrefix: string;
  isReadOnly: boolean;
  createdAt: string;
}

/**
 * Permission Definition
 */
export interface PermissionRecord {
  id: string;
  code: string;
  name: string;
  module: "drives" | "colleges" | "crm" | "students" | "exams" | "interviews" | "offers" | "reports" | "users" | "settings";
  description: string;
}

/**
 * Role Permission Mapping table schema
 */
export interface RolePermissionMapping {
  role: UserRole;
  permissionCode: string;
}

/**
 * Enterprise Notification table schema
 */
export type NotificationCategory = "drives" | "hr" | "offers" | "exams" | "system" | "colleges";
export type NotificationChannel = "in_app" | "email" | "whatsapp" | "push";

export interface DatabaseNotification {
  id: string;
  userId?: string;
  targetRole?: UserRole;
  title: string;
  message: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  type: "info" | "success" | "warning" | "error";
  actionUrl?: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

/**
 * Enterprise Activity & Audit Log schema
 */
export interface ActivityLogRecord {
  id: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
