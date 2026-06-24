# API Guidelines

## Client Location

All API interaction lives in `src/lib/api/`:

- `auth.ts` — login, register, refresh, logout, password reset, OAuth
- `patient.ts` — patient records, profile
- `doctor.ts` — doctor profile, linked patients
- `admin.ts` — logs, correlation traces

## Cookie-Based Auth

- The frontend never reads the JWT access token.
- All API calls must include `credentials: "include"` so cookies are sent automatically.
- The TanStack Query client handles 401 responses by calling the refresh endpoint and retrying the original request.

## Refresh Flow

1. Any API call returning `401` triggers `POST /api/auth/refresh`.
2. If refresh succeeds, retry the original call.
3. If refresh fails, redirect the user to `/login`.

## Error Handling

- Surface backend errors using the message returned by the API.
- For `409 Conflict` on duplicate `LinkRequest`s, show a clear message instead of a generic error toast.
- Never expose sensitive tokens or credentials in UI error messages.

## Type Safety

- Keep TypeScript interfaces for API request/response shapes in `src/types/`.
- Reuse the exact naming from the backend contracts.
