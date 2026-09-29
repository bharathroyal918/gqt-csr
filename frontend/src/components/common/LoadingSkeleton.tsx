"use client";

import React from "react";

export interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle" | "card";
  count?: number;
}

export function LoadingSkeleton({
  className = "",
  variant = "rect",
  count = 1,
}: LoadingSkeletonProps) {
  const baseClasses =
    "animate-pulse bg-slate-200 dark:bg-slate-800 transition-colors";

  const variantClasses = {
    text: "h-3.5 w-3/4 rounded-md my-1",
    rect: "h-20 w-full rounded-2xl",
    circle: "w-10 h-10 rounded-full",
    card: "h-40 w-full rounded-[24px]",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        />
      ))}
    </>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="text" className="w-48 h-6" />
        <LoadingSkeleton variant="rect" className="w-28 h-9 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LoadingSkeleton variant="card" count={4} />
      </div>
      <LoadingSkeleton variant="rect" className="h-64" />
    </div>
  );
}
