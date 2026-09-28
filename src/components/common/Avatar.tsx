"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "busy" | "offline";
  className?: string;
}

export function Avatar({
  src,
  name,
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase() || "GQ";
  };

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const statusDotSize = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  const statusColors = {
    online: "bg-emerald-500",
    busy: "bg-amber-500",
    offline: "bg-slate-400",
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src && !imageError ? (
        <Image
          src={src}
          alt={name}
          width={64}
          height={64}
          unoptimized
          className={`${sizeClasses[size]} rounded-full object-cover border border-slate-200 dark:border-slate-700`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#007BFF] to-[#001B4D] text-white font-bold flex items-center justify-center shadow-xs select-none`}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900 ${statusColors[status]} ${statusDotSize[size]}`}
        />
      )}
    </div>
  );
}
