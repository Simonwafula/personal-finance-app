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

## UI/UX Audit Session (2026-01-17)

6. **✅ Created UI_AUDIT.md for tracking UI/UX improvements**
   - Listed all 23 pages in the app with audit structure
   - Defined global UI standards (spacing, colors, typography, components)
   - Location: `UI_AUDIT.md`

7. **✅ Updated LoginPage with modern dark theme**
   - Migrated from neumorphism light theme to glassmorphism dark theme
   - Updated background, inputs, buttons, and error states
   - Added proper focus rings and accessibility improvements
   - Location: `client/src/pages/LoginPage.tsx`

8. **✅ Updated SignupPage with modern dark theme**
   - Consistent styling with LoginPage
   - Collapsible optional fields section
   - Proper form validation UI
   - Location: `client/src/pages/SignupPage.tsx`

9. **✅ Updated ForgotPasswordPage with modern dark theme**
   - Added Logo component
   - Modern success/error message styling
   - Location: `client/src/pages/ForgotPasswordPage.tsx`

10. **✅ Updated ResetPasswordPage with modern dark theme**
    - Added Logo component
    - Invalid link state with dedicated error UI
    - Password visibility toggles
    - Location: `client/src/pages/ResetPasswordPage.tsx`

11. **✅ Updated NotFoundPage with consistent styling**
    - Changed to full min-h-screen with bg-slate-950 background
    - Enhanced decorative background blur circles
    - Gradient text for 404 number
    - Location: `client/src/pages/NotFoundPage.tsx`

12. **✅ Audited all remaining pages (all found to be well-styled)**
    - Landing Page: Modern glassmorphism, responsive, proper heading hierarchy
    - Privacy/Terms Pages: Glassmorphism cards, consistent with landing page
    - Dashboard: CSS variables, KPI cards, chart containers
    - Transactions: Mobile cards, desktop table, filter panel
    - Budgets: Progress bars, budget health indicators
    - Accounts: Summary cards, responsive grid
    - Wealth: Tabbed interface, net worth chart
    - Savings: Goals/tracker tabs, milestone indicators
    - Investments: Dynamic form fields, pie chart
    - Debt Planner: Dual tabs, payoff charts
    - Categories: Category/tag management, quick add section
    - Profile: Multi-tab settings, neumorphic inputs (intentional)
    - Notifications: Filter form, pagination, level indicators
    - Reports: Period selection, charts, CSV/PDF export
    - Subscriptions: Forecast chart, category breakdown
    - Blog: Light theme (public page), category filter
    - OAuth Callback: Minimal styling (utility page)

### Summary (UI Audit Session):
Completed comprehensive UI/UX audit of all 23 pages. Modernized 4 auth pages (Login, Signup, ForgotPassword, ResetPassword) from neumorphism to glassmorphism dark theme. Updated NotFoundPage for consistency. All other pages were found to be well-styled with modern dark theme, CSS variables, responsive layouts, and proper component usage. Created UI_AUDIT.md as permanent documentation.

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
