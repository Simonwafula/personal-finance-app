# Multi-stage Dockerfile for Personal Finance App

# ============================================
# Stage 1: Build React Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY client/ ./

# Build for production
RUN npm run build

# ============================================
# Stage 2: Python Backend
# ============================================
FROM python:3.11-slim AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings
ENV DOCKER_CONTAINER=true

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn psycopg2-binary

# Copy Django project
COPY backend/ ./backend/
COPY finance/ ./finance/
COPY budgeting/ ./budgeting/
COPY wealth/ ./wealth/
COPY debt_planner/ ./debt_planner/
COPY profiles/ ./profiles/
COPY notifications/ ./notifications/
COPY savings/ ./savings/
COPY investments/ ./investments/
COPY templates/ ./templates/
COPY manage.py ./

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/client/dist ./staticfiles/frontend

# Create directories
RUN mkdir -p /app/logs /app/media /app/staticfiles

# Collect static files
RUN python manage.py collectstatic --noinput --clear 2>/dev/null || true

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health/')" || exit 1

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-"]
