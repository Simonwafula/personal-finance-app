#!/bin/bash
# =============================================================================
# Quick Update Script for Personal Finance App (OpenLiteSpeed/CyberPanel)
# =============================================================================
# Run this on the server after pushing changes to git
# Usage: ./deploy-direct.sh
# =============================================================================

set -e  # Exit on error

echo "========================================="
echo "Personal Finance App - Quick Update"
echo "========================================="

# Configuration - matches your CyberPanel setup
HOME_DIR="/home/finance.mstatilitechnologies.com"
APP_DIR="${HOME_DIR}/public_html"
VENV_DIR="${HOME_DIR}/.venv"
ENV_FILE="${HOME_DIR}/.env"
LOG_DIR="${HOME_DIR}/logs"
SERVICE_NAME="finance-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}✓${NC} Starting update..."

# Navigate to app directory
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}✗${NC} App directory not found: $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

# Pull latest code
echo -e "\n${YELLOW}→${NC} Pulling latest code from git..."
git pull origin main || git pull origin master

# Activate virtual environment
echo -e "\n${YELLOW}→${NC} Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Install/update dependencies
echo -e "\n${YELLOW}→${NC} Installing Python dependencies..."
pip install -r requirements.txt

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# Run database migrations
echo -e "\n${YELLOW}→${NC} Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo -e "\n${YELLOW}→${NC} Collecting static files..."
python manage.py collectstatic --noinput

# Build frontend (optional - uncomment if needed)
echo -e "\n${YELLOW}→${NC} Building frontend..."
cd "$APP_DIR/client"
npm install
npm run build
cd "$APP_DIR"

# Restart Gunicorn service
echo -e "\n${YELLOW}→${NC} Restarting Gunicorn service..."
# Optional: if a prepared systemd unit or OLS vhost is included in repo, install them (backup originals)
if [ -f "$APP_DIR/deploy/systemd/finance-app.service" ]; then
    echo -e "\n${YELLOW}→${NC} Installing systemd unit from repo (backup first)..."
    sudo cp /etc/systemd/system/finance-app.service /etc/systemd/system/finance-app.service.bak 2>/dev/null || true
    sudo cp "$APP_DIR/deploy/systemd/finance-app.service" /etc/systemd/system/finance-app.service
    sudo chown root:root /etc/systemd/system/finance-app.service || true
    sudo chmod 644 /etc/systemd/system/finance-app.service || true
    sudo systemctl daemon-reload || true
fi

# Optional: install OpenLiteSpeed vhost if present
VHOST_DIR=/usr/local/lsws/conf/vhosts/finance.mstatilitechnologies.com
if [ -f "$APP_DIR/deploy/openlitespeed/vhost.conf" ] && [ -d "$VHOST_DIR" ]; then
    echo -e "\n${YELLOW}→${NC} Installing OLS vhost from repo (backup first)..."
    sudo cp "$VHOST_DIR/vhost.conf" "$VHOST_DIR/vhost.conf.bak" 2>/dev/null || true
    sudo cp "$APP_DIR/deploy/openlitespeed/vhost.conf" "$VHOST_DIR/vhost.conf"
    sudo chown root:root "$VHOST_DIR/vhost.conf" || true
    sudo chmod 644 "$VHOST_DIR/vhost.conf" || true
    sudo systemctl restart lsws || true
fi

echo -e "\n${YELLOW}→${NC} Restarting Gunicorn service..."
sudo systemctl restart "$SERVICE_NAME"

# Check service status
echo -e "\n${YELLOW}→${NC} Checking service status..."
if sudo systemctl is-active --quiet "$SERVICE_NAME"; then
    echo -e "${GREEN}✓${NC} Gunicorn service is running"
else
    echo -e "${RED}✗${NC} Service failed to start. Checking logs..."
    sudo journalctl -u "$SERVICE_NAME" -n 20 --no-pager
    exit 1
fi

echo -e "\n${GREEN}========================================="
echo "✓ Update completed successfully!"
echo "=========================================${NC}"
echo ""
echo "Useful commands:"
echo "  Service status: sudo systemctl status $SERVICE_NAME"
echo "  View logs:      sudo journalctl -u $SERVICE_NAME -f"
echo "  Error logs:     tail -f $LOG_DIR/gunicorn-error.log"
echo ""
echo "Your app: https://finance.mstatilitechnologies.com"
