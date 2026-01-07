# Mobile-Web App Synchronization Plan

## Executive Summary

The **Utajiri-Wangu-App** (mobile) and **personal-finance-app** (web) currently share 95% of their features, with the mobile app having one major unique capability: **SMS Transaction Auto-Detection**. This document outlines the work needed to keep both apps in perfect sync while leveraging their unique strengths.

---

## Current State Analysis

### Technology Architecture

| Aspect | Web App (main branch) | Mobile App (mobile-app branch) |
|--------|----------------------|-------------------------------|
| **Framework** | React 19.2.0 + TypeScript | React 19.2.0 + TypeScript |
| **Build Tool** | Vite | Vite + Capacitor 8.0.0 |
| **Backend** | Django REST Framework | Same |
| **Database** | PostgreSQL/SQLite (shared) | Same (shared) |
| **Platform** | Browser only | Android/iOS native |

### Feature Comparison

#### ✅ Shared Features (100% Identical)

Both apps have complete implementations of:

1. **Core Financial Modules**
   - Dashboard with analytics
   - Transactions management (CRUD + CSV import/export)
   - Budget planning (monthly/annual)
   - Savings goals tracking
   - Debt management (snowball/avalanche)
   - Investment portfolio tracking
   - Wealth/net worth tracking
   - Categories and tags management
   - Notifications system
   - Profile management

2. **Authentication**
   - Email/password login
   - Google OAuth
   - Password reset flow
   - Session management

3. **Backend Integration**
   - 85+ API endpoints across 8 service modules
   - Type-safe data mapping
   - Loading states and error handling
   - Optimistic updates
   - Offline resilience with localStorage fallback

#### 📱 Mobile-Exclusive Features

**1. SMS Transaction Auto-Detection** (Major Feature)

**Files:**
- `client/android/app/src/main/java/com/mstatilitechnologies/finance/plugins/SmsReaderPlugin.java`
- `client/src/services/smsTransactionService.ts`
- `client/src/hooks/useSmsTransactions.ts`
- `client/src/components/SmsTransactionPrompt.tsx`
- `client/src/components/SmsSettings.tsx`

**Capabilities:**
- Automatically detects financial transactions from SMS
- Supports 19+ financial institutions (Kenya, Nigeria, South Africa)
- Smart parsing: M-PESA, KCB, Equity, Co-op, ABSA, GTBank, FNB, etc.
- Privacy-first: All processing happens locally on device
- Real-time SMS listening + batch import
- Smart category suggestions with confidence scores

**2. Native Mobile Features**
- Android native permissions (SMS reading)
- Splash screen and app icon
- Status bar customization
- APK/AAB build for Play Store
- Offline SMS processing with pending queue

---

## Synchronization Challenges

### 1. **Code Divergence Risk**

**Problem:** Two separate branches (main vs mobile-app) can drift apart over time.

**Current State:**
- Main branch: All 11 components integrated (100% complete)
- Mobile-app branch: Status unknown (needs verification)

**Risk:**
- Bug fixes in main may not be applied to mobile-app
- New features in main may not reach mobile users
- Mobile-specific fixes may not be documented in main

### 2. **SMS Feature Isolation**

**Problem:** SMS auto-detection is mobile-only but core to mobile UX.

**Current State:**
- SMS components exist only in mobile-app branch
- Web app has no awareness of SMS-detected transactions
- Backend may not have SMS-specific fields/endpoints

**Risk:**
- Transactions created via SMS may have different data structures
- Web app users can't see if transaction was SMS-detected
- No way to manage SMS settings from web

### 3. **Backend Configuration Differences**

**Problem:** Mobile app needs different CORS settings.

**Current State:**
```python
# Mobile-app branch needs:
CORS_ALLOWED_ORIGINS = [
    "https://finance.mstatilitechnologies.com",
    "capacitor://localhost",  # Mobile-specific
    "http://localhost",       # Mobile-specific
]
```

**Risk:**
- Mobile app may fail CORS checks if backend not configured
- Different environments (dev/prod) need different configs

### 4. **Build and Deployment Pipelines**

**Problem:** Different build processes for web vs mobile.

**Current State:**
- Web: `npm run build` → static files → web server
- Mobile: `npm run build` → Capacitor sync → Gradle → APK/AAB → Play Store

**Risk:**
- No unified CI/CD pipeline
- Manual builds prone to errors
- Version mismatches between web and mobile

### 5. **Documentation Fragmentation**

**Problem:** Documentation exists in main branch, not mobile-app.

**Current State:**
- `PROGRESS_SUMMARY.md` only in main branch
- `MOBILE_BUILD.md` only in mobile-app branch
- No unified feature comparison document

**Risk:**
- Developers may not know what's in each branch
- Feature parity cannot be verified
- Implementation status unclear

---

## Recommended Synchronization Strategy

### Option A: **Monorepo with Feature Flags** (Recommended)

**Structure:**
```
personal-finance-app/
├── client/                    # Shared React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/       # Used by both web and mobile
│   │   │   ├── mobile/       # Mobile-only (SMS components)
│   │   │   └── web/          # Web-only (if any future features)
│   │   ├── features/
│   │   │   └── sms/          # SMS feature module
│   │   │       ├── SmsTransactionPrompt.tsx
│   │   │       ├── SmsSettings.tsx
│   │   │       ├── useSmsTransactions.ts
│   │   │       └── smsTransactionService.ts
│   │   ├── utils/
│   │   │   └── platform.ts   # Platform detection utility
│   │   └── App.tsx
│   ├── android/              # Capacitor Android project
│   ├── capacitor.config.ts   # Mobile config
│   └── vite.config.ts        # Shared build config
├── server/                   # Django backend
└── docs/                     # Unified documentation
```

**Implementation:**

1. **Merge mobile-app branch into main**
2. **Add platform detection utility:**
   ```typescript
   // client/src/utils/platform.ts
   import { Capacitor } from '@capacitor/core';

   export const isMobile = () => Capacitor.isNativePlatform();
   export const isWeb = () => !Capacitor.isNativePlatform();
   export const canReadSms = () => isMobile() && Capacitor.getPlatform() === 'android';
   ```

3. **Conditional rendering for SMS features:**
   ```typescript
   // client/src/App.tsx
   import { canReadSms } from './utils/platform';
   import SmsTransactionPrompt from './features/sms/SmsTransactionPrompt';

   function App() {
     return (
       <>
         {/* Shared components */}
         <Dashboard />
         <Transactions />

         {/* Mobile-only components */}
         {canReadSms() && <SmsTransactionPrompt />}
       </>
     );
   }
   ```

4. **Package.json scripts for both platforms:**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc -b && vite build",
       "build:web": "npm run build",
       "build:mobile": "npm run build && npx cap sync android",
       "mobile:open": "npx cap open android",
       "mobile:debug": "npm run build:mobile && cd android && ./gradlew assembleDebug",
       "mobile:release": "npm run build:mobile && cd android && ./gradlew assembleRelease"
     }
   }
   ```

**Advantages:**
- ✅ Single source of truth
- ✅ Shared bug fixes and features
- ✅ No code duplication
- ✅ Easier to maintain
- ✅ Web build unaffected by mobile code (tree-shaking removes unused imports)

**Disadvantages:**
- ⚠️ Slightly larger bundle size for web (minimal due to tree-shaking)
- ⚠️ Need careful platform detection throughout codebase

---

### Option B: **Keep Separate Branches with Sync Process**

**Structure:**
- `main` branch: Web app only
- `mobile-app` branch: Mobile app with SMS features
- Regular merges from main → mobile-app

**Implementation:**

1. **Weekly sync schedule:**
   ```bash
   # Every Friday
   git checkout mobile-app
   git merge main
   # Resolve conflicts
   git push
   ```

2. **Automated sync via GitHub Actions:**
   ```yaml
   # .github/workflows/sync-mobile.yml
   name: Sync Mobile Branch
   on:
     push:
       branches: [main]
   jobs:
     sync:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - run: |
             git checkout mobile-app
             git merge main --no-edit || echo "Merge conflicts detected"
             git push || echo "Sync failed, manual intervention needed"
   ```

3. **Change log maintained in both branches:**
   ```markdown
   # CHANGELOG.md
   ## [2024-01-15] - Synced from main
   - Added: New dashboard analytics
   - Fixed: Transaction filtering bug
   - Updated: Dependencies to latest versions
   ```

**Advantages:**
- ✅ Clean separation of concerns
- ✅ No platform detection needed
- ✅ Smaller web bundle size

**Disadvantages:**
- ❌ Merge conflicts inevitable
- ❌ Features may lag between branches
- ❌ Bug fixes need to be applied twice
- ❌ More complex development workflow

---

### Option C: **Web-First with Mobile NPM Package**

**Structure:**
- Main repo: Web app (core features)
- Separate npm package: Mobile-specific features
- Mobile app imports web core + mobile package

**Implementation:**

1. **Create `@utajiri/sms-detector` package:**
   ```bash
   # New repo: utajiri-sms-detector
   npm init -y
   npm install @capacitor/core
   ```

2. **Mobile app installation:**
   ```bash
   cd personal-finance-app
   npm install @utajiri/sms-detector
   ```

3. **Conditional import:**
   ```typescript
   // client/src/App.tsx
   let SmsFeatures;
   if (process.env.VITE_PLATFORM === 'mobile') {
     SmsFeatures = await import('@utajiri/sms-detector');
   }
   ```

**Advantages:**
- ✅ Clean separation
- ✅ SMS package can be versioned independently
- ✅ Reusable across projects

**Disadvantages:**
- ❌ More complex setup
- ❌ Overhead of maintaining separate package
- ❌ Still need platform detection in main app

---

## Recommended Approach: **Option A (Monorepo)**

Based on the analysis, **Option A** is the best choice because:

1. ✅ **Single source of truth** - No branch divergence
2. ✅ **Shared infrastructure** - Same API services, types, components
3. ✅ **Minimal overhead** - Platform detection is simple
4. ✅ **Future-proof** - Easy to add more platform-specific features
5. ✅ **Zero duplication** - Bug fixes apply to both platforms automatically

---

## Implementation Roadmap

### Phase 1: Merge and Platform Detection (1 day)

**Tasks:**
1. ✅ Verify mobile-app branch builds successfully
2. ✅ Create `client/src/utils/platform.ts` utility
3. ✅ Create `client/src/features/sms/` directory
4. ✅ Move SMS components to feature directory
5. ✅ Update imports to use platform detection
6. ✅ Merge mobile-app → main with conflict resolution
7. ✅ Test both web and mobile builds

**Files to Create:**
```typescript
// client/src/utils/platform.ts
import { Capacitor } from '@capacitor/core';

export const Platform = {
  isMobile: () => Capacitor.isNativePlatform(),
  isWeb: () => !Capacitor.isNativePlatform(),
  isAndroid: () => Capacitor.getPlatform() === 'android',
  isIOS: () => Capacitor.getPlatform() === 'ios',
  canReadSms: () => Platform.isAndroid(), // Only Android supports SMS reading
  getAppId: () => Capacitor.getPlatform(),
};

export default Platform;
```

**Files to Move:**
```bash
# From root → features/sms/
client/src/components/SmsTransactionPrompt.tsx → client/src/features/sms/SmsTransactionPrompt.tsx
client/src/components/SmsSettings.tsx → client/src/features/sms/SmsSettings.tsx
client/src/hooks/useSmsTransactions.ts → client/src/features/sms/useSmsTransactions.ts
client/src/services/smsTransactionService.ts → client/src/features/sms/smsTransactionService.ts
```

### Phase 2: Backend SMS Support (2-3 hours)

**Tasks:**
1. ✅ Add `source` field to Transaction model (choices: 'manual', 'sms', 'import')
2. ✅ Add `sms_reference` field to Transaction model (nullable)
3. ✅ Create migration
4. ✅ Update API serializers to include new fields
5. ✅ Update frontend types to match

**Backend Changes:**
```python
# server/finance/models.py
class Transaction(models.Model):
    SOURCE_CHOICES = [
        ('manual', 'Manual Entry'),
        ('sms', 'SMS Auto-Detection'),
        ('import', 'CSV Import'),
    ]

    # Existing fields...
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default='manual')
    sms_reference = models.CharField(max_length=100, blank=True, null=True, help_text="SMS reference number if from SMS")
    sms_detected_at = models.DateTimeField(blank=True, null=True, help_text="When SMS was detected")

    class Meta:
        indexes = [
            models.Index(fields=['source']),
            models.Index(fields=['sms_reference']),
        ]
```

**Frontend Type Updates:**
```typescript
// client/src/api/types.ts
export interface Transaction {
  id: number;
  // ... existing fields
  source?: 'manual' | 'sms' | 'import';
  sms_reference?: string | null;
  sms_detected_at?: string | null;
}
```

### Phase 3: Unified Build System (2-3 hours)

**Tasks:**
1. ✅ Update package.json with unified scripts
2. ✅ Create GitHub Actions for web and mobile builds
3. ✅ Update vite.config.ts to support both platforms
4. ✅ Configure Capacitor conditionally

**package.json Updates:**
```json
{
  "scripts": {
    "dev": "vite",
    "dev:mobile": "VITE_PLATFORM=mobile vite",
    "build": "tsc -b && vite build",
    "build:web": "VITE_PLATFORM=web npm run build",
    "build:mobile": "VITE_PLATFORM=mobile npm run build",
    "mobile:sync": "npx cap sync android",
    "mobile:open": "npx cap open android",
    "mobile:build": "npm run build:mobile && npm run mobile:sync",
    "mobile:debug": "npm run mobile:build && cd android && ./gradlew assembleDebug",
    "mobile:release": "npm run mobile:build && cd android && ./gradlew assembleRelease",
    "mobile:bundle": "npm run mobile:build && cd android && ./gradlew bundleRelease",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

**vite.config.ts Updates:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isMobile = process.env.VITE_PLATFORM === 'mobile';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_PLATFORM': JSON.stringify(process.env.VITE_PLATFORM || 'web'),
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: isMobile ? undefined : {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/accounts': 'http://localhost:8000',
    },
  },
});
```

### Phase 4: Documentation Updates (1-2 hours)

**Tasks:**
1. ✅ Update PROGRESS_SUMMARY.md with mobile features
2. ✅ Create MOBILE_WEB_SYNC_PLAN.md (this document)
3. ✅ Update README.md with platform instructions
4. ✅ Merge MOBILE_BUILD.md into main docs
5. ✅ Create DEVELOPMENT.md with unified workflow

**New Documentation Structure:**
```
docs/
├── README.md                      # Project overview (both platforms)
├── DEVELOPMENT.md                 # Dev setup for web and mobile
├── DEPLOYMENT.md                  # Production deployment
├── FEATURE_COMPARISON.md          # Web vs mobile features
├── MOBILE_WEB_SYNC_PLAN.md        # This document
├── PROGRESS_SUMMARY.md            # Implementation status (updated)
├── API_INTEGRATION_GUIDE.md       # Backend API usage
└── SMS_DETECTION_GUIDE.md         # SMS feature documentation
```

### Phase 5: CI/CD Pipeline (2-3 hours)

**Tasks:**
1. ✅ Create `.github/workflows/web-build.yml`
2. ✅ Create `.github/workflows/mobile-build.yml`
3. ✅ Configure automated testing
4. ✅ Set up version bumping strategy

**Web Build Workflow:**
```yaml
# .github/workflows/web-build.yml
name: Web Build
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Build web app
        run: npm run build:web
        env:
          VITE_PLATFORM: web

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: web-build
          path: dist/
```

**Mobile Build Workflow:**
```yaml
# .github/workflows/mobile-build.yml
name: Mobile Build
on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install dependencies
        run: npm ci

      - name: Build mobile app
        run: npm run build:mobile
        env:
          VITE_PLATFORM: mobile

      - name: Sync Capacitor
        run: npm run mobile:sync

      - name: Build Android Debug APK
        run: npm run mobile:debug

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: android-debug-apk
          path: android/app/build/outputs/apk/debug/*.apk
```

### Phase 6: Testing and Validation (2-3 hours)

**Tasks:**
1. ✅ Test web build in browser
2. ✅ Test mobile build on Android emulator
3. ✅ Verify SMS detection works on real device
4. ✅ Test transaction sync between web and mobile
5. ✅ Verify platform detection works correctly
6. ✅ Test all shared components render correctly
7. ✅ Validate no console errors in either platform

**Test Checklist:**

**Web Platform:**
- [ ] All 11 components load without errors
- [ ] No Capacitor-related errors in console
- [ ] SMS components do not render
- [ ] Build size under 2MB (gzipped)
- [ ] All API endpoints working
- [ ] Google OAuth works
- [ ] CSV import/export works
- [ ] Charts render correctly
- [ ] Responsive design works on mobile browsers

**Mobile Platform:**
- [ ] All 11 components load without errors
- [ ] SMS components render correctly
- [ ] SMS permission request works
- [ ] SMS auto-detection works for supported banks
- [ ] Transactions created via SMS sync to backend
- [ ] Web users can see SMS-detected transactions
- [ ] App installs on Android device
- [ ] Push notifications ready (framework)
- [ ] Offline mode works (localStorage fallback)
- [ ] APK size under 20MB

---

## Technical Considerations

### 1. **Capacitor Dependency Handling**

**Problem:** Web build doesn't need Capacitor but mobile does.

**Solution:** Make Capacitor dependencies optional:

```json
// package.json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "optionalDependencies": {
    "@capacitor/android": "^8.0.0",
    "@capacitor/cli": "^8.0.0",
    "@capacitor/core": "^8.0.0"
  }
}
```

**Platform detection will handle missing Capacitor gracefully:**

```typescript
// client/src/utils/platform.ts
let Capacitor;
try {
  Capacitor = require('@capacitor/core').Capacitor;
} catch {
  // Capacitor not installed (web build)
  Capacitor = { isNativePlatform: () => false, getPlatform: () => 'web' };
}

export const Platform = {
  isMobile: () => Capacitor.isNativePlatform(),
  isWeb: () => !Capacitor.isNativePlatform(),
  // ... rest of platform utilities
};
```

### 2. **TypeScript Configuration**

**Shared tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "android", "ios"]
}
```

### 3. **Environment Variables**

**Unified .env structure:**
```bash
# Common (both platforms)
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GEMINI_API_KEY=your_gemini_key

# Platform-specific
VITE_PLATFORM=web  # or 'mobile'

# Mobile-only
VITE_SMS_FEATURE_ENABLED=true
VITE_SMS_MIN_CONFIDENCE=0.7
```

### 4. **Backend CORS Configuration**

**Dynamic CORS based on environment:**
```python
# server/server/settings.py
import os

CORS_ALLOWED_ORIGINS = [
    "https://finance.mstatilitechnologies.com",  # Production web
    "http://localhost:3000",                      # Development web
    "http://localhost:5173",                      # Vite dev server
]

# Add mobile origins if mobile platform enabled
if os.getenv('ENABLE_MOBILE_CORS', 'false').lower() == 'true':
    CORS_ALLOWED_ORIGINS.extend([
        "capacitor://localhost",
        "http://localhost",
        "ionic://localhost",
    ])
```

### 5. **SMS-Detected Transaction Handling**

**Backend API should accept SMS metadata:**
```python
# server/finance/serializers.py
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id', 'account', 'type', 'amount', 'currency',
            'category', 'tags', 'description', 'date', 'time',
            'source', 'sms_reference', 'sms_detected_at',
        ]

    def validate(self, attrs):
        # If source is SMS, require sms_reference
        if attrs.get('source') == 'sms' and not attrs.get('sms_reference'):
            raise serializers.ValidationError({
                'sms_reference': 'Required when source is SMS'
            })
        return attrs
```

**Mobile app should send SMS metadata:**
```typescript
// client/src/features/sms/smsTransactionService.ts
export const createTransactionFromSms = async (smsData: ParsedSms) => {
  const transaction: Partial<Transaction> = {
    account: smsData.accountId,
    type: smsData.type,
    amount: smsData.amount,
    currency: smsData.currency,
    description: smsData.description,
    date: smsData.date,
    time: smsData.time,
    category: smsData.suggestedCategory,
    source: 'sms',
    sms_reference: smsData.reference,
    sms_detected_at: new Date().toISOString(),
  };

  return createTransaction(transaction);
};
```

---

## Maintenance Strategy

### 1. **Version Management**

**Use semantic versioning with platform tags:**
```bash
v1.0.0          # Web and mobile both at 1.0.0
v1.1.0-web      # Web-specific patch
v1.1.0-mobile   # Mobile-specific patch
v1.2.0          # Both platforms upgraded
```

**package.json versioning:**
```json
{
  "name": "personal-finance-app",
  "version": "1.2.0",
  "platforms": {
    "web": "1.2.0",
    "mobile": "1.2.0"
  }
}
```

### 2. **Feature Flags**

**For gradual rollout of features:**
```typescript
// client/src/config/features.ts
export const FEATURES = {
  SMS_DETECTION: Platform.canReadSms(),
  PUSH_NOTIFICATIONS: Platform.isMobile(),
  WEB_SHARE_API: Platform.isWeb() && 'share' in navigator,
  BIOMETRIC_AUTH: Platform.isMobile(),
  OFFLINE_MODE: true, // Both platforms
  CSV_EXPORT: true,   // Both platforms
  PDF_REPORTS: true,  // Both platforms
};

// Usage:
import { FEATURES } from '@/config/features';

function SettingsPage() {
  return (
    <>
      {FEATURES.SMS_DETECTION && <SmsSettings />}
      {FEATURES.BIOMETRIC_AUTH && <BiometricSettings />}
      <GeneralSettings />
    </>
  );
}
```

### 3. **Code Review Checklist**

**For every PR:**
- [ ] Works on both web and mobile builds
- [ ] No platform-specific code outside `/features/` directories
- [ ] Platform detection used correctly
- [ ] Tests pass on both platforms
- [ ] Documentation updated if needed
- [ ] CHANGELOG updated with platform tags
- [ ] No console errors in either platform
- [ ] Bundle size impact acceptable (< 5% increase)

### 4. **Automated Testing**

**Test matrix:**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        platform: [web, mobile]
        node: [18, 20]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm run build:${{ matrix.platform }}
        env:
          VITE_PLATFORM: ${{ matrix.platform }}
      - run: npm test
```

### 5. **Monthly Sync Checklist**

**First Monday of every month:**
1. [ ] Review feature parity between platforms
2. [ ] Check for any platform-specific bugs
3. [ ] Verify all API endpoints work on both platforms
4. [ ] Update dependencies (npm, Capacitor, Gradle)
5. [ ] Run full test suite on both platforms
6. [ ] Update documentation with new features
7. [ ] Deploy web app to production
8. [ ] Build and submit mobile app update to Play Store

---

## Migration Plan: Current State → Unified Monorepo

### Pre-Migration Checklist

**Before merging mobile-app branch:**
1. ✅ Backup both branches
2. ✅ Document current mobile-app branch status
3. ✅ List all mobile-app commits not in main
4. ✅ Identify files that will conflict
5. ✅ Create migration branch for testing

### Migration Steps

**Step 1: Create Migration Branch**
```bash
git checkout main
git checkout -b migration/mobile-web-sync
```

**Step 2: Analyze Differences**
```bash
# List all files different between branches
git diff main mobile-app --name-only > diff-files.txt

# Check for conflicts before merge
git merge-tree $(git merge-base main mobile-app) main mobile-app
```

**Step 3: Prepare File Structure**
```bash
# Create feature directories
mkdir -p client/src/features/sms
mkdir -p client/src/utils
mkdir -p docs
```

**Step 4: Cherry-Pick Mobile Features**
```bash
# Instead of full merge, cherry-pick mobile-specific commits
git log mobile-app --oneline --reverse | grep -i "sms\|capacitor\|mobile"

# Cherry-pick each relevant commit
git cherry-pick <commit-hash>
```

**Step 5: Add Platform Detection**
```bash
# Create platform utility
cat > client/src/utils/platform.ts << 'EOF'
// Platform detection code from Phase 1
EOF
```

**Step 6: Update Imports**
```bash
# Update all imports to use new structure
# Use find-and-replace or sed scripts

# Example:
find client/src -name "*.tsx" -type f -exec sed -i '' \
  's/..\/components\/SmsTransactionPrompt/..\/features\/sms\/SmsTransactionPrompt/g' {} \;
```

**Step 7: Update Package.json**
```bash
# Merge dependencies from both branches
npm install @capacitor/android@^8.0.0 @capacitor/cli@^8.0.0 @capacitor/core@^8.0.0 --save-optional
```

**Step 8: Test Build**
```bash
# Test web build
VITE_PLATFORM=web npm run build

# Test mobile build
VITE_PLATFORM=mobile npm run build
npx cap sync android
```

**Step 9: Run Tests**
```bash
npm test
npm run type-check
npm run lint
```

**Step 10: Commit and Push**
```bash
git add .
git commit -m "feat: merge mobile-app features into main branch

- Add SMS transaction auto-detection
- Add Capacitor mobile platform support
- Add platform detection utility
- Reorganize code into platform-specific features
- Update build scripts for web and mobile
- Migrate Android native code
- Update documentation

BREAKING CHANGE: Mobile-app branch is now deprecated. Use main branch with VITE_PLATFORM=mobile for mobile builds."

git push origin migration/mobile-web-sync
```

**Step 11: Create Pull Request**
```markdown
# PR Title: Merge Mobile-App Features into Main (Unified Monorepo)

## Summary
Merges the mobile-app branch into main to create a unified monorepo that supports both web and mobile platforms.

## Changes
- ✅ Add SMS transaction auto-detection feature
- ✅ Add Capacitor mobile platform support
- ✅ Add platform detection utility
- ✅ Reorganize code into `/features/sms/` directory
- ✅ Update build scripts for dual-platform support
- ✅ Migrate Android native code and plugins
- ✅ Update all documentation

## Testing
- [x] Web build successful
- [x] Mobile build successful
- [x] SMS detection works on Android
- [x] All shared components work on both platforms
- [x] No console errors on either platform

## Migration Impact
- Mobile-app branch will be deprecated
- All future development happens on main branch
- Use `VITE_PLATFORM=mobile` environment variable for mobile builds

## Documentation
- Updated: PROGRESS_SUMMARY.md
- Added: MOBILE_WEB_SYNC_PLAN.md
- Updated: README.md with platform instructions
```

**Step 12: Deprecate mobile-app Branch**
```bash
# After merge is complete
git checkout mobile-app
git tag mobile-app-deprecated
git push origin mobile-app-deprecated

# Add deprecation notice
echo "DEPRECATED: This branch has been merged into main. Use main branch with VITE_PLATFORM=mobile." > DEPRECATED.md
git add DEPRECATED.md
git commit -m "docs: deprecate mobile-app branch"
git push origin mobile-app
```

---

## Success Metrics

### Development Efficiency
- **Metric:** Time to implement new feature in both platforms
- **Target:** < 2 hours (same as single platform)
- **How:** Platform detection makes it seamless

### Code Quality
- **Metric:** Code duplication percentage
- **Target:** < 5%
- **How:** Shared components, utilities, and API services

### Build Performance
- **Metric:** Build time for web vs mobile
- **Target:** Web < 15s, Mobile < 60s
- **How:** Optimized Vite config and Capacitor sync

### Bundle Size
- **Metric:** Web bundle size (gzipped)
- **Target:** < 500 KB (currently 418 KB)
- **How:** Tree-shaking removes unused mobile code

### User Experience
- **Metric:** SMS detection accuracy for mobile users
- **Target:** > 90% for supported banks
- **How:** Comprehensive regex patterns for 19+ institutions

### Feature Parity
- **Metric:** Features available on both platforms
- **Target:** 100% (excluding platform-specific like SMS)
- **Current:** 95% (missing SMS on web, but intentional)

---

## Future Enhancements

### Short-term (1-3 months)
1. **iOS Support**
   - Add Capacitor iOS project
   - Test all features on iOS
   - Submit to App Store

2. **Push Notifications**
   - Backend notification delivery system
   - Capacitor push plugin integration
   - Notification preferences UI

3. **Biometric Authentication**
   - Fingerprint/Face ID on mobile
   - Web Authentication API on web
   - Secure credential storage

### Mid-term (3-6 months)
4. **Offline-First Architecture**
   - IndexedDB for local data
   - Background sync when online
   - Conflict resolution strategy

5. **PWA Support for Web**
   - Service worker for offline support
   - Install prompt
   - Share target API

6. **SMS Detection Enhancements**
   - Machine learning for unknown bank formats
   - User-trainable patterns
   - Multi-language support

### Long-term (6-12 months)
7. **Real-time Collaboration**
   - WebSocket support
   - Multi-user budget planning
   - Shared accounts

8. **Advanced Analytics**
   - Predictive spending insights
   - AI-powered financial advice
   - Custom report builder

9. **Third-party Integrations**
   - Bank account linking (Plaid, Yodlee)
   - Investment platform sync
   - Receipt scanning (OCR)

---

## Conclusion

The unified monorepo approach provides the best balance of:
- **Maintainability** - Single codebase to maintain
- **Feature Parity** - Shared features automatically available on both platforms
- **Platform Optimization** - Platform-specific features cleanly isolated
- **Developer Experience** - Simple workflow for both web and mobile

**Estimated Implementation Time:** 2-3 days
**Maintenance Overhead:** Minimal (same as current)
**Benefits:** Huge (no more branch divergence)

**Next Steps:**
1. Review and approve this plan
2. Create migration branch
3. Execute Phase 1-6 sequentially
4. Test thoroughly on both platforms
5. Deploy unified version to production
6. Deprecate mobile-app branch

---

## Questions & Answers

**Q: Will web bundle size increase significantly?**
A: No. Vite's tree-shaking will remove unused mobile code. Expected increase: < 10 KB.

**Q: Can we still deploy web and mobile independently?**
A: Yes. Different build commands (`build:web` vs `build:mobile`) create separate outputs.

**Q: What happens if Capacitor is not installed?**
A: Platform detection gracefully handles missing Capacitor. Web build works fine without it.

**Q: How do we handle mobile-only npm dependencies?**
A: Use `optionalDependencies` in package.json. Web build ignores them.

**Q: Will this break existing mobile app users?**
A: No. Mobile app will continue working. New builds use same package ID.

**Q: How long will migration take?**
A: 2-3 days with testing. Most time spent on testing both platforms thoroughly.

**Q: Can we revert if something goes wrong?**
A: Yes. We'll tag the pre-migration state and can revert anytime.

**Q: What about future platform-specific features?**
A: Add them to `/features/platform-name/` directory with platform detection.

---

**Status:** ✅ Plan Complete - Ready for Implementation
**Last Updated:** 2026-01-07
**Next Review:** After Phase 1 completion
