# Android Play Store Setup

The Android-specific flow now lives in the shared mobile guide:

- [MOBILE_STORE_GUIDE.md](c:/Users/user/Desktop/faithbliss/frontend/MOBILE_STORE_GUIDE.md)

Use this quick path when you only need Android:

```powershell
pnpm install
pnpm android:prepare
pnpm cap:open:android
```

If you want fresh icons and splash assets first:

```powershell
pnpm assets:generate
pnpm android:prepare
```
