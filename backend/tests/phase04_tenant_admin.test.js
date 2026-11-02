/**
 * @file phase04_tenant_admin.test.js
 * @description Comprehensive Integration Test Suite for Phase 04: Complete Dynamic Tenant Admin System.
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

describe('Phase 04 — Complete Dynamic Tenant Admin System', () => {
  let mongoServer;
  let app;
  let testTenant;
  let adminUser;
  let adminToken;
  let defaultBranch;
  let secondaryBranch;
  let testStaff;
  let testCustomer;
  let testService;
  let testProduct;
  let testAppointment;
  let testHomeAppointment;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    app = createApp();

    // 1. Setup Test Tenant
    const slug = `tenant_admin_${Date.now()}`;
    testTenant = await Tenant.create({
      name: 'Glamour Luxury Salon & Academy',
      slug,
      code: 'GLAMOUR',
      ownerName: 'Sunita Verma',
      email: `${slug}@glamour.test`,
      phone: '9876543210',
      status: 'active',
      databaseMode: 'shared',
      limits: {
        maxStaff: 3,
        maxBranches: 2,
        maxAppointmentsMonthly: 100,
      },
    });

    // 2. Setup Tenant Admin User
    const TenantUser = getTenantModel(null, 'TenantUser');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    adminUser = await TenantUser.create({
      tenantId: testTenant._id.toString(),
      email: 'admin@glamour.test',
      username: 'glamour_admin',
      phone: '9876543210',
      passwordHash,
      role: 'ADMIN',
      status: 'active',
    });
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
  // TEST 1: Tenant Admin Login
  // ==========================================
  test('1. Tenant Admin login authenticates user and returns JWT access token', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .set('x-tenant-id', testTenant._id.toString())
      .send({
        identifier: 'admin@glamour.test',
        password: 'Admin@123',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.accessToken);
    assert.equal(res.body.data.user.role, 'ADMIN');

    adminToken = res.body.data.accessToken;
  });

  // ==========================================
  // TEST 2: Branch Management & Default Branch
  // ==========================================
  test('2. Admin can create branches and set default branch', async () => {
    // Branch A
    const resA = await request(app)
      .post('/api/v1/admin/branches')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Downtown Flagship Branch',
        code: 'DT01',
        phone: '9876500001',
        address: { city: 'Mumbai', street: 'MG Road' },
        openingTime: '09:00',
        closingTime: '21:00',
        isDefault: true,
      });

    assert.equal(resA.status, 201);
    assert.equal(resA.body.data.name, 'Downtown Flagship Branch');
    assert.equal(resA.body.data.isDefault, true);
    defaultBranch = resA.body.data;

    // Branch B
    const resB = await request(app)
      .post('/api/v1/admin/branches')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Westside Boutique Branch',
        code: 'WB02',
        phone: '9876500002',
        address: { city: 'Mumbai', street: 'Linking Road' },
        openingTime: '10:00',
        closingTime: '20:00',
      });

    assert.equal(resB.status, 201);
    secondaryBranch = resB.body.data;

    // Verify Plan Limit for Branches (limit is 2)
    const resC = await request(app)
      .post('/api/v1/admin/branches')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Third Branch Exceeding Quota',
        code: 'TB03',
      });

    assert.equal(resC.status, 403);
    assert.equal(resC.body.code, 'PLAN_LIMIT_EXCEEDED');
  });

  // ==========================================
  // TEST 3: Dynamic Organizational Structure
  // ==========================================
  test('3. Dynamic Departments, Designations, and Skills CRUD', async () => {
    // 1. Department
    const deptRes = await request(app)
      .post('/api/v1/admin/departments')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Bridal & Makeup Artistry',
        description: 'Specialized bridal glam and event makeup wing',
      });
    assert.equal(deptRes.status, 201);
    const deptId = deptRes.body.data._id;

    // 2. Designation
    const desigRes = await request(app)
      .post('/api/v1/admin/designations')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        departmentId: deptId,
        name: 'Senior Bridal Stylist',
        description: 'Lead expert for weddings and shoots',
      });
    assert.equal(desigRes.status, 201);

    // 3. Skill
    const skillRes = await request(app)
      .post('/api/v1/admin/skills')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'HD Airbrush Application',
        category: 'Makeup',
      });
    assert.equal(skillRes.status, 201);
  });

  // ==========================================
  // TEST 4: Staff Management & Dynamic Role Linking
  // ==========================================
  test('4. Staff creation links dynamic designations without hardcoded roles', async () => {
    const res = await request(app)
      .post('/api/v1/admin/staff')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Ananya Roy',
        phone: '9871100223',
        email: 'ananya@glamour.test',
        branchId: defaultBranch._id,
        gender: 'female',
        salary: 35000,
        commissionRate: 10,
        skills: ['HD Airbrush Application', 'Hair Styling'],
        workingHours: { start: '09:00', end: '18:00' },
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.name, 'Ananya Roy');
    assert.ok(res.body.data.employeeId);
    testStaff = res.body.data;
  });

  // ==========================================
  // TEST 5: Customer CRM Management
  // ==========================================
  test('5. Customer creation, notes, and profile management', async () => {
    const res = await request(app)
      .post('/api/v1/admin/customers')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Priya Sharma',
        phone: '9812345678',
        email: 'priya@example.com',
        gender: 'female',
        branchId: defaultBranch._id,
        address: { city: 'Mumbai', street: 'Bandra West' },
        membership: { tier: 'Gold VIP', discountPercentage: 10 },
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.name, 'Priya Sharma');
    testCustomer = res.body.data;

    // Add note
    const noteRes = await request(app)
      .post(`/api/v1/admin/customers/${testCustomer._id}/notes`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ note: 'Prefers organic herbal hair colors' });

    assert.equal(noteRes.status, 201);
  });

  // ==========================================
  // TEST 6: Unified Dynamic Service Catalogue
  // ==========================================
  test('6. Dynamic Service Categories, Services, Options, and Add-ons', async () => {
    // 1. Category
    const catRes = await request(app)
      .post('/api/v1/admin/service-categories')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Hair Services', icon: 'Scissors' });

    assert.equal(catRes.status, 201);
    const categoryId = catRes.body.data._id;

    // 2. Service
    const servRes = await request(app)
      .post('/api/v1/admin/services')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId,
        name: 'Hair Cut & Styling',
        durationMinutes: 45,
        price: 800,
        branchIds: [defaultBranch._id],
        homeServiceAllowed: true,
      });

    assert.equal(servRes.status, 201);
    testService = servRes.body.data;

    // 3. Service Options (Layer Cut)
    const optRes = await request(app)
      .post(`/api/v1/admin/services/${testService._id}/options`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Layer Cut', price: 1200, durationMinutes: 60 });

    assert.equal(optRes.status, 201);

    // 4. Service Add-on (Hair Spa)
    const addRes = await request(app)
      .post(`/api/v1/admin/services/${testService._id}/addons`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Hair Spa Nourish', price: 600, durationMinutes: 20 });

    assert.equal(addRes.status, 201);
  });

  // ==========================================
  // TEST 7: Dynamic Packages & Custom Text
  // ==========================================
  test('7. Package creation with custom text inclusions', async () => {
    const res = await request(app)
      .post('/api/v1/admin/packages')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Bridal Royal Luxury Package',
        price: 15000,
        discountPrice: 12999,
        durationMinutes: 180,
        services: [{ serviceId: testService._id, name: 'Hair Cut & Styling' }],
        customText: ['Free Pre-Bridal Consultation', 'Free Hair Decoration', 'Complimentary Touch-up Kit'],
        homeServiceAllowed: true,
        branchIds: [defaultBranch._id],
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.name, 'Bridal Royal Luxury Package');
    assert.equal(res.body.data.customText.length, 3);
  });

  // ==========================================
  // TEST 8: Conflict-Free Appointment Scheduling
  // ==========================================
  test('8. Appointment creation and double-booking conflict prevention', async () => {
    // 1. Create first appointment
    const res1 = await request(app)
      .post('/api/v1/admin/appointments')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: testCustomer._id,
        branchId: defaultBranch._id,
        staffId: testStaff._id,
        serviceMode: 'IN_STORE',
        services: [{ serviceId: testService._id, name: 'Hair Cut', price: 800, durationMinutes: 60 }],
        date: '2026-11-10',
        scheduledStartTime: '10:00',
      });

    assert.equal(res1.status, 201);
    assert.equal(res1.body.data.status, 'confirmed');
    testAppointment = res1.body.data;

    // 2. Attempt double booking for same staff at overlapping time (10:30)
    const res2 = await request(app)
      .post('/api/v1/admin/appointments')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: testCustomer._id,
        branchId: defaultBranch._id,
        staffId: testStaff._id,
        serviceMode: 'IN_STORE',
        services: [{ serviceId: testService._id, name: 'Hair Cut', price: 800, durationMinutes: 60 }],
        date: '2026-11-10',
        scheduledStartTime: '10:30',
      });

    assert.equal(res2.status, 409);
    assert.equal(res2.body.code, 'BOOKING_CONFLICT');
  });

  // ==========================================
  // TEST 9: 13-Stage Appointment Lifecycle
  // ==========================================
  test('9. Appointment lifecycle transitions from confirmed to checked_in, working, completed', async () => {
    // Checked In
    const resCheckin = await request(app)
      .post(`/api/v1/admin/appointments/${testAppointment._id}/check-in`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send();
    assert.equal(resCheckin.status, 200);
    assert.equal(resCheckin.body.data.status, 'checked_in');

    // Working (Started)
    const resStart = await request(app)
      .post(`/api/v1/admin/appointments/${testAppointment._id}/start`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send();
    assert.equal(resStart.status, 200);
    assert.equal(resStart.body.data.status, 'working');

    // Completed
    const resComplete = await request(app)
      .post(`/api/v1/admin/appointments/${testAppointment._id}/complete`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send();
    assert.equal(resComplete.status, 200);
    assert.equal(resComplete.body.data.status, 'completed');
  });

  // ==========================================
  // TEST 10: Home Service Dispatch & Live Staff Tracking
  // ==========================================
  test('10. Home Service dispatch, staff journey tracking, and customer view', async () => {
    // 1. Create home service appointment
    const resApt = await request(app)
      .post('/api/v1/admin/appointments')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: testCustomer._id,
        branchId: defaultBranch._id,
        staffId: testStaff._id,
        serviceMode: 'HOME',
        services: [{ serviceId: testService._id, name: 'Bridal Styling', price: 2500, durationMinutes: 90 }],
        date: '2026-11-12',
        scheduledStartTime: '14:00',
        customerAddress: { street: 'Flat 402, Sea Green Apt, Bandra', city: 'Mumbai' },
      });

    assert.equal(resApt.status, 201);
    testHomeAppointment = resApt.body.data;

    // 2. Staff updates journey: ON_THE_WAY with GPS
    const resStaffOTW = await request(app)
      .post(`/api/v1/staff/home-services/${testHomeAppointment._id}/on-the-way`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ latitude: 19.0596, longitude: 72.8295 });

    assert.equal(resStaffOTW.status, 200);
    assert.equal(resStaffOTW.body.data.currentStatus, 'ON_THE_WAY');

    // 3. Customer tracks home service
    const resCustomerTrack = await request(app)
      .get(`/api/v1/customer/home-services/${testHomeAppointment._id}/tracking`)
      .set('x-tenant-id', testTenant._id.toString());

    assert.equal(resCustomerTrack.status, 200);
    assert.equal(resCustomerTrack.body.data.currentStatus, 'ON_THE_WAY');
    assert.ok(resCustomerTrack.body.data.latestLocation);
  });

  // ==========================================
  // TEST 11: POS Billing & Automatic Inventory Deduction
  // ==========================================
  test('11. POS billing automatically deducts product inventory stock', async () => {
    // 1. Create product with stock of 10
    const prodRes = await request(app)
      .post('/api/v1/admin/products')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Keratin Hair Serum 100ml',
        costPrice: 400,
        sellingPrice: 750,
        stockQuantity: 10,
        minStockAlert: 2,
        branchId: defaultBranch._id,
      });

    assert.equal(prodRes.status, 201);
    testProduct = prodRes.body.data;

    // 2. Generate bill selling 2 bottles of serum + 1 hair cut
    const billRes = await request(app)
      .post('/api/v1/admin/bills')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        branchId: defaultBranch._id,
        customerId: testCustomer._id,
        items: [
          { itemType: 'service', itemId: testService._id, name: 'Hair Cut', unitPrice: 800, quantity: 1 },
          { itemType: 'product', itemId: testProduct._id, name: 'Keratin Serum', unitPrice: 750, quantity: 2 },
        ],
        paidAmount: 2300,
        paymentMethod: 'UPI',
      });

    assert.equal(billRes.status, 201);
    assert.equal(billRes.body.data.grandTotal, 2300);
    assert.equal(billRes.body.data.paymentStatus, 'paid');

    // 3. Verify Product Stock is now 8 (10 - 2)
    const updatedProdRes = await request(app)
      .get(`/api/v1/admin/products/${testProduct._id}`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(updatedProdRes.status, 200);
    assert.equal(updatedProdRes.body.data.stockQuantity, 8);
  });

  // ==========================================
  // TEST 12: Staff Attendance Check-in & Late Detection
  // ==========================================
  test('12. Staff attendance records check-in and detects late arrivals', async () => {
    const res = await request(app)
      .post('/api/v1/admin/attendance/check-in')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        staffId: testStaff._id,
        branchId: defaultBranch._id,
        date: '2026-11-05',
        notes: 'Arrived at branch',
      });

    assert.equal(res.status, 201);
    assert.ok(res.body.data.checkIn);
    assert.equal(res.body.data.staffId.toString(), testStaff._id.toString());
  });

  // ==========================================
  // TEST 13: Dynamic Student Academy System
  // ==========================================
  test('13. Student plan creation, student enrollment, and certificate issuance', async () => {
    // 1. Dynamic Plan
    const planRes = await request(app)
      .post('/api/v1/admin/student-plans')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Comprehensive Diploma in Cosmetology & Makeup',
        price: 45000,
        durationMonths: 6,
        durationHours: 240,
        courses: ['Skin Anatomy', 'Color Theory', 'Bridal Styling', 'Airbrush Makeup'],
      });

    assert.equal(planRes.status, 201);
    const planId = planRes.body.data._id;

    // 2. Student
    const stuRes = await request(app)
      .post('/api/v1/admin/students')
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Kavita Patel',
        phone: '9988776655',
        email: 'kavita@student.test',
        branchId: defaultBranch._id,
        planId,
      });

    assert.equal(stuRes.status, 201);
    const studentId = stuRes.body.data._id;

    // 3. Issue Certificate
    const certRes = await request(app)
      .post(`/api/v1/admin/students/${studentId}/certificates`)
      .set('x-tenant-id', testTenant._id.toString())
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseName: 'Diploma in Cosmetology',
        grade: 'A+',
      });

    assert.equal(certRes.status, 201);
    assert.equal(certRes.body.data.studentName, 'Kavita Patel');
    assert.equal(certRes.body.data.grade, 'A+');
  });

  // ==========================================
  // TEST 14: Public Online Booking API
  // ==========================================
  test('14. Public booking API creates customer and scheduled appointment', async () => {
    const res = await request(app)
      .post('/api/v1/public/bookings')
      .set('x-tenant-id', testTenant._id.toString())
      .send({
        customerName: 'Meera Kapoor',
        customerPhone: '9765432199',
        customerEmail: 'meera@example.com',
        branchId: defaultBranch._id,
        serviceMode: 'IN_STORE',
        serviceIds: [testService._id],
        date: '2026-11-20',
        scheduledStartTime: '11:00',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.appointmentNumber);
  });
});
