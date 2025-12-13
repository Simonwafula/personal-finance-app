# Production Deployment Guide - finance.mstatilitechnologies.com

## Pre-Deployment Checklist

### 1. Rotate ALL Exposed Secrets (URGENT)
Your current credentials are publicly exposed. Generate new ones:

**Supabase:**
- Go to Supabase Dashboard → Settings → API
- Regenerate `anon/public` key
- Regenerate service role key (if used server-side)
- Update connection pool password

**Google OAuth:**
- Go to Google Cloud Console → APIs & Services → Credentials
- Create a NEW OAuth 2.0 Client ID for production:
  - Authorized JavaScript origins: `https://finance.mstatilitechnologies.com`
  - Authorized redirect URIs: 
    - `https://finance.mstatilitechnologies.com/accounts/google/login/callback/`
    - `https://finance.mstatilitechnologies.com/oauth-callback`
- Copy new client ID + secret

**Django Secret Key:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

---

## VPS Setup (CyberPanel)

### 2. Create PostgreSQL Database
In CyberPanel or via CLI:
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

### 3. Set Environment Variables
Create `/home/finance.mstatilitechnologies.com/.env`:
```bash
DJANGO_SECRET_KEY=your-generated-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=finance.mstatilitechnologies.com,www.finance.mstatilitechnologies.com

DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com,https://www.finance.mstatilitechnologies.com
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com,https://www.finance.mstatilitechnologies.com

GOOGLE_CLIENT_ID=your-prod-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-prod-oauth-secret
SOCIALACCOUNT_LOGIN_REDIRECT_URL=https://finance.mstatilitechnologies.com/oauth-callback

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@mstatilitechnologies.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@mstatilitechnologies.com

SESSION_COOKIE_DOMAIN=.mstatilitechnologies.com
SECURE_SSL_REDIRECT=True
```

### 4. Deploy Backend
```bash
cd /home/finance.mstatilitechnologies.com/personal-finance-app

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### 5. Configure Gunicorn Service
Create `/etc/systemd/system/finance-app.service`:
```ini
[Unit]
Description=Finance App Gunicorn
After=network.target

[Service]
User=finance
Group=finance
WorkingDirectory=/home/finance.mstatilitechnologies.com/personal-finance-app
EnvironmentFile=/home/finance.mstatilitechnologies.com/.env
ExecStart=/home/finance.mstatilitechnologies.com/.venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/home/finance.mstatilitechnologies.com/finance.sock \
    backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable finance-app
sudo systemctl start finance-app
sudo systemctl status finance-app
```

### 6. Configure Nginx in CyberPanel
Add to your site's Nginx config (CyberPanel → Websites → Manage → Rewrite Rules):
```nginx
location /api/ {
    proxy_pass http://unix:/home/finance.mstatilitechnologies.com/finance.sock;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /admin/ {
    proxy_pass http://unix:/home/finance.mstatilitechnologies.com/finance.sock;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /accounts/ {
    proxy_pass http://unix:/home/finance.mstatilitechnologies.com/finance.sock;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /static/ {
    alias /home/finance.mstatilitechnologies.com/personal-finance-app/staticfiles/;
}
```

### 7. Build and Deploy Frontend
```bash
cd /home/finance.mstatilitechnologies.com/personal-finance-app/client

# Create .env.production with rotated keys
cat > .env.production << EOF
VITE_SUPABASE_URL=https://byewwkicwbcupuwnaili.supabase.co
VITE_SUPABASE_ANON_KEY=your-rotated-anon-key
VITE_API_BASE_URL=https://finance.mstatilitechnologies.com/api
VITE_GOOGLE_CLIENT_ID=your-prod-client-id.apps.googleusercontent.com
EOF

# Build
npm install
npm run build

# Deploy to document root
cp -r dist/* /home/finance.mstatilitechnologies.com/public_html/
```

### 8. Enable SSL
In CyberPanel:
- Websites → List Websites → Manage SSL
- Issue Let's Encrypt certificate for `finance.mstatilitechnologies.com`

---

## Post-Deployment Tests

### Backend Health Check
```bash
curl https://finance.mstatilitechnologies.com/api/health
```

### OAuth Test
1. Visit https://finance.mstatilitechnologies.com/login
2. Click "Sign in with Google"
3. Should redirect to Google, then back to /oauth-callback
4. Should land on /dashboard if successful

### Password Reset
1. Try "Forgot Password" flow
2. Check email arrives
3. Confirm reset link works

---

## Security Hardening

- [ ] Firewall: Allow only 80, 443, 22 (SSH)
- [ ] Set strong SSH keys, disable password auth
- [ ] Enable CyberPanel firewall & fail2ban
- [ ] Set up monitoring (Sentry, UptimeRobot)
- [ ] Configure backups (database + uploads)
- [ ] Review Django ALLOWED_HOSTS, CORS, CSRF origins
- [ ] Test from different devices/browsers

---

## Rollback Plan

If deployment fails:
```bash
# Stop service
sudo systemctl stop finance-app

# Revert to SQLite dev mode
# Remove DATABASE_ENGINE from .env
# Restart with old settings
```

---

## Maintenance Commands

```bash
# View logs
sudo journalctl -u finance-app -f

# Restart service
sudo systemctl restart finance-app

# Apply migrations
cd /home/finance.mstatilitechnologies.com/personal-finance-app
python manage.py migrate

# Update frontend
cd client && npm run build && cp -r dist/* ../public_html/
```
