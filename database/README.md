# Database Architecture & Migration Directory

This directory contains all relational database schemas, migrations, seed datasets, storage policies, stored procedures, triggers, views, and inspection scripts for the **Global Quest Technologies (GQT) CSR Drive Platform**.

---

## Directory Structure

```plaintext
database/
├── docs/                # Architecture diagrams, schema references & ER descriptions
│   ├── ARCHITECTURE.md
│   └── DATABASE_SCHEMA.md
├── functions/           # Supabase edge functions & PostgreSQL stored procedures
│   ├── archive_drive/
│   ├── calculate_statistics/
│   ├── create_activity/
│   ├── evaluate_exam/
│   ├── generate_certificate/
│   ├── generate_offer_pdf/
│   ├── generate_scorecard/
│   ├── schedule_reminders/
│   ├── send_email/
│   ├── send_notification/
│   └── send_whatsapp/
├── migrations/          # Version-controlled SQL migration scripts
│   ├── 20260322_init_schema.sql
│   ├── 20260401_enterprise_schema_v2.sql
│   └── 20260926_student_exam_portal_v2.sql
├── policies/            # Row Level Security (RLS) policies for multi-role isolation
│   └── rls_policies.sql
├── schema/              # Consolidated table definitions, constraints & TypeScript types
│   ├── database.types.ts
│   └── schema_and_seed.sql
├── scripts/             # Data verification, synchronization & seeding utilities
│   ├── check_data.js
│   ├── check_students.js
│   ├── get_columns.js
│   ├── inspect_int_off.js
│   ├── inspect_schema.js
│   ├── inspect_tables.js
│   ├── seed_exam_questions.js
│   ├── seed_live_sync.js
│   └── test_cols.js
├── seeds/               # Initial demographic, college, question bank & user seeds
│   ├── create_auth_users.sql
│   ├── production_seed.sql
│   └── seed.sql
├── storage/             # Bucket definitions and file access policies
│   └── buckets_and_policies.sql
└── views/               # Analytical views & aggregate reporting definitions
    └── enterprise_views.sql
```

---

## Core Relational Entities

1. **`profiles`**: Multi-role user records (`super_admin`, `csr_manager`, `pto`, `principal`, `hr_recruiter`, `faculty_coordinator`, `management`, `student`).
2. **`csr_drives`**: Drive master records, phase stages, academic year tracking, and status (`Planning`, `Registration`, `Assessment`, `Interview`, `Completed`).
3. **`colleges`**: Partner institutions, district affiliations, MOU status, and tier classification.
4. **`students`**: Registered student candidate demographic, academic, and registration details.
5. **`exam_questions` & `exam_responses`**: MCQ banks, categories (`aptitude`, `technical`, `coding`, `verbal`), and candidate test submissions.
6. **`interviews` & `interview_evaluations`**: Technical & HR interview scheduling, scoring rubrics, and feedback.
7. **`offers`**: Issued candidate offer letters, CTC packages, designations, and acceptance statuses.
8. **`notifications` & `audit_logs`**: System alerts, dispatch logs (in-app, WhatsApp, SMTP), and immutable compliance audit trails.

---

## Migration & Execution Guide

### 1. Apply Schema Migrations
To initialize or update the database schema:
```bash
# Apply initial schema
psql "$DATABASE_URL" -f database/migrations/20260322_init_schema.sql

# Apply enterprise schema updates
psql "$DATABASE_URL" -f database/migrations/20260401_enterprise_schema_v2.sql

# Apply student examination portal updates
psql "$DATABASE_URL" -f database/migrations/20260926_student_exam_portal_v2.sql
```

### 2. Apply Row Level Security (RLS)
```bash
psql "$DATABASE_URL" -f database/policies/rls_policies.sql
```

### 3. Load Seed Datasets
```bash
# Seed auth users & test profiles
psql "$DATABASE_URL" -f database/seeds/create_auth_users.sql

# Seed colleges, drives, and student records
psql "$DATABASE_URL" -f database/seeds/production_seed.sql
```

### 4. Run Seeding Scripts
```bash
# Seed full MCQ examination question bank
node database/scripts/seed_exam_questions.js

# Sync live drive statistics
node database/scripts/seed_live_sync.js
```
