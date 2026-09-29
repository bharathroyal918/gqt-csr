-- ============================================================================
-- GLOBAL QUEST TECHNOLOGIES (GQT) CSR DRIVE PLATFORM
-- ENTERPRISE ROW LEVEL SECURITY (RLS) POLICIES
-- Target: Supabase PostgreSQL 15+
-- ============================================================================

-- Helper Function: Check Current User Role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS VARCHAR AS $$
    SELECT role_key FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- 1. PROFILES POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_full" ON profiles
    FOR ALL USING (current_user_role() = 'super_admin');

-- 2. STUDENTS POLICIES
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_select_own" ON students
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "students_update_own" ON students
    FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "students_staff_view" ON students
    FOR SELECT USING (
        current_user_role() IN ('super_admin', 'csr_manager', 'hr', 'placement_officer', 'principal', 'faculty', 'admission_team', 'management')
    );

CREATE POLICY "students_admin_manage" ON students
    FOR ALL USING (current_user_role() IN ('super_admin', 'csr_manager', 'hr'));

-- 3. EXAM SESSIONS & RESULTS POLICIES
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exam_sessions_student_own" ON exam_sessions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM students s WHERE s.id = exam_sessions.student_id AND s.profile_id = auth.uid())
    );

CREATE POLICY "exam_sessions_staff_view" ON exam_sessions
    FOR SELECT USING (
        current_user_role() IN ('super_admin', 'csr_manager', 'hr', 'faculty')
    );

CREATE POLICY "exam_results_student_view" ON exam_results
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM students s WHERE s.id = exam_results.student_id AND s.profile_id = auth.uid())
    );

CREATE POLICY "exam_results_staff_view" ON exam_results
    FOR ALL USING (
        current_user_role() IN ('super_admin', 'csr_manager', 'hr', 'placement_officer', 'principal', 'management')
    );

-- 4. INTERVIEWS POLICIES
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interviews_student_view" ON interviews
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM students s WHERE s.id = interviews.student_id AND s.profile_id = auth.uid())
    );

CREATE POLICY "interviews_hr_manage" ON interviews
    FOR ALL USING (
        current_user_role() IN ('super_admin', 'csr_manager', 'hr')
    );

CREATE POLICY "interviews_management_view" ON interviews
    FOR SELECT USING (current_user_role() IN ('management', 'principal', 'placement_officer'));

-- 5. OFFER LETTERS POLICIES
ALTER TABLE offer_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offer_letters_student_view" ON offer_letters
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM students s WHERE s.id = offer_letters.student_id AND s.profile_id = auth.uid())
    );

CREATE POLICY "offer_letters_student_accept" ON offer_letters
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM students s WHERE s.id = offer_letters.student_id AND s.profile_id = auth.uid())
    ) WITH CHECK (status IN ('Accepted', 'Rejected'));

CREATE POLICY "offer_letters_staff_all" ON offer_letters
    FOR ALL USING (
        current_user_role() IN ('super_admin', 'csr_manager', 'hr', 'admission_team')
    );

-- 6. ADMISSIONS & BATCHES POLICIES
ALTER TABLE batch_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "batch_public_read" ON batch_master
    FOR SELECT USING (true);

CREATE POLICY "batch_staff_manage" ON batch_master
    FOR ALL USING (
        current_user_role() IN ('super_admin', 'csr_manager', 'admission_team')
    );

-- 7. NOTIFICATIONS POLICIES
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_user_view" ON notifications
    FOR SELECT USING (
        user_id = auth.uid() OR 
        user_id IS NULL OR 
        target_role = current_user_role()
    );

CREATE POLICY "notifications_user_update_read" ON notifications
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (is_read = true);

-- 8. AUDIT LOGS POLICIES
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_super_admin_only" ON audit_logs
    FOR SELECT USING (current_user_role() = 'super_admin');
