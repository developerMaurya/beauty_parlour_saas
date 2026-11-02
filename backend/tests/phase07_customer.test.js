/**
 * @file phase07_customer.test.js
 * @description Comprehensive Integration Test Suite for Phase 07: Complete Customer, Guest & Public Portal.
 * Tests Customer Auth, Sessions, Profile Mass-Assignment Protection, Catalog, Server-Side Coupons,
 * Appointment Booking, Overlapping Double-Booking Prevention, Reschedule, Cancel, Rebooking,
 * Live Tracking & Home-Service Location Privacy, Payments, Invoices, Refunds, Service History,
 * Verified Reviews (anti-fake & anti-duplicate), Favorites, Packages & Remaining Sessions,
 * Chats, Notifications, Requests, Addresses, Calendar, Unified 21-Section Dossier, Timeline,
 * Public Services & Details, Guest Browsing, Guest-to-Customer Conversion, and Strict Multi-Tenant Isolation.
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

describe('Phase 07 — Complete Customer, Guest & Public Portal System', { concurrency: 1 }, () => {
  let mongoServer;
  let app;
  let testTenant;
  let rivalTenant;
  let testBranch;

  // Customer 1
  let customerUser1;
  let customerDoc1;
  let customerToken1;

  // Customer 2 (Peer)
  let customerUser2;
  let customerDoc2;
  let customerToken2;

  // Catalog items
  let testService1;
  let testService2;
  let testCategory;
  let testPackage;
  let testOffer;
  let testCoupon;
  let testStaff;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    // Primary Tenant
    testTenant = await Tenant.create({
      name: 'Luxe Glamour Salon',
      slug: 'luxe-glamour',
      subdomain: 'luxe',
      ownerName: 'Elena Rostova',
      email: 'elena@luxeglamour.com',
      phone: '9988776655',
      ownerEmail: 'elena@luxeglamour.com',
      ownerPhone: '9988776655',
      databaseType: 'shared',
      status: 'active',
      subscriptionPlan: 'ENTERPRISE',
      businessType: 'SALON',
    });

    // Rival Tenant for Tenant Isolation Verification
    rivalTenant = await Tenant.create({
      name: 'Rival Salon Spa',
      slug: 'rival-salon',
      subdomain: 'rival',
      ownerName: 'Marcus Vance',
      email: 'marcus@rivalsalon.com',
      phone: '9911223344',
      ownerEmail: 'marcus@rivalsalon.com',
      ownerPhone: '9911223344',
      databaseType: 'shared',
      status: 'active',
      subscriptionPlan: 'PRO',
      businessType: 'SPA',
    });

    const fakeReq = { tenantId: testTenant._id, tenant: testTenant };

    // Branch
    const BranchModel = getTenantModel(fakeReq, 'Branch');
    testBranch = await BranchModel.create({
      tenantId: testTenant._id,
      name: 'Downtown Flagship Branch',
      code: 'DT-01',
      phone: '9876543210',
      email: 'downtown@luxeglamour.com',
      address: {
        street: '101 Fashion Blvd',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      status: 'active',
      isDefault: true,
    });

    // Staff
    const TenantUserModel = getTenantModel(fakeReq, 'TenantUser');
    const StaffModel = getTenantModel(fakeReq, 'Staff');
    const staffPasswordHash = await bcrypt.hash('StaffPass123!', 10);
    const staffUser = await TenantUserModel.create({
      tenantId: testTenant._id,
      email: 'sophia@luxeglamour.com',
      username: 'sophia_stylist',
      phone: '9888877777',
      passwordHash: staffPasswordHash,
      role: 'STAFF',
      userType: 'STAFF',
      status: 'active',
    });

    testStaff = await StaffModel.create({
      tenantId: testTenant._id,
      userId: staffUser._id,
      branchId: testBranch._id,
      name: 'Sophia Stylist',
      phone: '9888877777',
      email: 'sophia@luxeglamour.com',
      gender: 'female',
      designation: 'Senior Stylist',
      skills: ['Hair Styling', 'Balayage', 'Bridal'],
      status: 'active',
    });

    // Category
    const CategoryModel = getTenantModel(fakeReq, 'ServiceCategory');
    testCategory = await CategoryModel.create({
      tenantId: testTenant._id,
      name: 'Hair Care & Styling',
      slug: 'hair-care',
      status: 'active',
    });

    // Services
    const ServiceModel = getTenantModel(fakeReq, 'Service');
    testService1 = await ServiceModel.create({
      tenantId: testTenant._id,
      categoryId: testCategory._id,
      name: 'Signature Silk Blowout',
      slug: 'signature-silk-blowout',
      price: 1500,
      durationMinutes: 45,
      gender: 'unisex',
      homeServiceAllowed: true,
      status: 'active',
    });

    testService2 = await ServiceModel.create({
      tenantId: testTenant._id,
      categoryId: testCategory._id,
      name: 'Balayage & Color Treatment',
      slug: 'balayage-color',
      price: 4500,
      durationMinutes: 120,
      gender: 'female',
      homeServiceAllowed: false,
      status: 'active',
    });

    // Package
    const PackageModel = getTenantModel(fakeReq, 'Package');
    testPackage = await PackageModel.create({
      tenantId: testTenant._id,
      name: 'Bridal Royalty Package',
      description: 'Includes Hair Styling, Make-up and Spa sessions',
      price: 8000,
      validityDays: 90,
      status: 'active',
      services: [
        { serviceId: testService1._id, name: 'Signature Silk Blowout', quantity: 2 },
        { serviceId: testService2._id, name: 'Balayage & Color Treatment', quantity: 1 },
      ],
    });

    // Offer
    const OfferModel = getTenantModel(fakeReq, 'Offer');
    testOffer = await OfferModel.create({
      tenantId: testTenant._id,
      name: 'Festive Glam Special',
      discountType: 'percentage',
      discountValue: 20,
      status: 'active',
      services: [testService1._id],
    });

    // Coupon
    const CouponModel = getTenantModel(fakeReq, 'Coupon');
    testCoupon = await CouponModel.create({
      tenantId: testTenant._id,
      code: 'GLAM20',
      discountType: 'percentage',
      discountValue: 20,
      minimumAmount: 1000,
      maximumDiscount: 500,
      status: 'active',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Customer 1 Setup
    const CustomerModel = getTenantModel(fakeReq, 'Customer');
    const passwordHash = await bcrypt.hash('CustomerPass123!', 10);

    customerUser1 = await TenantUserModel.create({
      tenantId: testTenant._id,
      email: 'ananya@example.com',
      phone: '9811122233',
      passwordHash,
      userType: 'CUSTOMER',
      role: 'CUSTOMER',
      status: 'active',
    });

    customerDoc1 = await CustomerModel.create({
      tenantId: testTenant._id,
      userId: customerUser1._id,
      branchId: testBranch._id,
      customerId: 'CUST-001',
      customerNumber: 'CUST-001',
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '9811122233',
      gender: 'female',
      passwordHash,
      status: 'ACTIVE',
      totalSpent: 0,
      totalVisits: 0,
      preferredServices: [testService1._id],
      favoriteStaff: [testStaff._id],
      favoritePackages: [testPackage._id],
    });

    customerToken1 = generateAccessToken({
      _id: customerUser1._id,
      sub: customerUser1._id.toString(),
      customerId: customerDoc1._id.toString(),
      email: customerUser1.email,
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      tenantId: testTenant._id.toString(),
    }, 'sess-cust-1');

    // Customer 2 Setup
    customerUser2 = await TenantUserModel.create({
      tenantId: testTenant._id,
      email: 'rohit@example.com',
      phone: '9822233344',
      passwordHash,
      userType: 'CUSTOMER',
      role: 'CUSTOMER',
      status: 'active',
    });

    customerDoc2 = await CustomerModel.create({
      tenantId: testTenant._id,
      userId: customerUser2._id,
      branchId: testBranch._id,
      customerId: 'CUST-002',
      customerNumber: 'CUST-002',
      name: 'Rohit Verma',
      email: 'rohit@example.com',
      phone: '9822233344',
      gender: 'male',
      passwordHash,
      status: 'ACTIVE',
      totalSpent: 0,
      totalVisits: 0,
    });

    customerToken2 = generateAccessToken({
      _id: customerUser2._id,
      sub: customerUser2._id.toString(),
      customerId: customerDoc2._id.toString(),
      email: customerUser2.email,
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      tenantId: testTenant._id.toString(),
    }, 'sess-cust-2');

    app = createApp();
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  // ==========================================
  // 1. CUSTOMER AUTHENTICATION
  // ==========================================
  describe('1. Customer Authentication & Sessions', () => {
    test('POST /api/v1/customer/auth/register - Register a new customer', async () => {
      const res = await request(app)
        .post('/api/v1/customer/auth/register')
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          name: 'Pooja Hegde',
          email: 'pooja@example.com',
          phone: '9833344455',
          password: 'Password123!',
          gender: 'female',
          city: 'Mumbai',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      assert.strictEqual(res.body.data.customer.email, 'pooja@example.com');
    });

    test('POST /api/v1/customer/auth/login - Login with phone and password', async () => {
      const res = await request(app)
        .post('/api/v1/customer/auth/login')
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          identifier: '9811122233',
          password: 'CustomerPass123!',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      assert.strictEqual(res.body.data.customer.name, 'Ananya Sharma');
    });

    test('GET /api/v1/customer/auth/me - Retrieve authenticated customer profile', async () => {
      const res = await request(app)
        .get('/api/v1/customer/auth/me')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Ananya Sharma');
      assert.strictEqual(res.body.data.role, 'CUSTOMER');
    });

    test('POST /api/v1/customer/auth/change-password - Change customer password', async () => {
      const res = await request(app)
        .post('/api/v1/customer/auth/change-password')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          oldPassword: 'CustomerPass123!',
          newPassword: 'NewCustomerPass123!',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
    });

    test('GET /api/v1/customer/auth/sessions - List active customer sessions', async () => {
      const res = await request(app)
        .get('/api/v1/customer/auth/sessions')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
    });
  });

  // ==========================================
  // 2. CUSTOMER PROFILE & MASS-ASSIGNMENT PROTECTION
  // ==========================================
  describe('2. Customer Profile & Mass-Assignment Protection', () => {
    test('PUT /api/v1/customer/profile - Update allowed personal fields', async () => {
      const res = await request(app)
        .put('/api/v1/customer/profile')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          name: 'Ananya Sharma Updated',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          emergencyContact: {
            name: 'Vikram Sharma',
            phone: '9999888877',
            relationship: 'Brother',
          },
          // Attempt mass-assignment attack on restricted admin fields
          totalSpent: 999999,
          status: 'SUSPENDED',
          tenantId: 'fakeTenant',
          customerId: 'HACKED-ID',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Ananya Sharma Updated');
      assert.strictEqual(res.body.data.city, 'Pune');
      // Verify protected fields were NOT modified
      assert.notStrictEqual(res.body.data.totalSpent, 999999);
      assert.strictEqual(res.body.data.status, 'ACTIVE');
      assert.strictEqual(res.body.data.customerId, 'CUST-001');
    });
  });

  // ==========================================
  // 3. CATALOG & COUPON VALIDATION
  // ==========================================
  describe('3. Customer Catalog & Server-Side Pricing', () => {
    test('GET /api/v1/customer/services - Browse available services', async () => {
      const res = await request(app)
        .get('/api/v1/customer/services')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.services.length >= 2);
    });

    test('POST /api/v1/customer/coupons/validate - Validate coupon server-side', async () => {
      const res = await request(app)
        .post('/api/v1/customer/coupons/validate')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          code: 'GLAM20',
          orderAmount: 1500,
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.valid, true);
      // 20% of 1500 is 300
      assert.strictEqual(res.body.data.discountAmount, 300);
      assert.strictEqual(res.body.data.finalAmount, 1200);
    });
  });

  // ==========================================
  // 4. APPOINTMENT BOOKING & DOUBLE-BOOKING PREVENTION
  // ==========================================
  describe('4. Appointment Booking & Double-Booking Prevention', () => {
    let createdAppointmentId;

    test('POST /api/v1/customer/appointments - Book a new appointment', async () => {
      const res = await request(app)
        .post('/api/v1/customer/appointments')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          branchId: testBranch._id.toString(),
          staffId: testStaff._id.toString(),
          serviceMode: 'IN_BRANCH',
          serviceIds: [testService1._id.toString()],
          date: '2026-11-10',
          scheduledStartTime: '14:00',
          couponCode: 'GLAM20',
          notes: 'Customer requested front row stylist',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.appointmentNumber);
      assert.strictEqual(res.body.data.scheduledStartTime, '14:00');
      createdAppointmentId = res.body.data._id;
    });

    test('POST /api/v1/customer/appointments - Reject double-booking for same stylist and overlapping time', async () => {
      // Customer 2 attempts to book the same stylist on same date between 14:15 - 15:00 (overlaps with 14:00 - 14:45)
      const res = await request(app)
        .post('/api/v1/customer/appointments')
        .set('Authorization', `Bearer ${customerToken2}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          branchId: testBranch._id.toString(),
          staffId: testStaff._id.toString(),
          serviceMode: 'IN_BRANCH',
          serviceIds: [testService1._id.toString()],
          date: '2026-11-10',
          scheduledStartTime: '14:15',
        });

      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /already booked/i);
    });

    test('POST /api/v1/customer/appointments/:id/reschedule - Reschedule appointment', async () => {
      const res = await request(app)
        .post(`/api/v1/customer/appointments/${createdAppointmentId}/reschedule`)
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          newDate: '2026-11-11',
          newStartTime: '16:00',
          reason: 'Change of schedule',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.date, '2026-11-11');
      assert.strictEqual(res.body.data.scheduledStartTime, '16:00');
    });

    test('POST /api/v1/customer/appointments/:id/cancel - Cancel appointment with reason', async () => {
      const res = await request(app)
        .post(`/api/v1/customer/appointments/${createdAppointmentId}/cancel`)
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          cancellationReason: 'Emergency travel',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.status, 'cancelled');
    });

    test('POST /api/v1/customer/appointments/:id/rebook - Rebook previous appointment', async () => {
      const res = await request(app)
        .post(`/api/v1/customer/appointments/${createdAppointmentId}/rebook`)
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          date: '2026-11-12',
          scheduledStartTime: '11:00',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.date, '2026-11-12');
      assert.strictEqual(res.body.data.scheduledStartTime, '11:00');
    });
  });

  // ==========================================
  // 5. LIVE TRACKING & HOME SERVICE
  // ==========================================
  describe('5. Live Tracking & Privacy Control', () => {
    let homeAppointment;

    before(async () => {
      const fakeReq = { tenantId: testTenant._id, tenant: testTenant };
      const AppointmentModel = getTenantModel(fakeReq, 'Appointment');
      const HomeTrackingModel = getTenantModel(fakeReq, 'HomeServiceTracking');

      homeAppointment = await AppointmentModel.create({
        tenantId: testTenant._id,
        appointmentNumber: 'HOME-1234',
        customerId: customerDoc1._id,
        branchId: testBranch._id,
        staffId: testStaff._id,
        serviceMode: 'HOME_SERVICE',
        services: [{ serviceId: testService1._id, name: 'Signature Silk Blowout', price: 1500, durationMinutes: 45 }],
        date: '2026-11-15',
        scheduledStartTime: '15:00',
        scheduledEndTime: '15:45',
        status: 'confirmed',
        totalAmount: 1770,
      });

      await HomeTrackingModel.create({
        tenantId: testTenant._id,
        appointmentId: homeAppointment._id,
        staffId: testStaff._id,
        currentStatus: 'ON_THE_WAY',
        assignedAt: new Date(),
        onTheWayAt: new Date(),
        locationEvents: [
          {
            latitude: 19.076,
            longitude: 72.8777,
            timestamp: new Date(),
            batteryLevel: 85,
            note: 'En route to customer address',
          },
        ],
      });
    });

    test('GET /api/v1/customer/appointments/:id/tracking - Track appointment timeline', async () => {
      const res = await request(app)
        .get(`/api/v1/customer/appointments/${homeAppointment._id}/tracking`)
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.appointmentId, homeAppointment._id.toString());
      assert.ok(Array.isArray(res.body.data.timeline));
    });

    test('GET /api/v1/customer/home-services/:id/location - Access live location when staff is on the way', async () => {
      const res = await request(app)
        .get(`/api/v1/customer/home-services/${homeAppointment._id}/location`)
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.trackingActive, true);
      assert.strictEqual(res.body.data.currentLocation.latitude, 19.076);
    });
  });

  // ==========================================
  // 6. PAYMENTS, INVOICES & REFUND REQUESTS
  // ==========================================
  describe('6. Payments, Invoices & Refunds', () => {
    let testPaymentId;

    test('POST /api/v1/customer/payments/create-order - Create online payment order with 18% GST', async () => {
      const res = await request(app)
        .post('/api/v1/customer/payments/create-order')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          amount: 2000,
          notes: 'Salon advance payment',
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.subtotal, 2000);
      // 18% GST on 2000 is 360 => total 2360
      assert.strictEqual(res.body.data.tax, 360);
      assert.strictEqual(res.body.data.totalAmount, 2360);
    });

    test('POST /api/v1/customer/payments/offline - Record verified offline payment', async () => {
      const res = await request(app)
        .post('/api/v1/customer/payments/offline')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          branchId: testBranch._id.toString(),
          amount: 1500,
          paymentMethod: 'CASH',
          referenceNumber: 'CASH-REC-001',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.invoiceNumber);
      testPaymentId = res.body.data._id;
    });

    test('GET /api/v1/customer/payments/summary - Retrieve customer payment ledger summary', async () => {
      const res = await request(app)
        .get('/api/v1/customer/payments/summary')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.totalPaid >= 1500);
    });

    test('POST /api/v1/customer/refund-requests - Submit customer refund request', async () => {
      const res = await request(app)
        .post('/api/v1/customer/refund-requests')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          paymentId: testPaymentId,
          amount: 1500,
          reason: 'Double charge dispute',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.status, 'REQUESTED');
    });
  });

  // ==========================================
  // 7. COMPLETED SERVICE HISTORY & VERIFIED REVIEWS
  // ==========================================
  describe('7. Completed Service History & Verified Reviews', () => {
    let completedApt;

    before(async () => {
      const fakeReq = { tenantId: testTenant._id, tenant: testTenant };
      const AppointmentModel = getTenantModel(fakeReq, 'Appointment');

      completedApt = await AppointmentModel.create({
        tenantId: testTenant._id,
        appointmentNumber: 'COMP-777',
        customerId: customerDoc1._id,
        branchId: testBranch._id,
        staffId: testStaff._id,
        serviceMode: 'IN_STORE',
        services: [{ serviceId: testService1._id, name: 'Signature Silk Blowout', price: 1500, durationMinutes: 45 }],
        date: '2026-11-01',
        scheduledStartTime: '10:00',
        scheduledEndTime: '10:45',
        status: 'completed',
        totalAmount: 1770,
        completedAt: new Date(),
      });
    });

    test('GET /api/v1/customer/services/history - Retrieve completed past services', async () => {
      const res = await request(app)
        .get('/api/v1/customer/services/history')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.history.length >= 1);
    });

    test('POST /api/v1/customer/reviews - Submit verified review for completed appointment', async () => {
      const res = await request(app)
        .post('/api/v1/customer/reviews')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          appointmentId: completedApt._id.toString(),
          serviceId: testService1._id.toString(),
          overallRating: 5,
          serviceRating: 5,
          staffRating: 5,
          comment: 'Outstanding blow dry! Sophia was wonderful.',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.overallRating, 5);
      assert.strictEqual(res.body.data.isVerifiedPurchase, true);
    });

    test('POST /api/v1/customer/reviews - Reject duplicate review for same appointment', async () => {
      const res = await request(app)
        .post('/api/v1/customer/reviews')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          appointmentId: completedApt._id.toString(),
          serviceId: testService1._id.toString(),
          overallRating: 4,
          comment: 'Duplicate review attempt',
        });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /already submitted a review/i);
    });

    test('POST /api/v1/customer/reviews - Reject fake review for non-existent or uncompleted appointment', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .post('/api/v1/customer/reviews')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          appointmentId: fakeId,
          serviceId: testService1._id.toString(),
          overallRating: 5,
          comment: 'Fake review attempt',
        });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
    });
  });

  // ==========================================
  // 8. FAVORITES & PURCHASED PACKAGES
  // ==========================================
  describe('8. Customer Favorites & Packages Usage', () => {
    test('GET /api/v1/customer/favorites - Retrieve customer favorites list', async () => {
      const res = await request(app)
        .get('/api/v1/customer/favorites')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.counts.services, 1);
      assert.strictEqual(res.body.data.counts.staff, 1);
    });

    test('POST /api/v1/customer/packages/:id/purchase - Purchase bridal package', async () => {
      const res = await request(app)
        .post(`/api/v1/customer/packages/${testPackage._id}/purchase`)
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          paymentMethod: 'ONLINE',
          branchId: testBranch._id.toString(),
        });

      assert.strictEqual(res.status, 210);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.totalServices, 3);
      assert.strictEqual(res.body.data.remainingServices, 3);
    });

    test('GET /api/v1/customer/packages/my - View my purchased packages and remaining sessions', async () => {
      const res = await request(app)
        .get('/api/v1/customer/packages/my')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.length >= 1);
      assert.strictEqual(res.body.data[0].status, 'ACTIVE');
    });
  });

  // ==========================================
  // 9. CHATS, NOTIFICATIONS & REQUESTS
  // ==========================================
  describe('9. Customer Communication & Helpdesk Requests', () => {
    let chatId;

    test('POST /api/v1/customer/chats - Start customer support chat', async () => {
      const res = await request(app)
        .post('/api/v1/customer/chats')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          recipientType: 'SUPPORT',
          subject: 'Question regarding Bridal Package',
          initialMessage: 'Hi, does the package include hair spa therapy?',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data._id);
      chatId = res.body.data._id;
    });

    test('POST /api/v1/customer/chats/:id/messages - Send message to chat', async () => {
      const res = await request(app)
        .post(`/api/v1/customer/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          message: 'Also, can I book my appointment on Saturday morning?',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.message, 'Also, can I book my appointment on Saturday morning?');
    });

    test('POST /api/v1/customer/requests - Create customer support ticket', async () => {
      const res = await request(app)
        .post('/api/v1/customer/requests')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          requestType: 'BOOKING_HELP',
          subject: 'Need home service for group of 4',
          description: 'We have a wedding event and require 2 stylists at our residence.',
          priority: 'HIGH',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.ticketNumber);
      assert.strictEqual(res.body.data.status, 'OPEN');
    });
  });

  // ==========================================
  // 10. CALENDAR, TIMELINE & COMPLETE 21-SECTION DOSSIER
  // ==========================================
  describe('10. Calendar, Timeline & Complete Dossier', () => {
    test('GET /api/v1/customer/timeline - Chronological customer journey', async () => {
      const res = await request(app)
        .get('/api/v1/customer/timeline')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 2);
    });

    test('GET /api/v1/customer/reports/complete - Generate complete 21-section customer transcript', async () => {
      const res = await request(app)
        .get('/api/v1/customer/reports/complete')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.profile);
      assert.ok(res.body.data.metrics);
      assert.ok(res.body.data.appointments);
      assert.ok(res.body.data.services);
      assert.ok(res.body.data.payments);
      assert.ok(res.body.data.packages);
      assert.ok(res.body.data.reviews);
      assert.ok(res.body.data.requests);
    });
  });

  // ==========================================
  // 11. PUBLIC & GUEST APIS
  // ==========================================
  describe('11. Public & Guest APIs', () => {
    test('GET /api/v1/public/services - Public service catalog without authentication', async () => {
      const res = await request(app)
        .get('/api/v1/public/services')
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.length >= 2);
    });

    test('GET /api/v1/public/services/:id - Public service detail', async () => {
      const res = await request(app)
        .get(`/api/v1/public/services/${testService1._id}`)
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Signature Silk Blowout');
    });

    test('GET /api/v1/guest/business - Guest business profile without login', async () => {
      const res = await request(app)
        .get('/api/v1/guest/business')
        .set('x-tenant-id', testTenant._id.toString());

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Luxe Glamour Salon');
    });

    test('POST /api/v1/guest/book - Guest booking converts to Customer without duplicates', async () => {
      const res = await request(app)
        .post('/api/v1/guest/book')
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          name: 'Kavita Menon',
          phone: '9844455566',
          email: 'kavita@example.com',
          branchId: testBranch._id.toString(),
          serviceIds: [testService1._id.toString()],
          date: '2026-11-20',
          scheduledStartTime: '12:00',
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.customer.name, 'Kavita Menon');
      assert.strictEqual(res.body.data.customer.isNewCustomer, true);
      assert.ok(res.body.data.appointment.appointmentNumber);

      // Book again with same phone - must deduplicate and link to existing customer
      const res2 = await request(app)
        .post('/api/v1/guest/book')
        .set('x-tenant-id', testTenant._id.toString())
        .send({
          name: 'Kavita Menon',
          phone: '9844455566',
          branchId: testBranch._id.toString(),
          serviceIds: [testService1._id.toString()],
          date: '2026-11-22',
          scheduledStartTime: '15:00',
        });

      assert.strictEqual(res2.status, 201);
      assert.strictEqual(res2.body.data.customer.id, res.body.data.customer.id);
      assert.strictEqual(res2.body.data.customer.isNewCustomer, false);
    });
  });

  // ==========================================
  // 12. MULTI-TENANT ISOLATION
  // ==========================================
  describe('12. Strict Multi-Tenant Isolation', () => {
    test('Customer from Tenant A cannot access Tenant B with cross-tenant header', async () => {
      const res = await request(app)
        .get('/api/v1/customer/profile')
        .set('Authorization', `Bearer ${customerToken1}`)
        .set('x-tenant-id', rivalTenant._id.toString());

      // Should be forbidden due to token tenant mismatch
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
    });

    test('Customer 2 cannot view or cancel Customer 1 appointments', async () => {
      // Customer 2 attempts to cancel Customer 1's appointment
      const fakeReq = { tenantId: testTenant._id, tenant: testTenant };
      const AppointmentModel = getTenantModel(fakeReq, 'Appointment');
      const apt1 = await AppointmentModel.findOne({ customerId: customerDoc1._id });

      const res = await request(app)
        .post(`/api/v1/customer/appointments/${apt1._id}/cancel`)
        .set('Authorization', `Bearer ${customerToken2}`)
        .set('x-tenant-id', testTenant._id.toString())
        .send({ cancellationReason: 'Malicious cancellation attempt' });

      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.success, false);
    });
  });
});
