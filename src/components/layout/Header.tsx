"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { GQTLogo } from "@/components/common/GQTLogo";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { useNotifications } from "@/providers/NotificationProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  Search,
  Bell,
  Menu,
  Shield,
} from "lucide-react";

import { useApp } from "@/context/AppContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { role } = useAuth();
  const { currentRole } = useApp();
  const { unreadCount, isOpen: isNotifOpen, setIsOpen: setIsNotifOpen } = useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const effectiveRole = pathname?.startsWith("/student")
    ? "student"
    : (currentRole || role || "super_admin");

  const roleLabelMap: Record<string, string> = {
    super_admin: "Super Admin",
    csr_manager: "CSR Manager",
    hr: "HR Recruiter",
    hr_recruiter: "HR Recruiter",
    placement_officer: "Placement Officer",
    pto: "Placement Officer",
    faculty: "Faculty Coordinator",
    faculty_coordinator: "Faculty Coordinator",
    principal: "Principal / Dean",
    student: "Student Portal",
    management: "Executive Management",
    admission_team: "Admission Officer",
    admission: "Admission Officer",
    placement_coordinator: "Placement Coordinator",
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left Side: Mobile Sidebar Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="lg:hidden">
              <GQTLogo size="sm" showTagline={false} />
            </div>

            {/* Desktop Breadcrumbs Navigation */}
            <div className="hidden md:block">
              <Breadcrumbs />
            </div>
          </div>

          {/* Center: Global Search Trigger */}
          <div className="hidden sm:flex flex-1 max-w-md mx-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-[#005BBB]" />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Search students, colleges, drives, documents...
                </span>
              </div>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Side: Portal Badge, Search Mobile, Theme Toggle, Notification Bell, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            {/* Active Authority Badge (Strictly Locked - Never Switchable) */}
            <div
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 text-xs font-bold text-[#005BBB] dark:text-[#14B8FF]"
              title="Verified Authority Workspace"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{roleLabelMap[effectiveRole] || "CSR Portal"}</span>
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              <NotificationDropdown
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
