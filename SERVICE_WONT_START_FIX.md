# Quick Fix: Service Won't Start

## Problem
```
Failed to load environment
Connection refused on port 8000
```

## Solution

### Step 1: Move .env to Correct Location

The `.env` file must be at:
```
/home/finance.mstatilitechnologies.com/.env
```

**NOT in public_html!**

```bash
# Move it if it's in the wrong place
sudo mv /home/finance.mstatilitechnologies.com/public_html/.env /home/finance.mstatilitechnologies.com/.env

# Set correct permissions
sudo chown finance.mstatilitechnologies.com:finance.mstatilitechnologies.com /home/finance.mstatilitechnologies.com/.env
sudo chmod 600 /home/finance.mstatilitechnologies.com/.env
```

### Step 2: Verify .env Contents

```bash
sudo cat /home/finance.mstatilitechnologies.com/.env
```

Should contain at minimum:
```bash
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=finance.mstatilitechnologies.com

DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
SOCIALACCOUNT_LOGIN_REDIRECT_URL=https://finance.mstatilitechnologies.com/oauth-callback

CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com
```

### Step 3: Restart Service

```bash
sudo systemctl restart finance-app
sudo systemctl status finance-app
```

Should show:
```
Active: active (running)
```

### Step 4: Test

```bash
# Test with proper Host header
curl -H "Host: finance.mstatilitechnologies.com" http://127.0.0.1:8000/api/auth/me/

# Should return JSON like: {"detail":"Authentication credentials were not provided."}
# Or if using CSRF: {"detail":"CSRF Failed: CSRF token missing"}

# NOT "Connection refused" or "Bad Request (400)"
```

**If you see "Bad Request (400)":** Django is running but needs Host header. This is normal!

**To fix, test with:**
```bash
# Add Host header to bypass ALLOWED_HOSTS check
curl -H "Host: finance.mstatilitechnologies.com" http://127.0.0.1:8000/api/auth/me/

# Should now return proper JSON response
```

---

## If Still Failing

### Error: status=217/USER

This means the user specified in the service file doesn't exist.

**Step 1: Find the correct user**
```bash
# Check who owns the files
ls -la /home/finance.mstatilitechnologies.com/

# Check what users exist
cat /etc/passwd | grep finance

# Or check current user
whoami

# Common users in CyberPanel: root, cyberpanel, www-data
```

**Step 2: Update the service file with correct user**

First, find your actual username:
```bash
ls -la /home/finance.mstatilitechnologies.com/
# Look at the owner column - it shows the real username (e.g., finan6368)
```

Then update the service file:
```bash
sudo nano /etc/systemd/system/finance-app.service
```

**IMPORTANT: Based on your directory listing, use the actual user shown in `ls -la`**

For example, if the owner is `finan6368:finan6368`, use this:

```ini
[Unit]
Description=Finance App Gunicorn
After=network.target

[Service]
User=finan6368
Group=finan6368
WorkingDirectory=/home/finance.mstatilitechnologies.com/public_html
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

**IMPORTANT NOTE: WorkingDirectory Path**

The `WorkingDirectory` must point to where your Django project is located:
- If Django app is in `public_html`: use `/home/finance.mstatilitechnologies.com/public_html`
- If Django app is in a subfolder like `personal-finance-app`: use that full path

To verify where your Django app is:
```bash
# Look for manage.py
find /home/finance.mstatilitechnologies.com -name "manage.py" -type f
```

**CRITICAL: Fix file ownership**

Since .env and .venv are owned by root, change them to match the service user:
```bash
# Replace finan6368 with your actual username from ls -la
sudo chown -R finan6368:finan6368 /home/finance.mstatilitechnologies.com/.env
sudo chown -R finan6368:finan6368 /home/finance.mstatilitechnologies.com/.venv
sudo chown -R finan6368:finan6368 /home/finance.mstatilitechnologies.com/public_html
sudo chown -R finan6368:finan6368 /home/finance.mstatilitechnologies.com/logs

# Keep .env secure
sudo chmod 600 /home/finance.mstatilitechnologies.com/.env
```

**Alternative: Run as root (if ownership changes don't work)**

If you keep getting permission errors, you can run as root:

```ini
[Service]
User=root
Group=root
```

But fix ownership is the better approach.

**Step 3: Reload and restart**
```bash
sudo systemctl daemon-reload
sudo systemctl restart finance-app
sudo systemctl status finance-app
```

### Other Common Issues

**Check the service file:**
```bash
sudo cat /etc/systemd/system/finance-app.service
```

Should have:
```ini
EnvironmentFile=/home/finance.mstatilitechnologies.com/.env
```

**Check if virtual environment exists:**
```bash
ls -la /home/finance.mstatilitechnologies.com/.venv/bin/gunicorn
```

**If venv doesn't exist, create it:**
```bash
cd /home/finance.mstatilitechnologies.com/public_html
python3 -m venv /home/finance.mstatilitechnologies.com/.venv
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
pip install -r requirements.txt
```

**Check if app directory exists:**
```bash
ls -la /home/finance.mstatilitechnologies.com/public_html/manage.py
```

**Test gunicorn manually:**
```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
export $(cat /home/finance.mstatilitechnologies.com/.env | xargs)
gunicorn backend.wsgi:application --bind 127.0.0.1:8000
```

If manual test works but service doesn't, it's a permission or user issue.
