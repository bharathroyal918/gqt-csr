"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface GQTLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  clickable?: boolean;
}

export function GQTLogo({
  className = "",
  size = "md",
  showTagline = true,
  clickable = true,
}: GQTLogoProps) {
  const sizeMap = {
    sm: { height: 32, width: 110, fontSize: "text-[10px]" },
    md: { height: 42, width: 150, fontSize: "text-xs" },
    lg: { height: 54, width: 190, fontSize: "text-sm" },
    xl: { height: 68, width: 240, fontSize: "text-base" },
  };

  const dim = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm border border-slate-200/80 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gqt-logo.png"
          alt="Global Quest Technologies Logo"
          style={{ height: `${dim.height}px`, width: "auto" }}
          className="object-contain"
          onError={(e) => {
            // Fallback to /logo.jpeg if png is not found
            (e.target as HTMLImageElement).src = "/logo.jpeg";
          }}
        />
      </div>

      {showTagline && (
        <div className="hidden sm:flex flex-col">
          <span className="font-extrabold text-[#001B4D] tracking-tight leading-none text-base">
            GLOBAL QUEST
          </span>
          <span className="font-medium text-[#005BBB] text-xs tracking-wider uppercase">
            TECHNOLOGIES
          </span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-normal mt-0.5">
            Training • Innovation • Placement
          </span>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href="/portal/dashboard" className="transition-transform hover:scale-[1.02]">
        {content}
      </Link>
    );
  }

  return content;
}
