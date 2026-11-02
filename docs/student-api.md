# Student Portal API Reference — Phase 06

Comprehensive API reference for the White-Label Multi-Tenant SaaS Student Portal.
All requests require Bearer JWT Authentication (`Authorization: Bearer <accessToken>`) with `role: "STUDENT"`, along with tenant isolation headers (`x-tenant-id` or resolved domain).

---

## 1. Authentication & Sessions

### `POST /api/v1/student/auth/login`
- **Description:** Authenticates student user with email/phone and password.
- **Request Body:**
  ```json
  { "email": "student@academy.com", "password": "SecurePassword123" }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Student login successful",
    "data": {
      "student": { "_id": "...", "name": "...", "admissionNumber": "ADM-001" },
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
  ```

### `POST /api/v1/student/auth/refresh`
- **Description:** Rotates refresh token with reuse detection.
- **Request Body:** `{ "refreshToken": "..." }`

### `POST /api/v1/student/auth/logout`
- **Description:** Invalidates the current student session.

### `POST /api/v1/student/auth/logout-all`
- **Description:** Revokes all active sessions across all devices for this student.

### `GET /api/v1/student/auth/me`
- **Description:** Returns the active student identity, branch, and academic profile.

### `POST /api/v1/student/auth/change-password`
- **Description:** Securely updates password after verifying current credentials.
- **Request Body:** `{ "currentPassword": "...", "newPassword": "..." }`

### `GET /api/v1/student/auth/sessions` & `DELETE /api/v1/student/auth/sessions/:sessionId`
- **Description:** Manage active device sessions.

---

## 2. Student Dashboard & Profile

### `GET /api/v1/student/dashboard`
- **Description:** Returns unified overview of active courses, attendance %, fee ledger balance, upcoming classes, and certification eligibility status.

### `GET /api/v1/student/profile`
- **Description:** Retrieves student profile details.

### `PATCH /api/v1/student/profile`
- **Description:** Updates student-permitted personal fields (phone, address, emergencyContact, profilePhoto). Protected against mass assignment (`admissionNumber`, `enrollmentNumber`, `planId`, `status` cannot be modified).

---

## 3. Academic Plans & Course Catalog

### `GET /api/v1/student/plans` & `GET /api/v1/student/plans/:id`
- **Description:** Returns academic plans available for student admission.

### `GET /api/v1/student/plans/:id/courses` & `GET /api/v1/student/plans/:id/services`
- **Description:** Returns courses and services packaged within a specific plan.

### `GET /api/v1/student/courses` & `GET /api/v1/student/courses/:id`
- **Description:** Returns complete course catalog with duration, curriculum theory/practical hours, fee, and prerequisites.

### `GET /api/v1/student/courses/:id/modules` & `GET /api/v1/student/courses/:id/topics`
- **Description:** Returns module syllabus breakdown and lesson topics.

---

## 4. Course & Plan Purchases

### `POST /api/v1/student/purchases`
- **Description:** Creates purchase order. Server validates base course/plan fees, additional services, admission fees, and calculates 18% GST and coupon discounts securely. Auto-creates `CourseEnrollment` record.
- **Request Body:**
  ```json
  {
    "planId": "...",
    "courseId": "...",
    "additionalServices": ["svc-1", "svc-2"],
    "paymentMethod": "UPI"
  }
  ```

### `GET /api/v1/student/purchases` & `GET /api/v1/student/purchases/:id`
- **Description:** View purchase order history and invoices.

---

## 5. Course Enrollments

### `GET /api/v1/student/enrollments` & `GET /api/v1/student/enrollments/:id`
- **Description:** Returns student institutional enrollments.

### `GET /api/v1/student/enrollments/:id/timeline`
- **Description:** Returns chronological milestones for an enrollment.

### `GET /api/v1/student/enrollments/:id/overview`
- **Description:** Detailed enrollment statistics including completion %, trainer, branch.

---

## 6. Class Schedule & Attendance

### `GET /api/v1/student/schedule`, `today`, `week`, `month`
- **Description:** Timetable sessions with room allocation, lab type (PRACTICAL/THEORY), and status.

### `GET /api/v1/student/attendance` & `GET /api/v1/student/attendance/summary`
- **Description:** Biometric check-in/check-out logs and aggregate attendance rate percentage.

### `POST /api/v1/student/attendance-corrections` & `GET /api/v1/student/attendance-corrections`
- **Description:** Submit attendance dispute/correction requests with reasons and attachments.

---

## 7. Curriculum Materials, Assignments, Tests & Exams

### `GET /api/v1/student/materials` & `GET /api/v1/student/materials/:id/download`
- **Description:** Authorized PDFs, study guides, video masterclasses, and worksheets.

### `GET /api/v1/student/assignments` & `GET /api/v1/student/assignments/:id`
- **Description:** Assigned practical case studies, deadlines, and evaluator grades.

### `POST /api/v1/student/assignments/:id/submit`
- **Description:** Turn in assignment portfolio links and case study notes.

### `GET /api/v1/student/tests`, `exams`, `start`, `submit`, `result`
- **Description:** Full interactive testing and board examination lifecycle with automatic scoring and pass/fail thresholds.

---

## 8. Financial Ledger, Invoices & Installments

### `GET /api/v1/student/payments/summary`
- **Description:** Answers exact financial ledger queries:
  - `totalCourseFee`
  - `totalPaid`
  - `advancePaid`
  - `remainingAmount`
  - `nextDueDate`
  - `paymentStatus`

### `GET /api/v1/student/payments/invoices` & `invoices/:id/download`
- **Description:** Tax invoice archives with breakdown of GST and payment receipts.

### `GET /api/v1/student/payments/upcoming` & `installments`
- **Description:** Milestone installment schedules and payment links.

---

## 9. Diplomas & Certificates

### `GET /api/v1/student/certificates` & `certificates/:id`
- **Description:** Official diplomas conferred upon satisfying auto-eligibility:
  - Attendance >= 80%
  - Course Completion >= 80%
  - Board Exam Passed
  - Tuition Balance Cleared (INR 0 remaining)

### `GET /api/v1/student/certificates/:id/verify`
- **Description:** Public and cryptographic verification endpoint for diploma credentials.

---

## 10. Student Documents, Leaves & Requests

### `GET /api/v1/student/documents`, `POST /documents`, `DELETE /documents/:id`
- **Description:** Student identity proofs, address verification, and qualification documents. Isolated with strict 403 authorization.

### `GET /api/v1/student/leaves`, `POST /leaves`, `POST /leaves/:id/cancel`
- **Description:** Formal academic leave applications.

### `GET /api/v1/student/requests`, `POST /requests`, `POST /requests/:id/cancel`
- **Description:** Multi-tier service desk for branch transfers, batch changes, and queries.

---

## 11. Communication, Reports & Settings

### `GET /api/v1/student/chats`, `POST /chats/:id/messages`
- **Description:** Private messaging between Student <-> Administration and Student <-> Faculty.

### `GET /api/v1/student/notifications`, `read-all`, `announcements`
- **Description:** Alerts and campus circulars.

### `GET /api/v1/student/reports/complete`
- **Description:** 21-section unified student transcript combining profile, courses, schedule, attendance, assignments, tests, financials, and certificates.

### `GET /api/v1/student/settings`, `PUT /settings`, `security/devices`
- **Description:** Localization, notification channels (WhatsApp/SMS), and device sessions.
