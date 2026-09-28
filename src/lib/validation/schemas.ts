import { z } from "zod";

// Student Registration Zod Schema
export const StudentRegistrationSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters").max(100),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile phone format"),
  whatsappNumber: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string(),
  collegeId: z.string().min(1, "College selection is required"),
  collegeName: z.string().min(1),
  usn: z.string().min(5, "USN must be at least 5 characters"),
  branch: z.string().min(2, "Branch is required"),
  degree: z.string().default("B.E / B.Tech"),
  yearOfPassing: z.number().int().min(2024).max(2030),
  cgpa: z.number().min(0).max(10).optional(),
  percentage: z.number().min(0).max(100).optional(),
  city: z.string().min(2),
  district: z.string().min(2),
  selectedCourse: z.string().min(2),
  preferredTrainingMode: z.enum(["Hybrid", "Offline Campus", "Virtual Live"]),
  termsAccepted: z.boolean().refine((val) => val === true, "Must accept terms and conditions"),
});

// Candidate Interview Evaluation Schema
export const InterviewEvaluationSchema = z.object({
  candidateId: z.string().min(1),
  driveId: z.string().min(1),
  technicalScore: z.number().int().min(1).max(10),
  communicationScore: z.number().int().min(1).max(10),
  attitudeScore: z.number().int().min(1).max(10),
  overallRating: z.number().min(1).max(10),
  recommendation: z.enum(["Selected", "Hold", "Rejected"]),
  detailedNotes: z.string().min(5, "Feedback notes must be at least 5 characters"),
  courseAllocated: z.string().optional(),
});

// Offer Generation Schema
export const OfferGenerationSchema = z.object({
  studentId: z.string().min(1),
  driveId: z.string().min(1),
  collegeId: z.string().min(1),
  candidateName: z.string().min(2),
  candidateEmail: z.string().email(),
  candidatePhone: z.string().min(10),
  courseName: z.string().min(2),
  stipendAmount: z.number().min(0),
  validityDays: z.number().int().min(1).max(90).default(7),
  trainingLocation: z.string().default("Bengaluru Campus / Virtual Hybrid"),
});

// User Provisioning Schema
export const UserProvisioningSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum([
    "super_admin",
    "csr_manager",
    "hr",
    "placement_officer",
    "faculty",
    "principal",
    "management",
    "student",
    "admission_team",
    "operations",
    "support",
  ]),
  department: z.string().optional(),
  employeeId: z.string().optional(),
  collegeId: z.string().optional(),
  sendInvite: z.boolean().default(true),
});

// Notification Dispatch Schema
export const NotificationDispatchSchema = z.object({
  title: z.string().min(2),
  message: z.string().min(5),
  category: z.enum(["drives", "hr", "offers", "exams", "system", "colleges"]).default("system"),
  targetRole: z.string().optional(),
  userId: z.string().optional(),
  actionUrl: z.string().optional(),
  channels: z.array(z.enum(["in_app", "email", "whatsapp"])).default(["in_app"]),
});
