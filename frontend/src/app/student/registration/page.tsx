"use client";

import React from "react";
import { StudentRegistrationProvider } from "@/context/StudentRegistrationContext";
import RegisterPage from "../register/page";

export default function RegistrationPage() {
  return (
    <StudentRegistrationProvider>
      <RegisterPage />
    </StudentRegistrationProvider>
  );
}
