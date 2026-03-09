# Project Constraints and Decisions

## Globals
- **Auth**: Supabase (connect on your own). `AuthContext` is standalone; use `loginWithUser(user)` to set the current user from your Supabase session.
- `LanguageProvider` for I18n

## Components
- `ClientLayoutWrapper`: Route protection and layout management

## Decision Log
- **2026-03-09**: Removed `@zhmdff/auth-react`. Auth is now standalone in `AuthContext.tsx`; login/register are no-ops until Supabase is wired. Use `loginWithUser(mappedUser)` when you have a Supabase session.
- **2026-03-07**: Fixed registration payload validation error by changing `email` field to `identifier` to match backend requirements.
- **2026-03-07**: Updated registration flow to redirect to `/login` after successful registration. Added real-time password validation UI (8 chars, 1 upper, 1 symbol) to the registration form.
- **2026-03-07**: Added password visibility toggle (eye icon) to both Login and Register pages.
- **2026-03-07**: Removed `username` field from registration payload as requested; the backend now uses `identifier` and `fullName` exclusively for user creation.
- **2026-03-07**: Enhanced RBAC system to support `SuperAdmin` role. Updated `ClientLayoutWrapper.tsx` to allow Admin/SuperAdmin users access to all routes (including `/`), while maintaining strict isolation for Company users to their dashboard.
