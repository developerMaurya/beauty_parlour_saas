# System Architecture

## Overview
The platform employs a hybrid multi-tenant architecture designed to scale seamlessly across thousands of independent salon, spa, and beauty academy businesses.

```
                  [ Custom Domain / Subdomain Ingress ]
                                   │
                           [ Nginx Reverse Proxy ]
                                   │
                       [ Express Backend Service ]
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
    [ Central MongoDB DB ]                  [ Tenant MongoDB Connection Pool ]
    - Tenants Registry                      - Tenant DB 001 (Salon A)
    - Domains & SSL                         - Tenant DB 002 (Spa B)
    - Subscriptions & Plans                 - Tenant DB 003 (Academy C)
    - Global Superadmins                    - ...
```

## Multitenancy Model
- **Central DB**: Houses global platform configuration, tenant registration, domain mappings, subscription tiers, payment gateway credentials, and superadmin audits.
- **Tenant DB**: Complete physical data separation per salon/institute tenant. Each tenant possesses an isolated database containing their branches, appointments, services, staff, billing, inventory, and student records.
