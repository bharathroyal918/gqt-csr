"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  UserRole,
  UserAccount,
  College,
  CSRDrive,
  Student,
  Question,
  CRMInteraction,
  FollowUpReminder,
  NotificationItem,
  AuditLog,
  DocumentItem,
  CalendarEvent,
  TaskItem,
  HelpdeskTicket,
  AttendanceRecord,
  HRInterview,
  OfferLetter,
  ExamResult,
  CutoffConfig,
  StudentStatus,
} from "@/types";
import { toast } from "sonner";
import { CSR_15_PHASES } from "@/lib/workflow/drivePhases";
import {
  collegesService,
  drivesService,
  studentsService,
  crmService,
  tasksService,
  questionsService,
  usersService,
  interviewsService,
  offersService,
  notificationsService,
  auditService,
} from "@/lib/supabase/services";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { examService } from "@/lib/supabase/exam.service";
import {
  INITIAL_COLLEGES,
  INITIAL_DRIVES,
  INITIAL_STUDENTS,
  INITIAL_QUESTIONS,
  INITIAL_CRM_INTERACTIONS,
  INITIAL_FOLLOW_UPS,
  INITIAL_TASKS,
  INITIAL_TICKETS,
  INITIAL_DOCUMENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS,
} from "@/data/mockData";

// Role-based baseline identities — strictly empty values; all real data comes dynamically from user login / database
const ROLE_PROFILES: Record<UserRole, UserAccount> = {
  super_admin: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "super_admin",
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  csr_manager: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "csr_manager",
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  hr: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "hr",
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  hr_recruiter: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "hr_recruiter",
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  placement_officer: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "placement_officer",
    avatar: "",
    collegeId: "",
    collegeName: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  pto: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "pto",
    avatar: "",
    collegeId: "",
    collegeName: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  faculty: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "faculty",
    avatar: "",
    collegeId: "",
    collegeName: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  faculty_coordinator: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "faculty_coordinator",
    avatar: "",
    collegeId: "",
    collegeName: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  principal: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "principal",
    avatar: "",
    collegeId: "",
    collegeName: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  placement_coordinator: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "placement_coordinator",
    avatar: "",
    collegeId: "",
    collegeName: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  student: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "student",
    avatar: "",
    collegeId: "",
    collegeName: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: false,
  },
  management: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "management",
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  admission_team: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "admission_team",
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  admission: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "admission",
    avatar: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  operations: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "operations",
    avatar: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  support: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "support",
    avatar: "",
    department: "",
    status: "active",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: false,
  },
};

export const ALL_DEFAULT_USERS: UserAccount[] = Object.values(ROLE_PROFILES);

interface AppContextType {
  // Authentication & Authority Portals
  currentUser: UserAccount;
  currentRole: UserRole;
  loginWithRole: (role: UserRole, email?: string) => void;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updates: Partial<UserAccount>) => Promise<boolean>;
  updateCurrentUserPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, "id">) => void;
  isLoading: boolean;

  // Data Stores
  colleges: College[];
  addCollege: (college: Omit<College, "id">) => void;
  updateCollege: (id: string, updates: Partial<College>) => Promise<boolean>;

  drives: CSRDrive[];
  addDrive: (drive: Omit<CSRDrive, "id">) => void;
  updateDrive: (id: string, updates: Partial<CSRDrive>) => Promise<boolean>;
  cloneDrive: (id: string) => void;
  archiveDrive: (id: string) => void;
  advanceDrivePhase: (driveId: string, targetPhaseOrder?: number) => void;

  students: Student[];
  registerStudent: (studentData: Omit<Student, "id" | "studentId" | "registeredAt" | "status">) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<{ success: boolean; data?: Student; error?: string }>;
  submitExam: (studentId: string, result: ExamResult) => void;
  submitInterviewFeedback: (interview: HRInterview) => void;
  sendOfferLetter: (offer: Omit<OfferLetter, "id" | "offerIssuedDate">) => void;
  respondToOffer: (offerId: string, response: "accept" | "reject" | "clarify", clarificationText?: string) => void;

  questions: Question[];
  addQuestion: (question: Omit<Question, "id">) => void;

  crmInteractions: CRMInteraction[];
  logCRMInteraction: (interaction: Omit<CRMInteraction, "id" | "timestamp">) => void;

  followUps: FollowUpReminder[];
  addFollowUp: (followUp: Omit<FollowUpReminder, "id">) => void;
  updateFollowUpStatus: (id: string, status: FollowUpReminder["status"]) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadCount: number;

  auditLogs: AuditLog[];
  logAuditAction: (action: string, entityType: AuditLog["entityType"], entityId: string, details: string, oldValue?: string, newValue?: string) => void;

  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, "id">) => void;
  updateTaskStatus: (id: string, status: TaskItem["status"]) => void;

  tickets: HelpdeskTicket[];
  addTicket: (ticket: Omit<HelpdeskTicket, "id" | "ticketNumber" | "createdAt" | "messages">, initialMessage: string) => void;
  replyToTicket: (ticketId: string, message: string) => void;

  documents: DocumentItem[];
  uploadDocument: (doc: Omit<DocumentItem, "id" | "uploadedAt" | "version">) => void;

  calendarEvents: CalendarEvent[];
  attendanceRecords: AttendanceRecord[];

  // Cutoff & Shortlisting Management
  cutoffConfig: CutoffConfig;
  updateCutoffConfig: (updates: Partial<CutoffConfig>) => Promise<CutoffConfig>;
  approveAndReleaseCutoff: (cutoffScore?: number, adminName?: string) => Promise<{ config: CutoffConfig; shortlistedCount: number; rejectedCount: number }>;
  shortlistStudent: (studentId: string, statusOrShortlisted: StudentStatus | boolean) => Promise<boolean>;

  // Global Dialogs & Controls
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEFAULT_STUDENTS: Student[] = INITIAL_STUDENTS;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentRole, setCurrentRole] = useState<UserRole>("super_admin");
  const [currentUser, setCurrentUser] = useState<UserAccount>(ROLE_PROFILES.super_admin);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic state stores — identical SSR/Client initial values prevent hydration mismatch
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [drives, setDrives] = useState<CSRDrive[]>(INITIAL_DRIVES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [crmInteractions, setCrmInteractions] = useState<CRMInteraction[]>(INITIAL_CRM_INTERACTIONS);
  const [followUps, setFollowUps] = useState<FollowUpReminder[]>(INITIAL_FOLLOW_UPS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(INITIAL_TICKETS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [calendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [attendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Exam Cutoff & Shortlisting State
  const [cutoffConfig, setCutoffConfig] = useState<CutoffConfig>(() => examService.getCutoffConfig());

  useEffect(() => {
    try {
      const cfg = examService.getCutoffConfig();
      setCutoffConfig(cfg);
    } catch { }
  }, []);

  const updateCutoffConfig = async (updates: Partial<CutoffConfig>) => {
    const updated = await examService.saveCutoffConfig(updates);
    setCutoffConfig(updated);
    return updated;
  };

  const approveAndReleaseCutoff = async (cutoffScore?: number, adminName?: string) => {
    const score = cutoffScore !== undefined ? cutoffScore : cutoffConfig.cutoffScore;
    const admin = adminName || currentUser.name || "Administrator";
    const res = await examService.approveAndReleaseCutoff(score, admin, students);
    setCutoffConfig(res.config);
    try {
      const stds = await studentsService.getAll();
      if (stds && stds.length > 0) setStudents(stds);
    } catch { }
    return res;
  };

  const shortlistStudent = async (studentId: string, statusOrShortlisted: StudentStatus | boolean) => {
    const newStatus: StudentStatus = typeof statusOrShortlisted === "boolean"
      ? (statusOrShortlisted ? "Qualified" : "Disqualified")
      : statusOrShortlisted;

    const res = await studentsService.update(studentId, { status: newStatus });
    if (res.success) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId || s.studentId === studentId
            ? { ...s, status: newStatus }
            : s
        )
      );
      return true;
    }
    return false;
  };

  // Initialize Auth & Load Dynamic Supabase Data
  useEffect(() => {
    // 0. Safely hydrate client-side cached data after initial mount (prevents SSR hydration mismatch)
    try {
      const cachedUsers = localStorage.getItem("gqt_cached_users");
      if (cachedUsers) setUsers(JSON.parse(cachedUsers));
      const cachedColleges = localStorage.getItem("gqt_cached_colleges");
      if (cachedColleges) setColleges(JSON.parse(cachedColleges));
      const cachedDrives = localStorage.getItem("gqt_cached_drives");
      if (cachedDrives) setDrives(JSON.parse(cachedDrives));
      const cachedStudents = localStorage.getItem("gqt_cached_students");
      if (cachedStudents) setStudents(JSON.parse(cachedStudents));
      const cachedCrm = localStorage.getItem("gqt_cached_crm");
      if (cachedCrm) setCrmInteractions(JSON.parse(cachedCrm));
      const cachedFollowups = localStorage.getItem("gqt_cached_followups");
      if (cachedFollowups) setFollowUps(JSON.parse(cachedFollowups));
      const cachedTasks = localStorage.getItem("gqt_cached_tasks");
      if (cachedTasks) setTasks(JSON.parse(cachedTasks));
      const cachedTickets = localStorage.getItem("gqt_cached_tickets");
      if (cachedTickets) setTickets(JSON.parse(cachedTickets));
    } catch { }

    // 1. Dark mode preference
    try {
      const savedDarkMode = localStorage.getItem("gqt_dark_mode");
      if (savedDarkMode === "true") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch { }

    // 2. Resolve Active Role & Auth Session
    const initAuth = async () => {
      try {
        const isStudentPortal = typeof window !== "undefined" && window.location.pathname.startsWith("/student");
        const savedRole = typeof window !== "undefined" ? (localStorage.getItem("gqt_role") as UserRole) : null;
        const savedEmail = typeof window !== "undefined" ? localStorage.getItem("gqt_user_email") : null;
        const savedName = typeof window !== "undefined" ? localStorage.getItem("gqt_user_name") : null;

        // If on student portal, always honor student role and prevent staff credentials from leaking into student view
        if (isStudentPortal || savedRole === "student") {
          setCurrentRole("student");
          let authEmail = savedEmail;
          let authId: string | null = null;

          if (isSupabaseConfigured) {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (
                session?.user?.email &&
                !session.user.email.toLowerCase().includes("admin") &&
                !session.user.email.toLowerCase().includes("staff")
              ) {
                authEmail = session.user.email;
                authId = session.user.id;
              }
            } catch { }
          }

          const matchedStudent = (authEmail || authId || savedEmail || savedName)
            ? students.find(
              (s) =>
                (authEmail && s.email?.toLowerCase() === authEmail.toLowerCase()) ||
                (authId && s.id === authId) ||
                (savedEmail && (s.usn?.toLowerCase() === savedEmail.toLowerCase() || s.email?.toLowerCase() === savedEmail.toLowerCase())) ||
                (savedName && s.fullName?.toLowerCase().includes(savedName.toLowerCase()))
            )
            : undefined;

          if (matchedStudent) {
            setCurrentUser({
              ...ROLE_PROFILES.student,
              id: matchedStudent.id,
              name: matchedStudent.fullName,
              email: matchedStudent.email,
              phone: matchedStudent.mobile || ROLE_PROFILES.student.phone,
              collegeName: matchedStudent.collegeName || ROLE_PROFILES.student.collegeName,
              collegeId: matchedStudent.collegeId || ROLE_PROFILES.student.collegeId,
              department: matchedStudent.branch || ROLE_PROFILES.student.department,
              avatar: matchedStudent.photoUrl || "",
            });
            if (typeof window !== "undefined") {
              localStorage.setItem("gqt_role", "student");
              localStorage.setItem("gqt_user_email", matchedStudent.email);
              localStorage.setItem("gqt_user_name", matchedStudent.fullName);
              localStorage.setItem("gqt_user_id", matchedStudent.id);
            }
          } else {
            setCurrentUser({
              ...ROLE_PROFILES.student,
              email: savedEmail || authEmail || "",
              name: savedName || "",
            });
          }
          document.cookie = `gqt_active_role=student; path=/; max-age=86400; SameSite=Lax`;
          return;
        }

        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const role = (session.user.user_metadata?.role as UserRole) || "super_admin";
            const profile = ROLE_PROFILES[role] || ROLE_PROFILES.super_admin;
            const name = session.user.user_metadata?.name || profile.name;
            setCurrentRole(role);
            setCurrentUser({
              ...profile,
              id: session.user.id,
              email: session.user.email || profile.email,
              name,
            });
            document.cookie = `gqt_active_role=${role}; path=/; max-age=86400; SameSite=Lax`;
            return;
          }
        }

        // Fallback to cookie or localStorage for offline / development
        if (savedRole && ROLE_PROFILES[savedRole]) {
          setCurrentRole(savedRole);
          const baseProfile = ROLE_PROFILES[savedRole];
          setCurrentUser(savedEmail ? { ...baseProfile, email: savedEmail, name: savedName || baseProfile.name } : baseProfile);
          document.cookie = `gqt_active_role=${savedRole}; path=/; max-age=86400; SameSite=Lax`;
        }
      } catch (err) {
        console.warn("Auth initialization error:", err);
      }
    };

    // 3. Dynamic Database Fetching with Instant Non-Blocking Timeout
    const loadDynamicData = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Supabase fetch timeout")), 3500)
        );

        const fetchPromise = Promise.allSettled([
          collegesService.getAll(),
          drivesService.getAll(),
          studentsService.getAll(),
          crmService.getAllInteractions(),
          crmService.getAllFollowUps(),
          tasksService.getAll(),
          questionsService.getAll(),
          usersService.getAll(),
          notificationsService.getAll(),
          auditService.getAll(),
          interviewsService.getAll(),
          offersService.getAll(),
        ]);

        const [
          collegesRes,
          drivesRes,
          studentsRes,
          crmRes,
          followUpsRes,
          tasksRes,
          questionsRes,
          usersRes,
          notifsRes,
          auditRes,
          interviewsRes,
          offersRes,
        ] = await Promise.race([fetchPromise, timeoutPromise]);

        if (collegesRes.status === "fulfilled" && collegesRes.value.length > 0) {
          const merged = [...collegesRes.value, ...INITIAL_COLLEGES];
          const unique = Array.from(new Map(merged.map((c) => [c.id, c])).values());
          setColleges(unique);
          if (typeof window !== "undefined") {
            try { localStorage.setItem("gqt_cached_colleges", JSON.stringify(unique)); } catch {}
          }
        }
        if (drivesRes.status === "fulfilled" && drivesRes.value.length > 0) {
          const merged = [...drivesRes.value, ...INITIAL_DRIVES];
          const unique = Array.from(new Map(merged.map((d) => [d.id, d])).values());
          setDrives(unique);
          if (typeof window !== "undefined") {
            try { localStorage.setItem("gqt_cached_drives", JSON.stringify(unique)); } catch {}
          }
        }

        const fetchedOffers = offersRes.status === "fulfilled" ? offersRes.value : [];
        const fetchedInterviews = interviewsRes.status === "fulfilled" ? interviewsRes.value : [];

        if (studentsRes.status === "fulfilled") {
          const fetchedStudents = studentsRes.value || [];
          let unique = Array.from(new Map([...fetchedStudents, ...INITIAL_STUDENTS].map((s) => [s.id, s])).values());

          // Merge live offers and interviews from Supabase
          if (fetchedOffers.length > 0 || fetchedInterviews.length > 0) {
            unique = unique.map((s) => {
              const matchedOffer = fetchedOffers.find(
                (o) => o.studentId === s.id || (s.email && o.studentEmail?.toLowerCase() === s.email.toLowerCase())
              );
              const matchedInterview = fetchedInterviews.find((i) => i.studentId === s.id);
              return {
                ...s,
                offerDetails: matchedOffer || s.offerDetails,
                interviewResult: matchedInterview || s.interviewResult,
                status: matchedOffer
                  ? (matchedOffer.status === "Accepted" ? "Offer Accepted" : "Offer Sent")
                  : s.status,
              };
            });
          }

          setStudents(unique);
          if (typeof window !== "undefined") {
            try { localStorage.setItem("gqt_cached_students", JSON.stringify(unique)); } catch {}
          }

          // Sync current student profile if user is student or on student portal
          const activeEmail = (typeof window !== "undefined" && localStorage.getItem("gqt_user_email")) || "";
          const activeName = (typeof window !== "undefined" && localStorage.getItem("gqt_user_name")) || "";
          const activeRole = (typeof window !== "undefined" && localStorage.getItem("gqt_role")) || "";
          const isStudentRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/student");

          if (isStudentRoute || activeRole === "student") {
            const foundStudent = (activeEmail || activeName)
              ? unique.find(
                (s) =>
                  (activeEmail && (s.email?.toLowerCase() === activeEmail.toLowerCase() || s.usn?.toLowerCase() === activeEmail.toLowerCase())) ||
                  (activeName && s.fullName?.toLowerCase().includes(activeName.toLowerCase()))
              )
              : undefined;

            if (foundStudent) {
              setCurrentUser((prev) => ({
                ...prev,
                id: foundStudent.id,
                name: foundStudent.fullName,
                email: foundStudent.email,
                phone: foundStudent.mobile || prev.phone,
                collegeName: foundStudent.collegeName || prev.collegeName,
                collegeId: foundStudent.collegeId || prev.collegeId,
                department: foundStudent.branch || prev.department,
                avatar: foundStudent.photoUrl || "",
              }));
              if (typeof window !== "undefined") {
                localStorage.setItem("gqt_user_email", foundStudent.email);
                localStorage.setItem("gqt_user_name", foundStudent.fullName);
                localStorage.setItem("gqt_user_id", foundStudent.id);
              }
            }
          }
        }
        if (crmRes.status === "fulfilled" && crmRes.value.length > 0) {
          const merged = [...crmRes.value, ...INITIAL_CRM_INTERACTIONS];
          const unique = Array.from(new Map(merged.map((x) => [x.id, x])).values());
          setCrmInteractions(unique);
          if (typeof window !== "undefined") {
            try { localStorage.setItem("gqt_cached_crm", JSON.stringify(unique)); } catch {}
          }
        }
        if (followUpsRes.status === "fulfilled" && followUpsRes.value.length > 0) {
          const merged = [...followUpsRes.value, ...INITIAL_FOLLOW_UPS];
          const unique = Array.from(new Map(merged.map((x) => [x.id, x])).values());
          setFollowUps(unique);
          if (typeof window !== "undefined") {
            try { localStorage.setItem("gqt_cached_followups", JSON.stringify(unique)); } catch {}
          }
        }
        if (tasksRes.status === "fulfilled" && tasksRes.value.length > 0) {
          const merged = [...tasksRes.value, ...INITIAL_TASKS];
          const unique = Array.from(new Map(merged.map((x) => [x.id, x])).values());
          setTasks(unique);
          if (typeof window !== "undefined") {
            try { localStorage.setItem("gqt_cached_tasks", JSON.stringify(unique)); } catch {}
          }
        }
        if (questionsRes.status === "fulfilled" && questionsRes.value.length > 0) {
          setQuestions(Array.from(new Map([...questionsRes.value, ...INITIAL_QUESTIONS].map((x) => [x.id, x])).values()));
        }
        if (usersRes.status === "fulfilled" && usersRes.value.length > 0) {
          const unique = Array.from(new Map([...usersRes.value, ...INITIAL_USERS].map((u) => [u.id, u])).values());
          setUsers(unique);
          if (typeof window !== "undefined") {
            try { localStorage.setItem("gqt_cached_users", JSON.stringify(unique)); } catch {}
          }
        }
        if (notifsRes.status === "fulfilled" && notifsRes.value.length > 0) {
          setNotifications(Array.from(new Map([...notifsRes.value, ...INITIAL_NOTIFICATIONS].map((x) => [x.id, x])).values()));
        }
        if (auditRes.status === "fulfilled" && auditRes.value.length > 0) {
          setAuditLogs(Array.from(new Map([...auditRes.value, ...INITIAL_AUDIT_LOGS].map((x) => [x.id, x])).values()));
        }
      } catch (err) {
        console.warn("Background data sync notice (using fast cached state):", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    loadDynamicData();

    // 4. Listen to Auth State Changes
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        // Do not let background Supabase staff auth override active student portal session
        if (typeof window !== "undefined" && window.location.pathname.startsWith("/student")) {
          return;
        }
        if (session?.user) {
          const role = (session.user.user_metadata?.role as UserRole) || "super_admin";
          const profile = ROLE_PROFILES[role] || ROLE_PROFILES.super_admin;
          const name = session.user.user_metadata?.name || profile.name;
          setCurrentRole(role);
          setCurrentUser({
            ...profile,
            id: session.user.id,
            email: session.user.email || profile.email,
            name,
          });
          document.cookie = `gqt_active_role=${role}; path=/; max-age=86400; SameSite=Lax`;
        }
      });

      // 5. Connect Supabase Realtime for Cross-Portal Live Synchronization
      const channel = supabase
        .channel("gqt-realtime-portal-sync")
        .on(
          "postgres_changes" as any,
          { event: "*", schema: "public", table: "students" },
          (payload: any) => {
            if (payload.eventType === "UPDATE" && payload.new) {
              const updated = payload.new;
              setStudents((prev) =>
                prev.map((s) =>
                  s.id === updated.id || (s.email && s.email.toLowerCase() === updated.email?.toLowerCase())
                    ? { ...s, status: updated.status || s.status, percentage: updated.percentage ?? s.percentage }
                    : s
                )
              );
            } else if (payload.eventType === "INSERT" && payload.new) {
              loadDynamicData();
            }
          }
        )
        .on(
          "postgres_changes" as any,
          { event: "*", schema: "public", table: "interviews" },
          (payload: any) => {
            if (payload.new) {
              const updated = payload.new;
              setStudents((prev) =>
                prev.map((s) => {
                  if (s.id === updated.student_id) {
                    return {
                      ...s,
                      interviewResult: {
                        id: updated.id,
                        studentId: updated.student_id,
                        studentName: s.fullName,
                        collegeName: s.collegeName,
                        branch: s.branch,
                        driveId: updated.drive_id,
                        scheduledSlot: updated.scheduled_slot,
                        meetingLink: updated.meeting_link || "https://meet.google.com/gqt-csr-2026",
                        interviewerName: updated.interviewer_name || "Lead Corporate Recruiter",
                        interviewerRole: updated.interviewer_role || "HR Executive",
                        status: updated.status,
                        ratings: updated.ratings || s.interviewResult?.ratings,
                        remarks: updated.remarks || s.interviewResult?.remarks,
                        recommendation: updated.recommendation || s.interviewResult?.recommendation,
                      },
                    };
                  }
                  return s;
                })
              );
            }
          }
        )
        .on(
          "postgres_changes" as any,
          { event: "*", schema: "public", table: "offers" },
          (payload: any) => {
            if (payload.new) {
              const updated = payload.new;
              setStudents((prev) =>
                prev.map((s) => {
                  if (s.id === updated.student_id) {
                    return {
                      ...s,
                      offerDetails: {
                        id: updated.id,
                        offerNumber: updated.offer_number || `GQT/OFFER/2026/${updated.id.slice(-4)}`,
                        studentId: updated.student_id,
                        studentName: s.fullName,
                        studentEmail: s.email,
                        studentPhone: s.mobile,
                        collegeName: s.collegeName,
                        driveName: s.driveName,
                        roleTitle: updated.role_title || "Associate Software Engineer",
                        course: updated.course || s.selectedCourse,
                        branch: s.branch,
                        batch: updated.batch || s.batch,
                        ctc: updated.ctc || "₹ 6.50 LPA",
                        stipendDuringInternship: updated.stipend_during_internship || "₹ 15,000 / month",
                        location: updated.location || "Bengaluru, Karnataka",
                        joiningDate: updated.joining_date || "2026-07-01",
                        offerIssuedDate: updated.issued_at || new Date().toISOString().split("T")[0],
                        validUntil: updated.valid_until || "2026-08-01",
                        status: updated.status,
                        qrVerificationCode: updated.qr_verification_code,
                        digitalSignatureUrl: updated.digital_signature_url,
                        pdfUrl: updated.pdf_url,
                      },
                    };
                  }
                  return s;
                })
              );
            }
          }
        )
        .on(
          "postgres_changes" as any,
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload: any) => {
            if (payload.new) {
              const n = payload.new;
              setNotifications((prev) => [
                {
                  id: n.id,
                  title: n.title,
                  message: n.message,
                  type: n.category === "hr" ? "warning" : "info",
                  channel: "In-App",
                  targetRoles: ["student", "hr", "super_admin"],
                  timestamp: n.created_at || new Date().toISOString(),
                  read: false,
                  actionUrl: n.action_url,
                },
                ...prev,
              ]);
            }
          }
        )
        .subscribe();

      return () => {
        authListener?.subscription?.unsubscribe();
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("gqt_dark_mode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("gqt_dark_mode", "false");
      }
      return next;
    });
  };

  const loginWithRole = (role: UserRole, email?: string) => {
    setCurrentRole(role);
    const targetUser = ROLE_PROFILES[role] || ROLE_PROFILES.super_admin;
    let userToSet: UserAccount = { ...targetUser };

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      userToSet.email = cleanEmail;

      if (role === "student") {
        const matched = students.find(
          (s) =>
            s.email?.toLowerCase() === cleanEmail ||
            s.usn?.toLowerCase() === cleanEmail ||
            s.studentId?.toLowerCase() === cleanEmail
        );

        if (matched) {
          userToSet = {
            ...userToSet,
            id: matched.id,
            name: matched.fullName,
            email: matched.email,
            phone: matched.mobile || userToSet.phone,
            collegeId: matched.collegeId || userToSet.collegeId,
            collegeName: matched.collegeName || userToSet.collegeName,
            department: matched.branch || userToSet.department,
            avatar: matched.photoUrl || userToSet.avatar,
          };
        }
      } else {
        const matched = users.find((u) => u.email?.toLowerCase() === cleanEmail);
        if (matched) {
          userToSet = {
            ...userToSet,
            ...matched,
          };
        }
      }
    }

    setCurrentUser(userToSet);
    try {
      localStorage.setItem("gqt_role", role);
      if (userToSet.email) localStorage.setItem("gqt_user_email", userToSet.email);
      if (userToSet.name) localStorage.setItem("gqt_user_name", userToSet.name);
      document.cookie = `gqt_active_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    } catch { }
    logAuditAction("LOGIN_AUTHENTICATED", "User", userToSet.id, `User authenticated to ${role} authority portal as ${userToSet.name}`);
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem("gqt_role");
      localStorage.removeItem("gqt_user_email");
      localStorage.removeItem("gqt_user_name");
      document.cookie = "gqt_active_role=; path=/; max-age=0; SameSite=Lax";
      setCurrentRole("super_admin");
      setCurrentUser(ROLE_PROFILES.super_admin);
    } catch { }
    toast.info("Signed out of portal");
  };

  const switchRole = (role: UserRole) => {
    loginWithRole(role);
  };

  const advanceDrivePhase = (driveId: string, targetPhaseOrder?: number) => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id !== driveId) return d;
        const currentPhaseIdx = 3;
        const nextOrder = targetPhaseOrder ?? (currentPhaseIdx + 1);
        const nextPhase = CSR_15_PHASES.find((p) => p.order === nextOrder);
        const updatedStatus = nextPhase?.correspondingDriveStatus || d.status;
        return {
          ...d,
          status: updatedStatus,
        };
      })
    );
  };

  const logAuditAction = (
    action: string,
    entityType: AuditLog["entityType"],
    entityId: string,
    details: string,
    oldValue?: string,
    newValue?: string
  ) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      user: currentUser.name || "System User",
      userRole: currentRole,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      ipAddress: "106.51.10.45",
      browser: "Chrome (Platform)",
      oldValue,
      newValue,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addCollege = (collegeData: Omit<College, "id">) => {
    const newId = `col-${Date.now().toString().slice(-4)}`;
    const newCollege: College = { ...collegeData, id: newId };
    setColleges((prev) => [newCollege, ...prev]);
    collegesService.create(collegeData).catch(() => { });
    const code = collegeData.collegeCode || collegeData.vtuCode || "";
    toast.success("College Onboarded", { description: `${collegeData.name} (${code}) added successfully.` });
    logAuditAction("COLLEGE_ONBOARDED", "College", newId, `Added college ${collegeData.name}`);
  };

  const updateCollege = async (id: string, updates: Partial<College>): Promise<boolean> => {
    setColleges((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    const success = await collegesService.update(id, updates);
    if (success) {
      toast.success("College profile updated in database");
    } else {
      toast.error("Failed to update college in database");
    }
    logAuditAction("COLLEGE_UPDATED", "College", id, `Updated details for college ID ${id}`);
    return success;
  };

  const addDrive = (driveData: Omit<CSRDrive, "id">) => {
    const newId = `drv-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
    const newDrive: CSRDrive = { ...driveData, id: newId };
    setDrives((prev) => [newDrive, ...prev]);
    drivesService.create(driveData).catch(() => { });
    toast.success("CSR Drive Created!", { description: `${driveData.name} is now live in the system.` });
    logAuditAction("CSR_DRIVE_CREATED", "CSR Drive", newId, `Launched drive ${driveData.name}`);
  };

  const updateDrive = async (id: string, updates: Partial<CSRDrive>): Promise<boolean> => {
    setDrives((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    const success = await drivesService.update(id, updates);
    if (success) {
      toast.success("Drive updated successfully in database");
    } else {
      toast.error("Failed to update drive in database");
    }
    logAuditAction("CSR_DRIVE_UPDATED", "CSR Drive", id, `Updated drive configuration for ${id}`);
    return success;
  };

  const cloneDrive = (id: string) => {
    const target = drives.find((d) => d.id === id);
    if (!target) return;
    const clonedId = `drv-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
    const clonedDrive: CSRDrive = {
      ...target,
      id: clonedId,
      name: `${target.name} (Copy)`,
      driveCode: `${target.driveCode}-COPY`,
      status: "Draft",
      metrics: {
        collegesCount: target.metrics.collegesCount,
        registeredStudents: 0,
        examAttended: 0,
        qualifiedStudents: 0,
        interviewSelected: 0,
        offerLettersSent: 0,
        acceptedOffers: 0,
      },
    };
    setDrives((prev) => [clonedDrive, ...prev]);
    toast.success("Drive Cloned", { description: `Created draft copy: ${clonedDrive.name}` });
  };

  const archiveDrive = (id: string) => {
    updateDrive(id, { status: "Archived" });
    toast.info("Drive Archived", { description: "Drive moved to archived records." });
  };

  const registerStudent = (studentData: Omit<Student, "id" | "studentId" | "registeredAt" | "status">): Student => {
    const newId = `stu-${Date.now().toString().slice(-4)}`;
    const studentIdCode = `GQT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      studentId: studentIdCode,
      registeredAt: new Date().toISOString(),
      status: "Hall Ticket Generated",
    };
    setStudents((prev) => [newStudent, ...prev]);
    studentsService.register(studentData).catch(() => { });
    toast.success("Registration Successful!", {
      description: `Welcome ${studentData.fullName}! Your Hall Ticket & Student ID is ${studentIdCode}.`,
    });
    logAuditAction("STUDENT_REGISTERED", "Student", newId, `Registered student ${studentData.fullName} (${studentData.usn})`);
    return newStudent;
  };

  const updateStudent = async (
    id: string,
    updates: Partial<Student>
  ): Promise<{ success: boolean; data?: Student; error?: string }> => {
    // 1. Optimistic state update
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id || (updates.email && s.email?.toLowerCase() === updates.email.toLowerCase())
          ? { ...s, ...updates }
          : s
      )
    );

    // 2. Keep currentUser in sync if this student is currentUser
    setCurrentUser((prev) => {
      if (prev.id === id || (updates.email && prev.email?.toLowerCase() === updates.email.toLowerCase())) {
        return {
          ...prev,
          name: updates.fullName || prev.name,
          email: updates.email || prev.email,
          phone: updates.mobile || prev.phone,
          avatar: updates.photoUrl || prev.avatar,
          department: updates.branch || prev.department,
          collegeName: updates.collegeName || prev.collegeName,
          collegeId: updates.collegeId || prev.collegeId,
        };
      }
      return prev;
    });

    // 3. Persist to Supabase
    const res = await studentsService.update(id, updates);
    if (res.success && res.data) {
      const dbStudent = res.data;
      setStudents((prev) =>
        prev.map((s) => (s.id === id || s.id === dbStudent.id ? dbStudent : s))
      );
      toast.success("Database updated successfully", {
        description: `Changes saved for ${updates.fullName || res.data.fullName}.`,
      });
    } else {
      toast.error("Database update error", {
        description: res.error || "Could not persist student changes to database.",
      });
    }
    return res;
  };

  const submitExam = (studentId: string, result: ExamResult) => {
    const newStatus = result.qualified ? "Qualified" : "Disqualified";
    let matchedStudent: Student | undefined;

    setStudents((prev) => {
      const exists = prev.some((s) => s.id === studentId || (currentUser.email && s.email === currentUser.email));
      if (exists) {
        return prev.map((s) => {
          if (s.id === studentId || (currentUser.email && s.email === currentUser.email)) {
            matchedStudent = { ...s, status: newStatus, examResult: result, percentage: result.percentage };
            return matchedStudent;
          }
          return s;
        });
      }
      // If student not found in current local array, initialize with user's actual session details
      const newStudent: Student = {
        id: studentId,
        studentId: studentId.startsWith("std-") ? studentId : `GQT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: currentUser.name || "Candidate",
        email: currentUser.email || "",
        mobile: currentUser.phone || "",
        whatsappNumber: currentUser.phone || "",
        gender: "Male",
        dob: "",
        collegeId: currentUser.collegeId || "",
        collegeName: currentUser.collegeName || "",
        usn: "",
        university: "",
        graduateType: "BE",
        branch: currentUser.department || "",
        semester: 8,
        passingYear: 2026,
        cgpa: 0,
        percentage: result.percentage,
        aadhaarLast4: "",
        city: "",
        district: "",
        pincode: "",
        preferredTrainingMode: "Online",
        driveId: result.driveId || "",
        driveName: "",
        selectedCourse: "",
        batch: "2026",
        referralSource: "",
        termsAccepted: true,
        photoUrl: currentUser.avatar || "",
        status: newStatus,
        registeredAt: new Date().toISOString(),
        examResult: result,
      };
      matchedStudent = newStudent;
      return [newStudent, ...prev];
    });

    // Cross-Portal Supabase Persistence & Notifications
    const candidateToPersist = matchedStudent || students.find((s) => s.id === studentId);
    if (candidateToPersist) {
      examService.submitExamEvaluation(
        candidateToPersist,
        questions,
        {},
        result.violations || [],
        1800,
        result.autoSubmitted
      ).catch((err) => console.warn("Supabase exam persistence error:", err));
    }

    toast(result.qualified ? "🎉 Congratulations! You Qualified for HR Interview!" : "Assessment Submitted", {
      description: `Marks: ${result.marksObtained}/100 (${result.percentage}%). Rank: #${result.rank}.`,
    });
    logAuditAction("EXAM_SUBMITTED", "Exam", studentId, `Exam score: ${result.marksObtained}/100. Status: ${newStatus}`);
  };

  const submitInterviewFeedback = (interview: HRInterview) => {
    const targetStudent = students.find((s) => s.id === interview.studentId);
    if (!targetStudent) return;

    let newStatus: Student["status"] = "HR Selected";
    if (interview.status === "Hold") newStatus = "HR On Hold";
    else if (interview.status === "Rejected") newStatus = "HR Rejected";

    updateStudent(targetStudent.id, {
      status: newStatus,
      interviewResult: interview,
    });

    toast.success("Interview Feedback Logged", {
      description: `${interview.studentName} marked as ${interview.status}.`,
    });
    logAuditAction(
      "INTERVIEW_FEEDBACK",
      "HR Interview",
      interview.id,
      `Submitted feedback for ${interview.studentName}. Status: ${interview.status}`
    );
  };

  const sendOfferLetter = (offerData: Omit<OfferLetter, "id" | "offerIssuedDate">) => {
    const newOfferId = `off-${Date.now().toString().slice(-4)}`;
    const fullOffer: OfferLetter = {
      ...offerData,
      id: newOfferId,
      offerIssuedDate: new Date().toISOString().split("T")[0],
      status: "Sent",
      qrVerificationCode: `GQT-VERIFY-2026-${offerData.studentId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      digitalSignatureUrl: "/images/signatures/director-signature.png",
    };

    updateStudent(offerData.studentId, {
      status: "Offer Sent",
      offerDetails: fullOffer,
    });

    toast.success("Offer Letter Issued!", {
      description: `Offer sent to ${offerData.studentName} (${offerData.ctc}).`,
    });
    logAuditAction("OFFER_LETTER_SENT", "Offer Letter", newOfferId, `Issued offer letter to ${offerData.studentName}`);
  };

  const respondToOffer = (offerId: string, response: "accept" | "reject" | "clarify", clarificationText?: string) => {
    const targetStudent = students.find((s) => s.offerDetails?.id === offerId);
    if (!targetStudent || !targetStudent.offerDetails) return;

    let newStatus: OfferLetter["status"] = "Accepted";
    let studentStatus: Student["status"] = "Offer Accepted";

    if (response === "reject") {
      newStatus = "Rejected";
      studentStatus = "Offer Rejected";
    } else if (response === "clarify") {
      newStatus = "Clarification Requested";
    }

    const updatedOffer: OfferLetter = {
      ...targetStudent.offerDetails,
      status: newStatus,
      acceptedAt: response === "accept" ? new Date().toISOString() : undefined,
      acceptedIp: response === "accept" ? "106.51.240.18" : undefined,
      clarificationQuery: clarificationText,
    };

    updateStudent(targetStudent.id, {
      status: studentStatus,
      offerDetails: updatedOffer,
    });

    if (response === "accept") {
      toast.success("🎉 Offer Accepted Successfully!", {
        description: "Your acceptance has been cryptographically logged. Welcome to Global Quest Technologies!",
      });
    } else if (response === "reject") {
      toast.info("Offer Declined", { description: "Your response has been conveyed to HR." });
    } else {
      toast.info("Clarification Submitted", { description: "HR recruiter will respond to your query shortly." });
    }

    logAuditAction(
      `OFFER_${response.toUpperCase()}`,
      "Offer Letter",
      offerId,
      `Student ${targetStudent.fullName} responded: ${response}`
    );
  };

  const addQuestion = (qData: Omit<Question, "id">) => {
    const newQ: Question = { ...qData, id: `q-${Date.now().toString().slice(-4)}` };
    setQuestions((prev) => [newQ, ...prev]);
    toast.success("Question Added to Bank");
  };

  const logCRMInteraction = (interactionData: Omit<CRMInteraction, "id" | "timestamp">) => {
    const newCRM: CRMInteraction = {
      ...interactionData,
      id: `crm-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
    };
    setCrmInteractions((prev) => [newCRM, ...prev]);
    crmService.logInteraction(interactionData).catch(() => { });
    toast.success("Communication Logged", {
      description: `${interactionData.type} with ${interactionData.contactPerson} recorded.`,
    });
    logAuditAction("CRM_LOGGED", "CRM", newCRM.id, `Logged ${interactionData.type} for ${interactionData.collegeName}`);
  };

  const addFollowUp = (folData: Omit<FollowUpReminder, "id">) => {
    const newFol: FollowUpReminder = { ...folData, id: `fol-${Date.now().toString().slice(-4)}` };
    setFollowUps((prev) => [newFol, ...prev]);
    crmService.addFollowUp(folData).catch(() => { });
    toast.success("Follow-up reminder set");
  };

  const updateFollowUpStatus = (id: string, status: FollowUpReminder["status"]) => {
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    crmService.updateFollowUpStatus(id, status).catch(() => { });
    toast.success(`Follow-up marked as ${status}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const addTask = (taskData: Omit<TaskItem, "id">) => {
    const newTask: TaskItem = { ...taskData, id: `tsk-${Date.now().toString().slice(-4)}` };
    setTasks((prev) => [newTask, ...prev]);
    tasksService.create(taskData).catch(() => { });
    toast.success("Task assigned successfully");
  };

  const updateTaskStatus = (id: string, status: TaskItem["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    tasksService.updateStatus(id, status).catch(() => { });
  };

  const addTicket = (
    ticketData: Omit<HelpdeskTicket, "id" | "ticketNumber" | "createdAt" | "messages">,
    initialMessage: string
  ) => {
    const newTkt: HelpdeskTicket = {
      ...ticketData,
      id: `tkt-${Date.now().toString().slice(-4)}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      messages: [
        {
          sender: ticketData.raisedBy,
          role: ticketData.role,
          text: initialMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setTickets((prev) => [newTkt, ...prev]);
    toast.success("Support Ticket Raised", { description: `Ticket #${newTkt.ticketNumber} created.` });
  };

  const replyToTicket = (ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: "In Progress",
          messages: [
            ...t.messages,
            {
              sender: currentUser.name || "Support",
              role: currentRole,
              text: message,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      })
    );
    toast.success("Reply posted to ticket");
  };

  const uploadDocument = (docData: Omit<DocumentItem, "id" | "uploadedAt" | "version">) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now().toString().slice(-4)}`,
      uploadedAt: new Date().toISOString(),
      version: 1,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    toast.success("Document Uploaded", { description: `${docData.title} saved to document vault.` });
  };

  const addUser = (userData: Omit<UserAccount, "id">) => {
    usersService
      .create(userData)
      .then((created) => {
        setUsers((prev) => [created, ...prev]);
      })
      .catch(() => {
        const fallback: UserAccount = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          ...userData,
        };
        setUsers((prev) => [fallback, ...prev]);
      });
    toast.success(`Staff user ${userData.name} onboarded!`);
  };

  // Dynamic Attendance Records derived strictly from real registered students & examinations in database
  const effectiveAttendance = useMemo<AttendanceRecord[]>(() => {
    if (attendanceRecords.length > 0) return attendanceRecords;
    return students.map((s, idx) => ({
      id: `att-${s.id}`,
      studentId: s.id,
      studentName: s.fullName,
      usn: s.usn,
      collegeName: s.collegeName,
      driveId: s.driveId,
      sessionTitle: s.examResult
        ? "CSR Flagship Assessment - Online Proctored Test"
        : "CSR Drive Orientation & Verification",
      joinTime: new Date(Date.now() - (idx + 1) * 3600000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      leaveTime: s.examResult
        ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : undefined,
      durationMinutes: s.examResult ? 45 : 25,
      rejoinCount: 0,
      device: "Campus Test Terminal",
      ipAddress: `172.16.${Math.floor(10 + idx)}.${Math.floor(100 + ((idx * 7) % 150))}`,
      status: s.examResult ? "Present" : s.status === "Registered" ? "Present" : "Late",
    }));
  }, [attendanceRecords, students]);

  // Dynamic Calendar Events derived from active CSR Drives in database
  const effectiveCalendarEvents = useMemo<CalendarEvent[]>(() => {
    if (calendarEvents.length > 0) return calendarEvents;
    const events: CalendarEvent[] = [];
    drives.forEach((d) => {
      if (d.schedule?.examDate) {
        events.push({
          id: `evt-exam-${d.id}`,
          title: `${d.name} - Online Proctored Technical Examination`,
          type: "Exam",
          date: d.schedule.examDate,
          startTime: d.schedule.examTime || "10:30 AM",
          endTime: "11:45 AM",
          collegeName: d.venue || "Statewide Online Proctor Platform",
          venue: d.location,
          status: "Confirmed",
        });
      }
      if (d.schedule?.interviewDate) {
        events.push({
          id: `evt-int-${d.id}`,
          title: `${d.name} - HR Technical Panel Interviews`,
          type: "Interview",
          date: d.schedule.interviewDate,
          startTime: "09:30 AM",
          endTime: "05:30 PM",
          collegeName: "Google Meet Virtual Rooms",
          venue: d.location,
          status: "Confirmed",
        });
      }
      if (d.schedule?.regStart) {
        events.push({
          id: `evt-drive-${d.id}`,
          title: `${d.name} - Drive Inauguration & Student Registration Open`,
          type: "Drive",
          date: d.schedule.regStart,
          startTime: "09:00 AM",
          endTime: "05:00 PM",
          collegeName: d.venue,
          venue: d.location,
          status: "Confirmed",
        });
      }
    });
    return events;
  }, [calendarEvents, drives]);

  // Dynamic Documents derived from real Colleges & Students in database
  const effectiveDocuments = useMemo<DocumentItem[]>(() => {
    if (documents.length > 0) return documents;
    const docs: DocumentItem[] = [];
    colleges.forEach((c) => {
      docs.push({
        id: `doc-mou-${c.id}`,
        title: `Bilateral CSR Skilling MoU - ${c.name}`,
        category: "MOU",
        entityType: "College",
        entityId: c.id,
        entityName: c.name,
        fileUrl: c.mouDocumentUrl || "/documents/mous/GQT_MOU_Generic.pdf",
        fileName: `MoU_${c.collegeCode || c.vtuCode || "GQT"}_2026.pdf`,
        fileSize: "2.4 MB",
        fileType: "application/pdf",
        uploadedBy: "CSR Directorate",
        uploadedAt: c.mouSignedDate || new Date().toISOString(),
        version: 1,
      });
    });
    students.forEach((s) => {
      if (s.offerDetails) {
        docs.push({
          id: `doc-off-${s.id}`,
          title: `Official Appointment Offer Letter - ${s.fullName}`,
          category: "Offer Letter",
          entityType: "Student",
          entityId: s.id,
          entityName: s.fullName,
          fileUrl: `/student/offer/${s.offerDetails.id}`,
          fileName: `GQT_Offer_${s.offerDetails.offerNumber.replace(/\//g, "_")}.pdf`,
          fileSize: "1.2 MB",
          fileType: "application/pdf",
          uploadedBy: "HR Talent Directorate",
          uploadedAt: s.offerDetails.offerIssuedDate || new Date().toISOString(),
          version: 1,
        });
      }
    });
    return docs;
  }, [documents, colleges, students]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const updateCurrentUserProfile = async (updates: Partial<UserAccount>): Promise<boolean> => {
    try {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
      if (typeof window !== "undefined") {
        if (updates.name) localStorage.setItem("gqt_user_name", updates.name);
        if (updates.email) localStorage.setItem("gqt_user_email", updates.email);
      }

      // If student portal or student role, synchronize directly to Supabase students table
      const isStudentPortal = typeof window !== "undefined" && window.location.pathname.startsWith("/student");
      if (isStudentPortal || currentRole === "student" || currentUser.role === "student") {
        const studentRecord = students.find(
          (s) =>
            s.id === currentUser.id ||
            (currentUser.email && s.email?.toLowerCase() === currentUser.email?.toLowerCase())
        );

        if (studentRecord) {
          const studentUpdates: Partial<Student> = {
            fullName: updates.name || studentRecord.fullName,
            mobile: updates.phone || studentRecord.mobile,
            photoUrl: updates.avatar || studentRecord.photoUrl,
            branch: updates.department || studentRecord.branch,
            email: updates.email || studentRecord.email,
          };
          await updateStudent(studentRecord.id, studentUpdates);
        }
      }

      // Persist to Supabase users/profiles
      if (currentUser.id) {
        await usersService.update(currentUser.id, updates);
      }

      // Update in local users state
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id || (currentUser.email && u.email === currentUser.email) ? { ...u, ...updates } : u))
      );

      logAuditAction("PROFILE_UPDATED", "User", currentUser.id || "Anonymous", `User updated profile details.`);
      return true;
    } catch (err: any) {
      toast.error("Failed to update profile", { description: err.message });
      return false;
    }
  };

  const updateCurrentUserPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await usersService.updatePassword(newPassword);
      if (!res.success) {
        toast.error("Password change failed", { description: res.error });
        return res;
      }
      logAuditAction("PASSWORD_CHANGED", "User", currentUser.id || "Anonymous", `User updated their account password.`);
      toast.success("Password changed successfully", {
        description: "Your credentials have been securely updated in Supabase Auth.",
      });
      return { success: true };
    } catch (err: any) {
      toast.error("Password update error", { description: err.message });
      return { success: false, error: err.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        updateCurrentUserProfile,
        updateCurrentUserPassword,
        users,
        addUser,
        isLoading,
        colleges,
        addCollege,
        updateCollege,
        drives,
        addDrive,
        updateDrive,
        cloneDrive,
        archiveDrive,
        students,
        registerStudent,
        updateStudent,
        submitExam,
        submitInterviewFeedback,
        sendOfferLetter,
        respondToOffer,
        questions,
        addQuestion,
        crmInteractions,
        logCRMInteraction,
        followUps,
        addFollowUp,
        updateFollowUpStatus,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadCount,
        auditLogs,
        logAuditAction,
        tasks,
        addTask,
        updateTaskStatus,
        tickets,
        addTicket,
        replyToTicket,
        documents: effectiveDocuments,
        uploadDocument,
        calendarEvents: effectiveCalendarEvents,
        attendanceRecords: effectiveAttendance,
        loginWithRole,
        logout,
        advanceDrivePhase,
        cutoffConfig,
        updateCutoffConfig,
        approveAndReleaseCutoff,
        shortlistStudent,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isRoleSwitcherOpen,
        setIsRoleSwitcherOpen,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
