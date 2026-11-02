# Database Management API Reference

## 1. Central Database Node Registries

### `GET /api/v1/superadmin/databases`
Lists registered MongoDB database clusters and shared database pools.
- **Query Params**: `page`, `limit`, `search`, `type=SHARED|SEPARATE`

### `POST /api/v1/superadmin/databases`
Registers a new database pool or cluster target.
- **Request Body**:
```json
{
  "name": "Primary Dedicated Tenant Pool",
  "dbName": "beauty_tenant_cluster_01",
  "type": "SEPARATE",
  "host": "cluster0.c4qroz0.mongodb.net",
  "port": 27017
}
```

### `POST /api/v1/superadmin/databases/:databaseId/test-connection`
Executes an active ping test against the cluster and measures latency.

### `GET /api/v1/superadmin/databases/:databaseId/health`
Retrieves live database telemetry, connection pool status, and collection statistics.

---

## 2. Tenant Database Operations

### `GET /api/v1/superadmin/tenants/:tenantId/database`
Returns the assigned database strategy, target database name, and active mapping for a tenant.

### `GET /api/v1/superadmin/tenants/:tenantId/database/health`
Executes a live health check on the specific tenant's database connection.

### `POST /api/v1/superadmin/tenants/:tenantId/database/backup`
Creates a snapshot backup of the tenant's collections and records.

### `POST /api/v1/superadmin/tenants/:tenantId/database/restore`
Restores a tenant database from a previous snapshot.
- **Request Body**: `{ "backupId": "bck_65f0a1b2..." }`

### `POST /api/v1/superadmin/tenants/:tenantId/database/migrate`
Performs a zero-data-loss migration between Shared (Mode A) and Separate (Mode B) architectures.
- **Request Body**:
```json
{
  "targetMode": "SEPARATE",
  "targetDatabaseName": "beauty_tenant_blossom_spa"
}
```
- **Validation**:
  1. Validates target database availability.
  2. Creates a pre-migration snapshot backup.
  3. Copies documents collection by collection.
  4. Verifies matching document counts.
  5. Updates central tenant database mapping.
  6. Logs action to immutable audit trail.
