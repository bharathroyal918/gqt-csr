"use client";

import React from "react";
import { PortalPlaceholderPage } from "@/components/dashboard/PortalPlaceholderPage";
import { CheckCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PTOApprovalsPage() {
  const { students, currentUser } = useApp();

  const collegeStudents = currentUser.collegeId
    ? students.filter(
        (s) =>
          s.collegeId === currentUser.collegeId ||
          s.collegeName?.toLowerCase() === currentUser.collegeName?.toLowerCase()
      )
    : students;

  const rows = collegeStudents.map((s, idx) => ({
    id: `REQ-${s.id.slice(-4).toUpperCase() || idx + 1}`,
    name: s.fullName,
    usn: s.usn || "—",
    type: s.status === "Registered" ? "Eligibility Clearance" : "Drive Progression Clearance",
    date: s.registeredAt ? new Date(s.registeredAt).toLocaleDateString() : "Recent",
    action: s.status === "Registered" ? "Pending Approval" : "Approved",
  }));

  return (
    <PortalPlaceholderPage
      title="Student Eligibility & Drive Approvals"
      subtitle={`Approve student registrations, hall ticket generation, and backlog clearance requests${currentUser.collegeName ? ` for ${currentUser.collegeName}` : ""}.`}
      badge="Placement Office"
      icon={CheckCircle}
      entityName="Approvals"
      actionButtonText="Batch Approve Candidates"
      columns={["Request ID", "Student Name", "USN", "Request Type", "Submission Date", "Action"]}
      rows={rows}
    />
  );
}
