"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout
      portalRole="management"
      portalName="Management Portal"
      isReadOnly={true}
    >
      {children}
    </PortalLayout>
  );
}
