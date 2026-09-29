"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function AdmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="admission_team" portalName="Admission Team Portal">
      {children}
    </PortalLayout>
  );
}
