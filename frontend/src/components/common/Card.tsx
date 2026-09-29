"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "subtle" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const variantStyles = {
    default:
      "rounded-[24px] bg-white dark:bg-[#111C3A] border border-slate-200/90 dark:border-slate-800 shadow-sm",
    glass:
      "rounded-[24px] bg-white/80 dark:bg-[#111C3A]/80 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-lg",
    subtle:
      "rounded-[24px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80",
    interactive:
      "rounded-[24px] bg-white dark:bg-[#111C3A] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-hover:border-blue-300",
  };

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const hasCustomLayout = /(^|\s)(flex-col|flex-row|block|grid)(\s|$)/.test(className);
  const defaultLayout = hasCustomLayout ? "flex" : "flex items-center justify-between";

  return (
    <div
      className={`${defaultLayout} pb-4 border-b border-slate-100 dark:border-slate-800/70 mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`pt-4 border-t border-slate-100 dark:border-slate-800/70 mt-4 flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
