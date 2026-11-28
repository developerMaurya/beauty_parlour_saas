/**
 * @file softwareHub.controller.js
 * @description Comprehensive Software & IT Solutions, Computer Institute, Professional Internship CRM & Unified Attendance Controller.
 * @module backend/src/modules/software/controllers/softwareHub.controller
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// 1. Categories Database
let SOFTWARE_CATEGORIES = [
  { id: 'cat_mobile', name: 'Mobile Application', slug: 'mobile-app', icon: 'Smartphone', description: 'iOS & Android cross-platform React Native / Flutter apps', active: true },
  { id: 'cat_web', name: 'Web Application', slug: 'web-app', icon: 'Globe', description: 'High-performance React & Node.js dynamic web portals', active: true },
  { id: 'cat_saas', name: 'SaaS Platform', slug: 'saas', icon: 'Cloud', description: 'Multi-tenant cloud applications with subscription billing', active: true },
  { id: 'cat_desktop', name: 'Desktop Software & POS', slug: 'desktop-pos', icon: 'Monitor', description: 'Offline-first desktop software for retail shops & billing', active: true },
  { id: 'cat_custom', name: 'ERP & Custom Business Systems', slug: 'custom-erp', icon: 'Layers', description: 'Tailored enterprise resource management software', active: true },
];

// 2. Services Database
let SOFTWARE_SERVICES = [
  { id: 'srv_host', name: 'Cloud Hosting & Server Deployment', priceRange: '₹3,000 - ₹25,000/yr', description: 'AWS, DigitalOcean, VPS setup with 99.9% uptime SLA', active: true },
  { id: 'srv_domain', name: 'Domain Registration & SSL Security', priceRange: '₹999 - ₹4,999/yr', description: '.com, .in, .org domain provisioning with Cloudflare SSL', active: true },
  { id: 'srv_sms', name: 'Transactional & Promotional SMS API', priceRange: '₹0.18 / SMS', description: 'DLT-registered fast SMS gateway and WhatsApp Cloud API', active: true },
  { id: 'srv_mkt', name: 'Digital Marketing & SEO Ranking', priceRange: '₹8,000 - ₹45,000/mo', description: 'Google Ads, Meta Ads, Local SEO, and lead generation funnels', active: true },
  { id: 'srv_inst', name: 'Computer Institute & Training Lab Setup', priceRange: '₹25,000 - ₹1,50,000', description: 'IT Lab networking, computer center software, and curriculum', active: true },
  { id: 'srv_maint', name: 'AMC & Software Maintenance Service', priceRange: '₹5,000 - ₹20,000/mo', description: 'Regular security patches, bug fixes, and continuous backups', active: true },
];

// 3. Projects Portfolio Database
let SOFTWARE_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Kashi Multi-Business Enterprise SaaS Platform',
    categoryId: 'cat_saas',
    categoryName: 'SaaS Platform',
    services: ['Cloud Hosting', 'Domain Registration & SSL', 'AMC Maintenance'],
    description: 'Complete all-in-one multi-tenant administration platform for beauty salons, event production, plotting real estate, and computer centers.',
    features: ['Multi-Tenant Isolated Data Architecture', 'Dynamic POS & Barcode Scanner', 'VDA Approved Plot Mapping & EMI Ledger', 'Full Attendance & HR System'],
    licenseType: 'SaaS Subscription',
    price: 49999,
    discount: 5000,
    clientIndustry: 'Enterprise Services & Franchises',
    redirectUrl: 'https://kashiservice.com',
    status: 'LIVE_PRODUCTION',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'proj_2',
    name: 'OmniPOS Ultra Fast Thermal Retail Billing & Barcode App',
    categoryId: 'cat_desktop',
    categoryName: 'Desktop Software & POS',
    services: ['Cloud Hosting', 'Transactional SMS API'],
    description: 'High-speed offline-first point of sale software with instant UPI dynamic QR, thermal receipt printing, and daily stock ledger.',
    features: ['Thermal USB & Bluetooth ESC/POS Support', 'Instant UPI Dynamic QR code generation', 'Barcode scanning and automated inventory alerts', 'GST 3B tax report generator'],
    licenseType: 'White-Label Ownership',
    price: 24999,
    discount: 3000,
    clientIndustry: 'Supermarkets & Retail Stores',
    redirectUrl: 'http://localhost:3002/admin/billing',
    status: 'ACTIVE_DEMO',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'proj_3',
    name: 'Glamour Salon & Bridal Makeup Booking App',
    categoryId: 'cat_mobile',
    categoryName: 'Mobile Application',
    services: ['Digital Marketing & SEO', 'Cloud Hosting'],
    description: 'Cross-platform mobile application for customers to book bridal appointments, doorstep beauticians, and track live GPS arrival.',
    features: ['Real-time beautician GPS tracking', 'Integrated Razorpay & UPI gateway', 'Slot appointment scheduler', 'Customer loyalty points engine'],
    licenseType: 'SaaS Subscription',
    price: 34999,
    discount: 4000,
    clientIndustry: 'Beauty, Wellness & Salons',
    redirectUrl: 'http://localhost:3002/site/blossom-salon',
    status: 'LIVE_PRODUCTION',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

// 4. Client Software Development Inquiries Database
let SOFTWARE_INQUIRIES = [
  {
    id: 'SW-INQ-101',
    clientName: 'Shri Balaji Electronics',
    phone: '9839123456',
    email: 'contact@balajielectronics.com',
    projectType: 'E-Commerce Website & Mobile App',
    budget: '₹60,000 - ₹90,000',
    details: 'Need online shopping portal with local delivery tracking in Varanasi and wholesale B2B pricing login.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'SW-INQ-102',
    clientName: 'Apex coaching Institute',
    phone: '9450123987',
    email: 'director@apexclasses.org',
    projectType: 'Student Mobile App & Online Test Portal',
    budget: '₹45,000',
    details: 'Wants OMR digital test evaluation, video lectures, and fee reminder SMS automation.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// 5. Computer Academy Courses Master
let ACADEMY_COURSES = [
  { id: 'crs_fullstack', title: 'Full Stack MERN & Python AI Engineering', code: 'FS-AI-2026', durationMonths: 6, totalFees: 24000, monthlyInstallment: 4000, syllabus: 'HTML5, CSS3, Tailwind, React 19, Node.js, Express, MongoDB, Postgres, Python, Git & GitHub' },
  { id: 'crs_adca', title: 'ADCA (Advanced Diploma in Computer Applications)', code: 'ADCA-01', durationMonths: 12, totalFees: 15000, monthlyInstallment: 1250, syllabus: 'Fundamentals, Windows 11, MS Office 365, Tally Prime + GST, Photoshop, Web Design basics' },
  { id: 'crs_tally', title: 'Tally Prime with Practical GST & Taxation', code: 'TALLY-GST', durationMonths: 3, totalFees: 7500, monthlyInstallment: 2500, syllabus: 'Voucher Entry, Inventory, Payroll, GST Reconciliation, TDS/TCS, Balance Sheet Finalization' },
  { id: 'crs_graphics', title: 'Graphic Design, Video Editing & UI/UX (Figma)', code: 'DES-FIGMA', durationMonths: 4, totalFees: 16000, monthlyInstallment: 4000, syllabus: 'Photoshop, Illustrator, Premiere Pro, Figma UI Design, Mobile Design Systems' },
];

// 6. Enrolled Students & Fee Ledger
let ACADEMY_STUDENTS = [
  {
    id: 'STU-2026-001',
    name: 'Aman Srivastava',
    phone: '9876501234',
    email: 'aman.srivastava@gmail.com',
    guardianName: 'Ramesh Srivastava',
    courseId: 'crs_fullstack',
    courseName: 'Full Stack MERN & Python AI Engineering',
    batchTiming: 'Morning (08:00 AM - 10:00 AM)',
    enrollmentDate: '2026-10-01',
    totalFees: 24000,
    paidFees: 16000,
    pendingFees: 8000,
    status: 'Active Enrolled',
    paymentHistory: [
      { receiptNo: 'RCP-101', amount: 8000, date: '2026-10-01', mode: 'UPI' },
      { receiptNo: 'RCP-142', amount: 8000, date: '2026-11-01', mode: 'Cash' },
    ],
  },
  {
    id: 'STU-2026-002',
    name: 'Pooja Vishwakarma',
    phone: '9838012345',
    email: 'pooja.v@outlook.com',
    guardianName: 'Santosh Vishwakarma',
    courseId: 'crs_adca',
    courseName: 'ADCA (Advanced Diploma in Computer Applications)',
    batchTiming: 'Afternoon (02:00 PM - 04:00 PM)',
    enrollmentDate: '2026-09-15',
    totalFees: 15000,
    paidFees: 15000,
    pendingFees: 0,
    status: 'Completed / Ready for Certificate',
    paymentHistory: [
      { receiptNo: 'RCP-089', amount: 5000, date: '2026-09-15', mode: 'UPI' },
      { receiptNo: 'RCP-119', amount: 5000, date: '2026-10-15', mode: 'UPI' },
      { receiptNo: 'RCP-156', amount: 5000, date: '2026-11-15', mode: 'UPI' },
    ],
  },
];

// 7. Student Certificates
let ACADEMY_CERTIFICATES = [
  {
    id: 'CERT-2026-891',
    studentId: 'STU-2026-002',
    studentName: 'Pooja Vishwakarma',
    courseName: 'ADCA (Advanced Diploma in Computer Applications)',
    grade: 'A+ (Distinction - 92%)',
    issueDate: '2026-11-20',
    verificationCode: 'VNS-CERT-89120',
    certificateUrl: '/certificates/CERT-2026-891.pdf',
    status: 'ISSUED',
  },
];

// 8. Professional Internship Program Tracks
let INTERNSHIP_TRACKS = [
  {
    id: 'trn_summer',
    title: 'Summer Tech Accelerator Internship',
    type: 'Summer Internship',
    duration: '2 Months (8 Weeks)',
    languages: 'React.js, Node.js, Express, Tailwind CSS',
    feesOrStipend: 'Stipend ₹8,000 / month for top performers',
    price: 6000,
    description: 'Intensive summer program building 2 live production web applications with code reviews and mentorship.',
  },
  {
    id: 'trn_industrial',
    title: '6-Month Industrial Degree Training Program',
    type: '6 Months Industrial Training',
    duration: '6 Months (Semester Project)',
    languages: 'Python AI, Machine Learning, Django & PostgreSQL',
    feesOrStipend: 'Free (Merit Basis Selection)',
    price: 0,
    description: 'Mandatory college semester industrial project with ISO-certified completion certificate and live deployment.',
  },
  {
    id: 'trn_fullyear',
    title: 'Full-Year Software Engineering Fellowship',
    type: 'Full Year Live Project Internship',
    duration: '12 Months',
    languages: 'Full Stack MERN, React Native Mobile, AWS DevOps',
    feesOrStipend: 'Fixed Stipend ₹12,000 / month + Performance Bonus',
    price: 0,
    description: 'Work directly on client software projects, daily standups, Jira tickets, and production deployments.',
  },
];

// 9. Enrolled Interns with Joining Letter & Relieving Letter Management
let ENROLLED_INTERNS = [
  {
    id: 'INT-2026-01',
    name: 'Deepak Maurya',
    phone: '9918234567',
    email: 'deepak.maurya@bhu.ac.in',
    college: 'IIT BHU / KNIT Sultanpur',
    trackId: 'trn_industrial',
    trackTitle: '6-Month Industrial Degree Training Program',
    languages: 'Python AI, Django & PostgreSQL',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    stipendTerms: 'Stipend ₹10,000/mo after first month milestone',
    joiningLetterIssued: true,
    joiningLetterDate: '2026-07-01',
    relievingLetterIssued: false,
    status: 'ACTIVE_INTERN',
  },
];

// 10. Trainers & Staff with Salary Records & HR Letters
let STAFF_MEMBERS = [
  {
    id: 'EMP-101',
    name: 'Er. Alok Nath Verma',
    role: 'Senior Full-Stack & AI Trainer',
    department: 'Computer Academy & Institute',
    phone: '9839012345',
    email: 'alok.trainer@kashiservice.com',
    monthlySalary: 42000,
    joiningDate: '2024-05-01',
    joiningLetterIssued: true,
    resignationIssued: false,
    status: 'Active Staff',
    salaryLedger: [
      { month: 'October 2026', amount: 42000, paidDate: '2026-11-05', mode: 'Bank Transfer (IMPS)', refNo: 'IMPS9481230', status: 'PAID' },
      { month: 'September 2026', amount: 42000, paidDate: '2026-10-05', mode: 'Bank Transfer (IMPS)', refNo: 'IMPS8124901', status: 'PAID' },
    ],
  },
  {
    id: 'EMP-102',
    name: 'Smt. Neha Pandey',
    role: 'Tally Prime & GST Instructor',
    department: 'Accounting & Commerce Lab',
    phone: '9794123456',
    email: 'neha.gst@kashiservice.com',
    monthlySalary: 28000,
    joiningDate: '2025-01-15',
    joiningLetterIssued: true,
    resignationIssued: false,
    status: 'Active Staff',
    salaryLedger: [
      { month: 'October 2026', amount: 28000, paidDate: '2026-11-05', mode: 'UPI (Axis Bank)', refNo: 'UPI901234', status: 'PAID' },
    ],
  },
];

// 11. Unified Attendance & Leave Database (Students, Interns, Trainers, Software Engineers & Parlour Employees)
let UNIFIED_ATTENDANCE = [
  {
    id: 'att_01',
    personId: 'EMP-101',
    name: 'Er. Alok Nath Verma',
    userType: 'TRAINER',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:45 AM',
    checkOut: '05:30 PM',
    status: 'PRESENT',
    hours: '8h 45m',
    notes: 'Morning AI lecture delivered. Handled student lab practicals.',
  },
  {
    id: 'att_02',
    personId: 'INT-2026-01',
    name: 'Deepak Maurya',
    userType: 'INTERN',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:05 AM',
    checkOut: '06:00 PM',
    status: 'PRESENT',
    hours: '8h 55m',
    notes: 'Completed sprint ticket #42 on Django auth middleware.',
  },
  {
    id: 'att_03',
    personId: 'STU-2026-001',
    name: 'Aman Srivastava',
    userType: 'STUDENT',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:00 AM',
    checkOut: '10:05 AM',
    status: 'PRESENT',
    hours: '2h 05m',
    notes: 'Attended React hooks & state practicals.',
  },
];

export const softwareHubController = {
  // ── Categories CRUD ──
  async listCategories(_req, res) {
    return sendSuccess(res, 'Categories retrieved', { total: SOFTWARE_CATEGORIES.length, categories: SOFTWARE_CATEGORIES });
  },
  async createCategory(req, res) {
    const { name, description = '', icon = 'Code' } = req.body;
    if (!name) return sendError(res, 'Category name is required', [], 400);
    const newCat = {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      icon,
      description,
      active: true,
    };
    SOFTWARE_CATEGORIES.push(newCat);
    return sendSuccess(res, 'Category created', newCat, 201);
  },
  async deleteCategory(req, res) {
    const { id } = req.params;
    SOFTWARE_CATEGORIES = SOFTWARE_CATEGORIES.filter((c) => c.id !== id);
    return sendSuccess(res, 'Category deleted', { id });
  },

  // ── Services CRUD ──
  async listServices(_req, res) {
    return sendSuccess(res, 'Services retrieved', { total: SOFTWARE_SERVICES.length, services: SOFTWARE_SERVICES });
  },
  async createService(req, res) {
    const { name, priceRange = 'On Request', description = '' } = req.body;
    if (!name) return sendError(res, 'Service name is required', [], 400);
    const newSrv = { id: `srv_${Date.now()}`, name, priceRange, description, active: true };
    SOFTWARE_SERVICES.push(newSrv);
    return sendSuccess(res, 'Service created', newSrv, 201);
  },
  async deleteService(req, res) {
    const { id } = req.params;
    SOFTWARE_SERVICES = SOFTWARE_SERVICES.filter((s) => s.id !== id);
    return sendSuccess(res, 'Service deleted', { id });
  },

  // ── Projects CRUD ──
  async listProjects(_req, res) {
    return sendSuccess(res, 'Projects retrieved', { total: SOFTWARE_PROJECTS.length, projects: SOFTWARE_PROJECTS });
  },
  async createProject(req, res) {
    const { name, categoryId, categoryName, services = [], description, features = [], licenseType = 'SaaS Subscription', price = 0, discount = 0, clientIndustry = '', redirectUrl = '' } = req.body;
    if (!name) return sendError(res, 'Project name is required', [], 400);
    const newProj = {
      id: `proj_${Date.now()}`,
      name,
      categoryId,
      categoryName: categoryName || 'Custom Project',
      services,
      description,
      features,
      licenseType,
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      clientIndustry,
      redirectUrl,
      status: 'ACTIVE_DEMO',
      createdAt: new Date().toISOString(),
    };
    SOFTWARE_PROJECTS.unshift(newProj);
    return sendSuccess(res, 'Project created successfully', newProj, 201);
  },
  async deleteProject(req, res) {
    const { id } = req.params;
    SOFTWARE_PROJECTS = SOFTWARE_PROJECTS.filter((p) => p.id !== id);
    return sendSuccess(res, 'Project deleted', { id });
  },

  // ── Inquiries CRUD ──
  async listInquiries(_req, res) {
    return sendSuccess(res, 'Inquiries retrieved', { total: SOFTWARE_INQUIRIES.length, inquiries: SOFTWARE_INQUIRIES });
  },
  async createInquiry(req, res) {
    const { clientName, phone, email = '', projectType, budget, details } = req.body;
    if (!clientName || !phone) return sendError(res, 'Client name and phone are required', [], 400);
    const newInq = {
      id: `SW-INQ-${Date.now().toString().slice(-4)}`,
      clientName,
      phone,
      email,
      projectType: projectType || 'Custom Software Inquiry',
      budget: budget || '₹50,000',
      details: details || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    SOFTWARE_INQUIRIES.unshift(newInq);
    return sendSuccess(res, 'Inquiry recorded', newInq, 201);
  },
  async updateInquiryStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const found = SOFTWARE_INQUIRIES.find((i) => i.id === id);
    if (!found) return sendError(res, 'Inquiry not found', [], 404);
    found.status = status;
    return sendSuccess(res, 'Status updated', found);
  },

  // ── Academy Courses CRUD ──
  async listCourses(_req, res) {
    return sendSuccess(res, 'Courses retrieved', { total: ACADEMY_COURSES.length, courses: ACADEMY_COURSES });
  },
  async createCourse(req, res) {
    const { title, code, durationMonths, totalFees, monthlyInstallment, syllabus } = req.body;
    if (!title || !totalFees) return sendError(res, 'Course title and fees are required', [], 400);
    const newCrs = {
      id: `crs_${Date.now()}`,
      title,
      code: code || `CRS-${Date.now().toString().slice(-3)}`,
      durationMonths: Number(durationMonths) || 6,
      totalFees: Number(totalFees) || 15000,
      monthlyInstallment: Number(monthlyInstallment) || Math.round(Number(totalFees) / (Number(durationMonths) || 6)),
      syllabus: syllabus || '',
    };
    ACADEMY_COURSES.push(newCrs);
    return sendSuccess(res, 'Course created', newCrs, 201);
  },

  // ── Students & Fee Ledger ──
  async listStudents(_req, res) {
    return sendSuccess(res, 'Students retrieved', { total: ACADEMY_STUDENTS.length, students: ACADEMY_STUDENTS });
  },
  async enrollStudent(req, res) {
    const { name, phone, email, guardianName, courseId, courseName, batchTiming, totalFees } = req.body;
    if (!name || !phone || !courseId) return sendError(res, 'Student name, phone, and course are required', [], 400);
    const fee = Number(totalFees) || 15000;
    const newStu = {
      id: `STU-2026-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      email,
      guardianName,
      courseId,
      courseName,
      batchTiming: batchTiming || 'Morning (08:00 AM - 10:00 AM)',
      enrollmentDate: new Date().toISOString().split('T')[0],
      totalFees: fee,
      paidFees: 0,
      pendingFees: fee,
      status: 'Active Enrolled',
      paymentHistory: [],
    };
    ACADEMY_STUDENTS.unshift(newStu);
    return sendSuccess(res, 'Student enrolled successfully', newStu, 201);
  },
  async recordStudentFeePayment(req, res) {
    const { studentId } = req.params;
    const { amount, mode = 'UPI' } = req.body;
    const stu = ACADEMY_STUDENTS.find((s) => s.id === studentId);
    if (!stu) return sendError(res, 'Student not found', [], 404);
    const payAmt = Number(amount) || 0;
    stu.paidFees += payAmt;
    stu.pendingFees = Math.max(0, stu.totalFees - stu.paidFees);
    const receipt = {
      receiptNo: `RCP-${Date.now().toString().slice(-5)}`,
      amount: payAmt,
      date: new Date().toISOString().split('T')[0],
      mode,
    };
    stu.paymentHistory.push(receipt);
    if (stu.pendingFees === 0) stu.status = 'Completed / Ready for Certificate';
    return sendSuccess(res, 'Fee payment recorded', { student: stu, receipt });
  },

  // ── Certificates ──
  async listCertificates(_req, res) {
    return sendSuccess(res, 'Certificates retrieved', { total: ACADEMY_CERTIFICATES.length, certificates: ACADEMY_CERTIFICATES });
  },
  async issueCertificate(req, res) {
    const { studentId, studentName, courseName, grade = 'A (Excellent)' } = req.body;
    const code = `VNS-CERT-${Date.now().toString().slice(-5)}`;
    const newCert = {
      id: `CERT-2026-${Date.now().toString().slice(-4)}`,
      studentId,
      studentName,
      courseName,
      grade,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: code,
      certificateUrl: `/verify-certificate?code=${code}`,
      status: 'ISSUED',
    };
    ACADEMY_CERTIFICATES.unshift(newCert);
    return sendSuccess(res, 'Digital Certificate issued successfully', newCert, 201);
  },

  // ── Internship Programs & Enrolled Interns ──
  async listInternshipTracks(_req, res) {
    return sendSuccess(res, 'Internship tracks retrieved', { total: INTERNSHIP_TRACKS.length, tracks: INTERNSHIP_TRACKS });
  },
  async createInternshipTrack(req, res) {
    const { title, type, duration, languages, feesOrStipend, price = 0, description } = req.body;
    const newTrk = {
      id: `trn_${Date.now()}`,
      title,
      type: type || 'Summer Internship',
      duration: duration || '3 Months',
      languages: languages || 'React & Node.js',
      feesOrStipend: feesOrStipend || 'Stipend ₹8,000/mo',
      price: Number(price) || 0,
      description: description || '',
    };
    INTERNSHIP_TRACKS.push(newTrk);
    return sendSuccess(res, 'Internship track created', newTrk, 201);
  },
  async listInterns(_req, res) {
    return sendSuccess(res, 'Interns list retrieved', { total: ENROLLED_INTERNS.length, interns: ENROLLED_INTERNS });
  },
  async enrollIntern(req, res) {
    const { name, phone, email, college, trackId, trackTitle, languages, stipendTerms, startDate, endDate } = req.body;
    const newInt = {
      id: `INT-2026-${Date.now().toString().slice(-3)}`,
      name,
      phone,
      email,
      college,
      trackId,
      trackTitle,
      languages,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      stipendTerms: stipendTerms || 'Performance based stipend',
      joiningLetterIssued: true,
      joiningLetterDate: new Date().toISOString().split('T')[0],
      relievingLetterIssued: false,
      status: 'ACTIVE_INTERN',
    };
    ENROLLED_INTERNS.unshift(newInt);
    return sendSuccess(res, 'Intern enrolled with joining letter', newInt, 201);
  },
  async issueInternRelievingLetter(req, res) {
    const { internId } = req.params;
    const { reason, rating = '5-Star Outstanding' } = req.body;
    const int = ENROLLED_INTERNS.find((i) => i.id === internId);
    if (!int) return sendError(res, 'Intern not found', [], 404);
    int.relievingLetterIssued = true;
    int.relievingRemarks = reason;
    int.conductRating = rating;
    int.status = 'COMPLETED_RELIEVED';
    return sendSuccess(res, 'Relieving and experience letter issued', int);
  },

  // ── Trainers & Staff Salary ──
  async listStaff(_req, res) {
    return sendSuccess(res, 'Staff members retrieved', { total: STAFF_MEMBERS.length, staff: STAFF_MEMBERS });
  },
  async recordStaffSalary(req, res) {
    const { staffId } = req.params;
    const { month, amount, mode = 'Bank Transfer', refNo = `IMPS${Date.now().toString().slice(-6)}` } = req.body;
    const member = STAFF_MEMBERS.find((m) => m.id === staffId);
    if (!member) return sendError(res, 'Staff member not found', [], 404);
    const entry = {
      month: month || 'Current Month',
      amount: Number(amount) || member.monthlySalary,
      paidDate: new Date().toISOString().split('T')[0],
      mode,
      refNo,
      status: 'PAID',
    };
    member.salaryLedger.unshift(entry);
    return sendSuccess(res, 'Salary recorded successfully', { member, entry });
  },

  // ── Unified Attendance Check-In / Check-Out ──
  async listAttendance(_req, res) {
    return sendSuccess(res, 'Attendance retrieved', { total: UNIFIED_ATTENDANCE.length, attendance: UNIFIED_ATTENDANCE });
  },
  async punchAttendance(req, res) {
    const { personId, name, userType = 'EMPLOYEE', status = 'PRESENT', notes = '' } = req.body;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    // Check if already checked in today
    let record = UNIFIED_ATTENDANCE.find((a) => a.personId === personId && a.date === dateStr);
    if (record) {
      record.checkOut = timeStr;
      record.notes = notes || record.notes;
      return sendSuccess(res, `Check-out recorded at ${timeStr}`, record);
    }

    const newPunch = {
      id: `att_${Date.now()}`,
      personId: personId || `P-${Date.now().toString().slice(-4)}`,
      name: name || 'Staff Member',
      userType,
      date: dateStr,
      checkIn: timeStr,
      checkOut: '',
      status,
      hours: 'In Progress',
      notes,
    };
    UNIFIED_ATTENDANCE.unshift(newPunch);
    return sendSuccess(res, `Check-in recorded at ${timeStr}`, newPunch, 201);
  },
};
