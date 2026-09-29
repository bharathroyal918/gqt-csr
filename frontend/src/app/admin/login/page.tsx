"use client";

import React from "react";
import { DedicatedLoginForm } from "@/components/auth/DedicatedLoginForm";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <DedicatedLoginForm
      role="super_admin"
      portalTitle="Super Administrator Command Center"
      portalSubtitle="Sign in to access root system administration, RBAC permissions, audit forensics, and system settings."
      authorityBadge="Root Super Administrator"
      icon={ShieldCheck}
      defaultEmail="admin@globalquesttechnologies.com"
      extraFieldLabel="Master Security Key"
      extraFieldPlaceholder="e.g. ROOT-KEY-001"
    />
  );
}
