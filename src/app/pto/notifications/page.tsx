"use client";

import React from "react";
import { PortalPlaceholderPage } from "@/components/dashboard/PortalPlaceholderPage";
import { Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PTONotificationsPage() {
  const { notifications, currentUser } = useApp();

  const rows = notifications.map((n, idx) => ({
    id: `NTC-${n.id.slice(-4).toUpperCase() || idx + 1}`,
    title: n.title,
    cat: n.type || "System Notice",
    time: n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent",
    status: n.read ? "Read" : "Unread",
  }));

  return (
    <PortalPlaceholderPage
      title="Placement Office Notifications"
      subtitle={`Drive schedule alerts, shortlist releases, student offer confirmations, and GQT communications${currentUser.collegeName ? ` for ${currentUser.collegeName}` : ""}.`}
      badge="Placement Office"
      icon={Bell}
      entityName="Notifications"
      actionButtonText="Refresh Notifications"
      columns={["Notice ID", "Title", "Category", "Delivery Time", "Status"]}
      rows={rows}
    />
  );
}
