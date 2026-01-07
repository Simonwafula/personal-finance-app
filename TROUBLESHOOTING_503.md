# Troubleshooting 503 Errors on Login

## Issue
API endpoint returns 503 Service Unavailable error when trying to login or access any API endpoint.

**Symptoms:**
- Web frontend loads fine (static files work)
- API calls return 503 errors
- Login fails with 503

**Root Cause:**
The Django backend (Gunicorn) is not running or not accessible to the web server (OpenLiteSpeed).

---

## Quick Diagnosis

SSH into your VPS and run these commands:

```bash
# 1. Check if Gunicorn is running
sudo systemctl status gunicorn

# Expected: "active (running)"
# If shows "inactive (dead)" or "failed", Gunicorn is not running
```

---

## Solution 1: Restart Gunicorn (Most Common Fix)

```bash
# Start Gunicorn
sudo systemctl start gunicorn

# Check status
sudo systemctl status gunicorn

# Should show: "active (running)"

# Check logs if it fails to start
sudo journalctl -u gunicorn -n 50 --no-pager
```

**If Gunicorn starts successfully:**
```bash
# Test API endpoint
curl http://127.0.0.1:8001/api/auth/login/

# Should return: {"email":["This field is required."],...}
# Not a 503 error
```

---

## Solution 2: Check Gunicorn Configuration

If Gunicorn fails to start, check the configuration:

```bash
# View Gunicorn service file
sudo cat /etc/systemd/system/gunicorn.service

# Expected content (adjust paths as needed):
# [Unit]
# Description=gunicorn daemon
# After=network.target
#
# [Service]
# User=www-data  # or your user
# Group=www-data
# WorkingDirectory=/path/to/personal-finance-app
# ExecStart=/path/to/venv/bin/gunicorn \
#     --workers 3 \
#     --bind 127.0.0.1:8001 \
#     backend.wsgi:application
#
# [Install]
# WantedBy=multi-user.target
```

**Common Issues:**

### Issue 2.1: Wrong Working Directory
```bash
# Fix: Update WorkingDirectory in gunicorn.service
sudo nano /etc/systemd/system/gunicorn.service

# Change:
WorkingDirectory=/path/to/personal-finance-app  # Should be root of your Django project

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
```

### Issue 2.2: Wrong Python Path
```bash
# Fix: Ensure virtual environment is activated
sudo nano /etc/systemd/system/gunicorn.service

# Change ExecStart to use full path:
ExecStart=/home/username/personal-finance-app/venv/bin/gunicorn \
  --workers 3 \
  --bind 127.0.0.1:8001 \
    backend.wsgi:application

sudo systemctl daemon-reload
sudo systemctl restart gunicorn
```

### Issue 2.3: Module Not Found Error
```bash
# Check Gunicorn logs
sudo journalctl -u gunicorn -n 100 --no-pager

# If you see "ModuleNotFoundError: No module named 'backend'"
# This means Gunicorn is running from wrong directory

# Fix:
cd /path/to/personal-finance-app
ls -la  # Should show: manage.py, backend/, finance/, client/, etc.

# Update gunicorn.service WorkingDirectory to this path
sudo nano /etc/systemd/system/gunicorn.service
```

---

## Solution 3: Check OpenLiteSpeed Proxy Configuration

If Gunicorn is running but still getting 503:

```bash
# 1. Test if Django responds locally
curl http://127.0.0.1:8001/api/auth/login/

# Should work (not 503)

# 2. Check OpenLiteSpeed configuration
sudo cat /usr/local/lsws/conf/vhosts/finance/vhconf.conf

# OR check your vhost config location
cat /path/to/vhost.conf
```

**Expected proxy configuration:**
```apache
context /api/ {
  type                    proxy
  handler                 proxy
  uri                     http://127.0.0.1:8001/
  proxyTimeout            300
}

context /accounts/ {
  type                    proxy
  handler                 proxy
  uri                     http://127.0.0.1:8001/
  proxyTimeout            300
}

context /admin/ {
  type                    proxy
  handler                 proxy
  uri                     http://127.0.0.1:8001/
  proxyTimeout            300
}
```

**If proxy config is wrong:**
```bash
# Edit vhost config
sudo nano /path/to/your/vhost.conf

# Add/fix proxy contexts (see above)

# Restart OpenLiteSpeed
sudo systemctl restart lsws
```

---

## Solution 4: Check Django App Errors

```bash
# View recent Django/Gunicorn errors
sudo journalctl -u gunicorn -n 100 --no-pager

# Common errors:

# 4.1: Database connection error
# Error: "django.db.utils.OperationalError: FATAL: password authentication failed"
# Fix: Check DATABASE_URL in .env or environment

# 4.2: Missing dependencies
# Error: "ModuleNotFoundError: No module named 'rest_framework'"
# Fix: Reinstall requirements
cd /path/to/personal-finance-app
source venv/bin/activate
pip install -r requirements.txt

# 4.3: Migration not applied
# Error: "django.db.utils.ProgrammingError: relation does not exist"
# Fix: Run migrations
python manage.py migrate

# Restart Gunicorn after fixing
sudo systemctl restart gunicorn
```

---

## Solution 5: Enable Debug Logging (Temporary)

```bash
# Edit Gunicorn service to add verbose logging
sudo nano /etc/systemd/system/gunicorn.service

# Change ExecStart to:
ExecStart=/path/to/venv/bin/gunicorn \
  --workers 3 \
  --bind 127.0.0.1:8001 \
    --log-level debug \
    --access-logfile /var/log/gunicorn/access.log \
    --error-logfile /var/log/gunicorn/error.log \
    backend.wsgi:application

# Create log directory
sudo mkdir -p /var/log/gunicorn
sudo chown www-data:www-data /var/log/gunicorn

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart gunicorn

# View logs
sudo tail -f /var/log/gunicorn/error.log
```

---

## Complete Diagnostic Script

Save this as `check_backend.sh` and run it:

```bash
#!/bin/bash
echo "=== Backend Diagnostic ==="

echo -e "\n1. Gunicorn Status:"
sudo systemctl status gunicorn | head -10

echo -e "\n2. Gunicorn Process:"
ps aux | grep gunicorn | grep -v grep

echo -e "\n3. Port 8001 Listening:"
sudo netstat -tlnp | grep :8001 || sudo ss -tlnp | grep :8001

echo -e "\n4. Test Local API:"
curl -I http://127.0.0.1:8001/api/auth/login/ 2>&1 | head -5

echo -e "\n5. Recent Gunicorn Logs:"
sudo journalctl -u gunicorn -n 20 --no-pager

echo -e "\n6. Django App Location:"
ls -la /path/to/personal-finance-app/manage.py 2>&1

echo -e "\n7. Virtual Environment:"
/path/to/venv/bin/python --version 2>&1

echo -e "\n=== End Diagnostic ==="
```

---

## Most Likely Fix (90% of cases)

```bash
# Just restart Gunicorn
sudo systemctl restart gunicorn

# Check it started
sudo systemctl status gunicorn

# Test API
curl http://127.0.0.1:8001/api/auth/login/

# Should return JSON, not 503
```

---

## After Fixing

Once Gunicorn is running:

```bash
# 1. Test local API
# 1. Test local API
curl http://127.0.0.1:8001/api/auth/login/
# Should return: {"email":["This field is required."],...}

# 2. Test public API
curl https://finance.mstatilitechnologies.com/api/auth/login/
# Should also return JSON (not 503)

# 3. Try login from frontend
# Open browser: https://finance.mstatilitechnologies.com
# Try to login - should work now
```

---

## Prevent Future 503 Errors

```bash
# Enable Gunicorn to start on boot
sudo systemctl enable gunicorn

# Monitor Gunicorn status
sudo systemctl status gunicorn

# Set up automatic restart on failure
sudo nano /etc/systemd/system/gunicorn.service

# Add to [Service] section:
Restart=always
RestartSec=10

# Reload
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
```

---

## Quick Commands Summary

```bash
# Check status
sudo systemctl status gunicorn

# Start
sudo systemctl start gunicorn

# Restart
sudo systemctl restart gunicorn

# View logs
sudo journalctl -u gunicorn -n 50 --no-pager

# Follow logs live
sudo journalctl -u gunicorn -f

# Test local API
# 1. Test local API
curl http://127.0.0.1:8001/api/auth/login/

# Test public API
curl https://finance.mstatilitechnologies.com/api/auth/login/
```

---

## Need More Help?

Share the output of these commands:

```bash
# 1. Gunicorn status
sudo systemctl status gunicorn

# 2. Gunicorn logs
sudo journalctl -u gunicorn -n 50 --no-pager

# 3. Port check
sudo netstat -tlnp | grep :8001

# 4. Local API test
curl -I http://127.0.0.1:8001/api/auth/login/
```

---

**Status:** This is a production server issue, not related to Phase 1 code changes.
**Fix:** Restart Gunicorn service on your VPS.
