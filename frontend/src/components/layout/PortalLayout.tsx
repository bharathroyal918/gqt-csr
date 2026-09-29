"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { StudentBottomNav } from "./StudentBottomNav";
import { useAuth } from "@/providers/AuthProvider";
import { UserRole } from "@/types";

interface PortalLayoutProps {
  children: React.ReactNode;
  portalRole?: UserRole;
  portalName?: string;
  isReadOnly?: boolean;
}

export function PortalLayout({
  children,
  portalRole,
  portalName,
  isReadOnly = false,
}: PortalLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role } = useAuth();

  // If on login, registration, fullscreen exam or offer viewer, render clean full-screen view without portal sidebar/header
  if (
    pathname?.endsWith("/login") ||
    pathname?.endsWith("/register") ||
    pathname?.startsWith("/student/register") ||
    pathname === "/student/registration" ||
    pathname?.startsWith("/student/forgot-password") ||
    pathname?.startsWith("/student/reset-password") ||
    pathname?.startsWith("/student/logout") ||
    pathname?.includes("/register-drive") ||
    pathname?.includes("/registration-card") ||
    pathname?.includes("/exam/live") ||
    pathname?.includes("/exam/instructions") ||
    pathname?.includes("/exam/submitted") ||
    pathname?.includes("/student/offer/")
  ) {
    return <>{children}</>;
  }

  const currentRole = portalRole || role;
  const isStudent = currentRole === "student" || pathname?.startsWith("/student");

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#070D1E] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        {/* Header */}
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Read-Only Banner for Management Portal */}
        {isReadOnly && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Management Portal: Read-Only Executive Governance Clearance</span>
          </div>
        )}

        {/* Page Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isStudent ? "pb-20 lg:pb-8" : ""}`}>
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">{children}</div>
        </main>

        {/* Mobile Bottom Navigation for Student Portal Only */}
        {isStudent && <StudentBottomNav />}
      </div>
    </div>
  );
}
