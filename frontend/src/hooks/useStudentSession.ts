"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { Student, CSRDrive, ExamResult } from "@/types";
import { profileService } from "@/lib/supabase/profile.service";
import { activityService, StudentActivityItem } from "@/lib/supabase/activity.service";
import { examService } from "@/lib/supabase/exam.service";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface JourneyStage {
  id: number;
  title: string;
  done: boolean;
  key: string;
}

export function useStudentSession() {
  const {
    students,
    drives,
    currentUser,
    updateStudent: appUpdateStudent,
    updateCurrentUserProfile,
    attendanceRecords,
  } = useApp();

  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [activities, setActivities] = useState<StudentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Initial resolution of the student from database / session
  const loadStudent = useCallback(async () => {
    try {
      const savedEmail = typeof window !== "undefined" ? localStorage.getItem("gqt_user_email") : null;
      const savedId = typeof window !== "undefined" ? localStorage.getItem("gqt_user_id") : null;
      const savedName = typeof window !== "undefined" ? localStorage.getItem("gqt_user_name") : null;

      // 1. Instant match against AppContext students array (0ms lag)
      if (students.length > 0) {
        const found = students.find((s) =>
          (savedEmail && (s.email?.toLowerCase() === savedEmail.toLowerCase() || s.usn?.toLowerCase() === savedEmail.toLowerCase())) ||
          (savedId && s.id === savedId) ||
          (savedName && s.fullName?.toLowerCase().includes(savedName.toLowerCase())) ||
          (currentUser?.email && !currentUser.email.includes("admin") && s.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
          (currentUser?.id && s.id === currentUser.id)
        );

        if (found) {
          setActiveStudent(found);
          profileService.syncLocalSession(found);
          setIsLoading(false);
          return found;
        }
      }

      // 2. Fallback to remote database session resolution with timeout
      const resolved = await Promise.race([
        profileService.resolveAuthenticatedStudent(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
      ]);

      if (resolved) {
        setActiveStudent(resolved);
        setIsLoading(false);
        return resolved;
      }

      // NOTE: Do NOT fall back to students[0] — that would show another student's
      // data to a different logged-in user. Return null and let the UI show
      // a proper "session expired / please login" state.
    } catch (err) {
      console.warn("useStudentSession resolution note:", err);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [students, currentUser?.email, currentUser?.id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  // Synchronize when AppContext students array updates
  useEffect(() => {
    if (activeStudent?.id && students.length > 0) {
      const matched = students.find((s) => s.id === activeStudent.id);
      if (matched && (matched.status !== activeStudent.status || matched.fullName !== activeStudent.fullName)) {
        setActiveStudent(matched);
      }
    }
  }, [students, activeStudent?.id, activeStudent?.status, activeStudent?.fullName]);

  // 2. Fetch realtime activities
  useEffect(() => {
    if (!activeStudent?.id) return;
    activityService.getStudentActivities(activeStudent.id).then((acts) => {
      setActivities(acts);
    });
  }, [activeStudent?.id]);

  // 3. Supabase Realtime Subscription for instant database syncing
  useEffect(() => {
    if (!isSupabaseConfigured || !activeStudent?.id) return;

    const channel = supabase
      .channel(`student-session-sync-${activeStudent.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
          filter: `id=eq.${activeStudent.id}`,
        },
        (payload: any) => {
          if (payload.new) {
            const mapped = profileService.mapDbRowToStudent(payload.new);
            setActiveStudent((prev) => (prev ? { ...prev, ...mapped } : mapped));
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activities",
        },
        () => {
          activityService.getStudentActivities(activeStudent.id).then(setActivities);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeStudent?.id]);

  // Current effective student
  const student = useMemo<Student>(() => {
    if (activeStudent) return activeStudent;

    return {
      id: "",
      studentId: "",
      fullName: "",
      email: "",
      mobile: "",
      whatsappNumber: "",
      gender: "Other",
      dob: "",
      collegeId: "",
      collegeName: "",
      usn: "",
      university: "",
      graduateType: "",
      branch: "",
      semester: 0,
      passingYear: 0,
      cgpa: 0,
      percentage: 0,
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      resumeUrl: "",
      aadhaarLast4: "",
      city: "",
      district: "",
      pincode: "",
      preferredTrainingMode: "Hybrid",
      driveId: "",
      driveName: "",
      selectedCourse: "",
      batch: "",
      referralSource: "",
      termsAccepted: true,
      status: "Registered",
      registeredAt: "",
      photoUrl: "",
    };
  }, [activeStudent, students]);

  // Profile completion calculation
  const profileCompletion = useMemo(() => {
    return profileService.calculateProfileCompletion(student);
  }, [student]);

  // Registration number
  const registrationNumber = useMemo(() => {
    if (!student.id && !student.studentId) return "";
    return student.referralSource?.startsWith("REG-")
      ? student.referralSource
      : student.studentId
        ? `REG-${student.studentId.replace("GQT-", "")}`
        : "";
  }, [student]);

  // Initials for avatar
  const initials = useMemo(() => {
    if (!student.fullName) return "";
    return (
      student.fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || ""
    );
  }, [student.fullName]);

  // Active CSR Drive
  const activeDrive = useMemo<CSRDrive | undefined>(() => {
    if (student.driveId) {
      const match = drives.find((d) => d.id === student.driveId || d.driveCode === student.driveId);
      if (match) return match;
    }
    return drives[0] || undefined;
  }, [student.driveId, drives]);

  // Lead Trainer
  const leadTrainer = useMemo(() => {
    return activeDrive?.assignments?.trainer || "";
  }, [activeDrive]);

  // Attendance rate calculation
  const studentAttendanceRate = useMemo(() => {
    if (!student.id) return 0;
    const records = attendanceRecords.filter((a) => a.studentId === student.id);
    if (records.length === 0) return 0;
    const present = records.filter((r) => r.status === "Present" || r.status === "Late").length;
    return Math.round((present / records.length) * 100);
  }, [student.id, attendanceRecords]);

  // Greeting
  const greeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Exam Result resolution strictly from student record or database
  const examResult = useMemo<ExamResult | null>(() => {
    if (student.examResult) return student.examResult;
    if (!student.id) return null;
    const stored = examService.getStoredResult(student.id);
    if (stored) return stored;
    return null;
  }, [student]);

  // 10-Step Recruitment Journey
  const journeyStages = useMemo<JourneyStage[]>(() => {
    const status = student.status || "Registered";
    const hasExam = !!examResult || status === "Exam Completed" || status === "Qualified";
    const isQual = examResult?.qualified ?? (status === "Qualified" || status.includes("HR") || status.includes("Offer"));
    const isInterview = !!student.interviewResult || status === "HR Interview Scheduled" || status === "Interview Attended" || status.includes("HR Selected") || status.includes("Offer");
    const isPanel = status.includes("HR Selected") || status.includes("Offer") || status.includes("HR On Hold");
    const isOffer = !!student.offerDetails || status === "Offer Sent" || status === "Offer Accepted";
    const isAccepted = status === "Offer Accepted" || student.offerDetails?.status === "Accepted";
    const isAdmitted = isAccepted;
    const isBatchAllocated = !!student.batch && isAccepted;

    return [
      { id: 1, title: "Registration", done: true, key: "reg" },
      { id: 2, title: "Document Verification", done: profileCompletion >= 80, key: "doc" },
      { id: 3, title: "Assessment", done: hasExam, key: "exam" },
      { id: 4, title: "Qualified", done: isQual, key: "qual" },
      { id: 5, title: "Interview", done: isInterview, key: "int" },
      { id: 6, title: "Panel Decision", done: isPanel, key: "panel" },
      { id: 7, title: "Offer Letter", done: isOffer, key: "offer" },
      { id: 8, title: "Acceptance", done: isAccepted, key: "accept" },
      { id: 9, title: "Admission", done: isAdmitted, key: "adm" },
      { id: 10, title: "Batch Allocation", done: isBatchAllocated, key: "batch" },
    ];
  }, [student, profileCompletion, examResult]);

  // Profile update handler
  const updateProfile = useCallback(
    async (updates: Partial<Student>): Promise<boolean> => {
      try {
        setActiveStudent((prev) => (prev ? { ...prev, ...updates } : null));

        if (student.id) {
          await appUpdateStudent(student.id, updates);
        }

        if (updates.fullName || updates.photoUrl) {
          await updateCurrentUserProfile({
            name: updates.fullName || student.fullName,
            avatar: updates.photoUrl || student.photoUrl,
          });
        }

        profileService.syncLocalSession({ ...student, ...updates });
        return true;
      } catch (err) {
        console.error("Profile update error:", err);
        return false;
      }
    },
    [student, appUpdateStudent, updateCurrentUserProfile]
  );

  // Avatar upload handler
  const uploadAvatar = useCallback(
    async (file: File): Promise<{ success: boolean; avatarUrl?: string; error?: string }> => {
      const res = await profileService.uploadAndSyncAvatar(student, file);
      if (res.success && res.avatarUrl) {
        await updateProfile({ photoUrl: res.avatarUrl });
      }
      return res;
    },
    [student, updateProfile]
  );

  // Hall ticket download recorder
  const recordHallTicketDownload = useCallback(async () => {
    if (student.id) {
      await profileService.recordHallTicketDownload(student.id);
    }
  }, [student.id]);

  return {
    student,
    isLoading,
    activeDrive,
    profileCompletion,
    registrationNumber,
    initials,
    journeyStages,
    examResult,
    leadTrainer,
    studentAttendanceRate,
    greeting,
    activities,
    updateProfile,
    uploadAvatar,
    recordHallTicketDownload,
    refreshStudent: loadStudent,
  };
}
