"use client";

import React from "react";
import { DedicatedLoginForm } from "@/components/auth/DedicatedLoginForm";
import { Building2 } from "lucide-react";

export default function PrincipalLoginPage() {
  return (
    <DedicatedLoginForm
      role="principal"
      portalTitle="Principal & Executive College Portal"
      portalSubtitle="Sign in to approve institutional MoUs, track campus drive performance, and review placement reports."
      authorityBadge="Principal & Dean Authority"
      icon={Building2}
      defaultEmail="principal@rvce.edu.in"
      extraFieldLabel="Institution AISHE Code"
      extraFieldPlaceholder="e.g. C-1260"
    />
  );
}
