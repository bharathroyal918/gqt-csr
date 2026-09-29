"use client";

import React from "react";
import { DedicatedLoginForm } from "@/components/auth/DedicatedLoginForm";
import { Building2 } from "lucide-react";

export default function PTOLoginPage() {
  return (
    <DedicatedLoginForm
      role="pto"
      portalTitle="Placement Officer (PTO) Portal"
      portalSubtitle="Sign in to monitor college batch participation, eligible candidates, and placement metrics."
      authorityBadge="College Placement Authority"
      icon={Building2}
      defaultEmail="placement@rvce.edu.in"
      extraFieldLabel="College Code"
      extraFieldPlaceholder="e.g. 1RV"
    />
  );
}
