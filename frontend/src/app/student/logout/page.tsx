"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentAuthService } from "@/services/studentAuth.service";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

export default function StudentLogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await studentAuthService.logout();
        await logout();
      } catch { }

      toast.info("Signed Out", {
        description: "You have been securely signed out of your student account.",
      });

      router.replace("/student/login");
    };

    performLogout();
  }, [router, logout]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-3 border-blue-200 border-t-[#005BBB] rounded-full animate-spin mb-4" />
      <h2 className="text-base font-bold text-slate-800 dark:text-white">
        Signing out of Student Portal...
      </h2>
      <p className="text-xs text-slate-500 mt-1">Clearing credentials and terminating session.</p>
    </div>
  );
}
