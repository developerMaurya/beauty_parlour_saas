# Domain Resolution & White-Label Architecture

## 1. Domain Types Supported

The Beauty SaaS platform supports three levels of white-label domain routing:

1. **Default Platform Subdomain**:
   - Format: `<tenant-slug>.beautysaas.local` (or `<tenant-slug>.yourdomain.com` in production).
   - Automatically generated upon tenant creation.
   - Immediately active upon provisioning.

2. **Custom White-Label Domain**:
   - Format: `www.salonluxury.com` or `booking.salongroup.in`.
   - Requires DNS configuration and ownership verification before activation.

3. **Primary Domain Flag**:
   - Each tenant can designate one domain as its primary entry point.
   - Secondary domains automatically redirect to the primary domain (301 Permanent Redirect) or resolve transparently.

---

## 2. Inbound Hostname Resolution Pipeline

```
[Inbound HTTP Request]
       │
       ▼
[Express Host Header Normalization]
  • Lowercase hostname, strip port (:3000 / :5000)
  • Validate against Host header injection attacks
       │
       ▼
[Domain Lookup in Central Control Plane]
  • Query Domain model for exact `domain: hostname`
  • Verify `status === 'ACTIVE'`
  • If NOT FOUND:
      - Check if matches `<slug>.beautysaas.local` subdomain pattern
      - If unknown: Return 404 Domain Not Found (Zero-trust response)
       │
       ▼
[Attach Tenant Context to Request]
  • req.tenant = resolvedTenant
  • req.tenantId = resolvedTenant._id
       │
       ▼
[Database Strategy Resolution]
  • Mode A: Shared database with enforced `tenantId`
  • Mode B: Tenant connection pool to `beauty_tenant_<slug>`
```

---

## 3. DNS Verification Protocol

To verify ownership of custom domains:

| Record Type | Host | Target / Value | Purpose |
|---|---|---|---|
| **CNAME** | `@` or `www` or subdomain | `cname.beautysaas.com` | Traffic routing to edge proxy |
| **TXT** | `_beauty-verification` | `verify-tenant-<slug>` | Cryptographic ownership validation |

### Verification Flow:
1. Super Admin or Tenant Admin registers the custom domain.
2. Domain is saved with status `PENDING_VERIFICATION`.
3. Admin clicks **Verify Domain** (`POST /api/v1/superadmin/domains/:domainId/verify`).
4. The backend performs a DNS lookup via Node.js `dns.promises.resolveTxt()`.
5. Upon confirmation, domain status transitions to `ACTIVE`, and automated SSL provisioning is scheduled.
