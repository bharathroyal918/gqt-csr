"use client";

import React from "react";
import Link from "next/link";
import { FolderLock, Laptop, Users, Award } from "lucide-react";

export function StudentQuickHub() {
  const hubs = [
    {
      title: "Document Vault",
      subtitle: "Resume & Verification",
      href: "/student/documents",
      icon: FolderLock,
      bgColor: "bg-blue-50 dark:bg-blue-950/60",
      textColor: "text-primary",
    },
    {
      title: "Attendance & Batch",
      subtitle: "95% Mandatory Policy",
      href: "/student/attendance",
      icon: Laptop,
      bgColor: "bg-teal-50 dark:bg-teal-950/60",
      textColor: "text-teal-600",
    },
    {
      title: "Interview Center",
      subtitle: "Google Meet & Ratings",
      href: "/student/interview",
      icon: Users,
      bgColor: "bg-purple-50 dark:bg-purple-950/60",
      textColor: "text-purple-600",
    },
    {
      title: "Offer Letter",
      subtitle: "Acceptance & PDF",
      href: "/student/offer-letter",
      icon: Award,
      bgColor: "bg-emerald-50 dark:bg-emerald-950/60",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {hubs.map((hub) => {
        const Icon = hub.icon;
        return (
          <Link
            key={hub.title}
            href={hub.href}
            className="p-4 bg-card rounded-2xl border border-border hover:border-primary transition-all group block shadow-xs"
          >
            <div
              className={`w-10 h-10 rounded-xl ${hub.bgColor} ${hub.textColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-foreground">{hub.title}</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">{hub.subtitle}</p>
          </Link>
        );
      })}
    </div>
  );
}
