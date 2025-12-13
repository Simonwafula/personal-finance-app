# Google OAuth 403 Error Fix

## Problem
Google OAuth returns 403 error because LiteSpeed is not proxying `/accounts/` requests to Django backend.

## Root Cause
The `/accounts/google/login/callback/` path (used by django-allauth) is not being proxied to Django on port 8000. LiteSpeed is serving its own 403 page instead.

---

## Quick Fix Steps

### 1. Verify Django Backend is Running

**First, check if the service is running:**
```bash
sudo systemctl status finance-app
```

**If you see "Failed to load environment" or "Connection refused":**

The `.env` file is in the wrong location or missing. The systemd service expects it at:
```
/home/finance.mstatilitechnologies.com/.env
```

**NOT in public_html!**

**Fix the .env file location:**
```bash
# If .env is in public_html, move it to the correct location
sudo mv /home/finance.mstatilitechnologies.com/public_html/.env /home/finance.mstatilitechnologies.com/.env

# Or create it directly in the right place
sudo nano /home/finance.mstatilitechnologies.com/.env
```

**Minimum required .env contents:**
```bash
DJANGO_SECRET_KEY=your-generated-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=finance.mstatilitechnologies.com

DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=localhost
DATABASE_PORT=5432

GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-client-secret
SOCIALACCOUNT_LOGIN_REDIRECT_URL=https://finance.mstatilitechnologies.com/oauth-callback

CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com
```

**Set correct permissions:**
```bash
sudo chown finance.mstatilitechnologies.com:finance.mstatilitechnologies.com /home/finance.mstatilitechnologies.com/.env
sudo chmod 600 /home/finance.mstatilitechnologies.com/.env
```

**Now restart the service:**
```bash
sudo systemctl restart finance-app
sudo systemctl status finance-app
```

**Check logs:**
```bash
sudo journalctl -u finance-app -n 50

# Test Django directly
curl http://127.0.0.1:8000/accounts/login/
# Should return Django response, not error
```

### 2. Configure Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

**Edit your OAuth 2.0 Client ID:**
- Authorized JavaScript origins:
  ```
  https://finance.mstatilitechnologies.com
  ```
- Authorized redirect URIs (both are needed):
  ```
  https://finance.mstatilitechnologies.com/accounts/google/login/callback/
  https://finance.mstatilitechnologies.com/oauth-callback
  ```

**Save changes** - OAuth credentials may take 5-10 minutes to propagate.

### 3. Update Django Admin Social App

SSH into your server:
```bash
# Access Django shell
cd /home/finance.mstatilitechnologies.com/personal-finance-app
source .venv/bin/activate
python manage.py shell
```

In the shell:
```python
from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site

# Get or create the Google social app
google_app, created = SocialApp.objects.get_or_create(
    provider='google',
    defaults={
        'name': 'Google',
        'client_id': 'YOUR-PRODUCTION-CLIENT-ID.apps.googleusercontent.com',
        'secret': 'YOUR-PRODUCTION-SECRET',
    }
)

# If it already exists, update it
if not created:
    google_app.client_id = 'YOUR-PRODUCTION-CLIENT-ID.apps.googleusercontent.com'
    google_app.secret = 'YOUR-PRODUCTION-SECRET'
    google_app.save()

# Add your site
site = Site.objects.get(id=1)
site.domain = 'finance.mstatilitechnologies.com'
site.name = 'Finance App'
site.save()

google_app.sites.add(site)
print(f"✅ Google OAuth configured for {site.domain}")
```

**Or via Django Admin:**
1. Go to: https://finance.mstatilitechnologies.com/admin/
2. Navigate to: Sites → Sites
   - Edit site 1: domain = `finance.mstatilitechnologies.com`
3. Navigate to: Social applications → Add social application
   - Provider: Google
   - Name: Google
   - Client id: (your production client ID)
   - Secret key: (your production secret)
   - Sites: Select `finance.mstatilitechnologies.com`
   - Save

### 4. Fix OpenLiteSpeed Proxy Configuration

**⚠️ CRITICAL: This is the most common issue!**

The LiteSpeed 403 error page appears because LiteSpeed is not proxying `/accounts/` requests to Django.

**Method A: Via CyberPanel Rewrite Rules (Recommended)**

1. Go to CyberPanel → Websites → List Websites
2. Click "Manage" next to finance.mstatilitechnologies.com
3. Go to **"Rewrite Rules"** tab (NOT vHost Conf)
4. **DELETE ALL existing rules first**, then add these:

```apache
RewriteEngine On

# Proxy /accounts/ to Django for OAuth (MUST BE FIRST!)
RewriteRule ^accounts/(.*)$ http://127.0.0.1:8000/accounts/$1 [P,L]

# Proxy /api/ to Django
RewriteRule ^api/(.*)$ http://127.0.0.1:8000/api/$1 [P,L]

# Proxy /admin/ to Django  
RewriteRule ^admin/(.*)$ http://127.0.0.1:8000/admin/$1 [P,L]

# Serve static files directly (Django's collected static files)
RewriteCond %{REQUEST_URI} ^/static/
RewriteRule ^(.*)$ /staticfiles/$1 [L]

# Everything else serves React frontend from public_html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

**Important Notes:**
- Do NOT use `^/accounts/` (no leading slash in RewriteRule pattern)
- The `[P,L]` flags mean Proxy and Last (stop processing)
- Order matters - proxy rules MUST come before the index.html fallback
- If your Django app and frontend are BOTH in public_html, the last rule will work automatically

5. Click "Save Rewrite Rules"
6. Restart OpenLiteSpeed:
```bash
sudo systemctl restart lsws
```

**Method B: Edit Config File Directly (Advanced)**

Only use this if Method A doesn't work.

Edit: `/usr/local/lsws/conf/vhosts/finance.mstatilitechnologies.com/vhost.conf`

Find the `<VirtualHost>` section and add these context blocks:

```apache
context /accounts/ {
  type                    proxy
  handler                 1
  addDefaultCharset       off
  proxyConfig             http://127.0.0.1:8000/accounts/
}

context /api/ {
  type                    proxy
  handler                 1  
  addDefaultCharset       off
  proxyConfig             http://127.0.0.1:8000/api/
}

context /admin/ {
  type                    proxy
  handler                 1
  addDefaultCharset       off
  proxyConfig             http://127.0.0.1:8000/admin/
}
```

**Method C: Enable Proxy Module in OpenLiteSpeed**

If the above still doesn't work, ensure proxy module is enabled:

1. Go to OpenLiteSpeed WebAdmin: `https://your-server-ip:7080`
2. Navigate to: Server Configuration → Modules
3. Ensure `mod_proxy` is enabled
4. Save and gracefully restart

**Or via command line:**
```bash
# Check if proxy module exists
ls -la /usr/local/lsws/modules/

# Enable proxy in OpenLiteSpeed config
sudo nano /usr/local/lsws/conf/httpd_config.conf

# Look for module section and ensure this exists:
# module mod_proxy {
#   ls_enabled 1
# }

# Restart
sudo systemctl restart lsws
```

Restart:
```bash
/usr/local/lsws/bin/lswsctrl restart
```

### 5. Test the Fix

**IMPORTANT: Test in this order!**

**Test 1: Verify Django is running**
```bash
# From your server
curl http://127.0.0.1:8000/api/auth/me/

# Should return JSON like: {"detail":"Not authenticated"}
# NOT "Connection refused"
```

**Test 2: Verify proxy is working**
```bash
# Test accounts endpoint from server
curl -I https://finance.mstatilitechnologies.com/accounts/login/

# Should return HTTP 200 or 302 (redirect)
# Should NOT return 403 or show LiteSpeed error
```

**Test 3: Verify it returns Django HTML, not LiteSpeed error**
```bash
curl https://finance.mstatilitechnologies.com/accounts/login/ | head -20

# Should show Django/allauth HTML
# Should NOT show "Proudly powered by LiteSpeed"
```

**Test 4: Test OAuth flow in browser**
1. **Clear browser cache and cookies** for finance.mstatilitechnologies.com
2. Open Developer Tools (F12) → Network tab
3. Go to: https://finance.mstatilitechnologies.com/login
4. Click "Sign in with Google"
5. Watch Network tab for any 403 errors
6. Should redirect to Google consent screen
7. After approving, should redirect back and log you in

**Test 5: Check what's being returned**
```bash
# Compare these two:

# Direct to Django (should work)
curl -L http://127.0.0.1:8000/accounts/login/ | grep -i "django\|allauth"

# Through LiteSpeed (should also work)
curl -L https://finance.mstatilitechnologies.com/accounts/login/ | grep -i "django\|allauth"

# Both should show Django content, not LiteSpeed 403
```

**If you see LiteSpeed 403 error in any of these tests, the proxy is NOT working!**

---

## Troubleshooting

### Still getting 403?

**Check LiteSpeed is proxying:**
```bash
# Test directly from server
curl -v http://127.0.0.1:8000/accounts/login/

# Compare with public URL
curl -v https://finance.mstatilitechnologies.com/accounts/login/

# Both should show similar Django responses
```

**Check Django logs:**
```bash
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-access.log
```

**Check LiteSpeed logs:**
```bash
tail -f /usr/local/lsws/logs/error.log
```

### Error: "redirect_uri_mismatch"

This means Google Cloud Console URIs don't match. Ensure you have BOTH:
- `https://finance.mstatilitechnologies.com/accounts/google/login/callback/`
- `https://finance.mstatilitechnologies.com/oauth-callback`

Note the trailing slash on the first one!

### CORS errors?

Check your `.env` file has:
```bash
CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com
```

Then restart:
```bash
sudo systemctl restart finance-app
```

### Frontend getting wrong redirect?

Check `client/.env.production`:
```bash
VITE_GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
```

Rebuild frontend:
```bash
cd client
npm run build
cp -r dist/* /home/finance.mstatilitechnologies.com/public_html/
```

---

## Verification Checklist

- [ ] Google Cloud Console has correct redirect URIs
- [ ] Django backend is running (systemctl status finance-app)
- [ ] Social App is configured in Django admin
- [ ] LiteSpeed proxy rules are in place for /accounts/
- [ ] LiteSpeed has been restarted
- [ ] Can access https://finance.mstatilitechnologies.com/accounts/login/
- [ ] OAuth flow completes without 403 errors
- [ ] User is redirected to /oauth-callback after Google login
- [ ] User lands on /dashboard after successful auth

---

## Common Mistakes

1. **Forgot trailing slash**: `/accounts/google/login/callback/` needs the trailing `/`
2. **Wrong handler in LiteSpeed**: Use `handler 1` not `handler lsapi:django`
3. **Proxy rules in wrong order**: `/accounts/` must come before other rules
4. **Forgot to restart LiteSpeed**: Always restart after config changes
5. **Using dev credentials in production**: Must create NEW OAuth client for production
6. **Social App not linked to correct site**: Check Django admin → Social applications

---

## Still Not Working?

**Get detailed debugging info:**
```bash
# Check if port 8000 is listening
sudo netstat -tlnp | grep 8000

# Check Django is responding
curl http://127.0.0.1:8000/api/auth/me/

# Check environment variables are loaded
sudo systemctl show finance-app | grep Environment

# Check proxy is hitting Django
# (watch gunicorn logs while testing OAuth)
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-access.log
```

Then try OAuth again and watch the logs.
