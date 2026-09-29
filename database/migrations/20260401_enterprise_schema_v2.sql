-- ============================================================================
-- GLOBAL QUEST TECHNOLOGIES (GQT) CSR DRIVE PLATFORM
-- ENTERPRISE POSTGRESQL PRODUCTION DATABASE SCHEMA (V2.0)
-- Target: Supabase PostgreSQL 15+ / Cloud
-- Architecture: 50+ Normalized Tables, UUID PKs, Soft Deletes, Auditing,
--               Comprehensive RLS, Views, Functions, Triggers, Realtime & Storage
-- ============================================================================

-- 0. EXTENSIONS & COMPATIBILITY
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. AUTH & USER GOVERNANCE
-- ============================================================================

-- User Roles Reference Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_key VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    description TEXT,
    portal_prefix VARCHAR(64) NOT NULL,
    is_system_role BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master System Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    module VARCHAR(64) NOT NULL,
    action VARCHAR(32) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role to Permissions Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    role_key VARCHAR(64) NOT NULL,
    permission_code VARCHAR(64) NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID,
    UNIQUE(role_key, permission_code)
);

-- User Profiles (Linked with auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- matches auth.users(id) or standalone
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_key VARCHAR(64) NOT NULL DEFAULT 'student',
    employee_id VARCHAR(64),
    phone VARCHAR(32),
    avatar_url TEXT,
    department VARCHAR(128),
    college_id UUID,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Active User Sessions & Device Footprint
CREATE TABLE IF NOT EXISTS active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_key VARCHAR(64) NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    device_type VARCHAR(64) NOT NULL,
    operating_system VARCHAR(64) NOT NULL,
    browser VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    location VARCHAR(128) DEFAULT 'Bengaluru, India',
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Login History (Forensic Log)
CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email VARCHAR(255) NOT NULL,
    event_type VARCHAR(32) NOT NULL, -- 'login_success', 'login_failed', 'logout', 'password_reset'
    ip_address VARCHAR(45) NOT NULL,
    browser VARCHAR(128),
    device VARCHAR(128),
    location VARCHAR(128),
    status VARCHAR(32) NOT NULL, -- 'SUCCESS', 'BLOCKED', 'CHALLENGED'
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password Resets Queue & Audit
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    reset_token TEXT UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enterprise Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email VARCHAR(255),
    user_role VARCHAR(64),
    module VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource_id VARCHAR(128),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. INSTITUTIONAL ORGANIZATION & ACADEMIA
-- ============================================================================

-- Academic Years Sessions
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_label VARCHAR(32) UNIQUE NOT NULL, -- e.g. '2025-2026'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    status VARCHAR(32) DEFAULT 'active', -- 'active', 'upcoming', 'archived'
    total_drives INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Karnataka Districts Master
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) UNIQUE NOT NULL,
    state VARCHAR(64) DEFAULT 'Karnataka',
    code VARCHAR(16) UNIQUE,
    region VARCHAR(64) DEFAULT 'South Karnataka', -- 'North Karnataka', 'Kalyana Karnataka', 'Malenadu', 'Coastal Karnataka'
    headquarters VARCHAR(128),
    college_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Colleges Master
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    college_code VARCHAR(32) UNIQUE NOT NULL,
    vtu_code VARCHAR(32),
    university_code VARCHAR(32),
    aishe_code VARCHAR(32) UNIQUE,
    type VARCHAR(64) NOT NULL DEFAULT 'University Affiliated',
    district VARCHAR(128) NOT NULL,
    state VARCHAR(64) NOT NULL DEFAULT 'Karnataka',
    address TEXT,
    website VARCHAR(255),
    established_year INT,
    naac_grade VARCHAR(16) DEFAULT 'A',
    nba_status VARCHAR(32) DEFAULT 'Accredited',
    tier VARCHAR(32) NOT NULL DEFAULT 'Tier-2',
    student_strength INT DEFAULT 0,
    eligible_students_count INT DEFAULT 0,
    branches_available TEXT[] DEFAULT ARRAY['CSE', 'ISE', 'ECE', 'AI&ML'],
    training_mode VARCHAR(64) DEFAULT 'Hybrid',
    status VARCHAR(32) NOT NULL DEFAULT 'Active', -- 'Active', 'MoU Signed', 'In Discussion', 'Inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Academic Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(32) NOT NULL,
    hod_name VARCHAR(128),
    hod_email VARCHAR(255),
    hod_phone VARCHAR(32),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, code)
);

-- Placement Officers (TPO) Master
CREATE TABLE IF NOT EXISTS placement_officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    profile_id UUID,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    designation VARCHAR(128) DEFAULT 'Head - Training & Placement',
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faculty Coordinators Master
CREATE TABLE IF NOT EXISTS faculty_coordinators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    profile_id UUID,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    department VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Principals Master
CREATE TABLE IF NOT EXISTS principals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    profile_id UUID,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    qualification VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. CSR RECRUITMENT DRIVES & WORKFLOW
-- ============================================================================

-- Master CSR Drives
CREATE TABLE IF NOT EXISTS csr_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    academic_year VARCHAR(32) NOT NULL DEFAULT '2025-2026',
    batch VARCHAR(32) NOT NULL DEFAULT '2026',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Active', -- 'Draft', 'Upcoming', 'Active', 'In Progress', 'Completed', 'Archived'
    mode VARCHAR(32) DEFAULT 'Hybrid', -- 'Online', 'On Campus', 'Hybrid'
    min_aggregate NUMERIC(5,2) DEFAULT 60.0,
    backlogs_allowed INT DEFAULT 0,
    branches_eligible TEXT[] DEFAULT ARRAY['CSE', 'ISE', 'ECE', 'EEE', 'AI&ML'],
    target_registrations INT DEFAULT 1000,
    target_selections INT DEFAULT 200,
    current_phase INT DEFAULT 1,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Drive Courses
CREATE TABLE IF NOT EXISTS drive_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    course_name VARCHAR(128) NOT NULL,
    technology_stack VARCHAR(255) NOT NULL,
    duration_months INT DEFAULT 4,
    stipend_amount NUMERIC(10,2) DEFAULT 0.0,
    seat_capacity INT DEFAULT 150,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drive Detailed 15-Phase Schedule
CREATE TABLE IF NOT EXISTS drive_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    phase_number INT NOT NULL,
    phase_name VARCHAR(128) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed'
    responsible_role VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, phase_number)
);

-- Drive Staff Assignments (HR, CSR Managers, Proctors)
CREATE TABLE IF NOT EXISTS drive_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role_key VARCHAR(64) NOT NULL,
    assigned_colleges UUID[] DEFAULT ARRAY[]::UUID[],
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID
);

-- College to Drive Linkage
CREATE TABLE IF NOT EXISTS college_drive_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    mou_signed BOOLEAN DEFAULT true,
    mou_url TEXT,
    assigned_date DATE DEFAULT CURRENT_DATE,
    expected_students INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, college_id)
);

-- Drive Official Documents (MoU, Guidelines, Brochures)
CREATE TABLE IF NOT EXISTS drive_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. STUDENT CANDIDATES & PROFILES
-- ============================================================================

-- Core Students Master
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'GQT-2026-0001'
    profile_id UUID, -- links to profiles(id)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    whatsapp_number VARCHAR(32),
    gender VARCHAR(16) NOT NULL,
    dob DATE NOT NULL,
    college_id UUID REFERENCES colleges(id) ON DELETE RESTRICT,
    college_name VARCHAR(255) NOT NULL,
    usn VARCHAR(32) UNIQUE NOT NULL,
    branch VARCHAR(128) NOT NULL,
    degree VARCHAR(64) DEFAULT 'B.E / B.Tech',
    year_of_passing INT NOT NULL DEFAULT 2026,
    semester INT DEFAULT 8,
    cgpa NUMERIC(4,2),
    percentage NUMERIC(5,2),
    backlogs_active INT DEFAULT 0,
    backlogs_history INT DEFAULT 0,
    aadhaar_last4 VARCHAR(4),
    city VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    state VARCHAR(64) DEFAULT 'Karnataka',
    pincode VARCHAR(16),
    photo_url TEXT,
    resume_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'Registered', 
    -- 'Registered', 'Eligible', 'Exam Scheduled', 'Exam Completed', 'Qualified', 
    -- 'Interview Scheduled', 'Interview Completed', 'Selected', 'Offer Generated', 
    -- 'Offer Accepted', 'Admitted', 'Rejected', 'Hold', 'Not Attended'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Student CSR Drive Registrations
CREATE TABLE IF NOT EXISTS student_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    selected_course VARCHAR(128) NOT NULL,
    preferred_training_mode VARCHAR(64) DEFAULT 'Hybrid',
    terms_accepted BOOLEAN DEFAULT true,
    registration_card_url TEXT,
    registration_timestamp TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(32) DEFAULT 'Registered',
    UNIQUE(student_id, drive_id)
);

-- Student Supporting Documents
CREATE TABLE IF NOT EXISTS student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL, -- 'marksheet_10', 'marksheet_12', 'marksheet_degree', 'aadhaar', 'resume', 'photo'
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Skills & Technical Competencies
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    skill_name VARCHAR(64) NOT NULL,
    proficiency_level VARCHAR(32) DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Projects & Portfolio
CREATE TABLE IF NOT EXISTS student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies TEXT[],
    github_url TEXT,
    live_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Social & Code Profiles
CREATE TABLE IF NOT EXISTS student_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    platform VARCHAR(32) NOT NULL, -- 'github', 'linkedin', 'leetcode', 'hackerrank'
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, platform)
);

-- ============================================================================
-- 5. EXAMINATION ENGINE & PROCTORING
-- ============================================================================

-- Question Bank Master
CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(64) NOT NULL, -- 'Quantitative', 'Logical Reasoning', 'Verbal', 'Core Java', 'SQL', 'Web Tech'
    difficulty VARCHAR(32) NOT NULL DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
    question_text TEXT NOT NULL,
    code_snippet TEXT,
    explanation TEXT,
    marks INT DEFAULT 1,
    negative_marks NUMERIC(3,2) DEFAULT 0.0,
    created_by UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question Multiple Choice Options
CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES question_bank(id) ON DELETE CASCADE,
    option_key VARCHAR(8) NOT NULL, -- 'A', 'B', 'C', 'D'
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question Tags
CREATE TABLE IF NOT EXISTS question_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES question_bank(id) ON DELETE CASCADE,
    tag VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Question Papers
CREATE TABLE IF NOT EXISTS question_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    total_questions INT NOT NULL DEFAULT 50,
    duration_minutes INT NOT NULL DEFAULT 60,
    passing_percentage NUMERIC(5,2) DEFAULT 60.0,
    is_randomized BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question Paper to Question Bank Mapping
CREATE TABLE IF NOT EXISTS question_paper_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID REFERENCES question_papers(id) ON DELETE CASCADE,
    question_id UUID REFERENCES question_bank(id) ON DELETE RESTRICT,
    question_order INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live Exam Sessions & Proctoring State
CREATE TABLE IF NOT EXISTS exam_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    paper_id UUID REFERENCES question_papers(id) ON DELETE RESTRICT,
    status VARCHAR(32) DEFAULT 'Not Started', -- 'Not Started', 'In Progress', 'Submitted', 'Terminated'
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    browser_fingerprint TEXT,
    ip_address VARCHAR(45),
    webcam_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Student Submissions & Answers
CREATE TABLE IF NOT EXISTS exam_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES question_bank(id) ON DELETE RESTRICT,
    selected_option_key VARCHAR(8),
    is_correct BOOLEAN,
    time_taken_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Final Results & Scorecards
CREATE TABLE IF NOT EXISTS exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    total_questions INT NOT NULL,
    attempted INT NOT NULL,
    correct INT NOT NULL,
    incorrect INT NOT NULL,
    score_percentage NUMERIC(5,2) NOT NULL,
    is_qualified BOOLEAN NOT NULL DEFAULT false,
    cutoff_percentage NUMERIC(5,2) DEFAULT 60.0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    scorecard_pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, drive_id)
);

-- Proctoring AI Violations
CREATE TABLE IF NOT EXISTS exam_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    violation_type VARCHAR(64) NOT NULL, -- 'Tab Switch', 'Multiple Faces', 'No Face Detected', 'Audio Detected', 'Fullscreen Exit'
    snapshot_url TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    severity VARCHAR(32) DEFAULT 'Warning' -- 'Low', 'Medium', 'High', 'Critical'
);

-- Statewide Student Rankings
CREATE TABLE IF NOT EXISTS student_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    state_rank INT,
    district_rank INT,
    college_rank INT,
    total_score NUMERIC(5,2),
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, student_id)
);

-- ============================================================================
-- 6. HR INTERVIEW ENGINE & PIPELINE
-- ============================================================================

-- Interview Slots Master
CREATE TABLE IF NOT EXISTS interview_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES csr_drives(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    hr_user_id UUID NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    mode VARCHAR(32) DEFAULT 'Online Video', -- 'Online Video', 'In Person'
    meeting_link TEXT,
    max_candidates INT DEFAULT 1,
    is_booked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Interviews Master
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    college_id UUID REFERENCES colleges(id) ON DELETE RESTRICT,
    hr_user_id UUID NOT NULL,
    slot_id UUID REFERENCES interview_slots(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    meeting_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'Scheduled', 
    -- 'Scheduled', 'In Progress', 'Completed', 'Rescheduled', 'Cancelled', 'Not Attended'
    technical_score INT CHECK (technical_score BETWEEN 1 AND 10),
    communication_score INT CHECK (communication_score BETWEEN 1 AND 10),
    attitude_score INT CHECK (attitude_score BETWEEN 1 AND 10),
    overall_rating NUMERIC(3,1),
    recommendation VARCHAR(32), -- 'Selected', 'Hold', 'Rejected'
    detailed_notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Selected Candidates Queue
CREATE TABLE IF NOT EXISTS selected_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    interview_id UUID REFERENCES interviews(id),
    selected_by UUID NOT NULL,
    selection_date TIMESTAMPTZ DEFAULT NOW(),
    course_allocated VARCHAR(128) NOT NULL,
    is_offer_issued BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, drive_id)
);

-- Rejected Candidates Queue
CREATE TABLE IF NOT EXISTS rejected_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    interview_id UUID REFERENCES interviews(id),
    rejection_stage VARCHAR(64) NOT NULL, -- 'Exam Cutoff', 'HR Technical', 'HR Communication', 'Document Mismatch'
    rejection_reason TEXT,
    rejected_by UUID NOT NULL,
    rejected_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, drive_id)
);

-- Hold Candidates Queue
CREATE TABLE IF NOT EXISTS hold_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    interview_id UUID REFERENCES interviews(id),
    hold_reason TEXT NOT NULL,
    followup_date DATE,
    hold_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, drive_id)
);

-- Not Attended Candidates Queue
CREATE TABLE IF NOT EXISTS not_attended_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    stage VARCHAR(64) NOT NULL, -- 'Online Exam', 'Interview'
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    contacted_attempt_count INT DEFAULT 0,
    remarks TEXT,
    UNIQUE(student_id, drive_id, stage)
);

-- ============================================================================
-- 7. OFFER LETTERS & STUDENT CONFIRMATIONS
-- ============================================================================

-- Offer Letter Templates
CREATE TABLE IF NOT EXISTS offer_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(128) NOT NULL,
    academic_year VARCHAR(32) DEFAULT '2025-2026',
    header_logo_url TEXT,
    signatory_name VARCHAR(128) NOT NULL,
    signatory_designation VARCHAR(128) NOT NULL,
    signature_image_url TEXT,
    terms_body_html TEXT NOT NULL,
    stipend_amount NUMERIC(10,2) DEFAULT 15000.00,
    validity_days INT DEFAULT 7,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Offer Letters
CREATE TABLE IF NOT EXISTS offer_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_code VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'GQT/OFFER/2026/0491'
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    drive_id UUID REFERENCES csr_drives(id) ON DELETE RESTRICT,
    college_id UUID REFERENCES colleges(id) ON DELETE RESTRICT,
    template_id UUID REFERENCES offer_templates(id),
    candidate_name VARCHAR(255) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_phone VARCHAR(32) NOT NULL,
    course_name VARCHAR(128) NOT NULL,
    stipend_amount NUMERIC(10,2) NOT NULL,
    training_location VARCHAR(128) DEFAULT 'GQT Bengaluru Innovation Campus / Virtual',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Generated', 
    -- 'Generated', 'Dispatched', 'Viewed', 'Accepted', 'Rejected', 'Expired', 'Revoked'
    pdf_url TEXT,
    qr_verification_code VARCHAR(128) UNIQUE NOT NULL,
    accepted_at TIMESTAMPTZ,
    acceptance_ip VARCHAR(45),
    digital_signature_hash TEXT,
    rejection_reason TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, drive_id)
);

-- Offer Status Transition History (Audit)
CREATE TABLE IF NOT EXISTS offer_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES offer_letters(id) ON DELETE CASCADE,
    previous_status VARCHAR(32),
    new_status VARCHAR(32) NOT NULL,
    changed_by UUID,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. ADMISSION & BATCH ALLOCATION
-- ============================================================================

-- Training Batches Master
CREATE TABLE IF NOT EXISTS batch_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'GQT-2026-JAVA-B1'
    batch_name VARCHAR(128) NOT NULL,
    course_name VARCHAR(128) NOT NULL,
    trainer_name VARCHAR(128),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    training_mode VARCHAR(32) DEFAULT 'Hybrid', -- 'Classroom', 'Online Live', 'Hybrid'
    venue_details TEXT,
    max_capacity INT NOT NULL DEFAULT 60,
    enrolled_count INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'Upcoming', -- 'Upcoming', 'Ongoing', 'Completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Batch Enrolment
CREATE TABLE IF NOT EXISTS batch_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES batch_master(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE RESTRICT,
    offer_id UUID REFERENCES offer_letters(id) ON DELETE RESTRICT,
    allocated_by UUID,
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    attendance_rate NUMERIC(5,2) DEFAULT 0.0,
    status VARCHAR(32) DEFAULT 'Enrolled', -- 'Enrolled', 'Active', 'Completed', 'Dropped'
    UNIQUE(batch_id, student_id)
);

-- Joining Confirmations & Checklist
CREATE TABLE IF NOT EXISTS joining_confirmation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batch_master(id) ON DELETE RESTRICT,
    confirmation_status VARCHAR(32) DEFAULT 'Confirmed', -- 'Confirmed', 'Deferred', 'Revoked'
    reporting_date DATE,
    documents_submitted BOOLEAN DEFAULT true,
    laptop_assigned BOOLEAN DEFAULT false,
    id_card_issued BOOLEAN DEFAULT false,
    confirmed_by UUID,
    confirmed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id)
);

-- ============================================================================
-- 9. COMMUNICATION & AUTOMATION ENGINE
-- ============================================================================

-- Push Notifications Master
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- NULL for broadcast to all or target role
    target_role VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'drives', -- 'drives', 'hr', 'offers', 'exams', 'system'
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campus & Platform Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'General',
    target_audience VARCHAR(64) DEFAULT 'All Portals',
    banner_image_url TEXT,
    priority VARCHAR(32) DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Notification Templates
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(128) UNIQUE NOT NULL,
    meta_template_id VARCHAR(128),
    category VARCHAR(64) NOT NULL,
    body_text TEXT NOT NULL,
    variables TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Messages Log
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_mobile VARCHAR(32) NOT NULL,
    recipient_name VARCHAR(128),
    template_name VARCHAR(128),
    rendered_message TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'SENT', -- 'QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED'
    message_sid VARCHAR(128),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Templates Master
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key VARCHAR(128) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_body TEXT NOT NULL,
    variables TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outbound Email Log
CREATE TABLE IF NOT EXISTS email_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_key VARCHAR(128),
    status VARCHAR(32) DEFAULT 'SENT', -- 'QUEUED', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED'
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Outreach Calls Log
CREATE TABLE IF NOT EXISTS crm_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    hr_user_id UUID NOT NULL,
    contact_person VARCHAR(128) NOT NULL,
    contact_phone VARCHAR(32) NOT NULL,
    call_duration_seconds INT DEFAULT 0,
    call_outcome VARCHAR(64) NOT NULL, -- 'Connected', 'Voicemail', 'Busy', 'Follow-up Required'
    discussion_notes TEXT,
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Follow-up Reminders
CREATE TABLE IF NOT EXISTS crm_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    assigned_hr_id UUID NOT NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(32) DEFAULT 'High',
    topic VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. SYSTEM CONFIGURATION, STORAGE, & MONITORING
-- ============================================================================

-- Corporate Branding Settings
CREATE TABLE IF NOT EXISTS branding_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(128) NOT NULL DEFAULT 'Global Quest Technologies',
    logo_dark_url TEXT,
    logo_light_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(16) DEFAULT '#005BBB',
    secondary_color VARCHAR(16) DEFAULT '#001B4D',
    accent_color VARCHAR(16) DEFAULT '#14B8FF',
    font_family VARCHAR(64) DEFAULT 'Inter',
    footer_text TEXT DEFAULT '© 2026 Global Quest Technologies. All rights reserved.',
    support_email VARCHAR(255) DEFAULT 'support@globalquesttechnologies.com',
    support_phone VARCHAR(32) DEFAULT '+91 98450 11223',
    website_url VARCHAR(255) DEFAULT 'https://globalquesttechnologies.com',
    social_links JSONB DEFAULT '{"linkedin": "https://linkedin.com/company/globalquest", "youtube": "https://youtube.com/globalquest"}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Platform Settings
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name VARCHAR(128) DEFAULT 'Global Quest Technologies CSR Platform',
    organization_name VARCHAR(128) DEFAULT 'Global Quest Technologies Pvt Ltd',
    default_academic_year VARCHAR(32) DEFAULT '2025-2026',
    timezone VARCHAR(64) DEFAULT 'Asia/Kolkata',
    date_format VARCHAR(32) DEFAULT 'DD/MM/YYYY',
    currency VARCHAR(8) DEFAULT 'INR',
    min_password_length INT DEFAULT 8,
    require_uppercase BOOLEAN DEFAULT true,
    require_special_char BOOLEAN DEFAULT true,
    session_timeout_minutes INT DEFAULT 120,
    remember_me_days INT DEFAULT 30,
    mfa_enforced BOOLEAN DEFAULT false,
    maintenance_mode BOOLEAN DEFAULT false,
    maintenance_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Flags Master
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_key VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    category VARCHAR(64) DEFAULT 'Platform',
    affected_portals TEXT[] DEFAULT ARRAY['All'],
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage Statistics Tracking
CREATE TABLE IF NOT EXISTS storage_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_name VARCHAR(64) UNIQUE NOT NULL,
    is_public BOOLEAN DEFAULT false,
    file_count BIGINT DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    last_upload_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Backups Registry
CREATE TABLE IF NOT EXISTS system_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_code VARCHAR(64) UNIQUE NOT NULL,
    backup_type VARCHAR(64) NOT NULL, -- 'Full Database Snapshot', 'Storage Metadata', 'Audit & Reports'
    size_mb NUMERIC(8,2) NOT NULL,
    storage_path TEXT NOT NULL,
    checksum_sha256 VARCHAR(128) NOT NULL,
    status VARCHAR(32) DEFAULT 'Completed', -- 'Completed', 'Verifying', 'Failed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Health Metrics
CREATE TABLE IF NOT EXISTS system_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_name VARCHAR(64) NOT NULL, -- 'PostgreSQL', 'Auth Service', 'Storage Engine', 'Realtime Broker'
    status VARCHAR(32) NOT NULL, -- 'Healthy', 'Degraded', 'Down'
    latency_ms INT NOT NULL,
    uptime_percentage NUMERIC(5,2) DEFAULT 99.98,
    error_details TEXT,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Integration Secrets & Endpoints
CREATE TABLE IF NOT EXISTS integration_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name VARCHAR(64) UNIQUE NOT NULL, -- 'Supabase', 'Meta WhatsApp Cloud API', 'SMTP', 'Razorpay', 'Zoom'
    is_connected BOOLEAN DEFAULT true,
    endpoint_url TEXT,
    api_key_masked VARCHAR(64),
    encrypted_secret TEXT,
    webhook_url TEXT,
    last_tested_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Activity Feed
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    actor_name VARCHAR(128) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. HIGH-PERFORMANCE DATABASE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_usn ON students(usn);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_district ON students(district);

CREATE INDEX IF NOT EXISTS idx_colleges_code ON colleges(college_code);
CREATE INDEX IF NOT EXISTS idx_colleges_district ON colleges(district);
CREATE INDEX IF NOT EXISTS idx_colleges_status ON colleges(status);

CREATE INDEX IF NOT EXISTS idx_drives_code ON csr_drives(drive_code);
CREATE INDEX IF NOT EXISTS idx_drives_status ON csr_drives(status);

CREATE INDEX IF NOT EXISTS idx_offers_code ON offer_letters(offer_code);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offer_letters(status);
CREATE INDEX IF NOT EXISTS idx_offers_student ON offer_letters(student_id);

CREATE INDEX IF NOT EXISTS idx_exam_results_student ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_drive ON exam_results(drive_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_qualified ON exam_results(is_qualified);

CREATE INDEX IF NOT EXISTS idx_interviews_student ON interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_hr ON interviews(hr_user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_module ON audit_logs(module);

-- ============================================================================
-- 12. ENTERPRISE REUSABLE DATABASE VIEWS
-- ============================================================================

-- View: Selected Students with Complete Profile and Offer Status
CREATE OR REPLACE VIEW selected_students_view AS
SELECT 
    s.id AS student_id,
    s.student_id AS student_code,
    s.full_name,
    s.email,
    s.mobile,
    s.college_name,
    s.district,
    s.branch,
    s.cgpa,
    d.id AS drive_id,
    d.name AS drive_name,
    sel.course_allocated,
    sel.selection_date,
    o.offer_code,
    o.status AS offer_status,
    o.pdf_url AS offer_pdf_url
FROM selected_students sel
JOIN students s ON s.id = sel.student_id
JOIN csr_drives d ON d.id = sel.drive_id
LEFT JOIN offer_letters o ON o.student_id = s.id AND o.drive_id = d.id;

-- View: Qualified Candidates Eligible for Interview
CREATE OR REPLACE VIEW qualified_students_view AS
SELECT 
    s.id AS student_id,
    s.student_id AS student_code,
    s.full_name,
    s.email,
    s.mobile,
    s.college_name,
    s.district,
    s.branch,
    er.score_percentage AS exam_score,
    er.attempted,
    er.correct,
    er.evaluated_at,
    d.id AS drive_id,
    d.name AS drive_name,
    i.status AS interview_status,
    i.scheduled_at AS interview_time
FROM exam_results er
JOIN students s ON s.id = er.student_id
JOIN csr_drives d ON d.id = er.drive_id
LEFT JOIN interviews i ON i.student_id = s.id AND i.drive_id = d.id
WHERE er.is_qualified = true;

-- View: College-Level Dashboard Aggregations
CREATE OR REPLACE VIEW college_dashboard_view AS
SELECT 
    c.id AS college_id,
    c.name AS college_name,
    c.college_code,
    c.district,
    c.tier,
    COUNT(DISTINCT s.id) AS total_registered,
    COUNT(DISTINCT CASE WHEN er.is_qualified THEN s.id END) AS total_exam_passed,
    COUNT(DISTINCT sel.id) AS total_selected,
    COUNT(DISTINCT CASE WHEN o.status = 'Accepted' THEN o.id END) AS total_offers_accepted
FROM colleges c
LEFT JOIN students s ON s.college_id = c.id
LEFT JOIN exam_results er ON er.student_id = s.id
LEFT JOIN selected_students sel ON sel.student_id = s.id
LEFT JOIN offer_letters o ON o.student_id = s.id
GROUP BY c.id, c.name, c.college_code, c.district, c.tier;

-- View: Karnataka District Aggregations
CREATE OR REPLACE VIEW district_dashboard_view AS
SELECT 
    d.name AS district_name,
    d.region,
    COUNT(DISTINCT c.id) AS partner_colleges,
    COUNT(DISTINCT s.id) AS registered_students,
    COUNT(DISTINCT sel.id) AS selected_students,
    ROUND(AVG(er.score_percentage), 2) AS avg_exam_score
FROM districts d
LEFT JOIN colleges c ON c.district = d.name
LEFT JOIN students s ON s.district = d.name
LEFT JOIN exam_results er ON er.student_id = s.id
LEFT JOIN selected_students sel ON sel.student_id = s.id
GROUP BY d.name, d.region;

-- ============================================================================
-- 13. STORED DATABASE FUNCTIONS & PROCEDURES
-- ============================================================================

-- Function: Generate Next Sequential Student ID
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TEXT AS $$
DECLARE
    next_num INT;
    new_id TEXT;
BEGIN
    SELECT COALESCE(COUNT(*), 0) + 1 INTO next_num FROM students;
    new_id := 'GQT-2026-' || LPAD(next_num::TEXT, 4, '0');
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate Next Sequential Offer Number
CREATE OR REPLACE FUNCTION generate_offer_number()
RETURNS TEXT AS $$
DECLARE
    next_num INT;
    new_code TEXT;
BEGIN
    SELECT COALESCE(COUNT(*), 0) + 1 INTO next_num FROM offer_letters;
    new_code := 'GQT/OFFER/2026/' || LPAD(next_num::TEXT, 4, '0');
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate Exam Score & Qualification
CREATE OR REPLACE FUNCTION calculate_exam_score(p_session_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_total INT;
    v_attempted INT;
    v_correct INT;
    v_score NUMERIC(5,2);
    v_qualified BOOLEAN;
    v_student_id UUID;
    v_drive_id UUID;
BEGIN
    SELECT student_id, drive_id INTO v_student_id, v_drive_id FROM exam_sessions WHERE id = p_session_id;

    SELECT COUNT(*) INTO v_total FROM exam_answers WHERE session_id = p_session_id;
    SELECT COUNT(*) INTO v_attempted FROM exam_answers WHERE session_id = p_session_id AND selected_option_key IS NOT NULL;
    SELECT COUNT(*) INTO v_correct FROM exam_answers WHERE session_id = p_session_id AND is_correct = true;

    IF v_total > 0 THEN
        v_score := ROUND((v_correct::NUMERIC / v_total::NUMERIC) * 100, 2);
    ELSE
        v_score := 0.0;
    END IF;

    v_qualified := (v_score >= 60.0);

    -- Upsert final result
    INSERT INTO exam_results (student_id, drive_id, total_questions, attempted, correct, incorrect, score_percentage, is_qualified)
    VALUES (v_student_id, v_drive_id, v_total, v_attempted, v_correct, (v_attempted - v_correct), v_score, v_qualified)
    ON CONFLICT (student_id, drive_id) DO UPDATE SET
        attempted = EXCLUDED.attempted,
        correct = EXCLUDED.correct,
        incorrect = EXCLUDED.incorrect,
        score_percentage = EXCLUDED.score_percentage,
        is_qualified = EXCLUDED.is_qualified,
        evaluated_at = NOW();

    -- Update student status
    IF v_qualified THEN
        UPDATE students SET status = 'Qualified' WHERE id = v_student_id;
    ELSE
        UPDATE students SET status = 'Rejected' WHERE id = v_student_id;
    END IF;

    RETURN jsonb_build_object(
        'total', v_total,
        'attempted', v_attempted,
        'correct', v_correct,
        'percentage', v_score,
        'qualified', v_qualified
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 14. DATABASE TRIGGERS
-- ============================================================================

-- Trigger: Update updated_at Timestamp automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_students_updated
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_colleges_updated
BEFORE UPDATE ON colleges
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_drives_updated
BEFORE UPDATE ON csr_drives
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_offers_updated
BEFORE UPDATE ON offer_letters
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger: Auto-Log Audit Trail on Status Changes in Offer Letters
CREATE OR REPLACE FUNCTION log_offer_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO offer_status_history (offer_id, previous_status, new_status, remarks)
        VALUES (NEW.id, OLD.status, NEW.status, 'Automated state machine transition');

        INSERT INTO audit_logs (module, action, resource_id, old_value, new_value)
        VALUES (
            'OFFERS',
            'STATUS_CHANGE',
            NEW.offer_code,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_offer_status_audit
AFTER UPDATE ON offer_letters
FOR EACH ROW EXECUTE FUNCTION log_offer_status_change();

-- ============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile, Super Admins can view/edit all
CREATE POLICY "Profiles self view" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles super admin full" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() AND p.role_key = 'super_admin'
        )
    );

-- Students: Students view own record; HR, Admin, Placement Officers view institutional students
CREATE POLICY "Students self view" ON students
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Students staff view" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.role_key IN ('super_admin', 'csr_manager', 'hr', 'placement_officer', 'principal', 'faculty', 'admission_team')
        )
    );

-- Offers: Students read own; HR and Admins manage
CREATE POLICY "Offers student view" ON offer_letters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students s WHERE s.id = offer_letters.student_id AND s.profile_id = auth.uid()
        )
    );

CREATE POLICY "Offers staff manage" ON offer_letters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role_key IN ('super_admin', 'csr_manager', 'hr', 'admission_team')
        )
    );

-- Notifications: Users read own or broadcast
CREATE POLICY "Notifications recipient view" ON notifications
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- Audit Logs: Super Admin only
CREATE POLICY "Audit logs super admin only" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role_key = 'super_admin'
        )
    );

-- ============================================================================
-- 16. SUPABASE STORAGE BUCKETS PROVISIONING
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES 
    ('student-photos', 'student-photos', true),
    ('student-resumes', 'student-resumes', false),
    ('student-documents', 'student-documents', false),
    ('offer-letters', 'offer-letters', false),
    ('question-images', 'question-images', true),
    ('announcement-assets', 'announcement-assets', true),
    ('branding-assets', 'branding-assets', true),
    ('certificates', 'certificates', false),
    ('call-recordings', 'call-recordings', false),
    ('meeting-attachments', 'meeting-attachments', false),
    ('backup-files', 'backup-files', false)
ON CONFLICT (id) DO NOTHING;

-- End of Schema Migration
