"use client";

import React from "react";
import { PortalPlaceholderPage } from "@/components/dashboard/PortalPlaceholderPage";
import { UserCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function FacultyStudentVerificationPage() {
  const { students, currentUser } = useApp();

  const collegeStudents = currentUser.collegeId
    ? students.filter(
        (s) =>
          s.collegeId === currentUser.collegeId ||
          s.collegeName?.toLowerCase() === currentUser.collegeName?.toLowerCase()
      )
    : students;

  const rows = collegeStudents.map((s) => ({
    usn: s.usn || "—",
    name: s.fullName,
    sem: s.semester ? `${s.semester}th Sem` : "—",
    dept: s.branch || "—",
    status: s.status === "Registered" ? "Pending Verification" : "Verified",
    action: s.status === "Registered" ? "Verify Details" : "Completed",
  }));

  return (
    <PortalPlaceholderPage
      title="Department Student Verification"
      subtitle={`Verify department enrollments, academic transcripts, and exam eligibility${currentUser.collegeName ? ` for ${currentUser.collegeName}` : ""}.`}
      badge="Faculty Coordinator"
      icon={UserCheck}
      entityName="Students"
      actionButtonText="Verify Batch"
      columns={["USN", "Candidate Name", "Semester", "Department", "Verification Status", "Action"]}
      rows={rows}
    />
  );
}
