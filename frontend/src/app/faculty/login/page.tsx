"use client";

import React from "react";
import { DedicatedLoginForm } from "@/components/auth/DedicatedLoginForm";
import { Award } from "lucide-react";

export default function FacultyLoginPage() {
  return (
    <DedicatedLoginForm
      role="faculty_coordinator"
      portalTitle="Faculty Coordinator Portal"
      portalSubtitle="Sign in to manage student hall tickets, campus exam attendance check-in, and tasks."
      authorityBadge="Faculty Coordination Authority"
      icon={Award}
      defaultEmail="coordinator.cs@rvce.edu.in"
      extraFieldLabel="Department & College Affiliation"
      extraFieldPlaceholder="e.g. CSE Dept - 1RV"
    />
  );
}
