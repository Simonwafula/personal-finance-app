# Repository Guidelines

## Project Structure & Module Organization
- `backend/` holds Django settings and root URLs; feature apps live at the repo root (`finance/`, `budgeting/`, `savings/`, `investments/`, `debt_planner/`, `wealth/`, `profiles/`, `notifications/`).
- `client/` is the React + Vite frontend; main code is in `client/src/` with `pages/`, `components/`, `api/`, and `features/sms/` for mobile-only SMS detection.
- Templates and static assets are in `templates/` and `staticfiles/` (production collectstatic output).
- Deployment and docs live in `deploy/` and `docs/`.

## Build, Test, and Development Commands
- Backend dev server: `python manage.py runserver 8001` (API on port 8001).
- Backend migrations: `python manage.py makemigrations` and `python manage.py migrate`.
- Backend tests: `python manage.py test` (or `python manage.py test finance`).
- Frontend dev server: `cd client && npm run dev` (Vite on port 5173).
- Frontend lint/type check: `cd client && npm run lint` and `npm run build` (includes `tsc`).
- Web build: `cd client && npm run build:web`.
- Mobile build: `cd client && npm run build:mobile`, then `npm run cap:sync` or `npm run android:debug`.

## Coding Style & Naming Conventions
- Python: 4-space indentation, Django conventions, snake_case for functions and fields.
- TypeScript/React: follow existing code (2-space indentation, double quotes, semicolons) and ESLint (`client/eslint.config.js`).
- File naming follows module intent (e.g., `client/src/pages/TransactionsPage.tsx`).

## Testing Guidelines
- Django tests live in app-level `tests.py` or `tests/` packages; keep tests close to the app they cover.
- Frontend has lint/type checks but no unit test runner configured; add tests alongside features if introduced and update scripts as needed.

## Commit & Pull Request Guidelines
- Recent commits use `type: summary` (e.g., `feat:`, `refactor:`) with short, imperative descriptions; follow that pattern when possible.
- PRs should include a clear description, linked issue (if any), and screenshots for UI changes. Mention web vs mobile impact.

## Security & Configuration Tips
- Store secrets in `.env` (`DJANGO_SECRET_KEY`, `DATABASE_URL`, OAuth keys). Do not commit secrets.
- SQLite is default for dev; PostgreSQL is used in production via `USE_POSTGRES=1`.
