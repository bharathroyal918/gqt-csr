"use client";

import React from "react";
import { StudentActivityItem } from "@/lib/supabase/activity.service";

interface StudentActivityStreamProps {
  activities: StudentActivityItem[];
}

export function StudentActivityStream({ activities }: StudentActivityStreamProps) {
  return (
    <div className="p-6 bg-card border border-border shadow-sm rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Activity Stream
        </h3>
        <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Realtime
        </span>
      </div>

      <div className="space-y-2.5">
        {activities.length > 0 ? (
          activities.slice(0, 4).map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1"
            >
              <div className="font-bold text-foreground flex items-center justify-between">
                <span className="truncate">{act.title}</span>
                <span className="text-[10px] text-muted-foreground font-normal shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {act.description}
              </p>
            </div>
          ))
        ) : (
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
            <div className="font-bold text-foreground">Registration Authenticated</div>
            <p className="text-[11px] text-muted-foreground">
              Profile loaded from database and synchronized for CSR examinations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
