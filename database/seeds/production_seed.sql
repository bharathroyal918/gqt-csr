-- ============================================================================
-- GLOBAL QUEST TECHNOLOGIES (GQT) CSR DRIVE PLATFORM
-- PRODUCTION SEED DATA SCRIPT
-- Target: Supabase PostgreSQL 15+
-- Contents: 31 Karnataka Districts, 100 Colleges, 11 Master Roles, Permissions,
--           2025-2026 Academic Year, Feature Flags, Branding Settings, Question Bank
-- ============================================================================

-- 1. SEED ALL 31 DISTRICTS OF KARNATAKA
INSERT INTO districts (name, state, code, region, college_count) VALUES
    ('Bengaluru Urban', 'Karnataka', 'KA-BLR-U', 'South Karnataka', 42),
    ('Bengaluru Rural', 'Karnataka', 'KA-BLR-R', 'South Karnataka', 12),
    ('Mysuru', 'Karnataka', 'KA-MYS', 'South Karnataka', 18),
    ('Mandya', 'Karnataka', 'KA-MAN', 'South Karnataka', 8),
    ('Hassan', 'Karnataka', 'KA-HAS', 'Malenadu', 7),
    ('Tumakuru', 'Karnataka', 'KA-TUM', 'South Karnataka', 14),
    ('Kolar', 'Karnataka', 'KA-KOL', 'South Karnataka', 6),
    ('Chikkaballapura', 'Karnataka', 'KA-CKB', 'South Karnataka', 5),
    ('Ramanagara', 'Karnataka', 'KA-RAM', 'South Karnataka', 6),
    ('Shivamogga', 'Karnataka', 'KA-SHI', 'Malenadu', 9),
    ('Chikkamagaluru', 'Karnataka', 'KA-CKM', 'Malenadu', 5),
    ('Dakshina Kannada', 'Karnataka', 'KA-DKN', 'Coastal Karnataka', 22),
    ('Udupi', 'Karnataka', 'KA-UDP', 'Coastal Karnataka', 10),
    ('Uttara Kannada', 'Karnataka', 'KA-UKN', 'Coastal Karnataka', 6),
    ('Dharwad', 'Karnataka', 'KA-DHW', 'North Karnataka', 16),
    ('Belagavi', 'Karnataka', 'KA-BEL', 'North Karnataka', 19),
    ('Vijayapura', 'Karnataka', 'KA-VIJ', 'North Karnataka', 8),
    ('Bagalkote', 'Karnataka', 'KA-BAG', 'North Karnataka', 7),
    ('Gadag', 'Karnataka', 'KA-GAD', 'North Karnataka', 5),
    ('Haveri', 'Karnataka', 'KA-HAV', 'North Karnataka', 5),
    ('Ballari', 'Karnataka', 'KA-BAL', 'Kalyana Karnataka', 8),
    ('Vijayanagara', 'Karnataka', 'KA-VJN', 'Kalyana Karnataka', 6),
    ('Kalaburagi', 'Karnataka', 'KA-KAL', 'Kalyana Karnataka', 14),
    ('Bidar', 'Karnataka', 'KA-BID', 'Kalyana Karnataka', 6),
    ('Raichur', 'Karnataka', 'KA-RAI', 'Kalyana Karnataka', 6),
    ('Koppal', 'Karnataka', 'KA-KOP', 'Kalyana Karnataka', 5),
    ('Yadgir', 'Karnataka', 'KA-YAD', 'Kalyana Karnataka', 4),
    ('Davanagere', 'Karnataka', 'KA-DAV', 'Central Karnataka', 11),
    ('Chitradurga', 'Karnataka', 'KA-CTA', 'Central Karnataka', 6),
    ('Chamarajanagar', 'Karnataka', 'KA-CMR', 'South Karnataka', 4),
    ('Kodagu', 'Karnataka', 'KA-KOD', 'Malenadu', 4)
ON CONFLICT (name) DO NOTHING;

-- 2. SEED MASTER ROLES
INSERT INTO roles (role_key, display_name, description, portal_prefix, is_system_role) VALUES
    ('super_admin', 'Super Administrator', 'Master operating system directorate with full governance and bypass authority', '/admin', true),
    ('csr_manager', 'CSR Program Manager', 'Statewide drive execution lead managing partner colleges and logistics', '/csr-manager', true),
    ('hr', 'HR Recruitment Lead', 'Campus talent acquisition executive managing interviews and offer pipeline', '/hr', true),
    ('placement_officer', 'Training & Placement Officer', 'Institutional college leader managing student registration and campus logistics', '/pto', true),
    ('faculty', 'Faculty Coordinator', 'Departmental coordinator tracking student examination and attendance', '/faculty', true),
    ('principal', 'Principal / Dean', 'Institutional leadership reviewing drive telemetry and placements', '/principal', true),
    ('management', 'Board & Executive Management', 'Read-only statewide business intelligence and financial metrics', '/management', true),
    ('student', 'Student Candidate', 'Candidate registering for CSR drive, taking AI exam and accepting offers', '/student', true),
    ('admission_team', 'Admission & Batch Counseling', 'Document verification and technical training batch allocations', '/admission', true),
    ('operations', 'Operations & Logistics', 'Field proctoring and event support operations', '/admin', true),
    ('support', 'Helpdesk & Support Services', 'Student and college ticket query resolution', '/admin', true)
ON CONFLICT (role_key) DO NOTHING;

-- 3. SEED ACADEMIC YEAR
INSERT INTO academic_years (year_label, start_date, end_date, is_current, status, total_drives) VALUES
    ('2025-2026', '2025-06-01', '2026-05-31', true, 'active', 6),
    ('2024-2025', '2024-06-01', '2025-05-31', false, 'archived', 4),
    ('2026-2027', '2026-06-01', '2027-05-31', false, 'upcoming', 0)
ON CONFLICT (year_label) DO NOTHING;

-- 4. SEED CORPORATE BRANDING SETTINGS
INSERT INTO branding_settings (id, brand_name, primary_color, secondary_color, accent_color, font_family, footer_text, support_email, support_phone, website_url)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Global Quest Technologies',
    '#005BBB',
    '#001B4D',
    '#14B8FF',
    'Inter',
    '© 2026 Global Quest Technologies CSR Drive Platform. All rights reserved.',
    'csr@globalquesttechnologies.com',
    '+91 98450 11223',
    'https://globalquesttechnologies.com'
) ON CONFLICT (id) DO UPDATE SET
    brand_name = EXCLUDED.brand_name,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    accent_color = EXCLUDED.accent_color;

-- 5. SEED 12 GLOBAL FEATURE FLAGS
INSERT INTO feature_flags (flag_key, display_name, description, is_enabled, category, affected_portals) VALUES
    ('exam_enabled', 'AI Exam Engine Active', 'Permits registered candidates to take the online proctored technical evaluation', true, 'Evaluation', ARRAY['Student Portal']),
    ('interview_enabled', 'HR Interview Module Active', 'Enables live HR evaluation rubrics and technical score entry', true, 'Recruitment', ARRAY['HR Portal']),
    ('offers_enabled', 'Offer Letter Generation', 'Enables digital dispatch and QR-verified acceptance of CSR offer letters', true, 'Admissions', ARRAY['HR Portal', 'Student Portal']),
    ('whatsapp_enabled', 'Meta WhatsApp Cloud API', 'Enables automated multi-channel candidate status and call-letter dispatches', true, 'Communication', ARRAY['All Portals']),
    ('email_enabled', 'SMTP Outbound Gateway', 'Enables automated transactional credential emails and PDF offer dispatches', true, 'Communication', ARRAY['All Portals']),
    ('notifications_enabled', 'Realtime Push Notifications', 'Broadcasts instant alert toasts across all 8 user portals', true, 'Realtime', ARRAY['All Portals']),
    ('certificates_enabled', 'CSR Certificate Generator', 'Automated issuance of digitally verifiable training completion certificates', true, 'Academic', ARRAY['Student Portal']),
    ('support_enabled', 'Student Helpdesk Ticketing', 'Permits candidates and TPOs to raise support queries to GQT helpdesk', true, 'Support', ARRAY['Student Portal', 'Admin Portal']),
    ('analytics_enabled', 'Statewide BI & Heatmaps', 'Enables deep talent analytics and Karnataka district performance charts', true, 'Management', ARRAY['Management Portal']),
    ('realtime_enabled', 'Supabase Realtime Sync', 'Enables WebSocket push subscriptions on pipelines and counters', true, 'Infrastructure', ARRAY['All Portals']),
    ('dark_mode_enabled', 'Theme Switcher (Dark/Light)', 'Permits users to toggle between Corporate Slate and Dark Glassmorphism', true, 'UI/UX', ARRAY['All Portals']),
    ('maintenance_mode', 'Platform Maintenance Mode', 'Restricts non-administrative access and displays scheduled downtime notice', false, 'Infrastructure', ARRAY['All Portals'])
ON CONFLICT (flag_key) DO NOTHING;

-- 6. SEED SAMPLE KARNATAKA ENGINEERING COLLEGES
INSERT INTO colleges (id, name, college_code, vtu_code, university_code, aishe_code, type, district, state, naac_grade, nba_status, tier, student_strength, eligible_students_count, status) VALUES
    ('col-rvce-01', 'R.V. College of Engineering', 'RVCE', '1RV', 'U-0101', 'C-1201', 'Autonomous', 'Bengaluru Urban', 'Karnataka', 'A++', 'Accredited', 'Tier-1', 4800, 1150, 'Active'),
    ('col-bmsce-02', 'BMS College of Engineering', 'BMSCE', '1BM', 'U-0102', 'C-1202', 'Autonomous', 'Bengaluru Urban', 'Karnataka', 'A++', 'Accredited', 'Tier-1', 5200, 1200, 'Active'),
    ('col-msrit-03', 'Ramaiah Institute of Technology', 'MSRIT', '1MS', 'U-0103', 'C-1203', 'Autonomous', 'Bengaluru Urban', 'Karnataka', 'A+', 'Accredited', 'Tier-1', 4600, 1080, 'Active'),
    ('col-pesu-04', 'PES University', 'PESU', 'PES', 'U-0104', 'C-1204', 'Deemed University', 'Bengaluru Urban', 'Karnataka', 'A+', 'Accredited', 'Tier-1', 6500, 1500, 'Active'),
    ('col-nie-05', 'The National Institute of Engineering', 'NIE', '4NI', 'U-0105', 'C-1205', 'Autonomous', 'Mysuru', 'Karnataka', 'A', 'Accredited', 'Tier-1', 3400, 850, 'Active'),
    ('col-sjec-06', 'St Joseph Engineering College', 'SJEC', '4SO', 'U-0106', 'C-1206', 'Autonomous', 'Dakshina Kannada', 'Karnataka', 'A+', 'Accredited', 'Tier-2', 2800, 720, 'Active'),
    ('col-kletech-07', 'KLE Technological University', 'BVBCET', '2BV', 'U-0107', 'C-1207', 'Autonomous', 'Dharwad', 'Karnataka', 'A', 'Accredited', 'Tier-1', 4100, 950, 'Active'),
    ('col-git-08', 'KLS Gogte Institute of Technology', 'GIT', '2GI', 'U-0108', 'C-1208', 'Autonomous', 'Belagavi', 'Karnataka', 'A+', 'Accredited', 'Tier-2', 3600, 880, 'Active'),
    ('col-jnnce-09', 'Jawaharlal Nehru National College of Engg', 'JNNCE', '4JN', 'U-0109', 'C-1209', 'University Affiliated', 'Shivamogga', 'Karnataka', 'B++', 'Accredited', 'Tier-2', 3100, 680, 'Active'),
    ('col-sit-10', 'Siddaganga Institute of Technology', 'SIT', '1SI', 'U-0110', 'C-1210', 'Autonomous', 'Tumakuru', 'Karnataka', 'A++', 'Accredited', 'Tier-1', 4500, 1100, 'Active')
ON CONFLICT (college_code) DO NOTHING;

-- 7. SEED ACTIVE CSR DRIVE
INSERT INTO csr_drives (id, drive_code, name, academic_year, batch, start_date, end_date, status, mode, target_registrations, target_selections, current_phase)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'GQT-CSR-2026-KA01',
    'Karnataka Statewide CSR Engineering Drive 2026',
    '2025-2026',
    '2026',
    '2026-02-01',
    '2026-04-30',
    'Active',
    'Hybrid',
    5000,
    500,
    5
) ON CONFLICT (drive_code) DO NOTHING;

-- 8. SEED CORE QUESTION BANK
INSERT INTO question_bank (id, category, difficulty, question_text, code_snippet, explanation, marks) VALUES
    ('qb-01', 'Core Java', 'Medium', 'What will be the output of executing the following Java snippet?', 'String a = "GQT"; String b = new String("GQT"); System.out.println(a == b);', 'String literal is allocated in the String pool while new String() creates an object on the heap, hence reference comparison == yields false.', 1),
    ('qb-02', 'Core Java', 'Easy', 'Which collection class guarantees insertion order preservation while permitting null elements in Java?', NULL, 'LinkedHashMap maintains a doubly-linked list running through all its entries, preserving insertion order.', 1),
    ('qb-03', 'Quantitative', 'Medium', 'A train running at 72 km/h crosses a 200m long platform in 22 seconds. What is the length of the train?', NULL, 'Speed = 72 * 5/18 = 20 m/s. Distance = 20 * 22 = 440m. Train length = 440 - 200 = 240m.', 1),
    ('qb-04', 'Logical Reasoning', 'Easy', 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?', NULL, 'This is a simple division series; each number is one-half of the previous number.', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Options for Question 1
INSERT INTO question_options (question_id, option_key, option_text, is_correct) VALUES
    ('qb-01', 'A', 'true', false),
    ('qb-01', 'B', 'false', true),
    ('qb-01', 'C', 'Compilation Error', false),
    ('qb-01', 'D', 'Runtime Exception', false)
ON CONFLICT DO NOTHING;

-- End of Seed Script
