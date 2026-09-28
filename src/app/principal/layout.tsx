"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="principal" portalName="Principal Portal">
      {children}
    </PortalLayout>
  );
}
