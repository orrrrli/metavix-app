# Architecture

## Stack

- **Framework:** Next.js 16.2.6 App Router (React 19)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Base UI) + Framer Motion
- **Data Fetching:** TanStack Query v5
- **Forms:** React Hook Form v7 + Zod v4
- **Global State:** Zustand v5
- **Charts:** Recharts v3
- **PDF Export:** html2pdf.js
- **Toasts:** Sonner
- **Backend:** External ASP.NET Core REST API (`metavix-api`)

> **Warning:** Next.js 16 has breaking changes compared to v14/v15. Read `node_modules/next/dist/docs/` before using any Next.js API.

## Directory Structure

```
src/
├── app/(auth)/      # Public pages: login, register
├── app/(patient)/   # Patient dashboard and features
├── app/(doctor)/    # Doctor dashboard and patient record review
├── app/(admin)/     # Admin panel (log viewer)
├── lib/api/         # Typed API client functions (one file per resource)
├── stores/          # Zustand stores
└── types/           # Shared TypeScript interfaces and types
```

## Authentication

- JWT is issued by `metavix-api` and stored in HTTP-Only cookies.
- The frontend never reads the JWT.
- Non-sensitive session data (`userId`, `role`, `fullName`) is stored in Zustand.
- Cookie `SameSite=None` is required while frontend and API live on different subdomains.

### Token Flow

1. On login, the API sets `access_token` (15 min) and `refresh_token` (7 days) cookies.
2. On `401`, the frontend automatically calls `POST /api/auth/refresh`.
3. If refresh is valid, a new access token is issued and the original request retries.
4. If refresh is expired, redirect to login.
5. On logout, both cookies are cleared and the refresh token is revoked in the backend.

## Infrastructure

- **Domain:** `metavix.com.mx`
- **Frontend:** VPS propio (Linux VPS pending)
- **Backend API:** Azure Container Apps (`metavix-api`, East US)
- **Database:** PostgreSQL en VPS Windows propio
- **CI/CD:** GitHub Actions deploy automático en push a `main`
