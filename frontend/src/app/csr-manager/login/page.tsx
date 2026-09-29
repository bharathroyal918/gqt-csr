"use client";

import React from "react";
import { DedicatedLoginForm } from "@/components/auth/DedicatedLoginForm";
import { Briefcase } from "lucide-react";

export default function CSRManagerLoginPage() {
  return (
    <DedicatedLoginForm
      role="csr_manager"
      portalTitle="CSR Operations & Drive Command Portal"
      portalSubtitle="Sign in to orchestrate end-to-end 15-phase CSR drives, college outreach, CRM follow-ups, and WhatsApp bots."
      authorityBadge="CSR Operations Authority"
      icon={Briefcase}
      defaultEmail="rajesh.kumar@globalquesttechnologies.com"
      extraFieldLabel="Operations Security Pin"
      extraFieldPlaceholder="e.g. 482190"
    />
  );
}
