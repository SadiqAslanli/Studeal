# Project Constraints and Decisions

## Globals
- `@zhmdff/auth-react` for Authentication
- `LanguageProvider` for I18n

## Components
- `ClientLayoutWrapper`: Route protection and layout management

## Decision Log
- **2026-03-07**: Integrated `@zhmdff/auth-react` package. Migrated from local localStorage-based auth to backend-driven auth with silent refresh. Established `AuthContext.tsx` as a bridge to maintain compatibility with Studeal-specific metadata (points, favorites).
