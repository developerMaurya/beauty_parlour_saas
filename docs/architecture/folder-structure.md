# Folder Structure Guidelines

This document details the standardized folder hierarchy and module design patterns used across the repository.

## Backend Principles
- **Config**: Pure environment and configuration wrappers.
- **Database**: Separation between Central DB and dynamic Tenant Connection Pool.
- **Modules**: Domain-driven vertical slices. Each module maintains its own controllers, services, models, routes, validators, middleware, and tests.
- **Middleware**: Global express pipeline handlers (authentication, authorization, tenant resolution, request tracing, rate limiting).

## Frontend Principles
- **App**: Root router and context provider wrappers.
- **Components**: Reusable atomic UI elements (buttons, tables, inputs, modals, charts).
- **Layouts**: Role-specific layout shells (SuperAdmin, Admin, Staff, Student, Customer, Guest, Public).
- **Modules**: Domain-driven feature screens matching backend capabilities.
- **Services**: API clients with tenant-aware header injection.
