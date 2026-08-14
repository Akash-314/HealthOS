# ADR 0001: Part 1 Technical Architecture Foundation

## Status
Accepted

## Context
HealthOS requires a scalable, production-grade codebase capable of supporting 5 distinct user roles across public, patient, hospital, authority, and AI features.

## Decision
1. **Frontend Architecture**: React 19 + React Router 7 + Vite with path alias `@` for clean imports.
2. **Role & Layout Isolation**: 5 distinct layouts (`PublicLayout`, `AuthLayout`, `PatientLayout`, `HospitalLayout`, `AdminLayout`) guarded by `ProtectedRoute` and `RoleGuard`.
3. **Design Tokens**: Standardized clinical palette using CSS custom properties (Slate `#090d16`, Cyan `#0ea5e9`, Emergency Rose `#e11d48`).
4. **Service Abstraction**: Abstract service boundaries (`authService`, `patientService`, `hospitalService`, `aiService`, `realtimeService`) separating UI components from backend data providers.
5. **Database & Realtime**: PostgreSQL / Supabase architecture in `/supabase` with Python FastAPI backend.
