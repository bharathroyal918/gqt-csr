import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  PhoneCall,
  CalendarCheck,
  MessageSquare,
  GraduationCap,
  Award,
  BarChart3,
  ShieldCheck,
  Users,
  Bell,
  Clock,
  TrendingUp,
  Settings,
  LifeBuoy,
  User,
  Shield,
  FileText,
  UserCheck,
  CheckCircle,
  Eye,
  Key,
  FolderLock,
  Database,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck2,
  HelpCircle,
  Layers,
  School,
  Lock,
  Calendar,
  Radio,
  Megaphone,
  Mail,
  Smartphone,
  MapPin,
  Activity,
  DollarSign,
  FileSpreadsheet,
  Download,
  Globe,
  HardDrive,
  Zap,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import React from "react";

export interface DynamicNavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export interface DynamicNavSection {
  title: string;
  items: DynamicNavItem[];
}

/**
 * Returns strictly isolated, role-specific navigation menus for each of the 8 portals.
 * Never renders hidden menus or links from other roles.
 */
export function getDynamicNavigation(role: UserRole | undefined): DynamicNavSection[] {
  if (!role) return [];

  switch (role) {
    case "student":
      return [
        {
          title: "Student Portal",
          items: [
            { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
            { title: "My Profile", href: "/student/profile", icon: User },
            { title: "CSR Drives", href: "/student/csr-drives", icon: Briefcase },
            { title: "My Registration", href: "/student/my-registration", icon: GraduationCap },
            { title: "Document Vault", href: "/student/documents", icon: FolderLock },
            { title: "Assessment Exam", href: "/student/exam", icon: FileText },
            { title: "Exam Result", href: "/student/result", icon: Award },
            { title: "Interview", href: "/student/interview", icon: Users },
            { title: "Offer Letter", href: "/student/offer-letter", icon: Award },
            { title: "Attendance & Batch", href: "/student/attendance", icon: Clock },
            { title: "Notifications", href: "/student/notifications", icon: Bell },
            { title: "Announcements", href: "/student/announcements", icon: Megaphone },
            { title: "Helpdesk", href: "/student/helpdesk", icon: LifeBuoy },
            { title: "Settings", href: "/student/settings", icon: Settings },
          ],
        },
      ];

    case "hr":
    case "hr_recruiter":
      return [
        {
          title: "Recruitment & Evaluation",
          items: [
            { title: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
            { title: "Candidate Pipeline", href: "/hr/candidates", icon: Users },
            { title: "Qualified Queue", href: "/hr/candidates/qualified", icon: CheckCircle2, badge: "NEW" },
            { title: "Interviews", href: "/hr/interviews", icon: Users },
            { title: "Interview Calendar", href: "/hr/interviews/calendar", icon: Clock },
            { title: "Auto-Scheduler", href: "/hr/interviews/schedule", icon: CalendarCheck },
            { title: "Exam Review", href: "/hr/exam-review", icon: FileCheck2 },
          ],
        },
        {
          title: "Selection & Decisions",
          items: [
            { title: "Selected Candidates", href: "/hr/candidates/selected", icon: Award },
            { title: "Offer Queue", href: "/hr/offer-queue", icon: Award, badge: "NEW" },
            { title: "Offers Master", href: "/hr/offers", icon: FileCheck2 },
            { title: "Hold Candidates", href: "/hr/candidates/hold", icon: AlertCircle },
            { title: "Rejected Candidates", href: "/hr/candidates/rejected", icon: XCircle },
            { title: "Not Attended", href: "/hr/candidates/not-attended", icon: Clock },
            { title: "Candidate History", href: "/hr/candidates/history", icon: ShieldCheck },
          ],
        },
        {
          title: "CRM & Multi-Channel Communications",
          items: [
            { title: "CRM Hub", href: "/hr/crm", icon: PhoneCall },
            { title: "Call Logs", href: "/hr/crm/calls", icon: PhoneCall },
            { title: "WhatsApp Hub", href: "/hr/crm/whatsapp", icon: Smartphone },
            { title: "Email Campaigns", href: "/hr/crm/email", icon: Mail },
            { title: "Follow-Up Engine", href: "/hr/crm/followups", icon: CalendarCheck },
            { title: "Meetings & MoM", href: "/hr/crm/meetings", icon: Calendar },
            { title: "Communication Timeline", href: "/hr/crm/timeline", icon: Clock },
            { title: "Notifications", href: "/hr/notifications", icon: Bell },
            { title: "My Assigned Drives", href: "/hr/assigned-drives", icon: Briefcase },
            { title: "Assigned Colleges", href: "/hr/assigned-colleges", icon: Building2 },
            { title: "Reports", href: "/hr/reports", icon: BarChart3 },
            { title: "My Profile", href: "/hr/profile", icon: User },
          ],
        },
      ];

    case "csr_manager":
      return [
        {
          title: "Operations Command",
          items: [
            { title: "Dashboard", href: "/csr-manager/dashboard", icon: LayoutDashboard },
            { title: "CSR Campus Drives", href: "/csr-manager/drives", icon: Briefcase },
            { title: "Create CSR Drive", href: "/csr-manager/drives/create", icon: Layers },
          ],
        },
        {
          title: "Institutional & Recruiter Coordination",
          items: [
            { title: "Partner Colleges", href: "/csr-manager/colleges", icon: Building2 },
            { title: "Candidate Pipeline", href: "/csr-manager/candidates", icon: GraduationCap, badge: "PIPELINE" },
            { title: "HR Assignments", href: "/csr-manager/assignments", icon: Users },
            { title: "Operations Calendar", href: "/csr-manager/calendar", icon: Clock },
          ],
        },
        {
          title: "Impact & Communication",
          items: [
            { title: "Announcements", href: "/csr-manager/announcements", icon: Megaphone },
            { title: "CSR Impact Reports", href: "/csr-manager/reports", icon: BarChart3 },
          ],
        },
      ];

    case "super_admin":
      return [
        {
          title: "Platform OS & Control Center",
          items: [
            { title: "Control Center (OS)", href: "/admin/control-center", icon: Zap, badge: "MASTER" },
            { title: "Executive Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { title: "Cross-Portal Access", href: "/admin/cross-portal", icon: ExternalLink, badge: "PORTALS" },
            { title: "Feature Flags", href: "/admin/feature-flags", icon: Sliders, badge: "FLAGS" },
            { title: "System Health & Sentry", href: "/admin/system-health", icon: Activity },
            { title: "Security & Sessions", href: "/admin/security", icon: ShieldCheck },
            { title: "Branding Customizer", href: "/admin/branding", icon: Sparkles },
            { title: "Academic Years", href: "/admin/academic-years", icon: Calendar },
            { title: "Storage & Buckets", href: "/admin/storage", icon: HardDrive },
            { title: "API & Integrations", href: "/admin/integrations", icon: Globe },
            { title: "Platform License", href: "/admin/license", icon: Award },
            { title: "Platform Settings", href: "/admin/settings", icon: Settings },
            { title: "Admin Profile", href: "/admin/profile", icon: User },
          ],
        },
        {
          title: "Access & Security Control",
          items: [
            { title: "User Management", href: "/admin/users", icon: Users },
            { title: "Role Management", href: "/admin/roles", icon: Shield },
            { title: "Permission Matrix", href: "/admin/permissions", icon: Key },
            { title: "Module Visibility", href: "/admin/module-visibility", icon: Sliders },
            { title: "Portal Access Control", href: "/admin/portal-access", icon: Lock },
          ],
        },
        {
          title: "Institutions & Operations",
          items: [
            { title: "CSR Drive Management", href: "/admin/drives", icon: Briefcase },
            { title: "College Management", href: "/admin/colleges", icon: Building2 },
            { title: "HR Management", href: "/admin/hr", icon: UserCheck },
            { title: "Placement Officers", href: "/admin/pto", icon: School },
            { title: "Faculty Coordinators", href: "/admin/faculty", icon: Award },
            { title: "Principals", href: "/admin/principal", icon: Building2 },
          ],
        },
        {
          title: "Candidate Master Pipeline",
          items: [
            { title: "Student Master Directory", href: "/admin/students", icon: GraduationCap },
            { title: "All Candidates Pipeline", href: "/admin/candidates", icon: Users, badge: "HUB" },
            { title: "Selected Candidates", href: "/admin/candidates/selected", icon: CheckCircle2 },
            { title: "Hold Candidates", href: "/admin/candidates/hold", icon: AlertCircle },
            { title: "Rejected Candidates", href: "/admin/candidates/rejected", icon: XCircle },
            { title: "Interview Control", href: "/admin/interviews", icon: Users },
            { title: "Offer Letters Control", href: "/admin/offers", icon: Award },
            { title: "Offer Templates", href: "/admin/offer-templates", icon: Layers },
            { title: "Offer Settings", href: "/admin/offer-settings", icon: Settings },
          ],
        },
        {
          title: "Examinations & Question Bank",
          items: [
            { title: "Question Bank", href: "/admin/question-bank", icon: FileText },
            { title: "Paper Generator", href: "/admin/question-papers", icon: Layers },
            { title: "Live Exam Control", href: "/admin/exams", icon: Clock },
            { title: "Live War Room", href: "/admin/exams/live", icon: Radio, badge: "LIVE" },
            { title: "Exam Result Control", href: "/admin/exams/results", icon: FileCheck2 },
          ],
        },
        {
          title: "Communications & Audits",
          items: [
            { title: "Notification Center", href: "/admin/notifications", icon: Bell },
            { title: "Notification Templates", href: "/admin/notification-templates", icon: Radio },
            { title: "WhatsApp Templates", href: "/admin/whatsapp-templates", icon: Smartphone },
            { title: "Email Templates", href: "/admin/email-templates", icon: Mail },
            { title: "Announcements Hub", href: "/admin/announcements", icon: Megaphone },
            { title: "Templates & Bot", href: "/admin/templates", icon: MessageSquare },
            { title: "Report Center", href: "/admin/reports", icon: BarChart3 },
            { title: "Forensic Audit Logs", href: "/admin/audit", icon: ShieldCheck },
            { title: "Document Vault", href: "/admin/documents", icon: FolderLock },
            { title: "Support Center", href: "/admin/support", icon: HelpCircle },
            { title: "Backup & Restore", href: "/admin/backup", icon: Database },
          ],
        },
        {
          title: "Cross-Portal Admin Access",
          items: [
            { title: "Student Portal", href: "/student/dashboard", icon: GraduationCap, badge: "ENTER" },
            { title: "HR Recruiter Portal", href: "/hr/dashboard", icon: Briefcase, badge: "ENTER" },
            { title: "CSR Manager Portal", href: "/csr-manager/dashboard", icon: Layers, badge: "ENTER" },
            { title: "Placement Officer Portal", href: "/pto/dashboard", icon: School, badge: "ENTER" },
            { title: "Faculty Coordinator Portal", href: "/faculty/dashboard", icon: Award, badge: "ENTER" },
            { title: "Principal Portal", href: "/principal/dashboard", icon: Building2, badge: "ENTER" },
            { title: "Management Viewer", href: "/management/dashboard", icon: BarChart3, badge: "ENTER" },
          ],
        },
      ];

    case "placement_officer":
    case "pto":
    case "placement_coordinator":
      return [
        {
          title: "Placement Officer Portal",
          items: [
            { title: "Dashboard", href: "/pto/dashboard", icon: LayoutDashboard },
            { title: "Students", href: "/pto/students", icon: Users },
            { title: "Approvals", href: "/pto/approvals", icon: CheckCircle },
            { title: "Notifications", href: "/pto/notifications", icon: Bell },
          ],
        },
      ];

    case "faculty":
    case "faculty_coordinator":
      return [
        {
          title: "Faculty Portal",
          items: [
            { title: "Dashboard", href: "/faculty/dashboard", icon: LayoutDashboard },
            { title: "Student Verification", href: "/faculty/student-verification", icon: UserCheck },
            { title: "Attendance", href: "/faculty/attendance", icon: Clock },
          ],
        },
      ];

    case "principal":
      return [
        {
          title: "Principal Portal",
          items: [
            { title: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
            { title: "CSR Drives", href: "/principal/drives", icon: Briefcase },
            { title: "Reports", href: "/principal/reports", icon: BarChart3 },
          ],
        },
      ];

    case "management":
      return [
        {
          title: "Executive Command",
          items: [
            { title: "Executive Dashboard", href: "/management/dashboard", icon: LayoutDashboard },
            { title: "Karnataka CSR Map", href: "/management/karnataka-map", icon: MapPin, badge: "31 DIST" },
            { title: "Live Activity Center", href: "/management/activity-center", icon: Activity },
            { title: "Audit Trail Center", href: "/management/audit", icon: ShieldCheck },
          ],
        },
        {
          title: "Pipeline & Operations",
          items: [
            { title: "CSR Drives Analytics", href: "/management/drives", icon: Briefcase },
            { title: "Colleges Leaderboard", href: "/management/colleges", icon: Building2 },
            { title: "Recruitment Funnel", href: "/management/student-pipeline", icon: Layers },
            { title: "HR Recruiter Performance", href: "/management/hr-performance", icon: Users },
            { title: "Offer & Admissions", href: "/management/offer-analytics", icon: Award },
          ],
        },
        {
          title: "Business Intelligence & BI",
          items: [
            { title: "Deep Statewide Analytics", href: "/management/analytics", icon: TrendingUp },
            { title: "Revenue & Sponsorship", href: "/management/revenue", icon: DollarSign },
            { title: "Executive Reports", href: "/management/reports", icon: BarChart3 },
            { title: "Enterprise Export Center", href: "/management/export-center", icon: Download, badge: "PRO" },
          ],
        },
      ];

    case "admission_team":
    case "admission":
      return [
        {
          title: "Admission Operations",
          items: [
            { title: "Dashboard", href: "/admission/dashboard", icon: LayoutDashboard },
            { title: "Accepted Students", href: "/admission/students", icon: UserCheck, badge: "NEW" },
            { title: "Batch Allocation", href: "/admission/batches", icon: Layers },
            { title: "Joining Confirmations", href: "/admission/confirmations", icon: CheckCircle2 },
          ],
        },
      ];

    case "operations":
      return [
        {
          title: "Drive Operations & Logistics",
          items: [
            { title: "Active Drives", href: "/csr-manager/drives", icon: Briefcase },
            { title: "Partner Colleges", href: "/csr-manager/colleges", icon: Building2 },
            { title: "Operational Tracking", href: "/csr-manager/tracking", icon: Activity },
          ],
        },
      ];

    case "support":
      return [
        {
          title: "Helpdesk & User Services",
          items: [
            { title: "Support Console", href: "/admin/support", icon: LifeBuoy },
            { title: "Notifications", href: "/admin/notifications", icon: Bell },
          ],
        },
      ];

    default:
      return [];
  }
}
