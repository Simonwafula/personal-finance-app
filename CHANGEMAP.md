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

**Base Commit:** `58bd6f761e6fa69122e704310d4e81aee6b1c81e`
**Commit Message:** feat: Complete UI/UX audit and modernize auth pages
**Author:** Simonwafula <Simonwafula@users.noreply.github.com>
**Date:** 2026-01-17 12:12:01

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

6. **✅ Restore glassmorphism theme tokens**
   - Removed duplicate `:root` and `.dark` blocks that overwrote glass variables
   - Restored use of `--glass-border`, `--shadow-elevated`, and gradient tokens
   - Location: `client/src/index.css`

7. **✅ Update public header styling**
   - Added gradient accent line, modernized CTA styling, and refined link colors
   - Location: `client/src/components/PublicHeader.tsx`

8. **✅ Convert landing FAQ to accessible accordion**
   - Added keyboard-friendly toggle buttons with ARIA attributes
   - Balanced FAQ layout with two-column structure on large screens
   - Location: `client/src/pages/LandingPage.tsx`

9. **✅ Isolate app-wide input/button resets to app shell**
   - Scoped global form/button styles to `.app-shell` to avoid overriding auth/public pages
   - Added `app-shell` wrapper on the main layout container
   - Locations: `client/src/index.css`, `client/src/components/Layout.tsx`

10. **✅ Restore auth pages to neumorphism**
    - Rebuilt Login, Signup, Forgot Password, and Reset Password layouts to use neumorphic classes
    - Added neumorphic success message and link button helpers
    - Locations: `client/src/pages/LoginPage.tsx`, `client/src/pages/SignupPage.tsx`, `client/src/pages/ForgotPasswordPage.tsx`, `client/src/pages/ResetPasswordPage.tsx`, `client/src/styles/neumorphism.css`

11. **✅ Remove optional profile fields from signup**
    - Dropped optional phone/country/city section and payload fields
    - Location: `client/src/pages/SignupPage.tsx`

12. **✅ Refine landing page spacing + icon alignment**
    - Increased horizontal gutters for header and landing sections
    - Centered feature icon tiles and tightened emoji alignment
    - Expanded footer padding for better end spacing
    - Locations: `client/src/components/PublicHeader.tsx`, `client/src/pages/LandingPage.tsx`, `client/src/components/PublicFooter.tsx`

13. **✅ Apply Sonko homepage copy + screens grid**
    - Updated hero, features pillars, security copy, FAQs, and final CTA text
    - Replaced preview section with screenshots grid and hero mockup
    - Adjusted header/footer labels to match Sonko navigation
    - Locations: `client/src/pages/LandingPage.tsx`, `client/src/components/PublicHeader.tsx`, `client/src/components/PublicFooter.tsx`

14. **✅ Stabilize Tailwind output + CTA background**
    - Updated Tailwind entry to use v4 `@import "tailwindcss";`
    - Added CTA background phone image
    - Locations: `client/src/index.css`, `client/src/pages/LandingPage.tsx`

15. **✅ Restore Tailwind directives for utilities**
    - Switched Tailwind entry back to `@tailwind base/components/utilities` for reliable compilation
    - Location: `client/src/index.css`

13. **✅ Apply landing page rhythm + mockup previews**
    - Harmonized section paddings and boosted body text contrast
    - Normalized feature card heights and added consistent UI mockups in preview
    - Added a gradient divider into the FAQ section for smoother transitions
    - Location: `client/src/pages/LandingPage.tsx`

14. **✅ Apply Sonko landing copy + imagery updates**
    - Swapped hero, features, security, FAQ, and CTA text to Sonko branding
    - Added hero/dashboard, screen previews, and security illustration assets
    - Updated navbar links and footer copy per Sonko messaging
    - Locations: `client/src/pages/LandingPage.tsx`, `client/src/components/PublicHeader.tsx`, `client/src/components/PublicFooter.tsx`, `client/public/landing/`

16. **✅ Refine Sonko landing layout and CTA**
    - Rebuilt hero layout with Sonko badge, CTA chips, and floating KPI cards
    - Added screens grid with captions, updated security content order, and refreshed FAQ copy
    - Applied consistent section rhythm and CTA background phone image
    - Locations: `client/src/pages/LandingPage.tsx`, `client/src/components/PublicHeader.tsx`, `client/src/components/PublicFooter.tsx`

17. **✅ Align Tailwind v4 import**
    - Switched Tailwind entry back to `@import "tailwindcss";` for v4 PostCSS pipeline
    - Location: `client/src/index.css`

18. **✅ Align landing visuals to dark default**
    - Set dark theme as default and applied dark-aware colors to public header/footer
    - Adjusted landing section backgrounds, stronger blue accents, and balanced screenshots grid
    - Locations: `client/src/contexts/ThemeContext.tsx`, `client/src/pages/LandingPage.tsx`, `client/src/components/PublicHeader.tsx`, `client/src/components/PublicFooter.tsx`

19. **✅ Balance blog colors for light/dark themes**
    - Updated blog index cards, filters, and stats badge to support dark mode contrast
    - Added dark-friendly article layout and sidebar styling with readable link colors
    - Locations: `client/src/pages/BlogPage.tsx`, `client/src/pages/blog/BlogArticleLayout.tsx`, `client/src/components/BlogSidebar.tsx`

20. **✅ Simplify footer column layout**
    - Switched public footer to a 3-column layout for clearer navigation
    - Location: `client/src/components/PublicFooter.tsx`

### Summary:
Aligned the Sonko landing page with the latest copy and imagery, refreshed section rhythm, and updated header/footer navigation labels alongside the CTA background mockup. Restored Tailwind v4 import to get utilities rendering again, synced the landing visuals to the app's dark default theme, balanced blog colors for light/dark modes, and simplified the public footer layout.

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
