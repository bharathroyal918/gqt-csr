-- ============================================================================
-- GLOBAL QUEST TECHNOLOGIES (GQT) CSR DRIVE PLATFORM
-- ENTERPRISE ANALYTICAL VIEWS
-- Target: Supabase PostgreSQL 15+
-- ============================================================================

-- 1. Selected Candidates with Full Offer Lifecycle
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

-- 2. Qualified Candidates Eligible for HR Technical Interview
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

-- 3. Rejected Candidates Queue
CREATE OR REPLACE VIEW rejected_students_view AS
SELECT 
    s.id AS student_id,
    s.student_id AS student_code,
    s.full_name,
    s.email,
    s.mobile,
    s.college_name,
    s.district,
    d.id AS drive_id,
    d.name AS drive_name,
    rej.rejection_stage,
    rej.rejection_reason,
    rej.rejected_at
FROM rejected_students rej
JOIN students s ON s.id = rej.student_id
JOIN csr_drives d ON d.id = rej.drive_id;

-- 4. Active Drive Students Telemetry View
CREATE OR REPLACE VIEW active_drive_students_view AS
SELECT 
    d.id AS drive_id,
    d.drive_code,
    d.name AS drive_name,
    d.academic_year,
    d.current_phase,
    COUNT(s.id) AS total_enrolled,
    COUNT(CASE WHEN s.status = 'Registered' THEN 1 END) AS count_registered,
    COUNT(CASE WHEN s.status = 'Qualified' THEN 1 END) AS count_qualified,
    COUNT(CASE WHEN s.status = 'Selected' THEN 1 END) AS count_selected,
    COUNT(CASE WHEN s.status = 'Offer Accepted' THEN 1 END) AS count_accepted
FROM csr_drives d
LEFT JOIN students s ON s.id IN (
    SELECT student_id FROM student_registrations WHERE drive_id = d.id
)
GROUP BY d.id, d.drive_code, d.name, d.academic_year, d.current_phase;

-- 5. College Dashboard Summary
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

-- 6. Karnataka District Intelligence Dashboard
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

-- 7. Offer Letter Pipeline Telemetry
CREATE OR REPLACE VIEW offer_dashboard_view AS
SELECT 
    d.name AS drive_name,
    COUNT(o.id) AS total_generated,
    COUNT(CASE WHEN o.status = 'Accepted' THEN 1 END) AS total_accepted,
    COUNT(CASE WHEN o.status = 'Rejected' THEN 1 END) AS total_rejected,
    COUNT(CASE WHEN o.status = 'Expired' THEN 1 END) AS total_expired,
    ROUND(
        (COUNT(CASE WHEN o.status = 'Accepted' THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(o.id), 0)::NUMERIC) * 100, 2
    ) AS acceptance_rate_percentage
FROM csr_drives d
LEFT JOIN offer_letters o ON o.drive_id = d.id
GROUP BY d.name;

-- 8. Examination Performance Overview
CREATE OR REPLACE VIEW exam_dashboard_view AS
SELECT 
    d.name AS drive_name,
    COUNT(er.id) AS total_attempts,
    COUNT(CASE WHEN er.is_qualified THEN 1 END) AS qualified_count,
    COUNT(CASE WHEN NOT er.is_qualified THEN 1 END) AS rejected_count,
    ROUND(AVG(er.score_percentage), 2) AS average_score,
    ROUND(
        (COUNT(CASE WHEN er.is_qualified THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(er.id), 0)::NUMERIC) * 100, 2
    ) AS pass_rate_percentage
FROM csr_drives d
LEFT JOIN exam_results er ON er.drive_id = d.id
GROUP BY d.name;

-- 9. HR Recruiter Velocity & Evaluation Metrics
CREATE OR REPLACE VIEW hr_dashboard_view AS
SELECT 
    p.full_name AS hr_name,
    p.email AS hr_email,
    COUNT(i.id) AS total_interviews_taken,
    COUNT(CASE WHEN i.status = 'Completed' THEN 1 END) AS completed_interviews,
    COUNT(CASE WHEN i.recommendation = 'Selected' THEN 1 END) AS candidates_selected,
    ROUND(AVG(i.overall_rating), 1) AS average_rating_given
FROM profiles p
LEFT JOIN interviews i ON i.hr_user_id = p.id
WHERE p.role_key IN ('hr', 'hr_recruiter')
GROUP BY p.id, p.full_name, p.email;

-- 10. Management Executive KPI Overview
CREATE OR REPLACE VIEW management_dashboard_view AS
SELECT 
    (SELECT COUNT(*) FROM csr_drives WHERE status = 'Active') AS active_drives_count,
    (SELECT COUNT(*) FROM colleges WHERE status = 'Active') AS active_colleges_count,
    (SELECT COUNT(*) FROM students) AS total_registered_candidates,
    (SELECT COUNT(*) FROM exam_results WHERE is_qualified = true) AS total_exam_qualified,
    (SELECT COUNT(*) FROM selected_students) AS total_hr_selected,
    (SELECT COUNT(*) FROM offer_letters WHERE status = 'Accepted') AS total_confirmed_admissions;
