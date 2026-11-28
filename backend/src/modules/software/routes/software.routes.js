/**
 * @file software.routes.js
 * @description Dedicated Multi-Tenant Software SaaS Routes under /api/v1/kashi/software/*
 * @module backend/src/modules/software/routes/software.routes
 */

import { Router } from 'express';
import { softwareController } from '../controllers/software.controller.js';
import { softwareHubController } from '../controllers/softwareHub.controller.js';
import { groceryController } from '../grocery/grocery.controller.js';
import { instituteController } from '../institute/institute.controller.js';
import { electronicsController } from '../electronics/electronics.controller.js';
import { boutiqueController } from '../boutique/boutique.controller.js';

const router = Router();

// ── Categories & Services CRUD ──
router.get('/categories', softwareHubController.listCategories);
router.post('/categories', softwareHubController.createCategory);
router.delete('/categories/:id', softwareHubController.deleteCategory);

router.get('/services', softwareHubController.listServices);
router.post('/services', softwareHubController.createService);
router.delete('/services/:id', softwareHubController.deleteService);

// ── Projects Portfolio CRUD ──
router.get('/projects', softwareHubController.listProjects);
router.post('/projects', softwareHubController.createProject);
router.delete('/projects/:id', softwareHubController.deleteProject);

// ── Client Inquiries CRUD ──
router.get('/inquiries', softwareHubController.listInquiries);
router.post('/inquiries', softwareHubController.createInquiry);
router.patch('/inquiries/:id/status', softwareHubController.updateInquiryStatus);

// ── Computer Academy Courses & Enrollment ──
router.get('/courses', softwareHubController.listCourses);
router.post('/courses', softwareHubController.createCourse);
router.get('/students', softwareHubController.listStudents);
router.post('/students/enroll', softwareHubController.enrollStudent);
router.post('/students/:studentId/pay-fee', softwareHubController.recordStudentFeePayment);
router.get('/certificates', softwareHubController.listCertificates);
router.post('/certificates/issue', softwareHubController.issueCertificate);

// ── Professional Internship CRM & Letters ──
router.get('/internship-tracks', softwareHubController.listInternshipTracks);
router.post('/internship-tracks', softwareHubController.createInternshipTrack);
router.get('/interns', softwareHubController.listInterns);
router.post('/interns/enroll', softwareHubController.enrollIntern);
router.post('/interns/:internId/relieving-letter', softwareHubController.issueInternRelievingLetter);

// ── Trainers & Staff Salary Ledger ──
router.get('/staff', softwareHubController.listStaff);
router.post('/staff/:staffId/pay-salary', softwareHubController.recordStaffSalary);

// ── Unified Multi-Role Attendance ──
router.get('/attendance', softwareHubController.listAttendance);
router.post('/attendance/punch', softwareHubController.punchAttendance);

// ── Master software suite overview & legacy sub-verticals ──
router.get('/overview', softwareController.listVerticals);
router.get('/verticals', softwareController.listVerticals);
router.get('/verticals/:id', softwareController.getVerticalDetails);

// Grocery & Supermarket Cloud POS
router.get('/grocery/inventory', groceryController.getInventory);
router.post('/grocery/scan-barcode', groceryController.scanBarcode);

// Computer Institute & Academy LMS
router.get('/institute/batches', instituteController.getBatches);
router.post('/institute/issue-certificate', instituteController.issueCertificate);

// Electronics & Mobile Repair ERP
router.get('/electronics/job-cards', electronicsController.getJobCards);
router.post('/electronics/track-warranty', electronicsController.trackImeiWarranty);

// Designer Boutique & Custom Tailoring ERP
router.get('/boutique/orders', boutiqueController.getOrders);
router.post('/boutique/update-status', boutiqueController.updateGarmentStatus);

export default router;
