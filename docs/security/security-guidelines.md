# Security Guidelines

## Multi-Tenant Isolation
- Strict verification in `tenant-resolver` middleware.
- Database connection instances must never bleed across requests.
- All database queries must run on the dedicated tenant connection instance attached to `req.tenantDb`.

## Authentication & Authorization
- Stateless JWT access tokens with short TTL (e.g. 15 minutes).
- Secure HTTP-only refresh tokens with rotation.
- Granular Role-Based Access Control (RBAC) enforced per route.

## General Security
- Helmet.js for secure HTTP headers.
- Rate limiting per IP and per tenant to protect against brute-force and DDoS.
- Input validation & schema sanitization on all endpoints.
- Secure upload handling with file type verification and size limits.
