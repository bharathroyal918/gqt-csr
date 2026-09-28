-- ============================================================================
-- GLOBAL QUEST TECHNOLOGIES (GQT) CSR DRIVE PLATFORM
-- SUPABASE STORAGE BUCKETS & SECURITY POLICIES
-- Target: Supabase Storage S3-Compatible Engine
-- ============================================================================

-- 1. Create All 11 Enterprise Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
    ('student-photos', 'student-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('student-resumes', 'student-resumes', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    ('student-documents', 'student-documents', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
    ('offer-letters', 'offer-letters', false, 10485760, ARRAY['application/pdf']),
    ('question-images', 'question-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml']),
    ('announcement-assets', 'announcement-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
    ('branding-assets', 'branding-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/x-icon']),
    ('certificates', 'certificates', false, 10485760, ARRAY['application/pdf']),
    ('call-recordings', 'call-recordings', false, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg']),
    ('meeting-attachments', 'meeting-attachments', false, 20971520, ARRAY['application/pdf', 'application/zip', 'image/jpeg', 'image/png']),
    ('backup-files', 'backup-files', false, 524288000, ARRAY['application/gzip', 'application/zip', 'application/sql', 'application/json'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Row Level Security (RLS) on storage.objects

-- Student Photos: Publicly readable; authenticated students or admins can upload
CREATE POLICY "Public Read Student Photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'student-photos');

CREATE POLICY "Authenticated Upload Student Photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'student-photos' AND 
        (auth.role() = 'authenticated' OR auth.uid() IS NOT NULL)
    );

-- Student Resumes: Private; only student owner, HR, or Super Admin can read/download
CREATE POLICY "Student Owner Read Resume" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'student-resumes' AND
        (
            (storage.foldername(name))[1] = auth.uid()::text OR
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role_key IN ('super_admin', 'csr_manager', 'hr', 'hr_recruiter')
            )
        )
    );

CREATE POLICY "Student Upload Own Resume" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'student-resumes' AND
        (
            (storage.foldername(name))[1] = auth.uid()::text OR
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role_key = 'super_admin'
            )
        )
    );

-- Offer Letters: Private; student recipient, HR, and Admin can view/download
CREATE POLICY "Offer Letters Access Policy" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'offer-letters' AND
        (
            (storage.foldername(name))[1] = auth.uid()::text OR
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role_key IN ('super_admin', 'csr_manager', 'hr', 'admission_team')
            )
        )
    );

CREATE POLICY "Offer Letters Staff Upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'offer-letters' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role_key IN ('super_admin', 'csr_manager', 'hr')
        )
    );

-- Branding & Announcement Assets: Publicly readable
CREATE POLICY "Branding Public Read" ON storage.objects
    FOR SELECT USING (bucket_id IN ('branding-assets', 'announcement-assets', 'question-images'));

CREATE POLICY "Super Admin Manage Branding" ON storage.objects
    FOR ALL USING (
        bucket_id IN ('branding-assets', 'announcement-assets', 'question-images', 'backup-files') AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role_key = 'super_admin'
        )
    );
