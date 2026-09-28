"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CSRManagerDashboard } from "@/components/dashboard/CSRManagerDashboard";
import { PTODashboard } from "@/components/dashboard/PTODashboard";
import { PrincipalDashboard } from "@/components/dashboard/PrincipalDashboard";
import { HRDashboard } from "@/components/dashboard/HRDashboard";
import { FacultyDashboard } from "@/components/dashboard/FacultyDashboard";
import { ManagementDashboard } from "@/components/dashboard/ManagementDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";

export default function DashboardPage() {
  const { currentRole } = useApp();
  const router = useRouter();

  // Guard: Students should never be on staff /portal/dashboard
  useEffect(() => {
    if (currentRole === "student") {
      router.replace("/student/dashboard");
    }
  }, [currentRole, router]);

  if (currentRole === "student") {
    return null;
  }

  // Dynamic persona dashboard switcher
  switch (currentRole) {
    case "super_admin":
      return <SuperAdminDashboard />;
    case "pto":
    case "placement_coordinator":
      return <PTODashboard />;
    case "principal":
      return <PrincipalDashboard />;
    case "hr_recruiter":
      return <HRDashboard />;
    case "faculty_coordinator":
      return <FacultyDashboard />;
    case "management":
      return <ManagementDashboard />;
    case "csr_manager":
    default:
      return <CSRManagerDashboard />;
  }
}
