# Global Quest Technologies (GQT) CSR Drive Platform

An enterprise-grade, end-to-end recruitment drive orchestration platform empowering institutions, authorities, and student candidates across Karnataka.

---

## Clean Monorepo Architecture

The platform has been reorganized into clear, decoupled, and intuitive root modules:

```plaintext
GQT CSR/
├── frontend/               # React 19 & Next.js 16 Application
│   ├── src/
│   │   ├── app/            # Next.js App Router (Persona portals & API endpoints)
│   │   ├── components/     # Authority-specific dashboards, modals & UI widgets
│   │   ├── services/       # API clients (djangoApi.service.ts, auth, realtime)
│   │   ├── context/        # Global React state providers
│   │   ├── hooks/          # Custom utility hooks
│   │   ├── lib/            # RBAC permissions & security utilities
│   │   └── types/          # Full TypeScript definitions & DB interfaces
│   ├── public/             # Static brand assets & images
│   ├── next.config.ts      # Proxy rewrites for Django REST backend (/django-api/)
│   ├── tsconfig.json       # Path aliases (@/* -> src/*)
│   ├── package.json        # Frontend scripts & dependencies
│   └── README.md           # Frontend guide & instructions
│
├── backend/                # Python 3 & Django 6.1 REST Framework Backend
│   ├── manage.py           # Django command-line executable
│   ├── requirements.txt    # Django, DRF, and CORS headers dependencies
│   ├── seed_data.py        # Seed script for roles, drives, colleges & questions
│   ├── gqt_backend/        # Global Django configuration (settings, urls, wsgi, asgi)
│   ├── apps/               # Modular domain applications
│   │   ├── authentication/ # Users, profiles & multi-persona auth views
│   │   ├── drives/         # CSR drive lifecycle, phases & targets
│   │   ├── students/       # College rosters & student records
│   │   ├── assessments/    # MCQ question bank, online exam sessions & cutoffs
│   │   ├── interviews/     # Interview scheduling, panels & rubrics
│   │   ├── offers/         # Offer letter issuance & acceptance tracking
│   │   ├── notifications/  # Multi-channel alerts (In-App, Email, WhatsApp)
│   │   └── audit/          # Compliance audit trail & real-time health checks
│   └── README.md           # Django setup & endpoint documentation
│
├── database/               # Relational Database Engine, Schemas & Migrations
│   ├── schema/             # Core table definitions & TypeScript schemas
│   ├── migrations/         # Version-controlled SQL migration scripts
│   ├── seeds/              # Initial demographic & question bank seed files
│   ├── policies/           # Row Level Security (RLS) rules
│   ├── functions/          # Stored procedures & triggers
│   ├── views/              # Reporting & analytical aggregate views
│   ├── storage/            # File storage buckets & policies
│   ├── scripts/            # Database inspection & synchronization scripts
│   ├── docs/               # Schema documentation & entity relationship diagrams
│   └── README.md           # Database execution & maintenance guide
│
├── docs/                   # Platform Architecture & Deployment Specifications
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── DISASTER_RECOVERY.md
│
├── docker-compose.yml      # Multi-container orchestration (Frontend + Backend + DB)
├── package.json            # Monorepo root orchestration scripts
└── README.md               # Master platform documentation (this file)
```

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ (tested on Node v24)
- **Python**: 3.10+ (tested on Python 3.14)
- **npm** or **pnpm**

---

### 2. Running Frontend (React / Next.js)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Start frontend dev server
npm run dev
```

Frontend will be available at: **[http://localhost:3000](http://localhost:3000)**

---

### 3. Running Backend (Django REST Framework)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed baseline authority users & sample data
python seed_data.py

# Start Django development server
python manage.py runserver 8000
```

Django REST API will be available at: **[http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)**  
Health Check: **[http://localhost:8000/api/v1/audit/health/](http://localhost:8000/api/v1/audit/health/)**  
Admin Panel: **[http://localhost:8000/admin/](http://localhost:8000/admin/)**

---

### 4. Running via Docker Compose

To launch all services (Database, Django Backend, React Frontend) in isolated containers:

```bash
docker-compose up --build
```

---

## Monorepo Root Helper Commands

From the root directory:

| Command | Action |
| :--- | :--- |
| `npm run dev:frontend` | Starts React / Next.js development server on `:3000` |
| `npm run dev:backend` | Starts Django REST Framework development server on `:8000` |
| `npm run build:frontend` | Compiles production Next.js frontend bundle |
| `npm run typecheck` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run migrate:backend` | Applies latest Django database migrations |
| `npm run seed:backend` | Seeds authority accounts, colleges, drives & questions |
| `npm run check:backend` | Performs Django system checks |

---

## Default Authority Credentials

All roles use default password: `GqtCsr@2026`

| Authority / Role | Login Portal | Email |
| :--- | :--- | :--- |
| **System Super Admin** | `/admin/login` | `admin@globalquesttechnologies.com` |
| **CSR Operations Manager** | `/csr-manager/login` | `csrmanager@globalquesttechnologies.com` |
| **Placement Officer (PTO)** | `/pto/login` | `pto@rvce.edu.in` |
| **Principal / Dean** | `/principal/login` | `principal@bmsce.ac.in` |
| **HR Recruiter** | `/hr/login` | `hr@globalquesttechnologies.com` |
| **Faculty Coordinator** | `/faculty/login` | `faculty@msrit.edu` |
| **Executive Management** | `/management/login` | `management@globalquesttechnologies.com` |
| **Student Candidate** | `/student/login` | `student@rvce.edu.in` |

---

## Key Benefits of New Architecture

1. **Strict Separation of Concerns**: Frontend UI logic (`frontend/`), business API logic (`backend/`), and data storage/migrations (`database/`) are cleanly isolated.
2. **Zero Path Breakages**: All TypeScript aliases (`@/*`) resolve properly within `frontend/` without relative cross-root hacks.
3. **Dual API Capability**: The React frontend can seamlessly talk to both the Django REST API (`http://localhost:8000/api/v1/`) and Supabase/Next.js edge endpoints.
4. **Single Command Testing**: Typechecks, migrations, and seed scripts run predictably from root or respective subfolders.
