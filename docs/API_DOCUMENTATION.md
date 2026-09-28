# Global Quest Technologies (GQT) CSR Drive Platform
## REST API & Edge Function Documentation

---

## 1. Authentication & Headers
All Next.js REST API routes and Supabase Edge Functions expect standard JSON payloads and support CORS.
- **Client Requests**: Include the active Supabase JWT session cookie or `Authorization: Bearer <user_jwt>`.
- **Admin/Internal Endpoints**: Validate role claims in `profiles` where `role_key = 'super_admin'`.

---

## 2. Next.js API Routes

### `GET /api/health`
Monitors overall system health, PostgreSQL latency, Supabase Auth status, realtime broker connectivity, and storage engine readiness.
- **Response `200 OK`**:
```json
{
  "platform": "Global Quest Technologies CSR Drive Platform",
  "status": "healthy",
  "environment": "production",
  "timestamp": "2026-03-25T10:00:00.000Z",
  "services": {
    "database": { "status": "operational", "latencyMs": 14, "engine": "Supabase PostgreSQL 15.6" },
    "auth": { "status": "operational", "provider": "GoTrue / Supabase Auth", "mfaEnabled": true },
    "storage": { "status": "operational", "buckets": 11, "s3Compatible": true },
    "realtime": { "status": "operational", "activeConnections": 42, "transport": "WebSockets" }
  },
  "system": { "memoryUsageMb": 128, "uptimeSeconds": 86400 }
}
```

### `POST /api/notifications/dispatch`
Dispatches automated multi-channel notifications (In-app realtime broadcast, SMTP email, Meta WhatsApp).
- **Request Body**:
```json
{
  "title": "Interview Shortlist Alert",
  "message": "You have been shortlisted for technical interview round 2.",
  "category": "hr",
  "userId": "usr-stu-01",
  "channels": ["in_app", "whatsapp", "email"]
}
```

### `POST /api/pdf/generate`
Generates digitally verifiable PDF documents.
- **Request Body**:
```json
{
  "documentType": "offer_letter",
  "studentId": "20000000-0000-0000-0000-000000000003",
  "offerId": "off-901"
}
```

### `POST /api/audit`
Appends an immutable audit log entry.
- **Request Body**:
```json
{
  "module": "HR_INTERVIEW",
  "action": "STATUS_OVERRIDE",
  "resourceId": "GQT-2026-0003",
  "oldValue": { "status": "Hold" },
  "newValue": { "status": "Selected" },
  "userEmail": "admin@globalquesttechnologies.com",
  "userRole": "super_admin"
}
```

---

## 3. Supabase Edge Functions Reference

| Function Name | Description | Invocation |
|---|---|---|
| `evaluate_exam` | Computes candidate MCQ scores, validates cutoffs, and sets student status to Qualified or Rejected. | `POST /functions/v1/evaluate_exam` |
| `generate_offer_pdf` | Generates candidate offer letter PDF with QR verification code and uploads to `offer-letters` bucket. | `POST /functions/v1/generate_offer_pdf` |
| `send_notification` | Broadcasts notification to target user or role via Supabase Realtime channel. | `POST /functions/v1/send_notification` |
| `send_whatsapp` | Dispatches outbound WhatsApp message via Meta Cloud API and logs into `whatsapp_messages`. | `POST /functions/v1/send_whatsapp` |
| `send_email` | Sends transactional HTML email via SMTP gateway and logs delivery. | `POST /functions/v1/send_email` |
| `create_activity` | Inserts chronological event into platform activity feed. | `POST /functions/v1/create_activity` |
| `calculate_statistics` | Recalculates analytical views and snapshots statewide metrics. | `POST /functions/v1/calculate_statistics` |
| `generate_scorecard` | Generates candidate PDF test scorecard with section breakdown. | `POST /functions/v1/generate_scorecard` |
| `generate_certificate` | Issues digitally verifiable CSR training completion certificate. | `POST /functions/v1/generate_certificate` |
| `archive_drive` | Freezes completed CSR drive and snapshots candidate outcomes. | `POST /functions/v1/archive_drive` |
| `schedule_reminders` | Evaluates pending registration deadlines and expiring offers. | `POST /functions/v1/schedule_reminders` |
