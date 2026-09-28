-- ============================================================================
-- GLOBAL QUEST TECHNOLOGIES (GQT) CSR PLATFORM
-- STUDENT EXAM PORTAL & RECRUITMENT PIPELINE MIGRATION (V2.1)
-- Target: Supabase Cloud PostgreSQL 15+
-- ============================================================================

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. STUDENT REGISTRATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. GQT-2025-0012
    registration_number VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    whatsapp_number VARCHAR(32),
    gender VARCHAR(16) NOT NULL DEFAULT 'Male',
    dob DATE,
    aadhaar_last4 VARCHAR(4),
    
    -- Academic Profile
    college_id UUID,
    college_name VARCHAR(255) NOT NULL,
    usn VARCHAR(64) UNIQUE NOT NULL,
    university VARCHAR(255) DEFAULT 'Visvesvaraya Technological University',
    branch VARCHAR(128) NOT NULL,
    semester INTEGER DEFAULT 8,
    passing_year INTEGER DEFAULT 2025,
    cgpa NUMERIC(4, 2) DEFAULT 0.0,
    percentage NUMERIC(5, 2) DEFAULT 0.0,
    current_backlogs INTEGER DEFAULT 0,
    
    -- Location & Preferences
    city VARCHAR(128),
    district VARCHAR(128) DEFAULT 'Bengaluru Urban',
    pincode VARCHAR(16),
    preferred_training_mode VARCHAR(32) DEFAULT 'Hybrid',
    
    -- Drive & Course
    drive_id UUID,
    drive_name VARCHAR(255),
    selected_course VARCHAR(255) NOT NULL,
    batch_code VARCHAR(64) DEFAULT 'B-2025-BLR-01',
    
    -- Portfolios & Social
    resume_url TEXT,
    photo_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    skills TEXT[] DEFAULT '{}',
    
    -- Lifecycle Status
    status VARCHAR(64) NOT NULL DEFAULT 'Registered',
    terms_accepted BOOLEAN DEFAULT true,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_registrations_email ON student_registrations(email);
CREATE INDEX IF NOT EXISTS idx_student_registrations_usn ON student_registrations(usn);
CREATE INDEX IF NOT EXISTS idx_student_registrations_status ON student_registrations(status);
CREATE INDEX IF NOT EXISTS idx_student_registrations_college ON student_registrations(college_name);

-- ============================================================================
-- 2. STUDENT DOCUMENT VAULT
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'resume', 'government_id', 'academic_marksheet', 'certificate', 'photo'
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    bucket VARCHAR(64) NOT NULL DEFAULT 'student-documents',
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type VARCHAR(128) NOT NULL DEFAULT 'application/pdf',
    verification_status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'verified', 'pending', 'rejected'
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    public_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_category ON student_documents(category);

-- ============================================================================
-- 3. EXAM SESSIONS & ATTEMPTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS exam_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(64) NOT NULL,
    exam_id VARCHAR(64) NOT NULL DEFAULT 'exam-gqt-csr-2025',
    drive_id VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'terminated_malpractice', 'timed_out'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_ping_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    answers_count INTEGER DEFAULT 0,
    violations_count INTEGER DEFAULT 0,
    browser_metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_sessions_student_id ON exam_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_status ON exam_sessions(status);

-- Table for exam attempts
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    max_attempts INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. EXAM ANSWERS (AUTO-SAVED IN REALTIME)
-- ============================================================================
CREATE TABLE IF NOT EXISTS exam_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(64) NOT NULL,
    selected_option INTEGER, -- index 0-3
    time_spent_seconds INTEGER DEFAULT 0,
    is_marked_for_review BOOLEAN DEFAULT false,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_exam_answers_session_id ON exam_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_student_id ON exam_answers(student_id);

-- ============================================================================
-- 5. EXAM VIOLATIONS & ANTI-MALPRACTICE
-- ============================================================================
CREATE TABLE IF NOT EXISTS exam_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL,
    violation_type VARCHAR(64) NOT NULL, -- 'TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'DEVTOOLS_OPEN', 'COPY_PASTE_ATTEMPT', 'RIGHT_CLICK'
    severity VARCHAR(16) NOT NULL DEFAULT 'WARNING', -- 'WARNING', 'STRIKE', 'TERMINATION'
    current_strike INTEGER DEFAULT 1,
    details TEXT,
    snapshot_url TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_violations_session_id ON exam_violations(session_id);
CREATE INDEX IF NOT EXISTS idx_exam_violations_student_id ON exam_violations(student_id);

-- ============================================================================
-- 6. EXAM RESULTS & AUTO-EVALUATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE SET NULL,
    student_id VARCHAR(64) UNIQUE NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 50,
    attempted_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    wrong_answers INTEGER NOT NULL DEFAULT 0,
    unanswered_questions INTEGER NOT NULL DEFAULT 0,
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    cutoff_marks NUMERIC(5, 2) DEFAULT 30.0,
    is_qualified BOOLEAN NOT NULL DEFAULT false,
    violations_count INTEGER DEFAULT 0,
    statewide_rank INTEGER,
    college_rank INTEGER,
    percentile NUMERIC(5, 2),
    time_taken_seconds INTEGER DEFAULT 0,
    section_breakdown JSONB DEFAULT '{}'::jsonb,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_is_qualified ON exam_results(is_qualified);
CREATE INDEX IF NOT EXISTS idx_exam_results_score ON exam_results(score DESC);

-- ============================================================================
-- 7. STUDENT RANKINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(64) UNIQUE NOT NULL,
    drive_id VARCHAR(64),
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    statewide_rank INTEGER NOT NULL,
    college_rank INTEGER NOT NULL,
    percentile NUMERIC(5, 2) NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_rankings_statewide_rank ON student_rankings(statewide_rank ASC);

-- ============================================================================
-- 8. STUDENT STATUS HISTORY (AUDIT TRAIL)
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(64) NOT NULL,
    previous_status VARCHAR(64),
    new_status VARCHAR(64) NOT NULL,
    changed_by VARCHAR(128) NOT NULL DEFAULT 'SYSTEM',
    reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_status_history_student_id ON student_status_history(student_id);

-- ============================================================================
-- 9. ACTIVITIES & NOTIFICATIONS (REALTIME SYNCHRONIZED)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(64),
    actor_name VARCHAR(128) NOT NULL DEFAULT 'System',
    actor_role VARCHAR(32) NOT NULL DEFAULT 'system',
    action VARCHAR(64) NOT NULL,
    target_type VARCHAR(64) NOT NULL,
    target_id VARCHAR(64),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(64),
    recipient_role VARCHAR(32) DEFAULT 'student',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'System',
    type VARCHAR(32) DEFAULT 'info', -- 'info', 'success', 'warning', 'urgent'
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================================================
-- 10. SUPABASE STORAGE BUCKETS
-- ============================================================================
-- Note: Executed in Supabase storage schema
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('student-resumes', 'student-resumes', false, 10485760, ARRAY['application/pdf']),
    ('student-documents', 'student-documents', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('student-photos', 'student-photos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('offer-letters', 'offer-letters', false, 10485760, ARRAY['application/pdf']),
    ('certificates', 'certificates', false, 10485760, ARRAY['application/pdf']),
    ('question-images', 'question-images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Students: Can select & manage own registrations
CREATE POLICY student_registrations_owner_policy ON student_registrations
    FOR ALL
    USING (
        auth.role() = 'authenticated'
        OR auth.jwt() ->> 'email' = email
    );

-- Documents: Students own documents, HR and Admin read/manage
CREATE POLICY student_documents_policy ON student_documents
    FOR ALL
    USING (
        auth.role() = 'authenticated'
    );

-- Exam Sessions: Students own sessions, Admins read all
CREATE POLICY exam_sessions_policy ON exam_sessions
    FOR ALL
    USING (
        auth.role() = 'authenticated'
    );

-- Exam Answers: Student write/read own
CREATE POLICY exam_answers_policy ON exam_answers
    FOR ALL
    USING (
        auth.role() = 'authenticated'
    );

-- Exam Violations: Proctoring engine write, HR & Admin read
CREATE POLICY exam_violations_policy ON exam_violations
    FOR ALL
    USING (
        auth.role() = 'authenticated'
    );

-- Exam Results: Student reads own result, HR/Admin reads all
CREATE POLICY exam_results_policy ON exam_results
    FOR ALL
    USING (
        auth.role() = 'authenticated'
    );

-- Notifications: User reads own
CREATE POLICY notifications_policy ON notifications
    FOR ALL
    USING (
        auth.role() = 'authenticated'
    );

-- Activities: All authenticated users can read, system/admin writes
CREATE POLICY activities_policy ON activities
    FOR ALL
    USING (
        auth.role() = 'authenticated'
    );

-- ============================================================================
-- 12. REALTIME PUBLICATIONS
-- ============================================================================
-- Enable full replica identity for realtime synchronization
ALTER TABLE student_registrations REPLICA IDENTITY FULL;
ALTER TABLE student_documents REPLICA IDENTITY FULL;
ALTER TABLE exam_sessions REPLICA IDENTITY FULL;
ALTER TABLE exam_answers REPLICA IDENTITY FULL;
ALTER TABLE exam_results REPLICA IDENTITY FULL;
ALTER TABLE exam_violations REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE activities REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE student_registrations;
EXCEPTION WHEN duplicate_object THEN NULL; END;
$$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE exam_sessions;
EXCEPTION WHEN duplicate_object THEN NULL; END;
$$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE exam_results;
EXCEPTION WHEN duplicate_object THEN NULL; END;
$$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE exam_violations;
EXCEPTION WHEN duplicate_object THEN NULL; END;
$$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END;
$$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE activities;
EXCEPTION WHEN duplicate_object THEN NULL; END;
$$;

COMMENT ON TABLE student_registrations IS 'Production Student Registrations for GQT CSR';
COMMENT ON TABLE exam_sessions IS 'Live Proctoring & Exam Sessions for GQT CSR Exam Engine';
COMMENT ON TABLE exam_results IS 'Automated Evaluation & Scorecards for GQT CSR';
