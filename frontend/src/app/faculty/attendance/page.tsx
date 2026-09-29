"use client";

import React from "react";
import { PortalPlaceholderPage } from "@/components/dashboard/PortalPlaceholderPage";
import { Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function FacultyAttendancePage() {
  const { attendanceRecords, currentUser } = useApp();

  const rows = attendanceRecords.map((a, idx) => ({
    usn: a.usn || "—",
    name: a.studentName,
    hall: a.sessionTitle || "—",
    time: a.joinTime || "—",
    status: a.status || "—",
  }));

  return (
    <PortalPlaceholderPage
      title="Live Exam & Session Attendance"
      subtitle={`Track real-time candidate check-in, proctored lab attendance, and exam terminal logs${currentUser.collegeName ? ` for ${currentUser.collegeName}` : ""}.`}
      badge="Faculty Coordinator"
      icon={Clock}
      entityName="Attendance Records"
      actionButtonText="Log Hall Attendance"
      columns={["USN", "Candidate Name", "Hall Number", "Check-in Time", "Attendance Status"]}
      rows={rows}
    />
  );
}
