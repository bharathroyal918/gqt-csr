"use client";

import React from "react";
import { PortalDashboardView } from "@/components/dashboard/PortalDashboardView";
import { Award, UserCheck, Clock, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function FacultyDashboardPage() {
  const { students, attendanceRecords, currentUser } = useApp();

  const deptStudents = students.filter(
    (s) =>
      !currentUser.department ||
      s.branch?.toLowerCase().includes("cs") ||
      s.branch === currentUser.department
  );

  const totalDept = deptStudents.length;
  const verifiedCount = deptStudents.filter((s) => s.status !== "Registered").length;
  const pendingCount = totalDept - verifiedCount;
  const interviewCleared = deptStudents.filter((s) => s.status.includes("Selected") || s.status.includes("Offer")).length;
  const attendanceRate = attendanceRecords.length > 0 
    ? `${Math.round((attendanceRecords.filter(a => a.status === "Present").length / attendanceRecords.length) * 100)}%` 
    : "0%";

  return (
    <PortalDashboardView
      portalTitle={currentUser.department ? `Faculty Coordinator Dashboard — ${currentUser.department}` : "Faculty Coordinator Dashboard"}
      portalSubtitle="Student verification, exam hall attendance tracking, lab session monitoring, and department coordination."
      roleBadge="Faculty Coordination Authority"
      stats={[
        {
          title: "Department Candidates",
          value: totalDept.toString(),
          change: currentUser.department || "Academic Department",
          trend: "neutral",
          icon: Users,
        },
        {
          title: "Verified Students",
          value: verifiedCount.toString(),
          change: pendingCount > 0 ? `${pendingCount} pending` : "All verified",
          trend: "up",
          icon: UserCheck,
        },
        {
          title: "Exam Attendance",
          value: attendanceRate,
          change: `${attendanceRecords.length} sessions logged`,
          trend: "up",
          icon: Clock,
        },
        {
          title: "Interview Cleared",
          value: interviewCleared.toString(),
          change: `${interviewCleared} selections`,
          trend: "up",
          icon: Award,
        },
      ]}
      quickActions={[
        { label: "Verify Students", href: "/faculty/student-verification", icon: UserCheck, variant: "primary" },
        { label: "Take Live Attendance", href: "/faculty/attendance", icon: Clock, variant: "secondary" },
      ]}
    />
  );
}
