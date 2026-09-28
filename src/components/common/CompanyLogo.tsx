"use client";

import React, { useState } from "react";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const COMPANY_LOGOS: Record<string, { logo: string; domain: string }> = {
  google: { logo: "/images/companies/google.svg", domain: "google.com" },
  microsoft: { logo: "/images/companies/microsoft.svg", domain: "microsoft.com" },
  amazon: { logo: "/images/companies/amazon.svg", domain: "amazon.com" },
  tcs: { logo: "/images/companies/tcs.jpg", domain: "tcs.com" },
  infosys: { logo: "/images/companies/infosys.svg", domain: "infosys.com" },
  wipro: { logo: "/images/companies/wipro.svg", domain: "wipro.com" },
  ibm: { logo: "/images/companies/ibm.svg", domain: "ibm.com" },
  dell: { logo: "/images/companies/dell.svg", domain: "dell.com" },
  intel: { logo: "/images/companies/intel.svg", domain: "intel.com" },
  samsung: { logo: "/images/companies/samsung.svg", domain: "samsung.com" },
  phonepe: { logo: "/images/companies/phonepe.svg", domain: "phonepe.com" },
  razorpay: { logo: "/images/companies/razorpay.svg", domain: "razorpay.com" },
  flipkart: { logo: "/images/companies/flipkart.svg", domain: "flipkart.com" },
  zerodha: { logo: "/images/companies/zerodha.svg", domain: "zerodha.com" },
  swiggy: { logo: "/images/companies/swiggy.webp", domain: "swiggy.com" },
  gqt: { logo: "/images/gqt-logo.png", domain: "globalquesttechnologies.com" },
};

export function CompanyLogo({
  name,
  logoUrl,
  className = "",
  size = "md",
}: CompanyLogoProps) {
  const norm = (name || "").toLowerCase().trim();
  const dimensionClass = sizeClasses[size] || sizeClasses.md;

  let foundMatch: { logo: string; domain: string } | null = null;
  for (const [key, val] of Object.entries(COMPANY_LOGOS)) {
    if (norm.includes(key)) {
      foundMatch = val;
      break;
    }
  }

  const initialSrc =
    logoUrl ||
    foundMatch?.logo ||
    `https://www.google.com/s2/favicons?domain=${foundMatch?.domain || `${norm.replace(/\s+/g, "")}.com`}&sz=128`;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  const initials = (name || "CO")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${dimensionClass} ${className} flex items-center justify-center rounded-xl bg-white p-1 border border-slate-200/80 shadow-xs shrink-0 overflow-hidden relative`}
      title={name}
    >
      {!hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={`${name} official company logo`}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-[10px] font-bold text-[#005BBB] tracking-wider">
          {initials}
        </span>
      )}
    </div>
  );
}
