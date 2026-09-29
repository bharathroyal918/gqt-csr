"use client";

import React from "react";
import { PortalPlaceholderPage } from "@/components/dashboard/PortalPlaceholderPage";
import { Users } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PTOStudentsPage() {
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
    branch: s.branch || "—",
    cgpa: s.cgpa ? s.cgpa.toString() : "—",
    ver: s.status === "Registered" ? "Pending" : "Verified",
    status: s.status,
  }));

  return (
    <PortalPlaceholderPage
      title="College Student Candidates"
      subtitle={`Verify student details, branch eligibility, CGPA criteria, and exam registration status${currentUser.collegeName ? ` for ${currentUser.collegeName}` : ""}.`}
      badge="Placement Office"
      icon={Users}
      entityName="Students"
      actionButtonText="Add Candidate"
      columns={["USN", "Student Name", "Branch", "CGPA", "Verification", "Drive Status"]}
      rows={rows}
    />
  );
}
