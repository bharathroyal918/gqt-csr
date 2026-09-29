"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function CSRManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="csr_manager" portalName="CSR Manager Portal">
      {children}
    </PortalLayout>
  );
}
