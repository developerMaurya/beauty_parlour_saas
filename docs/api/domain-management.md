# Domain Management API Reference

## Endpoints

### `GET /api/v1/superadmin/domains`
Lists all registered tenant hostnames, subdomains, and custom domains.
- **Query Params**: `page`, `limit`, `search`, `status=active|pending_verification|suspended`

### `POST /api/v1/superadmin/tenants/:tenantId/domains`
Assigns a new subdomain or custom domain to a tenant.
- **Request Body**:
```json
{
  "domain": "www.glamoursalon.com",
  "isPrimary": false
}
```

### `GET /api/v1/superadmin/tenants/:tenantId/domains`
Returns all domains configured for a specific tenant.

### `POST /api/v1/superadmin/domains/:domainId/verify`
Performs DNS TXT / CNAME resolution checks to confirm domain ownership.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "verified": true,
    "status": "ACTIVE",
    "sslStatus": "ACTIVE"
  }
}
```

### `POST /api/v1/superadmin/domains/:domainId/set-primary`
Designates this domain as the primary canonical domain for the tenant.

### `POST /api/v1/superadmin/domains/:domainId/refresh-ssl`
Triggers an automated Let's Encrypt / Cloudflare SSL certificate verification.

### `DELETE /api/v1/superadmin/domains/:domainId`
Removes domain mapping. The domain will immediately cease resolving to the tenant.
