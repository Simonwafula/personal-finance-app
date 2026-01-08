# Production Deployment Guide

This guide covers deploying the Personal Finance application to a production VPS environment.

## 🌐 Production Environment

**Domain:** https://finance.mstatilitechnologies.com
**Server:** Ubuntu 22.04 LTS VPS
**Web Server:** OpenLiteSpeed
**WSGI Server:** Gunicorn
**Database:** PostgreSQL 14+
**Process Manager:** Systemd

## 📋 Prerequisites

### Server Requirements
- Ubuntu 22.04 LTS or later
- Minimum 2GB RAM
- 20GB storage
- Root or sudo access
- Domain name pointed to server IP

### Required Software
```bash
# System packages
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nodejs npm git

# OpenLiteSpeed (optional, or use Nginx)
wget -O - http://rpms.litespeedtech.com/debian/enable_lst_debain_repo.sh | sudo bash
sudo apt install openlitespeed
```

## 🔧 Initial Server Setup

### 1. Create Application User

```bash
sudo adduser finance
sudo usermod -aG sudo finance
su - finance
```

### 2. Set Up PostgreSQL Database

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'your_secure_password';
ALTER ROLE finance_user SET client_encoding TO 'utf8';
ALTER ROLE finance_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE finance_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
\q
```

### 3. Clone Repository

```bash
cd /home
git clone https://github.com/Simonwafula/personal-finance-app.git finance.mstatilitechnologies.com
cd finance.mstatilitechnologies.com
```

## 🐍 Backend Deployment

### 1. Create Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

### 3. Configure Environment Variables

Create `.env` file:

```bash
cat > .env << 'EOF'
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this-in-production
ALLOWED_HOSTS=finance.mstatilitechnologies.com,www.finance.mstatilitechnologies.com

# Database
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Security
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com,https://www.finance.mstatilitechnologies.com
CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF

chmod 600 .env
```

### 4. Run Migrations

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### 6. Test Gunicorn

```bash
gunicorn backend.wsgi:application --bind 127.0.0.1:8001
```

Press Ctrl+C after verifying it works.

### 7. Create Systemd Service

```bash
sudo nano /etc/systemd/system/finance-app.service
```

Add:

```ini
[Unit]
Description=Personal Finance Gunicorn Application
After=network.target

[Service]
Type=notify
User=finance
Group=finance
WorkingDirectory=/home/finance.mstatilitechnologies.com
Environment="PATH=/home/finance.mstatilitechnologies.com/.venv/bin"
EnvironmentFile=/home/finance.mstatilitechnologies.com/.env
ExecStart=/home/finance.mstatilitechnologies.com/.venv/bin/gunicorn \
          --workers 3 \
          --bind 127.0.0.1:8001 \
          --timeout 120 \
          --access-logfile /var/log/finance-app/access.log \
          --error-logfile /var/log/finance-app/error.log \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Create log directory:

```bash
sudo mkdir -p /var/log/finance-app
sudo chown finance:finance /var/log/finance-app
```

Enable and start service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable finance-app
sudo systemctl start finance-app
sudo systemctl status finance-app
```

## ⚛️ Frontend Deployment

### 1. Install Node Dependencies

```bash
cd client
npm install
```

### 2. Build Production Bundle

```bash
# For web deployment (without mobile features)
npm run build:web

# Output will be in client/dist/
```

### 3. Copy Index Template

```bash
# Copy built index.html to Django templates
cp dist/index.html ../templates/index.html
```

### 4. Verify Build

```bash
ls -lh dist/assets/
# Should see optimized JS and CSS files
```

## 🌐 Web Server Configuration

### Option A: OpenLiteSpeed

#### 1. Configure Virtual Host

```bash
sudo nano /usr/local/lsws/conf/vhosts/finance/vhost.conf
```

Use configuration from `deploy/openlitespeed/vhost.conf`:

```apache
docRoot                   /home/finance.mstatilitechnologies.com/client/dist
enableGzip                1
enableBrCache             1

context / {
  type                    proxy
  handler                 http://127.0.0.1:8001
  addDefaultCharset       off
}

context /api/ {
  type                    proxy
  handler                 http://127.0.0.1:8001
  addDefaultCharset       off
}

context /assets/ {
  type                    NULL
  location                $DOC_ROOT/assets/
  allowBrowse             1
  extraHeaders            <<<END_HEADERS
Cache-Control: public, max-age=31536000, immutable
END_HEADERS
}

context /admin/ {
  type                    proxy
  handler                 http://127.0.0.1:8001
  addDefaultCharset       off
}

rewrite  {
  enable                  1
  rules                   <<<END_rules
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/admin/
RewriteCond %{REQUEST_URI} !^/assets/
RewriteCond %{REQUEST_URI} !^/static/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
END_rules
}
```

#### 2. Restart OpenLiteSpeed

```bash
sudo /usr/local/lsws/bin/lswsctrl restart
```

### Option B: Nginx (Alternative)

```nginx
server {
    listen 80;
    server_name finance.mstatilitechnologies.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name finance.mstatilitechnologies.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend static files
    location / {
        root /home/finance.mstatilitechnologies.com/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files
    location /static/ {
        alias /home/finance.mstatilitechnologies.com/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Assets with long cache
    location /assets/ {
        alias /home/finance.mstatilitechnologies.com/client/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔒 SSL/TLS Setup

### Using Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx

# For Nginx
sudo certbot --nginx -d finance.mstatilitechnologies.com

# For OpenLiteSpeed (manual)
sudo certbot certonly --standalone -d finance.mstatilitechnologies.com
# Then configure OLS to use the certificates
```

## 🔄 Deployment Updates

### Quick Update Script

Create `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying Personal Finance App..."

# Navigate to project directory
cd /home/finance.mstatilitechnologies.com

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Backend updates
echo "🐍 Updating backend..."
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Frontend updates
echo "⚛️ Building frontend..."
cd client
npm install
npm run build:web
cp dist/index.html ../templates/index.html
cd ..

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart finance-app
sudo /usr/local/lsws/bin/lswsctrl restart

echo "✅ Deployment complete!"
```

Make executable:

```bash
chmod +x deploy.sh
```

Run deployment:

```bash
./deploy.sh
```

## 📊 Monitoring & Logs

### View Application Logs

```bash
# Gunicorn logs
sudo journalctl -u finance-app -f

# Access logs
tail -f /var/log/finance-app/access.log

# Error logs
tail -f /var/log/finance-app/error.log

# OpenLiteSpeed logs
tail -f /usr/local/lsws/logs/error.log
```

### Database Backups

Create backup script `backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/finance/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U finance_user finance_db | gzip > $BACKUP_DIR/finance_db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "finance_db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: finance_db_$DATE.sql.gz"
```

Schedule with cron:

```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/finance/backup-db.sh
```

## 🧪 Health Checks

### API Health Endpoint

```bash
# Check if API is responding
curl -f https://finance.mstatilitechnologies.com/api/auth/login/ || echo "API Down"

# Check Gunicorn
sudo systemctl is-active finance-app
```

## 🔧 Troubleshooting

### Backend Not Starting

```bash
# Check service status
sudo systemctl status finance-app

# Check logs
sudo journalctl -u finance-app -n 50 --no-pager

# Test Gunicorn manually
cd /home/finance.mstatilitechnologies.com
source .venv/bin/activate
gunicorn backend.wsgi:application --bind 127.0.0.1:8001
```

### Frontend Not Loading

```bash
# Verify build files exist
ls -la client/dist/

# Check web server configuration
sudo /usr/local/lsws/bin/lswsctrl configtest

# Check web server logs
tail -f /usr/local/lsws/logs/error.log
```

### Database Connection Issues

```bash
# Test database connection
sudo -u postgres psql finance_db

# Verify credentials in .env match database
# Check PostgreSQL is running
sudo systemctl status postgresql
```

### 503 Errors

1. Check Gunicorn is running: `sudo systemctl status finance-app`
2. Verify port 8001 is listening: `sudo netstat -tulpn | grep 8001`
3. Check firewall: `sudo ufw status`
4. Review error logs

## 📱 Mobile App Deployment

For Android APK distribution:

1. Build release APK (see [MOBILE_BUILD_GUIDE.md](MOBILE_BUILD_GUIDE.md))
2. Sign with release keystore
3. Upload to GitHub Releases or distribute directly

GitHub Actions will automatically build APK on version tags.

## 🚦 Performance Optimization

### Enable Caching

```python
# backend/settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### Database Optimization

```bash
# PostgreSQL tuning (in /etc/postgresql/14/main/postgresql.conf)
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
```

### Gunicorn Workers

```bash
# Rule of thumb: (2 x CPU cores) + 1
# For 2 core VPS: workers = 5
```

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured in `.env`
- [ ] Database created and migrated
- [ ] Superuser account created
- [ ] Static files collected
- [ ] Frontend built for production
- [ ] SSL certificate installed
- [ ] Web server configured
- [ ] Gunicorn service running
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] Database backups scheduled
- [ ] Domain DNS configured correctly
- [ ] CORS and CSRF settings correct
- [ ] Secret key is truly secret and unique

## 🔐 Security Hardening

```bash
# Enable firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable password authentication for SSH
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd

# Keep system updated
sudo apt update && sudo apt upgrade -y
```

---

**Last Updated:** January 2026
**Version:** 1.0.0-mobile
**Status:** Production Ready
