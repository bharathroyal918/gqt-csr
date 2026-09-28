# Global Quest Technologies (GQT) CSR Drive Platform
## Backup Strategy, Business Continuity & Disaster Recovery Plan

---

## 1. Objectives & SLAs
- **Recovery Point Objective (RPO)**: < 1 hour for transactional data (exam submissions, interview results, offer acceptances).
- **Recovery Time Objective (RTO)**: < 15 minutes for full database restoration to an alternative region.
- **Data Durability**: 99.999999999% (11 9s) on Supabase S3-compatible storage.

---

## 2. Backup Schedules & Types

| Backup Frequency | Type | Destination | Retention Period |
|---|---|---|---|
| **Continuous (WAL)** | PostgreSQL Point-in-Time Recovery (PITR) | Supabase Managed Storage | 7 Days |
| **Daily (02:00 UTC)** | Full Database Logical Snapshot (`pg_dump`) | `backup-files` Private Bucket | 30 Days |
| **Weekly (Sunday)** | Storage Metadata & Asset Archive | Secondary AWS S3 Bucket | 90 Days |
| **Monthly** | Institutional Audit & Regulatory Archive | Cold Storage (AWS Glacier) | 7 Years |

---

## 3. Automated Backup Verification
Every backup snapshot generates a unique SHA-256 checksum and is logged in the `system_backups` table:
```sql
SELECT backup_code, size_mb, status, checksum_sha256, created_at 
FROM system_backups 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 4. Disaster Recovery & Restoration Procedures

### Scenario A: Accidental Data Corruption / Deletion
1. Open the Super Admin Control Center at `/admin/backup`.
2. Locate the most recent verified snapshot.
3. Select **Selective Restore** and choose affected tables (e.g. `students`, `offer_letters`).
4. Review preview changes and click **Apply Restore**.
5. The restore event is logged in `audit_logs` with the Super Admin's ID and IP address.

### Scenario B: Regional Cloud Outage (Failover)
1. Provision standby Supabase project in alternate region (e.g. `ap-south-1` Mumbai to `ap-southeast-1` Singapore).
2. Restore latest logical dump:
```bash
pg_restore -h db.alt-region.supabase.co -U postgres -d postgres backup_snapshot_latest.dump
```
3. Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
4. Trigger instant zero-downtime redeployment.
