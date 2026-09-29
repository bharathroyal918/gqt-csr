-- ============================================================================
-- GQT CSR DRIVE PLATFORM - SEED SUPABASE AUTH USERS & PROFILES
-- File: supabase/create_auth_users.sql
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- It securely creates the 8 role accounts in auth.users and links public.user_profiles
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    new_user_id UUID;
    user_rec RECORD;
    users_to_create CONSTANT JSONB := '[
      {
        "email": "admin@globalquesttechnologies.com",
        "password": "GQT@Admin2026!",
        "role": "super_admin",
        "name": "G.R Narendra Reddy",
        "mobile": "+91 98450 11223"
      },
      {
        "email": "rajesh.kumar@globalquesttechnologies.com",
        "password": "GQT@CSR2026!",
        "role": "csr_manager",
        "name": "Rajesh Kumar",
        "mobile": "+91 98450 22334"
      },
      {
        "email": "priya.nair@globalquesttechnologies.com",
        "password": "GQT@HR2026!",
        "role": "hr_recruiter",
        "name": "Priya Nair",
        "mobile": "+91 98450 33445"
      },
      {
        "email": "placement@rvce.edu.in",
        "password": "GQT@PTO2026!",
        "role": "pto",
        "name": "Prof. Chandrasekhar",
        "mobile": "+91 98450 44556"
      },
      {
        "email": "coordinator.cs@rvce.edu.in",
        "password": "GQT@Faculty2026!",
        "role": "faculty_coordinator",
        "name": "Dr. Sunitha Verma",
        "mobile": "+91 98450 55667"
      },
      {
        "email": "principal@rvce.edu.in",
        "password": "GQT@Principal2026!",
        "role": "principal",
        "name": "Dr. K. N. Subramanya",
        "mobile": "+91 98450 66778"
      },
      {
        "email": "bharath@gmail.com",
        "password": "GQT@Student2026!",
        "role": "student",
        "name": "Bharath Royal",
        "mobile": "+91 98450 77889"
      },
      {
        "email": "director@globalquesttechnologies.com",
        "password": "GQT@Mgmt2026!",
        "role": "management",
        "name": "Anand Mahindra",
        "mobile": "+91 98450 88990"
      }
    ]'::jsonb;
BEGIN
    FOR user_rec IN SELECT * FROM jsonb_to_recordset(users_to_create) AS (
        email TEXT,
        password TEXT,
        role TEXT,
        name TEXT,
        mobile TEXT
    )
    LOOP
        -- Check if user already exists in auth.users
        SELECT id INTO new_user_id FROM auth.users WHERE email = user_rec.email;

        IF new_user_id IS NULL THEN
            new_user_id := gen_random_uuid();
            
            -- Insert into auth.users
            INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                raw_app_meta_data,
                raw_user_meta_data,
                created_at,
                updated_at,
                confirmation_token,
                email_change,
                email_change_token_new,
                recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                new_user_id,
                'authenticated',
                'authenticated',
                user_rec.email,
                crypt(user_rec.password, gen_salt('bf')),
                NOW(),
                '{"provider":"email","providers":["email"]}'::jsonb,
                jsonb_build_object('role', user_rec.role, 'name', user_rec.name),
                NOW(),
                NOW(),
                '',
                '',
                '',
                ''
            );

            -- Insert identity
            INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                provider_id,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                new_user_id,
                new_user_id,
                jsonb_build_object('sub', new_user_id::text, 'email', user_rec.email),
                'email',
                user_rec.email,
                NOW(),
                NOW(),
                NOW()
            ) ON CONFLICT DO NOTHING;

            RAISE NOTICE 'Created auth user % with id %', user_rec.email, new_user_id;
        ELSE
            -- Update password and metadata if user exists
            UPDATE auth.users
            SET encrypted_password = crypt(user_rec.password, gen_salt('bf')),
                raw_user_meta_data = jsonb_build_object('role', user_rec.role, 'name', user_rec.name),
                email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
                updated_at = NOW()
            WHERE id = new_user_id;

            -- Ensure identity exists
            INSERT INTO auth.identities (
                id,
                user_id,
                identity_data,
                provider,
                provider_id,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                new_user_id,
                new_user_id,
                jsonb_build_object('sub', new_user_id::text, 'email', user_rec.email),
                'email',
                user_rec.email,
                NOW(),
                NOW(),
                NOW()
            ) ON CONFLICT DO NOTHING;

            RAISE NOTICE 'Updated existing auth user % with id %', user_rec.email, new_user_id;
        END IF;

        -- Ensure user_profiles row exists and links auth_user_id
        INSERT INTO public.user_profiles (
            id,
            auth_user_id,
            full_name,
            email,
            mobile,
            role,
            status,
            two_factor_enabled
        ) VALUES (
            'usr-' || encode(digest(user_rec.email, 'sha1'), 'hex'),
            new_user_id,
            user_rec.name,
            user_rec.email,
            user_rec.mobile,
            user_rec.role,
            'active',
            false
        )
        ON CONFLICT (email) DO UPDATE
        SET auth_user_id = EXCLUDED.auth_user_id,
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            mobile = EXCLUDED.mobile,
            status = 'active',
            updated_at = NOW();

    END LOOP;
END $$;
