# GQT CSR Platform — Supabase Architecture & ER Overview

## Core Design Principles
1. **Strongly Typed**: All entity records use UUID primary keys with foreign key integrity.
2. **Auditable**: `created_at`, `updated_at`, `deleted_at` are tracked across all operational entities.
3. **Resilient Data**: Text-based normalized status values ensure no `22P02` enum casting errors across Next.js SSR / API payloads.
4. **Zero-Trust RLS**: Policies enforce strict tenant isolation so students only access their own records, HR only evaluates assigned colleges/drives, and Super Admins retain global governance.
5. **Realtime WebSockets**: Change Data Capture (CDC) replication enabled on `notifications`, `interviews`, `offer_letters`, and `exam_results`.
