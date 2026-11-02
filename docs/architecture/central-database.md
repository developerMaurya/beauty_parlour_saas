# Central Database Architecture

## Purpose
The Central Database is the single source of truth for platform management, cross-tenant licensing, and domain routing.

## Central Collections
- `tenants`: Master records of registered salons, spas, and training institutes.
- `domains`: Mappings between primary domains, custom domains, and tenant IDs.
- `plans`: SaaS subscription tiers, pricing intervals, and feature quotas.
- `subscriptions`: Active billing status, renewal cycles, and payment histories.
- `superadmin_users`: Platform administrators with root control permissions.
- `platform_settings`: Global feature flags, maintenance mode settings, and system defaults.
- `audit_logs`: Immutable logs of platform-wide administrative actions.
