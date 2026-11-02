# Phase 05: Staff Portal API Documentation

Comprehensive reference for all **Staff Portal APIs** implemented under `/api/v1/staff/*` in the White-Label Multi-Tenant SaaS platform.

All staff routes (except public auth endpoints) require authentication via `Authorization: Bearer <accessToken>` and tenant identification via `x-tenant-id: <tenantId-or-slug>`.

---

## 1. Authentication & Session Management

### `POST /api/v1/staff/auth/login`
- **Description**: Authenticate staff member credentials, link staff profile, and issue access & refresh tokens.
- **Auth**: Public (requires tenant header)
- **Request Body**:
  ```json
  {
    "email": "priya.stylist@luxe.test",
    "password": "StaffPassword123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Staff logged in successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "_id": "6724fa1b8c2a4f001...",
        "email": "priya.stylist@luxe.test",
        "role": "STAFF",
        "userType": "STAFF"
      },
      "staff": {
        "_id": "6724fa1b8c2a4f002...",
        "name": "Priya Verma",
        "employeeId": "STF-1001",
        "department": "Hair & Styling",
        "designation": "Senior Master Stylist",
        "branchId": "6724fa1b8c2a4f003...",
        "assignedBranches": ["6724fa1b8c2a4f003...", "6724fa1b8c2a4f004..."]
      }
    }
  }
  ```

### `POST /api/v1/staff/auth/refresh`
- **Description**: Rotates refresh token and provides new access token.
- **Auth**: Public / Cookie (`tenant_refresh_token`) or Body (`refreshToken`)

### `GET /api/v1/staff/auth/me`
- **Description**: Get active staff user identity, linked staff profile, branch assignments, and permissions.
- **Auth**: Staff JWT Bearer

### `POST /api/v1/staff/auth/change-password`
- **Description**: Update staff password and revoke all other active sessions.
- **Request Body**:
  ```json
  {
    "currentPassword": "StaffPassword123!",
    "newPassword": "NewStrongPassword456!"
  }
  ```

### `GET /api/v1/staff/auth/sessions` & `POST /api/v1/staff/auth/sessions/revoke-all`
- **Description**: List all active login sessions and revoke other devices.

---

## 2. Dashboard Endpoints

### `GET /api/v1/staff/dashboard/overview`
- **Description**: Staff high-level metrics (today's bookings, pending tasks, home visits, month earnings).

### `GET /api/v1/staff/dashboard/today`
- **Description**: Full agenda of today's schedule, clock-in status, appointments, and assignments.

### `GET /api/v1/staff/dashboard/appointments`
- **Description**: Quick view of assigned appointments for quick check-in.

### `GET /api/v1/staff/dashboard/tasks`
- **Description**: Pending task checklist for the current shift.

### `GET /api/v1/staff/dashboard/home-services`
- **Description**: Active doorstep service visits assigned to staff.

---

## 3. Profile & Branch Switching

### `GET /api/v1/staff/profile`
- **Description**: Detailed staff profile including skills, specializations, bank details, and assigned branches.

### `PATCH /api/v1/staff/profile`
- **Description**: Update personal editable fields (phone, address, emergency contact, bio). Protected against mass-assignment modifications of salary, commission, designation, or branch.

### `GET /api/v1/staff/branches`
- **Description**: List branches assigned to the staff member.

### `PATCH /api/v1/staff/current-branch`
- **Description**: Switch staff active working branch context (validates assignment to requested branch).
- **Request Body**:
  ```json
  { "branchId": "6724fa1b8c2a4f004..." }
  ```

---

## 4. Attendance & Shift Tracking

### `POST /api/v1/staff/attendance/check-in`
- **Description**: Punch in for work. Automatically detects late arrival against scheduled working hours.
- **Request Body**: `{ "notes": "Morning shift start", "location": { "latitude": 19.05, "longitude": 72.82 } }`

### `POST /api/v1/staff/attendance/check-out`
- **Description**: Punch out, calculates total working hours and overtime.

### `GET /api/v1/staff/attendance/summary`
- **Description**: Attendance statistics (present days, late arrivals, half days, overtime hours).

### `POST /api/v1/staff/attendance-corrections`
- **Description**: Submit an attendance correction request for missed punches or biometric issues.
- **Response `201 Created`**

---

## 5. Leaves & Holiday Calendar

### `POST /api/v1/staff/leaves`
- **Description**: Apply for leave (casual, sick, paid, unpaid). Automatically set to `pending` (staff cannot self-approve).
- **Request Body**:
  ```json
  {
    "leaveType": "casual",
    "fromDate": "2026-11-10",
    "toDate": "2026-11-12",
    "reason": "Family wedding out of town"
  }
  ```
- **Response `201 Created`**

### `GET /api/v1/staff/leaves` & `POST /api/v1/staff/leaves/:leaveId/cancel`
- **Description**: List leave application history and cancel pending/approved applications.

### `GET /api/v1/staff/holidays`
- **Description**: List upcoming official tenant salon holidays.

---

## 6. Appointments & CRM

### `GET /api/v1/staff/appointments`
- **Description**: List appointments assigned to staff with status, mode, and date filters.

### `GET /api/v1/staff/appointments/:appointmentId`
- **Description**: Get booking details, client contact, services, and audit status history.

### Lifecycle Status Progression:
- `POST /api/v1/staff/appointments/:appointmentId/confirm`
- `POST /api/v1/staff/appointments/:appointmentId/check-in`
- `POST /api/v1/staff/appointments/:appointmentId/start`
- `POST /api/v1/staff/appointments/:appointmentId/pause`
- `POST /api/v1/staff/appointments/:appointmentId/resume`
- `POST /api/v1/staff/appointments/:appointmentId/complete`
- `POST /api/v1/staff/appointments/:appointmentId/cancel`

### Customer CRM:
- `GET /api/v1/staff/customers`: List clients served by staff.
- `GET /api/v1/staff/customers/:customerId`: Customer profile and styling history.
- `POST /api/v1/staff/customers/:customerId/notes`: Add professional styling/skin notes (`201 Created`).

---

## 7. Home Services Journey & GPS Tracking

Mobile-first doorstep service execution pipeline:
- `POST /api/v1/staff/home-services/:appointmentId/accept`: Accept dispatch.
- `POST /api/v1/staff/home-services/:appointmentId/on-the-way`: Transition to en-route.
- `POST /api/v1/staff/home-services/:appointmentId/location`: Live GPS ping (`latitude`, `longitude`).
- `POST /api/v1/staff/home-services/:appointmentId/arrived`: Client doorstep arrival.
- `POST /api/v1/staff/home-services/:appointmentId/start`: In-home service commencement.
- `POST /api/v1/staff/home-services/:appointmentId/complete`: Finish treatments.
- `POST /api/v1/staff/home-services/:appointmentId/depart`: Departure.
- `POST /api/v1/staff/home-services/:appointmentId/expense`: Log travel/cab/parking expenses (`201 Created`).
- `POST /api/v1/staff/home-services/:appointmentId/report`: Submit doorstep work report (`200 OK`).

---

## 8. Inventory & Treatment Consumables

### `GET /api/v1/staff/inventory/stock`
- **Description**: Check current salon product stock and in-chair availability.

### `POST /api/v1/staff/inventory-requests`
- **Description**: Request replenishment for low backbar consumables (`201 Created`).

### `POST /api/v1/staff/service-usage`
- **Description**: Log in-chair product consumption against an appointment (`201 Created`).

---

## 9. Finance, Earnings & Payslips

- `GET /api/v1/staff/finance/earnings`: Real-time commission and monthly payout summaries.
- `GET /api/v1/staff/finance/commissions`: Itemized breakdown of commissions per service rendered.
- `GET /api/v1/staff/finance/payslips`: List generated monthly payslips.
- `GET /api/v1/staff/finance/payslips/:payslipId`: View payslip breakdown (base salary, deductions, net pay).
- `GET /api/v1/staff/finance/payslips/:payslipId/download`: Download PDF payslip.

---

## 10. Documents & Certificates

- `GET /api/v1/staff/documents`: List staff documents (ID proof, address proof, contract).
- `POST /api/v1/staff/documents`: Upload document (`201 Created`).
- `GET /api/v1/staff/certificates`: List verified and pending skill certificates.
- `POST /api/v1/staff/certificates`: Upload certificate for management verification (`201 Created`).

---

## 11. Unified Staff Requests (14 Types)

- `POST /api/v1/staff/requests`: Submit any of the 14 standardized request types:
  `branch_transfer`, `salary_advance`, `expense_reimbursement`, `equipment_repair`, `uniform_request`, `training_request`, `schedule_change`, `leave_encashment`, `profile_correction`, `resignation`, `complaint_grievance`, `overtime_claim`, `bonus_query`, `other`.
- `GET /api/v1/staff/requests`: Track pending and resolved tickets.

---

## 12. Tenant Chat & Tasks

### Chat & Messaging:
- `POST /api/v1/staff/chats`: Initiate chat with colleague or admin.
- `GET /api/v1/staff/chats`: List active chat conversations.
- `POST /api/v1/staff/chats/:chatId/messages`: Send message (`201 Created`).
- `GET /api/v1/staff/chats/:chatId/messages`: Retrieve chat message history.

### Tasks Management:
- `GET /api/v1/staff/tasks`: List assigned shift checklists.
- `POST /api/v1/staff/tasks/:taskId/accept`: Acknowledge task assignment.
- `POST /api/v1/staff/tasks/:taskId/comments`: Post task progress note (`201 Created`).
- `POST /api/v1/staff/tasks/:taskId/complete`: Complete assigned task.
