"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function PTOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="placement_officer" portalName="Placement Officer Portal">
      {children}
    </PortalLayout>
  );
}
