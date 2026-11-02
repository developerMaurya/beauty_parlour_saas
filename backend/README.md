# Beauty SaaS — Backend Service

Modular, multi-tenant Express.js backend using ECMAScript Modules (ESM) and MongoDB.

## Architecture
- `src/config/`: Runtime environment and service configurations.
- `src/database/`: Dual-tier database layer (Central DB + dynamic Tenant Connection Manager).
- `src/middleware/`: Global Express middleware pipeline.
- `src/modules/`: Domain-driven business modules across Superadmin, Admin, Staff, Student, Customer, Guest, Public, and Webhooks.
- `src/routes/`: Route aggregation and mounting.
