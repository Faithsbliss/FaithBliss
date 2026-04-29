# Faithbliss Deployment Runbook

## Canonical application roots
- Frontend app root: `faith-bliss-client`
- Backend app root: `faith-bliss-server`

Do not deploy `frontend (1)` or `backend (1)`; those are legacy/partial copies.

## Local setup
1. Create env files from templates:
   - `faith-bliss-client/.env.example` -> `faith-bliss-client/.env`
   - `faith-bliss-server/.env.example` -> `faith-bliss-server/.env`
2. Install dependencies:
   - `pnpm install` in `faith-bliss-client`
   - `pnpm install` in `faith-bliss-server`
3. Verify builds:
   - `pnpm build` in `faith-bliss-client`
   - `pnpm build` in `faith-bliss-server`

## Firebase
- Client project currently targets `faithbliss-79c63`.
- Ensure all `VITE_FIREBASE_*` variables are set in frontend env.
- Add deployed frontend domains in Firebase Auth -> Authorized domains.

## Vercel deployment
- Create two projects in Vercel:
  - Frontend root: `faith-bliss-client`
  - Backend root: `faith-bliss-server`
- Frontend:
  - Build command: `pnpm build`
  - Output directory: `dist`
- Backend:
  - Node version: `22.x`
  - API routes are served from `api/index.ts` via `faith-bliss-server/vercel.json`.

## Production architecture note
- `faith-bliss-server` contains Socket.IO realtime functionality.
- Vercel serverless is suitable for REST API endpoints, but not long-lived websocket servers.
- Host realtime separately (or replace with polling/SSE) for production reliability.
