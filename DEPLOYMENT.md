# Deployment Guide - Personal Finance App

Deploy Django + React on OpenLiteSpeed/CyberPanel.

## Your Server Configuration

| Setting | Value |
|---------|-------|
| **Domain** | `finance.mstatilitechnologies.com` |
| **Server IP** | `67.217.62.77` |
| **CyberPanel User** | `finan1713` |
| **Home Directory** | `/home/finance.mstatilitechnologies.com` |
| **App Directory** | `/home/finance.mstatilitechnologies.com/public_html` |
| **Virtual Environment** | `/home/finance.mstatilitechnologies.com/.venv` |
| **Environment File** | `/home/finance.mstatilitechnologies.com/.env` |
| **Logs** | `/home/finance.mstatilitechnologies.com/logs` |

---

## Quick Commands

```bash
# SSH into server
ssh root@67.217.62.77

# Quick update after code changes
cd /home/finance.mstatilitechnologies.com/public_html && ./deploy-direct.sh

# View logs
journalctl -u finance-app -f
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log

# Restart services
systemctl restart finance-app
/usr/local/lsws/bin/lswsctrl restart
```

---

## 1. Initial Setup (First Time Only)

### 1.1 Install Systemd Service

```bash
# Copy the service file
cp /home/finance.mstatilitechnologies.com/public_html/deploy/systemd/finance-app.service /etc/systemd/system/

# Reload, enable, and start
systemctl daemon-reload
systemctl enable finance-app
systemctl start finance-app
```

### 1.2 Verify Environment File

Ensure `/home/finance.mstatilitechnologies.com/.env` contains:

```bash
# Django
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=finance.mstatilitechnologies.com,www.finance.mstatilitechnologies.com

# Database
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Security
CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
SOCIALACCOUNT_LOGIN_REDIRECT_URL=https://finance.mstatilitechnologies.com/oauth-callback
```

### 1.3 Build Frontend

```bash
cd /home/finance.mstatilitechnologies.com/public_html/client

# Create production env
cat > .env.production << EOF
VITE_API_BASE_URL=https://finance.mstatilitechnologies.com/api
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
EOF

npm install && npm run build
```

### 1.4 Django Setup

```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
set -a && source /home/finance.mstatilitechnologies.com/.env && set +a

python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

---

## 2. CyberPanel Rewrite Rules (Critical!)

Go to **CyberPanel → Websites → finance.mstatilitechnologies.com → Manage → Rewrite Rules**

Add these rules:

```apache
RewriteEngine On

# Proxy to Django
RewriteRule ^/api/(.*)$ http://127.0.0.1:8000/api/$1 [P,L]
RewriteRule ^/admin/(.*)$ http://127.0.0.1:8000/admin/$1 [P,L]
RewriteRule ^/accounts/(.*)$ http://127.0.0.1:8000/accounts/$1 [P,L]
RewriteRule ^/static/(.*)$ http://127.0.0.1:8000/static/$1 [P,L]

# Serve React assets
RewriteRule ^/assets/(.*)$ /client/dist/assets/$1 [L]

# React SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/admin/
RewriteCond %{REQUEST_URI} !^/accounts/
RewriteCond %{REQUEST_URI} !^/static/
RewriteRule ^(.*)$ /client/dist/index.html [L]
```

Then restart: `/usr/local/lsws/bin/lswsctrl restart`

---

## 3. SSL Certificate

In CyberPanel:
1. Go to **SSL → Manage SSL**
2. Select `finance.mstatilitechnologies.com`
3. Click **Issue SSL**

---

## 4. Google OAuth Setup

### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Set:
   - Authorized JavaScript origins: `https://finance.mstatilitechnologies.com`
   - Authorized redirect URIs: `https://finance.mstatilitechnologies.com/accounts/google/login/callback/`

### Django Admin
1. Go to `https://finance.mstatilitechnologies.com/admin/`
2. **Social Applications → Add**
3. Provider: Google, add Client ID and Secret

---

## 5. Troubleshooting

### Service Won't Start
```bash
systemctl status finance-app
journalctl -u finance-app -n 50
```

### 502 Bad Gateway
```bash
# Check Gunicorn
curl http://127.0.0.1:8000/api/

# Restart
systemctl restart finance-app
```

### CSRF Errors
Verify `CSRF_TRUSTED_ORIGINS` in `.env` includes `https://` prefix.

### Static Files Not Loading
```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
python manage.py collectstatic --noinput
```

---

## 6. Maintenance

### Update Code
```bash
cd /home/finance.mstatilitechnologies.com/public_html
./deploy-direct.sh
```

### Backup Database
```bash
pg_dump -U finance_user finance_db > backup_$(date +%Y%m%d).sql
```

### View Logs
```bash
# Gunicorn
journalctl -u finance-app -f

# Error log
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log

# OLS
tail -f /usr/local/lsws/logs/error.log
```

---

## File Structure

```
/home/finance.mstatilitechnologies.com/
├── .env                          # Django environment variables
├── .venv/                        # Python virtual environment
├── logs/                         # Gunicorn logs
└── public_html/                  # Git root / Document root
    ├── manage.py
    ├── backend/                  # Django settings
    ├── finance/                  # Django apps...
    ├── client/
    │   ├── src/                  # React source
    │   └── dist/                 # Built React app (index.html)
    ├── staticfiles/              # Django collected static
    ├── deploy/
    │   ├── openlitespeed/        # OLS config files
    │   └── systemd/              # Service file
    ├── deploy-ols.sh             # Full deployment script
    └── deploy-direct.sh          # Quick update script
```
