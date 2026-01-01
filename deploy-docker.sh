#!/bin/bash
# ============================================
# Personal Finance App - One Command Deploy
# ============================================
# Usage:
#   ./deploy-docker.sh              # Full deploy
#   ./deploy-docker.sh build        # Build only
#   ./deploy-docker.sh up           # Start containers
#   ./deploy-docker.sh down         # Stop containers
#   ./deploy-docker.sh logs         # View logs
#   ./deploy-docker.sh restart      # Restart all
#   ./deploy-docker.sh ssl          # Setup SSL certificates
#   ./deploy-docker.sh local        # Run locally for testing
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"
DOMAIN="finance.mstatilitechnologies.com"

# Helper functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Prerequisites check passed!"
}

# Create .env.production if not exists
setup_env() {
    if [ ! -f "$ENV_FILE" ]; then
        log_warn ".env.production not found. Creating from example..."
        if [ -f ".env.production.example" ]; then
            cp .env.production.example "$ENV_FILE"
            log_warn "Please edit $ENV_FILE with your production values!"
            exit 1
        else
            log_error ".env.production.example not found!"
            exit 1
        fi
    fi
    log_success "Environment file found!"
}

# Create required directories
setup_dirs() {
    log_info "Creating required directories..."
    mkdir -p logs media certbot/conf certbot/www nginx/conf.d
    log_success "Directories created!"
}

# Build Docker images
build() {
    log_info "Building Docker images..."
    docker compose -f $COMPOSE_FILE build --no-cache
    log_success "Build complete!"
}

# Start containers
up() {
    log_info "Starting containers..."
    docker compose -f $COMPOSE_FILE up -d
    log_success "Containers started!"
    
    log_info "Waiting for services to be healthy..."
    sleep 5
    
    # Run migrations
    log_info "Running database migrations..."
    docker compose -f $COMPOSE_FILE exec -T backend python manage.py migrate --noinput || true
    
    log_success "Deploy complete! App is running."
    echo ""
    echo "=========================================="
    echo "  App URL: http://localhost"
    echo "  Admin: http://localhost/admin/"
    echo "=========================================="
}

# Stop containers
down() {
    log_info "Stopping containers..."
    docker compose -f $COMPOSE_FILE down
    log_success "Containers stopped!"
}

# View logs
logs() {
    docker compose -f $COMPOSE_FILE logs -f
}

# Restart all services
restart() {
    log_info "Restarting all services..."
    docker compose -f $COMPOSE_FILE restart
    log_success "Services restarted!"
}

# Full deploy (build + up)
deploy() {
    check_prerequisites
    setup_env
    setup_dirs
    
    log_info "Starting full deployment..."
    
    # Stop existing containers
    docker compose -f $COMPOSE_FILE down 2>/dev/null || true
    
    # Build and start
    build
    up
    
    log_success "🚀 Deployment complete!"
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    if [ -z "$DOMAIN" ]; then
        log_error "Please set DOMAIN variable in this script"
        exit 1
    fi
    
    # Create initial certificate
    docker compose -f $COMPOSE_FILE run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@$DOMAIN \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN
    
    log_success "SSL certificates created! Update nginx config to enable HTTPS."
}

# Local development with Docker
local() {
    log_info "Starting local Docker environment..."
    
    # Use a simpler local env
    export DJANGO_DEBUG=True
    
    docker compose -f $COMPOSE_FILE up --build
}

# Show status
status() {
    docker compose -f $COMPOSE_FILE ps
}

# Backup database
backup() {
    log_info "Backing up database..."
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sqlite3"
    cp db.sqlite3 "backups/$BACKUP_FILE"
    log_success "Backup saved to backups/$BACKUP_FILE"
}

# Shell into backend container
shell() {
    docker compose -f $COMPOSE_FILE exec backend python manage.py shell
}

# Django management command
manage() {
    docker compose -f $COMPOSE_FILE exec backend python manage.py "$@"
}

# Main entry point
case "${1:-deploy}" in
    build)
        check_prerequisites
        build
        ;;
    up)
        check_prerequisites
        setup_env
        up
        ;;
    down)
        down
        ;;
    logs)
        logs
        ;;
    restart)
        restart
        ;;
    ssl)
        setup_ssl
        ;;
    local)
        local
        ;;
    status)
        status
        ;;
    backup)
        backup
        ;;
    shell)
        shell
        ;;
    manage)
        shift
        manage "$@"
        ;;
    deploy|*)
        deploy
        ;;
esac
