Deployment checklist — Personal Finance App

Overview
--------
This document collects recommended steps and environment settings to deploy the backend (Django + DRF + allauth) and the frontend (Vite React) to production securely.

1) Secrets and environment
- Create a `.env` (or set environment variables in your hosting environment). Use `.env.example` as a template.
- Required variables: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`.
- Configure DB credentials (use Postgres for production). Set `DATABASE_*` vars as appropriate.
- Configure `SOCIAL_AUTH_GOOGLE_CLIENT_ID` and `SOCIAL_AUTH_GOOGLE_SECRET` for Google OAuth.
- Set `SOCIALACCOUNT_LOGIN_REDIRECT_URL` to `https://your-frontend-domain/oauth-callback`.

2) Backend security settings
- Ensure `DEBUG=False` in production.
- Set `ALLOWED_HOSTS` to your backend host(s).
- Use HTTPS. Set `SECURE_SSL_REDIRECT=True` and configure HSTS settings via env vars.
- Set `SESSION_COOKIE_SECURE=True` and `CSRF_COOKIE_SECURE=True`.
- If frontend and backend are on separate domains, set `SESSION_COOKIE_DOMAIN` to the shared parent domain (e.g. `.example.com`) so cookies are sent across subdomains. Prefer serving frontend and backend on the same domain or a subdomain to avoid SameSite cross-site cookie complexity.

3) OAuth and allauth
- In Django admin, create a Social App for Google (Sites -> Social applications).
  - Set the client id/secret and add the site for which it applies.
  - Add authorized redirect URIs in the Google Cloud Console: include the backend callback URLs (if applicable) and the frontend `oauth-callback` value if using popup flow.
- For popup flow, ensure that `SOCIALACCOUNT_LOGIN_REDIRECT_URL` points to the frontend `https://app.example.com/oauth-callback`.

4) Static files and frontend build
- Build frontend assets with `npm run build --prefix client`.
- Serve built assets either via a CDN or via Django's `collectstatic` + WhiteNoise/Gunicorn or via a separate static webserver (recommended for performance).
- If serving frontend from the same backend domain, configure Django `STATICFILES_DIRS` and run `python manage.py collectstatic`.

5) Database migrations and startup
- Run migrations: `python manage.py migrate`.
- Create a superuser: `python manage.py createsuperuser`.
- Configure process manager (gunicorn + systemd, or a container orchestrator); ensure environment variables are provided to the process.

6) Logging, monitoring, and backups
- Configure structured logging and optionally Sentry (`SENTRY_DSN`).
- Ensure database backups and timezone/cron jobs for maintenance.

7) CI/CD
- Add CI steps that run tests, linting, and build the frontend.
- On deploy, build frontend artifacts and copy them to the static files location, run Django migrations, and restart application processes.

8) Testing in staging
- Test the OAuth popup flow end-to-end in a staging environment that mirrors production (HTTPS + proper domains).
- Verify cookies are sent, `GET /api/auth/me/` returns the authenticated user after login, and CSRF is handled correctly.

Notes & common pitfalls
- Cross-site cookies: modern browsers block third-party cookies aggressively. For production it is preferable to host the frontend and backend under the same parent domain (e.g. `app.example.com` and `api.example.com`) and set `SESSION_COOKIE_DOMAIN=.example.com` to avoid SameSite problems.
- If you must use separate top-level domains, you will need `SameSite=None` and `Secure` cookies plus HTTPS everywhere.

If you want, I can:
- Add a `docker-compose.yml` example for quick staging (Postgres + Django + Nginx serving static assets).
- Add a CI workflow (GitHub Actions) that builds the frontend, runs backend tests, and deploys artifacts.
