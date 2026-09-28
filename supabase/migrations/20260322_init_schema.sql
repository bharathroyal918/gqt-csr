-- ============================================================================
-- GQT CSR DRIVE AUTOMATION PLATFORM - ENTERPRISE POSTGRESQL SCHEMA MIGRATION
-- File: supabase/migrations/20260322_init_schema.sql
-- Target Database: Supabase PostgreSQL (Version 15+)
-- Features: Clean Drops, Resilient VARCHAR Statuses, Strict RLS, Realtime
-- ============================================================================

-- 1. Drop Legacy/Conflicting Tables & Enums
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

DROP TYPE IF EXISTS drive_status_type CASCADE;
DROP TYPE IF EXISTS user_role_type CASCADE;
DROP TYPE IF EXISTS drive_phase_code CASCADE;
DROP TYPE IF EXISTS phase_status_type CASCADE;
DROP TYPE IF EXISTS college_tier_type CASCADE;

-- 2. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Core Enterprise Tables
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

CREATE TABLE whatsapp_templates (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(128) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    placeholders TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE ticket_messages (
    id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ticket_id VARCHAR(64) NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
    sender_name VARCHAR(128) NOT NULL,
    sender_role VARCHAR(32) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 4. Enable RLS
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

-- 5. Full Access Policies
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

-- 6. Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('student-photos', 'student-photos', true),
    ('resumes', 'resumes', true),
    ('offer-letters', 'offer-letters', true),
    ('call-recordings', 'call-recordings', true),
    ('college-documents', 'college-documents', true)
ON CONFLICT (id) DO NOTHING;

NOTIFY pgrst, 'reload schema';
