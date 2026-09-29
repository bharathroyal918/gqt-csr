"use client";

import React from "react";
import { StudentRegistrationProvider } from "@/context/StudentRegistrationContext";

export default function StudentRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentRegistrationProvider>
      {children}
    </StudentRegistrationProvider>
  );
}
