# HealthOS Service & API Boundaries

All frontend UI components interact exclusively with abstract service modules located in `frontend/src/services/`.

---

## Service Modules Overview

1. **`authService`**: User session lifecycle, login, registration, role verification.
2. **`patientService`**: Patient records, appointments, prescription history.
3. **`hospitalService`**: Hospital profiles, bed/ICU capacity updates, doctor rosters.
4. **`emergencyService`**: SOS dispatching, ambulance telemetry, active emergency queues.
5. **`aiService`**: Provider-agnostic AI symptom assessment, facility recommendations, preventive advice.
6. **`adminService`**: Regional network analytics, hospital licensing, network alerts.
7. **`realtimeService`**: Supabase WebSocket subscriptions for live bed availability and SOS events.
