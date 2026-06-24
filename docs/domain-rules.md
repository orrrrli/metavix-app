# metavix-app - Local Context

> **Instruction for the AI:** This file defines the Domain, Architecture, and Business Rules exclusive to this project. Read it carefully before proposing architectural changes or adding new entities.

---

## 1. Business Overview

- **Purpose:** Metavix is a medical record tracker for patients with diabetes. Patients log daily health data (blood pressure, weight, glucose readings, lab results) and doctors access those records to monitor their patients' progress remotely.
- **Core Users:** Patients (log their own health data), Doctors (review linked patients' records), Admin (monitor system logs).
- **Success Metrics:** Data accuracy is the top priority — this is medical data, stale or incorrect values are unacceptable. Reliability second. Performance third.

---

## 2. Domain Model (Ubiquitous Language)

*The exact vocabulary the AI and developers MUST use in code, variables, and database tables. NEVER invent synonyms.*

- **`Patient`** — registered user with role `Patient` (enum `1`). Logs their own `DailyRecord`s and `LabRecord`s, and sends `LinkRequest`s to doctors.
- **`Doctor`** — registered user with role `Doctor` (enum `0`). Reviews records of `Patient`s who have an accepted `LinkRequest` with them.
- **`Admin`** — registered user with role `Admin` (enum `2`). Has access to structured request logs only.
- **`DailyRecord`** — a patient's daily health entry. Contains: blood pressure (`systolicPressure`, `diastolicPressure`, `heartRate`), anthropometry (`weightKg`, `waistCm`), and free-text `notes`. Does NOT yet include `GlucosaReading` — pending API implementation.
- **`LabRecord`** — a patient's lab results entry. Contains: `hba1c`, `totalCholesterol`, `ldl`, `hdl`, `triglycerides`, `bun`, `creatinine`, and EGO urinalysis (`egoProteins`, `egoGlucose`).
- **`GlucosaReading`** *(pending — API not yet built)* — an individual blood glucose measurement associated with a `DailyRecord`. Fields: `tipo` (meal timing: `ayuno`, `antes_desayuno`, `despues_desayuno`, `antes_comida`, `despues_comida`, `antes_cena`, `despues_cena`, `antes_colacion`, `despues_colacion`, `madrugada`), `valor` (mg/dL, 40–600), `hora`, `alimentos`. Stored as the array `glucosas_comidas` on a `DailyRecord`.
- **`ClinicalFlags`** *(pending — API not yet built)* — boolean flags on a patient record. Currently: `embarazada` (patient is pregnant).
- **`LinkRequest`** — a relationship request from a `Patient` to a `Doctor`. Valid states: `Pending` → `Accepted` | `Rejected` | `Revoked` | `Unlinked`.

---

## 3. Local Architecture and Stack

- **Core Framework:** Next.js 16.2.6 App Router (React 19). ⚠️ Breaking changes from 14/15 — read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
- **Backend:** External REST API — `metavix-api` (ASP.NET Core 9, Clean Architecture). See `../metavix-api/docs/api-guidelines.md` for full reference.
- **Auth:** JWT issued by the API. Sent automatically via HTTP-Only cookies. Non-sensitive session data (`userId`, `role`, `fullName`) stored in Zustand for routing and UI decisions only.

  **Token flow:**
  - `access_token` cookie — JWT, 15 min, HttpOnly, Secure, SameSite=None
  - `refresh_token` cookie — opaque token, 7 days, HttpOnly, Secure, SameSite=None. Stored in DB to allow revocation.
  - On login → both cookies are set (`AuthModule.cs` → `POST /api/auth/login`)
  - On 401 → frontend automatically calls `POST /api/auth/refresh` with the refresh token cookie
  - If refresh valid → new access token issued, original request retried transparently
  - If refresh expired (7 days inactive) → redirect to login
  - On logout → both cookies cleared + refresh token revoked in DB

  **Cookie SameSite=None** — required while frontend (`metavix.com.mx`) and API (`api.metavix.com.mx`) are on different subdomains. Change to `SameSite=Lax` only when both are on the exact same domain.
- **UI / Styling:** Tailwind CSS v4 + shadcn/ui (Base UI) + Framer Motion
- **Data Fetching:** TanStack Query v5 — all server state goes through Query. No raw `fetch` calls inside components.
- **Forms:** React Hook Form v7 + Zod v4
- **Global State:** Zustand v5 — only for auth session data and cross-cutting UI state
- **Charts:** Recharts v3
- **PDF Export:** html2pdf.js
- **Toasts:** Sonner

---

## 3.1. Infrastructure

- **Domain:** `metavix.com.mx`
- **Frontend:** VPS propio (Linux VPS pendiente — actualmente en desarrollo local). Deployment destino: `metavix.com.mx`
- **Backend API:** Azure Container Apps (`metavix-api`, East US)
  - URL de producción: `https://metavix-api.salmonmeadow-d6ed026c.eastus.azurecontainerapps.io`
  - Subdominio planeado: `api.metavix.com.mx`
  - CI/CD: GitHub Actions en `orrrrli/metavix-api` — deploy automático en push a `main`
  - Registry: Azure Container Registry (`metavixacr.azurecr.io`)
  - Escala a 0 réplicas cuando no hay tráfico
- **Database:** PostgreSQL en VPS Windows propio (IP: 45.126.208.213, puerto 5432)
  - Migración pendiente a VPS Linux cuando esté disponible
- **Frontend env:** `NEXT_PUBLIC_API_URL` apunta a la URL de Azure en producción
- **Cookie cross-origin:** `SameSite=None` mientras frontend y API estén en dominios distintos. Cambiar a `SameSite=Lax` cuando ambos estén bajo `metavix.com.mx`

---

## 4. Strict Business Rules

*Rules the code must never break under any circumstances.*

1. **Patient data isolation:** A patient can only read and write their own records. Always derive the patient ID from the authenticated Zustand session — never trust URL params alone for authorization.
2. **Doctor access requires an accepted link:** A doctor can only view a patient's records if a `LinkRequest` between them has `status: Accepted`. Never display patient data without a confirmed link.
3. **One pending request per doctor:** A patient can only have one pending `LinkRequest` per doctor at a time. The API returns `409` on duplicates — handle it with a clear user-facing message, not a generic error.

---

## 5. Directory Structure

- `src/app/(auth)/` — public pages: login, register
- `src/app/(patient)/` — patient dashboard and features (record logging, linked doctors, link requests)
- `src/app/(doctor)/` — doctor dashboard and patient record review
- `src/app/(admin)/` — admin panel (log viewer)
- `src/lib/api/` — typed API client functions (one file per resource: `auth.ts`, `patient.ts`, `doctor.ts`, `admin.ts`)
- `src/stores/` — Zustand stores
- `src/types/` — shared TypeScript interfaces and types

---

## 6. Known API Gaps (Pending in metavix-api)

These features have frontend form schemas ready but MUST NOT be submitted to the API until the corresponding endpoints are built:

- **`glucosas_comidas`** — glucose readings array on `DailyRecord`. No endpoint exists yet.
- **`embarazada`** — clinical flag on patient record. No endpoint exists yet.

When implementing forms that include these fields, disable or visually defer submission of these sections and document the gap clearly in the component.

---

## 6.1. Security Technical Debt

### `GET /api/auth/me` — missing session rehydration endpoint

**What:** The backend has no endpoint that returns the current user's identity (`userId`, `patientId`, `doctorId`, `role`) derived from the JWT in the `access_token` cookie — without requiring those IDs as URL path parameters.

**Why it matters (security):** Because this endpoint doesn't exist, the frontend is forced to persist `patientId` and `doctorId` in Zustand's `localStorage` storage (key: `ram-med-auth`). This means those IDs survive page reloads but also survive XSS attacks — any injected script can read them. The real `access_token` is safe (HttpOnly cookie), but the entity IDs are exposed.

**Why it's deferred:** Removing the IDs from `localStorage` without a rehydration endpoint breaks the entire patient and doctor portals on every page reload, since all TanStack Query hooks require `patientId`/`doctorId` to be set before they can fire. The fix requires a backend change first.

**Backend implementation:** Add a minimal endpoint to `AuthModule.cs` that reads `ICurrentUserService` (already exists in the Application layer) and returns the identity claims embedded in the current JWT:

```
GET /api/auth/me
→ 200 { userId, patientId, doctorId, role, fullName, email }
→ 401 if no valid access_token cookie
```

**Frontend fix (after backend is ready):**
1. Add `GET /api/auth/me` to `src/lib/api/auth.ts`
2. Call it once on app load inside `src/shared/components/providers.tsx`
3. Pass the result to `useAuthStore().setSession()`
4. In the Zustand store, limit `partialize` to only persist `role` and `fullName` — the rest rehydrates from the API on load

---

## 7. Memory and Decisions (ADRs)

- Architectural decisions for this project (why we chose X over Y) are documented in **Obsidian**.
- If you need deep context about an old bug or an infrastructure decision, use the `obsidian-vault` skill to consult the notes associated with this project.
