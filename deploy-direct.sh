#!/bin/bash
# Direct VPS Deployment Script for Personal Finance App
# Usage: ./deploy-direct.sh

set -e  # Exit on error

echo "========================================="
echo "Personal Finance App - Direct Deployment"
echo "========================================="

# Configuration
APP_DIR="/home/finance.mstatilitechnologies.com/personal-finance-app"
VENV_DIR="$APP_DIR/.venv"
SERVICE_NAME="finance-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}⚠️  Please don't run as root. Run as your regular user with sudo privileges.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Starting deployment..."

# Navigate to app directory
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}✗${NC} App directory not found: $APP_DIR"
    echo "Please update APP_DIR in this script to match your installation path."
    exit 1
fi

cd "$APP_DIR"

# Pull latest code
echo -e "\n${YELLOW}→${NC} Pulling latest code from git..."
git pull origin main || git pull origin master

# Activate virtual environment
echo -e "\n${YELLOW}→${NC} Activating virtual environment..."
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${RED}✗${NC} Virtual environment not found. Creating..."
    python3 -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"

# Install/update dependencies
echo -e "\n${YELLOW}→${NC} Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Check if .env.production exists
if [ ! -f "$APP_DIR/.env.production" ]; then
    echo -e "${YELLOW}⚠️${NC} .env.production not found. Creating from example..."
    if [ -f "$APP_DIR/.env.production.example" ]; then
        cp "$APP_DIR/.env.production.example" "$APP_DIR/.env.production"
        echo -e "${RED}⚠️  IMPORTANT: Edit .env.production with your actual values!${NC}"
        echo "Press Enter to continue after editing..."
        read
    else
        echo -e "${RED}✗${NC} .env.production.example not found!"
        exit 1
    fi
fi

# Run database migrations
echo -e "\n${YELLOW}→${NC} Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo -e "\n${YELLOW}→${NC} Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create necessary directories
echo -e "\n${YELLOW}→${NC} Creating directories..."
mkdir -p logs media staticfiles

# Set permissions
echo -e "\n${YELLOW}→${NC} Setting permissions..."
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"
sudo chmod -R 775 "$APP_DIR/logs" "$APP_DIR/media"

# Install/update systemd service
echo -e "\n${YELLOW}→${NC} Installing systemd service..."
if [ -f "$APP_DIR/deploy/systemd/finance-app.service" ]; then
    sudo cp "$APP_DIR/deploy/systemd/finance-app.service" "/etc/systemd/system/$SERVICE_NAME.service"
    sudo systemctl daemon-reload
    sudo systemctl enable "$SERVICE_NAME"
else
    echo -e "${YELLOW}⚠️${NC} Systemd service file not found. Skipping..."
fi

# Install/update nginx config
echo -e "\n${YELLOW}→${NC} Installing nginx configuration..."
if [ -f "$APP_DIR/deploy/nginx/finance-app.conf" ]; then
    sudo cp "$APP_DIR/deploy/nginx/finance-app.conf" "/etc/nginx/sites-available/finance-app.conf"
    sudo ln -sf "/etc/nginx/sites-available/finance-app.conf" "/etc/nginx/sites-enabled/finance-app.conf"
    
    # Test nginx config
    if sudo nginx -t; then
        echo -e "${GREEN}✓${NC} Nginx configuration is valid"
    else
        echo -e "${RED}✗${NC} Nginx configuration test failed!"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️${NC} Nginx config file not found. Skipping..."
fi

# Restart services
echo -e "\n${YELLOW}→${NC} Restarting services..."
if sudo systemctl is-active --quiet "$SERVICE_NAME"; then
    sudo systemctl restart "$SERVICE_NAME"
    echo -e "${GREEN}✓${NC} Restarted $SERVICE_NAME"
else
    sudo systemctl start "$SERVICE_NAME"
    echo -e "${GREEN}✓${NC} Started $SERVICE_NAME"
fi

sudo systemctl reload nginx
echo -e "${GREEN}✓${NC} Reloaded nginx"

# Check service status
echo -e "\n${YELLOW}→${NC} Checking service status..."
if sudo systemctl is-active --quiet "$SERVICE_NAME"; then
    echo -e "${GREEN}✓${NC} Service is running"
else
    echo -e "${RED}✗${NC} Service failed to start. Checking logs..."
    sudo journalctl -u "$SERVICE_NAME" -n 50 --no-pager
    exit 1
fi

echo -e "\n${GREEN}========================================="
echo "✓ Deployment completed successfully!"
echo "=========================================${NC}"
echo ""
echo "Service status: sudo systemctl status $SERVICE_NAME"
echo "View logs:      sudo journalctl -u $SERVICE_NAME -f"
echo "Nginx logs:     tail -f $APP_DIR/logs/nginx-*.log"
echo "App logs:       tail -f $APP_DIR/logs/*.log"
echo ""
echo "Your app should now be running at:"
echo "https://finance.mstatilitechnologies.com"
