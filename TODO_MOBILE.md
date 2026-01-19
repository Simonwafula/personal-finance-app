# Mobile (Android) Readiness TODO

Status: Draft (from repo inspection)

## 1) Fix Android package/namespace mismatch (done)
- Align Java package to appId/namespace `com.mstatilitechnologies.sonko`.
- Update `MainActivity` package and file path to match namespace.
- Update `SmsReaderPlugin` package and file path to match namespace.
- Update `AndroidManifest.xml` activity reference if needed.
- Update any references/imports to the plugin package.
- Re-sync Capacitor if necessary.

## 2) Wire SMS UI into the app (mobile-only) (done)
- Dashboard renders `SmsTransactionPrompt` when `PLATFORM_FEATURES.SMS_DETECTION` is true, an account+category list is fetched, and transactions are saved via `createTransaction`, triggering a `transactionsUpdated` refresh.
- Profile page exposes a guarded SMS Detection tab with `SmsSettings` so mobile users can manage senders.
- Web builds stay clean because the tab/prompts are gated behind the same feature flag.

## 3) Validate Android debug build
- Run `cd client && npm run android:debug`.
- Confirm APK output at `client/android/app/build/outputs/apk/debug/app-debug.apk`.
- Install on device/emulator and smoke test:
  - App launch
  - Login
  - SMS permission prompt
  - SMS detection flow (with sample messages)
- Log any runtime errors and fix as needed.

Notes
- Keystore file in repo: `client/android/Utajiri_wangu.jks` should not be committed for security.
