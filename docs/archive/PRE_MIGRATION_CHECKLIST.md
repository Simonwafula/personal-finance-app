# Pre-Migration Checklist & Important Considerations

## Critical Production Considerations

### 🚨 Production Database Status
**IMPORTANT:** The database is already live in production with the web app running.

**Implications:**
- ✅ **NO destructive migrations** - Database has real user data
- ✅ **Only additive migrations** - Add new fields, never remove or rename
- ✅ **All new fields must be nullable or have defaults** - Existing rows must remain valid
- ✅ **Test migrations on database dump first** - Never test on production directly
- ✅ **Backward compatible changes only** - Old web app must continue working during migration

---

## Question 1: Do we need to build APK before committing?

### Short Answer: **NO** ❌

### Explanation

**APK files should NOT be committed to Git because:**

1. **Large File Size**
   - APK files are 10-20 MB (or larger)
   - Git is designed for source code, not binaries
   - Repository size will grow exponentially with each version
   - Clone/pull operations will become very slow

2. **Binary Files Don't Diff Well**
   - Git can't show meaningful differences between APK versions
   - No way to review what changed in the APK
   - Merge conflicts are impossible to resolve

3. **Build Artifacts Should Be Generated**
   - APK is a build output (like `dist/` folder for web)
   - Should be generated from source code, not stored
   - Different developers may have different build signatures

4. **Security Concerns**
   - APK files can contain sensitive keys/credentials
   - Signing keys should never be in Git
   - Release builds require keystore files (keep secret)

### ✅ Recommended Approach: GitHub Releases + CI/CD

**Option A: GitHub Actions (Automated) - RECOMMENDED**

```yaml
# .github/workflows/mobile-release.yml
name: Build and Release APK

on:
  push:
    tags:
      - 'v*.*.*'  # Triggers on version tags like v1.0.0

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install dependencies
        run: npm ci

      - name: Build mobile app
        run: npm run build:mobile
        env:
          VITE_PLATFORM: mobile
          VITE_API_BASE_URL: https://finance.mstatilitechnologies.com

      - name: Sync Capacitor
        run: npm run mobile:sync

      - name: Build Debug APK
        run: cd android && ./gradlew assembleDebug

      # For release builds (with signing)
      - name: Build Release APK
        if: startsWith(github.ref, 'refs/tags/')
        run: cd android && ./gradlew assembleRelease
        env:
          ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          ANDROID_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}

      - name: Upload APK to GitHub Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: |
            android/app/build/outputs/apk/debug/*.apk
            android/app/build/outputs/apk/release/*.apk
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**How to use:**
```bash
# When ready to release
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Build the APK
# 2. Create a GitHub Release
# 3. Upload APK as downloadable asset
```

**Option B: Manual Build + GitHub Releases**

```bash
# 1. Build the APK locally
npm run build:mobile
npm run mobile:build

# 2. APK is in: android/app/build/outputs/apk/debug/app-debug.apk

# 3. Create a Git tag
git tag v1.0.0
git push origin v1.0.0

# 4. Go to GitHub → Releases → Create Release
# 5. Upload the APK file manually
# 6. Users download from Releases page
```

**Option C: Continuous Deployment to Play Store**

```yaml
# .github/workflows/playstore-deploy.yml
name: Deploy to Play Store

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # ... build steps from Option A ...

      - name: Build App Bundle (AAB)
        run: cd android && ./gradlew bundleRelease

      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_STORE_SERVICE_ACCOUNT }}
          packageName: com.mstatilitechnologies.sonko
          releaseFiles: android/app/build/outputs/bundle/release/*.aab
          track: internal  # or 'beta', 'production'
```

### 📁 .gitignore Configuration

**Make sure these are in .gitignore:**

```gitignore
# Android build outputs (DO NOT COMMIT)
android/app/build/
android/app/release/
android/.gradle/
android/local.properties
*.apk
*.aab

# Signing keys (NEVER COMMIT)
*.jks
*.keystore
keystore.properties

# iOS build outputs
ios/App/build/
ios/App/Pods/
*.ipa

# Build artifacts
dist/
build/
.capacitor/
```

### 🔑 Keystore Management (for Release Builds)

**NEVER commit keystores to Git. Instead:**

1. **Store keystore in GitHub Secrets:**
   - Encode: `base64 my-release-key.jks > keystore.b64`
   - Add to GitHub Secrets: `ANDROID_KEYSTORE_BASE64`

2. **Decode in CI/CD:**
   ```yaml
   - name: Decode Keystore
     run: |
       echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > android/app/my-release-key.jks
   ```

3. **Store passwords in secrets:**
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`

---

## Question 2: Database Migration Strategy (Production-Safe)

### 🚨 Critical Rules for Production Database

Since the database is **already live with real data**, we must be extremely careful:

#### ✅ SAFE Migration Patterns

**1. Adding New Fields (SAFE)**

```python
# server/finance/migrations/0XXX_add_sms_fields.py
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('finance', '0XXX_previous_migration'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='source',
            field=models.CharField(
                max_length=10,
                choices=[('manual', 'Manual'), ('sms', 'SMS'), ('import', 'Import')],
                default='manual',  # ✅ SAFE: Default value for existing rows
                db_index=True,
            ),
        ),
        migrations.AddField(
            model_name='transaction',
            name='sms_reference',
            field=models.CharField(
                max_length=100,
                blank=True,
                null=True,  # ✅ SAFE: Nullable for existing rows
                db_index=True,
            ),
        ),
        migrations.AddField(
            model_name='transaction',
            name='sms_detected_at',
            field=models.DateTimeField(
                blank=True,
                null=True,  # ✅ SAFE: Nullable for existing rows
            ),
        ),
    ]
```

**2. Adding New Models (SAFE)**

```python
class Migration(migrations.Migration):
    operations = [
        migrations.CreateModel(
            name='SmsConfiguration',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('user', models.ForeignKey('auth.User', on_delete=models.CASCADE)),
                ('sender_whitelist', models.JSONField(default=list)),
                ('enabled', models.BooleanField(default=True)),
            ],
        ),
    ]
# ✅ SAFE: New table doesn't affect existing data
```

**3. Adding Indexes (SAFE, but use CONCURRENTLY on PostgreSQL)**

```python
from django.contrib.postgres.operations import AddIndexConcurrently

class Migration(migrations.Migration):
    atomic = False  # Required for CONCURRENTLY

    operations = [
        AddIndexConcurrently(
            model_name='transaction',
            index=models.Index(fields=['source'], name='idx_txn_source'),
        ),
    ]
# ✅ SAFE: Won't lock table during index creation
```

#### ❌ UNSAFE Migration Patterns (AVOID!)

**1. Removing Fields (DANGEROUS)**
```python
# ❌ NEVER DO THIS on production with data
migrations.RemoveField(
    model_name='transaction',
    name='old_field',  # Data loss!
)
```

**2. Renaming Fields (DANGEROUS)**
```python
# ❌ DANGEROUS: Can break running app
migrations.RenameField(
    model_name='transaction',
    old_name='amount',
    new_name='transaction_amount',
)
```

**3. Changing Field Types (DANGEROUS)**
```python
# ❌ DANGEROUS: Can fail on existing data
migrations.AlterField(
    model_name='transaction',
    name='amount',
    field=models.IntegerField(),  # Was DecimalField
)
```

**4. Making Fields Non-Nullable (DANGEROUS)**
```python
# ❌ DANGEROUS: Existing NULL values will cause migration to fail
migrations.AlterField(
    model_name='transaction',
    name='category',
    field=models.ForeignKey('Category', null=False),  # Was nullable
)
```

### 🔄 Safe Migration Workflow

#### Step 1: Create Migration Locally

```bash
# On development machine
cd server
python manage.py makemigrations finance --name add_sms_fields

# Review the migration file
cat finance/migrations/0XXX_add_sms_fields.py
```

#### Step 2: Test on Database Dump

```bash
# On VPS: Create database dump
ssh user@your-vps
pg_dump -U dbuser -d finance_db > finance_db_backup_$(date +%Y%m%d).sql

# Download to local
scp user@your-vps:~/finance_db_backup_*.sql ./

# Restore to local test database
createdb finance_test
psql -U postgres -d finance_test < finance_db_backup_*.sql

# Test migration locally
python manage.py migrate --database=finance_test

# Verify data integrity
python manage.py shell
>>> from finance.models import Transaction
>>> Transaction.objects.count()  # Should match production count
>>> Transaction.objects.filter(source='manual').count()  # All existing should be 'manual'
```

#### Step 3: Backup Production Database

```bash
# On VPS
ssh user@your-vps
cd /var/backups/

# Create backup with timestamp
sudo -u postgres pg_dump finance_db > finance_db_pre_migration_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip finance_db_pre_migration_*.sql

# Verify backup
gunzip -c finance_db_pre_migration_*.sql.gz | head -n 50
```

#### Step 4: Deploy Migration (Production)

**Option A: Manual Deployment (Safer for first time)**

```bash
# On VPS
cd /path/to/personal-finance-app

# Pull latest code
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Show what migrations will run (dry run)
python manage.py migrate --plan

# Run migrations
python manage.py migrate

# Verify migration succeeded
python manage.py showmigrations finance

# Check data
python manage.py shell
>>> from finance.models import Transaction
>>> Transaction.objects.filter(source='manual').count()  # Should be all existing transactions
```

**Option B: Automated with Rollback Plan**

```bash
#!/bin/bash
# deploy-with-rollback.sh

set -e  # Exit on error

echo "Starting migration..."

# Backup first
sudo -u postgres pg_dump finance_db > /var/backups/finance_db_pre_migration_$(date +%Y%m%d_%H%M%S).sql

# Run migration
cd /path/to/personal-finance-app
source venv/bin/activate

if python manage.py migrate; then
    echo "✅ Migration succeeded"

    # Restart services
    sudo systemctl restart gunicorn
    sudo systemctl restart nginx
else
    echo "❌ Migration failed! Rolling back..."

    # Restore backup (if needed)
    # sudo -u postgres psql finance_db < /var/backups/finance_db_pre_migration_*.sql

    exit 1
fi
```

#### Step 5: Verify Post-Migration

```bash
# Check application logs
sudo journalctl -u gunicorn -n 100 --no-pager

# Check database
psql -U dbuser -d finance_db
SELECT COUNT(*) FROM finance_transaction;
SELECT source, COUNT(*) FROM finance_transaction GROUP BY source;
\q

# Test API endpoints
curl -X GET https://finance.mstatilitechnologies.com/api/finance/transactions/ \
  -H "Authorization: Token your-token"

# Check web app in browser
# Open: https://finance.mstatilitechnologies.com
```

### 📋 Pre-Migration Checklist

Before running ANY migration on production:

- [ ] Migration tested on local database dump
- [ ] Migration is additive only (no deletions/renames)
- [ ] All new fields have defaults or are nullable
- [ ] Backup created and verified
- [ ] Maintenance window scheduled (if needed)
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Monitoring in place

### 🔄 Zero-Downtime Migration Strategy

For the SMS fields migration specifically:

**Phase 1: Add Fields (No Downtime)**
```python
# Migration: Add new fields as nullable
source = models.CharField(max_length=10, default='manual', null=True)
sms_reference = models.CharField(max_length=100, null=True, blank=True)
sms_detected_at = models.DateTimeField(null=True, blank=True)
```

**Phase 2: Deploy Code (No Downtime)**
```bash
# Deploy new code that uses new fields
# Old transactions: source=NULL → treated as 'manual'
# New transactions: source='manual', 'sms', or 'import'
```

**Phase 3: Backfill Data (Background, No Downtime)**
```python
# Run this as a management command, not migration
from finance.models import Transaction

# Update existing rows
Transaction.objects.filter(source__isnull=True).update(source='manual')
```

**Phase 4: Make Non-Nullable (Optional, Later)**
```python
# After backfill completes
# Run new migration to remove null=True
source = models.CharField(max_length=10, default='manual')  # No more null
```

---

## Updated Migration Plan for SMS Fields

### SMS Fields Migration (Production-Safe)

```python
# server/finance/migrations/0XXX_add_sms_tracking.py
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('finance', '0XXX_previous_migration'),
    ]

    operations = [
        # Add source field with default
        migrations.AddField(
            model_name='transaction',
            name='source',
            field=models.CharField(
                max_length=10,
                choices=[
                    ('manual', 'Manual Entry'),
                    ('sms', 'SMS Detection'),
                    ('import', 'CSV Import'),
                ],
                default='manual',
                help_text='How this transaction was created',
            ),
        ),

        # Add SMS reference (nullable)
        migrations.AddField(
            model_name='transaction',
            name='sms_reference',
            field=models.CharField(
                max_length=100,
                blank=True,
                null=True,
                help_text='SMS reference number if source is SMS',
            ),
        ),

        # Add SMS detection timestamp (nullable)
        migrations.AddField(
            model_name='transaction',
            name='sms_detected_at',
            field=models.DateTimeField(
                blank=True,
                null=True,
                help_text='When SMS was detected and parsed',
            ),
        ),

        # Add indexes for performance
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['source'], name='idx_txn_source'),
        ),
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['sms_reference'], name='idx_txn_sms_ref'),
        ),
    ]
```

### Deployment Steps (Exact Commands)

```bash
# 1. LOCAL: Create and test migration
cd server
python manage.py makemigrations finance --name add_sms_tracking
python manage.py migrate  # Test locally

# 2. COMMIT: Add migration to Git
git add server/finance/migrations/0XXX_add_sms_tracking.py
git commit -m "feat(db): add SMS transaction tracking fields

- Add source field (manual, sms, import) with default='manual'
- Add sms_reference field (nullable)
- Add sms_detected_at timestamp (nullable)
- Add indexes for performance

Safe for production: All fields nullable or have defaults"

git push origin main

# 3. VPS: Backup database
ssh user@your-vps
sudo -u postgres pg_dump finance_db > /var/backups/finance_db_$(date +%Y%m%d_%H%M%S).sql
gzip /var/backups/finance_db_*.sql

# 4. VPS: Pull and migrate
cd /path/to/personal-finance-app
git pull origin main
source venv/bin/activate
python manage.py migrate --plan  # Preview
python manage.py migrate         # Execute

# 5. VPS: Restart services
sudo systemctl restart gunicorn
sudo systemctl restart nginx

# 6. VERIFY: Check migration succeeded
python manage.py showmigrations finance
psql -U dbuser -d finance_db -c "SELECT COUNT(*), source FROM finance_transaction GROUP BY source;"

# 7. VERIFY: Test API
curl https://finance.mstatilitechnologies.com/api/finance/transactions/ -H "Authorization: Token xxx"
```

---

## Updated Phase 1 Tasks

With production considerations:

### Phase 1: Merge and Platform Detection (1 day)

**Tasks:**
1. ✅ Verify mobile-app branch builds successfully
2. ✅ Create `client/src/utils/platform.ts` utility
3. ✅ Create `client/src/features/sms/` directory
4. ✅ Move SMS components to feature directory
5. ✅ Update imports to use platform detection
6. ✅ **Update .gitignore to exclude APK/AAB files**
7. ✅ Merge mobile-app → main with conflict resolution
8. ✅ Test both web and mobile builds
9. ✅ **DO NOT commit APK files**

### Phase 2: Backend SMS Support (PRODUCTION-SAFE)

**Tasks:**
1. ✅ Create migration with nullable/default fields
2. ✅ Test migration on local database dump
3. ✅ Review migration for safety (no deletions/renames)
4. ✅ Update API serializers to include new fields
5. ✅ Update frontend types to match
6. ✅ **Commit migration file to Git (source code only)**
7. ✅ Deploy to production with backup plan
8. ✅ Verify migration succeeded
9. ✅ Test API endpoints

---

## APK Distribution Strategy

### For Testing (Internal)
- Build locally: `npm run mobile:debug`
- Share via Google Drive, Dropbox, or direct download
- Or use GitHub Releases for tagged versions

### For Public Distribution
- **Google Play Store** (recommended for production)
- **GitHub Releases** (good for beta testers)
- **Direct download from website** (requires "Install from unknown sources")

### Recommended: GitHub Releases Workflow

```bash
# When ready for release
git tag v1.0.0 -m "Release version 1.0.0 - SMS Transaction Detection"
git push origin v1.0.0

# Build APK
npm run mobile:release

# Create GitHub Release manually or via CLI
gh release create v1.0.0 \
  android/app/build/outputs/apk/release/app-release.apk \
  --title "v1.0.0 - SMS Transaction Detection" \
  --notes "First release with SMS auto-detection feature"

# Users download from:
# https://github.com/your-org/personal-finance-app/releases/latest
```

---

## Summary

### Question 1: Build APK before commit? ❌ NO

**Recommended:**
- Commit source code only
- Build APK via GitHub Actions (automated)
- Upload APK to GitHub Releases (not repository)
- Or deploy to Google Play Store via CI/CD

**Never commit:**
- ❌ APK files
- ❌ AAB files
- ❌ Keystore files
- ❌ Build artifacts

### Question 2: Database migrations? ✅ YES, but carefully

**Safe approach:**
1. Only additive migrations (new fields/tables)
2. All new fields nullable or have defaults
3. Test on database dump first
4. Backup before production migration
5. Use zero-downtime deployment strategy
6. Commit migration files (source code)
7. Never commit database dumps

---

## Next Steps

1. **Review this checklist**
2. **Verify production backup strategy is in place**
3. **Confirm you're comfortable with migration workflow**
4. **Then proceed with Phase 1 implementation**

Ready to start Phase 1? 🚀
