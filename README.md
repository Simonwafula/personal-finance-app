# Personal Finance App

A comprehensive personal finance management web application built with Django + DRF backend and React + Vite + TypeScript frontend.

## Features

### Core Modules
- **Transactions** - Track income & expenses with categories, tags, and CSV/M-Pesa import
- **Budgets** - Create monthly/annual budgets with category-based planning
- **Savings Goals** - Set savings targets with progress tracking and transaction linking
- **Debt Planner** - Manage debts with payoff strategies (avalanche/snowball)
- **Investments** - Track stocks, bonds, crypto with gain/loss calculations
- **Wealth Tracking** - Net worth snapshots with assets vs liabilities breakdown
- **Reports** - Financial summaries with PDF/CSV export and filterable transactions

### UI Features
- 🌙 Dark mode (persisted in localStorage)
- 📊 Interactive charts (Recharts)
- 📱 Responsive design (mobile-friendly)
- ⚡ Code-splitting with lazy-loaded pages
- 🔐 Authentication with Google OAuth support

## Tech Stack

| Backend | Frontend |
|---------|----------|
| Django 4.x | React 18 |
| Django REST Framework | TypeScript |
| PostgreSQL/SQLite | Vite |
| Gunicorn | Tailwind CSS |
| WhiteNoise | Recharts |
| django-allauth | jsPDF |

## Quick Start

### Backend (Python)
```bash
# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend (React)
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure
```
├── backend/          # Django settings & URLs
├── finance/          # Transactions, accounts, categories
├── budgeting/        # Budget management
├── savings/          # Savings goals
├── debt_planner/     # Debt management
├── investments/      # Investment tracking
├── wealth/           # Net worth tracking
├── notifications/    # User notifications
├── profiles/         # User profiles
├── client/           # React frontend
│   ├── src/
│   │   ├── api/      # API client functions
│   │   ├── pages/    # Page components
│   │   ├── components/
│   │   └── contexts/ # React contexts
│   └── dist/         # Production build
└── staticfiles/      # Django collected static
```

## Running Tests
```bash
# Backend tests
python manage.py test

# Specific test module
python manage.py test finance.tests_aggregation -v 2
```

## Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide (VPS/CyberPanel)
- [STATIC_FILES_GUIDE.md](./STATIC_FILES_GUIDE.md) - Static files configuration
- [SAVINGS_MODULE_IMPLEMENTATION.md](./SAVINGS_MODULE_IMPLEMENTATION.md) - Savings feature docs
- [SAVINGS_TRANSACTIONS_INTEGRATION.md](./SAVINGS_TRANSACTIONS_INTEGRATION.md) - Transaction-savings linking

## Environment Variables

Create a `.env` file in the project root:
```bash
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional - defaults to SQLite)
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=finance_db
DATABASE_USER=user
DATABASE_PASSWORD=password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
```

## License

MIT
