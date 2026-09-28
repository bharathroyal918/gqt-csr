"use client";

import React from "react";
import { PortalDashboardView } from "@/components/dashboard/PortalDashboardView";
import { Building2, Briefcase, Award, BarChart3 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PrincipalDashboardPage() {
  const { drives, students, currentUser } = useApp();

  const collegeStudents = currentUser.collegeId
    ? students.filter((s) => s.collegeId === currentUser.collegeId || s.collegeName === currentUser.collegeName)
    : students;

  const totalOffers = collegeStudents.filter((s) => s.status.includes("Offer")).length;
  const placementRate = collegeStudents.length > 0 ? `${Math.round((totalOffers / collegeStudents.length) * 100)}%` : "0%";

  return (
    <PortalDashboardView
      portalTitle={currentUser.collegeName ? `Principal & Executive Dean Dashboard — ${currentUser.collegeName}` : "Principal & Executive Dean Dashboard"}
      portalSubtitle="Institutional CSR drive performance, campus placement statistics, academic achievement metrics, and corporate MoUs."
      roleBadge="Principal Authority"
      stats={[
        { title: "Participating Batches", value: `${new Date().getFullYear()}`, change: "B.E / B.Tech / MCA", trend: "neutral", icon: Building2 },
        { title: "Active Drives", value: drives.length.toString(), change: "Active Campus Drives", trend: "up", icon: Briefcase },
        { title: "Offers Secured", value: totalOffers.toString(), change: "Verified Placements", trend: "up", icon: Award },
        { title: "Placement Rate", value: placementRate, change: "Cohort Success Rate", trend: "up", icon: BarChart3 },
      ]}
      quickActions={[
        { label: "Campus Drives", href: "/principal/drives", icon: Briefcase, variant: "primary" },
        { label: "Executive Reports", href: "/principal/reports", icon: BarChart3, variant: "secondary" },
      ]}
    />
  );
}
