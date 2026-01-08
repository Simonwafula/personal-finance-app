# Personal Finance Management System

A comprehensive personal finance management application with dual-platform support (Web + Android) and SMS transaction auto-detection.

## 🌟 Features

### Core Features
- **📊 Dashboard**: Real-time financial overview with income, expenses, and net worth tracking
- **💰 Transactions**: Complete transaction management with categories, tags, and search
- **📈 Budgets**: Monthly budget planning and tracking with visual progress indicators
- **🎯 Savings Goals**: Track progress toward financial goals with target amounts and deadlines
- **💼 Investments**: Portfolio management with performance tracking and gain/loss analysis
- **💳 Debt Planner**: Debt payoff strategies with amortization schedules
- **📱 Subscriptions**: Recurring payment tracking and management
- **🏦 Accounts**: Multi-account support (Bank, Mobile Money, Cash, SACCO, etc.)
- **📊 Reports**: Comprehensive financial reports and analytics
- **🌐 Multi-currency**: Support for multiple currencies with proper formatting

### Mobile-Exclusive Features (Android)
- **📱 SMS Transaction Detection**: Automatic transaction detection from financial SMS
  - Support for 19+ financial institutions (Kenya, Nigeria, South Africa)
  - M-PESA, KCB, Equity, Co-op Bank, ABSA, Stanbic, and more
  - Privacy-first: All SMS parsing done locally on device
  - Intelligent category suggestions
  - Quick-save and edit transaction details

## 🏗️ Architecture

### Technology Stack

**Frontend (Web & Mobile)**
- React 19.2.0 with TypeScript
- Vite 7.2.4 (build tool)
- React Router 7.9.6 (navigation)
- Recharts 3.5.0 (charts and visualizations)
- Tailwind CSS 4.1.17 (styling)
- Capacitor 8.0.0 (mobile platform)

**Backend**
- Django 5.0+ (Python web framework)
- Django REST Framework (API)
- PostgreSQL (database)
- Gunicorn (WSGI server)
- OpenLiteSpeed (web server)

**Mobile**
- Capacitor for native Android integration
- Native SMS Reader plugin (Java)
- Platform detection for conditional features

### Project Structure

```
personal-finance-app/
├── client/                      # Frontend application
│   ├── src/
│   │   ├── api/                 # API client and types
│   │   ├── components/          # Reusable React components
│   │   ├── contexts/            # React contexts (auth, theme, etc.)
│   │   ├── features/            # Feature modules
│   │   │   └── sms/            # SMS transaction detection (mobile-only)
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Utility functions and platform detection
│   │   └── main.tsx            # App entry point
│   ├── android/                # Android native project (Capacitor)
│   │   └── app/src/main/java/com/mstatilitechnologies/finance/
│   │       ├── MainActivity.java
│   │       └── plugins/SmsReaderPlugin.java
│   ├── package.json            # Dependencies and build scripts
│   ├── vite.config.ts          # Vite configuration
│   └── capacitor.config.ts     # Capacitor configuration
│
├── finance/                    # Django app - core finance features
├── profiles/                   # Django app - user profiles
├── savings/                    # Django app - savings goals
├── investments/                # Django app - investments tracking
├── subscriptions/              # Django app - subscription management
├── debt/                       # Django app - debt planning
├── wealth/                     # Django app - net worth tracking
│
├── backend/                    # Django project settings
├── deploy/                     # Deployment configurations
│   ├── openlitespeed/          # OLS web server configs
│   └── systemd/                # Systemd service files
│
├── docs/                       # Documentation
│   └── archive/                # Archived documentation
│
├── DEPLOYMENT.md               # Production deployment guide
├── MOBILE_BUILD_GUIDE.md       # Mobile app build instructions
├── PHASE2-5_SUMMARY.md         # Mobile integration summary
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

**For Web Development:**
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

**For Mobile Development (Additional):**
- Android SDK and build tools
- Java Development Kit (JDK) 11+

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Simonwafula/personal-finance-app.git
cd personal-finance-app
```

#### 2. Backend Setup

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
createdb finance_db
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver 8001
```

#### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Run development server (web)
npm run dev

# Open browser to http://localhost:5173
```

### Build Commands

#### Web Build

```bash
cd client
npm run build:web          # Production web build
npm run build              # Default build (web)
```

#### Mobile Build

```bash
cd client
npm run build:mobile       # Build with mobile features
npm run cap:sync          # Sync to Android
npm run android:debug     # Build debug APK
npm run android:release   # Build release APK
```

## 📱 Mobile App

### Building Android APK

See [MOBILE_BUILD_GUIDE.md](MOBILE_BUILD_GUIDE.md) for detailed instructions.

**Quick Build:**
```bash
cd client
npm run android:debug
```

**Output:** `client/android/app/build/outputs/apk/debug/app-debug.apk` (4.6 MB)

### Supported Financial Institutions (SMS Detection)

**Kenya:** M-PESA, KCB, Equity Bank, Co-operative Bank, ABSA, Stanbic, DTB, NCBA, Family Bank, I&M Bank

**Nigeria:** GTBank, First Bank, Access Bank, UBA, Zenith Bank

**South Africa:** FNB, Standard Bank, Capitec, Nedbank

### Platform Detection

The app automatically detects the platform and loads appropriate features:

- **Web**: SMS features excluded from bundle
- **Mobile (Android)**: SMS features loaded dynamically

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

### Production Environment

**VPS Configuration:**
- Ubuntu 22.04 LTS
- OpenLiteSpeed web server
- PostgreSQL database
- Gunicorn WSGI server
- Systemd service management

**Domain:** https://finance.mstatilitechnologies.com

### Quick Deploy

```bash
# On VPS
cd /home/finance.mstatilitechnologies.com
source .venv/bin/activate

# Update code
git pull origin main

# Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Frontend
cd client
npm install
npm run build:web
cp dist/index.html ../templates/index.html

# Restart services
sudo systemctl restart finance-app
sudo /usr/local/lsws/bin/lswsctrl restart
```

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd client
npm run lint
npm run build  # Type checking included
```

## 📚 API Documentation

The Django REST Framework provides interactive API documentation:

- **Browsable API:** http://localhost:8001/api/
- **Admin Panel:** http://localhost:8001/admin/

### Key Endpoints

- `/api/auth/` - Authentication (login, logout, register)
- `/api/finance/transactions/` - Transaction management
- `/api/finance/categories/` - Category management
- `/api/finance/accounts/` - Account management
- `/api/finance/budgets/` - Budget management
- `/api/savings/goals/` - Savings goals
- `/api/investments/` - Investment tracking
- `/api/subscriptions/` - Subscription management
- `/api/wealth/` - Net worth tracking

## 🔒 Security

- CSRF protection enabled
- Secure password hashing (Django defaults)
- HTTPS enforced in production
- CORS configured for frontend domain
- SMS permissions requested at runtime (mobile)
- Environment variables for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- **Simon Wafula** - *Initial work and development*

## 🙏 Acknowledgments

- M-PESA and bank SMS format inspiration from various Kenyan fintech solutions
- React and Django communities for excellent documentation
- Capacitor team for seamless native integration

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [Your contact information]

## 🗺️ Roadmap

### Completed ✅
- Core finance tracking features
- Multi-account support
- Budget and savings goals
- Investment tracking
- Debt planner
- Mobile app with SMS detection
- Dual-platform build system

### Upcoming 🚀
- iOS support
- Machine learning for category suggestions
- Expense forecasting
- Bill reminders and notifications
- Receipt scanning (OCR)
- Multi-user household budgets
- API for third-party integrations

---

**Version:** 1.0.0-mobile
**Last Updated:** January 2026
**Status:** Production Ready
