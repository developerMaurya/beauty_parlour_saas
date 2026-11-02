# Tenant Provisioning API Reference

## 1. Automated Provisioning Pipeline

Tenant provisioning handles automated multi-tenant database creation, collection schema initialization, standard indexing, subdomain routing, and administrator seed creation.

---

## 2. Endpoints

### `POST /api/v1/superadmin/provisioning/:tenantId/start`
Starts or triggers asynchronous provisioning workflow for a tenant.
- **Request Body**:
```json
{
  "databaseMode": "SEPARATE",
  "seedDemoData": false
}
```

### `GET /api/v1/superadmin/provisioning`
Lists all background provisioning jobs.
- **Query Params**: `page`, `limit`, `status=PENDING|PROCESSING|COMPLETED|FAILED`

### `GET /api/v1/superadmin/provisioning/:jobId`
Fetches real-time status and logs of a provisioning job.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "jobId": "job_1730538920192",
    "status": "COMPLETED",
    "progress": 100,
    "currentStep": "SEED_ADMIN",
    "steps": [
      { "name": "CENTRAL_REGISTRATION", "status": "COMPLETED" },
      { "name": "DATABASE_PROVISIONING", "status": "COMPLETED" },
      { "name": "INDEX_INITIALIZATION", "status": "COMPLETED" },
      { "name": "DOMAIN_SETUP", "status": "COMPLETED" },
      { "name": "SEED_ADMIN", "status": "COMPLETED" }
    ]
  }
}
```

### `POST /api/v1/superadmin/provisioning/:jobId/retry`
Retries a failed provisioning job from the point of failure.

### `POST /api/v1/superadmin/provisioning/:jobId/cancel`
Cancels a pending or stuck provisioning job.

### `GET /api/v1/superadmin/tenants/:tenantId/provisioning-history`
Returns historical provisioning attempts, errors, and retry logs for a tenant.
