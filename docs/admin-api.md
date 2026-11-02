# Multi-Tenant Beauty SaaS — Tenant Admin API Reference

Complete documentation for all endpoints implemented in **Phase 04 — Dynamic Tenant Admin System**.

---

## 1. Authentication & Session Control

### POST `/api/v1/admin/auth/login`
- **Auth**: None (Tenant Resolution via Header/Slug/Custom Domain)
- **Body**: `{ "email": "admin@salon.local", "password": "Password123!" }`
- **Headers**: `x-tenant-id: <tenant-slug-or-id>`
- **Response**: `{ "success": true, "data": { "accessToken": "...", "refreshToken": "...", "user": { ... }, "tenant": { ... }, "branch": { ... } } }`

### POST `/api/v1/admin/auth/logout`
- **Auth**: Bearer JWT (`ADMIN`, `STAFF`, `STUDENT`, `CUSTOMER`)
- **Response**: `{ "success": true, "message": "Logged out successfully" }`

### POST `/api/v1/admin/auth/refresh`
- **Auth**: None
- **Body**: `{ "refreshToken": "..." }`
- **Response**: `{ "success": true, "data": { "accessToken": "...", "refreshToken": "..." } }`

### GET `/api/v1/admin/auth/me`
- **Auth**: Bearer JWT
- **Response**: `{ "success": true, "data": { "user": { ... }, "tenant": { ... } } }`

### POST `/api/v1/admin/auth/switch-branch`
- **Auth**: Bearer JWT
- **Body**: `{ "branchId": "<branch-id-or-null>" }`
- **Response**: `{ "success": true, "message": "Branch context switched successfully" }`

---

## 2. Dynamic Organizational Structure (No Hardcoded Roles)

### Departments
- `POST /api/v1/admin/departments`: Create department (`name`, `code`, `description`)
- `GET /api/v1/admin/departments`: List tenant departments
- `GET /api/v1/admin/departments/:departmentId`: Get department
- `PATCH /api/v1/admin/departments/:departmentId`: Update department
- `DELETE /api/v1/admin/departments/:departmentId`: Delete department
- `PATCH /api/v1/admin/departments/:departmentId/status`: Toggle status

### Designations
- `POST /api/v1/admin/designations`: Create designation linked to department
- `GET /api/v1/admin/designations`: List designations
- `GET /api/v1/admin/designations/:designationId`: Get designation
- `PATCH /api/v1/admin/designations/:designationId`: Update designation
- `DELETE /api/v1/admin/designations/:designationId`: Delete designation
- `PATCH /api/v1/admin/designations/:designationId/status`: Toggle status

### Skills & Specializations
- `POST /api/v1/admin/skills`: Create skill (e.g. HD Makeup, U Cut, Airbrush, Swedish Massage)
- `GET /api/v1/admin/skills`: List skills
- `GET /api/v1/admin/skills/:skillId`: Get skill
- `PATCH /api/v1/admin/skills/:skillId`: Update skill
- `DELETE /api/v1/admin/skills/:skillId`: Delete skill

---

## 3. Dynamic Roles & Permissions

- `GET /api/v1/admin/permissions`: List all defined system permissions
- `GET /api/v1/admin/permissions/grouped`: List permissions grouped by module
- `POST /api/v1/admin/roles`: Create custom tenant role
- `GET /api/v1/admin/roles`: List roles
- `GET /api/v1/admin/roles/:roleId`: Get role
- `PATCH /api/v1/admin/roles/:roleId`: Update role
- `DELETE /api/v1/admin/roles/:roleId`: Delete role
- `GET /api/v1/admin/roles/:roleId/permissions`: Get permissions assigned to role
- `PUT /api/v1/admin/roles/:roleId/permissions`: Update role permissions array

---

## 4. User Types Management (`ADMIN`, `STAFF`, `STUDENT`, `CUSTOMER`)

- `POST /api/v1/admin/users`: Register user account
- `GET /api/v1/admin/users`: List users (filter by `userType`, `branchId`, `status`, `search`)
- `GET /api/v1/admin/users/:userId`: Get user
- `PATCH /api/v1/admin/users/:userId`: Update user
- `DELETE /api/v1/admin/users/:userId`: Delete user
- `PATCH /api/v1/admin/users/:userId/status`: Change status (`active`, `inactive`, `suspended`)
- `POST /api/v1/admin/users/:userId/block`: Block user with reason
- `POST /api/v1/admin/users/:userId/unblock`: Unblock user
- `POST /api/v1/admin/users/:userId/reset-password`: Reset user password
- `POST /api/v1/admin/users/:userId/revoke-sessions`: Invalidate all active user sessions

---

## 5. Multi-Branch Operations

- `POST /api/v1/admin/branches`: Create branch (enforces SaaS `maxBranches` quota)
- `GET /api/v1/admin/branches`: List branches
- `GET /api/v1/admin/branches/:branchId`: Get branch details
- `PATCH /api/v1/admin/branches/:branchId`: Update branch
- `DELETE /api/v1/admin/branches/:branchId`: Delete branch
- `POST /api/v1/admin/branches/:branchId/set-default`: Set as tenant default branch
- `GET /api/v1/admin/branches/:branchId/hours`: Get operating hours
- `PATCH /api/v1/admin/branches/:branchId/hours`: Update operating hours & days

---

## 6. Staff & HR Management

- `POST /api/v1/admin/staff`: Create staff record
- `GET /api/v1/admin/staff`: List staff
- `GET /api/v1/admin/staff/:staffId`: Get staff profile
- `PATCH /api/v1/admin/staff/:staffId`: Update staff
- `DELETE /api/v1/admin/staff/:staffId`: Delete staff
- `POST /api/v1/admin/staff/:staffId/activate`: Activate staff
- `POST /api/v1/admin/staff/:staffId/deactivate`: Deactivate staff
- `POST /api/v1/admin/staff/:staffId/block`: Block staff
- `POST /api/v1/admin/staff/:staffId/unblock`: Unblock staff
- `GET /api/v1/admin/staff/:staffId/documents`: Get staff HR documents
- `POST /api/v1/admin/staff/:staffId/documents`: Upload staff document
- `GET /api/v1/admin/staff/:staffId/certificates`: Get staff certifications
- `POST /api/v1/admin/staff/:staffId/certificates`: Add staff certificate
- `GET /api/v1/admin/staff/:staffId/attendance`: Get staff attendance history
- `GET /api/v1/admin/staff/:staffId/commission`: Get commission breakdown

---

## 7. Attendance, Leaves & Holidays

- `POST /api/v1/admin/attendance/check-in`: Record staff check-in (calculates late arrival)
- `POST /api/v1/admin/attendance/check-out`: Record staff check-out (calculates total hours)
- `GET /api/v1/admin/attendance`: List attendance records
- `GET /api/v1/admin/leaves`: List staff leave applications
- `POST /api/v1/admin/leaves`: Submit leave application
- `POST /api/v1/admin/leaves/:leaveId/approve`: Approve leave
- `POST /api/v1/admin/leaves/:leaveId/reject`: Reject leave
- `POST /api/v1/admin/holidays`: Declare salon holiday
- `GET /api/v1/admin/holidays`: List salon holidays

---

## 8. Beauty Training Institute & Students

- `POST /api/v1/admin/students`: Register student profile
- `GET /api/v1/admin/students`: List academy students
- `GET /api/v1/admin/students/:studentId`: Get student
- `PATCH /api/v1/admin/students/:studentId`: Update student
- `DELETE /api/v1/admin/students/:studentId`: Delete student
- `POST /api/v1/admin/student-plans`: Create dynamic course plan (Basic, Advanced, Combo, Premium)
- `GET /api/v1/admin/student-plans`: List course plans
- `POST /api/v1/admin/students/:studentId/enrollments`: Enroll student into plan
- `GET /api/v1/admin/enrollments`: List all student enrollments
- `POST /api/v1/admin/students/:studentId/certificates`: Issue graduation diploma / certificate
- `GET /api/v1/admin/students/:studentId/certificates`: List student certificates

---

## 9. Customer Relationship Management (CRM)

- `POST /api/v1/admin/customers`: Create customer profile
- `GET /api/v1/admin/customers`: List customers
- `GET /api/v1/admin/customers/:customerId`: Get customer details
- `PATCH /api/v1/admin/customers/:customerId`: Update customer
- `DELETE /api/v1/admin/customers/:customerId`: Delete customer
- `POST /api/v1/admin/customers/:customerId/block`: Block customer
- `POST /api/v1/admin/customers/:customerId/unblock`: Unblock customer
- `POST /api/v1/admin/customers/:customerId/notes`: Add styling / allergy preference note
- `GET /api/v1/admin/customers/:customerId/visits`: Get visit history

---

## 10. Dynamic Service Catalog

- `POST /api/v1/admin/service-categories`: Create service category
- `GET /api/v1/admin/service-categories`: List categories
- `POST /api/v1/admin/service-subcategories`: Create subcategory
- `GET /api/v1/admin/service-subcategories`: List subcategories
- `POST /api/v1/admin/services`: Create service
- `GET /api/v1/admin/services`: List services (filter by category, gender, duration, price)
- `PATCH /api/v1/admin/services/:serviceId`: Update service
- `DELETE /api/v1/admin/services/:serviceId`: Delete service
- `POST /api/v1/admin/services/:serviceId/duplicate`: Duplicate service
- `POST /api/v1/admin/services/:serviceId/options`: Add variant / option (e.g. U Cut, Layer Cut)
- `POST /api/v1/admin/services/:serviceId/addons`: Add add-on (e.g. Hair Wash, Spa)

---

## 11. Packages, Offers & Coupons

- `POST /api/v1/admin/packages`: Create dynamic package with custom text inclusions
- `GET /api/v1/admin/packages`: List packages
- `POST /api/v1/admin/packages/:packageId/duplicate`: Duplicate package
- `POST /api/v1/admin/offers`: Create promotional offer
- `GET /api/v1/admin/offers`: List offers
- `POST /api/v1/admin/coupons`: Create discount coupon
- `GET /api/v1/admin/coupons`: List coupons

---

## 12. 13-Stage Appointments & Scheduling

- `POST /api/v1/admin/appointments`: Schedule appointment with conflict & double-booking prevention
- `GET /api/v1/admin/appointments`: List appointments
- `GET /api/v1/admin/appointments/availability`: Calculate open slots factoring buffer times
- `POST /api/v1/admin/appointments/:appointmentId/confirm`: Transition to `confirmed`
- `POST /api/v1/admin/appointments/:appointmentId/check-in`: Transition to `checked_in`
- `POST /api/v1/admin/appointments/:appointmentId/start`: Transition to `working`
- `POST /api/v1/admin/appointments/:appointmentId/pause`: Transition to `paused`
- `POST /api/v1/admin/appointments/:appointmentId/resume`: Transition to `working`
- `POST /api/v1/admin/appointments/:appointmentId/complete`: Transition to `completed`
- `POST /api/v1/admin/appointments/:appointmentId/cancel`: Transition to `cancelled`
- `POST /api/v1/admin/appointments/:appointmentId/no-show`: Transition to `no_show`
- `POST /api/v1/admin/appointments/:appointmentId/reschedule`: Reschedule date & time

---

## 13. First-Class Home Service Dispatch

- `GET /api/v1/admin/home-services/live`: Admin live operations view of active doorstep sessions
- `GET /api/v1/admin/home-services/:appointmentId/tracking`: Journey timeline history
- `POST /api/v1/admin/home-services/:appointmentId/assign`: Dispatch specialist
- `POST /api/v1/admin/home-services/:appointmentId/reassign`: Reassign specialist
- `POST /api/v1/staff/home-services/:appointmentId/accept`: Specialist accepts
- `POST /api/v1/staff/home-services/:appointmentId/on-the-way`: Specialist en route
- `POST /api/v1/staff/home-services/:appointmentId/arrived`: Specialist arrived at doorstep
- `POST /api/v1/staff/home-services/:appointmentId/start`: Specialist starts treatment
- `POST /api/v1/staff/home-services/:appointmentId/complete`: Specialist finishes treatment
- `GET /api/v1/customer/home-services/:appointmentId/tracking`: Customer public tracking view

---

## 14. POS Billing & Payments

- `POST /api/v1/admin/bills`: Create invoice (auto-deducts inventory products)
- `GET /api/v1/admin/bills`: List invoices
- `POST /api/v1/admin/bills/:billId/pay`: Collect payment (Cash, UPI, Card, Wallet)
- `POST /api/v1/admin/bills/:billId/refund`: Process refund
- `GET /api/v1/admin/bills/:billId/receipt`: Generate printable receipt data

---

## 15. Inventory & Products

- `POST /api/v1/admin/products`: Create product
- `GET /api/v1/admin/products`: List products
- `GET /api/v1/admin/inventory/low-stock`: Get low-stock alerts
- `POST /api/v1/admin/inventory/stock-in`: Log inventory replenishment
- `POST /api/v1/admin/inventory/stock-out`: Log inventory deduction
- `GET /api/v1/admin/suppliers`: List vendors

---

## 16. Facilities, Utilities, Rent, Assets & Scrap

- `POST /api/v1/admin/utilities/electricity`: Log electricity bill with meter readings comparison
- `GET /api/v1/admin/utilities/electricity`: Get electricity bills ledger
- `POST /api/v1/admin/rent`: Log salon rent payment
- `GET /api/v1/admin/rent`: List rent records
- `POST /api/v1/admin/assets`: Register physical salon equipment / furniture
- `POST /api/v1/admin/maintenance`: Create maintenance & repair ticket
- `POST /api/v1/admin/scrap`: Log waste disposal / expired product disposal
- `POST /api/v1/admin/expenses`: Record miscellaneous business expense
- `POST /api/v1/admin/additional-work`: Track outside wedding/event makeup work

---

## 17. Communication, Website & Settings

- `GET /api/v1/admin/communication/providers`: List WhatsApp/SMS/Email gateways
- `POST /api/v1/admin/communication/providers`: Connect new communication provider
- `GET /api/v1/admin/notification-templates`: List dynamic templates
- `POST /api/v1/admin/notification-templates`: Create template with variables
- `GET /api/v1/admin/website`: Get website CMS configuration
- `PATCH /api/v1/admin/website`: Update website profile & hero banner
- `GET /api/v1/admin/settings`: Get salon settings
- `PATCH /api/v1/admin/settings`: Update settings
- `GET /api/v1/admin/subscription`: Get tenant SaaS tier & quota usage
- `GET /api/v1/admin/audit-logs`: Query immutable security audit logs
- `GET /api/v1/admin/audit-logs/export`: Download audit trail CSV

---

## 18. Public Client & Booking APIs

- `GET /api/v1/public/business`: Public salon info
- `GET /api/v1/public/branches`: Public branch list
- `GET /api/v1/public/services`: Public service catalog
- `GET /api/v1/public/packages`: Public package offerings
- `GET /api/v1/public/offers`: Active public promotional offers
- `GET /api/v1/public/availability`: Real-time open slot calculator
- `POST /api/v1/public/bookings`: Public client online appointment booking
