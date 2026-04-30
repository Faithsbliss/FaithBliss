# Faithbliss Deployment Runbook

## Canonical application roots
- Frontend app root: `faith-bliss-client`
- Backend app root: `backend`

Legacy duplicate trees (`frontend (1)`, `backend (1)`, `faith-bliss-server`) have been removed from this repository in favor of the layout above.

## Local setup
1. Create env files from templates:
   - `faith-bliss-client/.env.example` -> `faith-bliss-client/.env`
   - `backend/.env.example` -> `backend/.env`
2. Install dependencies:
   - `pnpm install` in `faith-bliss-client`
   - `pnpm install` in `backend`
3. Verify builds:
   - `pnpm build` in `faith-bliss-client`
   - `pnpm build` in `backend`

## Firebase
- Client project currently targets `faithbliss-79c63`.
- Ensure all `VITE_FIREBASE_*` variables are set in frontend env.
- Add deployed frontend domains in Firebase Auth -> Authorized domains.
- Firebase Hosting from repo root serves `faith-bliss-client/dist` per `firebase.json`.

## Vercel deployment
- Create two projects in Vercel:
  - Frontend root: `faith-bliss-client`
  - Backend root: `backend`
- Frontend:
  - Build command: `pnpm build`
  - Output directory: `dist`
- Backend:
  - Node version: `22.x`
  - API routes are served from `api/index.js` via `backend/vercel.json`.

## Production architecture note
- `backend` contains Socket.IO realtime functionality.
- Vercel serverless is suitable for REST API endpoints, but not long-lived websocket servers.
- Host realtime separately (or replace with polling/SSE) for production reliability.
