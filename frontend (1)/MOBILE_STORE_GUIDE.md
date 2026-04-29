# FaithBliss Mobile Store Guide

This project is now prepared for both:

- Android via Capacitor in `frontend/android`
- iOS via Capacitor in `frontend/ios`

## 1. Prerequisites

### All platforms

```powershell
cd frontend
pnpm install
```

Create a production env file before any store build:

```powershell
Copy-Item .env.production.example .env.production
```

Then replace the placeholder values with your real production values.

Important:

- `VITE_API_URL` must be your real backend base URL
- `VITE_WEBSOCKET_URL` must be your real Socket.IO base URL
- `VITE_PASSWORD_RESET_URL` should be your public website URL
- Do not build store binaries with localhost values

### Android

- Android Studio installed
- A Play Console account
- An upload keystore

### iOS

- A Mac with Xcode installed
- CocoaPods installed
- An Apple Developer account
- App Store Connect access

## 2. Capacitor workflow

### Build and sync both native projects

```powershell
pnpm build
pnpm mobile:prepare
```

### Android only

```powershell
pnpm build
pnpm android:prepare
pnpm cap:open:android
```

### iOS only

```powershell
pnpm build
pnpm ios:prepare
pnpm cap:open:ios
```

Note:

- The iOS project can be generated on Windows, but final iOS dependency install, signing, archive, and upload must be completed on a Mac.
- If the iOS folder is missing on another machine, run `pnpm cap:add:ios`.

## 3. Android release setup

The Android project already includes:

- app id `com.faithbliss.app`
- release bundle generation
- signing config via environment variables
- camera, microphone, and location manifest permissions

### Local signed build

Set these environment variables before building:

```powershell
$env:SIGNING_STORE_FILE="C:\path\to\upload-keystore.jks"
$env:SIGNING_STORE_PASSWORD="your-keystore-password"
$env:SIGNING_KEY_ALIAS="your-key-alias"
$env:SIGNING_KEY_PASSWORD="your-key-password"
```

Then build:

```powershell
cd android
.\gradlew bundleRelease
```

The AAB is generated at:

- `android/app/build/outputs/bundle/release/app-release.aab`

### Play Store upload flow

1. Open Google Play Console.
2. Create the app with package name `com.faithbliss.app`.
3. Enroll in Play App Signing.
4. Upload the release AAB.
5. Complete store listing:
   - App name
   - Short description
   - Full description
   - Privacy policy URL
   - Support email and website
   - Screenshots
   - Feature graphic
   - App icon
6. Complete policy declarations:
   - Camera
   - Microphone
   - Location
   - Data safety
   - Content rating
7. Add testers to internal testing first.
8. Promote to closed, open, or production after validation.

## 4. iOS release setup

The iOS project already includes:

- bundle id `com.faithbliss.app`
- generated Xcode workspace/project
- camera, microphone, location, and photo library usage descriptions

### First-time Mac setup

On a Mac:

```bash
cd frontend
pnpm install
pnpm build
pnpm ios:prepare
cd ios/App
pod install
open App.xcworkspace
```

### Xcode checklist

In Xcode:

1. Select the `App` target.
2. Set your Apple Team.
3. Confirm bundle identifier `com.faithbliss.app` or replace it with your final production bundle id.
4. Update version and build numbers.
5. Confirm signing works for Release.
6. Test on a real iPhone.

### App Store upload flow

1. Open App Store Connect.
2. Create a new app with the same bundle identifier.
3. In Xcode choose `Product -> Archive`.
4. When the archive is ready, open Organizer.
5. Choose `Distribute App`.
6. Select `App Store Connect`.
7. Upload the archive.
8. In App Store Connect complete:
   - App information
   - Privacy policy URL
   - Screenshots for required device sizes
   - App privacy nutrition labels
   - Age rating
   - Support URL
   - Review notes and demo credentials if needed
9. Start with TestFlight, then submit for App Review.

## 5. Icons and splash screens

To generate app icons and splash screens from source assets:

```powershell
pnpm assets:generate
```

Recommended source files:

- `assets/icon-only.png`
- `assets/icon-foreground.png`
- `assets/icon-background.png`
- `assets/splash.png`
- `assets/splash-dark.png`

After generating assets, sync again:

```powershell
pnpm build
pnpm mobile:prepare
```

## 6. Backend and CORS

The backend now accepts these mobile Capacitor origins by default:

- `https://localhost`
- `capacitor://localhost`

You can add more origins with backend env vars:

- `CLIENT_URL`
- `PUBLIC_APP_URL`
- `CORS_ALLOWED_ORIGINS`

Example:

```env
CLIENT_URL=https://faithblissafrica.com
PUBLIC_APP_URL=https://faithblissafrica.com
CORS_ALLOWED_ORIGINS=https://admin.faithblissafrica.com,https://staging.faithblissafrica.com
```

## 7. Final pre-submit checklist

- Production env values are set
- Android and iOS version numbers are updated
- Real-device sign-in, messaging, calls, media upload, geolocation, and payments are tested
- Privacy policy and support URLs are live
- Store screenshots and metadata are ready
- Internal testing or TestFlight passes before public release
