"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { getDynamicNavigation } from "@/lib/rbac/navigation";
import { GQTLogo } from "@/components/common/GQTLogo";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole, unreadCount } = useApp();

  // Dynamically generated from RBAC permissions table/matrix
  const dynamicSections = useMemo(() => {
    return getDynamicNavigation(currentRole);
  }, [currentRole]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-40 w-72 h-screen bg-white dark:bg-[#111C3A] border-r border-slate-200/80 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <GQTLogo size="sm" showTagline={true} />
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {dynamicSections.map((section) => {
            return (
              <div key={section.title}>
                <h5 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  {section.title}
                </h5>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));

                    const badge =
                      item.href === "/portal/notifications" && unreadCount > 0
                        ? String(unreadCount)
                        : item.badge;

                    return (
                      <Link
                        key={`${section.title}-${item.title}-${item.href}`}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white shadow-md shadow-blue-500/20"
                            : "text-[#0F172A] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#005BBB]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                              isActive ? "text-white" : "text-slate-400 group-hover:text-[#005BBB]"
                            }`}
                          />
                          <span>{item.title}</span>
                        </div>

                        {badge && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              isActive
                                ? "bg-white text-[#005BBB]"
                                : "bg-blue-100 text-[#005BBB] dark:bg-blue-900/60 dark:text-blue-300"
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 capitalize">
                {currentRole?.replace("_", " ")} Portal
              </div>
            </div>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF]">
              RBAC
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Role-isolated Enterprise Navigation
          </p>
        </div>
      </aside>
    </>
  );
}
