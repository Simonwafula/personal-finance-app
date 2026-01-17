# Change Map

This file tracks changes made to the Sonko project with commit hashes and detailed change descriptions.

## How to Use This File

### Before Each Commit:
1. Update the "Current Session (Pending Commit)" section with your changes
2. List each change with checkbox (✅ when completed)
3. Include file paths and detailed descriptions
4. Add a summary of what was accomplished

### After Each Commit:
1. Get the new commit hash: `git rev-parse HEAD`
2. Get commit details: `git log -1 --format="%H%n%s%n%an <%ae>%n%ad" --date=format:"%Y-%m-%d %H:%M:%S"`
3. Move the "Current Session" content to "Previous Commits" section
4. Update the "Base Commit" to the new HEAD commit
5. Clear the "Changes Made" list for the next session

### Template for New Session:

```markdown
## Current Session (Pending Commit)

**Base Commit:** `[commit-hash]`
**Commit Message:** [previous commit message]
**Author:** [author name] <[email]>
**Date:** [YYYY-MM-DD HH:MM:SS]

### Changes Made:

1. **✅ [Task title]**
   - [Detail 1]
   - [Detail 2]
   - Location: `[file-path]`

### Summary:
[Brief overview of changes]
```

---

## Current Session (Pending Commit)

**Base Commit:** `be6219d339203facb4769c93355e7836dd1d3672`
**Commit Message:** feat: Rename app from Mstatili Finance to Sonko
**Author:** Simonwafula <Simonwafula@users.noreply.github.com>
**Date:** 2026-01-17 08:32:57

### Changes Made:

1. **✅ Copy logo files from Downloads to project**
   - Copied `Sonko-across-logo-white.png` → `client/public/logo-horizontal.png`
   - Copied `sonko-down-dark-logo.png` → `client/public/logo-vertical.png`
   - Copied `Sonko-icon.png` → `client/public/logo-icon.png`
   - Copied `Sonko-across-logo-dark.png` → `client/public/logo-horizontal-dark.png`

2. **✅ Update Logo.tsx component to use actual logo images**
   - Replaced SVG code with image-based logo component
   - Added `variant` prop with options: "horizontal", "vertical", "icon"
   - Updated component to load PNG files instead of rendering inline SVG
   - Location: `client/src/components/Logo.tsx`

3. **✅ Update favicon with Sonko icon**
   - Copied `Sonko-icon.png` → `client/public/favicon.png`
   - Updated `client/index.html` to reference `favicon.png` instead of `favicon.svg`

4. **✅ Update Android app icons**
   - Updated all Android app launcher icons across all density folders:
     - `client/android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
     - `client/android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png`
     - `client/android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
     - `client/android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png`
     - `client/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
     - `client/android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png`
     - `client/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
     - `client/android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png`
     - `client/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
     - `client/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png`

5. **✅ Verify logos appear correctly in the app**
   - Updated all Logo component usages to use `variant="icon"`:
     - `client/src/components/PublicHeader.tsx` - Header logo
     - `client/src/pages/LoginPage.tsx` - Login page logo
     - `client/src/pages/SignupPage.tsx` - Signup page logo
     - `client/src/components/AppSidebar.tsx` - Sidebar brand logo
     - `client/src/components/Layout.tsx` - Sidebar and mobile header logos (2 instances)
     - `client/src/components/PublicFooter.tsx` - Footer logo

### Summary:
Updated all branding assets from the old Mstatili Finance logo to the new Sonko logo across web and Android platforms. The Logo component now uses actual PNG image files with support for different variants (horizontal, vertical, icon).

---

## Previous Commits

### Commit: `be6219d339203facb4769c93355e7836dd1d3672`
**Message:** feat: Rename app from Mstatili Finance to Sonko
**Date:** 2026-01-17 08:32:57
**Changes:**
- Renamed application from "Mstatili Finance" to "Sonko"
- Updated text references throughout the codebase

---

*Note: This file should be updated before each commit to track the changes being made.*
