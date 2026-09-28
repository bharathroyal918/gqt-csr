"use client";

import React, { forwardRef } from "react";
import { Calendar } from "lucide-react";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const dateId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={dateId}
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="date"
            id={dateId}
            ref={ref}
            className={`w-full text-xs font-medium rounded-xl border bg-white dark:bg-slate-900/70 text-slate-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#005BBB] py-2.5 pl-10 pr-3.5 cursor-pointer ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200 dark:border-slate-800 focus:border-[#005BBB]"
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-[11px] font-semibold text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
