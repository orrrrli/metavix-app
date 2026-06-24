# Coding Standards

## Framework Notes

- This is **Next.js 16 / React 19**. Do not assume behavior from Next.js 14/15.
- Read `node_modules/next/dist/docs/` before using any Next.js API.
- Heed deprecation notices.

## Data Fetching

- **All server state goes through TanStack Query v5.**
- No raw `fetch` or `axios` calls inside components.
- API client functions live in `src/lib/api/` — one file per resource (`auth.ts`, `patient.ts`, `doctor.ts`, `admin.ts`).
- Never instantiate an API client outside these files.
- Verify query keys do not collide across route groups. Patient views (`(patient)/`) and doctor views (`(doctor)/`) share types but must use separate query keys.

## State Management

- **Zustand v5** is used only for auth session data and cross-cutting UI state.
- Auth session stores `userId`, `role`, and `fullName` only.
- Patient ID must always come from the Zustand auth store — never trust URL params alone for authorization.

## Forms

- Use **React Hook Form v7** + **Zod v4** for validation.
- Keep form schemas close to the components that use them.

## Styling & UI

- Use **Tailwind CSS v4** + **shadcn/ui (Base UI)**.
- Keep components mobile-first; patient-facing pages are frequently used on mobile.
- Use Framer Motion for transitions, but respect `prefers-reduced-motion`.

## Security

- **Auth is cookie-based.** Never store the JWT in `localStorage` or JS memory.
- A doctor can only view a patient's records if a `LinkRequest` between them has `status: Accepted`.
- A patient can only read and write their own records.
- Handle API `409` conflicts on duplicate pending link requests with clear user-facing messages.

## Domain Vocabulary

Use the exact names from the domain model in code, variables, and comments:

- `Patient`, `Doctor`, `Admin`
- `DailyRecord`, `LabRecord`
- `LinkRequest`
- `GlucosaReading` *(pending API implementation)*
- `ClinicalFlags` *(pending API implementation)*

Never invent synonyms.

## Known API Gaps

The following frontend form schemas exist but must NOT be submitted until the API endpoints are built:

- `glucosas_comidas` — glucose readings array on `DailyRecord`.
- `embarazada` — clinical flag on patient record.

Disable or visually defer submission of these sections and document the gap clearly in the component.
