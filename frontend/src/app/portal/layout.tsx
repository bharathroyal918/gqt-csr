"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/layout/CommandPalette";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentRole } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (currentRole === "student") {
      router.replace("/student/dashboard");
    }
  }, [currentRole, router]);

  if (currentRole === "student") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC] dark:bg-[#0B132B]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#005BBB] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Redirecting to Student Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B132B] transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      <MobileNav onOpenSidebar={() => setSidebarOpen(true)} />
      <CommandPalette />
    </div>
  );
}
