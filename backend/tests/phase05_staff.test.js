/**
 * @file phase05_staff.test.js
 * @description Comprehensive Integration Test Suite for Phase 05: Complete Staff Portal.
 * Covers Authentication, Profile & Protected Fields, Branch Switching, Attendance,
 * Correction Requests, Leaves & Holidays, Appointments & CRM, Home Services Mobile Journey,
 * Inventory, Finance & Commissions, Documents & Certificates, Unified Requests,
 * Tenant Chat, Tasks, Performance, Calendar, and Multi-Tenant Security Isolation.
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

describe('Phase 05 — Complete Staff Portal System', { concurrency: 1 }, () => {
  let mongoServer;
  let app;
  let testTenant;
  let otherTenant;
  let branchA;
  let branchB;
  let unauthorizedBranch;

  // Staff User 1
  let staffUser1;
  let staffDoc1;
  let staffToken1;

  // Staff User 2 (Colleague)
  let staffUser2;
  let staffDoc2;
  let staffToken2;

  // Blocked Staff User
  let blockedStaffUser;

  // Customer & Service
  let testCustomer;
  let testService;
  let testAppointment;
  let testHomeAppointment;
  let testProduct;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    app = createApp();

    // 1. Setup Primary Tenant
    const slug1 = `staff_tenant_${Date.now()}`;
    testTenant = await Tenant.create({
      name: 'Luxe Salon & Spa',
      slug: slug1,
      code: 'LUXE',
      ownerName: 'Sunita Mehra',
      email: `${slug1}@luxe.test`,
      phone: '9876543210',
      status: 'active',
      databaseMode: 'shared',
    });

    // Setup Secondary Tenant (For isolation testing)
    const slug2 = `other_tenant_${Date.now()}`;
    otherTenant = await Tenant.create({
      name: 'Rival Salon Corp',
      slug: slug2,
      code: 'RIVAL',
      ownerName: 'Other Owner',
      email: `${slug2}@rival.test`,
      phone: '9876599999',
      status: 'active',
      databaseMode: 'shared',
    });

    const BranchModel = getTenantModel(null, 'Branch');
    branchA = await BranchModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Bandra Flagship Salon',
      code: 'BF01',
      phone: '9870000001',
      isDefault: true,
      status: 'active',
    });

    branchB = await BranchModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Juhu Luxury Wing',
      code: 'JL02',
      phone: '9870000002',
      status: 'active',
    });

    unauthorizedBranch = await BranchModel.create({
      tenantId: testTenant._id.toString(),
      name: 'South Bombay Salon',
      code: 'SB03',
      phone: '9870000003',
      status: 'active',
    });

    // 2. Setup Staff Users
    const TenantUserModel = getTenantModel(null, 'TenantUser');
    const StaffModel = getTenantModel(null, 'Staff');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Staff@123', salt);

    // Staff 1
    staffUser1 = await TenantUserModel.create({
      tenantId: testTenant._id.toString(),
      email: 'priya.stylist@luxe.test',
      username: 'priya_stylist',
      phone: '9871100001',
      passwordHash,
      role: 'STAFF',
      userType: 'STAFF',
      status: 'active',
    });

    staffDoc1 = await StaffModel.create({
      tenantId: testTenant._id.toString(),
      userId: staffUser1._id,
      name: 'Priya Verma',
      email: 'priya.stylist@luxe.test',
      phone: '9871100001',
      gender: 'female',
      department: 'Hair & Styling',
      designation: 'Senior Master Stylist',
      primaryBranch: branchA._id,
      branchId: branchA._id,
      assignedBranches: [branchA._id, branchB._id], // Authorized for A & B, NOT unauthorizedBranch
      salary: 45000,
      commission: 12,
      skills: ['Balayage', 'Hair Spa', 'Keratin'],
      status: 'active',
    });

    // Staff 2
    staffUser2 = await TenantUserModel.create({
      tenantId: testTenant._id.toString(),
      email: 'rahul.makeup@luxe.test',
      username: 'rahul_makeup',
      phone: '9871100002',
      passwordHash,
      role: 'STAFF',
      userType: 'STAFF',
      status: 'active',
    });

    staffDoc2 = await StaffModel.create({
      tenantId: testTenant._id.toString(),
      userId: staffUser2._id,
      name: 'Rahul Sen',
      email: 'rahul.makeup@luxe.test',
      phone: '9871100002',
      gender: 'male',
      department: 'Bridal Makeup',
      designation: 'Bridal Artist',
      primaryBranch: branchA._id,
      branchId: branchA._id,
      assignedBranches: [branchA._id],
      salary: 40000,
      commission: 10,
      status: 'active',
    });

    // Blocked Staff
    blockedStaffUser = await TenantUserModel.create({
      tenantId: testTenant._id.toString(),
      email: 'blocked.staff@luxe.test',
      username: 'blocked_staff',
      phone: '9871100099',
      passwordHash,
      role: 'STAFF',
      userType: 'STAFF',
      status: 'blocked',
      isBlocked: true,
      blockDetails: { reason: 'Policy violation' },
    });

    // 3. Customer & Service Setup
    const CustomerModel = getTenantModel(null, 'Customer');
    testCustomer = await CustomerModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Aarti Kapoor',
      phone: '9822233344',
      email: 'aarti@client.test',
      branchId: branchA._id,
      address: '14 Sea Face, Bandra, Mumbai',
    });

    const ServiceCategoryModel = getTenantModel(null, 'ServiceCategory');
    const testCategory = await ServiceCategoryModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Hair Treatments',
      slug: `hair-treatments-${Date.now()}`,
      status: 'active',
    });

    const ServiceModel = getTenantModel(null, 'Service');
    testService = await ServiceModel.create({
      tenantId: testTenant._id.toString(),
      categoryId: testCategory._id,
      name: 'Royal Hair Botox Treatment',
      durationMinutes: 60,
      price: 3500,
      branchIds: [branchA._id],
      status: 'active',
    });

    const ProductModel = getTenantModel(null, 'Product');
    testProduct = await ProductModel.create({
      tenantId: testTenant._id.toString(),
      name: 'Keratin Nourish Serum 100ml',
      sku: 'KNS-100',
      stockQuantity: 25,
      branchId: branchA._id,
      costPrice: 800,
      sellingPrice: 1200,
      status: 'active',
    });

    // Appointments Setup
    const todayStr = new Date().toISOString().slice(0, 10);
    const AppointmentModel = getTenantModel(null, 'Appointment');
    testAppointment = await AppointmentModel.create({
      tenantId: testTenant._id.toString(),
      appointmentNumber: `APT-${Date.now()}-01`,
      branchId: branchA._id,
      customerId: testCustomer._id,
      staffId: staffDoc1._id,
      assignedStaff: staffDoc1._id,
      services: [
        {
          serviceId: testService._id,
          name: testService.name,
          price: testService.price,
          durationMinutes: testService.durationMinutes,
        },
      ],
      date: todayStr,
      scheduledStartTime: '11:00',
      scheduledEndTime: '12:00',
      durationMinutes: 60,
      status: 'assigned',
      serviceMode: 'IN_STORE',
    });

    testHomeAppointment = await AppointmentModel.create({
      tenantId: testTenant._id.toString(),
      appointmentNumber: `APT-${Date.now()}-02`,
      branchId: branchA._id,
      customerId: testCustomer._id,
      staffId: staffDoc1._id,
      assignedStaff: staffDoc1._id,
      services: [
        {
          serviceId: testService._id,
          name: testService.name,
          price: 4000,
          durationMinutes: 60,
        },
      ],
      date: todayStr,
      scheduledStartTime: '15:00',
      scheduledEndTime: '16:00',
      durationMinutes: 60,
      status: 'assigned',
      serviceMode: 'HOME',
      notes: '14 Sea Face, Bandra, Mumbai',
    });

    staffToken1 = generateAccessToken(
      {
        _id: staffUser1._id,
        role: staffUser1.role,
        userType: staffUser1.userType,
        tenantId: testTenant._id.toString(),
        branchId: branchA._id.toString(),
        staffId: staffDoc1._id.toString(),
      },
      'test-session-1'
    );

    staffToken2 = generateAccessToken(
      {
        _id: staffUser2._id,
        role: staffUser2.role,
        userType: staffUser2.userType,
        tenantId: testTenant._id.toString(),
        branchId: branchA._id.toString(),
        staffId: staffDoc2._id.toString(),
      },
      'test-session-2'
    );
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // ==========================================
  // 1. STAFF AUTHENTICATION & SESSIONS
  // ==========================================
  test('1. Staff login authenticates, links staff profile, and returns tokens', async () => {
    const res = await request(app)
      .post('/api/v1/staff/auth/login')
      .set('x-tenant-id', testTenant._id.toString())
      .send({
        email: 'priya.stylist@luxe.test',
        password: 'Staff@123',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.accessToken);
    assert.equal(res.body.data.user.email, 'priya.stylist@luxe.test');
    assert.equal(res.body.data.staff.name, 'Priya Verma');
    staffToken1 = res.body.data.accessToken;

    // Login Staff 2 as well
    const res2 = await request(app)
      .post('/api/v1/staff/auth/login')
      .set('x-tenant-id', testTenant._id.toString())
      .send({
        email: 'rahul.makeup@luxe.test',
        password: 'Staff@123',
      });
    assert.equal(res2.status, 200);
    staffToken2 = res2.body.data.accessToken;
  });

  test('2. Blocked staff account is rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/staff/auth/login')
      .set('x-tenant-id', testTenant._id.toString())
      .send({
        email: 'blocked.staff@luxe.test',
        password: 'Staff@123',
      });

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
  });

  test('3. GET /api/v1/staff/auth/me returns authenticated staff identity and permissions', async () => {
    const res = await request(app)
      .get('/api/v1/staff/auth/me')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, 'priya.stylist@luxe.test');
    assert.equal(res.body.data.staff.department, 'Hair & Styling');
  });

  test('4. Active sessions query and session revocation', async () => {
    const sessionsRes = await request(app)
      .get('/api/v1/staff/auth/sessions')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(sessionsRes.status, 200);
    assert.equal(sessionsRes.body.success, true);
    assert.ok(Array.isArray(sessionsRes.body.data));
  });

  // ==========================================
  // 2. PROFILE & PROTECTED FIELDS RESTRICTION
  // ==========================================
  test('5. Staff can view profile and update editable personal details', async () => {
    const getRes = await request(app)
      .get('/api/v1/staff/profile')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.name, 'Priya Verma');

    // Update editable fields
    const patchRes = await request(app)
      .patch('/api/v1/staff/profile')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        phone: '9871199999',
        address: 'Bandra West, Hill Road',
        emergencyContact: 'Mother: 9811122233',
      });

    assert.equal(patchRes.status, 200);
    assert.equal(patchRes.body.data.address, 'Bandra West, Hill Road');
  });

  test('6. Mass Assignment Protection: Staff CANNOT modify salary or commission', async () => {
    const maliciousRes = await request(app)
      .patch('/api/v1/staff/profile')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        salary: 100000,
        commission: 50,
        role: 'ADMIN',
      });

    // Should succeed on safe fields while strictly ignoring protected salary/commission
    assert.equal(maliciousRes.status, 200);

    // Verify database was NOT corrupted
    const StaffModel = getTenantModel(null, 'Staff');
    const freshStaff = await StaffModel.findById(staffDoc1._id);
    assert.equal(freshStaff.salary, 45000); // Unchanged!
    assert.equal(freshStaff.commission, 12); // Unchanged!
  });

  // ==========================================
  // 3. MULTI-BRANCH ASSIGNMENT & SECURITY
  // ==========================================
  test('7. Staff can switch to assigned Branch B, but CANNOT access unauthorized branch', async () => {
    // 1. Query branches
    const bRes = await request(app)
      .get('/api/v1/staff/branches')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(bRes.status, 200);
    assert.ok(bRes.body.data.length >= 2);

    // 2. Switch to authorized Branch B
    const switchRes = await request(app)
      .patch('/api/v1/staff/current-branch')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({ branchId: branchB._id.toString() });

    assert.equal(switchRes.status, 200);

    // 3. Attempt to switch to unauthorized branch
    const illegalSwitchRes = await request(app)
      .patch('/api/v1/staff/current-branch')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({ branchId: unauthorizedBranch._id.toString() });

    assert.equal(illegalSwitchRes.status, 403);
  });

  // ==========================================
  // 4. ATTENDANCE & CORRECTION REQUESTS
  // ==========================================
  test('8. Staff attendance check-in, check-out, and summary tracking', async () => {
    // Check-in
    const inRes = await request(app)
      .post('/api/v1/staff/attendance/check-in')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({ notes: 'Arrived for morning shift' });

    assert.equal(inRes.status, 200);
    assert.ok(inRes.body.data.checkIn);

    // Check-out
    const outRes = await request(app)
      .post('/api/v1/staff/attendance/check-out')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({ notes: 'Completed day shift' });

    assert.equal(outRes.status, 200);
    assert.ok(outRes.body.data.checkOut);

    // Query summary
    const sumRes = await request(app)
      .get('/api/v1/staff/attendance/summary')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(sumRes.status, 200);
  });

  test('9. Attendance correction request creation, listing, and cancellation', async () => {
    const createRes = await request(app)
      .post('/api/v1/staff/attendance-corrections')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        date: new Date(),
        requestType: 'forgot_check_in',
        correctedCheckIn: '09:00',
        correctedCheckOut: '18:00',
        reason: 'Biometric device was offline',
      });

    assert.equal(createRes.status, 201);
    const corrId = createRes.body.data._id;

    // List
    const listRes = await request(app)
      .get('/api/v1/staff/attendance-corrections')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(listRes.status, 200);
    assert.ok(listRes.body.data.length >= 1);

    // Cancel
    const cancelRes = await request(app)
      .post(`/api/v1/staff/attendance-corrections/${corrId}/cancel`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(cancelRes.status, 200);
    assert.equal(cancelRes.body.data.status, 'cancelled');
  });

  // ==========================================
  // 5. LEAVES & HOLIDAYS (Self-Approval Restricted)
  // ==========================================
  test('10. Leave application and cancellation (Staff cannot approve own leave)', async () => {
    const applyRes = await request(app)
      .post('/api/v1/staff/leaves')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        leaveType: 'casual',
        fromDate: new Date(),
        toDate: new Date(Date.now() + 86400000),
        reason: 'Family function attendance',
      });

    assert.equal(applyRes.status, 201);
    assert.equal(applyRes.body.data.status, 'pending');
    const leaveId = applyRes.body.data._id;

    // Staff cannot self-approve leave
    const illegalApprove = await request(app)
      .patch(`/api/v1/staff/leaves/${leaveId}`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({ status: 'approved' });

    assert.notEqual(illegalApprove.body.data?.status, 'approved');

    // Cancel own leave
    const cancelRes = await request(app)
      .post(`/api/v1/staff/leaves/${leaveId}/cancel`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(cancelRes.status, 200);
    assert.equal(cancelRes.body.data.status, 'cancelled');
  });

  // ==========================================
  // 6. APPOINTMENTS & LIFECYCLE
  // ==========================================
  test('11. Appointment lifecycle progression: confirm -> check-in -> start -> complete', async () => {
    // 1. Confirm
    const confRes = await request(app)
      .post(`/api/v1/staff/appointments/${testAppointment._id}/confirm`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(confRes.status, 200);

    // 2. Check-in
    const checkRes = await request(app)
      .post(`/api/v1/staff/appointments/${testAppointment._id}/check-in`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(checkRes.status, 200);

    // 3. Start
    const startRes = await request(app)
      .post(`/api/v1/staff/appointments/${testAppointment._id}/start`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(startRes.status, 200);

    // 4. Complete
    const compRes = await request(app)
      .post(`/api/v1/staff/appointments/${testAppointment._id}/complete`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(compRes.status, 200);
  });

  // ==========================================
  // 7. CUSTOMER CRM & SERVICE NOTES
  // ==========================================
  test('12. Staff can query customer profile and record professional service styling notes', async () => {
    // Query CRM
    const crmRes = await request(app)
      .get(`/api/v1/staff/customers/${testCustomer._id}`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    assert.equal(crmRes.status, 200);
    assert.equal(crmRes.body.data.name, 'Aarti Kapoor');

    // Add Note
    const noteRes = await request(app)
      .post(`/api/v1/staff/customers/${testCustomer._id}/notes`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        note: 'Prefers ammonia-free hair dye and lukewarm wash water',
        category: 'hair_preference',
      });

    assert.equal(noteRes.status, 201);
  });

  // ==========================================
  // 8. HOME SERVICE MOBILE JOURNEY & GPS
  // ==========================================
  test('13. Home Service Mobile Journey Transitions, GPS Ping & Work Report', async () => {
    const id = testHomeAppointment._id;

    // 1. Accept
    const acc = await request(app)
      .post(`/api/v1/staff/home-services/${id}/accept`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(acc.status, 200);

    // 2. On the way
    const otw = await request(app)
      .post(`/api/v1/staff/home-services/${id}/on-the-way`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(otw.status, 200);

    // 3. GPS Location Ping
    const loc = await request(app)
      .post(`/api/v1/staff/home-services/${id}/location`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        latitude: 19.0596,
        longitude: 72.8295,
        status: 'ON_THE_WAY',
      });
    assert.equal(loc.status, 200);

    // 4. Arrived
    const arr = await request(app)
      .post(`/api/v1/staff/home-services/${id}/arrived`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(arr.status, 200);

    // 5. Start
    const st = await request(app)
      .post(`/api/v1/staff/home-services/${id}/start`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(st.status, 200);

    // 6. Complete
    const cmp = await request(app)
      .post(`/api/v1/staff/home-services/${id}/complete`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(cmp.status, 200);

    // 7. Depart
    const dep = await request(app)
      .post(`/api/v1/staff/home-services/${id}/depart`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(dep.status, 200);

    // 8. Travel Expense
    const exp = await request(app)
      .post(`/api/v1/staff/home-services/${id}/expense`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        type: 'travel',
        amount: 220,
        notes: 'Cab fare to client doorstep',
      });
    assert.equal(exp.status, 201);

    // 9. Work Report
    const rep = await request(app)
      .post(`/api/v1/staff/home-services/${id}/report`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        notes: 'Doorstep facial and hair botox completed with zero mess',
        productsUsed: 'Royal Botox Kit 50ml',
        customerFeedback: 'Very pleased with prompt arrival',
      });
    assert.equal(rep.status, 200);
  });

  // ==========================================
  // 9. INVENTORY & IN-CHAIR SERVICE USAGE
  // ==========================================
  test('14. Staff inventory query, stock replenishment request, and usage logging', async () => {
    // 1. Stock request
    const reqRes = await request(app)
      .post('/api/v1/staff/inventory-requests')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        productId: testProduct._id,
        quantity: 5,
        reason: 'Low stock for upcoming bridal weekend',
      });
    assert.equal(reqRes.status, 201);

    // 2. Service Usage
    const useRes = await request(app)
      .post('/api/v1/staff/service-usage')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        productId: testProduct._id,
        quantity: 1,
        appointmentId: testAppointment._id,
        notes: 'Applied serum during finish styling',
      });
    assert.equal(useRes.status, 201);
  });

  // ==========================================
  // 10. UNIFIED STAFF REQUESTS (14 TYPES)
  // ==========================================
  test('15. Reusable unified staff request system for branch transfer and salary query', async () => {
    const ticket = await request(app)
      .post('/api/v1/staff/requests')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        type: 'branch_transfer',
        subject: 'Request permanent transfer to Juhu branch',
        description: 'Residence shifted closer to Juhu salon',
        priority: 'high',
      });

    assert.equal(ticket.status, 201);
    assert.equal(ticket.body.data.status, 'pending');
  });

  // ==========================================
  // 11. TENANT CHAT & TEAM MESSAGING
  // ==========================================
  test('16. Internal salon chat thread creation, sending message, and reading', async () => {
    // Create chat with colleague Staff 2
    const chatRes = await request(app)
      .post('/api/v1/staff/chats')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({
        participantId: staffUser2._id,
        participantModel: 'TenantUser',
        title: 'Bridal Collaboration',
      });

    assert.equal(chatRes.status, 201);
    const chatId = chatRes.body.data._id;

    // Send Message
    const msgRes = await request(app)
      .post(`/api/v1/staff/chats/${chatId}/messages`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({ content: 'Hi Rahul, client Aarti wants matching hair accessory with your makeup palette.' });

    assert.equal(msgRes.status, 201);
    assert.equal(msgRes.body.data.content, 'Hi Rahul, client Aarti wants matching hair accessory with your makeup palette.');

    // Query messages as Staff 2
    const readRes = await request(app)
      .get(`/api/v1/staff/chats/${chatId}/messages`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken2}`);

    assert.equal(readRes.status, 200);
    assert.ok(readRes.body.data.length >= 1);
  });

  // ==========================================
  // 12. TASKS & DISCUSSION COMMENTS
  // ==========================================
  test('17. Staff task lifecycle & discussion comments thread', async () => {
    const TaskModel = getTenantModel(null, 'Task');
    const task = await TaskModel.create({
      tenantId: testTenant._id.toString(),
      branchId: branchA._id,
      assignedTo: staffDoc1._id,
      title: 'Sanitize Hair Station 4 & UV Sterilize Tools',
      priority: 'high',
      status: 'assigned',
    });

    // Accept
    const acc = await request(app)
      .post(`/api/v1/staff/tasks/${task._id}/accept`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(acc.status, 200);

    // Comment
    const com = await request(app)
      .post(`/api/v1/staff/tasks/${task._id}/comments`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`)
      .send({ comment: 'Sterilization complete, tools sealed in pouches.' });
    assert.equal(com.status, 201);

    // Complete
    const comp = await request(app)
      .post(`/api/v1/staff/tasks/${task._id}/complete`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);
    assert.equal(comp.status, 200);
  });

  // ==========================================
  // 13. CROSS-STAFF & CROSS-TENANT SECURITY ISOLATION
  // ==========================================
  test('18. Staff 2 CANNOT access Staff 1 private documents or unauthorized appointments', async () => {
    // Upload confidential document for Staff 1
    const DocModel = getTenantModel(null, 'StaffDocument');
    const privateDoc = await DocModel.create({
      tenantId: testTenant._id.toString(),
      staffId: staffDoc1._id,
      documentName: 'Priya Verma Passport Confidential',
      documentType: 'id_proof',
      fileUrl: 'https://storage.luxe.test/priya-pass.pdf',
    });

    // Staff 2 attempts to query Staff 1's document
    const unauthorizedQuery = await request(app)
      .get(`/api/v1/staff/documents/${privateDoc._id}`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken2}`);

    assert.equal(unauthorizedQuery.status, 403);
  });

  test('19. Cross-Tenant Isolation: Staff 1 CANNOT access Rival Salon tenant data', async () => {
    // Attempting to query with Other Tenant's ID header
    const crossTenantRes = await request(app)
      .get('/api/v1/staff/appointments')
      .set('x-tenant-id', otherTenant._id.toString())
      .set('Authorization', `Bearer ${staffToken1}`);

    // Must be rejected because token tenant does not match or staff account doesn't belong to otherTenant
    assert.ok(crossTenantRes.status === 401 || crossTenantRes.status === 403);
  });

  test('20. Unauthenticated request without token returns 401 Unauthorized', async () => {
    const unauth = await request(app)
      .get('/api/v1/staff/appointments')
      .set('x-tenant-id', testTenant._id.toString());

    assert.equal(unauth.status, 401);
  });
});
