"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="hr" portalName="HR Portal">
      {children}
    </PortalLayout>
  );
}
