-- HealthOS Development Seed Data

INSERT INTO public.hospitals (id, name, license_number, address, total_beds, available_beds, total_icu, available_icu, emergency_contact)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'Central City Memorial Hospital', 'LIC-10029', '100 Medical Center Blvd', 250, 42, 30, 8, '+1-800-555-0199'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'St. Jude General Hospital', 'LIC-10030', '45 Healthcare Plaza', 180, 15, 20, 3, '+1-800-555-0244')
ON CONFLICT DO NOTHING;
