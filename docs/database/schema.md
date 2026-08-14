# HealthOS Database Schema Specification

The database architecture is designed for PostgreSQL / Supabase with Row Level Security (RLS) enforcement.

---

## Core Entities

- **`profiles`**: User metadata & role assignment (`PUBLIC`, `PATIENT`, `HOSPITAL`, `AUTHORITY`, `ADMIN`).
- **`hospitals`**: Facility details, total/available bed counts, ICU capacity, coordinates.
- **`beds`**: Individual ward bed tracking (`AVAILABLE`, `OCCUPIED`, `RESERVED`, `MAINTENANCE`).
- **`emergencies`**: SOS distress logs, location coordinates, assigned hospital, priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
