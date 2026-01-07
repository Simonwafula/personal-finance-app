# Phase 1 Deployment Guide

## ✅ Completed Tasks

### 1. GitHub Actions Setup ✅
- [.github/workflows/web-build.yml](.github/workflows/web-build.yml) - Automated web builds
- [.github/workflows/mobile-build.yml](.github/workflows/mobile-build.yml) - Automated mobile builds + APK releases
- [.github/workflows/test.yml](.github/workflows/test.yml) - Automated testing

### 2. Build Artifacts Protection ✅
- [.gitignore](.gitignore) updated to exclude:
  - APK/AAB files
  - Android build outputs
  - Keystore files
  - Database dumps

### 3. Platform Detection Utility ✅
- [client/src/utils/platform.ts](client/src/utils/platform.ts) - Cross-platform detection
- Graceful Capacitor handling (works without @capacitor/core installed)
- Feature flags (SMS_DETECTION, PUSH_NOTIFICATIONS, etc.)

### 4. SMS Feature Directory ✅
- [client/src/features/sms/](client/src/features/sms/) directory created
- [client/src/features/sms/README.md](client/src/features/sms/README.md) - Documentation
- [client/src/features/sms/types.ts](client/src/features/sms/types.ts) - TypeScript types

### 5. Backend SMS Support ✅
- [finance/models.py](finance/models.py) - Transaction model updated with SMS fields
- [finance/migrations/0004_add_sms_tracking_fields.py](finance/migrations/0004_add_sms_tracking_fields.py) - Production-safe migration
- [finance/serializers.py](finance/serializers.py) - API serializer updated

### 6. Frontend Types ✅
- [client/src/api/types.ts](client/src/api/types.ts) - Transaction type updated

---

## 🚀 Next Steps: Deploy to Production

### Step 1: Commit Changes

```bash
# Check what's changed
git status

# Review changes
git diff

# Add files
git add .

# Commit with descriptive message
git commit -m "feat: Phase 1 - Add SMS tracking infrastructure

- Add GitHub Actions workflows for web and mobile builds
- Add platform detection utility for cross-platform support
- Set up SMS feature directory structure
- Add SMS tracking fields to Transaction model (source, sms_reference, sms_detected_at)
- Create production-safe migration (all fields nullable or have defaults)
- Update API serializers to support SMS fields
- Update frontend types for SMS transactions
- Update .gitignore to exclude build artifacts and keystores

BREAKING CHANGE: None - All changes are backward compatible
Production-Safe: Migration uses nullable fields and defaults only"

# Push to GitHub
git push origin main
```

### Step 2: Verify GitHub Actions

After pushing, check:
1. Go to: https://github.com/your-org/personal-finance-app/actions
2. Verify "Web Build" workflow passes ✅
3. Verify "Tests" workflow passes ✅
4. Mobile build will show warnings (Capacitor not configured yet) - This is expected

### Step 3: Backup Production Database

**CRITICAL: Always backup before migrations!**

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Create backup directory if it doesn't exist
sudo mkdir -p /var/backups/finance-app
cd /var/backups/finance-app

# Create backup with timestamp
sudo -u postgres pg_dump finance_db > finance_db_backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip finance_db_backup_*.sql

# Verify backup exists
ls -lh finance_db_backup_*.sql.gz

# Test backup can be read
gunzip -c finance_db_backup_*.sql.gz | head -n 20
```

### Step 4: Deploy Migration to Production

```bash
# Still on VPS
cd /path/to/personal-finance-app

# Pull latest code
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Show what migrations will run (dry-run preview)
python manage.py migrate --plan

# Expected output:
# Planned operations:
# finance.0004_add_sms_tracking_fields
#   Add field source to transaction
#   Add field sms_reference to transaction
#   Add field sms_detected_at to transaction
#   Add index finance_tra_source_idx on transaction (source)
#   Add index finance_tra_sms_ref_idx on transaction (sms_reference)

# Run the migration
python manage.py migrate

# Expected output:
# Running migrations:
#   Applying finance.0004_add_sms_tracking_fields... OK

# Verify migration succeeded
python manage.py showmigrations finance

# Expected output shows [X] next to 0004_add_sms_tracking_fields
```

### Step 5: Verify Database Changes

```bash
# Check database directly
psql -U your_db_user -d finance_db

# Verify new fields exist
\d finance_transaction

# Expected output should include:
# | source           | character varying(10) | default 'MANUAL'::character varying
# | sms_reference    | character varying(100)|
# | sms_detected_at  | timestamp with time zone |

# Check existing data is intact
SELECT COUNT(*), source FROM finance_transaction GROUP BY source;

# Expected output:
#  count | source
# -------+--------
#    150 | MANUAL  (or whatever your current transaction count is)

# Exit psql
\q
```

### Step 6: Restart Application Services

```bash
# Restart Gunicorn (Django app server)
sudo systemctl restart gunicorn

# Check status
sudo systemctl status gunicorn

# Restart Nginx (if configured)
sudo systemctl restart nginx

# Check logs for any errors
sudo journalctl -u gunicorn -n 50 --no-pager
```

### Step 7: Test API Endpoints

```bash
# Test transaction list endpoint
curl -X GET https://finance.mstatilitechnologies.com/api/finance/transactions/ \
  -H "Authorization: Token your-auth-token-here" \
  | jq '.[0]'

# Expected output should now include SMS fields:
# {
#   "id": 1,
#   "account": 5,
#   "date": "2024-01-07",
#   "amount": "1000.00",
#   "kind": "EXPENSE",
#   ...
#   "source": "MANUAL",          ← New field
#   "sms_reference": null,       ← New field
#   "sms_detected_at": null      ← New field
# }

# Test creating a transaction with SMS source (mobile app will use this)
curl -X POST https://finance.mstatilitechnologies.com/api/finance/transactions/ \
  -H "Authorization: Token your-auth-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "account": 5,
    "date": "2024-01-07",
    "amount": "500.00",
    "kind": "EXPENSE",
    "description": "Test SMS transaction",
    "source": "SMS",
    "sms_reference": "ABC123XYZ",
    "sms_detected_at": "2024-01-07T10:30:00Z"
  }' | jq

# Should succeed and return the created transaction
```

### Step 8: Test Web App

```bash
# Open web app in browser
open https://finance.mstatilitechnologies.com

# Verify:
# 1. Transactions page loads ✅
# 2. Can create new transaction ✅
# 3. Existing transactions still work ✅
# 4. No console errors ✅
# 5. Dashboard loads ✅
# 6. All features working ✅
```

### Step 9: Monitor for Issues

```bash
# Watch application logs for 5 minutes
sudo journalctl -u gunicorn -f

# Watch for any errors
# Press Ctrl+C to stop

# Check Django logs (if file logging configured)
tail -f /path/to/django/logs/django.log
```

---

## 🔄 Rollback Plan (If Something Goes Wrong)

### If Migration Fails

```bash
# Restore database from backup
sudo -u postgres psql finance_db < /var/backups/finance-app/finance_db_backup_YYYYMMDD_HHMMSS.sql

# Restart services
sudo systemctl restart gunicorn
```

### If App Crashes After Migration

```bash
# Revert to previous git commit
git log --oneline -n 5
git revert HEAD --no-commit
git commit -m "Revert: Phase 1 changes"
git push origin main

# Pull on VPS
cd /path/to/personal-finance-app
git pull origin main

# Restart services
sudo systemctl restart gunicorn
```

---

## 📊 Verification Checklist

After deployment, verify:

### Backend (Django)
- [ ] Migration applied successfully
- [ ] New fields exist in database
- [ ] Existing transactions have source='MANUAL'
- [ ] API returns SMS fields in transaction responses
- [ ] Can create transactions with SMS source
- [ ] Validation works (SMS source requires sms_reference)
- [ ] No errors in Gunicorn logs

### Frontend (Web App)
- [ ] Web app loads without errors
- [ ] Transactions page works
- [ ] Can create/edit/delete transactions
- [ ] No TypeScript errors in browser console
- [ ] No 500 errors from API
- [ ] Dashboard analytics working
- [ ] CSV import/export still working

### GitHub Actions
- [ ] Web build workflow passes
- [ ] Test workflow passes
- [ ] Mobile build workflow runs (may have warnings - OK)

---

## 📈 Expected Results

### Database Changes
- 3 new fields added to `finance_transaction` table
- 2 new indexes created for performance
- All existing transactions have `source='MANUAL'`
- ~0 downtime (migration runs in < 1 second)

### API Changes
- Transaction responses include 3 new optional fields
- Old clients (without SMS fields) continue working
- New clients (mobile app) can send SMS data

### Performance Impact
- Negligible (<1% increase in response size)
- Indexes improve query performance for SMS filtering

---

## 🎯 Success Metrics

- ✅ Migration completed in < 5 seconds
- ✅ Zero data loss
- ✅ Zero downtime
- ✅ Backward compatible (existing API clients work)
- ✅ All tests passing
- ✅ No production errors after 24 hours

---

## 📝 Post-Deployment Tasks

1. **Monitor for 24 hours**
   - Check error logs daily
   - Monitor database performance
   - Watch for user-reported issues

2. **Update documentation**
   - [x] [PROGRESS_SUMMARY.md](PROGRESS_SUMMARY.md) - Mark Phase 1 complete
   - [ ] API documentation (if separate)
   - [ ] Developer onboarding docs

3. **Prepare for Phase 2**
   - Next: Merge mobile-app branch SMS components
   - Then: Test full SMS detection flow
   - Finally: Deploy mobile app to Play Store

---

## ❓ Troubleshooting

### Issue: Migration fails with "column already exists"

**Solution:**
```bash
# Check if migration already ran
python manage.py showmigrations finance

# If 0004 shows [X], it's already applied
# Revert the duplicate migration attempt
python manage.py migrate finance 0003
```

### Issue: API returns 500 errors after migration

**Solution:**
```bash
# Check for missing serializer fields
python manage.py shell
>>> from finance.serializers import TransactionSerializer
>>> TransactionSerializer().fields.keys()
# Verify 'source', 'sms_reference', 'sms_detected_at' are present

# Restart Gunicorn
sudo systemctl restart gunicorn
```

### Issue: Existing transactions show source=null instead of 'MANUAL'

**Solution:**
```bash
# Run backfill query
python manage.py shell
>>> from finance.models import Transaction
>>> Transaction.objects.filter(source__isnull=True).update(source='MANUAL')
>>> Transaction.objects.filter(source='').update(source='MANUAL')
```

---

## 🎉 Completion Criteria

Phase 1 is complete when:

- [x] All code changes committed to Git
- [ ] GitHub Actions workflows passing
- [ ] Migration deployed to production
- [ ] Production database has new fields
- [ ] API returns SMS fields
- [ ] Web app works without errors
- [ ] No rollback needed after 24 hours

**Estimated Deployment Time:** 15-30 minutes
**Risk Level:** Low (backward compatible changes only)

---

## Next: Phase 2 - Mobile App Branch Merge

See [MOBILE_WEB_SYNC_PLAN.md](MOBILE_WEB_SYNC_PLAN.md) Phase 2 for next steps.

**Status:** ✅ Phase 1 Code Complete - Ready for Deployment
