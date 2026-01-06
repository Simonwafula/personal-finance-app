#!/bin/bash
# =============================================================================
# OpenLiteSpeed Deployment Script for Personal Finance App
# =============================================================================
# This script deploys the Django + React application on a CyberPanel/OLS server
# 
# Usage: 
#   1. SSH into your server: ssh root@your-server-ip
#   2. Clone or upload this repo
#   3. Run: chmod +x deploy-ols.sh && ./deploy-ols.sh
# =============================================================================

set -e  # Exit on any error

# =============================================================================
# CONFIGURATION - Your CyberPanel Setup
# =============================================================================
DOMAIN="finance.mstatilitechnologies.com"   # Your domain name
APP_USER="finan6751"                         # CyberPanel assigned user
HOME_DIR="/home/finance.mstatilitechnologies.com"   # Home directory
APP_DIR="${HOME_DIR}/public_html"           # Git root / app directory
PUBLIC_HTML="${HOME_DIR}/public_html"       # Frontend deployment (same as APP_DIR)
VENV_PATH="${HOME_DIR}/.venv"               # Virtual environment
ENV_FILE="${HOME_DIR}/.env"                 # Environment file
LOG_DIR="${HOME_DIR}/logs"                  # Log directory
PYTHON_VERSION="python3.11"                 # or python3.10, python3.9

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# =============================================================================
# PRE-FLIGHT CHECKS
# =============================================================================

print_header "Pre-flight Checks"

check_root

# Check if CyberPanel/OpenLiteSpeed is installed
if ! command -v /usr/local/lsws/bin/lswsctrl &> /dev/null; then
    print_error "OpenLiteSpeed not found. Please install CyberPanel first."
    echo "Install CyberPanel: sh <(curl https://cyberpanel.net/install.sh || wget -O - https://cyberpanel.net/install.sh)"
    exit 1
fi
print_success "OpenLiteSpeed found"

# Check Python
if ! command -v $PYTHON_VERSION &> /dev/null; then
    print_warning "Python $PYTHON_VERSION not found, trying python3..."
    PYTHON_VERSION="python3"
fi
print_success "Python: $($PYTHON_VERSION --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
print_success "Node.js: $(node --version)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL not found. Installing..."
    apt-get install -y postgresql postgresql-contrib libpq-dev
    systemctl enable postgresql
    systemctl start postgresql
fi
print_success "PostgreSQL: $(psql --version | head -1)"

# =============================================================================
# STEP 1: CREATE DIRECTORIES
# =============================================================================

print_header "Step 1: Creating Directories"

mkdir -p "$LOG_DIR"
mkdir -p "$APP_DIR"

# Set ownership (CyberPanel creates the user with domain name)
if id "$APP_USER" &>/dev/null; then
    chown -R "$APP_USER:$APP_USER" "/home/${DOMAIN}"
    print_success "Directories created and ownership set to $APP_USER"
else
    print_warning "User $APP_USER not found. Website may not be created in CyberPanel yet."
    print_warning "Create the website first via CyberPanel GUI, then re-run this script."
fi

# =============================================================================
# STEP 2: SETUP PYTHON VIRTUAL ENVIRONMENT
# =============================================================================

print_header "Step 2: Setting up Python Environment"

cd "$APP_DIR"

# Create virtual environment
if [ ! -d "$VENV_PATH" ]; then
    $PYTHON_VERSION -m venv "$VENV_PATH"
    print_success "Virtual environment created at $VENV_PATH"
else
    print_success "Virtual environment already exists"
fi

# Activate and install dependencies
source "$VENV_PATH/bin/activate"
pip install --upgrade pip
pip install -r requirements.txt
print_success "Python dependencies installed"

# =============================================================================
# STEP 3: CREATE ENVIRONMENT FILE
# =============================================================================

print_header "Step 3: Creating Environment File"

if [ ! -f "$ENV_FILE" ]; then
    # Generate Django secret key
    SECRET_KEY=$($PYTHON_VERSION -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
    
    cat > "$ENV_FILE" << EOF
# Django Core
DJANGO_SECRET_KEY=$SECRET_KEY
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=$DOMAIN,www.$DOMAIN

# Database - PostgreSQL
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=finance_user
DATABASE_PASSWORD=CHANGE_THIS_PASSWORD
DATABASE_HOST=localhost
DATABASE_PORT=5432

# CORS & CSRF
CORS_ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN
CSRF_TRUSTED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SOCIALACCOUNT_LOGIN_REDIRECT_URL=https://$DOMAIN/oauth-callback

# Session/Cookie Security
SESSION_COOKIE_DOMAIN=.$DOMAIN
SECURE_SSL_REDIRECT=True
EOF

    chmod 600 "$ENV_FILE"
    print_success "Environment file created at $ENV_FILE"
    print_warning "IMPORTANT: Edit $ENV_FILE with your actual values!"
else
    print_success "Environment file already exists"
fi

# # =============================================================================
# # STEP 4: SETUP DATABASE
# # =============================================================================

# print_header "Step 4: Database Setup"

# # Behavior:
# # - If SKIP_DB_CREATION is set to "1" or AUTO_DB="n", skip creation.
# # - If AUTO_DB="y" or CREATE_DB is answered "y", create if missing.
# # - If DB or user already exists, skip creation for that object.

# SKIP_DB_CREATION=${SKIP_DB_CREATION:-}
# AUTO_DB=${AUTO_DB:-}

# if [ "$SKIP_DB_CREATION" = "1" ] || [ "$AUTO_DB" = "n" ]; then
#     print_warning "Skipping database creation due to SKIP_DB_CREATION/AUTO_DB setting"
# else
#     # Detect if DB exists
#     DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='finance_db'" || echo "")
#     USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='finance_user'" || echo "")

#     if [ "${AUTO_DB}" = "y" ]; then
#         WANT_CREATE="y"
#     else
#         # Only prompt if running interactively
#         if [ -t 0 ]; then
#             echo "Do you want to create the PostgreSQL database/user if missing? (y/n) [n]"
#             read -r CREATE_DB || CREATE_DB="n"
#             CREATE_DB=${CREATE_DB:-n}
#             WANT_CREATE=$(echo "$CREATE_DB" | tr '[:upper:]' '[:lower:]')
#         else
#             WANT_CREATE="n"
#         fi
#     fi

#     if [ "$DB_EXISTS" = "1" ]; then
#         print_success "Database 'finance_db' already exists, skipping database creation"
#     fi

#     if [ "$USER_EXISTS" = "1" ]; then
#         print_success "User 'finance_user' already exists, skipping user creation"
#     fi

#     if [ "$WANT_CREATE" = "y" ]; then
#         # Ask for password only if user is missing
#         if [ "$USER_EXISTS" != "1" ]; then
#             echo "Enter database password for finance_user (will not be shown):"
#             read -rs DB_PASSWORD
#             echo
#         else
#             DB_PASSWORD=""
#         fi

#         sudo -u postgres psql <<-SQL
# DO $$ BEGIN
#     IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'finance_db') THEN
#         PERFORM pg_catalog.pg_create_db('finance_db');
#     END IF;
# END$$;
# SQL

#         if [ -n "$DB_PASSWORD" ]; then
#             sudo -u postgres psql <<-SQL
#             CREATE USER IF NOT EXISTS finance_user WITH PASSWORD '$DB_PASSWORD';
#             ALTER ROLE finance_user SET client_encoding TO 'utf8';
#             ALTER ROLE finance_user SET default_transaction_isolation TO 'read committed';
#             ALTER ROLE finance_user SET timezone TO 'UTC';
#             GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
#             \c finance_db
#             GRANT ALL ON SCHEMA public TO finance_user;
# SQL
#         else
#             # User exists, ensure grants are present
#             sudo -u postgres psql -d finance_db -c "GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;" || true
#             sudo -u postgres psql -d finance_db -c "GRANT ALL ON SCHEMA public TO finance_user;" || true
#         fi

#         print_success "PostgreSQL database/user creation step completed (if they were missing)"
#         if [ -n "$DB_PASSWORD" ]; then
#             print_warning "Update DATABASE_PASSWORD in $ENV_FILE with: $DB_PASSWORD"
#         fi
#     else
#         print_warning "Database/user creation skipped by user choice"
#     fi
# fi

# =============================================================================
# STEP 5: DJANGO SETUP
# =============================================================================

print_header "Step 5: Django Setup"

cd "$APP_DIR"
source "$VENV_PATH/bin/activate"

# Export environment variables safely (handle special chars in values)
if [ -f "$ENV_FILE" ]; then
    TMP_ENV_EXPORTS="$(mktemp)"
    # Create a temporary script that exports each VAR with proper single-quote escaping
    while IFS= read -r _line || [ -n "$_line" ]; do
        line="$_line"
        # skip empty lines and comments
        case "$line" in
            ''|\#*) continue ;;
        esac
        key="${line%%=*}"
        val="${line#*=}"
        # escape single quotes in the value
        esc_val="$(printf "%s" "$val" | sed "s/'/'\\''/g")"
        printf "export %s='%s'\n" "$key" "$esc_val" >> "$TMP_ENV_EXPORTS"
    done < "$ENV_FILE"

    set -a
    # shellcheck disable=SC1090
    . "$TMP_ENV_EXPORTS"
    set +a
    rm -f "$TMP_ENV_EXPORTS"
fi

# Run migrations
python manage.py migrate --noinput
print_success "Database migrations complete"

# Collect static files
python manage.py collectstatic --noinput
print_success "Static files collected"

# Create superuser prompt
echo "Do you want to create a Django superuser? (y/n)"
read -r CREATE_SUPER

if [ "$CREATE_SUPER" = "y" ]; then
    python manage.py createsuperuser
fi

# =============================================================================
# STEP 6: BUILD FRONTEND
# =============================================================================

print_header "Step 6: Building Frontend"

cd "$APP_DIR/client"

# Create production environment
cat > .env.production << EOF
VITE_API_BASE_URL=https://$DOMAIN/api
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
EOF

print_warning "Edit client/.env.production with your actual Google Client ID"

# Install and build
npm install
npm run build
print_success "Frontend built"

# Since public_html IS the git root, we copy frontend files to the root
# The React app's index.html goes to public_html/index.html
# Assets go to public_html/assets/
print_success "Frontend built in client/dist/"
print_warning "Frontend files are in client/dist/ - OLS will serve index.html from there or copy manually"

# Copy .htaccess for OLS to public_html root
cp "$APP_DIR/deploy/openlitespeed/.htaccess" "$PUBLIC_HTML/.htaccess" 2>/dev/null || true
print_success ".htaccess configured for OpenLiteSpeed"

# =============================================================================
# STEP 7: CREATE SYSTEMD SERVICE
# =============================================================================

print_header "Step 7: Creating Systemd Service"

cat > /etc/systemd/system/finance-app.service << EOF
[Unit]
Description=Personal Finance App - Gunicorn
After=network.target postgresql.service
Wants=postgresql.service

[Service]
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$ENV_FILE
ExecStart=$VENV_PATH/bin/gunicorn \\
    --workers 3 \\
    --bind 127.0.0.1:8000 \\
    --timeout 120 \\
    --access-logfile $LOG_DIR/gunicorn-access.log \\
    --error-logfile $LOG_DIR/gunicorn-error.log \\
    --capture-output \\
    backend.wsgi:application

Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable finance-app
systemctl start finance-app

print_success "Gunicorn service created and started"

# =============================================================================
# STEP 8: SET PERMISSIONS
# =============================================================================

print_header "Step 8: Setting Permissions"

if id "$APP_USER" &>/dev/null; then
    chown -R "$APP_USER:$APP_USER" "$HOME_DIR"
    chmod 755 "$PUBLIC_HTML"
    chmod 600 "$ENV_FILE"
    print_success "Permissions set"
fi

# =============================================================================
# STEP 9: CONFIGURE OPENLITESPEED REWRITE RULES
# =============================================================================

print_header "Step 9: OpenLiteSpeed Configuration"

echo -e "${YELLOW}
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    MANUAL CONFIGURATION REQUIRED                              ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  1. Log into CyberPanel: https://67.217.62.77:8090                            ║
║                                                                               ║
║  2. Go to: Websites → List Websites → $DOMAIN → Manage                        ║
║                                                                               ║
║  3. Click 'Rewrite Rules' and add these rules:                                ║
║                                                                               ║
║     RewriteEngine On                                                          ║
║     RewriteRule ^/api/(.*)$ http://127.0.0.1:8000/api/\$1 [P,L]               ║
║     RewriteRule ^/admin/(.*)$ http://127.0.0.1:8000/admin/\$1 [P,L]           ║
║     RewriteRule ^/accounts/(.*)$ http://127.0.0.1:8000/accounts/\$1 [P,L]     ║
║     RewriteRule ^/static/(.*)$ http://127.0.0.1:8000/static/\$1 [P,L]         ║
║     RewriteRule ^/assets/(.*)$ /client/dist/assets/\$1 [L]                    ║
║     RewriteCond %{REQUEST_FILENAME} !-f                                       ║
║     RewriteCond %{REQUEST_FILENAME} !-d                                       ║
║     RewriteCond %{REQUEST_URI} !^/api/                                        ║
║     RewriteCond %{REQUEST_URI} !^/admin/                                      ║
║     RewriteCond %{REQUEST_URI} !^/accounts/                                   ║
║     RewriteCond %{REQUEST_URI} !^/static/                                     ║
║     RewriteRule ^(.*)$ /client/dist/index.html [L]                            ║
║                                                                               ║
║  4. Click 'Issue SSL' to get Let's Encrypt certificate                        ║
║                                                                               ║
║  5. Restart LiteSpeed:                                                        ║
║     systemctl restart lsws                                                    ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
${NC}"

# =============================================================================
# STEP 10: VERIFY DEPLOYMENT
# =============================================================================

print_header "Step 10: Verification"

# Check Gunicorn
if systemctl is-active --quiet finance-app; then
    print_success "Gunicorn service is running"
else
    print_error "Gunicorn service is not running"
    echo "Check logs: journalctl -u finance-app -f"
fi

# Check OpenLiteSpeed
if systemctl is-active --quiet lsws; then
    print_success "OpenLiteSpeed is running"
else
    print_error "OpenLiteSpeed is not running"
fi

# Test local API
echo -e "\nTesting local API..."
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/api/ | grep -q "200\|404\|401"; then
    print_success "Django API is responding"
else
    print_warning "Django API may not be responding (check logs)"
fi

# =============================================================================
# SUMMARY
# =============================================================================

print_header "Deployment Summary"

echo -e "
${GREEN}✓ Deployment completed!${NC}

${YELLOW}Important Next Steps:${NC}
1. Verify environment file: nano $ENV_FILE
   - Ensure DATABASE_PASSWORD is correct
   - Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
   
2. Edit frontend env: nano $APP_DIR/client/.env.production
   - Set VITE_GOOGLE_CLIENT_ID
   - Rebuild: cd $APP_DIR/client && npm run build

3. Configure CyberPanel rewrite rules (see instructions above)

4. Issue SSL certificate via CyberPanel

5. Restart services:
   systemctl restart finance-app
   systemctl restart lsws

${YELLOW}Your Setup:${NC}
- Domain: $DOMAIN
- User: $APP_USER
- Home: $HOME_DIR
- App: $APP_DIR
- Venv: $VENV_PATH
- Env: $ENV_FILE
- Logs: $LOG_DIR

${YELLOW}Useful Commands:${NC}
- View Gunicorn logs: journalctl -u finance-app -f
- View error logs: tail -f $LOG_DIR/gunicorn-error.log
- Restart app: systemctl restart finance-app
- Restart OLS: systemctl restart lsws
- Django shell: cd $APP_DIR && source $VENV_PATH/bin/activate && python manage.py shell

${YELLOW}Test URLs (after SSL):${NC}
- Frontend: https://$DOMAIN
- API: https://$DOMAIN/api/
- Admin: https://$DOMAIN/admin/
- OAuth: https://$DOMAIN/accounts/google/login/
"
