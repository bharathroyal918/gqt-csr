"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  GraduationCap,
  Users,
  Award,
  Menu,
  PhoneCall,
  TrendingUp,
  BarChart3,
  Clock,
  CheckSquare,
  Calendar,
  FolderLock,
  ShieldCheck,
} from "lucide-react";

interface MobileNavProps {
  onOpenSidebar: () => void;
}

interface MobileNavLink {
  title: string;
  href: string;
  icon: React.ElementType;
}

/**
 * Returns role-specific mobile bottom nav links.
 * Each role only sees links relevant to its own portal scope.
 */
function getRoleMobileLinks(role: UserRole | undefined): MobileNavLink[] {
  switch (role) {
    case "student":
      return [
        { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { title: "Exam", href: "/student/exam/instructions", icon: GraduationCap },
        { title: "Hall Ticket", href: "/student/registration-card/stu-001", icon: Award },
      ];

    case "hr_recruiter":
      return [
        { title: "HR Pipeline", href: "/portal/hr/pipeline", icon: Users },
        { title: "Offers", href: "/portal/offers", icon: Award },
        { title: "Attendance", href: "/portal/attendance", icon: Clock },
        { title: "Calendar", href: "/portal/calendar", icon: Calendar },
      ];

    case "pto":
      return [
        { title: "Colleges", href: "/portal/colleges", icon: Building2 },
        { title: "Drives", href: "/portal/drives", icon: Briefcase },
        { title: "Analytics", href: "/portal/placement-analytics", icon: TrendingUp },
        { title: "Documents", href: "/portal/documents", icon: FolderLock },
      ];

    case "faculty_coordinator":
      return [
        { title: "Attendance", href: "/portal/attendance", icon: Clock },
        { title: "Tasks", href: "/portal/tasks", icon: CheckSquare },
        { title: "Calendar", href: "/portal/calendar", icon: Calendar },
        { title: "Drives", href: "/portal/drives", icon: Briefcase },
      ];

    case "principal":
      return [
        { title: "Reports", href: "/portal/reports", icon: BarChart3 },
        { title: "Analytics", href: "/portal/placement-analytics", icon: TrendingUp },
        { title: "Colleges", href: "/portal/colleges", icon: Building2 },
        { title: "Documents", href: "/portal/documents", icon: FolderLock },
      ];

    case "management":
      return [
        { title: "Analytics", href: "/portal/placement-analytics", icon: TrendingUp },
        { title: "Reports", href: "/portal/reports", icon: BarChart3 },
        { title: "Audit Logs", href: "/portal/audit-logs", icon: ShieldCheck },
        { title: "Colleges", href: "/portal/colleges", icon: Building2 },
      ];

    case "csr_manager":
    case "super_admin":
    default:
      return [
        { title: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
        { title: "Drives", href: "/portal/drives", icon: Briefcase },
        { title: "Colleges", href: "/portal/colleges", icon: Building2 },
        { title: "CRM", href: "/portal/crm", icon: PhoneCall },
      ];
  }
}

export function MobileNav({ onOpenSidebar }: MobileNavProps) {
  const pathname = usePathname();
  const { currentRole } = useApp();

  const activeLinks = getRoleMobileLinks(currentRole);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 gqt-glass border-t border-slate-200/80 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg">
      {activeLinks.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={`${item.title}-${item.href}`}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${
              isActive
                ? "text-[#005BBB] font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px]">{item.title}</span>
          </Link>
        );
      })}

      <button
        onClick={onOpenSidebar}
        className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px]">Menu</span>
      </button>
    </div>
  );
}
