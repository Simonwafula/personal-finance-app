#!/bin/bash
# Deployment script for Personal Finance App
# Run this script before deploying to production

set -e  # Exit on error

echo "🚀 Personal Finance App - Deployment Preparation"
echo "================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run this script from the project root."
    exit 1
fi

# 1. Check environment variables
echo "📋 Step 1: Checking environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "⚠️  Warning: .env file not found. Make sure environment variables are set!"
    echo "   Required variables: DJANGO_SECRET_KEY, DJANGO_DEBUG, DJANGO_ALLOWED_HOSTS"
fi
echo ""

# 2. Install/update Python dependencies
echo "📦 Step 2: Installing Python dependencies..."
pip install -r requirements.txt
echo "✅ Python dependencies installed"
echo ""

# 3. Run Django checks
echo "🔍 Step 3: Running Django system checks..."
python manage.py check --deploy
echo "✅ Django checks passed"
echo ""

# 4. Run database migrations
echo "🗄️  Step 4: Running database migrations..."
python manage.py migrate --noinput
echo "✅ Migrations applied"
echo ""

# 5. Collect static files
echo "📁 Step 5: Collecting static files..."
python manage.py collectstatic --noinput --clear
echo "✅ Static files collected to staticfiles/"
echo ""

# 6. Build frontend (optional - if serving from Django)
read -p "📦 Build frontend? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Building frontend..."
    cd client
    npm install
    npm run build
    cd ..
    echo "✅ Frontend built to client/dist/"
else
    echo "⏭️  Skipping frontend build"
fi
echo ""

# 7. Run tests (optional)
read -p "🧪 Run tests? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧪 Running tests..."
    python manage.py test
    echo "✅ Tests passed"
else
    echo "⏭️  Skipping tests"
fi
echo ""

# Summary
echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "  1. Set environment variables in your hosting platform"
echo "  2. Deploy code to your server"
echo "  3. Restart application server (gunicorn/uwsgi)"
echo "  4. Test the deployed application"
echo ""
echo "To start the production server locally:"
echo "  gunicorn backend.wsgi:application --bind 0.0.0.0:8000"
echo ""
