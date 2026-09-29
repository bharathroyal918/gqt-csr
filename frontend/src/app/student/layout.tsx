"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="student" portalName="Student Portal">
      {children}
    </PortalLayout>
  );
}
