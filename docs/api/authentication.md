# Authentication API System Specification

**Scope:** Super Administrator JWT-based Authentication  
**Base URL:** `/api/v1/superadmin/auth`  
**Authorization Header Format:** `Authorization: Bearer <ACCESS_TOKEN>`  
**Cookie Policy:** HttpOnly, Secure (in production), SameSite (`Lax`), Path (`/api/v1/superadmin/auth`)

---

## 1. Overview & Architecture

The Authentication System implements an enterprise-grade, dual-token (Access + Refresh) authentication architecture designed for the multi-tenant SaaS platform. 

### Key Architectural Tenets
1. **Separation of Secrets**: Dedicated, independent cryptographic keys for access token signing (`JWT_ACCESS_SECRET`) and refresh token signing (`JWT_REFRESH_SECRET`).
2. **Minimalist JWT Payloads**: Tokens contain only essential routing and security claims (`sub`, `role`, `sessionId`, `tokenType`, `jti`, `iss`, `aud`). No passwords, database URIs, or PII are embedded.
3. **Multi-Device Session Storage**: Refresh tokens are tracked in an indexed, dedicated `Session` model. Only cryptographically secure SHA-256 hashes of refresh tokens are stored.
4. **Token Rotation & Automatic Reuse Detection**:
   - Refresh tokens are single-use. Upon calling `/refresh`, the token is invalidated and replaced with a fresh token.
   - If an old refresh token is re-submitted (e.g. replay attack or compromised credentials), the system flags **TOKEN REUSE**, revokes the entire session immediately, and prevents further access.
5. **Brute Force & Credential Stuffing Defenses**:
   - IP-level rate limiting on `/login` and `/forgot-password`.
   - Account lockout: 5 consecutive failed login attempts lock the account for 15 minutes.
   - Generic, timing-constant error messages ("Invalid credentials") to prevent user enumeration.
6. **Extensible Role-Based Design**:
   - The core token service, session manager, crypto utils, and cookie helpers are completely decoupled from role logic, ready to support Tenant Admin, Staff, Student, Customer, and Guest in subsequent phases without modification.

---

## 2. Initial Super Admin Account Creation (Bootstrap CLI)

There is **NO public Super Admin registration endpoint**. To create the initial Super Admin account, use the secure bootstrap CLI script.

### Configuration
Set the following variables in `backend/.env`:
```env
SUPERADMIN_BOOTSTRAP_NAME="Master Super Admin"
SUPERADMIN_BOOTSTRAP_EMAIL="superadmin@beautysaas.local"
SUPERADMIN_BOOTSTRAP_USERNAME="superadmin"
SUPERADMIN_BOOTSTRAP_PASSWORD="SuperAdmin@Secure2026!"
```

### Execution
From the `backend/` directory, run:
```bash
npm run bootstrap:superadmin
```

### Behavior & Idempotency
- Validates email format and password strength (min 8 chars, uppercase, lowercase, number, symbol).
- Checks if a Super Admin with the specified email or username already exists.
- If an account exists, it skips creation safely without altering existing credentials.
- Passwords and raw hashes are never printed in terminal logs.

---

## 3. Endpoints Catalog

### 1. Login
Authenticate Super Admin and issue Access Token & HttpOnly Refresh Cookie.

- **Method:** `POST`
- **Path:** `/api/v1/superadmin/auth/login`
- **Rate Limit:** 10 failed requests per 15-minute window per IP.
- **Request Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "emailOrUsername": "superadmin@beautysaas.local",
  "password": "SuperAdmin@Secure2026!"
}
```
*(Also accepts `email` or `username` directly)*

#### Success Response (`200 OK`)
Sets `Set-Cookie: refreshToken=<JWT>; HttpOnly; SameSite=Lax; Path=/api/v1/superadmin/auth; Max-Age=604800`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6ae841de1fb2753a644b3eba",
      "name": "Master Super Admin",
      "email": "superadmin@beautysaas.local",
      "username": "superadmin",
      "role": "superadmin",
      "status": "active",
      "lastLoginAt": "2026-11-02T13:10:00.000Z"
    }
  }
}
```

#### Error Responses
- **`400 Bad Request`**: Missing credentials or validation failure.
- **`401 Unauthorized`**: Invalid email/username or incorrect password (`"message": "Invalid credentials"`).
- **`403 Forbidden`**: Account is inactive or suspended.
- **`423 Locked`**: Account temporarily locked due to repeated failed login attempts.
- **`429 Too Many Requests`**: IP-level rate limit exceeded.

---

### 2. Refresh Token
Rotate refresh token and issue a new access token.

- **Method:** `POST`
- **Path:** `/api/v1/superadmin/auth/refresh`
- **Authentication:** `refreshToken` HttpOnly cookie (or `X-Refresh-Token` header fallback).

#### Request Body
None (payload read from cookie).

#### Success Response (`200 OK`)
Rotates the cookie with a new refresh token.

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
- **`401 Unauthorized`**: Refresh token missing, expired, or invalid.
- **`403 Forbidden`**: Token reuse detected! All active tokens from this session are immediately revoked.

---

### 3. Logout Current Session
Revoke current active session and invalidate refresh token cookie.

- **Method:** `POST`
- **Path:** `/api/v1/superadmin/auth/logout`
- **Authentication:** Optional `Bearer <ACCESS_TOKEN>` and/or `refreshToken` cookie.

#### Success Response (`200 OK`)
Clears `refreshToken` cookie.

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Logout All Sessions
Revoke all active sessions across all devices for the authenticated Super Admin.

- **Method:** `POST`
- **Path:** `/api/v1/superadmin/auth/logout-all`
- **Authentication:** `Bearer <ACCESS_TOKEN>`

#### Success Response (`200 OK`)
Clears current `refreshToken` cookie and marks all user sessions as revoked in MongoDB.

```json
{
  "success": true,
  "message": "All sessions revoked successfully"
}
```

---

### 5. Get Current User Profile
Retrieve safe profile details of the currently authenticated Super Admin.

- **Method:** `GET`
- **Path:** `/api/v1/superadmin/auth/me`
- **Authentication:** `Bearer <ACCESS_TOKEN>`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "6ae841de1fb2753a644b3eba",
      "name": "Master Super Admin",
      "email": "superadmin@beautysaas.local",
      "username": "superadmin",
      "role": "superadmin",
      "status": "active",
      "isEmailVerified": true,
      "lastLoginAt": "2026-11-02T13:10:00.000Z",
      "lastLoginIp": "127.0.0.1",
      "createdAt": "2026-11-02T12:00:00.000Z",
      "updatedAt": "2026-11-02T13:10:00.000Z"
    }
  }
}
```

---

### 6. Change Password
Update Super Admin password. Invalidator for all existing sessions.

- **Method:** `POST`
- **Path:** `/api/v1/superadmin/auth/change-password`
- **Authentication:** `Bearer <ACCESS_TOKEN>`

#### Request Body
```json
{
  "currentPassword": "SuperAdmin@Secure2026!",
  "newPassword": "NewSuperAdmin@Secure2026!",
  "confirmPassword": "NewSuperAdmin@Secure2026!"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again with your new password."
}
```

---

### 7. Forgot Password
Initiate password reset workflow.

- **Method:** `POST`
- **Path:** `/api/v1/superadmin/auth/forgot-password`
- **Rate Limit:** 5 requests per 15 minutes per IP.

#### Request Body
```json
{
  "email": "superadmin@beautysaas.local"
}
```

#### Success Response (`200 OK`)
*(Generic response returned regardless of account existence to prevent enumeration)*
```json
{
  "success": true,
  "message": "If an account with that email exists, password reset instructions have been sent."
}
```

---

### 8. Reset Password
Complete password reset using cryptographic token.

- **Method:** `POST`
- **Path:** `/api/v1/superadmin/auth/reset-password`

#### Request Body
```json
{
  "token": "4f5e8d9c1a2b3c4d5e6f7a8b9c0d1e2f...",
  "newPassword": "NewSuperAdmin@Secure2026!",
  "confirmPassword": "NewSuperAdmin@Secure2026!"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Password reset successfully. Please log in with your new password."
}
```

---

## 4. Standard Response Envelope Formats

### Success Format
```json
{
  "success": true,
  "message": "Human readable summary",
  "data": { ... }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

## 5. Security & Deployment Notes

1. **Production Cookies**:
   - In production (`NODE_ENV=production`), `COOKIE_SECURE=true` is automatically enforced, ensuring cookies are transmitted only via TLS/HTTPS.
2. **Reverse Proxy Configuration**:
   - When deploying behind Nginx or Cloudflare, ensure `X-Forwarded-For` and `X-Forwarded-Proto` headers are preserved and Express trust proxy is enabled (`app.set('trust proxy', 1)`).
3. **Session Purging**:
   - The `Session` and `PasswordReset` collections leverage native MongoDB TTL indexes on `expiresAt` with `expireAfterSeconds: 0`, ensuring automated, continuous background cleanup of stale records.
