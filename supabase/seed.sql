-- ============================================================================
-- GQT CSR AUTOMATION PLATFORM - SEED DATA SCRIPT
-- Safe Idempotent Execution (ON CONFLICT DO NOTHING to prevent duplicates)
-- ============================================================================

-- 1. Insert Initial Colleges
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
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Initial CSR Drives
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
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Initial Assessment Questions
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

-- 4. Insert Initial WhatsApp Communication Templates
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
