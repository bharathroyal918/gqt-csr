"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Bell,
  User,
} from "lucide-react";

export function StudentBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "CSR Drives", href: "/student/csr-drives", icon: GraduationCap },
    { label: "Exam", href: "/student/exam", icon: FileText },
    { label: "Alerts", href: "/student/notifications", icon: Bell },
    { label: "Profile", href: "/student/profile", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? "text-[#005BBB] dark:text-[#14B8FF] font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
