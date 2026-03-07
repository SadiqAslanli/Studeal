# Project Constraints and Decisions

## Globals
- `@zhmdff/auth-react` for Authentication
- `LanguageProvider` for I18n

## Components
- `ClientLayoutWrapper`: Route protection and layout management

## Decision Log
- **2026-03-07**: Integrated @zhmdff/auth-react package. Migrated from local localStorage-based auth to backend-driven auth with silent refresh. Established AuthContext.tsx as a bridge to maintain compatibility with Studeal-specific metadata (points, favorites).
- **2026-03-07**: Fixed registration payload validation error by changing `email` field to `identifier` to match backend requirements.
- **2026-03-07**: Updated registration flow to redirect to `/login` after successful registration. Added real-time password validation UI (8 chars, 1 upper, 1 symbol) to the registration form.
- **2026-03-07**: Added password visibility toggle (eye icon) to both Login and Register pages.
- **2026-03-07**: Removed `username` field from registration payload as requested; the backend now uses `identifier` and `fullName` exclusively for user creation.
