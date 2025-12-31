#!/bin/bash
# =============================================================================
# Deployment script for Personal Finance App
# Run this script before deploying to production or for quick deployment updates
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Personal Finance App - Deployment Script${NC}"
echo "=============================================="
echo ""

# Determine if we're in production or development
PRODUCTION=false
if [ -d "/home/finance.mstatilitechnologies.com" ]; then
    PRODUCTION=true
    PROJECT_DIR="/home/finance.mstatilitechnologies.com/public_html"
    VENV_DIR="/home/finance.mstatilitechnologies.com/.venv"
    ENV_FILE="/home/finance.mstatilitechnologies.com/.env"
else
    PROJECT_DIR="$(pwd)"
    VENV_DIR="$PROJECT_DIR/venv"
    ENV_FILE="$PROJECT_DIR/.env"
fi

# Deployment user (used for chown in production and service file). Defaults to current user.
DEPLOY_USER=${DEPLOY_USER:-$(whoami)}

echo -e "${BLUE}📍 Environment: ${NC}$($PRODUCTION && echo 'PRODUCTION' || echo 'DEVELOPMENT')"
echo -e "${BLUE}📂 Project Dir: ${NC}$PROJECT_DIR"
echo ""

# Check if we're in the right directory
if [ ! -f "$PROJECT_DIR/manage.py" ]; then
    echo -e "${RED}❌ Error: manage.py not found in $PROJECT_DIR${NC}"
    echo "   Please run this script from the project root or ensure correct directory."
    exit 1
fi

cd "$PROJECT_DIR"

# =============================================================================
# Step 1: Check environment variables
# =============================================================================
echo -e "${BLUE}📋 Step 1: Checking environment variables...${NC}"
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ .env file found at $ENV_FILE${NC}"
    
    # Check for critical variables
    source "$ENV_FILE" 2>/dev/null || true
    MISSING_VARS=()
    
    [ -z "$DJANGO_SECRET_KEY" ] && MISSING_VARS+=("DJANGO_SECRET_KEY")
    [ -z "$DJANGO_ALLOWED_HOSTS" ] && MISSING_VARS+=("DJANGO_ALLOWED_HOSTS")
    
    if $PRODUCTION; then
        [ -z "$DATABASE_ENGINE" ] && MISSING_VARS+=("DATABASE_ENGINE")
        [ -z "$DATABASE_NAME" ] && MISSING_VARS+=("DATABASE_NAME")
        [ -z "$DATABASE_USER" ] && MISSING_VARS+=("DATABASE_USER")
        [ -z "$DATABASE_PASSWORD" ] && MISSING_VARS+=("DATABASE_PASSWORD")
    fi
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Warning: Missing environment variables:${NC}"
        for var in "${MISSING_VARS[@]}"; do
            echo "   - $var"
        done
    fi
else
    echo -e "${YELLOW}⚠️  Warning: .env file not found at $ENV_FILE${NC}"
    echo "   Make sure environment variables are properly set!"
fi
echo ""

# =============================================================================
# Step 2: Activate virtual environment / Install dependencies
# =============================================================================
echo -e "${BLUE}📦 Step 2: Setting up Python environment...${NC}"
if [ -d "$VENV_DIR" ]; then
    echo "Activating virtual environment..."
    source "$VENV_DIR/bin/activate"
else
    echo -e "${YELLOW}Creating virtual environment at $VENV_DIR...${NC}"
    python3 -m venv "$VENV_DIR"
    source "$VENV_DIR/bin/activate"
fi

echo "Installing Python dependencies..."
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo -e "${GREEN}✅ Python dependencies installed${NC}"
echo ""

# =============================================================================
# Ensure log directory exists and is writable
# =============================================================================
echo -e "${BLUE}🗂️  Ensuring log directory exists...${NC}"
if [ -z "$LOG_DIR" ]; then
    # Try reading from .env if available
    if [ -f "$ENV_FILE" ]; then
        # shellcheck disable=SC1090
        source "$ENV_FILE" 2>/dev/null || true
    fi
fi
# Use default if still unset
: ${LOG_DIR:="/home/finance.mstatilitechnologies.com/logs"}
mkdir -p "$LOG_DIR"
touch "$LOG_DIR/gunicorn-access.log" || true
touch "$LOG_DIR/gunicorn-error.log" || true
touch "$LOG_DIR/django.log" || true

if [ "$PRODUCTION" = true ]; then
    # Attempt to set ownership to deploy user if it exists
    if id -u "$DEPLOY_USER" >/dev/null 2>&1; then
        sudo chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$LOG_DIR" || true
    fi
fi
echo -e "${GREEN}✅ Log directory ready: ${LOG_DIR}${NC}"
echo ""
# Step 3: Build frontend
# =============================================================================
echo -e "${BLUE}🔨 Step 3: Building frontend...${NC}"
if [ -d "client" ] && [ -f "client/package.json" ]; then
    cd client
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install
    fi
    
    echo "Building React app..."
    npm run build
    
    cd ..
    echo -e "${GREEN}✅ Frontend built to client/dist/${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping frontend build (client directory not found)${NC}"
fi
echo ""

# =============================================================================
# Step 4: Copy frontend to templates (for Django to serve)
# =============================================================================
echo -e "${BLUE}📄 Step 4: Setting up frontend for Django serving...${NC}"
if [ -f "client/dist/index.html" ]; then
    # Ensure templates directory exists
    mkdir -p templates
    
    # Copy index.html to templates directory
    cp client/dist/index.html templates/index.html
    
    # Update asset paths in index.html to use Django static
    # The assets are served from /static/ via WhiteNoise
    sed -i.bak 's|"/assets/|"/static/|g' templates/index.html
    sed -i.bak 's|src="/|src="/static/|g' templates/index.html
    sed -i.bak 's|href="/assets/|href="/static/|g' templates/index.html
    rm -f templates/index.html.bak
    
    echo -e "${GREEN}✅ Frontend index.html copied to templates/${NC}"
else
    echo -e "${YELLOW}⚠️  client/dist/index.html not found - build frontend first${NC}"
fi
echo ""

# =============================================================================
# Step 5: Run Django checks
# =============================================================================
echo -e "${BLUE}🔍 Step 5: Running Django system checks...${NC}"
if $PRODUCTION; then
    python manage.py check --deploy || {
        echo -e "${YELLOW}⚠️  Some deployment checks failed - review above warnings${NC}"
    }
else
    python manage.py check
fi
echo -e "${GREEN}✅ Django checks completed${NC}"
echo ""

# =============================================================================
# Step 6: Run database migrations
# =============================================================================
echo -e "${BLUE}🗄️  Step 6: Running database migrations...${NC}"
python manage.py migrate --noinput
echo -e "${GREEN}✅ Migrations applied${NC}"
echo ""

# =============================================================================
# Step 7: Collect static files
# =============================================================================
echo -e "${BLUE}📁 Step 7: Collecting static files...${NC}"
python manage.py collectstatic --noinput --clear
echo -e "${GREEN}✅ Static files collected to staticfiles/${NC}"
echo ""

# =============================================================================
# Step 8: Production-specific tasks
# =============================================================================
if $PRODUCTION; then
    echo -e "${BLUE}🔄 Step 8: Restarting services...${NC}"
    
    # Restart Gunicorn service
    if systemctl is-active --quiet finance-app; then
        sudo systemctl restart finance-app
        echo -e "${GREEN}✅ Gunicorn service restarted${NC}"
    else
        echo -e "${YELLOW}⚠️  finance-app service not running - starting it...${NC}"
        sudo systemctl start finance-app
    fi
    
    echo ""
fi

# =============================================================================
# Summary
# =============================================================================
echo -e "${GREEN}=============================================="
echo -e "✅ Deployment preparation complete!"
echo -e "==============================================${NC}"
echo ""

if $PRODUCTION; then
    echo -e "${BLUE}🔗 Your app should be live at:${NC}"
    echo "   https://finance.mstatilitechnologies.com"
    echo ""
    echo -e "${BLUE}📊 Useful commands:${NC}"
    echo "   View logs:      sudo journalctl -u finance-app -f"
    echo "   Restart:        sudo systemctl restart finance-app"
    echo "   Status:         sudo systemctl status finance-app"
    echo "   Check health:   curl https://finance.mstatilitechnologies.com/api/health/"
else
    echo -e "${BLUE}🖥️  To start the development server:${NC}"
    echo "   python manage.py runserver"
    echo ""
    echo -e "${BLUE}🚀 To start production server locally:${NC}"
    echo "   gunicorn backend.wsgi:application --bind 0.0.0.0:8000"
fi
echo ""
