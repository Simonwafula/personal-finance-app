# Direct VPS Deployment Guide

This guide explains how to deploy the Personal Finance App directly on a VPS without Docker.

## Prerequisites

- Ubuntu/Debian VPS with sudo access
- Python 3.9+ installed
- PostgreSQL installed and running
- Nginx installed
- Domain pointing to your server
- SSL certificate (Let's Encrypt recommended)

## Initial Setup (One-time)

### 1. Create Application Directory

```bash
sudo mkdir -p /home/finance.mstatilitechnologies.com
cd /home/finance.mstatilitechnologies.com
```

### 2. Clone Repository

```bash
sudo git clone https://github.com/yourusername/personal-finance-app.git
cd personal-finance-app
```

### 3. Create Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

### 4. Configure Environment

```bash
# Copy example file
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Important settings in `.env.production`:**
```env
DJANGO_SECRET_KEY=your-super-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=finance.mstatilitechnologies.com,www.finance.mstatilitechnologies.com

DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=your-secure-password
DATABASE_HOST=localhost  # ← localhost works for direct VPS!
DATABASE_PORT=5432
```

### 5. Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL:
CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
\q
```

### 6. Run Migrations and Collect Static

```bash
source .venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

### 8. Install Systemd Service

```bash
# Copy service file
sudo cp deploy/systemd/finance-app.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable finance-app
sudo systemctl start finance-app

# Check status
sudo systemctl status finance-app
```

### 9. Configure Nginx

```bash
# Copy nginx config
sudo cp deploy/nginx/finance-app.conf /etc/nginx/sites-available/

# Enable site
sudo ln -s /etc/nginx/sites-available/finance-app.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 10. Setup SSL (if not already done)

```bash
# Using certbot
sudo certbot --nginx -d finance.mstatilitechnologies.com -d www.finance.mstatilitechnologies.com
```

### 11. Set Permissions

```bash
sudo chown -R www-data:www-data /home/finance.mstatilitechnologies.com/personal-finance-app
sudo chmod -R 755 /home/finance.mstatilitechnologies.com/personal-finance-app
sudo chmod -R 775 /home/finance.mstatilitechnologies.com/personal-finance-app/logs
sudo chmod -R 775 /home/finance.mstatilitechnologies.com/personal-finance-app/media
```

## Regular Deployments

After initial setup, use the deployment script:

```bash
cd /home/finance.mstatilitechnologies.com/personal-finance-app
chmod +x deploy-direct.sh
./deploy-direct.sh
```

Or manually:

```bash
cd /home/finance.mstatilitechnologies.com/personal-finance-app
git pull
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart finance-app
```

## Useful Commands

### Check Service Status
```bash
sudo systemctl status finance-app
```

### View Logs
```bash
# Service logs
sudo journalctl -u finance-app -f

# Application logs
tail -f /home/finance.mstatilitechnologies.com/personal-finance-app/logs/error.log

# Nginx logs
tail -f /home/finance.mstatilitechnologies.com/personal-finance-app/logs/nginx-error.log
```

### Restart Service
```bash
sudo systemctl restart finance-app
```

### Restart Nginx
```bash
sudo systemctl reload nginx
```

## Troubleshooting

### Service Won't Start

1. Check logs:
```bash
sudo journalctl -u finance-app -n 100 --no-pager
```

2. Check if port is in use:
```bash
sudo lsof -i :8000
```

3. Test manually:
```bash
cd /home/finance.mstatilitechnologies.com/personal-finance-app
source .venv/bin/activate
gunicorn backend.wsgi:application --bind 127.0.0.1:8000
```

### Database Connection Issues

1. Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Test connection:
```bash
psql -h localhost -U finance_user -d finance_db
```

3. Check `.env.production` has correct credentials

### Static Files Not Loading

1. Run collectstatic:
```bash
python manage.py collectstatic --noinput --clear
```

2. Check nginx can access files:
```bash
sudo ls -la /home/finance.mstatilitechnologies.com/personal-finance-app/staticfiles/
```

## Security Checklist

- [ ] Strong `DJANGO_SECRET_KEY` set
- [ ] `DJANGO_DEBUG=False` in production
- [ ] Strong database password
- [ ] SSL certificate installed and valid
- [ ] Firewall configured (allow only 80, 443, 22)
- [ ] Regular backups configured
- [ ] `.env.production` permissions are restricted (600)

## Backup Strategy

```bash
# Database backup
pg_dump -U finance_user -d finance_db > backup_$(date +%Y%m%d).sql

# Full backup
tar -czf finance-app-backup-$(date +%Y%m%d).tar.gz \
  /home/finance.mstatilitechnologies.com/personal-finance-app \
  --exclude='.venv' \
  --exclude='node_modules'
```

## Monitoring

Set up monitoring for:
- Service uptime: `systemctl status finance-app`
- Disk space: `df -h`
- Memory usage: `free -m`
- Log errors: `grep ERROR /home/finance.mstatilitechnologies.com/personal-finance-app/logs/error.log`
