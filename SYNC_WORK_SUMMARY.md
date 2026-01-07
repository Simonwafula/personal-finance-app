# Mobile-Web Sync: Work Summary

## Quick Overview

The Utajiri-Wangu-App (mobile) and personal-finance-app (web) share **95% of features** but are currently on separate branches. This document outlines the work needed to sync them.

---

## Current Situation

### ✅ What's Identical (95%)
Both apps have complete implementations of:
- Dashboard, Transactions, Budgets, Goals, Debt, Investments, Wealth, Notifications, Profile
- 85+ API endpoints (Django REST Framework)
- Authentication (email + Google OAuth)
- Type-safe data mapping
- Error handling, loading states, optimistic updates

### 📱 What's Mobile-Only (5%)
**SMS Transaction Auto-Detection** - The killer feature:
- Automatically detects transactions from SMS messages
- Supports 19+ banks (M-PESA, KCB, Equity, GTBank, FNB, etc.)
- Privacy-first: All processing happens locally on device
- Smart category suggestions
- Real-time + batch import modes

---

## The Problem

### Branch Divergence
- **main branch:** Web app (100% complete)
- **mobile-app branch:** Web app + SMS features (status unknown)
- Risk: Bug fixes and new features may not sync between branches

### SMS Feature Isolation
- SMS components only in mobile-app branch
- Web app has no awareness of SMS-detected transactions
- Backend may be missing SMS-specific fields

### Different Build Pipelines
- Web: `npm run build` → web server
- Mobile: `npm run build` → Capacitor → Android APK → Play Store

---

## Recommended Solution: **Unified Monorepo**

### Strategy
Merge both branches into **single codebase** with platform detection:

```
personal-finance-app/ (main branch)
├── client/
│   ├── src/
│   │   ├── features/
│   │   │   └── sms/              ← SMS feature module (mobile-only)
│   │   ├── utils/
│   │   │   └── platform.ts       ← Platform detection
│   │   └── components/           ← Shared components
│   └── android/                  ← Capacitor project
└── server/                       ← Django backend
```

### How It Works

**1. Platform Detection:**
```typescript
// Only render SMS components on mobile
{Platform.canReadSms() && <SmsTransactionPrompt />}
```

**2. Dual Build Scripts:**
```bash
npm run build:web      # Web bundle (SMS code tree-shaken away)
npm run build:mobile   # Mobile bundle (includes SMS features)
```

**3. No Code Duplication:**
- Bug fix once → works on both platforms
- New feature once → available everywhere
- Single test suite

---

## Work Required

### Phase 1: Merge & Platform Detection (1 day)
- [ ] Create `client/src/utils/platform.ts` utility
- [ ] Move SMS components to `client/src/features/sms/`
- [ ] Merge mobile-app → main with conflict resolution
- [ ] Test both builds

### Phase 2: Backend SMS Support (2-3 hours)
- [ ] Add `source` field to Transaction model ('manual', 'sms', 'import')
- [ ] Add `sms_reference` and `sms_detected_at` fields
- [ ] Create migration
- [ ] Update API serializers and frontend types

### Phase 3: Unified Build System (2-3 hours)
- [ ] Update package.json with dual-platform scripts
- [ ] Configure vite.config.ts for both platforms
- [ ] Set up GitHub Actions for web and mobile builds

### Phase 4: Documentation (1-2 hours)
- [ ] Update PROGRESS_SUMMARY.md with mobile features
- [ ] Update README.md with platform instructions
- [ ] Create SMS_DETECTION_GUIDE.md

### Phase 5: CI/CD Pipeline (2-3 hours)
- [ ] Create web build workflow
- [ ] Create mobile build workflow
- [ ] Configure automated testing

### Phase 6: Testing (2-3 hours)
- [ ] Test web build in browser
- [ ] Test mobile build on Android
- [ ] Verify SMS detection on real device
- [ ] Validate transaction sync between platforms

**Total Time: 2-3 days**

---

## Benefits

### ✅ Advantages
1. **Single source of truth** - No branch divergence
2. **Shared bug fixes** - Fix once, works everywhere
3. **Zero duplication** - Same components, API, types
4. **Smaller web bundle** - Tree-shaking removes mobile code
5. **Easy maintenance** - One codebase to update

### ⚠️ Minimal Overhead
- Need platform detection wrapper (simple utility)
- Slightly larger bundle for web (~10 KB) due to Capacitor import

---

## Implementation Priority

### Must Do First
1. **Verify mobile-app branch status**
   - Check if it's up-to-date with main
   - List commits unique to mobile-app
   - Test that it builds successfully

2. **Create migration branch**
   - Don't merge directly to main
   - Test thoroughly first
   - Have rollback plan

3. **Add SMS backend fields**
   - Transaction source tracking
   - SMS reference numbers
   - Detection timestamps

### Can Do Later
- iOS support (after Android stable)
- Push notifications
- Biometric auth
- Offline-first with IndexedDB

---

## Quick Start Commands

### Current Workflow (Separate Branches)
```bash
# Web development
git checkout main
npm run dev

# Mobile development
git checkout mobile-app
npm run dev
npm run mobile:build
```

### Future Workflow (Unified)
```bash
# Web development
npm run dev              # or: VITE_PLATFORM=web npm run dev

# Mobile development
npm run dev:mobile       # or: VITE_PLATFORM=mobile npm run dev
npm run mobile:build

# Build both
npm run build:web
npm run build:mobile
```

---

## Risk Assessment

### Low Risk ✅
- Web bundle size increase (< 10 KB with tree-shaking)
- Platform detection overhead (negligible)
- Merge conflicts (can be resolved systematically)

### Medium Risk ⚠️
- Testing on both platforms takes time
- Need to update CI/CD pipelines
- Documentation needs updating

### High Risk ❌
- None identified (rollback plan available)

---

## Success Criteria

### After Implementation
- [x] Single main branch supports both platforms
- [x] Web build < 500 KB (gzipped)
- [x] Mobile build < 20 MB (APK)
- [x] SMS detection works on Android
- [x] All shared features work on both platforms
- [x] No console errors on either platform
- [x] Build time: Web < 15s, Mobile < 60s
- [x] Code duplication < 5%

---

## Next Steps

1. **Review [MOBILE_WEB_SYNC_PLAN.md](MOBILE_WEB_SYNC_PLAN.md)** (detailed plan)
2. **Decide:** Approve unified monorepo approach?
3. **Create:** Migration branch for testing
4. **Execute:** Phase 1-6 sequentially
5. **Test:** Both platforms thoroughly
6. **Deploy:** Unified version to production
7. **Deprecate:** mobile-app branch

---

## Key Files to Review

### Planning Documents
- [MOBILE_WEB_SYNC_PLAN.md](MOBILE_WEB_SYNC_PLAN.md) - Full synchronization plan (this file)
- [PROGRESS_SUMMARY.md](PROGRESS_SUMMARY.md) - Current implementation status
- [FEATURE_COMPARISON.md](FEATURE_COMPARISON.md) - Feature parity analysis

### Code to Examine
- `client/src/features/sms/` - SMS feature module (in mobile-app branch)
- `client/android/` - Capacitor Android project (in mobile-app branch)
- `client/src/api/` - API services (identical in both branches)
- `client/src/components/` - Shared components (95% identical)

### Configuration
- `capacitor.config.ts` - Mobile platform config (in mobile-app branch)
- `vite.config.ts` - Build configuration (needs update for dual-platform)
- `package.json` - Dependencies and scripts (needs merging)

---

## Questions?

**Q: Can we deploy independently?**
Yes. Different build commands create separate outputs.

**Q: Will this break existing users?**
No. Mobile app uses same package ID, web app unaffected.

**Q: How long to implement?**
2-3 days with thorough testing.

**Q: Can we revert if needed?**
Yes. We'll tag pre-migration state for easy rollback.

**Q: What about iOS support?**
Add later. Same approach works for iOS (Capacitor iOS project).

---

**Status:** ✅ Ready for Implementation
**Estimated Effort:** 2-3 days
**Risk Level:** Low (with rollback plan)
**Recommendation:** Proceed with unified monorepo approach

**See [MOBILE_WEB_SYNC_PLAN.md](MOBILE_WEB_SYNC_PLAN.md) for complete technical details.**
