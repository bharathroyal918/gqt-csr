"use client";

import React from "react";
import { DedicatedLoginForm } from "@/components/auth/DedicatedLoginForm";
import { BarChart3 } from "lucide-react";

export default function ManagementLoginPage() {
  return (
    <DedicatedLoginForm
      role="management"
      portalTitle="Executive Governance & Management Portal"
      portalSubtitle="Sign in to view executive state-wide CSR metrics, college conversion analytics, and audit logs."
      authorityBadge="Executive Board & Management"
      icon={BarChart3}
      defaultEmail="director@globalquesttechnologies.com"
      extraFieldLabel="Board Authorization Key"
      extraFieldPlaceholder="e.g. EXEC-2026-HQ"
    />
  );
}
