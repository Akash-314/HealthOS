-- ============================================================
-- HEALTHOS BED CAPACITY FORECASTER MIGRATION (00005_bed_capacity_forecaster.sql)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENSURE HOSPITALS HAVE RECOGNIZABLE HEALTHOS IDs
UPDATE public.hospitals
SET healthos_hospital_id = 'HOS-HOSP-CENTRAL'
WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6' OR name LIKE '%Rani Durgavati%' OR name LIKE '%District Central%';

UPDATE public.hospitals
SET healthos_hospital_id = 'HOS-HOSP-CITY'
WHERE id = 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' OR name LIKE '%District Sadar%' OR name LIKE '%City Trauma%';

UPDATE public.hospitals
SET healthos_hospital_id = 'HOS-HOSP-AIIMS'
WHERE id = 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' OR name LIKE '%Shri Ram%' OR name LIKE '%AIIMS%';

-- 2. CREATE / EXTEND BEDS TABLE
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

-- Ensure columns exist if beds table was previously created
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS healthos_hospital_id TEXT;
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS bed_type TEXT DEFAULT 'WARD';

-- 3. CREATE ER ADMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.er_admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    healthos_hospital_id TEXT,
    patient_name TEXT NOT NULL,
    triage_level TEXT NOT NULL DEFAULT 'STANDARD' CHECK (triage_level IN ('CRITICAL', 'URGENT', 'STANDARD')),
    status TEXT NOT NULL DEFAULT 'INCOMING' CHECK (status IN ('INCOMING', 'ADMITTED', 'DISCHARGED')),
    admitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CREATE PLANNED DISCHARGES TABLE
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

-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_beds_hospital_id ON public.beds(hospital_id);
CREATE INDEX IF NOT EXISTS idx_beds_healthos_hospital_id ON public.beds(healthos_hospital_id);
CREATE INDEX IF NOT EXISTS idx_beds_type_status ON public.beds(bed_type, status);
CREATE INDEX IF NOT EXISTS idx_er_admissions_hospital ON public.er_admissions(healthos_hospital_id, status);
CREATE INDEX IF NOT EXISTS idx_planned_discharges_hospital ON public.planned_discharges(healthos_hospital_id, bed_type, status);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_discharges ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR BEDS, ER_ADMISSIONS, PLANNED_DISCHARGES
DROP POLICY IF EXISTS "Beds viewable by everyone" ON public.beds;
CREATE POLICY "Beds viewable by everyone" ON public.beds FOR SELECT USING (true);

DROP POLICY IF EXISTS "Beds updateable by hospital representatives" ON public.beds;
CREATE POLICY "Beds updateable by hospital representatives" ON public.beds FOR ALL USING (true);

DROP POLICY IF EXISTS "ER Admissions viewable by everyone" ON public.er_admissions;
CREATE POLICY "ER Admissions viewable by everyone" ON public.er_admissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "ER Admissions insertable by staff" ON public.er_admissions;
CREATE POLICY "ER Admissions insertable by staff" ON public.er_admissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Planned Discharges viewable by everyone" ON public.planned_discharges;
CREATE POLICY "Planned Discharges viewable by everyone" ON public.planned_discharges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Planned Discharges insertable by staff" ON public.planned_discharges;
CREATE POLICY "Planned Discharges insertable by staff" ON public.planned_discharges FOR ALL USING (true);

-- ============================================================
-- SEED MOCK DATA FOR DEMO HOSPITALS
-- ============================================================

-- Clear previous demo data
DELETE FROM public.beds WHERE healthos_hospital_id IN ('HOS-HOSP-CENTRAL', 'HOS-HOSP-CITY', 'HOS-HOSP-AIIMS');
DELETE FROM public.er_admissions WHERE healthos_hospital_id IN ('HOS-HOSP-CENTRAL', 'HOS-HOSP-CITY', 'HOS-HOSP-AIIMS');
DELETE FROM public.planned_discharges WHERE healthos_hospital_id IN ('HOS-HOSP-CENTRAL', 'HOS-HOSP-CITY', 'HOS-HOSP-AIIMS');

-- 1. SEED BEDS FOR CENTRAL HOSPITAL ('HOS-HOSP-CENTRAL', id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6')
-- 25 ICU Beds (22 OCCUPIED, 3 AVAILABLE)
DO $$
DECLARE
    i INT;
    h_uuid UUID := 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6';
BEGIN
    FOR i IN 1..22 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CENTRAL', 'ICU Ward 1', 'ICU-B' || i, 'ICU', true, 'OCCUPIED');
    END LOOP;
    FOR i IN 23..25 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CENTRAL', 'ICU Ward 1', 'ICU-B' || i, 'ICU', true, 'AVAILABLE');
    END LOOP;

    -- 100 Ward Beds (82 OCCUPIED, 18 AVAILABLE)
    FOR i IN 1..82 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CENTRAL', 'General Ward A', 'WARD-W' || i, 'WARD', false, 'OCCUPIED');
    END LOOP;
    FOR i IN 83..100 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CENTRAL', 'General Ward A', 'WARD-W' || i, 'WARD', false, 'AVAILABLE');
    END LOOP;
END $$;

-- 2. SEED BEDS FOR CITY TRAUMA CENTER ('HOS-HOSP-CITY', id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e')
-- 30 ICU Beds (26 OCCUPIED, 4 AVAILABLE)
DO $$
DECLARE
    i INT;
    h_uuid UUID := 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e';
BEGIN
    FOR i IN 1..26 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CITY', 'Trauma ICU', 'TICU-' || i, 'ICU', true, 'OCCUPIED');
    END LOOP;
    FOR i IN 27..30 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CITY', 'Trauma ICU', 'TICU-' || i, 'ICU', true, 'AVAILABLE');
    END LOOP;

    -- 120 Ward Beds (95 OCCUPIED, 25 AVAILABLE)
    FOR i IN 1..95 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CITY', 'City Ward 1', 'CWARD-' || i, 'WARD', false, 'OCCUPIED');
    END LOOP;
    FOR i IN 96..120 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-CITY', 'City Ward 1', 'CWARD-' || i, 'WARD', false, 'AVAILABLE');
    END LOOP;
END $$;

-- 3. SEED BEDS FOR AIIMS REFERRAL CENTER ('HOS-HOSP-AIIMS', id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f')
-- 50 ICU Beds (44 OCCUPIED, 6 AVAILABLE)
DO $$
DECLARE
    i INT;
    h_uuid UUID := 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f';
BEGIN
    FOR i IN 1..44 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-AIIMS', 'AIIMS ICU Unit', 'AICU-' || i, 'ICU', true, 'OCCUPIED');
    END LOOP;
    FOR i IN 45..50 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-AIIMS', 'AIIMS ICU Unit', 'AICU-' || i, 'ICU', true, 'AVAILABLE');
    END LOOP;

    -- 250 Ward Beds (210 OCCUPIED, 40 AVAILABLE)
    FOR i IN 1..210 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-AIIMS', 'AIIMS Ward 1', 'AWARD-' || i, 'WARD', false, 'OCCUPIED');
    END LOOP;
    FOR i IN 211..250 LOOP
        INSERT INTO public.beds (hospital_id, healthos_hospital_id, ward_name, bed_number, bed_type, is_icu, status)
        VALUES (h_uuid, 'HOS-HOSP-AIIMS', 'AIIMS Ward 1', 'AWARD-' || i, 'WARD', false, 'AVAILABLE');
    END LOOP;
END $$;

-- 4. SEED ER ADMISSIONS (16 incoming for Central, 20 for City, 35 for AIIMS)
INSERT INTO public.er_admissions (hospital_id, healthos_hospital_id, patient_name, triage_level, status) VALUES
-- Central Hospital (16 incoming)
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

-- 5. SEED PLANNED DISCHARGES (4 ICU, 12 Ward for Central)
INSERT INTO public.planned_discharges (hospital_id, healthos_hospital_id, patient_name, bed_type, status) VALUES
-- Central Hospital Discharges
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
