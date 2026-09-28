import { UserRole, DriveStatus } from "@/types";

export interface WorkflowPhaseDefinition {
  order: number;
  code: string;
  name: string;
  shortName: string;
  description: string;
  responsibleRole: UserRole;
  requiredAction: string;
  autoTriggerNext: boolean;
  correspondingDriveStatus: DriveStatus;
}

export const CSR_15_PHASES: WorkflowPhaseDefinition[] = [
  {
    order: 1,
    code: "PHASE_1_DRIVE_CREATION",
    name: "Drive Creation & Criteria Setup",
    shortName: "Drive Setup",
    description: "Define academic year, eligibility thresholds, backlog limits, and syllabus.",
    responsibleRole: "csr_manager",
    requiredAction: "Publish CSR Drive Configuration",
    autoTriggerNext: true,
    correspondingDriveStatus: "Draft",
  },
  {
    order: 2,
    code: "PHASE_2_COLLEGE_APPROVAL",
    name: "College Outreach & MoU Approval",
    shortName: "College MoU",
    description: "Institutional consent, Principal sign-off, and active MoU validation.",
    responsibleRole: "principal",
    requiredAction: "Verify Institutional Approval Letter",
    autoTriggerNext: true,
    correspondingDriveStatus: "Draft",
  },
  {
    order: 3,
    code: "PHASE_3_OUTREACH_CAMPAIGN",
    name: "Student Outreach & WhatsApp Circular",
    shortName: "WhatsApp Outreach",
    description: "Broadcast registration links, circular banners, and batch WhatsApp groups.",
    responsibleRole: "csr_manager",
    requiredAction: "Broadcast WhatsApp Template",
    autoTriggerNext: true,
    correspondingDriveStatus: "Registration Open",
  },
  {
    order: 4,
    code: "PHASE_4_STUDENT_REGISTRATION",
    name: "Student Registration & USN Verification",
    shortName: "Registration",
    description: "Candidates submit profiles, resumes, marks, and branch details.",
    responsibleRole: "student",
    requiredAction: "Validate Candidate Registrations",
    autoTriggerNext: true,
    correspondingDriveStatus: "Registration Open",
  },
  {
    order: 5,
    code: "PHASE_5_HALL_TICKET_GENERATION",
    name: "Hall Ticket & QR Admit Card Issuance",
    shortName: "Hall Tickets",
    description: "Generate cryptographically verifiable QR admission passes.",
    responsibleRole: "csr_manager",
    requiredAction: "Issue Digital Admit Cards",
    autoTriggerNext: true,
    correspondingDriveStatus: "Exam Scheduled",
  },
  {
    order: 6,
    code: "PHASE_6_CAMPUS_ATTENDANCE",
    name: "Live Attendance & QR Check-in",
    shortName: "Campus Check-in",
    description: "Faculty scan candidate QR hall tickets at college computer labs.",
    responsibleRole: "faculty_coordinator",
    requiredAction: "Mark Lab Check-in",
    autoTriggerNext: true,
    correspondingDriveStatus: "Exam In Progress",
  },
  {
    order: 7,
    code: "PHASE_7_PROCTORED_EXAM",
    name: "Proctored Online Examination",
    shortName: "Online Exam",
    description: "Timed assessment with webcam anti-malpractice and tab-switch detection.",
    responsibleRole: "student",
    requiredAction: "Submit Assessment",
    autoTriggerNext: true,
    correspondingDriveStatus: "Exam In Progress",
  },
  {
    order: 8,
    code: "PHASE_8_AUTOMATED_EVALUATION",
    name: "Automated Evaluation & Anti-Cheat Audit",
    shortName: "Grading Engine",
    description: "Instant grading, strike penalty subtraction, and percentile indexing.",
    responsibleRole: "super_admin",
    requiredAction: "Execute Evaluation Engine",
    autoTriggerNext: true,
    correspondingDriveStatus: "Evaluation Completed",
  },
  {
    order: 9,
    code: "PHASE_9_MERIT_CUTOFF_LIST",
    name: "Merit List & Cutoff Shortlisting",
    shortName: "Merit Cutoffs",
    description: "Apply section-wise cutoffs and generate interview candidate shortlist.",
    responsibleRole: "csr_manager",
    requiredAction: "Approve Interview Shortlist",
    autoTriggerNext: true,
    correspondingDriveStatus: "Evaluation Completed",
  },
  {
    order: 10,
    code: "PHASE_10_HR_SLOT_SCHEDULING",
    name: "HR Interview Scheduling & Slot Booking",
    shortName: "HR Scheduling",
    description: "Allocate HR panel slots, meeting links, and candidate WhatsApp SMS notifications.",
    responsibleRole: "hr_recruiter",
    requiredAction: "Schedule HR Panels",
    autoTriggerNext: true,
    correspondingDriveStatus: "HR Pipeline",
  },
  {
    order: 11,
    code: "PHASE_11_PANEL_INTERVIEW",
    name: "Panel Interview & Rubric Evaluation",
    shortName: "HR Interviews",
    description: "5-star rubric scoring across technical, problem solving, and cultural fit.",
    responsibleRole: "hr_recruiter",
    requiredAction: "Submit Final HR Decision",
    autoTriggerNext: true,
    correspondingDriveStatus: "HR Pipeline",
  },
  {
    order: 12,
    code: "PHASE_12_OFFER_GENERATION",
    name: "Conditional Offer Letter Auto-Generation",
    shortName: "Offer Letters",
    description: "Generate official PDF offers with QR verification and digital signature.",
    responsibleRole: "csr_manager",
    requiredAction: "Release Offer Letters",
    autoTriggerNext: true,
    correspondingDriveStatus: "Offer Phase",
  },
  {
    order: 13,
    code: "PHASE_13_OFFER_ACCEPTANCE",
    name: "Student Digital Acceptance & Verification",
    shortName: "Offer Acceptance",
    description: "Candidates accept or decline offer with digital signature and IP timestamp.",
    responsibleRole: "student",
    requiredAction: "Candidate Acceptance",
    autoTriggerNext: true,
    correspondingDriveStatus: "Offer Phase",
  },
  {
    order: 14,
    code: "PHASE_14_BATCH_ALLOCATION",
    name: "Internship Batch & Mentor Allocation",
    shortName: "Batching",
    description: "Assign accepted students to training batches, trainers, and LMS modules.",
    responsibleRole: "csr_manager",
    requiredAction: "Allocate Training Cohorts",
    autoTriggerNext: true,
    correspondingDriveStatus: "Completed",
  },
  {
    order: 15,
    code: "PHASE_15_DRIVE_AUDIT_COMPLETION",
    name: "Post-Drive Audit, Leaderboard & Archival",
    shortName: "Drive Completion",
    description: "Compile final placement conversion analytics, update college rankings, and archive.",
    responsibleRole: "management",
    requiredAction: "Final Audit Sign-Off",
    autoTriggerNext: false,
    correspondingDriveStatus: "Completed",
  },
];

/**
 * Get definition of a phase by order (1-15)
 */
export function getPhaseByOrder(order: number): WorkflowPhaseDefinition | undefined {
  return CSR_15_PHASES.find((p) => p.order === order);
}

/**
 * Returns next phase in the 15-phase sequence
 */
export function getNextPhase(currentOrder: number): WorkflowPhaseDefinition | undefined {
  return CSR_15_PHASES.find((p) => p.order === currentOrder + 1);
}
