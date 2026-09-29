# Global Quest Technologies (GQT) CSR Drive Platform
## Database Architecture & PostgreSQL Schema Documentation (v2.0 Production)

---

## 1. Architectural Overview
The GQT CSR Drive Platform uses an enterprise multi-tenant PostgreSQL database hosted on Supabase (PostgreSQL 15.6+). All primary keys are UUIDs (`gen_random_uuid()`), and all tables incorporate audit columns (`created_at`, `updated_at`, `created_by`, `deleted_at`) for complete non-destructive soft-delete compliance.

```
                      +------------------+
                      |   auth.users     |
                      +--------+---------+
                               | 1:1
                      +--------v---------+
                      |    profiles      |
                      +--------+---------+
                               |
         +---------------------+---------------------+
         | 1:N                 | 1:N                 | 1:N
+--------v---------+  +--------v---------+  +--------v---------+
|     students     |  |   csr_drives     |  |    colleges      |
+--------+---------+  +--------+---------+  +--------+---------+
         |                     |                     |
         +----------+----------+----------+----------+
                    |                     |
           +--------v---------+  +--------v---------+
           |   exam_sessions  |  |   interviews     |
           +--------+---------+  +--------+---------+
                    |                     |
           +--------v---------+  +--------v---------+
           |   exam_results   |  |  selected_students|
           +------------------+  +--------+---------+
                                          |
                                 +--------v---------+
                                 |  offer_letters   |
                                 +--------+---------+
                                          |
                                 +--------v---------+
                                 |  batch_students  |
                                 +------------------+
```

---

## 2. Master Table Directory (50+ Tables)

### A. Auth, Security & Directory (8 Tables)
1. **`roles`**: System roles (`super_admin`, `csr_manager`, `hr`, `placement_officer`, `faculty`, `principal`, `management`, `student`, `admission_team`, `operations`, `support`).
2. **`permissions`**: 60+ granular permission codes (`drives:create`, `offers:generate`, etc.).
3. **`role_permissions`**: Many-to-many relationship mapping authority codes to roles.
4. **`profiles`**: Multi-tenant user directory linked directly to `auth.users(id)`.
5. **`active_sessions`**: Real-time session tracker recording device type, OS, IP address, and browser fingerprints.
6. **`login_history`**: Audit trail of every login success, failure, and challenge.
7. **`password_resets`**: Secure 24-hour verification token queue.
8. **`audit_logs`**: Immutable forensic log capturing old and new values for every administrative change.

### B. Institutional Academia (7 Tables)
9. **`academic_years`**: Active, upcoming, and archived sessions (e.g. `2025-2026`).
10. **`districts`**: Karnataka's 31 administrative districts with regional classifications.
11. **`colleges`**: Engineering institutions with VTU codes, AISHE codes, NAAC, and NBA accreditations.
12. **`departments`**: Academic branches (CSE, ISE, ECE, AI&ML) within colleges.
13. **`placement_officers`**: Primary and secondary TPO contacts.
14. **`faculty_coordinators`**: Departmental faculty monitoring campus drives.
15. **`principals`**: Institutional heads and dean directory.

### C. CSR Recruitment Drives (7 Tables)
16. **`csr_drives`**: Master recruitment drives with academic year, batch, dates, and eligibility aggregate cutoffs.
17. **`drive_courses`**: Specialized tracks (Java Full Stack, Python AI/ML, Cloud DevOps).
18. **`drive_schedule`**: Standardized 15-phase operational workflow timeline.
19. **`drive_assignments`**: Role assignments (HR recruiters, CSR managers) per drive.
20. **`college_drive_assignments`**: Partner colleges onboarded to specific drives.
21. **`drive_documents`**: Signed MoUs, campus guidelines, and curriculum brochures.
22. **`drive_templates`**: Standard communication and evaluation templates.

### D. Candidates & Profiles (7 Tables)
23. **`students`**: Master candidate records (USN, email, mobile, CGPA, graduation year, district, photo, resume).
24. **`student_profiles`**: Extended biographical and educational backgrounds.
25. **`student_registrations`**: Drive enrollment with course preferences and training mode.
26. **`student_documents`**: Marksheets, Aadhaar ID cards, and degree transcripts.
27. **`student_skills`**: Technical competencies and proficiency ratings.
28. **`student_projects`**: Portfolio projects with GitHub and live URLs.
29. **`student_social_links`**: Developer profiles (LeetCode, HackerRank, LinkedIn).

### E. Examination & AI Proctoring (12 Tables)
30. **`question_bank`**: MCQ questions with code snippets, category, difficulty, and marks.
31. **`question_options`**: 4 multiple choice options per question.
32. **`question_tags`**: Tag taxonomies (`OOPs`, `Recursion`, `Permutations`).
33. **`question_versions`**: Audit history of modified question stems.
34. **`question_papers`**: Master test templates configured with duration and cutoff marks.
35. **`question_paper_questions`**: Questions mapped into specific test papers.
36. **`exam_sessions`**: Live test instances tracking browser fingerprints and start/end times.
37. **`exam_attempts`**: Session heartbeat and question view counts.
38. **`exam_answers`**: Student selections, correctness flag, and time spent per question.
39. **`exam_results`**: Final calculated percentage, qualified status, and generated scorecard PDF.
40. **`exam_violations`**: Real-time AI proctor alerts (multiple faces, tab switches, audio anomalies).
41. **`student_rankings`**: Statewide, district, and college rankings.

### F. Interview & Selection Pipeline (8 Tables)
42. **`interview_slots`**: Time slots created by HR for virtual or campus interviews.
43. **`interviews`**: Scheduled evaluations with technical, communication, and attitude rubrics.
44. **`interview_feedback`**: Granular comments and recommendation logs.
45. **`interview_panel`**: Evaluators mapped to candidate interview rooms.
46. **`selected_students`**: Qualified candidates offered admission into training tracks.
47. **`rejected_students`**: Candidates not meeting cutoff criteria with documented rejection reasons.
48. **`hold_students`**: Candidates placed on temporary waitlist with follow-up dates.
49. **`not_attended_students`**: Absentee registry for campus reconciliation.

### G. Offer Letters & Confirmations (6 Tables)
50. **`offer_templates`**: Corporate offer templates with digital signatures and legal terms.
51. **`offer_letters`**: Generated offer letters with unique codes (`GQT/OFFER/2026/XXXX`) and QR verification.
52. **`offer_status_history`**: State machine transitions (`Generated` $\to$ `Dispatched` $\to$ `Accepted`).
53. **`offer_acceptance`**: Digital signature hashes and IP confirmation stamps.
54. **`offer_rejections`**: Candidate opt-out reasons and feedback.
55. **`offer_documents`**: Signed acceptance agreements.

### H. Admissions & Training Batches (4 Tables)
56. **`batch_master`**: Training batches with trainer name, venue, schedule, and seat capacity.
57. **`batch_students`**: Allocated students with attendance tracking.
58. **`joining_confirmation`**: Checklist verification (original documents, laptop issuance, ID badge).
59. **`admission_verification`**: Final compliance verification by admission leads.

### I. Communication & Notifications (14 Tables)
60. **`notifications`**: In-app alert broadcasts.
61. **`notification_reads`**: Per-user read receipt tracking.
62. **`notification_templates`**: Standard push notification templates.
63. **`announcements`**: Campus and platform banners with priority tiers.
64. **`announcement_views`**: View counters by college and portal.
65. **`crm_calls`**: Outbound calling logs between HR and college placement officers.
66. **`crm_followups`**: Actionable reminder alerts for institutional MoUs.
67. **`crm_meetings`**: Scheduled virtual meetings with college principals.
68. **`communication_timeline`**: Unified chronological interaction history.
69. **`whatsapp_templates`**: Meta WhatsApp Cloud API approved templates.
70. **`email_templates`**: Transactional HTML email layouts.
71. **`whatsapp_messages`**: Outbound WhatsApp message delivery logs and message IDs.
72. **`email_messages`**: Transactional email dispatch history.
73. **`delivery_logs`**: Gateway delivery statuses and webhook receipts.

### J. System & Monitoring (9 Tables)
74. **`branding_settings`**: Corporate logos, color tokens, typography, and footer text.
75. **`platform_settings`**: Global authentication policies, timeouts, and maintenance banner.
76. **`feature_flags`**: 12 global operational feature flags.
77. **`storage_statistics`**: Storage metrics across all 11 buckets.
78. **`system_backups`**: Snapshot registries with SHA-256 integrity checksums.
79. **`system_health_logs`**: Component latency and uptime telemetry.
80. **`integration_settings`**: API credentials for WhatsApp, SMTP, Razorpay, Zoom.
81. **`analytics_snapshots`**: Periodic executive snapshot aggregations.
82. **`activities`**: Real-time platform event feed.

---

## 3. High-Performance Indexing Strategy
To ensure sub-50ms query latencies across tens of thousands of student records:
- **`students(student_id, usn, email)`**: Unique B-tree indexes for instant lookups.
- **`students(college_id, status)`**: Composite index for fast college-level candidate filtering.
- **`exam_results(is_qualified, drive_id)`**: Optimized index for instant selection queue generation.
- **`offer_letters(offer_code)`**: Unique index for sub-10ms public QR code verification lookups.
- **`audit_logs(created_at DESC, module)`**: Time-series index for high-speed audit log searches.
