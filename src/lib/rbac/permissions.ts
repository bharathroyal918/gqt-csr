import { UserRole } from "@/types";
export type { UserRole };

export type PermissionCode =
  | "drives:view"
  | "drives:create"
  | "drives:edit"
  | "drives:archive"
  | "colleges:view"
  | "colleges:manage"
  | "crm:view"
  | "crm:log"
  | "followups:manage"
  | "whatsapp:manage"
  | "students:view"
  | "students:register"
  | "exam:proctor"
  | "exam:take"
  | "interview:evaluate"
  | "offers:generate"
  | "offers:manage"
  | "offers:accept"
  | "reports:view"
  | "placement_analytics:view"
  | "calendar:view"
  | "tasks:manage"
  | "attendance:track"
  | "helpdesk:view"
  | "documents:vault"
  | "audit:view"
  | "users:manage"
  | "notifications:view"
  | "settings:manage";

export const ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  super_admin: [
    "drives:view",
    "drives:create",
    "drives:edit",
    "drives:archive",
    "colleges:view",
    "colleges:manage",
    "crm:view",
    "crm:log",
    "followups:manage",
    "whatsapp:manage",
    "students:view",
    "students:register",
    "exam:proctor",
    "exam:take",
    "interview:evaluate",
    "offers:generate",
    "offers:manage",
    "offers:accept",
    "reports:view",
    "placement_analytics:view",
    "calendar:view",
    "tasks:manage",
    "attendance:track",
    "helpdesk:view",
    "documents:vault",
    "audit:view",
    "users:manage",
    "notifications:view",
    "settings:manage",
  ],
  csr_manager: [
    "drives:view",
    "drives:create",
    "drives:edit",
    "colleges:view",
    "colleges:manage",
    "crm:view",
    "crm:log",
    "followups:manage",
    "whatsapp:manage",
    "students:view",
    "exam:proctor",
    "interview:evaluate",
    "offers:manage",
    "reports:view",
    "placement_analytics:view",
    "calendar:view",
    "tasks:manage",
    "attendance:track",
    "helpdesk:view",
    "documents:vault",
    "notifications:view",
    "settings:manage",
  ],
  hr: [
    "drives:view",
    "interview:evaluate",
    "offers:generate",
    "offers:manage",
    "attendance:track",
    "calendar:view",
    "tasks:manage",
    "crm:log",
    "notifications:view",
  ],
  hr_recruiter: [
    "drives:view",
    "interview:evaluate",
    "offers:generate",
    "offers:manage",
    "attendance:track",
    "calendar:view",
    "tasks:manage",
    "crm:log",
    "notifications:view",
  ],
  placement_officer: [
    "colleges:view",
    "drives:view",
    "students:view",
    "placement_analytics:view",
    "documents:vault",
    "calendar:view",
    "notifications:view",
    "helpdesk:view",
  ],
  pto: [
    "colleges:view",
    "drives:view",
    "students:view",
    "placement_analytics:view",
    "documents:vault",
    "calendar:view",
    "notifications:view",
    "helpdesk:view",
  ],
  faculty: [
    "attendance:track",
    "students:view",
    "drives:view",
    "calendar:view",
    "tasks:manage",
    "notifications:view",
  ],
  faculty_coordinator: [
    "attendance:track",
    "students:view",
    "drives:view",
    "calendar:view",
    "tasks:manage",
    "notifications:view",
  ],
  principal: [
    "colleges:view",
    "drives:view",
    "reports:view",
    "placement_analytics:view",
    "documents:vault",
    "notifications:view",
  ],
  student: [
    "exam:take",
    "offers:accept",
    "students:register",
    "helpdesk:view",
    "notifications:view",
  ],
  management: [
    "drives:view",
    "colleges:view",
    "reports:view",
    "placement_analytics:view",
    "audit:view",
    "documents:vault",
    "notifications:view",
  ],
  placement_coordinator: [
    "colleges:view",
    "drives:view",
    "students:view",
    "attendance:track",
    "placement_analytics:view",
    "notifications:view",
  ],
  admission_team: [
    "students:view",
    "offers:manage",
    "documents:vault",
    "attendance:track",
    "tasks:manage",
    "calendar:view",
    "notifications:view",
    "reports:view",
  ],
  admission: [
    "students:view",
    "offers:manage",
    "documents:vault",
    "attendance:track",
    "tasks:manage",
    "calendar:view",
    "notifications:view",
    "reports:view",
  ],
  operations: [
    "drives:view",
    "drives:edit",
    "colleges:view",
    "students:view",
    "attendance:track",
    "tasks:manage",
    "calendar:view",
    "notifications:view",
    "reports:view",
  ],
  support: [
    "helpdesk:view",
    "notifications:view",
    "students:view",
  ],
};

/**
 * Check whether a user role possesses a specific permission code
 */
export function hasPermission(role: UserRole | undefined, permission: PermissionCode): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check whether a role possesses at least one of the provided permissions
 */
export function hasAnyPermission(role: UserRole | undefined, permissions: PermissionCode[]): boolean {
  if (!role) return false;
  return permissions.some((perm) => hasPermission(role, perm));
}

/**
 * Check whether a role has authorization to access a given URL path
 */
export function isRouteAuthorized(role: UserRole | undefined, pathname: string): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;

  // Role isolation: Students can only access student routes
  if (role === "student") {
    return pathname.startsWith("/student") || pathname === "/access-denied";
  }

  // Non-students cannot access student portal routes
  if (pathname.startsWith("/student")) {
    return false;
  }

  // Admin portal is accessible by super_admin and csr_manager (Platform Management Authority)
  if (pathname.startsWith("/admin")) {
    return role === "csr_manager";
  }

  // CSR Manager Portal
  if (pathname.startsWith("/csr-manager")) {
    return role === "csr_manager";
  }

  // HR Portal
  if (pathname.startsWith("/hr")) {
    return role === "hr" || role === "hr_recruiter";
  }

  // Placement Officer Portal
  if (pathname.startsWith("/pto")) {
    return (
      role === "pto" ||
      role === "placement_officer" ||
      role === "placement_coordinator"
    );
  }

  // Faculty Portal
  if (pathname.startsWith("/faculty")) {
    return role === "faculty" || role === "faculty_coordinator";
  }

  // Principal Portal
  if (pathname.startsWith("/principal")) {
    return role === "principal";
  }

  // Management Portal (Read-Only)
  if (pathname.startsWith("/management")) {
    return role === "management";
  }

  // Legacy /portal routes authorization
  if (pathname.startsWith("/portal/users") || pathname.startsWith("/portal/settings")) {
    return role === "csr_manager";
  }

  if (pathname.startsWith("/portal/audit-logs")) {
    return role === "management";
  }

  if (pathname.startsWith("/portal/hr/")) {
    return role === "csr_manager" || role === "hr" || role === "hr_recruiter";
  }

  if (pathname.startsWith("/portal/crm") || pathname.startsWith("/portal/whatsapp")) {
    return role === "csr_manager";
  }

  if (pathname.startsWith("/portal/colleges")) {
    return (
      role === "csr_manager" ||
      role === "pto" ||
      role === "placement_officer" ||
      role === "principal" ||
      role === "management"
    );
  }

  if (pathname.startsWith("/portal/reports") || pathname.startsWith("/portal/placement-analytics")) {
    return (
      role === "csr_manager" ||
      role === "principal" ||
      role === "management" ||
      role === "pto" ||
      role === "placement_officer"
    );
  }

  return true;
}

/**
 * Map each authority to their canonical home destination
 */
export function getRoleHomeRoute(role: UserRole): string {
  switch (role) {
    case "student":
      return "/student/dashboard";
    case "hr":
    case "hr_recruiter":
      return "/hr/dashboard";
    case "csr_manager":
      return "/csr-manager/dashboard";
    case "super_admin":
      return "/admin/dashboard";
    case "placement_officer":
    case "pto":
      return "/pto/dashboard";
    case "faculty":
    case "faculty_coordinator":
      return "/faculty/dashboard";
    case "principal":
      return "/principal/dashboard";
    case "management":
      return "/management/dashboard";
    default:
      return "/csr-manager/dashboard";
  }
}

/**
 * Map authority to its dedicated login URL
 */
export function getRoleLoginUrl(role: UserRole): string {
  switch (role) {
    case "student":
      return "/student/login";
    case "hr":
    case "hr_recruiter":
      return "/hr/login";
    case "placement_officer":
    case "pto":
      return "/pto/login";
    case "faculty":
    case "faculty_coordinator":
      return "/faculty/login";
    case "principal":
      return "/principal/login";
    case "csr_manager":
      return "/csr-manager/login";
    case "management":
      return "/management/login";
    case "super_admin":
    default:
      return "/admin/login";
  }
}
