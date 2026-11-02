# Multi-Tenant Multi-Database Architecture

## 1. Architectural Overview

The Beauty SaaS platform implements a high-scale, configurable multi-tenant database architecture supporting three distinct operational strategies:

```
                                  ┌──────────────────────────────────────────────┐
                                  │      Client Request (Hostname / JWT)         │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │       tenantDatabaseResolver Middleware      │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                         ┌───────────────────────────────┴───────────────────────────────┐
                         ▼                                                               ▼
        ┌───────────────────────────────────┐                         ┌───────────────────────────────────┐
        │       SharedDatabaseStrategy      │                         │     SeparateDatabaseStrategy      │
        │   (Mode A: Single Shared DB)      │                         │   (Mode B: Isolated Tenant DB)    │
        └─────────────────┬─────────────────┘                         └─────────────────┬─────────────────┘
                          │                                                             │
                          ▼                                                             ▼
        ┌───────────────────────────────────┐                         ┌───────────────────────────────────┐
        │ Mongoose Model with tenantId      │                         │     tenantConnectionManager       │
        │ forced into query & write filter  │                         │ Dynamic connection pool & caching │
        └─────────────────┬─────────────────┘                         └─────────────────┬─────────────────┘
                          │                                                             │
                          ▼                                                             ▼
        ┌───────────────────────────────────┐                         ┌───────────────────────────────────┐
        │ beauty_saas_shared (Atlas Clust0) │                         │ beauty_tenant_1001 (Atlas Clust0) │
        └───────────────────────────────────┘                         └───────────────────────────────────┘
```

---

## 2. Central Control Plane vs. Tenant Operational Data

- **Central Control Plane Database (`beauty_parlour_saas`)**:
  - Contains platform-wide control plane collections: `Tenants`, `DatabaseRegistries`, `Plans`, `Subscriptions`, `Features`, `Addons`, `Domains`, `Transactions`, `Invoices`, `Refunds`, `Coupons`, `UsageLimits`, `PlatformSettings`, `NotificationTemplates`, `SupportTickets`, `AuditLogs`, `Users` (Super Admins), `Sessions`.
  - Super Admin credentials and platform records are strictly kept in the central database and never mixed with tenant operational data.

- **Tenant Operational Data**:
  - Contains appointments, salon services, clients, staff rosters, inventories, and POS billing.

---

## 3. Database Strategies

### Strategy A: Shared Database Mode
- All tenants assigned to Mode A share the central MongoDB database (or a dedicated shared cluster `beauty_saas_shared`).
- Every document in tenant collections strictly enforces `tenantId: req.tenant._id`.
- The `SharedDatabaseStrategy` class wraps queries and mutations to prevent cross-tenant data leakage.

### Strategy B: Separate Database Per Tenant
- Each tenant receives their own dedicated MongoDB database (e.g. `beauty_tenant_blossom_spa`).
- Managed by `TenantConnectionManager`:
  - Dynamically builds connection strings using `TENANT_MONGODB_URI_TEMPLATE`.
  - Caches connections by database name.
  - Monitors connection health and reconnects automatically.
  - Automatically evicts idle tenant connections after 30 minutes.

### Strategy C: Configurable Hybrid Architecture
- The platform default strategy can be set in `PlatformSettings`.
- When provisioning each individual tenant, the Super Admin can choose whether the tenant is assigned to the Shared Database pool (cost-effective) or a Separate Dedicated Database (high security, compliance, dedicated backups).

---

## 4. Tenant Database Provisioning Lifecycle

```
[Tenant Create Request]
       │
       ├─► 1. Central Registration: Insert Tenant in central control plane (status: PENDING)
       │
       ├─► 2. Provisioning Job Created: Recorded in `ProvisioningJobs` table
       │
       ├─► 3. Database Resolution:
       │      • If Mode A: Assign to shared cluster, verify central mapping
       │      • If Mode B: Compute unique DB name `beauty_tenant_<slug>`, connect via connection pool
       │
       ├─► 4. Collection & Index Initialization:
       │      • Create core operational collections: `users`, `services`, `appointments`, `clients`, `inventory`
       │      • Create compound unique indexes
       │
       ├─► 5. Seed Initial Administrator:
       │      • Create Tenant Administrator user in tenant database
       │
       ├─► 6. Finalize Status:
       │      • Update Tenant status to `ACTIVE`
       │      • Mark Provisioning Job as `COMPLETED`
```

---

## 5. Controlled Data Migration Protocol

To move a tenant between Shared Mode and Separate Mode without data loss:

1. **Verify Target Database**: Test ping, connection credentials, and available storage.
2. **Snapshot Source Backup**: Capture a point-in-time snapshot of the tenant's data.
3. **Copy Tenant Data**: Read documents from source and insert into target collections.
4. **Integrity & Count Verification**: Validate that document counts match exactly for each collection.
5. **Switch Mapping**: Atomically update `tenant.databaseMode` and `tenant.databaseName` in the central database.
6. **Retain Compensation Data**: Source data is retained for a configurable grace period (e.g., 14 days) before permanent decommissioning.
7. **Audit Record**: Log migration timestamps, record counts, and executing Super Admin in `AuditLogs`.
