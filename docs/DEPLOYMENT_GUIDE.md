# Global Quest Technologies (GQT) CSR Drive Platform
## Production Deployment Guide (Vercel & Supabase Cloud)

---

## 1. Overview
This guide provides step-by-step instructions for deploying the GQT CSR Platform to production using:
- **Vercel** for the Next.js 15 App Router frontend and serverless route handlers.
- **Supabase Cloud** for PostgreSQL 15+, Auth, Row Level Security, Realtime WebSockets, Storage, and Edge Functions.

---

## 2. Environment Variables Checklist
Configure these in the Vercel Project Settings under **Settings > Environment Variables**:

| Variable Name | Environment | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Supabase project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Public anon key for browser requests |
| `SUPABASE_SERVICE_ROLE_KEY` | Production Only | Secret service role key for Edge Functions and Admin APIs |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical domain (`https://csr.globalquesttechnologies.com`) |
| `CRON_SECRET` | Production | Bearer token for Vercel Cron verification |
| `SMTP_HOST` | Production | Outbound email host (`smtp.sendgrid.net` or `smtp.gmail.com`) |
| `SMTP_PORT` | Production | `587` |
| `SMTP_USER` | Production | SMTP username |
| `SMTP_PASSWORD` | Production | SMTP password or API token |
| `WHATSAPP_API_URL` | Production | `https://graph.facebook.com/v21.0` |
| `WHATSAPP_API_TOKEN` | Production | Meta WhatsApp Cloud API permanent system user token |

---

## 3. Database Migration Deployment
Apply the database migrations to your Supabase PostgreSQL instance:

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link your project
supabase link --project-ref your-project-ref

# 4. Push all migrations
supabase db push

# 5. Execute production seed script
supabase db execute --file supabase/seed/production_seed.sql
```

Alternatively, open the **Supabase Dashboard > SQL Editor** and execute:
1. `supabase/migrations/20260401_enterprise_schema_v2.sql`
2. `supabase/seed/production_seed.sql`
3. `supabase/storage/buckets_and_policies.sql`
4. `supabase/views/enterprise_views.sql`

---

## 4. Deploying Supabase Edge Functions
Deploy all 11 production edge functions using the Supabase CLI:

```bash
supabase functions deploy evaluate_exam
supabase functions deploy generate_offer_pdf
supabase functions deploy send_notification
supabase functions deploy send_email
supabase functions deploy send_whatsapp
supabase functions deploy create_activity
supabase functions deploy calculate_statistics
supabase functions deploy generate_scorecard
supabase functions deploy generate_certificate
supabase functions deploy archive_drive
supabase functions deploy schedule_reminders
```

---

## 5. Vercel Cron Configuration (`vercel.json`)
The platform includes automated daily reminders, backups, and maintenance cleanup. Configure `vercel.json` in your repository root:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/backup",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 3 * * 0"
    }
  ]
}
```

---

## 6. Verification Checklist
After deploying:
1. Verify `/api/health` returns `HTTP 200` with `status: "healthy"`.
2. Confirm all 11 storage buckets appear in the Supabase Storage console.
3. Verify Realtime replication is enabled for `notifications`, `interviews`, `offer_letters`, and `exam_results`.
4. Test candidate login, test submission, and offer acceptance.
