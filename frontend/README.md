# Global Quest Technologies (GQT) CSR Platform — Frontend Application

Modern React 19 & Next.js 16 Client & Authority Portal Application for the **GQT CSR Drive Platform**.

---

## Directory Architecture

```plaintext
frontend/
├── src/
│   ├── app/                   # Next.js App Router (Portals, Authority views & API routes)
│   │   ├── admin/             # System Super Admin management views
│   │   ├── csr-manager/       # CSR Operations command center
│   │   ├── pto/               # Placement Officer portal
│   │   ├── principal/         # College Principal / Dean portal
│   │   ├── hr/                # HR Recruiter evaluation pipeline
│   │   ├── faculty/           # Faculty Coordinator portal
│   │   ├── management/        # Executive Management analytics portal
│   │   ├── student/           # Student candidate test & dashboard views
│   │   ├── portal/            # Dynamic unified portal router
│   │   └── api/               # Next.js local edge/REST handlers
│   ├── components/            # UI components (auth, layout, widgets, charts)
│   ├── context/               # Global state contexts
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions & RBAC permissions engine
│   ├── services/              # API clients (djangoApi.service.ts, auth, etc.)
│   └── types/                 # TypeScript interfaces and DB models
├── public/                    # Static brand assets, icons, logos
├── next.config.ts             # Next.js configuration & Django proxy rewrites
├── tsconfig.json              # TypeScript path mappings (@/* -> src/*)
└── package.json               # NPM scripts and dependencies
```

---

## Development & Execution

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript typecheck
npx tsc --noEmit

# Build production bundle
npm run build
```

The frontend will run at [http://localhost:3000](http://localhost:3000).

---

## Django Backend Integration

Calls to `/django-api/*` from the browser are automatically proxied by Next.js to the Django REST backend at `http://127.0.0.1:8000/api/v1/*`.

To call the backend directly from any React component:
```typescript
import { djangoApi } from "@/services/djangoApi.service";

// Example: Fetch statewide drive metrics
const stats = await djangoApi.getDriveStats();

// Example: Fetch student candidates
const students = await djangoApi.getStudents({ department: 'Computer Science' });
```
