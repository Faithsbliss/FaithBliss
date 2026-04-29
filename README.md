# Faithbliss Deployment Runbook

## Repositories and apps
- Frontend app root: `frontend (1)`
- Backend app root: `backend (1)`

## Setup
1. Create `.env` files from examples:
   - `frontend (1)/.env.example`
   - `frontend (1)/.env.production.example`
   - `backend (1)/.env.example`
2. Install dependencies:
   - `pnpm install` in `frontend (1)`
   - `pnpm install` in `backend (1)`

## Firebase
- Run `pnpm firebase:sync` in `frontend (1)` to generate `src (1)/config/firebase.generated.json`.
- Configure Firebase Hosting with `firebase.json` from project root.

## Vercel
- Connect `frontend (1)` as the project root in Vercel.
- Build command: `pnpm build`
- Output directory: `dist`
- Add all `VITE_*` environment variables from `.env.production.example`.

## Backend runtime requirements
- Required: `MONGO_URI`
- Recommended: `CLIENT_URL`, `PUBLIC_APP_URL`, `CORS_ALLOWED_ORIGINS`, `JWT_SECRET`
