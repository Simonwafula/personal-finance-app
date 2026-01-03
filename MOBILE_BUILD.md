# Mobile App Build Guide (Android/Play Store)

This guide covers building the Personal Finance app for Android and publishing to the Google Play Store.

## Prerequisites

1. **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
2. **Java JDK 17+** - Required for Android builds
3. **Node.js 18+** - For building the web assets

## Project Structure

```
client/
├── android/                    # Native Android project (Capacitor)
│   ├── app/
│   │   ├── build.gradle       # App build config
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── res/           # Icons, splash screens
│   │   │   └── assets/public/ # Built web app
│   └── gradle.properties      # Signing config (for release)
├── capacitor.config.ts        # Capacitor configuration
└── package.json               # Build scripts
```

## Quick Start

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Build Debug APK

```bash
npm run android:debug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Open in Android Studio

```bash
npm run cap:open
```

## Play Store Release Build

### Step 1: Generate Signing Key

Create a keystore for signing your release builds:

```bash
keytool -genkey -v -keystore ~/personal-finance-release.keystore \
  -alias personal-finance \
  -keyalg RSA -keysize 2048 -validity 10000
```

**⚠️ IMPORTANT: Back up your keystore file and passwords securely. You cannot update your app without them!**

### Step 2: Configure Signing

Create/edit `client/android/gradle.properties`:

```properties
# Release signing config
RELEASE_STORE_FILE=/path/to/personal-finance-release.keystore
RELEASE_STORE_PASSWORD=your_store_password
RELEASE_KEY_ALIAS=personal-finance
RELEASE_KEY_PASSWORD=your_key_password
```

**Never commit these credentials to git!** Add to `.gitignore`:
```
android/gradle.properties
*.keystore
```

### Step 3: Build Release Bundle (AAB)

Google Play requires Android App Bundle format:

```bash
npm run android:bundle
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 4: Build Release APK (for testing)

```bash
npm run android:release
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## App Icons & Splash Screen

### Generate Icons

Replace the default icons in these locations:

```
android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png      # 72x72
├── mipmap-mdpi/ic_launcher.png      # 48x48
├── mipmap-xhdpi/ic_launcher.png     # 96x96
├── mipmap-xxhdpi/ic_launcher.png    # 144x144
├── mipmap-xxxhdpi/ic_launcher.png   # 192x192
└── drawable/splash.png              # 1920x1920 (centered)
```

**Recommended tool**: [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)

### Splash Screen

Edit `android/app/src/main/res/values/styles.xml` to customize:

```xml
<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">#1a1a2e</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splash</item>
</style>
```

## Play Store Submission Checklist

### Required Assets

- [ ] **App Icon**: 512x512 PNG
- [ ] **Feature Graphic**: 1024x500 PNG
- [ ] **Screenshots**: Min 2, recommended 8 (phone + tablet)
  - Phone: 1080x1920 or 1440x2560
  - Tablet 7": 1200x1920
  - Tablet 10": 1600x2560

### Store Listing

- [ ] App name: "Personal Finance"
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Category: Finance
- [ ] Privacy Policy URL

### Content Rating

Complete the content rating questionnaire in Play Console.

### App Signing

Google Play App Signing is recommended. On first upload, Google will manage your app signing key.

## Updating the App

### 1. Increment Version

Edit `client/android/app/build.gradle`:

```groovy
defaultConfig {
    versionCode 2        // Increment for each release
    versionName "1.0.1"  // User-visible version
}
```

### 2. Rebuild

```bash
npm run android:bundle
```

### 3. Upload to Play Console

Upload the new `.aab` file to your release track.

## Testing

### Install Debug APK on Device

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### View Logs

```bash
adb logcat | grep -i "capacitor\|finance"
```

### Test on Emulator

Open Android Studio → AVD Manager → Create/Start emulator, then:

```bash
npm run cap:open
# Click Run in Android Studio
```

## Troubleshooting

### Build Fails with "SDK not found"

Set `ANDROID_HOME`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### API Calls Fail in Release Build

Check that:
1. Production API URL is correct in `src/api/client.ts`
2. Backend CORS allows the app's origin
3. Network security config allows HTTPS

### App Crashes on Launch

Check `adb logcat` for stack traces. Common issues:
- Missing permissions in AndroidManifest.xml
- ProGuard removing required classes

## Backend Configuration

For the mobile app to work, ensure your Django backend allows:

### CORS Settings (backend/settings.py)

```python
CORS_ALLOWED_ORIGINS = [
    "https://finance.mstatilitechnologies.com",
    "capacitor://localhost",
    "http://localhost",
]

CORS_ALLOW_CREDENTIALS = True
```

### CSRF Settings

```python
CSRF_TRUSTED_ORIGINS = [
    "https://finance.mstatilitechnologies.com",
    "capacitor://localhost",
    "http://localhost",
]
```

## CI/CD Integration (Optional)

For automated builds, create `.github/workflows/android.yml`:

```yaml
name: Android Build

on:
  push:
    branches: [mobile-app]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Install dependencies
        run: cd client && npm ci
      
      - name: Build web assets
        run: cd client && npm run build
      
      - name: Sync Capacitor
        run: cd client && npx cap sync android
      
      - name: Build APK
        run: cd client/android && ./gradlew assembleDebug
      
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: client/android/app/build/outputs/apk/debug/app-debug.apk
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
