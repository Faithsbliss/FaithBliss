# FaithBliss Frontend

This frontend is set up for:

- Web deployment with Vite
- Android builds with Capacitor
- iOS project generation with Capacitor

## Core commands

```powershell
pnpm install
pnpm build
pnpm mobile:prepare
pnpm android:prepare
pnpm ios:prepare
```

## Capacitor commands

```powershell
pnpm cap:add:android
pnpm cap:add:ios
pnpm cap:sync
pnpm cap:open:android
pnpm cap:open:ios
pnpm assets:generate
```

## Environment setup

Use these files as your starting point:

- `.env.example` for local development
- `.env.production.example` for store builds

For production and store builds, make sure `VITE_API_URL`, `VITE_WEBSOCKET_URL`, and `VITE_PASSWORD_RESET_URL` point to your real public services. Do not ship a mobile build with localhost values.

Recommended release flow:

```powershell
pnpm build
pnpm android:prepare
pnpm ios:prepare
```

## Store release guide

See [MOBILE_STORE_GUIDE.md](c:/Users/user/Desktop/faithbliss/frontend/MOBILE_STORE_GUIDE.md).
