# Beauty SaaS — Frontend Application

White-label React Single Page Application (SPA) powered by Vite.

## Architecture
- `src/app/`: Core application providers, routing configuration, and app initialization.
- `src/components/`: Modular component library (UI, forms, tables, modals, charts, navigation).
- `src/layouts/`: Distinct layout shells for each role (SuperAdmin, Admin, Staff, Student, Customer, Guest, Public).
- `src/modules/`: Feature-driven screens and state.
- `src/services/`: HTTP API client layer with tenant header resolution.
