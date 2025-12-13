# Login & Signup Errors - Debugging Guide

## Service is Running ✅

Now let's fix the login/signup functionality.

---

## Step 1: Check Django Logs

```bash
# Watch the logs in real-time
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log

# Or check recent errors
tail -50 /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log
```

Keep this running in one terminal while testing login in the browser.

---

## Step 2: Check Database Setup

**Has the database been migrated?**
```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
export $(cat /home/finance.mstatilitechnologies.com/.env | xargs)

# Run migrations
python manage.py migrate

# Check if tables exist
python manage.py showmigrations

# All should show [X] marks, not [ ] empty boxes
```

---

## Step 3: Test API Endpoints Directly

**Test registration endpoint:**
```bash
curl -X POST https://finance.mstatilitechnologies.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -H "Referer: https://finance.mstatilitechnologies.com/" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

**Expected responses:**
- ✅ Success: `{"id":1,"email":"test@example.com",...}`
- ❌ Error: Look at the error message

**Test login endpoint:**
```bash
curl -X POST https://finance.mstatilitechnologies.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -H "Referer: https://finance.mstatilitechnologies.com/" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

---

## Step 4: Common Issues & Fixes

### Issue 1: CSRF Token Errors

**Symptom:** `{"detail":"CSRF Failed: CSRF token missing"}`

**Fix:** Check CSRF_TRUSTED_ORIGINS in .env:
```bash
sudo nano /home/finance.mstatilitechnologies.com/.env

# Should have:
CSRF_TRUSTED_ORIGINS=https://finance.mstatilitechnologies.com
CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com
```

Then restart:
```bash
sudo systemctl restart finance-app
```

### Issue 2: Database Connection Error

**Symptom:** `OperationalError: could not connect to server`

**Fix:** Check PostgreSQL is running:
```bash
sudo systemctl status postgresql

# If not running:
sudo systemctl start postgresql

# Test database connection:
sudo -u postgres psql -c "\l" | grep finance_db

# If database doesn't exist, create it:
sudo -u postgres psql
CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
\q
```

Then run migrations:
```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
python manage.py migrate
```

### Issue 3: Missing Static Files / Frontend Not Loading

**Symptom:** Frontend looks broken, no styling

**Check if frontend is built:**
```bash
ls -la /home/finance.mstatilitechnologies.com/public_html/index.html

# Should exist and show React build files
```

**If missing, build frontend:**
```bash
cd /home/finance.mstatilitechnologies.com/public_html/client
npm install
npm run build

# Copy to public_html root
cp -r dist/* /home/finance.mstatilitechnologies.com/public_html/
```

### Issue 4: CORS Errors in Browser Console

**Symptom:** Browser console shows: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Fix:** Update .env:
```bash
CORS_ALLOWED_ORIGINS=https://finance.mstatilitechnologies.com
DJANGO_ALLOWED_HOSTS=finance.mstatilitechnologies.com
```

Restart:
```bash
sudo systemctl restart finance-app
```

### Issue 5: 500 Internal Server Error

**Check the full error:**
```bash
tail -100 /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log
```

Common causes:
- Missing environment variables
- Database migration not run
- Missing Python packages
- SECRET_KEY not set

---

## Step 5: Browser Console Debugging

Open browser DevTools (F12) → Console tab while testing:

**Look for:**
- ❌ Red errors (network failures, CORS, etc.)
- 🟨 Yellow warnings
- ✅ Successful API calls should show 200/201 status codes

**Network tab:**
- Click on failed requests
- Check Response tab for error details
- Check Headers tab for CORS headers

---

## Step 6: Create Test User via Django Admin

**Create superuser:**
```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
python manage.py createsuperuser

# Follow prompts to create admin user
```

**Access admin panel:**
```
https://finance.mstatilitechnologies.com/admin/
```

Log in with superuser credentials and verify:
1. Sites → Check domain is correct
2. Social applications → Add Google OAuth credentials
3. Users → Create test user manually

---

## Step 7: Test Specific Scenarios

**Test 1: Direct signup (no OAuth)**
1. Go to: https://finance.mstatilitechnologies.com/signup
2. Fill in: email, username, password
3. Check browser console for errors
4. Check gunicorn logs for backend errors

**Test 2: Login with created user**
1. Go to: https://finance.mstatilitechnologies.com/login
2. Enter credentials
3. Should redirect to /dashboard

**Test 3: Check if user was created**
```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
python manage.py shell

# In shell:
from django.contrib.auth import get_user_model
User = get_user_model()
print(User.objects.all())
# Should show your test users
```

---

## Complete Checklist

Before testing again, verify:

- [ ] Service is running: `systemctl status finance-app`
- [ ] Database migrations run: `python manage.py migrate`
- [ ] Environment variables set correctly in `.env`
- [ ] ALLOWED_HOSTS includes your domain
- [ ] CORS_ALLOWED_ORIGINS includes your domain
- [ ] CSRF_TRUSTED_ORIGINS includes your domain
- [ ] PostgreSQL is running: `systemctl status postgresql`
- [ ] Frontend is built and deployed
- [ ] OpenLiteSpeed proxy rules are configured
- [ ] Can access: `https://finance.mstatilitechnologies.com/admin/`

---

## Still Having Issues?

**Get detailed error info:**

1. **Watch logs while testing:**
```bash
# Terminal 1: Watch Django logs
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-error.log

# Terminal 2: Watch access logs
tail -f /home/finance.mstatilitechnologies.com/logs/gunicorn-access.log
```

2. **Test API directly with verbose output:**
```bash
curl -v -X POST https://finance.mstatilitechnologies.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -H "Referer: https://finance.mstatilitechnologies.com/" \
  -d '{"email":"test2@example.com","username":"test2","password":"Test123!"}' \
  2>&1 | grep -E "(HTTP|error|detail)"
```

3. **Check Django settings are loaded:**
```bash
cd /home/finance.mstatilitechnologies.com/public_html
source /home/finance.mstatilitechnologies.com/.venv/bin/activate
python manage.py shell

# In shell:
from django.conf import settings
print("DEBUG:", settings.DEBUG)
print("ALLOWED_HOSTS:", settings.ALLOWED_HOSTS)
print("CORS_ALLOWED_ORIGINS:", settings.CORS_ALLOWED_ORIGINS)
print("CSRF_TRUSTED_ORIGINS:", settings.CSRF_TRUSTED_ORIGINS)
```

**Share the specific error message you're seeing for more targeted help!**
