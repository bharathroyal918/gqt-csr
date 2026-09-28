"use client";

import React from "react";
import { DedicatedLoginForm } from "@/components/auth/DedicatedLoginForm";
import { Users } from "lucide-react";

export default function HRLoginPage() {
  return (
    <DedicatedLoginForm
      role="hr_recruiter"
      portalTitle="HR Recruitment Portal"
      portalSubtitle="Sign in to access candidate interview pipelines, rubric scoring, and offer generation."
      authorityBadge="HR Authority Portal"
      icon={Users}
      defaultEmail="priya.nair@globalquesttechnologies.com"
      extraFieldLabel="Employee ID / Panel Code"
      extraFieldPlaceholder="e.g. GQT-HR-042"
    />
  );
}
