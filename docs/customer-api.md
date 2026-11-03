# Phase 07 — Complete Customer, Guest & Public Portal API Specification

Comprehensive API Reference for White-Label Multi-Tenant Beauty Parlour SaaS Customer & Public Systems.

---

## 1. Authentication & Session Architecture

### `POST /api/v1/customer/auth/register`
- **Description:** Self-service registration for salon clients.
- **Auth:** Public / Tenant-Domain Resolved.
- **Request Body:**
  ```json
  {
    "name": "Ananya Sharma",
    "phone": "9876543210",
    "email": "ananya@example.com",
    "password": "SecurePassword123",
    "gender": "FEMALE",
    "preferredBranch": "60d0fe4f5311236168a109ca"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "customer": { "id": "...", "name": "Ananya Sharma", "phone": "9876543210" },
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/v1/customer/auth/login`
- **Description:** Customer login using phone/email and password or OTP.
- **Auth:** Public.
- **Request Body:**
  ```json
  {
    "phone": "9876543210",
    "password": "SecurePassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "customer": { "id": "...", "name": "Ananya Sharma" },
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/v1/customer/auth/refresh`
- **Description:** Rotate refresh token and issue new access token.
- **Auth:** Refresh Token (Cookie / Body).

### `POST /api/v1/customer/auth/logout`
- **Description:** Invalidate active session and clear token cookies.
- **Auth:** Bearer Token (`CUSTOMER`).

---

## 2. Customer Profile & Mass-Assignment Protection

### `GET /api/v1/customer/profile`
- **Description:** Retrieve authenticated customer profile with preferred branch and stats.
- **Auth:** Bearer Token (`CUSTOMER`).

### `PUT /api/v1/customer/profile`
- **Description:** Update permitted client fields (name, phone, email, dob, gender, emergency contact, preferred branch).
- **Security:** Mass-assignment protection strictly blocks modifications to `customerId`, `tenantId`, `status`, `totalVisits`, `totalSpent`.

---

## 3. Customer Catalog & Server-Side Pricing

### `GET /api/v1/customer/services`
- **Description:** Browse available services filtered by branch, category, and eligibility.
- **Auth:** Bearer Token (`CUSTOMER`).

### `POST /api/v1/customer/coupons/validate`
- **Description:** Verify discount coupon validity, expiry, and minimum order requirements strictly on server side.
- **Request Body:**
  ```json
  {
    "code": "GLOW20",
    "amount": 2500
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "code": "GLOW20",
      "discountPercent": 20,
      "discountAmount": 500,
      "finalAmount": 2000
    }
  }
  ```

---

## 4. Appointment Booking & Double-Booking Guard

### `POST /api/v1/customer/appointments`
- **Description:** Book appointment with real-time slot conflict detection, holiday checks, and salon capacity rules.
- **Auth:** Bearer Token (`CUSTOMER`).
- **Request Body:**
  ```json
  {
    "serviceId": "60d0fe4f5311236168a109cb",
    "branchId": "60d0fe4f5311236168a109ca",
    "staffId": "60d0fe4f5311236168a109cc",
    "date": "2026-11-15",
    "startTime": "11:00",
    "bookingType": "IN_BRANCH",
    "notes": "Skin sensitivity test required"
  }
  ```
- **Status State Machine:**
  `PENDING` → `CONFIRMED` → `ACCEPTED` → `STAFF_ASSIGNED` → `SERVICE_STARTED` → `SERVICE_COMPLETED` → `COMPLETED`

### `POST /api/v1/customer/appointments/:id/reschedule`
- **Description:** Reschedule existing booking with policy checks and conflict resolution.

### `POST /api/v1/customer/appointments/:id/cancel`
- **Description:** Cancel appointment with recorded cancellation reason and refund calculation.

---

## 5. Live Tracking & Privacy Guard

### `GET /api/v1/customer/appointments/:id/tracking`
- **Description:** 13-stage live tracking timeline:
  `BOOKED` → `CONFIRMED` → `STAFF_ASSIGNED` → `STAFF_ACCEPTED` → `ON_THE_WAY` → `ARRIVED` → `SERVICE_STARTED` → `SERVICE_PAUSED` → `SERVICE_RESUMED` → `SERVICE_COMPLETED` → `DEPARTED` → `COMPLETED`.

### `GET /api/v1/customer/home-services/:id/location`
- **Description:** Precise GPS location of dispatch staff.
- **Privacy Rule:** Location is only returned when status is `ON_THE_WAY`. If status is not `ON_THE_WAY`, `locationTrackingActive: false` is returned with coordinates masked.

---

## 6. Financial Ledger, Gateways & Tax Invoices

### `POST /api/v1/customer/payments/create-order`
- **Description:** Create server-calculated online payment order with 18% GST for Razorpay/Stripe.
- **Security:** Never trusts frontend prices; amount is always calculated server-side.

### `POST /api/v1/customer/payments/offline`
- **Description:** Record cash, UPI manual, or salon terminal payment for verification by front desk.

### `GET /api/v1/customer/payments/summary`
- **Description:** Complete customer financial ledger:
  Total Services, Total Amount, Total Paid, Online Paid, Offline Paid, Cash Paid, UPI Paid, Pending, Refunded.

---

## 7. Verified Reviews & Anti-Fake Moderation

### `POST /api/v1/customer/reviews`
- **Description:** Submit 1 to 5 star rating with text review.
- **Security:**
  1. Verifies that the customer actually completed the appointment (`COMPLETED` or `SERVICE_COMPLETED`).
  2. Rejects fake reviews for non-existent appointments with `CUSTOMER_REVIEW_APPOINTMENT_REQUIRED`.
  3. Rejects duplicate reviews for the same appointment with `CUSTOMER_REVIEW_ALREADY_EXISTS`.

---

## 8. Public & Guest APIs

### `GET /api/v1/public/services`
- **Description:** Public catalog for visitors. Strips internal salaries, supplier margins, and private salon notes.

### `POST /api/v1/guest/book`
- **Description:** Instant booking flow for visitors.
- **Customer Conversion:** Resolves matching customer by phone/email or automatically generates a new customer profile, preventing duplicate client records.

---

## 9. Customer Personal Document Vault

### `GET /api/v1/customer/documents`
- **Description:** Retrieve client treatment records, consent forms, patch test results, and skin consultation charts.
- **Auth:** Bearer Token (`CUSTOMER`).

### `POST /api/v1/customer/documents`
- **Description:** Upload new treatment waiver or skin consultation document to vault.
- **Request Body:**
  ```json
  {
    "title": "Allergy Test Clearance",
    "documentType": "PATCH_TEST_WAIVER",
    "fileUrl": "https://storage.cloud.com/waivers/test-doc.pdf",
    "notes": "Signed prior to treatment"
  }
  ```

### `PUT /api/v1/customer/documents/:id`
- **Description:** Update document metadata, category, or treatment notes.

### `DELETE /api/v1/customer/documents/:id`
- **Description:** Remove personal document record with cross-customer authorization check.

---

## 10. Multi-Tenant Isolation Standard

Every request validates:
1. `req.tenantId` matches domain resolution or header.
2. `req.customerId` matches verified JWT sub/id.
3. Access to appointments, payments, invoices, chats, and addresses belonging to other customers or rival tenants triggers `403 Forbidden` (`CUSTOMER_ACCESS_DENIED`).
