"use client";

import React from "react";
import { PortalPlaceholderPage } from "@/components/dashboard/PortalPlaceholderPage";
import { Briefcase } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PrincipalDrivesPage() {
  const { drives, currentUser } = useApp();

  const rows = drives.map((d, idx) => ({
    code: d.id ? (d.id.startsWith("drv-") ? d.id.toUpperCase() : `DRV-${d.id.slice(-4).toUpperCase()}`) : `DRV-${idx + 1}`,
    name: d.name,
    batch: d.batch || "—",
    reg: (d.metrics?.registeredStudents || 0).toLocaleString(),
    qual: (d.metrics?.qualifiedStudents || 0).toLocaleString(),
    offers: (d.metrics?.acceptedOffers || 0).toLocaleString(),
  }));

  return (
    <PortalPlaceholderPage
      title="Institutional CSR Drives"
      subtitle={`Track live recruitment drives sanctioned${currentUser.collegeName ? ` for ${currentUser.collegeName}` : ""} with phase timelines and candidate progress.`}
      badge="Principal Authority"
      icon={Briefcase}
      entityName="Drives"
      actionButtonText="Request New Campus Drive"
      columns={["Drive Code", "Drive Name", "Target Batch", "Registered", "Qualified", "Offers Released"]}
      rows={rows}
    />
  );
}
