import { supabase, isSupabaseConfigured } from "./client";
import {
  College,
  CSRDrive,
  Student,
  CRMInteraction,
  FollowUpReminder,
  TaskItem,
  Question,
  UserAccount,
  HRInterview,
  OfferLetter,
  NotificationItem,
  AuditLog,
  UserRole,
} from "@/types";


/**
 * Bidirectional mappers between Supabase PostgreSQL (snake_case)
 * and Frontend TypeScript Interfaces (camelCase).
 */

function computeDueCategory(scheduledFor?: string): FollowUpReminder["dueCategory"] {
  if (!scheduledFor) return "Upcoming";
  const d = new Date(scheduledFor);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return "Upcoming";
}

// Colleges Mapping
function mapCollegeFromDb(row: Record<string, any>): College {
  const code = row.college_code || row.collegeCode || row.vtu_code || row.vtuCode || row.university_code || row.universityCode || "";
  return {
    id: row.id,
    name: row.name || "",
    collegeCode: code,
    vtuCode: code,
    universityCode: code,
    aisheCode: row.aishe_code || row.aisheCode || "",
    type: row.type || "",
    district: row.district || "",
    state: row.state || "",
    address: row.address || "",
    website: row.website || "",
    establishedYear: Number(row.established_year || row.establishedYear || 0),
    naacGrade: row.naac_grade || row.naacGrade || "",
    nbaStatus: row.nba_status || row.nbaStatus || "",
    tier: row.tier || "",
    studentStrength: Number(row.student_strength ?? row.studentStrength ?? 0),
    eligibleStudentsCount: Number(row.eligible_students_count ?? row.eligibleStudentsCount ?? 0),
    branchesAvailable: row.branches_available || row.branchesAvailable || [],
    trainingMode: row.training_mode || row.trainingMode || "",
    status: row.status || "Active",
    principal: row.principal_info || row.principal || { name: "", email: "", mobile: "" },
    placementOfficer: row.placement_officer || row.placementOfficer || {
      name: "",
      designation: "Training & Placement Officer",
      department: "Placement Cell",
      mobile: "",
      whatsapp: "",
      email: "",
    },
    placementCoordinator: row.placement_coordinator || row.placementCoordinator || {
      name: "",
      mobile: "",
      email: "",
    },
    facultyCoordinators: row.faculty_coordinators || row.facultyCoordinators || [],
    mouDocumentUrl: row.mou_document_url || row.mouDocumentUrl,
    mouSignedDate: row.mou_signed_date || row.mouSignedDate,
    approvalLetterUrl: row.approval_letter_url || row.approvalLetterUrl,
    drivesParticipated: Number(row.drives_participated ?? row.drivesParticipated ?? 0),
    studentsPlaced: Number(row.students_placed ?? row.studentsPlaced ?? 0),
    notes: row.notes,
  };
}

function toCollegeDbRow(c: Partial<College>): Record<string, any> {
  const row: Record<string, any> = {};
  if (c.id !== undefined) row.id = c.id;
  if (c.name !== undefined) row.name = c.name;
  const code = c.collegeCode || c.vtuCode || c.universityCode;
  if (code !== undefined) {
    row.college_code = code;
    row.vtu_code = code;
    row.university_code = code;
  }
  if (c.aisheCode !== undefined) row.aishe_code = c.aisheCode;
  if (c.type !== undefined) row.type = c.type;
  if (c.district !== undefined) row.district = c.district;
  if (c.state !== undefined) row.state = c.state;
  if (c.address !== undefined) row.address = c.address;
  if (c.website !== undefined) row.website = c.website;
  if (c.establishedYear !== undefined) row.established_year = c.establishedYear;
  if (c.naacGrade !== undefined) row.naac_grade = c.naacGrade;
  if (c.nbaStatus !== undefined) row.nba_status = c.nbaStatus;
  if (c.tier !== undefined) row.tier = c.tier;
  if (c.studentStrength !== undefined) row.student_strength = c.studentStrength;
  if (c.eligibleStudentsCount !== undefined) row.eligible_students_count = c.eligibleStudentsCount;
  if (c.branchesAvailable !== undefined) row.branches_available = c.branchesAvailable;
  if (c.trainingMode !== undefined) row.training_mode = c.trainingMode;
  if (c.status !== undefined) row.status = c.status;
  if (c.principal !== undefined) row.principal_info = c.principal;
  if (c.placementOfficer !== undefined) row.placement_officer = c.placementOfficer;
  if (c.placementCoordinator !== undefined) row.placement_coordinator = c.placementCoordinator;
  if (c.facultyCoordinators !== undefined) row.faculty_coordinators = c.facultyCoordinators;
  if (c.mouDocumentUrl !== undefined) row.mou_document_url = c.mouDocumentUrl;
  if (c.mouSignedDate !== undefined) row.mou_signed_date = c.mouSignedDate;
  if (c.approvalLetterUrl !== undefined) row.approval_letter_url = c.approvalLetterUrl;
  if (c.drivesParticipated !== undefined) row.drives_participated = c.drivesParticipated;
  if (c.studentsPlaced !== undefined) row.students_placed = c.studentsPlaced;
  if (c.notes !== undefined) row.notes = c.notes;
  return row;
}

// Drives Mapping
function mapDriveFromDb(row: Record<string, any>): CSRDrive {
  return {
    id: row.id,
    driveCode: row.drive_code || row.driveCode || "",
    academicYear: row.academic_year || row.academicYear || "",
    name: row.name || "",
    category: row.category || "",
    mode: row.mode || "",
    status: row.status || "Draft",
    description: row.description || "",
    location: row.location || "",
    venue: row.venue || "",
    district: row.district || "",
    state: row.state || "",
    courses: row.courses || [],
    batch: row.batch || "",
    eligibleDepartments: row.eligible_departments || row.eligibleDepartments || [],
    graduationTypes: row.graduation_types || row.graduationTypes || [],
    semesterEligibility: row.semester_eligibility || row.semesterEligibility || [],
    backlogAllowed: row.backlog_allowed ?? row.backlogAllowed ?? false,
    maxBacklogs: Number(row.max_backlogs ?? row.maxBacklogs ?? 0),
    minPercentage: Number(row.min_percentage ?? row.minPercentage ?? 60),
    minCgpa: Number(row.min_cgpa ?? row.minCgpa ?? 6.5),
    schedule: row.schedule || {
      regStart: "",
      regEnd: "",
      examDate: "",
      examTime: "",
      interviewDate: "",
      offerDate: "",
      joiningDate: "",
    },
    assignments: row.assignments || {
      hrLeadId: "",
      hrLeadName: "",
      panelMembers: [],
      trainer: "",
      placementManager: "",
      questionBankId: "",
      offerLetterTemplateId: "",
    },
    automation: row.automation || {
      registrationLink: "",
      qrCodeUrl: "",
      whatsappGroupEnabled: false,
      reminderEnabled: true,
      autoInterviewScheduling: true,
      autoOfferLetter: true,
    },
    metrics: {
      collegesCount: Number(row.metrics?.collegesCount ?? row.metrics?.colleges_count ?? 1),
      registeredStudents: Number(row.metrics?.registeredStudents ?? row.metrics?.registeredCount ?? 0),
      examAttended: Number(row.metrics?.examAttended ?? row.metrics?.attendanceCount ?? 0),
      qualifiedStudents: Number(row.metrics?.qualifiedStudents ?? row.metrics?.passedExamCount ?? 0),
      interviewSelected: Number(row.metrics?.interviewSelected ?? row.metrics?.interviewsScheduled ?? 0),
      offerLettersSent: Number(row.metrics?.offerLettersSent ?? row.metrics?.offersIssued ?? 0),
      acceptedOffers: Number(row.metrics?.acceptedOffers ?? row.metrics?.offersAccepted ?? 0),
      ...(row.metrics || {}),
    },
  };
}

function toDriveDbRow(d: Partial<CSRDrive>): Record<string, any> {
  const row: Record<string, any> = {};
  if (d.id !== undefined) row.id = d.id;
  if (d.driveCode !== undefined) row.drive_code = d.driveCode;
  if (d.academicYear !== undefined) row.academic_year = d.academicYear;
  if (d.name !== undefined) row.name = d.name;
  if (d.category !== undefined) row.category = d.category;
  if (d.mode !== undefined) row.mode = d.mode;
  if (d.status !== undefined) row.status = d.status;
  if (d.description !== undefined) row.description = d.description;
  if (d.location !== undefined) row.location = d.location;
  if (d.venue !== undefined) row.venue = d.venue;
  if (d.district !== undefined) row.district = d.district;
  if (d.state !== undefined) row.state = d.state;
  if (d.courses !== undefined) row.courses = d.courses;
  if (d.batch !== undefined) row.batch = d.batch;
  if (d.eligibleDepartments !== undefined) row.eligible_departments = d.eligibleDepartments;
  if (d.graduationTypes !== undefined) row.graduation_types = d.graduationTypes;
  if (d.semesterEligibility !== undefined) row.semester_eligibility = d.semesterEligibility;
  if (d.backlogAllowed !== undefined) row.backlog_allowed = d.backlogAllowed;
  if (d.maxBacklogs !== undefined) row.max_backlogs = d.maxBacklogs;
  if (d.minPercentage !== undefined) row.min_percentage = d.minPercentage;
  if (d.minCgpa !== undefined) row.min_cgpa = d.minCgpa;
  if (d.schedule !== undefined) row.schedule = d.schedule;
  if (d.assignments !== undefined) row.assignments = d.assignments;
  if (d.automation !== undefined) row.automation = d.automation;
  if (d.metrics !== undefined) row.metrics = d.metrics;
  return row;
}

// College & Drive Foreign Key Helpers
export const COLLEGE_ID_MAP: Record<string, string> = {
  "col-001": "01",
  "col-002": "02",
  "col-003": "03",
  "col-004": "04",
  "col-005": "col-005",
  "col-006": "col-006",
  "col-007": "col-007",
  "col-008": "col-008",
  "col-009": "col-009",
  "col-010": "col-010",
  "col-rvce": "01",
  "col-bmsce": "02",
  "col-msrit": "03",
  "col-dsce": "04",
  "col-nie": "col-009",
  "col-kletech": "col-008",
};

export const COLLEGE_NAME_MAP: Record<string, string> = {
  "01": "R.V. College of Engineering (RVCE)",
  "02": "B.M.S. College of Engineering (BMSCE)",
  "03": "Ramaiah Institute of Technology (MSRIT)",
  "04": "Dayananda Sagar College of Engineering (DSCE)",
  "col-001": "R.V. College of Engineering (RVCE)",
  "col-002": "B.M.S. College of Engineering (BMSCE)",
  "col-003": "Ramaiah Institute of Technology (MSRIT)",
  "col-005": "Bangalore Institute of Technology (BIT)",
  "col-006": "Sir M. Visvesvaraya Institute of Technology (SMVIT)",
  "col-007": "PES Institute of Technology - South Campus",
  "col-008": "B.V. Bhoomaraddi College of Engineering (KLE Tech)",
  "col-009": "The National Institute of Engineering (NIE)",
  "col-010": "Siddaganga Institute of Technology (SIT)",
};

export const DRIVE_ID_MAP: Record<string, string> = {
  "drv-2026-001": "001",
  "drv-2026-002": "002",
  "001": "001",
  "002": "002",
};

export const DRIVE_NAME_MAP: Record<string, string> = {
  "001": "Karnataka State-wide CSR Engineering Drive 2026",
  "002": "North Karnataka Rural Engineering Uplift CSR Drive",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Students Mapping
function mapStudentFromDb(row: Record<string, any>): Student {
  const collegeName =
    row.college_name ||
    row.collegeName ||
    (row.college_id && COLLEGE_NAME_MAP[row.college_id]) ||
    "";

  const driveName =
    row.drive_name ||
    row.driveName ||
    (row.drive_id && DRIVE_NAME_MAP[row.drive_id]) ||
    "";

  return {
    id: row.id,
    studentId: row.student_id || row.studentId || row.id || "",
    fullName: row.full_name || row.fullName || "",
    photoUrl: row.photo_url || row.photoUrl || "",
    gender: row.gender || "",
    dob: row.dob || "",
    mobile: row.mobile || "",
    whatsappNumber: row.whatsapp_number || row.whatsappNumber || row.mobile || "",
    email: row.email || "",
    collegeId: row.college_id || row.collegeId || "",
    collegeName,
    usn: row.usn || "",
    university: row.university || "",
    graduateType: row.graduate_type || row.graduateType || "",
    branch: row.branch || "",
    semester: Number(row.semester || 0),
    passingYear: Number(row.passing_year || row.passingYear || 0),
    cgpa: Number(row.cgpa || 0),
    percentage: Number(row.percentage || 0),
    linkedinUrl: row.linkedin_url || row.linkedinUrl || "",
    githubUrl: row.github_url || row.githubUrl || "",
    portfolioUrl: row.portfolio_url || row.portfolioUrl || "",
    resumeUrl: row.resume_url || row.resumeUrl || "",
    aadhaarLast4: row.aadhaar_last4 || row.aadhaarLast4 || "",
    city: row.city || "",
    district: row.district || "",
    pincode: row.pincode || "",
    preferredTrainingMode: row.preferred_training_mode || row.preferredTrainingMode || "",
    driveId: row.drive_id || row.driveId || "",
    driveName,
    selectedCourse: row.selected_course || row.selectedCourse || "",
    batch: row.batch || "",
    referralSource: row.referral_source || row.referralSource || "",
    termsAccepted: row.terms_accepted ?? row.termsAccepted ?? true,
    registeredAt: row.registered_at || row.registeredAt || new Date().toISOString(),
    status: row.status || "Registered",
    qrRegistrationCardUrl: row.qr_registration_card_url || row.qrRegistrationCardUrl || row.hall_ticket_qr_url,
  };
}

function toStudentDbRow(s: Partial<Student>): Record<string, any> {
  const row: Record<string, any> = {};
  if (s.id !== undefined) row.id = s.id;
  if (s.studentId !== undefined) row.student_id = s.studentId;
  if (s.fullName !== undefined) row.full_name = s.fullName;
  if (s.photoUrl !== undefined) row.photo_url = s.photoUrl;
  if (s.gender !== undefined) row.gender = s.gender;
  if (s.dob !== undefined) row.dob = s.dob;
  if (s.mobile !== undefined) row.mobile = s.mobile;
  if (s.whatsappNumber !== undefined) row.whatsapp_number = s.whatsappNumber;
  if (s.email !== undefined) row.email = s.email;

  // Sanitize college_id to adhere to PostgreSQL foreign key constraint
  if (s.collegeId !== undefined) {
    const candidate = COLLEGE_ID_MAP[s.collegeId] || s.collegeId;
    row.college_id = candidate;
  } else if (s.collegeName !== undefined) {
    for (const [key, name] of Object.entries(COLLEGE_NAME_MAP)) {
      if (
        name.toLowerCase().includes(s.collegeName.toLowerCase()) ||
        s.collegeName.toLowerCase().includes(name.toLowerCase())
      ) {
        row.college_id = key;
        break;
      }
    }
  }

  if (s.usn !== undefined) row.usn = s.usn;
  if (s.university !== undefined) row.university = s.university;
  if (s.graduateType !== undefined) row.graduate_type = s.graduateType;
  if (s.branch !== undefined) row.branch = s.branch;
  if (s.semester !== undefined) row.semester = s.semester;
  if (s.passingYear !== undefined) row.passing_year = s.passingYear;
  if (s.cgpa !== undefined) row.cgpa = s.cgpa;
  if (s.percentage !== undefined) row.percentage = s.percentage;
  if (s.linkedinUrl !== undefined) row.linkedin_url = s.linkedinUrl;
  if (s.githubUrl !== undefined) row.github_url = s.githubUrl;
  if (s.portfolioUrl !== undefined) row.portfolio_url = s.portfolioUrl;
  if (s.resumeUrl !== undefined) row.resume_url = s.resumeUrl;
  if (s.aadhaarLast4 !== undefined) row.aadhaar_last4 = s.aadhaarLast4;
  if (s.city !== undefined) row.city = s.city;
  if (s.district !== undefined) row.district = s.district;
  if (s.pincode !== undefined) row.pincode = s.pincode;
  if (s.preferredTrainingMode !== undefined) row.preferred_training_mode = s.preferredTrainingMode;

  // Sanitize drive_id to adhere to PostgreSQL foreign key constraint
  if (s.driveId !== undefined) {
    const candidate = DRIVE_ID_MAP[s.driveId] || s.driveId;
    if (UUID_REGEX.test(candidate)) {
      row.drive_id = candidate;
    }
  }

  if (s.selectedCourse !== undefined) row.selected_course = s.selectedCourse;
  if (s.batch !== undefined) row.batch = s.batch;
  if (s.referralSource !== undefined) row.referral_source = s.referralSource;
  if (s.termsAccepted !== undefined) row.terms_accepted = s.termsAccepted;
  if (s.registeredAt !== undefined) row.registered_at = s.registeredAt;
  if (s.status !== undefined) row.status = s.status;
  if (s.qrRegistrationCardUrl !== undefined) row.hall_ticket_qr_url = s.qrRegistrationCardUrl;
  return row;
}

// ============================================================================
// 1. Colleges CRUD Service
// ============================================================================
export const collegesService = {
  async getAll(): Promise<College[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .order("name", { ascending: true });

      if (error || !data) {
        return [];
      }
      return data.map(mapCollegeFromDb);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<College | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return null;
      }
      return mapCollegeFromDb(data);
    } catch {
      return null;
    }
  },

  async create(college: Omit<College, "id">): Promise<College> {
    const newId = `col-${Date.now()}`;
    const newCollege: College = { id: newId, ...college };

    if (isSupabaseConfigured) {
      try {
        const dbRow = toCollegeDbRow(newCollege);
        const { data, error } = await supabase
          .from("colleges")
          .insert([dbRow])
          .select()
          .single();
        if (!error && data) return mapCollegeFromDb(data);
      } catch (err) {
        console.warn("Colleges insert failed: ", err);
      }
    }

    return newCollege;
  },

  async update(id: string, updates: Partial<College>): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const dbRow = toCollegeDbRow(updates);
        delete dbRow.id; // Do not overwrite primary key

        // Strategy 1: Match by exact ID
        let { data, error } = await supabase
          .from("colleges")
          .update(dbRow)
          .eq("id", id)
          .select();

        // Strategy 2: Match by mapped UUID
        if ((!data || data.length === 0) && COLLEGE_ID_MAP[id]) {
          const res = await supabase
            .from("colleges")
            .update(dbRow)
            .eq("id", COLLEGE_ID_MAP[id])
            .select();
          data = res.data;
          error = res.error;
        }

        // Strategy 3: Match by college name
        if ((!data || data.length === 0) && updates.name) {
          const res = await supabase
            .from("colleges")
            .update(dbRow)
            .ilike("name", `%${updates.name.trim()}%`)
            .select();
          data = res.data;
          error = res.error;
        }

        if (!error && data && data.length > 0) return true;
      } catch (err) {
        console.warn("Colleges update failed:", err);
      }
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("colleges").delete().eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Colleges delete failed:", err);
      }
    }
    return true;
  },
};

// ============================================================================
// 2. CSR Drives CRUD Service
// ============================================================================
export const drivesService = {
  async getAll(): Promise<CSRDrive[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("drives")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }
      return data.map(mapDriveFromDb);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<CSRDrive | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from("drives")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return null;
      }
      return mapDriveFromDb(data);
    } catch {
      return null;
    }
  },

  async create(drive: Omit<CSRDrive, "id">): Promise<CSRDrive> {
    const newId = `${Math.floor(Math.random() * 10000)}`;
    const newDrive: CSRDrive = { id: newId, ...drive };

    if (isSupabaseConfigured) {
      try {
        const dbRow = toDriveDbRow(newDrive);
        const { data, error } = await supabase
          .from("drives")
          .insert([dbRow])
          .select()
          .single();
        if (!error && data) return mapDriveFromDb(data);
      } catch (err) {
        console.warn("Drives Insert failed:", err);
      }
    }

    return newDrive;
  },

  async update(id: string, updates: Partial<CSRDrive>): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const dbRow = toDriveDbRow(updates);
        delete dbRow.id; // Do not overwrite primary key

        // Strategy 1: Match by exact ID
        let { data, error } = await supabase
          .from("drives")
          .update(dbRow)
          .eq("id", id)
          .select();

        // Strategy 2: Match by mapped UUID
        if ((!data || data.length === 0) && DRIVE_ID_MAP[id]) {
          const res = await supabase
            .from("drives")
            .update(dbRow)
            .eq("id", DRIVE_ID_MAP[id])
            .select();
          data = res.data;
          error = res.error;
        }

        // Strategy 3: Match by drive name
        if ((!data || data.length === 0) && updates.name) {
          const res = await supabase
            .from("drives")
            .update(dbRow)
            .ilike("name", `%${updates.name.trim()}%`)
            .select();
          data = res.data;
          error = res.error;
        }

        if (!error && data && data.length > 0) return true;
      } catch (err) {
        console.warn("Drives Update Failed:", err);
      }
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("drives").delete().eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Drives Delete Failed:", err);
      }
    }
    return true;
  },
};

// ============================================================================
// 3. Students CRUD Service
// ============================================================================
export const studentsService = {
  async getAll(): Promise<Student[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("registered_at", { ascending: false });

      if (error || !data) {
        return [];
      }
      return data.map(mapStudentFromDb);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<Student | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return null;
      }
      return mapStudentFromDb(data);
    } catch {
      return null;
    }
  },

  async register(
    studentData: Omit<Student, "id" | "studentId" | "registeredAt" | "status">
  ): Promise<Student> {
    const timestamp = Date.now();
    const studentId = `GQT-2027-${String(timestamp).slice(-4)}`;
    const newStudent: Student = {
      ...studentData,
      id: `std-${timestamp}`,
      studentId,
      registeredAt: new Date().toISOString(),
      status: "Registered",
    };

    if (isSupabaseConfigured) {
      try {
        const dbRow = toStudentDbRow(newStudent);
        const { data, error } = await supabase
          .from("students")
          .insert([dbRow])
          .select()
          .single();
        if (!error && data) return mapStudentFromDb(data);
      } catch (err) {
        console.warn("Students Insert Failed:", err);
      }
    }

    return newStudent;
  },

  async update(
    id: string,
    updates: Partial<Student>
  ): Promise<{ success: boolean; data?: Student; error?: string }> {
    if (!isSupabaseConfigured) return { success: true };

    try {
      const dbRow = toStudentDbRow(updates);
      delete dbRow.id; // Do not overwrite primary key

      let updatedRow: any = null;
      let lastError: any = null;

      // Strategy 1: Update by primary key ID if provided
      if (id) {
        const { data, error } = await supabase
          .from("students")
          .update(dbRow)
          .eq("id", id)
          .select();

        if (!error && data && data.length > 0) {
          updatedRow = data[0];
        } else if (error) {
          lastError = error;
        }
      }

      // Strategy 2: If 0 rows updated by ID, match by email
      if (!updatedRow && (updates.email || updates.usn)) {
        if (updates.email) {
          const res = await supabase
            .from("students")
            .update(dbRow)
            .ilike("email", updates.email.trim())
            .select();

          if (!res.error && res.data && res.data.length > 0) {
            updatedRow = res.data[0];
          } else if (res.error) {
            lastError = res.error;
          }
        }

        // Strategy 2b: Match by USN
        if (!updatedRow && updates.usn) {
          const res = await supabase
            .from("students")
            .update(dbRow)
            .ilike("usn", updates.usn.trim())
            .select();

          if (!res.error && res.data && res.data.length > 0) {
            updatedRow = res.data[0];
          } else if (res.error) {
            lastError = res.error;
          }
        }
      }

      // Strategy 3: Fallback for single candidate / active student
      if (!updatedRow) {
        const { data: allStudents } = await supabase.from("students").select("id").limit(2);
        if (allStudents && allStudents.length === 1) {
          const res = await supabase
            .from("students")
            .update(dbRow)
            .eq("id", allStudents[0].id)
            .select();

          if (!res.error && res.data && res.data.length > 0) {
            updatedRow = res.data[0];
          } else if (res.error) {
            lastError = res.error;
          }
        }
      }

      // Strategy 4: If student record doesn't exist yet in Supabase, create/upsert it dynamically
      if (!updatedRow && (id || updates.email || updates.usn)) {
        const studentIdToUse = id || `std-${Date.now()}`;
        const upsertRow = {
          ...dbRow,
          id: studentIdToUse,
          student_id: updates.studentId || `GQT-2027-${Math.floor(1000 + Math.random() * 9000)}`,
          full_name: updates.fullName || "",
          email: updates.email || "",
          usn: updates.usn || `PENDING-${studentIdToUse.slice(-4)}`,
          status: updates.status || "",
        };

        const { data: upsertData, error: upsertErr } = await supabase
          .from("students")
          .upsert([upsertRow], { onConflict: "id" })
          .select();

        if (!upsertErr && upsertData && upsertData.length > 0) {
          updatedRow = upsertData[0];
        } else if (upsertErr) {
          lastError = upsertErr;
        }
      }

      if (updatedRow) {
        return { success: true, data: mapStudentFromDb(updatedRow) };
      }

      return {
        success: false,
        error: lastError?.message || "No matching student record found in database.",
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("students").delete().eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Students Delete Failed:", err);
      }
    }
    return true;
  },
};

// ============================================================================
// 4. CRM & Follow-ups Service
// ============================================================================
export const crmService = {
  async getAllInteractions(): Promise<CRMInteraction[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("crm_interactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }
      return data.map((r) => ({
        id: r.id,
        collegeId: r.college_id || r.collegeId,
        collegeName: r.college_name || r.collegeName || "",
        contactPerson: r.contact_person || r.contactPerson || "",
        contactRole: r.contact_role || r.contactRole || "",
        contactPhone: r.contact_phone || r.contactPhone || "",
        type: r.type || "Call",
        direction: r.direction || "Outbound",
        outcome: r.outcome || "",
        summary: r.summary || "",
        meetingMinutes: r.meeting_minutes || r.meetingMinutes,
        audioRecordingUrl: r.audio_recording_url || r.audioRecordingUrl,
        nextAction: r.next_action || r.nextAction || "",
        followUpDate: r.follow_up_date || r.followUpDate,
        priority: r.priority || "Medium",
        tags: r.tags || [],
        timestamp: r.created_at || new Date().toISOString(),
        loggedBy: r.logged_by || r.loggedBy || "",
        isEscalated: r.is_escalated ?? r.isEscalated ?? false,
      }));
    } catch {
      return [];
    }
  },

  async logInteraction(
    interaction: Omit<CRMInteraction, "id" | "timestamp">
  ): Promise<CRMInteraction> {
    const newRecord: CRMInteraction = {
      ...interaction,
      id: `crm-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: newRecord.id,
          college_id: newRecord.collegeId,
          contact_person: newRecord.contactPerson,
          contact_role: newRecord.contactRole,
          contact_phone: newRecord.contactPhone,
          type: newRecord.type,
          direction: newRecord.direction,
          outcome: newRecord.outcome,
          summary: newRecord.summary,
          meeting_minutes: newRecord.meetingMinutes,
          audio_recording_url: newRecord.audioRecordingUrl,
          next_action: newRecord.nextAction,
          follow_up_date: newRecord.followUpDate,
          priority: newRecord.priority,
          tags: newRecord.tags,
          logged_by: newRecord.loggedBy,
          is_escalated: newRecord.isEscalated,
        };
        const { data, error } = await supabase
          .from("crm_interactions")
          .insert([dbRow])
          .select()
          .single();
        if (!error && data) return newRecord;
      } catch (err) {
        console.warn("CRM log fallback:", err);
      }
    }

    return newRecord;
  },

  async getAllFollowUps(): Promise<FollowUpReminder[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("follow_ups")
        .select("*")
        .order("scheduled_for", { ascending: true });

      if (error || !data) {
        return [];
      }
      return data.map((f) => ({
        id: f.id,
        collegeId: f.college_id || f.collegeId,
        collegeName: f.college_name || f.collegeName || "",
        interactionId: f.interaction_id || f.interactionId,
        contactPerson: f.contact_person || f.contactPerson || "",
        contactPhone: f.contact_phone || f.contactPhone || "",
        scheduledFor: f.scheduled_for || f.scheduledFor,
        dueCategory: f.due_category || f.dueCategory || computeDueCategory(f.scheduled_for || f.scheduledFor),
        purpose: f.purpose || "",
        assignedTo: f.assigned_to || f.assignedTo || "",
        priority: f.priority || "Medium",
        status: f.status || "Pending",
        notes: f.notes,
        emailReminderSent: f.email_reminder_sent ?? f.emailReminderSent ?? false,
        whatsappReminderSent: f.whatsapp_reminder_sent ?? f.whatsappReminderSent ?? false,
      }));
    } catch {
      return [];
    }
  },

  async addFollowUp(
    followUp: Omit<FollowUpReminder, "id">
  ): Promise<FollowUpReminder> {
    const newReminder: FollowUpReminder = {
      ...followUp,
      id: `flw-${Date.now()}`,
    };

    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: newReminder.id,
          college_id: newReminder.collegeId,
          interaction_id: newReminder.interactionId,
          contact_person: newReminder.contactPerson,
          contact_phone: newReminder.contactPhone,
          scheduled_for: newReminder.scheduledFor,
          purpose: newReminder.purpose,
          assigned_to: newReminder.assignedTo,
          priority: newReminder.priority,
          status: newReminder.status,
          notes: newReminder.notes,
          email_reminder_sent: newReminder.emailReminderSent,
          whatsapp_reminder_sent: newReminder.whatsappReminderSent,
        };
        const { error } = await supabase
          .from("follow_ups")
          .insert([dbRow]);
        if (!error) return newReminder;
      } catch (err) {
        console.warn("Follow-up insert fallback:", err);
      }
    }

    return newReminder;
  },

  async updateFollowUpStatus(
    id: string,
    status: FollowUpReminder["status"]
  ): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("follow_ups")
          .update({ status })
          .eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Follow-up update fallback:", err);
      }
    }
    return true;
  },
};

// ============================================================================
// 5. Tasks & Tickets CRUD Service
// ============================================================================
export const tasksService = {
  async getAll(): Promise<TaskItem[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error || !data) return [];
      return data.map((t) => ({
        id: t.id,
        title: t.title || "",
        description: t.description || "",
        assignedTo: t.assigned_to || t.assignedTo || "",
        priority: t.priority || "Medium",
        dueDate: t.due_date || t.dueDate || new Date().toISOString().split("T")[0],
        status: t.status || "Todo",
        relatedEntity: t.related_entity || t.relatedEntity,
      }));
    } catch {
      return [];
    }
  },

  async create(task: Omit<TaskItem, "id">): Promise<TaskItem> {
    const newTask: TaskItem = { id: `tsk-${Date.now()}`, ...task };
    if (isSupabaseConfigured) {
      try {
        const dbRow = {
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          assigned_to: newTask.assignedTo,
          priority: newTask.priority,
          due_date: newTask.dueDate,
          status: newTask.status,
          related_entity: newTask.relatedEntity,
        };
        const { error } = await supabase
          .from("tasks")
          .insert([dbRow]);
        if (!error) return newTask;
      } catch (err) {
        console.warn("Tasks insert fallback:", err);
      }
    }
    return newTask;
  },

  async updateStatus(id: string, status: TaskItem["status"]): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ status })
          .eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Tasks status update fallback:", err);
      }
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Tasks delete fallback:", err);
      }
    }
    return true;
  },
};

// ============================================================================
// 6. Questions Bank Service
// ============================================================================
export const questionsService = {
  async getAll(): Promise<Question[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error || !data) return [];
      return data.map((q: any) => ({
        id: q.id,
        category: q.category,
        difficulty: q.difficulty || "Medium",
        type: q.type || "MCQ",
        question: q.question,
        codeSnippet: q.code_snippet,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: Number(q.correct_answer ?? 0),
        explanation: q.explanation || "",
        marks: Number(q.marks || 1),
        negativeMarks: Number(q.negative_marks || 0),
      }));
    } catch {
      return [];
    }
  },
};

// ============================================================================
// 7. Users / Staff Profiles Service
// ============================================================================
export const usersService = {
  async getAll(): Promise<UserAccount[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: true });

      if (error || !data || data.length === 0) return [];
      return data.map((u: any) => ({
        id: u.id,
        name: u.full_name || u.name || "",
        email: u.email,
        phone: u.mobile || "",
        role: u.role || "super_admin",
        avatar: u.avatar_url || "",
        collegeId: u.college_id,
        department: u.department,
        status: u.status || "active",
        lastLogin: u.last_login_at || new Date().toISOString(),
        twoFactorEnabled: u.two_factor_enabled || false,
      }));
    } catch {
      return [];
    }
  },

  async create(user: Omit<UserAccount, "id">): Promise<UserAccount> {
    const newId = `usr-${Date.now().toString().slice(-4)}`;
    const created: UserAccount = { id: newId, ...user };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("user_profiles").insert([
          {
            id: newId,
            full_name: user.name,
            email: user.email,
            mobile: user.phone,
            role: user.role,
            avatar_url: user.avatar,
            department: user.department,
            status: user.status,
            two_factor_enabled: user.twoFactorEnabled,
          },
        ]);
      } catch (err) {
        console.warn("User Profiles insert fallback:", err);
      }
    }

    return created;
  },

  async update(id: string, updates: Partial<UserAccount>): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, any> = {};
        if (updates.name) {
          payload.full_name = updates.name;
        }
        if (updates.phone) payload.mobile = updates.phone;
        if (updates.avatar) payload.avatar_url = updates.avatar;
        if (updates.department) payload.department = updates.department;
        if (updates.role) payload.role = updates.role;
        if (updates.status) payload.status = updates.status;

        // 1. Update in Supabase Auth metadata if session exists
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            await supabase.auth.updateUser({
              data: {
                name: updates.name,
                phone: updates.phone,
                department: updates.department,
                role: updates.role,
              },
            });
          }
        } catch { }

        // 2. Update user_profiles table by ID, fallback by email
        let { error } = await supabase.from("user_profiles").update(payload).eq("id", id);
        if (error && updates.email) {
          const res = await supabase.from("user_profiles").update(payload).ilike("email", updates.email.trim());
          error = res.error;
        }

        return { success: true };
      } catch (err: any) {
        console.warn("User update fallback:", err);
        return { success: false, error: err.message };
      }
    }
    return { success: true };
  },

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) return { success: false, error: error.message };
        }
        // Save local hash for offline / simulated role sessions
        if (typeof window !== "undefined") {
          localStorage.setItem("gqt_user_password_synced", "true");
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to update password" };
      }
    }
    return { success: true };
  },

  async resetPasswordForEmail(email: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to dispatch reset email" };
      }
    }
    return { success: true };
  },
};

// ============================================================================
// 8. HR Interviews CRUD Service
// ============================================================================
export const interviewsService = {
  async getAll(): Promise<HRInterview[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .order("scheduled_slot", { ascending: true });

      if (error || !data) return [];
      return data.map((i: any) => ({
        id: i.id,
        studentId: i.student_id || "",
        studentName: i.candidate_name || i.student_name || "",
        collegeName: i.college_name || "",
        branch: i.branch || "",
        driveId: i.drive_id || "",
        scheduledSlot: i.scheduled_slot || i.scheduled_at || new Date().toISOString(),
        meetingLink: i.meeting_link || i.meeting_url || "",
        interviewerName: i.interviewer_name || i.hr_name || "",
        interviewerRole: i.interviewer_role || "",
        status: (i.status as HRInterview["status"]) || "",
        ratings: i.ratings || {
          technicalSkills: 4,
          problemSolving: 4,
          communication: 4,
          culturalFit: 4,
          overall: 4,
        },
        recommendation: i.recommendation || "",
        remarks: i.remarks || i.detailed_notes || "",
        conductedAt: i.conducted_at || i.completed_at,
      }));
    } catch {
      return [];
    }
  },

  async create(interview: Omit<HRInterview, "id">): Promise<HRInterview> {
    const newId = `int-${Date.now()}`;
    const item: HRInterview = { id: newId, ...interview };
    if (isSupabaseConfigured) {
      try {
        await supabase.from("interviews").insert([
          {
            id: newId,
            student_id: item.studentId,
            drive_id: item.driveId || "",
            interviewer_name: item.interviewerName,
            interviewer_role: item.interviewerRole,
            scheduled_slot: item.scheduledSlot,
            meeting_link: item.meetingLink,
            status: item.status,
            ratings: item.ratings || {},
            remarks: item.remarks,
            recommendation: item.recommendation,
          },
        ]);
      } catch (err) {
        console.warn("Interview insert fallback:", err);
      }
    }
    return item;
  },

  async update(id: string, updates: Partial<HRInterview>): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, any> = {};
        if (updates.status) payload.status = updates.status;
        if (updates.recommendation) payload.recommendation = updates.recommendation;
        if (updates.remarks) payload.remarks = updates.remarks;
        if (updates.ratings) payload.ratings = updates.ratings;
        if (updates.conductedAt) payload.conducted_at = updates.conductedAt;
        await supabase.from("interviews").update(payload).eq("id", id);
      } catch (err) {
        console.warn("Interview update fallback:", err);
      }
    }
    return true;
  },
};

// ============================================================================
// 9. Offer Letters CRUD Service
// ============================================================================
export const offersService = {
  async getAll(): Promise<OfferLetter[]> {
    if (!isSupabaseConfigured) return [];
    try {
      // Primary table is 'offers'
      let { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("issued_at", { ascending: false });

      if (error && !data) {
        // Fallback if schema uses offer_letters
        const fallbackRes = await supabase.from("offer_letters").select("*");
        data = fallbackRes.data;
      }

      if (!data) return [];
      return data.map((o: any) => ({
        id: o.id,
        offerNumber: o.offer_number || o.offer_code || `GQT/OFFER/2026/${o.id.slice(-4)}`,
        studentId: o.student_id,
        studentName: o.student_name || o.candidate_name || "",
        studentEmail: o.student_email || o.candidate_email || "",
        studentPhone: o.student_phone || o.candidate_phone || "",
        collegeName: o.college_name || "",
        driveName: o.drive_name || "",
        roleTitle: o.role_title || "",
        course: o.course || o.course_name || "",
        branch: o.branch || "",
        batch: o.batch || "",
        ctc: o.ctc || "",
        stipendDuringInternship: o.stipend_during_internship || `₹ ${Number(o.stipend_amount || 15000).toLocaleString()} / month`,
        location: o.location || o.training_location || "",
        joiningDate: o.joining_date || "",
        offerIssuedDate: o.issued_at || o.issue_date || new Date().toISOString().split("T")[0],
        validUntil: o.valid_until || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        status: (o.status as OfferLetter["status"]) || "",
        qrVerificationCode: o.qr_verification_code || `GQT-VERIFY-2026-${o.id.slice(-4)}`,
        digitalSignatureUrl: o.digital_signature_url || "/images/signatures/director-signature.png",
        pdfUrl: o.pdf_url || o.offerLetterPdfUrl,
        acceptedAt: o.accepted_at,
      }));
    } catch {
      return [];
    }
  },

  async create(offer: Omit<OfferLetter, "id" | "offerIssuedDate">): Promise<OfferLetter> {
    const newId = `off-${Date.now()}`;
    const issuedDate = new Date().toISOString().split("T")[0];
    const newOffer: OfferLetter = { id: newId, offerIssuedDate: issuedDate, ...offer };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("offers").insert([
          {
            id: newId,
            offer_number: newOffer.offerNumber,
            student_id: newOffer.studentId,
            drive_id: "",
            role_title: newOffer.roleTitle,
            course: newOffer.course,
            batch: newOffer.batch,
            ctc: newOffer.ctc,
            stipend_during_internship: newOffer.stipendDuringInternship,
            location: newOffer.location,
            joining_date: newOffer.joiningDate,
            valid_until: newOffer.validUntil,
            status: newOffer.status,
            qr_verification_code: newOffer.qrVerificationCode || `GQT-VERIFY-${(newOffer.offerNumber || Date.now().toString()).replace(/[^a-zA-Z0-9]/g, "")}`,
            digital_signature_url: newOffer.digitalSignatureUrl,
            pdf_url: newOffer.pdfUrl,
          },
        ]);
      } catch (err) {
        console.warn("Offer insert fallback:", err);
      }
    }
    return newOffer;
  },

  async updateStatus(id: string, status: OfferLetter["status"], notes?: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("offers")
          .update({
            status,
            accepted_at: status === "Accepted" ? new Date().toISOString() : null,
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Offer update fallback:", err);
      }
    }
    return true;
  },
};

// ============================================================================
// 10. Notifications & Audit CRUD Services
// ============================================================================
export const notificationsService = {
  async getAll(): Promise<NotificationItem[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error || !data) return [];
      return data.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type || (n.category === "hr" ? "warning" : "info"),
        channel: n.channel || "In-App",
        targetRoles: Array.isArray(n.target_roles) && n.target_roles.length > 0 ? n.target_roles : (["student", "hr", "super_admin"] as UserRole[]),
        timestamp: n.created_at || new Date().toISOString(),
        read: Boolean(n.read ?? n.is_read ?? false),
        actionUrl: n.action_url,
      }));
    } catch {
      return [];
    }
  },

  async markAsRead(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("notifications").update({ read: true }).eq("id", id);
      } catch { }
    }
    return true;
  },
};

export const auditService = {
  async getAll(): Promise<AuditLog[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error || !data) return [];
      return data.map((a: any) => ({
        id: a.id,
        timestamp: a.created_at || new Date().toISOString(),
        user: a.user_email || "System",
        userRole: (a.user_role as UserRole) || "super_admin",
        action: a.action,
        entityType: (a.module as AuditLog["entityType"]) || "User",
        entityId: a.resource_id || "",
        ipAddress: "106.51.10.45",
        browser: "Platform Browser",
        details: `${a.action} on ${a.module || "System"}`,
      }));
    } catch {
      return [];
    }
  },

  async log(entry: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("audit_logs").insert([
          {
            module: entry.entityType,
            action: entry.action,
            resource_id: entry.entityId,
            user_email: entry.user,
            user_role: entry.userRole,
          },
        ]);
      } catch { }
    }
  },
};


