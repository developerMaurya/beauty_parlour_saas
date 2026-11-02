# Super Admin Control Plane API Reference

## Authentication & Authorization
All endpoints below require a valid Super Admin JSON Web Token (JWT) passed in the `Authorization` header:
```http
Authorization: Bearer <accessToken>
```

---

## 1. Dashboard Overview APIs

### `GET /api/v1/superadmin/dashboard/overview`
Retrieves live platform metrics from MongoDB Atlas.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "tenants": { "total": 12, "active": 10, "trial": 2, "suspended": 0, "shared": 9, "separate": 3 },
    "subscriptions": { "total": 12, "active": 10 },
    "databases": { "total": 4, "activeConnections": 3 }
  }
}
```

### `GET /api/v1/superadmin/dashboard/revenue`
Returns Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR).

### `GET /api/v1/superadmin/dashboard/recent-activities`
Returns the 10 most recent administrative actions from `AuditLogs`.

### `GET /api/v1/superadmin/dashboard/expiring-subscriptions`
Returns subscriptions expiring within the next 14 days.

---

## 2. Tenant Management APIs

### `POST /api/v1/superadmin/tenants`
Creates and provisions a new tenant.
- **Request Body**:
```json
{
  "name": "Blossom Luxury Spa",
  "slug": "blossom-luxury-spa",
  "businessType": "SPA",
  "ownerName": "Priya Sharma",
  "email": "priya@blossomspa.com",
  "phone": "+91 9876543210",
  "databaseMode": "SEPARATE",
  "subdomain": "blossom-luxury-spa",
  "customDomain": "www.blossomspa.com",
  "planId": "65f0a1b2c3d4e5f6a7b8c9d0",
  "billingCycle": "MONTHLY"
}
```

### `GET /api/v1/superadmin/tenants`
Lists tenants with search, status filtering, and pagination.
- **Query Params**: `page`, `limit`, `search`, `status`, `databaseMode`

### `GET /api/v1/superadmin/tenants/:tenantId`
Fetches complete tenant details.

### `PATCH /api/v1/superadmin/tenants/:tenantId`
Updates tenant profile fields.

### `DELETE /api/v1/superadmin/tenants/:tenantId`
Safely archives tenant and terminates active subscription.

### `POST /api/v1/superadmin/tenants/:tenantId/activate`
Activates a suspended or pending tenant.

### `POST /api/v1/superadmin/tenants/:tenantId/suspend`
Suspends a tenant with an audit reason.
- **Request Body**: `{ "reason": "Overdue payment" }`

---

## 3. Plan Management APIs

### `POST /api/v1/superadmin/plans`
Creates a new subscription plan with limits.
- **Request Body**:
```json
{
  "name": "Growth Tier",
  "code": "growth-tier",
  "price": 49,
  "billingCycle": "MONTHLY",
  "limits": {
    "maxBranches": 2,
    "maxStaff": 10,
    "maxClients": 1500,
    "maxStorageMb": 5120
  }
}
```

### `GET /api/v1/superadmin/plans`
Lists all subscription tiers.

### `PATCH /api/v1/superadmin/plans/:planId`
Updates plan pricing or configuration.

### `DELETE /api/v1/superadmin/plans/:planId`
Deactivates and archives plan.

---

## 4. Subscription Management APIs

### `GET /api/v1/superadmin/subscriptions`
Lists subscriptions with filters (`status=active|trialing|past_due|canceled`).

### `POST /api/v1/superadmin/subscriptions/:subscriptionId/renew`
Renews subscription for another term.

### `POST /api/v1/superadmin/subscriptions/:subscriptionId/extend`
Extends trial or subscription end date by specified number of days.
- **Request Body**: `{ "days": 14 }`

### `POST /api/v1/superadmin/subscriptions/:subscriptionId/cancel`
Cancels subscription immediately or at period end.

---

## 5. Beauty Industry Verticals APIs (Salon, Spa, Parlour, Makeup, Academy)

### `GET /api/v1/superadmin/verticals`
Returns all supported beauty business types with active tenant counts:
- `SALON` (Chair-based, stylists, cuts, styling)
- `SPA_MASSAGE` (Room-based, therapists, Swedish/Ayurvedic massages, medical waivers)
- `BEAUTY_PARLOUR` (Appointment slots, facials, waxing, threading)
- `MAKEUP_STUDIO` (Bridal contracts, advance milestone deposits, HD/airbrush artistry)
- `TRAINING_ACADEMY` (Student batches, course installments, certifications)
- `CHAINS_FRANCHISE` (Multi-branch corporate headquarters)

### `POST /api/v1/superadmin/verticals`
Registers a new industry vertical or business category.

### `GET /api/v1/superadmin/verticals-analytics`
Returns tenant growth and active ratios grouped by business vertical.

---

## 6. Pre-Seeded Service Catalogues APIs

### `GET /api/v1/superadmin/templates/services`
Lists pre-configured services and course templates.
- **Query Params**: `verticalCode=SPA_MASSAGE|SALON|BEAUTY_PARLOUR|MAKEUP_STUDIO|TRAINING_ACADEMY`, `category`, `search`

### `POST /api/v1/superadmin/templates/services`
Adds a standard service template to the platform catalog.

### `POST /api/v1/superadmin/tenants/:tenantId/seed-catalog`
Injects the standard pre-configured services for that vertical directly into the tenant's live database.

---

## 7. White-Label Theme Presets APIs

### `GET /api/v1/superadmin/themes`
Lists white-label styling presets:
- `Rose Gold Glamour` (Parlour & Makeup)
- `Zen Emerald Spa` (Spa & Massage)
- `Midnight Noir Salon` (Hair Salon & Barbershop)
- `Royal Academy Blue` (Cosmetology Academy)

### `POST /api/v1/superadmin/themes`
Creates a custom white-label branding kit.

### `POST /api/v1/superadmin/tenants/:tenantId/theme`
Applies a theme preset to a tenant's customer portal, booking widget, and dashboard.

