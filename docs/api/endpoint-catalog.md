# API Endpoint Catalog

Detailed endpoint inventory grouped by portal and business domain.
Full schema definitions, parameters, and payloads will be populated during the respective module development phases.

## Implemented Endpoints (Phase 02)
- **Superadmin Authentication**: `/api/v1/superadmin/auth/*`
  - See full specification: [authentication.md](./authentication.md)
  - `POST /login`: Authenticate Super Admin & issue access token + HttpOnly cookie
  - `POST /refresh`: Rotate refresh token & issue new access token
  - `POST /logout`: Invalidate current session
  - `POST /logout-all`: Invalidate all active sessions for Super Admin
  - `GET  /me`: Get authenticated Super Admin safe profile
  - `POST /change-password`: Change password & revoke all sessions
  - `POST /forgot-password`: Single-use cryptographic reset token request
  - `POST /reset-password`: Complete password reset
- **Common Utility**: `/api/v1/common/*`
  - `GET  /health`: System & database health status

