# Production Deployment Guide - CyberPanel VPS

## Quick Reference

| Component | Path/Value |
|-----------|------------|
| Domain | `finance.mstatilitechnologies.com` |
| Project Dir | `/home/finance.mstatilitechnologies.com/personal-finance-app` |
| Virtual Env | `/home/finance.mstatilitechnologies.com/.venv` |
| Env File | `/home/finance.mstatilitechnologies.com/.env` |
| Gunicorn Service | `finance-app.service` |
| Logs | `/home/finance.mstatilitechnologies.com/logs/` |

---

## Step-by-Step Deployment Instructions

### Phase 1: VPS Initial Setup (One-time)

#### 1.1 SSH into your VPS
```bash
ssh root@your-vps-ip
# or
ssh your-user@your-vps-ip
```

#### 1.2 Create the website in CyberPanel
1. Login to CyberPanel (https://your-vps-ip:8090)
2. Go to **Websites → Create Website**
3. Enter:
   - Domain: `finance.mstatilitechnologies.com`
   - PHP: Select any (we won't use PHP)
   - SSL: Check "Issue SSL" (Let's Encrypt)
4. Click **Create Website**

#### 1.3 Install required system packages
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, pip, and build tools
sudo apt install -y python3 python3-pip python3-venv python3-dev \
    build-essential libpq-dev git nodejs npm

# Verify installations
python3 --version  # Should be 3.10+
node --version     # Should be 18+
npm --version
```

#### 1.4 Setup PostgreSQL database
```bash
# Install PostgreSQL if not installed
sudo apt install -y postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'YOUR_STRONG_DB_PASSWORD';
ALTER ROLE finance_user SET client_encoding TO 'utf8';
ALTER ROLE finance_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE finance_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
\c finance_db
GRANT ALL ON SCHEMA public TO finance_user;
EOF
```

---

### Phase 2: Clone and Configure Project

#### 2.1 Navigate to website directory and clone repo
```bash
cd /home/finance.mstatilitechnologies.com

# Clone your repository
git clone https://github.com/YOUR_USERNAME/personal-finance-app.git

# Or if repo already exists
cd personal-finance-app
git pull origin main
```

#### 2.2 Create Python virtual environment
```bash
cd /home/finance.mstatilitechnologies.com
python3 -m venv .venv
source .venv/bin/activate
```

#### 2.3 Create the environment file
```bash
nano /home/finance.mstatilitechnologies.com/.env
```

Add the following (replace with your actual values):
```env
# ============================================
# Django Core Settings
# ============================================
DJANGO_SECRET_KEY=your-super-secret-key-generate-a-new-one
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=finance.mstatilitechnologies.com,www.finance.mstatilitechnologies.com

# ============================================
# Database Configuration (PostgreSQL)
# ============================================
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=YOUR_STRONG_DB_PASSWORD
DATABASE_HOST=localhost
DATABASE_PORT=5432

# ============================================
# Security & CORS
# ============================================
CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com,https://www.finance.mstatilitechnologies.com
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com,https://www.finance.mstatilitechnologies.com

# ============================================
# Google OAuth (Create NEW credentials for production!)
# Get from: https://console.cloud.google.com/apis/credentials
# ============================================
GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-google-secret
SOCIALACCOUNT_LOGIN_REDIRECT_URL=https://finance.mstatilitechnologies.com/oauth-callback

# ============================================
# Email Configuration (for password reset)
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@mstatilitechnologies.com

# ============================================
# Logging
# ============================================
LOG_DIR=/home/finance.mstatilitechnologies.com/logs
```

**Generate a new Django secret key:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

#### 2.4 Set proper file permissions
```bash
# Set ownership
sudo chown -R finance.mstatilitechnologies.com:finance.mstatilitechnologies.com /home/finance.mstatilitechnologies.com/

# Secure the .env file
chmod 600 /home/finance.mstatilitechnologies.com/.env

# Create logs directory
mkdir -p /home/finance.mstatilitechnologies.com/logs
```

---

### Phase 3: Deploy Application

#### 3.1 Run the deploy script
```bash
cd /home/finance.mstatilitechnologies.com/personal-finance-app
chmod +x deploy.sh
./deploy.sh
```

This script will:
- ✅ Activate virtual environment
- ✅ Install Python dependencies
- ✅ Build React frontend
- ✅ Copy index.html to templates with correct paths
- ✅ Run Django migrations
- ✅ Collect static files

#### 3.2 Create Django superuser (first deploy only)
```bash
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
cd /home/finance.mstatilitechnologies.com/personal-finance-app
python manage.py createsuperuser
```

---

### Phase 4: Setup Gunicorn Service

#### 4.1 Create the systemd service file
```bash
sudo nano /etc/systemd/system/finance-app.service
```

Add the following:
```ini
[Unit]
Description=Finance App Gunicorn Daemon
After=network.target

[Service]
User=finan1713
Group=finan1713
WorkingDirectory=/home/finance.mstatilitechnologies.com/personal-finance-app
EnvironmentFile=/home/finance.mstatilitechnologies.com/.env
ExecStart=/home/finance.mstatilitechnologies.com/.venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /home/finance.mstatilitechnologies.com/logs/gunicorn-access.log \
    --error-logfile /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log \
    backend.wsgi:application
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

#### 4.2 Enable and start the service
```bash
sudo systemctl daemon-reload
sudo systemctl enable finance-app
sudo systemctl start finance-app

# Check status
sudo systemctl status finance-app
```

---

### Phase 5: Configure OpenLiteSpeed Proxy (CyberPanel)

#### Option A: Using CyberPanel GUI (Recommended)

1. Go to CyberPanel → **Websites** → **List Websites**
2. Click **Manage** on `finance.mstatilitechnologies.com`
3. Go to **vHost Conf** tab
4. In the **External App** section at the bottom, add:

```apache
extprocessor financebackend {
    type                    proxy
    address                 127.0.0.1:8000
    maxConns                100
    pcKeepAliveTimeout      60
    initTimeout             60
    retryTimeout            0
    respBuffer              0
}
```

5. Then in the **Context** section, add these contexts (order matters!):

**Context 1 - API:**
```apache
context /api/ {
    type                    proxy
    handler                 financebackend
    addDefaultCharset       off
}
```

**Context 2 - Admin:**
```apache
context /admin/ {
    type                    proxy
    handler                 financebackend
    addDefaultCharset       off
}
```

**Context 3 - Accounts (OAuth):**
```apache
context /accounts/ {
    type                    proxy
    handler                 financebackend
    addDefaultCharset       off
}
```

**Context 4 - Static files:**
```apache
context /static/ {
    type                    proxy
    handler                 financebackend
    addDefaultCharset       off
}
```

6. Click **Save** and then restart OpenLiteSpeed:
```bash
sudo /usr/local/lsws/bin/lswsctrl restart
```

#### Option B: Edit vhost.conf Directly

```bash
sudo nano /usr/local/lsws/conf/vhosts/finance.mstatilitechnologies.com/vhost.conf
```

Add the proxy configuration inside the `<VirtualHost>` block.

---

### Phase 6: Setup Google OAuth (Production)

**CRITICAL: Create NEW OAuth credentials for production!**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `Finance App Production`
5. **Authorized JavaScript origins:**
   ```
   https://finance.mstatilitechnologies.com
   ```
6. **Authorized redirect URIs:**
   ```
   https://finance.mstatilitechnologies.com/accounts/google/login/callback/
   ```
7. Copy the Client ID and Secret to your `.env` file

---

### Phase 7: SSL Certificate

CyberPanel should have issued SSL automatically. If not:

1. Go to CyberPanel → **SSL** → **Manage SSL**
2. Select `finance.mstatilitechnologies.com`
3. Click **Issue SSL**

---

## Post-Deployment Verification

### Test the deployment:

```bash
# 1. Test health endpoint
curl https://finance.mstatilitechnologies.com/api/health/
# Expected: {"status": "healthy", "service": "finance-app"}

# 2. Test API endpoint (should return 401 - unauthenticated)
curl https://finance.mstatilitechnologies.com/api/auth/me/
# Expected: 401 or redirect

# 3. Test admin access
curl -I https://finance.mstatilitechnologies.com/admin/
# Expected: 200 or 302 redirect

# 4. Test frontend loads
curl -I https://finance.mstatilitechnologies.com/
# Expected: 200
```

### Browser tests:
1. ✅ Visit https://finance.mstatilitechnologies.com - Should see React app
2. ✅ Try login page - Should work
3. ✅ Try Google OAuth - Should redirect properly
4. ✅ Try password reset - Should send email
5. ✅ Check /admin/ - Should show Django admin

---

## Ongoing Maintenance

### Deploying Updates

After pushing changes to GitHub:

```bash
cd /home/finance.mstatilitechnologies.com/personal-finance-app
git pull origin main
./deploy.sh
```

### Manual Commands

```bash
# Activate environment
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
cd /home/finance.mstatilitechnologies.com/personal-finance-app

# View logs
sudo journalctl -u finance-app -f
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-access.log
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log

# Restart services
sudo systemctl restart finance-app
sudo /usr/local/lsws/bin/lswsctrl restart

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Django shell
python manage.py shell

# Database backup
pg_dump -U finance_user finance_db > backup_$(date +%Y%m%d).sql
```

---

## Troubleshooting

### Issue: 502 Bad Gateway
```bash
# Check if Gunicorn is running
sudo systemctl status finance-app

# Check Gunicorn logs
tail -50 /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log

# Restart Gunicorn
sudo systemctl restart finance-app
```

### Issue: Static files not loading
```bash
# Re-collect static files
cd /home/finance.mstatilitechnologies.com/personal-finance-app
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
python manage.py collectstatic --noinput --clear
```

### Issue: OAuth not working
1. Verify `GOOGLE_CLIENT_ID` in `.env`
2. Check redirect URIs in Google Console match exactly
3. Check `/accounts/` is proxied correctly:
```bash
curl -I https://finance.mstatilitechnologies.com/accounts/login/
```

### Issue: CSRF errors
Ensure these are set in `.env`:
```env
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com
```

### Issue: Database connection failed
```bash
# Test PostgreSQL connection
PGPASSWORD=YOUR_PASSWORD psql -h localhost -U finance_user -d finance_db -c "SELECT 1;"
```

---

## Security Checklist

- [ ] Generated new `DJANGO_SECRET_KEY`
- [ ] Created new Google OAuth credentials (not dev credentials)
- [ ] Set `DJANGO_DEBUG=False`
- [ ] SSL certificate active
- [ ] `.env` file has restricted permissions (600)
- [ ] Firewall configured (allow only 80, 443, 22)
- [ ] Database has strong password
- [ ] Regular backups configured

---

## File Structure on Server

```
/home/finance.mstatilitechnologies.com/
├── .env                          # Environment variables (chmod 600)
├── .venv/                        # Python virtual environment
├── logs/                         # Application logs
│   ├── gunicorn-access.log
│   ├── gunicorn-error.log
│   └── django.log
├── personal-finance-app/         # Your Django project
│   ├── manage.py
│   ├── deploy.sh
│   ├── requirements.txt
│   ├── backend/                  # Django settings
│   ├── client/                   # React frontend source
│   │   └── dist/                 # Built frontend
│   ├── templates/
│   │   └── index.html            # Frontend entry (copied from dist)
│   ├── staticfiles/              # Collected static files
│   └── ...                       # Other Django apps
└── public_html/                  # CyberPanel default (not used)
```

---

## Nginx (Alternative to OpenLiteSpeed)

If you prefer Nginx instead of OpenLiteSpeed (or want an alternative), save the following server block to `/etc/nginx/sites-available/finance_app` and enable it with `sudo ln -s /etc/nginx/sites-available/finance_app /etc/nginx/sites-enabled/`.

Replace certificate paths with your actual certbot/Let's Encrypt paths.

```nginx
# Nginx config -- /etc/nginx/sites-available/finance_app
server {
    listen 80;
    listen [::]:80;
    server_name finance.mstatilitechnologies.com www.finance.mstatilitechnologies.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name finance.mstatilitechnologies.com www.finance.mstatilitechnologies.com;

    # SSL certs (certbot path shown)
    ssl_certificate /etc/letsencrypt/live/finance.mstatilitechnologies.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/finance.mstatilitechnologies.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    client_max_body_size 20M;

    # Serve Django static files directly
    location /static/ {
        alias /home/finance.mstatilitechnologies.com/personal-finance-app/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, must-revalidate";
    }

    location /media/ {
        alias /home/finance.mstatilitechnologies.com/personal-finance-app/media/;
        expires 30d;
    }

    # Proxy API requests to Gunicorn
    location /api/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_redirect off;
    }

    # Proxy admin
    location /admin/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8000/admin/;
        proxy_redirect off;
    }

    # Proxy accounts (OAuth)
    location /accounts/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8000/accounts/;
        proxy_redirect off;
    }

    # Serve SPA (React) from client/dist
    location / {
        try_files $uri $uri/ /index.html;
        root /home/finance.mstatilitechnologies.com/personal-finance-app/client/dist;
    }

    proxy_read_timeout 120;
    proxy_connect_timeout 60;
    proxy_send_timeout 60;

    access_log /var/log/nginx/finance_app.access.log;
    error_log /var/log/nginx/finance_app.error.log;
}
```

After creating the file:

```bash
sudo ln -s /etc/nginx/sites-available/finance_app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
