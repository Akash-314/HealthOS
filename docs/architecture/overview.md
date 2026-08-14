# HealthOS Architecture Overview

## Overview
HealthOS is a unified healthcare technology platform bridging Public Discovery, Patient Care, Hospital Operations, Emergency Operations, Healthcare Authorities, and AI Intelligence.

---

## 🏛️ System Architecture

```text
                                +-------------------+
                                |   Public Users    |
                                +---------+---------+
                                          |
                                          v
+------------------+           +----------+----------+           +--------------------+
|  Patient Portal  | <-------> |   HealthOS Router   | <-------> | Hospital Dashboard |
+------------------+           +----------+----------+           +--------------------+
                                          |
                                          v
                               +----------+----------+
                               |  Authority & Admin  |
                               +----------+----------+
                                          |
               +--------------------------+--------------------------+
               |                                                     |
               v                                                     v
   +-----------+-----------+                             +-----------+-----------+
   |   FastAPI Microservice|                             |   Supabase Cloud DB / DB  |
   +-----------+-----------+                             +-----------+-----------+
               |                                                     |
               v                                                     v
   +-----------+-----------+                             +-----------+-----------+
   | AI Intelligence Boundary|                           | Realtime Event Channels   |
   +-----------------------+                             +-----------------------+
```

---

## 🔑 Role & Security Isolation
- **Public**: Unauthenticated discovery of hospitals and emergency numbers.
- **Patient**: Personal dashboard, appointment booking, AI symptom checker, personal health records.
- **Hospital**: Bed & ICU management, doctor rosters, emergency triage, capacity analytics.
- **Authority / Admin**: Regional capacity monitoring, emergency load, network-wide health alerts.

Strict route guards (`ProtectedRoute` & `RoleGuard`) guarantee layout isolation across roles.
