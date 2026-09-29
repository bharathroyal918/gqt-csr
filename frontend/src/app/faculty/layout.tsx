"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="faculty" portalName="Faculty Portal">
      {children}
    </PortalLayout>
  );
}
