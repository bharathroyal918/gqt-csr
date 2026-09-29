"use client";

import React from "react";
import { PortalDashboardView } from "@/components/dashboard/PortalDashboardView";
import { Building2, Users, CheckCircle, Bell, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PTODashboardPage() {
  const { students, currentUser } = useApp();

  const collegeStudents = currentUser.collegeId
    ? students.filter(
        (s) =>
          s.collegeId === currentUser.collegeId ||
          s.collegeName?.toLowerCase() === currentUser.collegeName?.toLowerCase()
      )
    : students;

  const totalReg = collegeStudents.length;
  const pendingApprovals = collegeStudents.filter((s) => s.status === "Registered").length;
  const qualified = collegeStudents.filter(
    (s) =>
      s.status.includes("Qualified") ||
      s.status.includes("Selected") ||
      s.status.includes("Offer")
  ).length;
  const offers = collegeStudents.filter((s) => s.status.includes("Offer")).length;

  return (
    <PortalDashboardView
      portalTitle={currentUser.collegeName ? `Placement Officer (PTO) Dashboard — ${currentUser.collegeName}` : "Placement Officer (PTO) Dashboard"}
      portalSubtitle="Institutional candidate tracking, student eligibility verification, MoU compliance, and placement statistics."
      roleBadge="Placement Officer Authority"
      stats={[
        {
          title: "Registered Students",
          value: totalReg.toString(),
          change: "Dynamic VTU Records",
          trend: "up",
          icon: Users,
        },
        {
          title: "Awaiting Approvals",
          value: pendingApprovals.toString(),
          change: pendingApprovals > 0 ? "Requires review" : "Up to date",
          trend: "neutral",
          icon: CheckCircle,
        },
        {
          title: "Qualified for Interviews",
          value: qualified.toString(),
          change: `${totalReg > 0 ? Math.round((qualified / totalReg) * 100) : 0}% qualification rate`,
          trend: "up",
          icon: Award,
        },
        {
          title: "Campus Offers",
          value: offers.toString(),
          change: `${offers} total offers issued`,
          trend: "up",
          icon: Building2,
        },
      ]}
      quickActions={[
        { label: "Verify Students", href: "/pto/students", icon: Users, variant: "primary" },
        { label: "Pending Approvals", href: "/pto/approvals", icon: CheckCircle, variant: "secondary" },
      ]}
    />
  );
}
