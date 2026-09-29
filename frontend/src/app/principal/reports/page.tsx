"use client";

import React from "react";
import { PortalPlaceholderPage } from "@/components/dashboard/PortalPlaceholderPage";
import { BarChart3 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PrincipalReportsPage() {
  const { documents, currentUser } = useApp();

  const rows = documents.map((doc, idx) => ({
    title: doc.title,
    session: "2025-26",
    aud: "Governing Council / NAAC",
    date: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recent",
    format: "Signed PDF",
  }));

  return (
    <PortalPlaceholderPage
      title="Institutional Placement Reports"
      subtitle={`Annual placement summaries, branch-wise hiring breakdown, salary benchmarking, and NAAC/NBA documentation${currentUser.collegeName ? ` for ${currentUser.collegeName}` : ""}.`}
      badge="Principal Authority"
      icon={BarChart3}
      entityName="Reports"
      actionButtonText="Download NAAC Report"
      columns={["Report Title", "Academic Session", "Target Audience", "Generated On", "Format"]}
      rows={rows}
    />
  );
}
