"use client";

import React from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout portalRole="super_admin" portalName="Super Admin Portal">
      {children}
    </PortalLayout>
  );
}
