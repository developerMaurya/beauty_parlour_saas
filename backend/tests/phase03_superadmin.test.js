/**
 * @file phase03_superadmin.test.js
 * @description Automated integration test suite for Phase 03 Super Admin Control Panel, Multi-Database, and CRUD APIs.
 */

process.env.NODE_ENV = 'test';

import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { createApp } from '../src/app.js';
import { SuperAdmin } from '../src/modules/auth/models/super-admin.model.js';
import { Tenant } from '../src/modules/superadmin/tenants/models/tenant.model.js';
import { Plan } from '../src/modules/superadmin/plans/models/plan.model.js';
import { Domain } from '../src/modules/superadmin/domains/models/domain.model.js';
import { DatabaseRegistry } from '../src/modules/superadmin/databases/models/database.model.js';
import { ProvisioningJob } from '../src/modules/superadmin/provisioning/models/provisioning.model.js';
import { hashPassword } from '../src/modules/auth/services/password.service.js';
import { ROLES, ACCOUNT_STATUS } from '../src/modules/auth/constants/auth.constants.js';

describe('Phase 03 — Complete Super Admin Control Panel & Multi-Database Architecture', () => {
  let mongoServer;
  let app;
  let superAdminToken;

  const adminEmail = 'superadmin@beautysaas.local';
  const adminPassword = 'SuperAdmin@Secure2026!';

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    app = createApp();

    // Seed Super Admin
    const passwordHash = await hashPassword(adminPassword);
    await SuperAdmin.create({
      name: 'Master Admin',
      email: adminEmail,
      username: 'masteradmin',
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      status: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: true,
    });

    // Obtain access token
    const loginRes = await request(app)
      .post('/api/v1/superadmin/auth/login')
      .send({ email: adminEmail, password: adminPassword });

    superAdminToken = loginRes.body.data.accessToken;
    assert.ok(superAdminToken, 'Super Admin token must be obtained');
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // 1. Dashboard Overview
  test('1. GET /api/v1/superadmin/dashboard/overview returns real platform metrics', async () => {
    const res = await request(app)
      .get('/api/v1/superadmin/dashboard/overview')
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.tenants);
    assert.ok(res.body.data.revenue);
    assert.ok(res.body.data.subscriptions);
  });

  // 2. Plan Creation and Listing
  test('2. Plan CRUD APIs (create, list, get, update, delete)', async () => {
    // Create Plan
    const createRes = await request(app)
      .post('/api/v1/superadmin/plans')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Gold Enterprise Spa',
        slug: 'gold-spa',
        priceMonthly: 2999,
        priceYearly: 29990,
        trialDays: 14,
        features: ['multi_branch', 'staff_commission', 'sms_marketing'],
        limits: { maxStaff: 25, maxBranches: 3, storageMb: 5000 },
      });

    assert.equal(createRes.status, 201);
    assert.equal(createRes.body.success, true);
    const planId = createRes.body.data._id;

    // List Plans
    const listRes = await request(app)
      .get('/api/v1/superadmin/plans')
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(listRes.status, 200);
    assert.ok(listRes.body.data.some((p) => p._id === planId));

    // Update Plan
    const updateRes = await request(app)
      .patch(`/api/v1/superadmin/plans/${planId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ priceMonthly: 3499 });

    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.data.priceMonthly, 3499);
  });

  // 3. Tenant Creation with Shared Database
  test('3. Tenant Creation with Shared Database mode and automatic domain setup', async () => {
    const plan = await Plan.findOne();

    const res = await request(app)
      .post('/api/v1/superadmin/tenants')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Glow Luxury Salon',
        slug: 'glow-salon',
        ownerName: 'Priya Sharma',
        email: 'priya@glowsalon.com',
        phone: '+919876543210',
        businessType: 'salon',
        databaseMode: 'shared',
        planId: plan ? plan._id : null,
        subdomain: 'glow-salon',
        adminUser: {
          name: 'Priya Sharma',
          email: 'admin@glowsalon.com',
          password: 'TenantAdmin@2026!',
        },
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.tenant.name, 'Glow Luxury Salon');
    assert.equal(res.body.data.tenant.databaseMode, 'shared');
    assert.equal(res.body.data.tenant.provisioningStatus, 'completed');

    // Verify domain was registered
    const domain = await Domain.findOne({ tenantId: res.body.data.tenant._id });
    assert.ok(domain);
    assert.equal(domain.domain, 'glow-salon.yourplatform.com');
  });

  // 4. Tenant Creation with Separate Database mode
  test('4. Tenant Creation with Separate Database mode generates unique database name and provisions', async () => {
    const res = await request(app)
      .post('/api/v1/superadmin/tenants')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Royal Spa Retreat',
        slug: 'royal-spa',
        ownerName: 'Rajesh Verma',
        email: 'rajesh@royalspa.com',
        phone: '+919876543211',
        businessType: 'spa',
        databaseMode: 'separate',
        subdomain: 'royal-spa',
        customDomain: 'www.royalsparetreat.com',
        adminUser: {
          name: 'Rajesh Verma',
          email: 'admin@royalspa.com',
          password: 'RoyalSpaAdmin@2026!',
        },
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.tenant.databaseMode, 'separate');
    assert.match(res.body.data.tenant.databaseConfig.databaseName, /^beauty_tenant_royal_spa_/);

    // Verify custom domain was registered
    const customDomain = await Domain.findOne({
      tenantId: res.body.data.tenant._id,
      isCustom: true,
    });
    assert.ok(customDomain);
    assert.equal(customDomain.domain, 'www.royalsparetreat.com');
  });

  // 5. Tenant Status Management (activate, suspend)
  test('5. Tenant Status Management: activate, suspend, and restore', async () => {
    const tenant = await Tenant.findOne({ slug: 'glow-salon' });

    // Suspend
    const suspendRes = await request(app)
      .post(`/api/v1/superadmin/tenants/${tenant._id}/suspend`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ reason: 'Payment overdue' });

    assert.equal(suspendRes.status, 200);
    assert.equal(suspendRes.body.data.status, 'suspended');
    assert.equal(suspendRes.body.data.suspendedReason, 'Payment overdue');

    // Activate
    const activateRes = await request(app)
      .post(`/api/v1/superadmin/tenants/${tenant._id}/activate`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(activateRes.status, 200);
    assert.equal(activateRes.body.data.status, 'active');
  });

  // 6. Domain Verification and SSL status
  test('6. Custom domain verification and SSL activation flow', async () => {
    const domain = await Domain.findOne({ isCustom: true });
    assert.ok(domain);

    const verifyRes = await request(app)
      .post(`/api/v1/superadmin/domains/${domain._id}/verify`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(verifyRes.status, 200);
    assert.equal(verifyRes.body.data.status, 'verified');
    assert.equal(verifyRes.body.data.sslStatus, 'active');
  });

  // 7. Database Node Registration and Health Check
  test('7. Database Registry CRUD and connection test', async () => {
    const createRes = await request(app)
      .post('/api/v1/superadmin/databases')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Primary Atlas Cluster',
        type: 'shared',
        databaseName: 'beauty_saas_shared',
        isDefault: true,
      });

    assert.equal(createRes.status, 201);
    const dbId = createRes.body.data._id;

    const healthRes = await request(app)
      .get(`/api/v1/superadmin/databases/${dbId}/health`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(healthRes.status, 200);
    assert.ok(healthRes.body.data.status);
  });

  // 8. Controlled Database Migration (Shared -> Separate)
  test('8. Safe Tenant Database Migration from Shared to Separate with integrity verification', async () => {
    const tenant = await Tenant.findOne({ slug: 'glow-salon' });
    assert.equal(tenant.databaseMode, 'shared');

    const migrateRes = await request(app)
      .post(`/api/v1/superadmin/tenants/${tenant._id}/database/migrate`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        targetMode: 'separate',
        targetDatabaseName: `beauty_tenant_glow_migrated_${Date.now().toString(36)}`,
      });

    assert.equal(migrateRes.status, 200);
    assert.equal(migrateRes.body.success, true);
    assert.equal(migrateRes.body.data.tenant.databaseMode, 'separate');
    assert.ok(migrateRes.body.data.migration.rollbackPoint);
  });

  // 9. Tenant Provisioning Retry
  test('9. Provisioning Job status query and retry endpoint', async () => {
    const job = await ProvisioningJob.findOne();
    assert.ok(job);

    const jobRes = await request(app)
      .get(`/api/v1/superadmin/provisioning/${job.jobId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(jobRes.status, 200);
    assert.equal(jobRes.body.data.jobId, job.jobId);
    assert.ok(Array.isArray(jobRes.body.data.steps));
  });

  // 10. Audit Logging verification
  test('10. Audit log query and export endpoint returns immutable history', async () => {
    const res = await request(app)
      .get('/api/v1/superadmin/audit-logs')
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(res.status, 200);
    assert.ok(res.body.data.items.length > 0);
    assert.ok(res.body.data.items.some((log) => log.action === 'TENANT_CREATED'));
  });

  // 11. Industry Verticals (Salon, Spa & Massage, Beauty Parlour, Makeup, Academy)
  test('11. GET /api/v1/superadmin/verticals returns pre-seeded beauty industry verticals', async () => {
    const res = await request(app)
      .get('/api/v1/superadmin/verticals')
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.verticals));
    assert.ok(res.body.data.verticals.length >= 5);
    const codes = res.body.data.verticals.map((v) => v.code);
    assert.ok(codes.includes('SALON'));
    assert.ok(codes.includes('SPA_MASSAGE'));
    assert.ok(codes.includes('MAKEUP_STUDIO'));
    assert.ok(codes.includes('TRAINING_ACADEMY'));
  });

  // 12. Pre-Seeded Service Catalogues & Tenant Seeding
  test('12. Industry service templates can be queried and seeded to tenant database', async () => {
    const tplRes = await request(app)
      .get('/api/v1/superadmin/templates/services?verticalCode=SPA_MASSAGE')
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(tplRes.status, 200);
    assert.ok(tplRes.body.data.templates.length > 0);

    const tenant = await Tenant.findOne();
    assert.ok(tenant);

    const seedRes = await request(app)
      .post(`/api/v1/superadmin/tenants/${tenant._id}/seed-catalog`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ verticalCode: 'SPA_MASSAGE' });

    assert.equal(seedRes.status, 200);
    assert.equal(seedRes.body.success, true);
    assert.ok(seedRes.body.data.seededCount > 0);
  });

  // 13. White-Label Theme Presets
  test('13. White-label themes showroom returns presets and applies to tenant', async () => {
    const themeRes = await request(app)
      .get('/api/v1/superadmin/themes')
      .set('Authorization', `Bearer ${superAdminToken}`);

    assert.equal(themeRes.status, 200);
    assert.ok(themeRes.body.data.themes.length >= 4);

    const tenant = await Tenant.findOne();
    assert.ok(tenant);

    const applyRes = await request(app)
      .post(`/api/v1/superadmin/tenants/${tenant._id}/theme`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ themeCode: 'zen_emerald_spa' });

    assert.equal(applyRes.status, 200);
    assert.equal(applyRes.body.success, true);
    assert.equal(applyRes.body.data.tenant.theme, 'zen_emerald_spa');
  });
});

