# Static Files Management Guide

## Overview

Django static files are managed using:
- **Django's `collectstatic`** command to gather all static files
- **WhiteNoise** middleware to serve static files efficiently in production
- **Compressed and cached** static files for optimal performance

## Static Files Configuration

### Settings (`backend/settings.py`)

```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Collected files go here
STATICFILES_DIRS = []  # Additional directories (e.g., frontend build)

# WhiteNoise for production
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Right after SecurityMiddleware
    # ... other middleware
]

if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Media Files (User Uploads)

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

## Deployment Workflow

### 1. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

This collects:
- Django admin static files
- Django REST Framework browsable API static files
- Any app-specific static files
- Frontend build files (if configured)

### 2. Serve Frontend from Django (Optional)

To serve the React frontend from the same Django server:

**Step 1:** Build frontend
```bash
cd client
npm run build
cd ..
```

**Step 2:** Configure Django to serve it
Uncomment in `backend/settings.py`:
```python
STATICFILES_DIRS = [BASE_DIR / 'client' / 'dist']
```

**Step 3:** Add URL routing (in `backend/urls.py`)
```python
from django.views.generic import TemplateView

urlpatterns = [
    # ... your API urls
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
]
```

**Step 4:** Collect static files again
```bash
python manage.py collectstatic --noinput
```

### 3. Deployment Script

Use the provided `deploy.sh` script:

```bash
chmod +x deploy.sh
./deploy.sh
```

This script:
- ✅ Checks environment variables
- ✅ Installs dependencies
- ✅ Runs Django checks
- ✅ Applies migrations
- ✅ Collects static files
- ✅ Optionally builds frontend
- ✅ Optionally runs tests

## Production Recommendations

### Recommended: Separate Frontend Deployment

**Pros:**
- Better performance (CDN, edge caching)
- Independent scaling
- Faster deployments
- Better developer experience

**Deployment options:**
- Vercel (recommended for React/Vite)
- Netlify
- AWS S3 + CloudFront
- Cloudflare Pages

**Configuration:**
1. Build: `npm run build` in `client/`
2. Deploy `client/dist/` folder
3. Configure environment variables:
   - `VITE_API_URL=https://api.yourdomain.com`
4. Configure CORS in Django backend

### Alternative: Django Serves Frontend

**Pros:**
- Simpler deployment (one server)
- No CORS issues
- Single domain

**Cons:**
- Django handles static file serving (less efficient)
- Slower frontend updates
- Mixed responsibilities

**When to use:**
- Small applications
- Internal tools
- MVP/prototypes
- Cost optimization

## WhiteNoise Features

WhiteNoise provides:

1. **Compression**: Automatically gzips/Brotli compresses static files
2. **Caching**: Sets far-future cache headers
3. **Manifest**: Content-addressed filenames for cache busting
4. **No web server needed**: Serves static files directly from Django
5. **Production-ready**: Battle-tested and efficient

## Troubleshooting

### Static files not found (404)

```bash
# Verify STATIC_ROOT
python manage.py findstatic admin/css/base.css

# Re-collect static files
python manage.py collectstatic --clear --noinput

# Check WhiteNoise middleware order
# It must come right after SecurityMiddleware
```

### CSS/JS files not loading

```bash
# Check browser console for MIME type errors
# Ensure WhiteNoise is installed: pip install whitenoise

# Verify settings
python manage.py check --deploy
```

### Frontend build not found

```bash
# Build frontend first
cd client && npm run build

# Check if dist/ folder exists
ls -la client/dist/

# Ensure STATICFILES_DIRS includes client/dist
# Then re-run collectstatic
```

## File Structure

```
personal-finance-app/
├── staticfiles/         # Collected static files (git-ignored)
│   ├── admin/          # Django admin static files
│   ├── rest_framework/ # DRF static files
│   └── ...
├── media/              # User uploads (git-ignored)
├── client/
│   └── dist/          # Frontend build (git-ignored)
├── backend/
│   └── settings.py    # Static files configuration
└── deploy.sh          # Deployment script
```

## Environment Variables

Not typically needed - handled by `settings.py`:

```bash
# Optional overrides
STATIC_ROOT=/var/www/app/staticfiles  # Custom location
MEDIA_ROOT=/var/www/app/media        # Custom location
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Collect static files
  run: |
    python manage.py collectstatic --noinput
    
- name: Build frontend
  run: |
    cd client
    npm ci
    npm run build
```

### Docker Example

```dockerfile
# Collect static files during build
RUN python manage.py collectstatic --noinput

# Copy to final image
COPY --from=builder /app/staticfiles /app/staticfiles
```

## Resources

- [Django Static Files](https://docs.djangoproject.com/en/4.2/howto/static-files/)
- [WhiteNoise Documentation](http://whitenoise.evans.io/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
