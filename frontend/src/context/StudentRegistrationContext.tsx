"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentRegistrationPayload } from "@/services/studentAuth.service";
import { Student } from "@/types";

interface RegistrationState extends Partial<StudentRegistrationPayload> {
  currentStep: number;
  isOtpVerified: boolean;
  registeredStudent?: Student | null;
}

interface StudentRegistrationContextType {
  state: RegistrationState;
  updateState: (updates: Partial<RegistrationState>) => void;
  resetState: () => void;
}

const defaultState: RegistrationState = {
  currentStep: 1,
  isOtpVerified: false,
  registrationNumber: "",
  email: "",
  mobile: "",
  whatsappNumber: "",
  dob: "2004-01-01",
  password: "",
  fullName: "",
  gender: "Male",
  photoUrl: "",
  collegeId: "",
  collegeName: "",
  university: "",
  branch: "",
  usn: "",
  passingYear: 2027,
  semester: 8,
  graduateType: "BE",
  cgpa: 8.5,
  percentage: 82.5,
  currentBacklogs: 0,
  address: "",
  city: "",
  district: "",
  pincode: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  driveId: "",
  driveName: "",
  selectedCourse: "",
  batch: "2027 Batch",
  preferredTrainingMode: "Offline Campus",
  referralSource: "",
  resumeUrl: "",
  collegeIdCardUrl: "",
  aadhaarCardUrl: "",
  registeredStudent: null,
};

const StudentRegistrationContext = createContext<StudentRegistrationContextType | undefined>(undefined);

export function StudentRegistrationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RegistrationState>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("gqt_student_registration_state");
      if (saved) {
        try {
          return { ...defaultState, ...JSON.parse(saved) };
        } catch { }
      }
    }
    return defaultState;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("gqt_student_registration_state", JSON.stringify(state));
    }
  }, [state]);

  const updateState = (updates: Partial<RegistrationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("gqt_student_registration_state");
      sessionStorage.removeItem("gqt_student_reg_otp");
    }
  };

  return (
    <StudentRegistrationContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </StudentRegistrationContext.Provider>
  );
}

export function useStudentRegistration() {
  const context = useContext(StudentRegistrationContext);
  if (!context) {
    throw new Error("use Student Registration must be used within a Student Registration Provider");
  }
  return context;
}
