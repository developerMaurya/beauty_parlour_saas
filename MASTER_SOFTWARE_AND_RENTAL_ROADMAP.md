# Master Architecture & Execution Plan: Software Hub, Institute, Internship, Attendance & Rental Floors

This master roadmap tracks every single requirement requested by the user across the 5 business verticals, backend schemas/controllers, REST API endpoints, and corporate frontend UI/UX views.

---

## 📌 Checklist of Core Modules & Requirements

### 1. 💻 Software & IT Solutions Catalog (`/admin/software` & Backend API)
- [ ] **Category Master (CRUD):** Mobile App, Web Application, SaaS Platform, Desktop Software, ERP/CRM, E-Commerce, Custom API.
- [ ] **Service Catalog (CRUD):** Cloud Hosting Services, Domain Registration & SSL, SMS Gateway, Digital Marketing & SEO, Software Maintenance, Custom Development.
- [ ] **Projects Portfolio (CRUD):**
  - Category dropdown & Service multi-select.
  - Project title, description, detailed feature highlights (dynamic multi-item list).
  - Pricing model: SaaS Subscription vs White-Label Ownership vs One-Time.
  - Price, discount, launch date, client industry.
  - **Live Preview / Redirect URL:** Demo link with direct browser navigation button (`target="_blank"`).
- [ ] **Client Project Inquiries & Leads:**
  - Inbound inquiries from public/clients requesting software development or SaaS white-label.
  - Quick actions: Direct Phone Call, WhatsApp Chat, Send Email, Status update (Pending, Contacted, Proposal Sent, Won, Lost).

---

### 2. 🎓 Computer Academy & Institute Management (Academic Portal)
- [ ] **Course Master (CRUD):**
  - Course name (e.g. Full Stack Web Development, Python & AI, Tally Prime + GST, ADCA, CCC, Graphic Design).
  - Duration (Months / Hours), syllabus overview, fee structure (Total Fee, Installment Plan, Registration fee).
- [ ] **Student Admission & Course Enrollment:**
  - Student details (Name, contact, email, guardian, qualification).
  - Assigned course selection & batch timing (Morning, Afternoon, Evening).
  - Fees status tracker: Total payable, amount paid to date, pending installment balance, installment history ledger.
- [ ] **Student Certificate Management (CRUD):**
  - Completion date, Grade/Percentage, Certificate Verification ID, Issue Date, Downloadable/Printable Certificate preview.

---

### 3. 💼 Professional Training & Internship Program (Tech Internship CRM)
- [ ] **Internship Tracks Master (CRUD):**
  - Track type (Summer Internship, Winter Internship, 6-Month Industrial Training, Full-Year Live Project Internship).
  - Tech stack / Language (e.g. React/Node.js, Python/Django, Flutter Mobile, Java Enterprise, DevOps & Cloud).
  - Pricing / Stipend structure: Free Training vs Paid Internship vs Stipend-Earning Trainee.
- [ ] **Intern Enrollment & Contract Lifecycle:**
  - Selection of track, duration, start & completion date.
  - **Joining Letter Generator / Form:** Formal joining letter issuance with stipend / fee terms.
  - **Relieving / Experience Certificate Form:** Reason letter, completion remarks, conduct rating.

---

### 4. 👨‍🏫 Institute Trainers & Software Engineers Staff Management
- [ ] **Trainer & Staff Profiles:**
  - Technical specialization, designation, department.
  - Monthly base salary, incentive/hourly rate.
- [ ] **Payroll & Salary Payment Ledger:**
  - Monthly payment records, transaction reference, payment mode (Bank Transfer / UPI), paid date, salary slip generator.
- [ ] **Staff HR Documents:**
  - Staff Joining Letter form.
  - Resignation / Relieving Letter form with settlement status.

---

### 5. ⏱️ Unified Enterprise Attendance & Leave System (`Master Central System`)
- [ ] **Unified Multi-Role Attendance:**
  - Supports Student (Academy), Intern (Internship Trainee), Trainer (Institute), Software Engineer (IT Staff), Parlour Specialist (Salon Staff).
  - Daily Check-In & Check-Out timestamp tracking with working hours calculation.
  - Status: Present, Absent, Half-Day, Late, On-Leave.
- [ ] **Leave Request & Approval Flow:**
  - Leave type: Sick, Casual, Academic Exam, Emergency.
  - Approval workflow with Admin approve/reject and remaining leave quota balance.

---

### 6. 🏢 Office & Commercial Rental Floors / Halls Management (`/admin/rent`)
- [ ] **Floor Master (CRUD):**
  - Ground Floor, 1st Floor, 2nd Floor, Rooftop Terrace, Basement Commercial.
- [ ] **Commercial Hall & Office Space Builder (CRUD):**
  - Selected Floor assignment.
  - Physical dimensions: Length (Ft), Width (Ft), Height / Clearance (Ft), Total Carpet Area (Sq.Ft).
  - Location specs: Main Road frontage, Corner property, Landmark description.
  - Features & Amenities: High-speed Elevator, 3-Phase Commercial Power, Fire NOC, 24x7 Water, Washrooms, Covered Car Parking.
  - Contact person & booking manager details.
  - Photos & Blueprint layout gallery.
- [ ] **Residential / House Rental & Brokerage Commission Master:**
  - House / Flat rental listing.
  - Tenant details, monthly rent, security deposit.
  - Brokerage commission percentage / fixed amount tracking.

---

## 🛠️ Step-by-Step Implementation Tracking
1. **Phase 1: Backend Architecture & REST Routes**
   - Software categories, services, projects, inquiries API.
   - Institute courses, student enrollments, fees ledger, certificates API.
   - Internship programs, joining letters, relieving letters API.
   - Unified attendance and leave API.
   - Office rental floors, commercial halls, residential brokerage API.
2. **Phase 2: Frontend Services & State Management**
   - Admin API integration in `adminApi.js`.
3. **Phase 3: High-End UI/UX Component Development**
   - Software Hub Dashboard with tabs: Categories, Services, Projects with Live URL, Inquiries.
   - Institute & Internship Management page with Courses, Enrollments, Fee Ledger, Certificates, Joining/Relieving forms.
   - Office & Commercial Rent page with Floors, Hall dimensions calculator, Amenities, and Brokerage ledger.
   - Unified Attendance management view.
4. **Phase 4: Automated Testing & Verification**
   - Headless Chrome DOM rendering and verification.
