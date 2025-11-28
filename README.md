# Personal Finance App

A small personal finance web app (Django + DRF backend, React + Vite + TypeScript frontend).

## Overview
- Backend: Django + Django REST Framework
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Features: transactions, budgets, debt planner, wealth tracking, aggregated reports, time-range filtering, pagination, dark mode, and quick HUD date toggles.

This repository contains both the backend and frontend in the project root and `client/` respectively.

## Quick start (macOS / zsh)

1. Backend (Python)

```bash
# create & activate venv (example)
python3 -m venv .venv
source .venv/bin/activate

# install backend requirements (adjust if you keep deps elsewhere)
pip install -r requirements.txt

# run migrations and start the Django server
python manage.py migrate
python manage.py runserver
```

Notes:
- If you get `ModuleNotFoundError: No module named 'django'` when running tests, activate the venv and install requirements.

2. Frontend (client)

```bash
# install JS deps
npm install --prefix client

# dev server
npm run dev --prefix client

# build for production
npm run build --prefix client
# preview the built app
npm run preview --prefix client
```

## New/Notable frontend features
- Dark mode with a toggle in the header (persisted in `localStorage`). See `client/src/contexts/ThemeContext.tsx` and CSS variables in `client/src/index.css`.
- HUD quick date toggles in the header (7d/30d/90d/1y) that update the global `TimeRange` context.
- Code-splitting: pages are lazy-loaded (React.lazy) to reduce initial bundle size.
- Pagination UI for transactions (Prev/Next) wired to DRF `LimitOffsetPagination`.
- Skeleton loading component used for charts/tables while data loads.

## Backend changes (API)
- Aggregation endpoints for transactions (`aggregated` and `top_categories`) in `finance/views.py`.
- Serializers for aggregation responses added in `finance/serializers.py`.
- Tests added for aggregation endpoints: `finance/tests_aggregation.py`.

## Running tests

Activate your Python environment (see above), then run:

```bash
python manage.py test finance.tests_aggregation -v 2
```

If Django is not installed in your environment the command will fail with `ModuleNotFoundError` — install dependencies and retry.

## Development notes
- Tailwind dark mode is configured using the `class` strategy in `client/tailwind.config.cjs`.
- The TimeRange context syncs the date range to the URL query params (`?start=YYYY-MM-DD&end=YYYY-MM-DD`).
- If you want a server-side default page size, set `PAGE_SIZE` in Django settings or update the pagination class.

## Next steps (optional enhancements)
- Add more advanced pagination controls (page numbers or jump-to-page).
- Add HUD active-state highlights and keyboard accessibility.
- Add backend unit tests for edge cases and serializers (already added basic aggregation tests).

---
If you'd like, I can: run the backend tests in your environment (you can activate your venv and I will run them), add HUD active-state visuals, or wire a server-side default `PAGE_SIZE` in settings — tell me which you'd prefer next.
*read
