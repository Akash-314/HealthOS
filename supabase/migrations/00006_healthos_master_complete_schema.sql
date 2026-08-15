-- ============================================================
-- HEALTHOS MASTER DATABASE MIGRATION (00006_healthos_master_complete_schema.sql)
-- Complete Schema, Row Level Security (RLS), Triggers & Seed Data for HealthOS
-- Safe for existing databases (adds missing columns automatically)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. CUSTOM ENUM TYPES
-- ============================================================
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('PUBLIC', 'PATIENT', 'HOSPITAL', 'AUTHORITY', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.bed_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.hospital_verification_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.verification_check_status AS ENUM ('VERIFIED', 'NOT_VERIFIED', 'NOT_APPLICABLE', 'NEEDS_MORE_INFORMATION');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.hospital_verification_document_type AS ENUM ('REGISTRATION_CERTIFICATE', 'AUTHORIZATION_DOCUMENT', 'ABDM_DOCUMENT', 'NABH_DOCUMENT', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.hospital_representative_role AS ENUM ('OWNER', 'DIRECTOR', 'HOSPITAL_ADMINISTRATOR', 'AUTHORIZED_REPRESENTATIVE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- ============================================================
-- 2. USER PROFILES TABLE (SECTION 1: PATIENT PROFILE & AUTH)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role public.user_role DEFAULT 'PATIENT'::public.user_role,
    phone_number TEXT,
    age INTEGER,
    gender TEXT,
    blood_group TEXT,
    allergies TEXT,
    conditions TEXT,
    current_medications TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 3. HOSPITALS TABLE (SECTION 2 & 5: HOSPITALS & VERIFICATION)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    healthos_hospital_id TEXT UNIQUE,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    total_beds INT DEFAULT 0,
    available_beds INT DEFAULT 0,
    total_icu INT DEFAULT 0,
    available_icu INT DEFAULT 0,
    emergency_contact TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    verification_status public.hospital_verification_status DEFAULT 'VERIFIED',
    registration_number TEXT,
    registration_authority TEXT,
    registration_state TEXT,
    registration_date DATE,
    registration_expiry_date DATE,
    abdm_facility_id TEXT,
    abdm_verification_status TEXT DEFAULT 'verified',
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by UUID,
    rejection_reason TEXT,
    suspension_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if hospitals table was created previously
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS healthos_hospital_id TEXT;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS verification_status public.hospital_verification_status DEFAULT 'VERIFIED';


-- ============================================================
-- 4. BEDS & CAPACITY FORECASTER TABLES (SECTION 2: CAPACITY & ICU)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    healthos_hospital_id TEXT,
    ward_name TEXT NOT NULL DEFAULT 'Main Ward',
    bed_number TEXT NOT NULL,
    bed_type TEXT NOT NULL DEFAULT 'WARD' CHECK (bed_type IN ('ICU', 'WARD')),
    is_icu BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('OCCUPIED', 'AVAILABLE', 'RESERVED', 'MAINTENANCE')),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAFELY ALTER EXISTING BEDS TABLE TO ADD MISSING COLUMNS
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS healthos_hospital_id TEXT;
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS bed_type TEXT DEFAULT 'WARD';
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS is_icu BOOLEAN DEFAULT FALSE;
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS ward_name TEXT DEFAULT 'Main Ward';

CREATE TABLE IF NOT EXISTS public.er_admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    healthos_hospital_id TEXT,
    patient_name TEXT NOT NULL,
    triage_level TEXT NOT NULL DEFAULT 'STANDARD' CHECK (triage_level IN ('CRITICAL', 'URGENT', 'STANDARD')),
    status TEXT NOT NULL DEFAULT 'INCOMING' CHECK (status IN ('INCOMING', 'ADMITTED', 'DISCHARGED')),
    admitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SAFELY ALTER EXISTING ER ADMISSIONS TABLE
ALTER TABLE public.er_admissions ADD COLUMN IF NOT EXISTS healthos_hospital_id TEXT;

CREATE TABLE IF NOT EXISTS public.planned_discharges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    healthos_hospital_id TEXT,
    patient_name TEXT NOT NULL,
    bed_type TEXT NOT NULL CHECK (bed_type IN ('ICU', 'WARD')),
    expected_discharge_date TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
    status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SAFELY ALTER EXISTING PLANNED DISCHARGES TABLE
ALTER TABLE public.planned_discharges ADD COLUMN IF NOT EXISTS healthos_hospital_id TEXT;


-- ============================================================
-- 5. EMERGENCY SOS & AMBULANCE FLEET (SECTION 3: EMERGENCY SOS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    access_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    requester_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    patient_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_patient_name TEXT,
    guest_patient_age INTEGER,
    guest_patient_gender TEXT,
    guest_patient_phone TEXT,
    guest_emergency_contact_name TEXT,
    guest_emergency_contact_phone TEXT,
    emergency_type TEXT NOT NULL,
    description TEXT,
    is_conscious BOOLEAN DEFAULT TRUE,
    is_breathing_normally BOOLEAN DEFAULT TRUE,
    known_allergies TEXT,
    known_conditions TEXT,
    blood_group TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_accuracy DOUBLE PRECISION,
    address_text TEXT,
    severity TEXT NOT NULL DEFAULT 'HIGH',
    status TEXT NOT NULL DEFAULT 'REQUESTED',
    matched_hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    ambulance_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_hospital_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_request_id UUID REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    match_score DOUBLE PRECISION DEFAULT 0.0,
    distance_km DOUBLE PRECISION DEFAULT 0.0,
    estimated_eta_min INTEGER DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ambulances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    vehicle_number TEXT UNIQUE NOT NULL,
    driver_name TEXT,
    driver_phone TEXT,
    status TEXT NOT NULL DEFAULT 'AVAILABLE',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ambulance_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ambulance_id UUID REFERENCES public.ambulances(id) ON DELETE CASCADE,
    emergency_request_id UUID REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    dispatched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'ASSIGNED'
);

CREATE TABLE IF NOT EXISTS public.emergency_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_request_id UUID REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);


-- ============================================================
-- 6. APPOINTMENTS & PRESCRIPTIONS (SECTION 6: CONSULTATIONS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    qualification TEXT,
    experience_years INT DEFAULT 5,
    consultation_fee NUMERIC(10,2) DEFAULT 500.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    symptoms TEXT,
    status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    medications JSONB NOT NULL DEFAULT '[]'::jsonb,
    diagnosis TEXT,
    instructions TEXT,
    issued_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'LAB_REPORT',
    file_url TEXT,
    notes TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 7. CHATBOT AI ASSISTANT HISTORY (SECTION 4: CHATBOT)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 8. STATUS SYNC TRIGGER FUNCTION FOR HOSPITAL VERIFICATION
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_hospital_verification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.hospitals
    SET
        verification_status = NEW.status,
        verified_at = CASE WHEN NEW.status = 'VERIFIED' THEN COALESCE(NEW.reviewed_at, NOW()) ELSE NULL END,
        verified_by = CASE WHEN NEW.status = 'VERIFIED' THEN NEW.reviewed_by ELSE NULL END,
        rejection_reason = CASE WHEN NEW.status = 'REJECTED' THEN NEW.rejection_reason ELSE NULL END,
        suspension_reason = CASE WHEN NEW.status = 'SUSPENDED' THEN NEW.suspension_reason ELSE NULL END
    WHERE id = NEW.hospital_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_hospital_verification_status_trigger ON public.hospital_verification_applications;
CREATE TRIGGER sync_hospital_verification_status_trigger
AFTER INSERT OR UPDATE OF status, reviewed_at, reviewed_by, rejection_reason, suspension_reason
ON public.hospital_verification_applications
FOR EACH ROW
EXECUTE FUNCTION public.sync_hospital_verification_status();


-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES FOR ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_discharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Read & Write RLS Policies
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert profiles" ON public.profiles;
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update profiles" ON public.profiles;
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public read hospitals" ON public.hospitals;
CREATE POLICY "Public read hospitals" ON public.hospitals FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert hospitals" ON public.hospitals;
CREATE POLICY "Public insert hospitals" ON public.hospitals FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update hospitals" ON public.hospitals;
CREATE POLICY "Public update hospitals" ON public.hospitals FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public read verification applications" ON public.hospital_verification_applications;
CREATE POLICY "Public read verification applications" ON public.hospital_verification_applications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert verification applications" ON public.hospital_verification_applications;
CREATE POLICY "Public insert verification applications" ON public.hospital_verification_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update verification applications" ON public.hospital_verification_applications;
CREATE POLICY "Public update verification applications" ON public.hospital_verification_applications FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public read representatives" ON public.hospital_representatives;
CREATE POLICY "Public read representatives" ON public.hospital_representatives FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert representatives" ON public.hospital_representatives;
CREATE POLICY "Public insert representatives" ON public.hospital_representatives FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read documents" ON public.hospital_verification_documents;
CREATE POLICY "Public read documents" ON public.hospital_verification_documents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert documents" ON public.hospital_verification_documents;
CREATE POLICY "Public insert documents" ON public.hospital_verification_documents FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read beds" ON public.beds;
CREATE POLICY "Public read beds" ON public.beds FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write beds" ON public.beds;
CREATE POLICY "Public write beds" ON public.beds FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read er_admissions" ON public.er_admissions;
CREATE POLICY "Public read er_admissions" ON public.er_admissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write er_admissions" ON public.er_admissions;
CREATE POLICY "Public write er_admissions" ON public.er_admissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read planned_discharges" ON public.planned_discharges;
CREATE POLICY "Public read planned_discharges" ON public.planned_discharges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write planned_discharges" ON public.planned_discharges;
CREATE POLICY "Public write planned_discharges" ON public.planned_discharges FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read emergency_requests" ON public.emergency_requests;
CREATE POLICY "Public read emergency_requests" ON public.emergency_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write emergency_requests" ON public.emergency_requests;
CREATE POLICY "Public write emergency_requests" ON public.emergency_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read ambulances" ON public.ambulances;
CREATE POLICY "Public read ambulances" ON public.ambulances FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read doctors" ON public.doctors;
CREATE POLICY "Public read doctors" ON public.doctors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read appointments" ON public.appointments;
CREATE POLICY "Public read appointments" ON public.appointments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write appointments" ON public.appointments;
CREATE POLICY "Public write appointments" ON public.appointments FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read prescriptions" ON public.prescriptions;
CREATE POLICY "Public read prescriptions" ON public.prescriptions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read medical_records" ON public.medical_records;
CREATE POLICY "Public read medical_records" ON public.medical_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read chat_sessions" ON public.chat_sessions;
CREATE POLICY "Public read chat_sessions" ON public.chat_sessions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write chat_sessions" ON public.chat_sessions;
CREATE POLICY "Public write chat_sessions" ON public.chat_sessions FOR ALL USING (true);

DROP POLICY IF EXISTS "Public read chat_messages" ON public.chat_messages;
CREATE POLICY "Public read chat_messages" ON public.chat_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write chat_messages" ON public.chat_messages;
CREATE POLICY "Public write chat_messages" ON public.chat_messages FOR ALL USING (true);


-- ============================================================
-- 9. PRODUCTION SEED DATA FOR HOSPITALS & BEDS
-- ============================================================

-- Upsert Hospitals
INSERT INTO public.hospitals (id, healthos_hospital_id, name, license_number, address, latitude, longitude, total_beds, available_beds, total_icu, available_icu, emergency_contact, is_active, verification_status)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Rani Durgavati Medical College & District Hospital', 'UP-MED-BDA-9948', 'Kanpur Road, Banda, Uttar Pradesh', 25.4850, 80.3400, 125, 21, 25, 3, '108 / +91 (5192) 220108', true, 'VERIFIED'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'HOS-HOSP-CITY', 'Government District Sadar Hospital Banda', 'UP-MED-BDA-8812', 'Civil Lines, Banda, Uttar Pradesh', 25.4750, 80.3300, 150, 29, 30, 4, '108 / +91 (5192) 222049', true, 'VERIFIED'),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'HOS-HOSP-AIIMS', 'Shri Ram Super Specialty Heart & Maternity Center', 'UP-PVT-BDA-7731', 'Kalu Kuan Road, Banda, Uttar Pradesh', 25.4700, 80.3380, 300, 46, 50, 6, '+91 (5192) 228011', true, 'VERIFIED')
ON CONFLICT (id) DO UPDATE SET
  healthos_hospital_id = EXCLUDED.healthos_hospital_id,
  name = EXCLUDED.name,
  license_number = EXCLUDED.license_number,
  address = EXCLUDED.address,
  total_beds = EXCLUDED.total_beds,
  available_beds = EXCLUDED.available_beds,
  total_icu = EXCLUDED.total_icu,
  available_icu = EXCLUDED.available_icu,
  verification_status = 'VERIFIED';

-- Clear & Re-seed Bed Capacity Data for HOS-HOSP-CENTRAL
DELETE FROM public.beds WHERE hospital_id = 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6';
DELETE FROM public.er_admissions WHERE hospital_id = 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6';
DELETE FROM public.planned_discharges WHERE hospital_id = 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6';

-- Seed 25 ICU Beds & 100 Ward Beds
DO $$
DECLARE
    i INT;
    h_id UUID := 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6';
BEGIN
    FOR i IN 1..22 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_id, 'HOS-HOSP-CENTRAL', 'ICU Ward 1', 'ICU-B' || i, 'ICU', true, 'OCCUPIED');
    END LOOP;
    FOR i IN 23..25 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_id, 'HOS-HOSP-CENTRAL', 'ICU Ward 1', 'ICU-B' || i, 'ICU', true, 'AVAILABLE');
    END LOOP;
    FOR i IN 1..82 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_id, 'HOS-HOSP-CENTRAL', 'General Ward A', 'WARD-W' || i, 'WARD', false, 'OCCUPIED');
    END LOOP;
    FOR i IN 83..100 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_id, 'HOS-HOSP-CENTRAL', 'General Ward A', 'WARD-W' || i, 'WARD', false, 'AVAILABLE');
    END LOOP;
END $$;

-- Seed ER Admissions (16 Patients)
INSERT INTO public.er_admissions (hospital_id, healthos_hospital_id, patient_name, triage_level, status) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Rajesh Sharma', 'CRITICAL', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Priya Verma', 'URGENT', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Amit Patel', 'CRITICAL', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Sneh Lata', 'URGENT', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Vikram Singh', 'CRITICAL', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Ananya Roy', 'STANDARD', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Deepak Kumar', 'URGENT', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Meena Gupta', 'CRITICAL', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Suresh Chandra', 'STANDARD', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Kavita Mishra', 'URGENT', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Rahul Yadav', 'CRITICAL', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Sunita Reddy', 'STANDARD', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Alok Pandey', 'URGENT', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Pooja Saxena', 'CRITICAL', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Manoj Kumar', 'STANDARD', 'INCOMING'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Renu Sharma', 'URGENT', 'INCOMING');

-- Seed Planned Discharges (4 ICU, 12 Ward)
INSERT INTO public.planned_discharges (hospital_id, healthos_hospital_id, patient_name, bed_type, status) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Ramesh Prasad', 'ICU', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Shanti Devi', 'ICU', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Tarun Mehta', 'ICU', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Harish Chandra', 'ICU', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Aarti Singh', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Brijesh Kumar', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Chitra Sharma', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Dinesh Verma', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Ekta Srivastava', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Gautam Adani', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Hemant Tripathi', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Indu Bala', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Jitendra Shah', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Kalyani Roy', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Lalit Mohan', 'WARD', 'PLANNED'),
('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'HOS-HOSP-CENTRAL', 'Manju Rani', 'WARD', 'PLANNED');

-- Seed Doctors
INSERT INTO public.doctors (id, hospital_id, name, specialty, qualification, experience_years, consultation_fee, is_available)
VALUES
('d1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'Dr. Ramesh Kumar', 'Cardiology', 'MD, DM (Cardiology)', 15, 800.00, true),
('d2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'Dr. Sunita Sharma', 'Neurology', 'MD, DM (Neurology)', 12, 750.00, true),
('d3333333-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Dr. Vikram Patel', 'Emergency Medicine', 'MBBS, MEM', 8, 500.00, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Ambulances
INSERT INTO public.ambulances (id, hospital_id, vehicle_number, driver_name, driver_phone, status, latitude, longitude)
VALUES
('f1a1b1c1-d1e1-41f1-a1b1-c1d1e1f1a1b1', 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'UP-90-AMB-1081', 'Ramesh Yadav', '+91 98390 10810', 'AVAILABLE', 25.4840, 80.3390),
('f2a2b2c2-d2e2-42f2-a2b2-c2d2e2f2a2b2', 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'UP-90-AMB-1082', 'Suresh Kumar', '+91 98390 10820', 'AVAILABLE', 25.4860, 80.3410)
ON CONFLICT (id) DO NOTHING;
