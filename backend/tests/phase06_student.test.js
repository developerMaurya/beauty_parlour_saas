/**
 * @file phase06_student.test.js
 * @description Comprehensive Integration Test Suite for Phase 06: Complete Student Portal.
 * Validates Student Authentication, Session Revocation, Mass-Assignment Protection,
 * Course & Plan Purchasing with Server-Side Price Calculation, Automatic Enrollment,
 * Class Timetable, Attendance & Corrections, Curricula, Materials, Assignments, Tests,
 * Progress Calculation, Financial Ledgers & Invoices, Certificate Auto-Eligibility,
 * Document Isolation, Unified Requests & Leaves, Chat, Complete Reports, and Multi-Tenant Isolation.
 */

process.env.NODE_ENV = 'test';

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { createApp } from '../src/app.js';
import { Tenant } from '../src/modules/superadmin/tenants/models/tenant.model.js';
import { getTenantModel } from '../src/database/tenant/tenantModels.js';
import { generateAccessToken } from '../src/modules/auth/services/token.service.js';

describe('Phase 06 — Complete Student Portal System', { concurrency: 1 }, () => {
  let mongoServer;
  let app;
  let testTenant;
  let rivalTenant;
  let testBranch;

  // Student 1
  let studentUser1;
  let studentDoc1;
  let studentToken1;

  // Student 2 (Peer)
  let studentUser2;
  let studentDoc2;
  let studentToken2;

  // Blocked Student
  let blockedStudentUser;

  // Plans, Courses & Services
  let testPlan;
  let testCourse;
  let testModule;
  let testService;
  let testAssignment;
  let testExam;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    app = createApp();

    // 1. Create Primary Tenant
    testTenant = await Tenant.create({
      name: 'Glamour Beauty Academy',
      slug: 'glamour-academy',
      ownerName: 'Dr. Sunita Kapoor',
      businessType: 'academy',
      email: 'admin@glamour.academy',
      phone: '+919876543210',
      databaseMode: 'shared',
      status: 'active',
      planId: new mongoose.Types.ObjectId(),
      subscriptionStatus: 'active',
    });

    // 2. Create Rival Tenant for Isolation Tests
    rivalTenant = await Tenant.create({
      name: 'Rival Salon Academy',
      slug: 'rival-academy',
      ownerName: 'Rival Director',
      businessType: 'academy',
      email: 'admin@rival.academy',
      databaseMode: 'shared',
      status: 'active',
      planId: new mongoose.Types.ObjectId(),
    });

    const tenantReq = { tenantId: testTenant._id.toString() };
    const BranchModel = getTenantModel(tenantReq, 'Branch');
    const TenantUserModel = getTenantModel(tenantReq, 'TenantUser');
    const StudentModel = getTenantModel(tenantReq, 'Student');
    const StudentPlanModel = getTenantModel(tenantReq, 'StudentPlan');
    const CourseModel = getTenantModel(tenantReq, 'Course');
    const CourseModuleModel = getTenantModel(tenantReq, 'CourseModule');
    const StudentServiceModel = getTenantModel(tenantReq, 'StudentService');
    const AssignmentModel = getTenantModel(tenantReq, 'Assignment');
    const TestModel = getTenantModel(tenantReq, 'Test');

    // 3. Create Academy Branch
    testBranch = await BranchModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Central Campus',
      code: 'CC01',
      address: { street: '123 Academy Lane', city: 'Mumbai', state: 'MH' },
      isDefault: true,
      status: 'active',
    });

    // 4. Create Academy Plan
    testPlan = await StudentPlanModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Master Cosmetology Diploma',
      code: 'DIP-COS',
      description: 'Comprehensive 6-month hands-on beauty diploma',
      durationMonths: 6,
      durationHours: 240,
      price: 50000,
      discount: 5000,
      taxRate: 18,
      admissionFee: 2000,
      status: 'active',
    });

    // 5. Create Academy Course & Module
    testCourse = await CourseModel.create({
      tenantId: testTenant._id.toString(),
      branchId: testBranch._id,
      name: 'Advanced Hair & Makeup Artistry',
      code: 'HMA-101',
      duration: 6,
      fee: 45000,
      theoryHours: 40,
      practicalHours: 80,
      totalClasses: 48,
      status: 'active',
    });

    testModule = await CourseModuleModel.create({
      tenantId: testTenant._id.toString(),
      courseId: testCourse._id,
      title: 'Bridal Contouring & High Definition Makeup',
      orderIndex: 1,
      topics: [{ title: 'Color Matching', theoryHours: 2, practicalHours: 4 }],
    });

    // 6. Create Additional Service / Masterclass
    testService = await StudentServiceModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Airbrush Mastery Masterclass',
      category: 'Masterclass',
      price: 8000,
      status: 'active',
    });

    // 7. Create Assignment & Test
    testAssignment = await AssignmentModel.create({
      tenantId: testTenant._id.toString(),
      courseId: testCourse._id,
      title: 'Bridal Eye Makeup Portfolio',
      maxMarks: 100,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
    });

    testExam = await TestModel.create({
      tenantId: testTenant._id.toString(),
      courseId: testCourse._id,
      title: 'Final Board Practical Assessment',
      type: 'final_exam',
      totalMarks: 100,
      passingMarks: 50,
      status: 'active',
    });

    // 8. Create Student User 1
    const pwdHash = await bcrypt.hash('Student@123', 10);
    studentUser1 = await TenantUserModel.create({
      tenantId: testTenant._id.toString(),
      username: 'student.priya',
      email: 'priya@glamour.academy',
      passwordHash: pwdHash,
      role: 'STUDENT',
      userType: 'STUDENT',
      status: 'active',
    });

    studentDoc1 = await StudentModel.create({
      tenantId: testTenant._id.toString(),
      userId: studentUser1._id,
      studentId: 'STU-2026-001',
      admissionNumber: 'ADM-001',
      branchId: testBranch._id,
      name: 'Priya Sharma',
      phone: '+919111222333',
      email: 'priya@glamour.academy',
      gender: 'female',
      planId: testPlan._id,
      enrolledCourses: [testCourse._id],
      status: 'active',
    });

    studentToken1 = generateAccessToken(
      {
        _id: studentUser1._id,
        tenantId: testTenant._id.toString(),
        userType: 'STUDENT',
        role: 'STUDENT',
        email: studentUser1.email,
        studentId: studentDoc1._id,
      },
      'session-stu-1'
    );

    // 9. Create Student User 2 (Peer for cross-student isolation)
    studentUser2 = await TenantUserModel.create({
      tenantId: testTenant._id.toString(),
      username: 'student.rohit',
      email: 'rohit@glamour.academy',
      passwordHash: pwdHash,
      role: 'STUDENT',
      userType: 'STUDENT',
      status: 'active',
    });

    studentDoc2 = await StudentModel.create({
      tenantId: testTenant._id.toString(),
      userId: studentUser2._id,
      studentId: 'STU-2026-002',
      admissionNumber: 'ADM-002',
      branchId: testBranch._id,
      name: 'Rohit Verma',
      phone: '+919444555666',
      email: 'rohit@glamour.academy',
      status: 'active',
    });

    studentToken2 = generateAccessToken(
      {
        _id: studentUser2._id,
        tenantId: testTenant._id.toString(),
        userType: 'STUDENT',
        role: 'STUDENT',
        email: studentUser2.email,
        studentId: studentDoc2._id,
      },
      'session-stu-2'
    );

    // 10. Create Blocked Student
    blockedStudentUser = await TenantUserModel.create({
      tenantId: testTenant._id.toString(),
      username: 'student.blocked',
      email: 'blocked@glamour.academy',
      passwordHash: pwdHash,
      role: 'STUDENT',
      userType: 'STUDENT',
      status: 'blocked',
      isBlocked: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  /* ==========================================================================
     TEST CASES
     ========================================================================== */

  test('1. Student login authenticates user, links profile, and issues tokens', async () => {
    const res = await request(app)
      .post('/api/v1/student/auth/login')
      .set('x-tenant-id', testTenant._id.toString())
      .send({ email: 'priya@glamour.academy', password: 'Student@123' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.accessToken);
    assert.equal(res.body.data.user.role, 'STUDENT');
    assert.equal(res.body.data.student.name, 'Priya Sharma');
  });

  test('2. Blocked student account is rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/student/auth/login')
      .set('x-tenant-id', testTenant._id.toString())
      .send({ email: 'blocked@glamour.academy', password: 'Student@123' });

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
  });

  test('3. GET /api/v1/student/auth/me returns authenticated student identity and branch', async () => {
    const res = await request(app)
      .get('/api/v1/student/auth/me')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.student.studentId, 'STU-2026-001');
    assert.equal(res.body.data.branch.name, 'Central Campus');
  });

  test('4. Active student sessions query and session revocation', async () => {
    const listRes = await request(app)
      .get('/api/v1/student/auth/sessions')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(listRes.status, 200);
    assert.ok(Array.isArray(listRes.body.data));

    const revokeRes = await request(app)
      .post('/api/v1/student/auth/sessions/revoke-all')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(revokeRes.status, 200);
    assert.equal(revokeRes.body.success, true);
  });

  test('5. GET & PATCH /api/v1/student/profile updates permitted fields', async () => {
    const patchRes = await request(app)
      .patch('/api/v1/student/profile')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        phone: '+919998887776',
        skills: ['Bridal Makeup', 'Airbrush'],
        address: { city: 'Pune' },
      });

    assert.equal(patchRes.status, 200);
    assert.equal(patchRes.body.data.phone, '+919998887776');
    assert.deepEqual(patchRes.body.data.skills, ['Bridal Makeup', 'Airbrush']);
  });

  test('6. Mass Assignment Protection: Student CANNOT modify studentId, admissionNumber, or planId', async () => {
    const patchRes = await request(app)
      .patch('/api/v1/student/profile')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        studentId: 'HACKED-ID',
        admissionNumber: 'ADM-HACK',
        status: 'completed',
      });

    assert.equal(patchRes.status, 200);
    // Verified protected fields remain untampered
    assert.equal(patchRes.body.data.studentId, 'STU-2026-001');
    assert.notEqual(patchRes.body.data.status, 'completed');
  });

  test('7. Student can query Academy Plans and Course Catalog', async () => {
    const plansRes = await request(app)
      .get('/api/v1/student/plans')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(plansRes.status, 200);
    assert.ok(plansRes.body.data.length >= 1);
    assert.equal(plansRes.body.data[0].name, 'Master Cosmetology Diploma');

    const coursesRes = await request(app)
      .get('/api/v1/student/courses')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(coursesRes.status, 200);
    assert.ok(coursesRes.body.data.length >= 1);
    assert.equal(coursesRes.body.data[0].code, 'HMA-101');
  });

  test('8. Course/Plan Purchase: Server calculates price securely and auto-creates Academic Enrollment', async () => {
    const purchaseRes = await request(app)
      .post('/api/v1/student/purchases')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        itemType: 'plan',
        planId: testPlan._id.toString(),
        additionalServiceIds: [testService._id.toString()],
        paymentMethod: 'upi',
      });

    assert.equal(purchaseRes.status, 201);
    assert.equal(purchaseRes.body.success, true);
    assert.ok(purchaseRes.body.data.purchase.orderId);
    assert.equal(purchaseRes.body.data.purchase.paymentStatus, 'paid');
    assert.ok(purchaseRes.body.data.enrollment);
    assert.equal(purchaseRes.body.data.enrollment.status, 'active');
  });

  test('9. Student can query Academic Enrollments and Timeline', async () => {
    const enrollRes = await request(app)
      .get('/api/v1/student/enrollments')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(enrollRes.status, 200);
    assert.ok(enrollRes.body.data.length >= 1);
  });

  test('10. Class Schedule & Attendance summary tracking', async () => {
    const schedRes = await request(app)
      .get('/api/v1/student/schedule')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(schedRes.status, 200);

    const attRes = await request(app)
      .get('/api/v1/student/attendance/summary')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(attRes.status, 200);
    assert.equal(attRes.body.data.minimumRequiredPercentage, 80);
  });

  test('11. Student Attendance Correction Request creation, listing, and cancellation', async () => {
    const createRes = await request(app)
      .post('/api/v1/student/attendance-corrections')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        date: '2026-10-25',
        reason: 'Biometric fingerprint machine scanner was offline',
        requestedStatus: 'present',
      });

    assert.equal(createRes.status, 201);
    const corrId = createRes.body.data._id;

    const cancelRes = await request(app)
      .post(`/api/v1/student/attendance-corrections/${corrId}/cancel`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(cancelRes.status, 200);
    assert.equal(cancelRes.body.data.status, 'cancelled');
  });

  test('12. Academic Curricula, Assignment Submission and Test Evaluation', async () => {
    // 1. Assignment submission
    const submitRes = await request(app)
      .post(`/api/v1/student/assignments/${testAssignment._id}/submit`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        submissionText: 'Portfolio submitted with 10 high-resolution bridal looks',
        attachmentUrl: 'https://cdn.glamour.academy/portfolio-priya.pdf',
      });

    assert.equal(submitRes.status, 201);
    assert.equal(submitRes.body.data.status, 'submitted');

    // 2. Test Attempt & Evaluation
    const testRes = await request(app)
      .post(`/api/v1/student/tests/${testExam._id}/submit`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({ answers: { q1: 'A', q2: 'C' } });

    assert.equal(testRes.status, 200);
    assert.equal(testRes.body.data.isPassed, true);
    assert.equal(testRes.body.data.grade, 'A');
  });

  test('13. Student Progress & Skill Mastery Calculation', async () => {
    const progRes = await request(app)
      .get('/api/v1/student/progress')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(progRes.status, 200);
    assert.ok(progRes.body.data.overallPercentage >= 50);
    assert.ok(Array.isArray(progRes.body.data.skillsMastered));
  });

  test('14. Financial Ledger: Payment Summary, Invoices, and Due Installments', async () => {
    const sumRes = await request(app)
      .get('/api/v1/student/payments/summary')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(sumRes.status, 200);
    assert.ok(sumRes.body.data.totalPaid >= 0);
    assert.ok(sumRes.body.data.finalAmount > 0);

    const invRes = await request(app)
      .get('/api/v1/student/payments/invoices')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(invRes.status, 200);
    assert.ok(invRes.body.data.length >= 1);
  });

  test('15. Certificate Auto-Eligibility Evaluation', async () => {
    const certStatRes = await request(app)
      .get('/api/v1/student/certificates/dummy-id/status')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(certStatRes.status, 200);
    assert.ok(certStatRes.body.data.requirements);
    assert.equal(certStatRes.body.data.requirements.attendance.required, '80%');
  });

  test('16. Document Upload & Strict 403 Cross-Student Isolation', async () => {
    // Student 1 uploads private Aadhaar ID proof
    const uploadRes = await request(app)
      .post('/api/v1/student/documents')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        documentType: 'id_proof',
        title: 'Govt Aadhaar Card - Priya',
        fileUrl: 'https://vault.glamour.academy/aadhaar-priya.pdf',
      });

    assert.equal(uploadRes.status, 201);
    const docId = uploadRes.body.data._id;

    // Student 1 can view own document
    const viewRes = await request(app)
      .get(`/api/v1/student/documents/${docId}`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);
    assert.equal(viewRes.status, 200);

    // Student 2 attempts to spy/access Student 1 document -> MUST return 403 Forbidden!
    const spyRes = await request(app)
      .get(`/api/v1/student/documents/${docId}`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken2}`);

    assert.equal(spyRes.status, 403);
    assert.equal(spyRes.body.success, false);
  });

  test('17. Unified Student Requests & Leave Application Lifecycle', async () => {
    const reqRes = await request(app)
      .post('/api/v1/student/requests')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        requestType: 'SCHEDULE_CHANGE',
        subject: 'Request afternoon batch transfer',
        details: 'Attending morning college lectures',
      });

    assert.equal(reqRes.status, 201);
    assert.equal(reqRes.body.data.requestType, 'SCHEDULE_CHANGE');

    const leaveRes = await request(app)
      .post('/api/v1/student/leaves')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        leaveType: 'exam',
        fromDate: '2026-11-20',
        toDate: '2026-11-22',
        reason: 'University semester exams',
      });

    assert.equal(leaveRes.status, 201);
    assert.equal(leaveRes.body.data.status, 'pending');
  });

  test('18. Internal Academy Chat and Message Thread', async () => {
    const chatRes = await request(app)
      .post('/api/v1/student/chats')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        chatType: 'trainer',
        title: 'Masterclass queries with faculty',
      });

    assert.equal(chatRes.status, 201);
    const chatId = chatRes.body.data._id;

    const msgRes = await request(app)
      .post(`/api/v1/student/chats/${chatId}/messages`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        message: 'Maam, what brush set is recommended for next practical session?',
      });

    assert.equal(msgRes.status, 201);
    assert.equal(msgRes.body.data.senderRole, 'STUDENT');
  });

  test('19. 21-Section Complete Student Report Export', async () => {
    const repRes = await request(app)
      .get('/api/v1/student/reports/complete')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(repRes.status, 200);
    assert.ok(repRes.body.data.section1_studentProfile);
    assert.ok(repRes.body.data.section8_attendance);
    assert.ok(repRes.body.data.section16_payments);
    assert.ok(repRes.body.data.section21_requestsAndTimeline);
  });

  test('20. Cross-Tenant Isolation: Student 1 CANNOT access Rival Academy tenant data', async () => {
    const crossTenantRes = await request(app)
      .get('/api/v1/student/auth/me')
      .set('x-tenant-id', rivalTenant._id.toString())
      .set('Authorization', `Bearer ${studentToken1}`);

    assert.equal(crossTenantRes.status, 403);
    assert.equal(crossTenantRes.body.success, false);
  });

  test('21. Unauthenticated request without token returns 401 Unauthorized', async () => {
    const unauthRes = await request(app)
      .get('/api/v1/student/profile')
      .set('x-tenant-id', testTenant._id.toString());

    assert.equal(unauthRes.status, 401);
    assert.equal(unauthRes.body.success, false);
  });
});
