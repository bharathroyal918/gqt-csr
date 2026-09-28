export type UserRole =
  | 'super_admin'
  | 'csr_manager'
  | 'hr'
  | 'hr_recruiter'
  | 'placement_officer'
  | 'pto'
  | 'faculty'
  | 'faculty_coordinator'
  | 'principal'
  | 'student'
  | 'management'
  | 'placement_coordinator'
  | 'admission_team'
  | 'admission'
  | 'operations'
  | 'support';

export * from './database';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  employeeId?: string;
  assignedColleges?: string[];
  assignedDrives?: string[];
  assignedDistricts?: string[];
  collegeId?: string;
  collegeName?: string;
  department?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface College {
  id: string;
  name: string;
  phone?: string;
  collegeCode?: string;
  vtuCode?: string;
  universityCode?: string;
  aisheCode?: string;
  type: 'Autonomous' | 'University Affiliated' | 'VTU Affiliated' | 'Deemed University' | 'Government Engineering College';
  district: string;
  state: string;
  address: string;
  website: string;
  establishedYear: number;
  naacGrade: 'A++' | 'A+' | 'A' | 'B++' | 'B+' | 'Pending';
  nbaStatus: 'Accredited' | 'Partially Accredited' | 'Applied' | 'Not Accredited';
  tier: 'Tier-1' | 'Tier-2' | 'Tier-3';
  studentStrength: number;
  eligibleStudentsCount: number;
  branchesAvailable: string[];
  trainingMode: 'Hybrid' | 'Offline Campus' | 'Virtual Live';
  status: 'Active' | 'Contacted' | 'MoU Signed' | 'In Discussion' | 'Onboarded' | 'Inactive';
  principal: {
    name: string;
    email: string;
    mobile: string;
  };
  placementOfficer: {
    name: string;
    designation: string;
    department: string;
    mobile: string;
    whatsapp: string;
    email: string;
  };
  placementCoordinator: {
    name: string;
    mobile: string;
    email: string;
  };
  facultyCoordinators: Array<{
    id: string;
    name: string;
    department: string;
    mobile: string;
    email: string;
  }>;
  mouDocumentUrl?: string;
  mouSignedDate?: string;
  approvalLetterUrl?: string;
  drivesParticipated: number;
  studentsPlaced: number;
  notes?: string;
  lastContactedAt?: string;
}

export type DriveStatus =
  | 'Draft'
  | 'Registration Open'
  | 'Exam Scheduled'
  | 'Exam In Progress'
  | 'Evaluation Completed'
  | 'HR Pipeline'
  | 'Offer Phase'
  | 'Completed'
  | 'Archived';

export interface CSRDrive {
  id: string;
  driveCode: string;
  academicYear: string;
  name: string;
  category: 'CSR Flagship' | 'Women in Tech' | 'Rural Engineering Uplift' | 'Tier-2/3 Excellence' | 'General';
  mode: 'Offline Campus' | 'Virtual Live' | 'Hybrid';
  status: DriveStatus;
  description: string;
  location: string;
  venue: string;
  district: string;
  state: string;
  courses: string[];
  batch: string;
  eligibleDepartments: string[];
  graduationTypes: ('BE' | 'B.Tech' | 'MCA' | 'M.Tech' | 'BCA' | 'B.Sc')[];
  semesterEligibility: number[];
  backlogAllowed: boolean;
  maxBacklogs: number;
  minPercentage: number;
  minCgpa: number;
  schedule: {
    regStart: string;
    regEnd: string;
    examDate: string;
    examTime: string;
    interviewDate: string;
    offerDate: string;
    joiningDate: string;
  };
  assignments: {
    hrLeadId: string;
    hrLeadName: string;
    panelMembers: string[];
    trainer: string;
    placementManager: string;
    questionBankId: string;
    offerLetterTemplateId: string;
  };
  automation: {
    registrationLink: string;
    qrCodeUrl: string;
    whatsappGroupEnabled: boolean;
    whatsappGroupName?: string;
    whatsappGroupLink?: string;
    reminderEnabled: boolean;
    autoInterviewScheduling: boolean;
    autoOfferLetter: boolean;
  };
  metrics: {
    collegesCount: number;
    registeredStudents: number;
    examAttended: number;
    qualifiedStudents: number;
    interviewSelected: number;
    offerLettersSent: number;
    acceptedOffers: number;
  };
}

export type StudentStatus =
  | 'Registered'
  | 'Hall Ticket Generated'
  | 'Exam Pending'
  | 'Exam Completed'
  | 'Qualified'
  | 'Disqualified'
  | 'HR Interview Scheduled'
  | 'Interview Attended'
  | 'HR Selected'
  | 'HR On Hold'
  | 'HR Rejected'
  | 'Not Attended'
  | 'Offer Sent'
  | 'Offer Accepted'
  | 'Offer Rejected';

export interface Student {
  id: string;
  studentId: string; // e.g. GQT-2025-0012
  fullName: string;
  photoUrl: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mobile: string;
  whatsappNumber: string;
  email: string;
  collegeId: string;
  collegeName: string;
  usn: string;
  university: string;
  graduateType: string;
  branch: string;
  semester: number;
  passingYear: number;
  cgpa: number;
  percentage: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  currentBacklogs?: number;
  aadhaarLast4: string;
  city: string;
  district: string;
  state?: string;
  pincode: string;
  preferredTrainingMode: 'Offline Campus' | 'Virtual Live' | 'Hybrid' | 'Offline' | 'Online';
  driveId: string;
  driveName: string;
  selectedCourse: string;
  batch: string;
  referralSource: string;
  termsAccepted: boolean;
  registeredAt: string;
  status: StudentStatus;
  examResult?: ExamResult;
  examScore?: number;
  interviewSlot?: any;
  interviewResult?: HRInterview;
  interviews?: HRInterview[];
  offerDetails?: OfferLetter;
  offer?: OfferLetter;
  offerAccepted?: boolean;
  qrRegistrationCardUrl?: string;
  programmingLanguages?: string[];
  certifications?: string[];
  projectTitle?: string;
  projectTech?: string;
  projectSummary?: string;
  projectUrl?: string;
  leetcodeUrl?: string;
  codeforcesUrl?: string;
}

export interface Question {
  id: string;
  category: 'Java' | 'Python' | 'SQL' | 'Testing' | 'Aptitude' | 'Logical' | 'Reasoning' | 'Programming' | 'AI & Agentic AI' | string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Code Snippet' | 'True/False';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation?: string;
  marks: number;
  negativeMarks: number;
}

export interface CheatingViolation {
  timestamp: string;
  type: 'fullscreen_exit' | 'tab_switch' | 'window_blur' | 'copy_attempt' | 'paste_attempt' | 'right_click' | 'devtools_opened' | 'multiple_face';
  message: string;
  strikeNumber: number;
}

export interface ExamResult {
  studentId: string;
  driveId: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unanswered: number;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  percentile: number;
  rank: number;
  qualified: boolean;
  passingScore: number;
  sectionAnalysis: {
    category: string;
    total: number;
    correct: number;
    score: number;
  }[];
  violations: CheatingViolation[];
  autoSubmitted: boolean;
  submittedAt: string;
}

export interface CutoffConfig {
  cutoffScore: number;
  isApproved: boolean;
  resultsReleased: boolean;
  approvedBy?: string;
  approvedAt?: string;
  minAptitudeScore?: number;
  minReasoningScore?: number;
  minProgrammingScore?: number;
}

export interface HRInterview {
  id: string;
  studentId: string;
  studentName: string;
  collegeName: string;
  branch: string;
  driveId: string;
  scheduledSlot: string; // ISO date-time
  meetingLink: string;
  interviewerName: string;
  interviewerRole: string;
  status: 'Scheduled' | 'In Progress' | 'Selected' | 'Hold' | 'Rejected' | 'Not Attended';
  ratings?: {
    technicalSkills: number; // 1-5
    problemSolving: number; // 1-5
    communication: number; // 1-5
    culturalFit: number; // 1-5
    overall: number; // 1-5
  };
  remarks?: string;
  recommendation?: string;
  conductedAt?: string;
}

export interface OfferLetter {
  id: string;
  offerNumber: string; // e.g. GQT/OFFER/2026/089
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  collegeName: string;
  driveName: string;
  roleTitle: string;
  course: string;
  branch?: string;
  batch: string;
  ctc: string; // e.g. "₹ 6.50 LPA"
  stipendDuringInternship: string; // e.g. "₹ 18,000 / month"
  location: string;
  reportingTime?: string;
  trainingCenter?: string;
  trainingMode?: 'Offline Campus' | 'Virtual Live' | 'Hybrid';
  trainingType?: 'CSR Sponsored' | 'Paid' | 'Hybrid';
  courseFee?: string;
  csrSponsorship?: string;
  bond?: string;
  hrExecutive?: string;
  joiningDate: string;
  offerIssuedDate: string;
  validUntil: string;
  status:
  | 'Draft'
  | 'Generated'
  | 'Sent'
  | 'Opened'
  | 'Downloaded'
  | 'Accepted'
  | 'Rejected'
  | 'Expired'
  | 'Cancelled'
  | 'Revoked'
  | 'Clarification Requested';
  qrVerificationCode: string;
  digitalSignatureUrl: string;
  authorizedSignatory?: string;
  authorizedDesignation?: string;
  companySealUrl?: string;
  watermarkEnabled?: boolean;
  remarks?: string;
  pdfUrl?: string;
  // Tracking
  deliveryChannel?: 'Student Portal' | 'Email' | 'WhatsApp' | 'Both';
  openedAt?: string;
  downloadedAt?: string;
  downloadsCount?: number;
  acceptedAt?: string;
  acceptedIp?: string;
  acceptedBrowser?: string;
  acceptedDevice?: string;
  rejectionReason?: string;
  rejectionRemarks?: string;
  rejectedAt?: string;
  clarificationQuery?: string;
}

export interface CRMInteraction {
  id: string;
  collegeId: string;
  collegeName: string;
  contactPerson: string;
  contactRole: string;
  contactPhone: string;
  type: 'Call' | 'WhatsApp' | 'Email' | 'Campus Visit' | 'Virtual Meeting';
  direction: 'Inbound' | 'Outbound';
  timestamp: string;
  durationMinutes?: number;
  outcome: 'Interested' | 'MoU Agreed' | 'Follow-up Needed' | 'Drive Scheduled' | 'Not Interested' | 'Call Later';
  summary: string;
  meetingMinutes?: string[];
  audioRecordingUrl?: string;
  attachments?: { name: string; url: string; size: string }[];
  nextAction: string;
  followUpDate?: string;
  reminderTime?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags: string[];
  loggedBy: string;
  isEscalated?: boolean;
}

export interface FollowUpReminder {
  id: string;
  collegeId: string;
  collegeName: string;
  contactPerson: string;
  contactPhone: string;
  interactionId?: string;
  scheduledFor: string;
  dueCategory: 'Today' | 'Tomorrow' | 'Upcoming' | 'Overdue' | 'Completed' | 'Cancelled';
  purpose: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes?: string;
  emailReminderSent: boolean;
  whatsappReminderSent: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'Drive Confirmation' | 'Student Registration' | 'Exam Reminder' | 'Interview Schedule' | 'Offer Release' | 'Attendance Notice';
  content: string;
  placeholders: string[];
}

export interface AuditLog {
  id: string;
  user: string;
  userRole: UserRole;
  action: string;
  entityType: 'CSR Drive' | 'College' | 'Student' | 'Exam' | 'HR Interview' | 'Offer Letter' | 'CRM' | 'User';
  entityId: string;
  timestamp: string;
  ipAddress: string;
  browser: string;
  oldValue?: string;
  newValue?: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  channel: 'In-App' | 'Email' | 'WhatsApp' | 'Push';
  targetRoles: UserRole[];
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'MOU' | 'Approval Letter' | 'Resume' | 'Offer Letter' | 'Report' | 'Call Recording' | 'Certificate';
  entityType: 'College' | 'Student' | 'Drive' | 'HR';
  entityId: string;
  entityName: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Drive' | 'Exam' | 'Interview' | 'Follow-up' | 'Holiday';
  date: string;
  startTime: string;
  endTime: string;
  collegeName?: string;
  venue?: string;
  status: 'Confirmed' | 'Tentative' | 'Cancelled';
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  relatedEntity?: {
    type: 'College' | 'Drive' | 'Student';
    name: string;
  };
}

export interface HelpdeskTicket {
  id: string;
  ticketNumber: string;
  raisedBy: string;
  role: UserRole;
  email: string;
  subject: string;
  category: 'Registration' | 'Exam Cheating Appeal' | 'Interview Reschedule' | 'Offer Query' | 'Portal Bug';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  messages: {
    sender: string;
    role: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  usn: string;
  collegeName: string;
  driveId: string;
  sessionTitle: string;
  joinTime: string;
  leaveTime?: string;
  durationMinutes: number;
  rejoinCount: number;
  device: string;
  ipAddress: string;
  status: 'Present' | 'Late' | 'Absent' | 'Partial';
}

export interface OfferTemplate {
  id: string;
  title: string;
  courseTrack: string;
  description: string;
  version: number;
  isActive: boolean;
  content: string; // Markdown/HTML template with placeholders {{student_name}}, {{college}}, etc.
  placeholders: string[];
  lastModifiedBy: string;
  updatedAt: string;
}

export interface BatchRecord {
  id: string;
  batchCode: string;
  name: string;
  course: string;
  trainer: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  mode: 'Offline Campus' | 'Virtual Live' | 'Hybrid';
  location: string;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Full';
  studentIds: string[];
}

export interface JoiningConfirmationRecord {
  id: string;
  studentId: string;
  studentName: string;
  usn: string;
  collegeName: string;
  offerNumber: string;
  batchCode: string;
  reportingDate: string;
  reportingTime: string;
  mode: 'Offline Campus' | 'Virtual Live' | 'Hybrid';
  location: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  confirmedAt: string;
  acknowledgedTerms: boolean;
  status: 'Confirmed' | 'Joined' | 'Deferred' | 'No-Show';
}

export interface AdmissionVerificationRecord {
  id: string;
  studentId: string;
  studentName: string;
  usn: string;
  collegeName: string;
  offerNumber: string;
  documents: {
    type: 'Resume' | 'Photo' | 'College ID' | 'Aadhaar' | 'Marks Cards' | 'Bonafide Certificate';
    url: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    verifiedAt?: string;
    verifiedBy?: string;
    remarks?: string;
  }[];
  overallStatus: 'Approved' | 'Pending Review' | 'Discrepancy';
  assignedBatch?: string;
  joinedAt?: string;
  admissionRemarks?: string;
}

export interface WhatsAppMessageRecord {
  id: string;
  recipientPhone: string;
  recipientName: string;
  role: string;
  templateId?: string;
  templateName: string;
  content: string;
  mediaUrl?: string;
  status: 'Queued' | 'Sent' | 'Delivered' | 'Read' | 'Failed';
  retryCount: number;
  errorLog?: string;
  timestamp: string;
  deliveredAt?: string;
  readAt?: string;
  driveId?: string;
  driveName?: string;
  collegeId?: string;
  collegeName?: string;
}

export interface WhatsAppGroupRecord {
  id: string;
  groupName: string; // e.g. "RV College + GQT + 2026-27"
  groupId: string;
  inviteLink: string;
  createdDate: string;
  driveId: string;
  driveName: string;
  collegeId: string;
  collegeName: string;
  hrId: string;
  hrName: string;
  ptoId: string;
  ptoName: string;
  facultyNames: string[];
  status: 'Active' | 'Archived';
  membersCount: number;
}

export interface EmailMessageRecord {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateId?: string;
  templateName: string;
  contentHtml: string;
  status: 'Sent' | 'Delivered' | 'Opened' | 'Clicked' | 'Failed' | 'Bounced';
  timestamp: string;
  openedAt?: string;
  clickedAt?: string;
  retryCount: number;
  errorLog?: string;
  driveId?: string;
  driveName?: string;
  collegeId?: string;
  collegeName?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'Registration' | 'Exam' | 'Interview' | 'Offer Letter' | 'Joining Reminder' | 'Announcement' | 'Password Reset';
  htmlContent: string;
  placeholders: string[];
  lastModifiedBy: string;
  updatedAt: string;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  description: string;
  contentHtml?: string;
  targetAudience: ('All Students' | 'Specific Colleges' | 'Specific Branches' | 'Specific Courses' | 'Specific Drive' | 'HR' | 'Faculty' | 'Placement Officers' | 'Admission Team')[];
  collegeIds?: string[];
  branchNames?: string[];
  driveId?: string;
  driveName?: string;
  channels: ('Dashboard' | 'Email' | 'WhatsApp')[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  attachments?: { name: string; url: string; size: string }[];
  authorName: string;
  authorRole: string;
  viewsCount: number;
}

export interface CallLogRecord {
  id: string;
  collegeId: string;
  collegeName: string;
  contactPerson: string;
  contactPhone: string;
  contactRole: string;
  callDate: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  callType: 'Incoming' | 'Outgoing';
  callStatus: 'Connected' | 'Missed' | 'Busy';
  discussionSummary: string;
  outcome: 'Interested' | 'MoU Agreed' | 'Follow-up Needed' | 'Drive Scheduled' | 'Not Interested' | 'Call Later';
  nextFollowUpDate?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  recordingUrl?: string;
  notes?: string;
  loggedBy: string;
}

export interface MeetingRecord {
  id: string;
  title: string;
  driveId?: string;
  driveName?: string;
  collegeId: string;
  collegeName: string;
  attendees: { name: string; role: string; email: string; phone?: string; attended?: boolean }[];
  date: string;
  time: string;
  durationMinutes: number;
  mode: 'Online' | 'Offline' | 'Hybrid';
  meetingLink?: string;
  venue?: string;
  agenda: string;
  minutesOfMeeting?: string[];
  attachments?: { name: string; url: string; size: string }[];
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
}

export interface CommunicationTimelineItem {
  id: string;
  collegeId: string;
  collegeName: string;
  driveId?: string;
  driveName?: string;
  type: 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Reminder' | 'Status Change' | 'Announcement' | 'Attachment';
  title: string;
  summary: string;
  timestamp: string;
  performedBy: string;
  statusBadge?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// MANAGEMENT PORTAL & EXECUTIVE BI TYPES (PROMPT 10)
// ==========================================

export interface DistrictStatistics {
  id: string;
  district: string;
  zone: 'South' | 'North' | 'Central' | 'Coastal' | 'Bengaluru Metro';
  collegesCount: number;
  drivesCount: number;
  studentsRegistered: number;
  studentsExamAppeared: number;
  studentsQualified: number;
  studentsSelected: number;
  offersAccepted: number;
  joiningConfirmed: number;
  selectionRate: number;
  offerAcceptanceRate: number;
  activeHRExecutives: number;
  topColleges: string[];
  growthYoY: number;
  monthlyTrends: { month: string; registered: number; selected: number }[];
  branchBreakdown: { branch: string; count: number }[];
}

export interface CollegePerformanceStats {
  id: string;
  collegeId: string;
  collegeName: string;
  district: string;
  tier: 'Tier-1' | 'Tier-2' | 'Tier-3';
  type: 'Autonomous' | 'University Affiliated' | 'VTU Affiliated' | 'Deemed University' | 'Government Engineering College';
  studentsRegistered: number;
  examCompletionRate: number;
  selectionRate: number;
  offerAcceptanceRate: number;
  joiningRate: number;
  drivesCount: number;
  rank: number;
  previousYearSelected: number;
  currentYearSelected: number;
  growthPct: number;
}

export interface HRPerformanceStats {
  id: string;
  hrId: string;
  hrName: string;
  email: string;
  avatar: string;
  assignedColleges: number;
  callsCompleted: number;
  followUpsCompleted: number;
  studentsReviewed: number;
  interviewsConducted: number;
  selectedCount: number;
  selectionRate: number;
  offerAcceptanceRate: number;
  avgResponseTimeHours: number;
  escalations: number;
  avgInterviewRating: number;
  weeklyProductivity: { week: string; calls: number; interviews: number; selections: number }[];
}

export interface PipelineFunnelStage {
  id: string;
  stageName: string;
  count: number;
  dropOffCount: number;
  conversionRate: number;
  benchmarkRate: number;
  color: string;
}

export interface CourseAnalyticsData {
  id: string;
  courseName: string;
  shortCode: string;
  registrations: number;
  qualified: number;
  selections: number;
  accepted: number;
  batchCapacity: number;
  batchFilled: number;
  completionForecastDays: number;
  color: string;
}

export interface BranchAnalyticsData {
  branch: string;
  code: string;
  registrations: number;
  selections: number;
  acceptanceRate: number;
  topDistricts: string[];
}

export interface TrainingBatchMetric {
  id: string;
  batchName: string;
  course: string;
  capacity: number;
  filled: number;
  available: number;
  joiningRate: number;
  trainer: string;
  location: string;
  mode: 'Offline' | 'Online' | 'Hybrid';
  progressPct: number;
  startDate: string;
  status: 'In Progress' | 'Scheduled' | 'Full' | 'Enrolling';
}

export interface ExecutiveSavedReport {
  id: string;
  title: string;
  category: 'HR' | 'College' | 'District' | 'Drive' | 'Offer' | 'Exam' | 'Communication' | 'Executive';
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Ad-hoc';
  generatedDate: string;
  nextScheduled?: string;
  format: 'PDF' | 'Excel' | 'CSV';
  fileSize: string;
  recipients: string[];
  version: string;
  downloadUrl?: string;
  isBoardConfidential?: boolean;
}

export interface ManagementAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  module: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  browser: string;
  device: string;
  location: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ManagementActivityFeedItem {
  id: string;
  timestamp: string;
  eventType: 'Student Registered' | 'Exam Submitted' | 'Interview Completed' | 'Selected' | 'Offer Accepted' | 'College Added' | 'Drive Published' | 'HR Assigned' | 'Admin Changes' | 'Escalation Missed';
  title: string;
  description: string;
  entityType: 'Student' | 'Drive' | 'College' | 'Interview' | 'Offer' | 'System';
  entityId: string;
  actor: string;
  actorRole: string;
  statusBadge?: string;
}

export interface ExecutiveInsightsItem {
  id: string;
  type: 'positive' | 'warning' | 'alert' | 'metric';
  title: string;
  description: string;
  metric?: string;
  tag: string;
  timestamp: string;
}

// ==========================================
// SUPER ADMIN CONTROL CENTER TYPES (PROMPT 11)
// ==========================================

export interface PlatformBrandingSettings {
  platformName: string;
  organizationName: string;
  tagline: string;
  lightLogoUrl: string;
  darkLogoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  footerText: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
  };
}

export interface AcademicYearRecord {
  id: string;
  year: string; // e.g. "2026-27"
  startDate: string;
  endDate: string;
  status: 'Current' | 'Upcoming' | 'Archived';
  drivesCount: number;
  collegesCount: number;
  studentsCount: number;
  isLocked: boolean;
}

export interface SecurityActiveSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  device: 'Laptop' | 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  loginTime: string;
  lastActive: string;
  isCurrentSession: boolean;
  isTrusted: boolean;
}

export interface SecurityLoginEvent {
  id: string;
  userId?: string;
  email: string;
  status: 'Success' | 'Failed' | 'Blocked' | 'Password Reset' | '2FA Challenged';
  ipAddress: string;
  browser: string;
  device: string;
  location: string;
  timestamp: string;
  failureReason?: string;
}

export interface StorageBucketStat {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  filesCount: number;
  totalSizeBytes: number;
  formattedSize: string;
  lastUpload: string;
  allowedMimeTypes: string[];
}

export interface StorageFileItem {
  id: string;
  bucket: string;
  name: string;
  size: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface SystemBackupRecord {
  id: string;
  name: string;
  backupType: 'Full Platform' | 'Database Schema & Data' | 'Storage Metadata' | 'Settings & Templates' | 'Question Bank';
  createdAt: string;
  size: string;
  status: 'Completed' | 'In Progress' | 'Failed' | 'Verified';
  createdBy: string;
  checksum: string;
  includedModules: string[];
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  description: string;
  category: 'Core Modules' | 'Integrations' | 'Security & Access' | 'UI & Experience';
  isEnabled: boolean;
  scheduledActivation?: string;
  affectsPortals: string[];
  updatedAt: string;
  updatedBy: string;
}

export interface SystemHealthMetric {
  service: string;
  status: 'Healthy' | 'Degraded' | 'Critical';
  latencyMs: number;
  uptimePct: number;
  lastChecked: string;
  details: string;
}

export interface IntegrationConfig {
  id: string;
  serviceKey: 'supabase' | 'whatsapp' | 'smtp' | 'razorpay' | 'google_oauth' | 'microsoft_oauth' | 'zoom';
  name: string;
  description: string;
  status: 'Connected' | 'Configured' | 'Disconnected' | 'Testing';
  apiUrl?: string;
  apiKeyMasked?: string;
  senderId?: string;
  webhookUrl?: string;
  lastTested?: string;
}

export interface AdminErrorLog {
  id: string;
  timestamp: string;
  level: 'Error' | 'Critical' | 'Warning';
  source: 'Next.js Server' | 'Supabase DB' | 'Realtime WebSocket' | 'WhatsApp Webhook' | 'Email Engine';
  message: string;
  stackTrace?: string;
  status: 'Pending' | 'Resolved' | 'Ignored';
  resolvedBy?: string;
  resolvedAt?: string;
}


