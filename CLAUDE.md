# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal finance management system with dual-platform support (Web + Android mobile). Full-stack monorepo with Django REST API backend and React SPA frontend, with native Android SMS transaction detection via Capacitor.

## Commands

### Backend (Django)
```bash
# Development server (runs on port 8001)
python manage.py runserver 8001

# Database operations
python manage.py migrate
python manage.py makemigrations

# Run tests
python manage.py test

# Run tests for specific app
python manage.py test finance
python manage.py test budgeting

# Collect static files (production)
python manage.py collectstatic --noinput
```

### Frontend (React/Vite)
```bash
cd client

# Development server (runs on port 5173, proxies API to 8001)
npm run dev

# Linting and type checking
npm run lint
npm run build   # includes tsc type check

# Production builds
npm run build:web      # Web-only (excludes SMS features)
npm run build:mobile   # Mobile build (includes SMS features)

# Android builds
npm run cap:sync       # Sync web assets to Android
npm run android:debug  # Build debug APK
npm run android:release
```

## Architecture

### Tech Stack
- **Backend**: Django 4.2 + Django REST Framework, PostgreSQL (prod) / SQLite (dev)
- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS, React Router
- **Mobile**: Capacitor 8.0, native Android SMS plugin (Java)

### Backend Structure (Django Apps)
- `backend/` - Project settings, URLs, middleware, auth views
- `finance/` - Core transactions, accounts, categories, tags
- `budgeting/` - Budget management with category allocations
- `wealth/` - Net worth tracking, assets, liabilities, snapshots
- `debt_planner/` - Debt payoff strategies and amortization
- `savings/` - Savings goals
- `investments/` - Investment portfolio tracking
- `profiles/` - User profiles and settings
- `notifications/` - Notification system

### Frontend Structure (`client/src/`)
- `pages/` - Route page components (21 pages)
- `components/` - Reusable UI components
- `api/` - API client layer with Axios (auth.ts, finance.ts, types.ts, etc.)
- `contexts/` - React contexts (AuthContext, ThemeContext, TimeRangeContext)
- `features/sms/` - Mobile-only SMS transaction detection
- `utils/platform.ts` - Platform detection for conditional feature loading

### Platform Detection
```typescript
// Web builds exclude SMS code entirely via VITE_PLATFORM env var
import { Platform } from './utils/platform';
if (Platform.canReadSms()) {
  // Mobile-only SMS features loaded dynamically
}
```

### API Endpoints
- `/api/auth/` - Authentication (login, logout, register, OAuth)
- `/api/finance/` - Transactions, accounts, categories, tags
- `/api/budgeting/` - Budget management
- `/api/wealth/` - Net worth, assets, liabilities
- `/api/debt/` - Debt planning
- `/api/savings/` - Savings goals
- `/api/investments/` - Investment tracking
- `/api/schema/swagger/` - OpenAPI documentation

## Key Files

- `backend/settings.py` - Django settings (database, CORS, auth, apps)
- `backend/urls.py` - Root URL routing for all API endpoints
- `client/vite.config.ts` - Vite build config with API proxy and SMS chunk splitting
- `client/capacitor.config.ts` - Android app configuration
- `client/src/main.tsx` - React app entry with router setup
- `client/android/app/src/main/java/.../plugins/SmsReaderPlugin.java` - Native SMS reader

## Development Notes

### Running Both Servers
Backend must run on port 8001; frontend dev server proxies `/api/*` requests to it.

### Database
- Development: SQLite (default)
- Production: PostgreSQL (configured via `USE_POSTGRES=1` env var)

### Environment Variables
Key vars in `.env`: `DJANGO_SECRET_KEY`, `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### SMS Feature (Mobile Only)
The SMS transaction detection feature parses bank SMS from 19+ financial institutions (M-PESA, KCB, Equity, etc.). Code is in `client/src/features/sms/`. The native plugin is `SmsReaderPlugin.java`.

### Build Output Locations
- Web: `client/dist/`
- Android APK: `client/android/app/build/outputs/apk/debug/app-debug.apk`
