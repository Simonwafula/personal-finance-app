# Deployment Guide - Personal Finance App

This guide covers deploying the Django + React application to production.

---

## Table of Contents
1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Environment Configuration](#2-environment-configuration)
3. [VPS Setup (CyberPanel)](#3-vps-setup-cyberpanel)
4. [Backend Deployment](#4-backend-deployment)
5. [Frontend Deployment](#5-frontend-deployment)
6. [OpenLiteSpeed Proxy Configuration](#6-openlitespeed-proxy-configuration)
7. [SSL & Security](#7-ssl--security)
8. [Troubleshooting](#8-troubleshooting)
9. [Maintenance Commands](#9-maintenance-commands)

---

## 1. Pre-Deployment Checklist

### Rotate All Secrets
Before deploying, generate new production credentials:

**Django Secret Key:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

**Google OAuth (New Production Credentials):**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create a NEW OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs:
     - `https://your-domain.com/accounts/google/login/callback/`
     - `https://your-domain.com/oauth-callback`
3. Copy new client ID + secret
4. Remove any localhost URIs from production credentials

### Backend Security Settings
- `DEBUG=False` in production
- `ALLOWED_HOSTS` set to your domain(s)
- HTTPS enabled with `SECURE_SSL_REDIRECT=True`
- `SESSION_COOKIE_SECURE=True` and `CSRF_COOKIE_SECURE=True`

---

## 2. Environment Configuration

Create `.env` file in your home directory (NOT in public_html):

**Location:** `/home/your-domain/.env`

```bash
# Django Core
DJANGO_SECRET_KEY=your-generated-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Database (PostgreSQL recommended)
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# CORS & CSRF
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
CSRF_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=your-prod-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-prod-oauth-secret
SOCIALACCOUNT_LOGIN_REDIRECT_URL=https://your-domain.com/oauth-callback

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@domain.com

# Session/Cookie Security
SESSION_COOKIE_DOMAIN=.your-domain.com
SECURE_SSL_REDIRECT=True
```

**Set correct permissions:**
```bash
sudo chown your-domain:your-domain /home/your-domain/.env
sudo chmod 600 /home/your-domain/.env
```

---

## 3. VPS Setup (CyberPanel)

### Create PostgreSQL Database
```bash
sudo -u postgres psql
CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'your-strong-password';
ALTER ROLE finance_user SET client_encoding TO 'utf8';
ALTER ROLE finance_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE finance_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
\q
```

### Create Log Directory
```bash
mkdir -p /home/your-domain/logs
chown -R your-domain:your-domain /home/your-domain/logs
```

---

## 4. Backend Deployment

### Install Dependencies
```bash
cd /home/your-domain/personal-finance-app
pip install -r requirements.txt
```

### Run Migrations
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### Configure Gunicorn Service
Create `/etc/systemd/system/finance-app.service`:
```ini
[Unit]
Description=Finance App Gunicorn
After=network.target

[Service]
User=your-domain
Group=your-domain
WorkingDirectory=/home/your-domain/personal-finance-app
EnvironmentFile=/home/your-domain/.env
ExecStart=/home/your-domain/.venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /home/your-domain/logs/gunicorn-access.log \
    --error-logfile /home/your-domain/logs/gunicorn-error.log \
    backend.wsgi:application

Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable finance-app
sudo systemctl start finance-app
sudo systemctl status finance-app
```

---

## 5. Frontend Deployment

### Build Frontend
```bash
cd /home/your-domain/personal-finance-app/client

# Create production environment
cat > .env.production << EOF
VITE_API_BASE_URL=https://your-domain.com/api
VITE_GOOGLE_CLIENT_ID=your-prod-client-id.apps.googleusercontent.com
EOF

# Build
npm install
npm run build

# Deploy to document root
cp -r dist/* /home/your-domain/public_html/
```

---

## 6. OpenLiteSpeed Proxy Configuration

**IMPORTANT:** The `/accounts/` path must proxy to Django for Google OAuth to work!

### Using CyberPanel GUI
1. Go to CyberPanel → Websites → List Websites
2. Select your domain → Manage → Rewrite Rules
3. Add these rules (ORDER MATTERS):

```apache
RewriteEngine On

# Proxy /accounts/ to Django (for Google OAuth)
RewriteRule ^/accounts/(.*)$ http://127.0.0.1:8000/accounts/$1 [P,L]

# Proxy API requests to Django
RewriteRule ^/api/(.*)$ http://127.0.0.1:8000/api/$1 [P,L]

# Proxy admin to Django
RewriteRule ^/admin/(.*)$ http://127.0.0.1:8000/admin/$1 [P,L]

# Serve React frontend for everything else
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

**Restart OpenLiteSpeed:**
```bash
sudo systemctl restart lsws
```

### Verify Proxy
```bash
# Should reach Django (not LiteSpeed error)
curl -I https://your-domain.com/accounts/login/
curl https://your-domain.com/api/auth/me/
```

---

## 7. SSL & Security

### Enable SSL (CyberPanel)
- Websites → List Websites → Manage SSL
- Issue Let's Encrypt certificate

### Security Hardening Checklist
- [ ] Firewall: Allow only 80, 443, 22
- [ ] Set strong SSH keys, disable password auth
- [ ] Enable fail2ban
- [ ] Set up monitoring (Sentry, UptimeRobot)
- [ ] Configure database backups
- [ ] Review ALLOWED_HOSTS, CORS, CSRF origins

---

## 8. Troubleshooting

### Service Won't Start

**Check status:**
```bash
sudo systemctl status finance-app
sudo journalctl -u finance-app -f
```

**Common issues:**

1. **`.env` file in wrong location:**
   ```bash
   # Move to correct location
   sudo mv /home/your-domain/public_html/.env /home/your-domain/.env
   sudo chown your-domain:your-domain /home/your-domain/.env
   sudo chmod 600 /home/your-domain/.env
   ```

2. **User doesn't exist (status=217/USER):**
   ```bash
   # Check file ownership
   ls -la /home/your-domain/
   # Update service file with correct user
   ```

3. **Database connection error:**
   ```bash
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

### CSRF Token Errors

**Symptom:** `{"detail":"CSRF Failed: CSRF token missing"}`

**Fix:** Check `.env` has correct origins:
```bash
CSRF_TRUSTED_ORIGINS=https://your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com
```
Then restart: `sudo systemctl restart finance-app`

### OAuth 403 Error

**Symptom:** Google OAuth returns 403 or doesn't redirect properly.

**Fix:**
1. Ensure `/accounts/` is proxied to Django (see Section 6)
2. Verify Google Cloud Console has correct redirect URIs
3. In Django Admin → Social Applications, ensure Google app is configured
4. Check `SOCIALACCOUNT_LOGIN_REDIRECT_URL` in `.env`

### Bad Request (400) Error

**Symptom:** Direct curl returns 400 Bad Request

**Fix:** Add Host header (this is normal behavior):
```bash
curl -H "Host: your-domain.com" http://127.0.0.1:8000/api/auth/me/
```

### Check Django Logs
```bash
tail -f /home/your-domain/logs/gunicorn-error.log
```

### Test API Endpoints
```bash
# Test registration
curl -X POST https://your-domain.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "username": "testuser", "password": "TestPass123!"}'

# Test login
curl -X POST https://your-domain.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "TestPass123!"}'
```

---

## 9. Maintenance Commands

```bash
# View logs
sudo journalctl -u finance-app -f
tail -f /home/your-domain/logs/gunicorn-error.log

# Restart service
sudo systemctl restart finance-app

# Apply migrations
cd /home/your-domain/personal-finance-app
source /home/your-domain/.venv/bin/activate
python manage.py migrate

# Update frontend
cd client && npm run build && cp -r dist/* ../public_html/

# Collect static files
python manage.py collectstatic --noinput
```

### Rollback Plan
```bash
# Stop service
sudo systemctl stop finance-app

# Revert to previous version
git checkout <previous-commit>

# Restart
sudo systemctl start finance-app
```

---

## Static Files

Django static files are managed with WhiteNoise:
- `python manage.py collectstatic` collects files to `staticfiles/`
- WhiteNoise middleware serves them efficiently in production
- No separate web server needed for static files

---

## Post-Deployment Tests

1. **Health Check:** `curl https://your-domain.com/api/health`
2. **OAuth Flow:** Sign in with Google from login page
3. **Password Reset:** Test forgot password flow
4. **API Auth:** Verify protected endpoints require authentication
