"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  gradient?: "blue" | "navy" | "cyan" | "purple" | "emerald" | "amber";
  className?: string;
  onClick?: () => void;
}

const gradientMap = {
  blue: "from-[#007BFF] to-[#005BBB] text-white shadow-blue-500/20",
  navy: "from-[#001B4D] to-[#003087] text-white shadow-blue-950/20",
  cyan: "from-[#14B8FF] to-[#007BFF] text-white shadow-cyan-500/20",
  purple: "from-[#8B5CF6] to-[#6D28D9] text-white shadow-purple-500/20",
  emerald: "from-[#10B981] to-[#059669] text-white shadow-emerald-500/20",
  amber: "from-[#F59E0B] to-[#D97706] text-white shadow-amber-500/20",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  isPositive = true,
  trend,
  subtitle,
  gradient = "blue",
  className = "",
  onClick,
}: StatCardProps) {
  const positive = trend ? trend === "up" : isPositive;
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`gqt-card p-3.5 sm:p-4 bg-white dark:bg-[#111C3A] rounded-2xl relative overflow-hidden group cursor-pointer transition-shadow hover:shadow-md border border-slate-200/80 dark:border-slate-800 ${className}`}
    >
      {/* Top Row: Clear Name & Compact Icon */}
      <div className="flex items-start justify-between gap-2 min-h-[32px]">
        <h4
          className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-snug break-words flex-1"
          title={title}
        >
          {title}
        </h4>

        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${gradientMap[gradient]} flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200`}
        >
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
      </div>

      {/* Middle Row: Large Metric Value & Growth Badge */}
      <div className="mt-2 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
        <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
          {value}
        </h3>
        {change && (
          <span
            className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
              positive
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
            }`}
          >
            {positive ? (
              <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline shrink-0" />
            ) : (
              <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline shrink-0" />
            )}
            {change}
          </span>
        )}
      </div>

      {/* Bottom Row: Context Subtitle */}
      {subtitle && (
        <p
          className="mt-1.5 text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight line-clamp-1"
          title={subtitle}
        >
          {subtitle}
        </p>
      )}

      {/* Subtle bottom decorative accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#005BBB]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
