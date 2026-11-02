# Multi-Tenant White-Label Beauty Parlour, Salon, Spa & Beauty Training Institute SaaS

## Architecture Overview

An enterprise-grade, multi-tenant, white-label SaaS platform engineered for salons, spas, beauty parlours, aesthetic clinics, and professional beauty training academies.

### Key Architectural Pillars
- **Database Multitenancy**: Central MongoDB cluster for tenant routing, catalog, licensing, and superadmin operations, paired with isolated per-tenant MongoDB databases for total operational and data privacy.
- **White-Labeling**: Tenant resolution via custom domains, tenant subdomains, and HTTP headers with fully brandable themes, logos, invoice templates, and transactional notifications.
- **Role-Based Workspaces**: Independent modules and interfaces for Superadmin, Tenant Admin, Staff, Student, Customer, Guest, and Webhooks.
- **Technology Stack**:
  - **Backend**: Node.js, Express.js (ES Modules), MongoDB, Mongoose.
  - **Frontend**: React.js, Vite, React Router, Axios.
  - **Documentation & Infrastructure**: Standardized architecture blueprints, Docker, Nginx reverse proxy configs, automated backups, and system monitoring.

---

## Directory Organization

```
beauty-saas/
├── backend/          # Node.js + Express multi-tenant backend service
├── frontend/         # React.js + Vite white-label SPA frontend
├── docs/             # Technical architecture, database, API, and security documentation
├── scripts/          # Automation, provisioning, migration, and maintenance scripts
├── infrastructure/   # Docker, Nginx, deployment, and monitoring configurations
├── .editorconfig     # Standardized code formatting settings across IDEs
├── .gitignore        # Root git ignore specification
├── package.json      # Workspace orchestration configuration
└── README.md         # Repository documentation
```

---

## Development Phase Status

- **Phase 01 — Complete Project Folder and File Structure**: **COMPLETED**
  - Structural blueprints, module boundaries, routing layouts, and architectural placeholders established.
  - No business logic, mock data, or database connections active.
- **Phase 02 — Central Database & Core Architecture**: Awaiting initialization.
