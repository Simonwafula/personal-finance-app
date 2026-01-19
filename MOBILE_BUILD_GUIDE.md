# Mobile Build Guide - Personal Finance App

This guide covers building the Android APK for the Personal Finance mobile app.

## Prerequisites

- Node.js and npm installed
- Android SDK and build tools installed
- Java Development Kit (JDK) 11 or higher
- Capacitor CLI (installed via npm)

## Build Commands

### Quick Build (Development)

```bash
# From project root
cd client

# Build and generate debug APK
npm run android:debug
```

This command will:
1. Build mobile web assets with `VITE_PLATFORM=mobile`
2. Sync assets to Android project
3. Build debug APK with Gradle

### Step-by-Step Build

```bash
# 1. Build mobile web assets
npm run build:mobile

# 2. Sync web assets to Android
npm run cap:sync

# 3. Build debug APK
cd android && ./gradlew assembleDebug
```

### Production Release Build

```bash
# Build release APK (requires keystore configuration)
npm run android:release

# Or build release AAB for Google Play
npm run android:bundle
```

## Output Locations

- **Debug APK**: `client/android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `client/android/app/build/outputs/apk/release/app-release.apk`
- **Release AAB**: `client/android/app/build/outputs/bundle/release/app-release.aab`

## Build Configuration

### App Details

- **App ID**: `com.mstatilitechnologies.sonko`
- **App Name**: Personal Finance
- **Version**: 1.0.0 (update in `android/app/build.gradle`)

### Platform Detection

The app automatically detects the platform:
- `VITE_PLATFORM=mobile` - Includes SMS features
- `VITE_PLATFORM=web` - Excludes SMS features

### SMS Permissions

The Android app requests these permissions at runtime:
- `READ_SMS` - Read SMS inbox for transaction detection
- `RECEIVE_SMS` - Listen for incoming SMS messages

## Build Size

- **Debug APK**: ~4.6 MB
- **Release APK**: ~2-3 MB (with ProGuard/R8 optimization)

## Opening in Android Studio

```bash
npm run cap:open
```

This opens the Android project in Android Studio for:
- Testing on emulator
- Debugging
- Advanced build configuration
- Code signing setup

## Troubleshooting

### Build Fails - Java Version

Ensure JDK 11 or higher is installed:
```bash
java -version
```

### Build Fails - Android SDK

Set `ANDROID_HOME` environment variable:
```bash
export ANDROID_HOME=/path/to/android/sdk
```

### Permission Errors

On macOS/Linux, make gradlew executable:
```bash
chmod +x android/gradlew
```

## Release Signing

For production releases, configure signing in `android/gradle.properties`:

```properties
RELEASE_STORE_FILE=path/to/keystore.jks
RELEASE_STORE_PASSWORD=your_store_password
RELEASE_KEY_ALIAS=your_key_alias
RELEASE_KEY_PASSWORD=your_key_password
```

**Never commit signing keys to git!**

## GitHub Actions

APK builds are automated via GitHub Actions:
- Triggered on version tags (e.g., `v1.0.0`)
- Uploads APK to GitHub Releases
- See `.github/workflows/mobile-build.yml`

## Next Steps

1. Test APK on physical Android device
2. Configure release signing for production
3. Set up Google Play Store listing
4. Enable SMS permissions testing with real financial SMS
