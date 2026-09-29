# Global Quest Technologies (GQT) CSR Platform — Django Backend API

Enterprise REST API backend for the GQT CSR Drive Platform built with **Python 3**, **Django 6.1**, and **Django REST Framework**.

---

## Architecture & Modular Apps

```plaintext
backend/
├── manage.py                  # Django CLI management executable
├── requirements.txt           # Python dependencies
├── seed_data.py               # Pre-configured dataset seeder
├── gqt_backend/               # Project root configuration
│   ├── settings.py            # Global settings, CORS & DB configuration
│   ├── urls.py                # Top-level API routing
│   ├── wsgi.py                # WSGI deployment entrypoint
│   └── asgi.py                # ASGI deployment entrypoint
└── apps/                      # Modular domain applications
    ├── authentication/        # Multi-role auth & profile management
    ├── drives/                # CSR drive lifecycle, phases & targets
    ├── students/              # College & student candidate rosters
    ├── assessments/           # MCQ question bank, test sessions & evaluation
    ├── interviews/            # Scheduling, panel management & rubrics
    ├── offers/                # Offer letter issuance & candidate tracking
    ├── notifications/         # Multi-channel alerts (In-App, Email, WhatsApp)
    └── audit/                 # Immutable compliance logging & system health
```

---

## Quick Start & Local Execution

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Apply Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Seed Initial Platform Data
```bash
python seed_data.py
```

### 4. Start Development Server
```bash
python manage.py runserver 8000
```

The Django REST API will be accessible at:
- **API Root**: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)
- **Health Check**: [http://localhost:8000/api/v1/audit/health/](http://localhost:8000/api/v1/audit/health/)
- **Admin Panel**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## Default Authority Credentials

All roles use default password: `GqtCsr@2026`

| Persona | Role Key | Email |
| :--- | :--- | :--- |
| **Super Admin** | `super_admin` | `admin@globalquesttechnologies.com` |
| **CSR Director** | `csr_manager` | `csrmanager@globalquesttechnologies.com` |
| **Placement Officer (PTO)** | `pto` | `pto@rvce.edu.in` |
| **Principal / Dean** | `principal` | `principal@bmsce.ac.in` |
| **Lead HR Recruiter** | `hr_recruiter` | `hr@globalquesttechnologies.com` |
| **Faculty Coordinator** | `faculty_coordinator` | `faculty@msrit.edu` |
| **Executive Management** | `management` | `management@globalquesttechnologies.com` |
| **Student Candidate** | `student` | `student@rvce.edu.in` |

---

## Primary REST API Endpoints

- `POST /api/v1/auth/login/`: User authentication & role dispatch
- `GET /api/v1/auth/me/`: Active session profile
- `GET /api/v1/drives/drives/`: CSR drives directory
- `GET /api/v1/drives/stats/`: Statewide CSR drive progress metrics
- `GET /api/v1/students/students/`: Filterable student candidate rosters
- `GET /api/v1/students/colleges/`: Affiliated colleges list
- `GET /api/v1/assessments/questions/`: Categorized MCQ question bank
- `POST /api/v1/assessments/submit/`: Submit candidate exam & compute cutoff
- `GET /api/v1/interviews/schedules/`: Candidate interview schedule
- `POST /api/v1/interviews/evaluations/`: Submit panelist evaluation rubric
- `GET /api/v1/offers/letters/`: Generated candidate offer letters
- `POST /api/v1/offers/letters/<id>/respond/`: Accept or decline offer
- `POST /api/v1/notifications/dispatch/`: Multi-channel notification dispatch
- `GET /api/v1/audit/health/`: Real-time backend system health
