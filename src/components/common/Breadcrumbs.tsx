"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const segmentTitles: Record<string, string> = {
    portal: "Enterprise Portal",
    dashboard: "Dashboard",
    drives: "CSR Drives",
    colleges: "Colleges",
    crm: "CRM",
    "follow-ups": "Follow-ups",
    student: "Student Portal",
    register: "Enrollment",
    exam: "Examination",
    hr: "HR Operations",
    pipeline: "Interview Pipeline",
    offers: "Offers & Letters",
    whatsapp: "WhatsApp Bot",
    reports: "Reports",
    "placement-analytics": "Placement Analytics",
    calendar: "Master Calendar",
    tasks: "Tasks",
    attendance: "Live Attendance",
    helpdesk: "Helpdesk",
    documents: "Document Vault",
    "audit-logs": "Audit Logs",
    users: "User Administration",
    notifications: "Notification Center",
    settings: "System Settings",
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 overflow-x-auto py-1">
      <Link
        href="/portal/dashboard"
        className="flex items-center gap-1 hover:text-[#005BBB] dark:hover:text-[#14B8FF] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">HQ</span>
      </Link>

      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const title = segmentTitles[segment] || segment.replace(/-/g, " ");

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-900 dark:text-white capitalize truncate">
                {title}
              </span>
            ) : (
              <Link
                href={path}
                className="hover:text-[#005BBB] dark:hover:text-[#14B8FF] transition-colors capitalize truncate"
              >
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
