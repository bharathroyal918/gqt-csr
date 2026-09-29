-- ============================================================================
-- GQT CSR DRIVE AUTOMATION PLATFORM - ENTERPRISE POSTGRESQL SCHEMA & SEED
-- File: supabase/schema_and_seed.sql
-- Target: Supabase PostgreSQL (Version 15+)
-- Features: 
--   - 100% Idempotent and Error-Free
--   - Resilient VARCHAR Statuses (Eliminates 22P02 Enum Casting Errors)
--   - Flexible VARCHAR(64) Primary Keys with UUID Generation
--   - Generic College & University Multi-Code Compatibility (college_code, vtu_code, university_code)
--   - 22 Enterprise Tables, Full RLS Policies, Storage Buckets, and Initial Seed
-- ============================================================================

-- 1. Clean Up Any Legacy / Conflicting Tables & Enums from Prior Attempts
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS helpdesk_tickets CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS whatsapp_templates CASCADE;
DROP TABLE IF EXISTS follow_ups CASCADE;
DROP TABLE IF EXISTS crm_interactions CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS interviews CASCADE;
DROP TABLE IF EXISTS cheating_violations CASCADE;
DROP TABLE IF EXISTS exam_submissions CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS drive_participating_colleges CASCADE;
DROP TABLE IF EXISTS drive_phases CASCADE;
DROP TABLE IF EXISTS drives CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;

-- Drop legacy enums to eliminate 22P02 enum collisions
DROP TYPE IF EXISTS drive_status_type CASCADE;
DROP TYPE IF EXISTS user_role_type CASCADE;
DROP TYPE IF EXISTS drive_phase_code CASCADE;
DROP TYPE IF EXISTS phase_status_type CASCADE;
DROP TYPE IF EXISTS college_tier_type CASCADE;

-- 2. Enable Standard Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 3. Core Enterprise Tables
-- ============================================================================

-- A. Colleges
CREATE TABLE colleges (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    college_code VARCHAR(32) UNIQUE NOT NULL,
    vtu_code VARCHAR(32),
    university_code VARCHAR(32),
    aishe_code VARCHAR(32) UNIQUE NOT NULL,
    type VARCHAR(64) NOT NULL DEFAULT 'University Affiliated',
    district VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL DEFAULT 'Karnataka',
    address TEXT,
    website VARCHAR(255),
    established_year INT,
    naac_grade VARCHAR(8),
    nba_status VARCHAR(32),
    tier VARCHAR(32) NOT NULL DEFAULT 'Tier-2',
    student_strength INT DEFAULT 0,
    eligible_students_count INT DEFAULT 0,
    branches_available TEXT[] DEFAULT '{}',
    training_mode VARCHAR(32) DEFAULT 'Hybrid',
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    principal_info JSONB DEFAULT '{}'::jsonb,
    placement_officer JSONB DEFAULT '{}'::jsonb,
    placement_coordinator JSONB DEFAULT '{}'::jsonb,
    faculty_coordinators JSONB DEFAULT '[]'::jsonb,
    mou_document_url TEXT,
    mou_signed_date DATE,
    approval_letter_url TEXT,
    drives_participated INT DEFAULT 0,
    students_placed INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. User Profiles
CREATE TABLE user_profiles (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(32),
    role VARCHAR(32) NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE SET NULL,
    department VARCHAR(128),
    status VARCHAR(16) DEFAULT 'active',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. CSR Drives
CREATE TABLE drives (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    drive_code VARCHAR(64) UNIQUE NOT NULL,
    academic_year VARCHAR(16) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT 'CSR Flagship',
    mode VARCHAR(32) DEFAULT 'Offline Campus',
    status VARCHAR(64) DEFAULT 'Draft',
    current_phase VARCHAR(64) DEFAULT 'PHASE_1_DRIVE_CREATION',
    description TEXT,
    location VARCHAR(128),
    venue TEXT,
    district VARCHAR(128),
    state VARCHAR(128) DEFAULT 'Karnataka',
    courses TEXT[] DEFAULT '{}',
    batch VARCHAR(32),
    eligible_departments TEXT[] DEFAULT '{}',
    graduation_types TEXT[] DEFAULT '{"BE","B.Tech"}',
    semester_eligibility INT[] DEFAULT '{7,8}',
    backlog_allowed BOOLEAN DEFAULT FALSE,
    max_backlogs INT DEFAULT 0,
    min_percentage NUMERIC(5,2) DEFAULT 60.00,
    min_cgpa NUMERIC(4,2) DEFAULT 6.50,
    schedule JSONB DEFAULT '{}'::jsonb,
    assignments JSONB DEFAULT '{}'::jsonb,
    automation JSONB DEFAULT '{}'::jsonb,
    metrics JSONB DEFAULT '{
        "colleges_count": 0,
        "registered_students": 0,
        "exam_attended": 0,
        "qualified_students": 0,
        "interview_selected": 0,
        "offer_letters_sent": 0,
        "accepted_offers": 0
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. 15-Phase Automation Workflow Tracking
CREATE TABLE drive_phases (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    drive_id VARCHAR(64) NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    phase_order INT NOT NULL,
    phase_code VARCHAR(64) NOT NULL,
    phase_title VARCHAR(128) NOT NULL,
    status VARCHAR(32) DEFAULT 'Pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    responsible_role VARCHAR(32) NOT NULL,
    phase_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, phase_order)
);

-- E. Drive Participating Colleges
CREATE TABLE drive_participating_colleges (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    drive_id VARCHAR(64) NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    college_id VARCHAR(64) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    approval_status VARCHAR(32) DEFAULT 'Pending',
    approval_letter_url TEXT,
    approved_at TIMESTAMPTZ,
    registered_students_count INT DEFAULT 0,
    whatsapp_group_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drive_id, college_id)
);

-- F. Students
CREATE TABLE students (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    photo_url TEXT,
    gender VARCHAR(16),
    dob DATE,
    mobile VARCHAR(32) NOT NULL,
    whatsapp_number VARCHAR(32),
    email VARCHAR(255) UNIQUE NOT NULL,
    college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE SET NULL,
    usn VARCHAR(32) UNIQUE NOT NULL,
    university VARCHAR(128) DEFAULT 'Visvesvaraya Technological University',
    graduate_type VARCHAR(32) DEFAULT 'BE',
    branch VARCHAR(64) NOT NULL,
    semester INT DEFAULT 8,
    passing_year INT NOT NULL,
    cgpa NUMERIC(4,2) NOT NULL,
    percentage NUMERIC(5,2),
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    aadhaar_last4 VARCHAR(4),
    city VARCHAR(64),
    district VARCHAR(128),
    pincode VARCHAR(16),
    preferred_training_mode VARCHAR(32) DEFAULT 'Hybrid',
    drive_id VARCHAR(64) REFERENCES drives(id) ON DELETE SET NULL,
    selected_course VARCHAR(128),
    batch VARCHAR(32),
    referral_source VARCHAR(64),
    terms_accepted BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(64) DEFAULT 'Registered',
    hall_ticket_qr_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- G. Questions Bank
CREATE TABLE questions (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category VARCHAR(64) NOT NULL,
    difficulty VARCHAR(16) NOT NULL DEFAULT 'Medium',
    type VARCHAR(32) NOT NULL DEFAULT 'MCQ',
    question TEXT NOT NULL,
    code_snippet TEXT,
    options JSONB NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT,
    marks INT DEFAULT 1,
    negative_marks NUMERIC(3,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. Proctored Exam Submissions
CREATE TABLE exam_submissions (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    drive_id VARCHAR(64) NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    total_score NUMERIC(5,2) NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    section_breakdown JSONB DEFAULT '{}'::jsonb,
    answers_given JSONB DEFAULT '{}'::jsonb,
    proctoring_logs JSONB DEFAULT '{}'::jsonb,
    cheating_flag BOOLEAN DEFAULT FALSE,
    cheating_score INT DEFAULT 0,
    time_spent_seconds INT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- I. Cheating Violations
CREATE TABLE cheating_violations (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    exam_submission_id VARCHAR(64) REFERENCES exam_submissions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    violation_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) DEFAULT 'medium',
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    screenshot_url TEXT,
    audio_clip_url TEXT,
    flagged_reason TEXT
);

-- J. HR Interviews
CREATE TABLE interviews (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    drive_id VARCHAR(64) NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    interviewer_name VARCHAR(128),
    interviewer_role VARCHAR(128),
    scheduled_slot TIMESTAMPTZ NOT NULL,
    meeting_link TEXT,
    status VARCHAR(32) DEFAULT 'Scheduled',
    ratings JSONB DEFAULT '{
        "technical_skills": 0,
        "problem_solving": 0,
        "communication": 0,
        "cultural_fit": 0,
        "overall": 0
    }'::jsonb,
    remarks TEXT,
    recommendation VARCHAR(64),
    conducted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K. Offer Letters
CREATE TABLE offers (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    offer_number VARCHAR(64) UNIQUE NOT NULL,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    drive_id VARCHAR(64) NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    role_title VARCHAR(128) NOT NULL DEFAULT 'Software Engineer Trainee',
    course VARCHAR(128),
    batch VARCHAR(32),
    ctc VARCHAR(64) NOT NULL,
    stipend_during_internship VARCHAR(64),
    location VARCHAR(128) DEFAULT 'Bengaluru, Karnataka',
    joining_date DATE,
    valid_until DATE,
    status VARCHAR(32) DEFAULT 'Sent',
    qr_verification_code VARCHAR(128) UNIQUE NOT NULL,
    digital_signature_url TEXT,
    pdf_url TEXT,
    accepted_at TIMESTAMPTZ,
    accepted_ip VARCHAR(64),
    clarification_query TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- L. CRM Interactions
CREATE TABLE crm_interactions (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    college_id VARCHAR(64) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    contact_person VARCHAR(128) NOT NULL,
    contact_role VARCHAR(128),
    contact_phone VARCHAR(32),
    type VARCHAR(32) NOT NULL,
    direction VARCHAR(16) NOT NULL,
    outcome VARCHAR(64),
    summary TEXT NOT NULL,
    meeting_minutes TEXT[],
    audio_recording_url TEXT,
    next_action TEXT,
    follow_up_date DATE,
    priority VARCHAR(16) DEFAULT 'Medium',
    tags TEXT[],
    logged_by VARCHAR(128),
    is_escalated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- M. Follow-up Reminders
CREATE TABLE follow_ups (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    college_id VARCHAR(64) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    interaction_id VARCHAR(64) REFERENCES crm_interactions(id) ON DELETE SET NULL,
    contact_person VARCHAR(128) NOT NULL,
    contact_phone VARCHAR(32),
    scheduled_for TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL,
    assigned_to VARCHAR(128),
    priority VARCHAR(16) DEFAULT 'Medium',
    status VARCHAR(32) DEFAULT 'Pending',
    notes TEXT,
    email_reminder_sent BOOLEAN DEFAULT FALSE,
    whatsapp_reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- N. Tasks & Action Items
CREATE TABLE tasks (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(128),
    priority VARCHAR(16) DEFAULT 'Medium',
    due_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'Todo',
    related_entity JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- O. Notifications
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(16) DEFAULT 'info',
    channel VARCHAR(32) DEFAULT 'In-App',
    target_roles TEXT[] DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- P. WhatsApp Communication Templates
CREATE TABLE whatsapp_templates (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(128) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    placeholders TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Q. Enterprise Documents & Collateral
CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    file_type VARCHAR(16) NOT NULL,
    file_size VARCHAR(32) NOT NULL,
    file_url TEXT NOT NULL,
    version VARCHAR(16) DEFAULT '1.0',
    tags TEXT[] DEFAULT '{}',
    is_confidential BOOLEAN DEFAULT FALSE,
    access_roles TEXT[] DEFAULT '{}',
    uploaded_by VARCHAR(128),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- R. Calendar Events
CREATE TABLE calendar_events (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time VARCHAR(16) NOT NULL,
    end_time VARCHAR(16) NOT NULL,
    type VARCHAR(32) NOT NULL,
    location TEXT,
    drive_id VARCHAR(64) REFERENCES drives(id) ON DELETE SET NULL,
    college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- S. Helpdesk Tickets
CREATE TABLE helpdesk_tickets (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ticket_number VARCHAR(32) UNIQUE NOT NULL,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE SET NULL,
    student_name VARCHAR(128) NOT NULL,
    usn VARCHAR(32),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    priority VARCHAR(16) DEFAULT 'Medium',
    status VARCHAR(32) DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- T. Ticket Messages
CREATE TABLE ticket_messages (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ticket_id VARCHAR(64) NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
    sender_name VARCHAR(128) NOT NULL,
    sender_role VARCHAR(32) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- U. Campus Attendance Records
CREATE TABLE attendance_records (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    drive_id VARCHAR(64) NOT NULL REFERENCES drives(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'Present',
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    marked_by VARCHAR(128),
    method VARCHAR(32) DEFAULT 'QR Scan',
    desk_number VARCHAR(32)
);

-- V. System Audit Logs
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    performed_by VARCHAR(128) NOT NULL,
    performed_by_role VARCHAR(32) NOT NULL,
    details TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(64),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. Enable Row Level Security (RLS) on ALL Tables
-- ============================================================================

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_participating_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheating_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. Permissive Policies for Web App & Authority Roles
-- ============================================================================

CREATE POLICY "Colleges Public Read" ON colleges FOR SELECT TO public USING (true);
CREATE POLICY "Colleges Auth Full" ON colleges FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Drives Public Read" ON drives FOR SELECT TO public USING (true);
CREATE POLICY "Drives Auth Full" ON drives FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Students Public Read" ON students FOR SELECT TO public USING (true);
CREATE POLICY "Students Auth Full" ON students FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Questions Public Read" ON questions FOR SELECT TO public USING (true);
CREATE POLICY "Questions Auth Full" ON questions FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Interviews Public Read" ON interviews FOR SELECT TO public USING (true);
CREATE POLICY "Interviews Auth Full" ON interviews FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Offers Public Read" ON offers FOR SELECT TO public USING (true);
CREATE POLICY "Offers Auth Full" ON offers FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "CRM Public Read" ON crm_interactions FOR SELECT TO public USING (true);
CREATE POLICY "CRM Auth Full" ON crm_interactions FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "FollowUps Public Read" ON follow_ups FOR SELECT TO public USING (true);
CREATE POLICY "FollowUps Auth Full" ON follow_ups FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Tasks Public Read" ON tasks FOR SELECT TO public USING (true);
CREATE POLICY "Tasks Auth Full" ON tasks FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Notifications Public Read" ON notifications FOR SELECT TO public USING (true);
CREATE POLICY "Notifications Auth Full" ON notifications FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "WhatsApp Public Read" ON whatsapp_templates FOR SELECT TO public USING (true);
CREATE POLICY "WhatsApp Auth Full" ON whatsapp_templates FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Documents Public Read" ON documents FOR SELECT TO public USING (true);
CREATE POLICY "Documents Auth Full" ON documents FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Events Public Read" ON calendar_events FOR SELECT TO public USING (true);
CREATE POLICY "Events Auth Full" ON calendar_events FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "AuditLogs Public Read" ON audit_logs FOR SELECT TO public USING (true);
CREATE POLICY "AuditLogs Auth Full" ON audit_logs FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Attendance Public Read" ON attendance_records FOR SELECT TO public USING (true);
CREATE POLICY "Attendance Auth Full" ON attendance_records FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- ============================================================================
-- 6. Insert Clean Initial Seed Data (No Duplicates)
-- ============================================================================

-- Colleges Seed
INSERT INTO colleges (
    id, name, college_code, vtu_code, university_code, aishe_code, type, district, state,
    website, established_year, naac_grade, nba_status, tier,
    student_strength, eligible_students_count, branches_available,
    training_mode, status, drives_participated, students_placed
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'R.V. College of Engineering (RVCE)',
    '1RV',
    '1RV',
    '1RV',
    'C-1260',
    'Autonomous',
    'Bengaluru Urban',
    'Karnataka',
    'https://rvce.edu.in',
    1963,
    'A++',
    'Accredited',
    'Tier-1',
    1800,
    580,
    ARRAY['CSE', 'ISE', 'ECE', 'AI & ML', 'Data Science'],
    'Hybrid',
    'Active',
    8,
    412
),
(
    '00000000-0000-0000-0000-000000000002',
    'B.M.S. College of Engineering (BMSCE)',
    '1BM',
    '1BM',
    '1BM',
    'C-1262',
    'Autonomous',
    'Bengaluru Urban',
    'Karnataka',
    'https://bmsce.ac.in',
    1946,
    'A++',
    'Accredited',
    'Tier-1',
    2100,
    640,
    ARRAY['CSE', 'ISE', 'ECE', 'EEE', 'Mechanical'],
    'Offline Campus',
    'Active',
    7,
    380
),
(
    '00000000-0000-0000-0000-000000000003',
    'Ramaiah Institute of Technology (MSRIT)',
    '1MS',
    '1MS',
    '1MS',
    'C-1258',
    'Autonomous',
    'Bengaluru Urban',
    'Karnataka',
    'https://msrit.edu',
    1962,
    'A+',
    'Accredited',
    'Tier-1',
    1950,
    610,
    ARRAY['CSE', 'ISE', 'ECE', 'AI & Data Engineering'],
    'Hybrid',
    'Active',
    6,
    345
),
(
    '00000000-0000-0000-0000-000000000004',
    'Dayananda Sagar College of Engineering (DSCE)',
    '1DS',
    '1DS',
    '1DS',
    'C-1265',
    'Autonomous',
    'Bengaluru Urban',
    'Karnataka',
    'https://dsce.edu.in',
    1979,
    'A+',
    'Accredited',
    'Tier-2',
    2400,
    720,
    ARRAY['CSE', 'ISE', 'ECE', 'Robotics & Automation'],
    'Hybrid',
    'Active',
    5,
    290
),
(
    '00000000-0000-0000-0000-000000000005',
    'The National Institute of Engineering (NIE)',
    '4NI',
    '4NI',
    '4NI',
    'C-1280',
    'Autonomous',
    'Mysuru',
    'Karnataka',
    'https://nie.ac.in',
    1946,
    'A',
    'Accredited',
    'Tier-2',
    1400,
    420,
    ARRAY['CSE', 'ISE', 'ECE', 'Mechanical', 'Civil'],
    'Hybrid',
    'Active',
    4,
    198
),
(
    '00000000-0000-0000-0000-000000000006',
    'B.V. Bhoomaraddi College of Engineering (KLE Tech)',
    '2BV',
    '2BV',
    '2BV',
    'C-1310',
    'Autonomous',
    'Dharwad (Hubballi)',
    'Karnataka',
    'https://kletech.ac.in',
    1947,
    'A',
    'Accredited',
    'Tier-2',
    1600,
    490,
    ARRAY['CSE', 'ECE', 'Electrical', 'Automobile'],
    'Offline Campus',
    'Active',
    5,
    215
)
ON CONFLICT (college_code) DO NOTHING;

-- CSR Drives Seed
INSERT INTO drives (
    id, drive_code, academic_year, name, category, mode, status,
    current_phase, location, district, state,
    eligible_departments, min_percentage, min_cgpa
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'GQT-CSR-2026-DRV-01',
    '2025-2026',
    'Karnataka State-wide CSR Engineering Drive 2026',
    'CSR Flagship',
    'Hybrid',
    'Registration Open',
    'PHASE_4_STUDENT_REGISTRATION',
    'Bengaluru Zone',
    'Bengaluru Urban',
    'Karnataka',
    ARRAY['CSE', 'ISE', 'ECE', 'AI & ML', 'Data Science'],
    60.00,
    6.50
),
(
    '10000000-0000-0000-0000-000000000002',
    'GQT-CSR-2026-DRV-02',
    '2025-2026',
    'North Karnataka Rural Engineering Uplift CSR Drive',
    'Tier-2/3 Excellence',
    'Offline Campus',
    'Exam Scheduled',
    'PHASE_5_HALL_TICKET_GENERATION',
    'Hubballi-Dharwad Hub',
    'Dharwad (Hubballi)',
    'Karnataka',
    ARRAY['CSE', 'ISE', 'ECE', 'Mechanical', 'Civil'],
    58.00,
    6.00
)
ON CONFLICT (drive_code) DO NOTHING;

-- Students Seed
INSERT INTO students (
    id, student_id, full_name, mobile, email, usn, university, branch, passing_year, cgpa, district, status
) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    'GQT-2026-0001',
    'Aditi Rao',
    '+91 98450 11223',
    'aditi.rao@rvce.edu.in',
    '1RV22CS001',
    'Visvesvaraya Technological University',
    'Computer Science & Engineering',
    2026,
    9.15,
    'Bengaluru Urban',
    'Registered'
),
(
    '20000000-0000-0000-0000-000000000002',
    'GQT-2026-0002',
    'Rohan Kulkarni',
    '+91 98450 44556',
    'rohan.k@bmsce.ac.in',
    '1BM22IS045',
    'Visvesvaraya Technological University',
    'Information Science & Engineering',
    2026,
    8.75,
    'Bengaluru Urban',
    'Registered'
),
(
    '20000000-0000-0000-0000-000000000003',
    'GQT-2026-0003',
    'Bharath Royal',
    '+91 98450 77889',
    'bharath@gmail.com',
    '1RV22CS101',
    'Visvesvaraya Technological University',
    'Computer Science & Engineering',
    2026,
    8.92,
    'Bengaluru Urban',
    'Registered'
)
ON CONFLICT (usn) DO NOTHING;

-- Assessment Questions Seed
INSERT INTO questions (
    category, difficulty, type, question, code_snippet, options, correct_answer, explanation, marks
) VALUES
(
    'Java',
    'Medium',
    'Code Snippet',
    'What is the output of the following Java snippet?',
    'public class Test {\n  public static void main(String[] args) {\n    int x = 5;\n    System.out.println(x++ * ++x);\n  }\n}',
    '["30", "35", "36", "Compilation Error"]'::jsonb,
    1,
    'x++ evaluates to 5 (then x becomes 6). ++x increments x to 7 and evaluates to 7. 5 * 7 = 35.',
    2
),
(
    'SQL',
    'Easy',
    'MCQ',
    'Which SQL clause is used to filter records resulting from a GROUP BY statement?',
    NULL,
    '["WHERE", "HAVING", "ORDER BY", "FILTER"]'::jsonb,
    1,
    'HAVING clause is applied after GROUP BY aggregation, whereas WHERE filters individual rows prior to grouping.',
    1
),
(
    'Python',
    'Medium',
    'MCQ',
    'What does the expression [x**2 for x in range(5) if x % 2 == 0] produce in Python?',
    NULL,
    '["[0, 4, 16]", "[1, 9]", "[0, 1, 4, 9, 16]", "[4, 16]"]'::jsonb,
    0,
    'Even numbers in range(5) are 0, 2, 4. Their squares are 0, 4, 16.',
    1
);

-- WhatsApp Templates Seed
INSERT INTO whatsapp_templates (name, category, content, placeholders) VALUES
(
    'Drive Registration Open Announcement',
    'Drive Confirmation',
    'Greetings from Global Quest Technologies (GQT)! The Karnataka State-wide CSR Drive 2026 is officially OPEN for {{college_name}} students. Register here: {{registration_link}}. Drive Code: {{drive_code}}',
    ARRAY['college_name', 'registration_link', 'drive_code']
),
(
    'Online Exam Hall Ticket Issued',
    'Exam Reminder',
    'Dear {{student_name}}, your Hall Ticket for GQT CSR Drive {{drive_code}} has been generated! USN: {{usn}}. Your Exam is scheduled on {{exam_date}} at {{exam_time}}.',
    ARRAY['student_name', 'drive_code', 'usn', 'exam_date', 'exam_time']
)
ON CONFLICT (name) DO NOTHING;

-- Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('student-photos', 'student-photos', true),
    ('resumes', 'resumes', true),
    ('offer-letters', 'offer-letters', true),
    ('call-recordings', 'call-recordings', true),
    ('college-documents', 'college-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Auth Users for All 8 Portals
DO $$
DECLARE
    new_user_id UUID;
    user_rec RECORD;
    users_to_create CONSTANT JSONB := '[
      {"email": "admin@globalquesttechnologies.com", "password": "GQT@Admin2026!", "role": "super_admin", "name": "G.R Narendra Reddy", "mobile": "+91 98450 11223"},
      {"email": "rajesh.kumar@globalquesttechnologies.com", "password": "GQT@CSR2026!", "role": "csr_manager", "name": "Rajesh Kumar", "mobile": "+91 98450 22334"},
      {"email": "priya.nair@globalquesttechnologies.com", "password": "GQT@HR2026!", "role": "hr_recruiter", "name": "Priya Nair", "mobile": "+91 98450 33445"},
      {"email": "placement@rvce.edu.in", "password": "GQT@PTO2026!", "role": "pto", "name": "Prof. Chandrasekhar", "mobile": "+91 98450 44556"},
      {"email": "coordinator.cs@rvce.edu.in", "password": "GQT@Faculty2026!", "role": "faculty_coordinator", "name": "Dr. Sunitha Verma", "mobile": "+91 98450 55667"},
      {"email": "principal@rvce.edu.in", "password": "GQT@Principal2026!", "role": "principal", "name": "Dr. K. N. Subramanya", "mobile": "+91 98450 66778"},
      {"email": "bharath@gmail.com", "password": "GQT@Student2026!", "role": "student", "name": "Bharath Royal", "mobile": "+91 98450 77889"},
      {"email": "director@globalquesttechnologies.com", "password": "GQT@Mgmt2026!", "role": "management", "name": "Anand Mahindra", "mobile": "+91 98450 88990"}
    ]'::jsonb;
BEGIN
    FOR user_rec IN SELECT * FROM jsonb_to_recordset(users_to_create) AS (
        email TEXT, password TEXT, role TEXT, name TEXT, mobile TEXT
    )
    LOOP
        SELECT id INTO new_user_id FROM auth.users WHERE email = user_rec.email;

        IF new_user_id IS NULL THEN
            new_user_id := gen_random_uuid();
            INSERT INTO auth.users (
                instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                confirmation_token, email_change, email_change_token_new, recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated',
                user_rec.email, crypt(user_rec.password, gen_salt('bf')), NOW(),
                '{"provider":"email","providers":["email"]}'::jsonb,
                jsonb_build_object('role', user_rec.role, 'name', user_rec.name),
                NOW(), NOW(), '', '', '', ''
            );

            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
            ) VALUES (
                new_user_id, new_user_id,
                jsonb_build_object('sub', new_user_id::text, 'email', user_rec.email),
                'email', user_rec.email, NOW(), NOW(), NOW()
            ) ON CONFLICT DO NOTHING;
        ELSE
            UPDATE auth.users
            SET encrypted_password = crypt(user_rec.password, gen_salt('bf')),
                raw_user_meta_data = jsonb_build_object('role', user_rec.role, 'name', user_rec.name),
                email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
                updated_at = NOW()
            WHERE id = new_user_id;

            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
            ) VALUES (
                new_user_id, new_user_id,
                jsonb_build_object('sub', new_user_id::text, 'email', user_rec.email),
                'email', user_rec.email, NOW(), NOW(), NOW()
            ) ON CONFLICT DO NOTHING;
        END IF;

        INSERT INTO public.user_profiles (
            id, auth_user_id, full_name, email, mobile, role, status, two_factor_enabled
        ) VALUES (
            'usr-' || encode(digest(user_rec.email, 'sha1'), 'hex'),
            new_user_id, user_rec.name, user_rec.email, user_rec.mobile, user_rec.role, 'active', false
        )
        ON CONFLICT (email) DO UPDATE
        SET auth_user_id = EXCLUDED.auth_user_id,
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            mobile = EXCLUDED.mobile,
            status = 'active',
            updated_at = NOW();
    END LOOP;
END $$;

-- Reload Supabase Schema Cache
NOTIFY pgrst, 'reload schema';
