#!/usr/bin/env node

/**
 * @file seed-demo-tenant.js
 * @description Bootstrap and seed a ready-to-use Demo Salon Tenant with Admin, Staff, Student, and Customer accounts.
 * Provides credentials for testing all portals without manual registration.
 *
 * Usage:
 *   node scripts/seed-demo-tenant.js
 *   npm run seed:demo
 */

import bcrypt from 'bcrypt';
import { connectCentralDB, disconnectCentralDB } from '../src/database/central/central.connection.js';
import { Tenant } from '../src/modules/superadmin/tenants/models/tenant.model.js';
import { getTenantModel } from '../src/database/tenant/tenantModels.js';

export const seedDemoTenant = async () => {
  console.log('[SEED] Connecting to MongoDB...');
  await connectCentralDB();

  console.log('[SEED] Provisioning Demo Tenant: Blossom Luxury Salon & Spa (blossom-salon)...');

  // 1. Create or Find Tenant
  let tenant = await Tenant.findOne({ slug: 'blossom-salon' });
  if (!tenant) {
    tenant = await Tenant.create({
      name: 'Blossom Luxury Salon & Spa',
      slug: 'blossom-salon',
      code: 'BLOSSOM',
      businessType: 'salon',
      theme: 'rose_gold_glamour',
      ownerName: 'Pooja Verma',
      email: 'admin@parlour.local',
      phone: '9876543210',
      status: 'active',
      databaseMode: 'shared',
      limits: {
        maxStaff: 50,
        maxBranches: 10,
        maxAppointmentsMonthly: 1000,
      },
    });
    console.log('[SEED] Tenant created:', tenant.name, `(${tenant._id})`);
  } else {
    tenant.status = 'active';
    console.log('[SEED] Existing tenant found:', tenant.name, `(${tenant._id})`);
  }

  tenant.storageConfig = {
    allowCustomCloudflare: true,
    provider: 'platform_default',
  };
  tenant.domainAccess = {
    customDomainAllowed: true,
    isDomainActive: true,
    restrictedMessage: 'Connect to Super Admin for access to your website portal.',
  };
  tenant.databaseConfig = {
    ...tenant.databaseConfig,
    allowCustomDatabase: true,
    connectionStatus: 'connected',
  };
  tenant.securityConfig = {
    ipWhitelistEnabled: false,
    whitelistedIps: ['127.0.0.1', '::1'],
    whiteLabelEnabled: true,
  };
  await tenant.save();

  const tenantId = tenant._id.toString();
  const fakeReq = { tenantId, tenant };

  // 2. Models
  const BranchModel = getTenantModel(fakeReq, 'Branch');
  const TenantUserModel = getTenantModel(fakeReq, 'TenantUser');
  const StaffModel = getTenantModel(fakeReq, 'Staff');
  const StudentModel = getTenantModel(fakeReq, 'Student');
  const CustomerModel = getTenantModel(fakeReq, 'Customer');
  const CategoryModel = getTenantModel(fakeReq, 'ServiceCategory');
  const ServiceModel = getTenantModel(fakeReq, 'Service');
  const PackageModel = getTenantModel(fakeReq, 'Package');
  const CouponModel = getTenantModel(fakeReq, 'Coupon');

  // 3. Seed Default Branch
  let branch = await BranchModel.findOne({ tenantId, isMain: true });
  if (!branch) {
    branch = await BranchModel.create({
      tenantId,
      name: 'Main Flagship Sanctuary - Bandra West',
      code: 'BLOSSOM-01',
      isMain: true,
      isDefault: true,
      status: 'active',
      phone: '9876543210',
      email: 'bandra@blossom.com',
      address: {
        street: '12 Linking Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400050',
      },
    });
    console.log('[SEED] Branch created:', branch.name);
  }

  // Common Salt & Hashes
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Password@123', salt);
  const altAdminPasswordHash = await bcrypt.hash('Admin@123', salt);
  const staffPasswordHash = await bcrypt.hash('Staff@123', salt);
  const studentPasswordHash = await bcrypt.hash('Student@123', salt);
  const customerPasswordHash = await bcrypt.hash('Customer@123', salt);

  // 4. Seed Tenant Admin Users (Both admin@parlour.local and admin@blossom.com)
  const adminEmails = ['admin@parlour.local', 'admin@blossom.com'];
  for (const email of adminEmails) {
    let adminUser = await TenantUserModel.findOne({ tenantId, email });
    if (!adminUser) {
      adminUser = await TenantUserModel.create({
        tenantId,
        name: 'Master Salon Director',
        email,
        username: email.split('@')[0],
        phone: '9876543210',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        status: 'active',
        branchId: branch._id,
        allowedBranches: [branch._id],
      });
      console.log(`[SEED] Tenant Admin User created: ${email}`);
    } else {
      adminUser.passwordHash = adminPasswordHash;
      adminUser.status = 'active';
      adminUser.branchId = branch._id;
      adminUser.allowedBranches = [branch._id];
      await adminUser.save();
      console.log(`[SEED] Tenant Admin User updated: ${email}`);
    }
  }

  // 5. Seed Staff User & Profile
  let staffUser = await TenantUserModel.findOne({ tenantId, email: 'staff@blossom.com' });
  if (!staffUser) {
    staffUser = await TenantUserModel.create({
      tenantId,
      name: 'Rhea Sen',
      email: 'staff@blossom.com',
      username: 'rhea_stylist',
      phone: '9876543211',
      passwordHash: staffPasswordHash,
      role: 'STAFF',
      status: 'active',
      branchId: branch._id,
    });
  }
  let staffProfile = await StaffModel.findOne({ tenantId, email: 'staff@blossom.com' });
  if (!staffProfile) {
    staffProfile = await StaffModel.create({
      tenantId,
      userId: staffUser._id,
      branchId: branch._id,
      name: 'Rhea Sen',
      designation: 'Senior Creative Hair Stylist & Aesthetician',
      phone: '9876543211',
      email: 'staff@blossom.com',
      gender: 'female',
      status: 'active',
      rating: 4.9,
    });
    console.log('[SEED] Staff profile created:', staffProfile.name);
  }

  // 6. Seed Student User & Profile
  let studentUser = await TenantUserModel.findOne({ tenantId, email: 'student@blossom.com' });
  if (!studentUser) {
    studentUser = await TenantUserModel.create({
      tenantId,
      name: 'Ananya Gupta',
      email: 'student@blossom.com',
      username: 'ananya_academy',
      phone: '9876543212',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'active',
      branchId: branch._id,
    });
  }
  let studentProfile = await StudentModel.findOne({ tenantId, email: 'student@blossom.com' });
  if (!studentProfile) {
    studentProfile = await StudentModel.create({
      tenantId,
      userId: studentUser._id,
      branchId: branch._id,
      studentId: 'STU-2026-001',
      admissionNumber: 'ADM-001',
      name: 'Ananya Gupta',
      phone: '9876543212',
      email: 'student@blossom.com',
      status: 'active',
      enrolledAt: new Date(),
    });
    console.log('[SEED] Student profile created:', studentProfile.name);
  }

  // 7. Seed Customer Profile
  let customerProfile = await CustomerModel.findOne({ tenantId, phone: '9876543210' });
  if (!customerProfile) {
    customerProfile = await CustomerModel.create({
      tenantId,
      customerNumber: 'CUST-1001',
      name: 'Priya Sharma',
      phone: '9876543210',
      email: 'customer@blossom.com',
      passwordHash: customerPasswordHash,
      gender: 'female',
      preferredBranch: branch._id,
      status: 'ACTIVE',
      totalVisits: 3,
      totalSpent: 4500,
    });
    console.log('[SEED] Customer profile created:', customerProfile.name);
  }

  // 8. Seed Service Categories & Services
  const catNames = [
    { name: 'Hair Care & Styling', slug: 'hair-care', icon: '✂️' },
    { name: 'Skin & Organic Facials', slug: 'skin-facials', icon: '✨' },
    { name: 'Bridal & Party Makeover', slug: 'bridal-makeover', icon: '💄' },
    { name: 'Spa & Body Rejuvenation', slug: 'spa-body', icon: '🌿' },
  ];

  const createdCats = [];
  for (const c of catNames) {
    let catDoc = await CategoryModel.findOne({ tenantId, name: c.name });
    if (!catDoc) {
      catDoc = await CategoryModel.create({
        tenantId,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        status: 'active',
        isActive: true,
      });
    }
    createdCats.push(catDoc);
  }

  const sampleServices = [
    {
      name: 'Signature Silk Blowout & Keratin Wash',
      categoryId: createdCats[0]._id,
      price: 1500,
      durationMinutes: 45,
      description: 'Luxe hair spa wash with organic Moroccan argan oil blowdry.',
    },
    {
      name: 'Gold Glow Radiance Facial',
      categoryId: createdCats[1]._id,
      price: 2500,
      durationMinutes: 60,
      description: '24K gold active botanical facial for instant party brightness.',
    },
    {
      name: 'Royal Bridal Couture Makeover',
      categoryId: createdCats[2]._id,
      price: 12000,
      durationMinutes: 180,
      description: 'HD Bridal makeup with jewelry setting, draping, and hair styling.',
    },
    {
      name: 'Aromatherapy Balinese Deep Tissue Massage',
      categoryId: createdCats[3]._id,
      price: 3200,
      durationMinutes: 60,
      description: 'Stress-relief massage with essential organic lavender oils.',
    },
  ];

  for (const s of sampleServices) {
    let sDoc = await ServiceModel.findOne({ tenantId, name: s.name });
    if (!sDoc) {
      await ServiceModel.create({
        tenantId,
        branchId: branch._id,
        ...s,
        isActive: true,
      });
      console.log(`[SEED] Service created: ${s.name}`);
    }
  }

  // 9. Seed Sample Package & Coupon
  let samplePkg = await PackageModel.findOne({ tenantId, name: 'Pre-Bridal Glow Ritual Package' });
  if (!samplePkg) {
    await PackageModel.create({
      tenantId,
      branchId: branch._id,
      name: 'Pre-Bridal Glow Ritual Package',
      description: 'Complete 5-stage pre-wedding glow treatments across 3 sessions.',
      price: 8500,
      originalPrice: 12000,
      validityDays: 90,
      status: 'active',
      isActive: true,
    });
    console.log('[SEED] Package created: Pre-Bridal Glow Ritual Package');
  }

  let sampleCoupon = await CouponModel.findOne({ tenantId, code: 'GLOW20' });
  if (!sampleCoupon) {
    await CouponModel.create({
      tenantId,
      code: 'GLOW20',
      description: '20% Flat Discount on all salon rituals above ₹2000',
      discountType: 'percentage',
      discountValue: 20,
      minimumAmount: 2000,
      maximumDiscount: 1000,
      status: 'active',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    console.log('[SEED] Coupon created: GLOW20');
  }

  console.log('\n======================================================');
  console.log('🎉 DEMO TENANT SEEDING COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
  console.log('\n--- 1. SALON / STUDIO ADMIN PORTAL (/admin/login) ---');
  console.log('  Salon Slug:   blossom-salon');
  console.log('  Email:        admin@parlour.local   (or admin@blossom.com)');
  console.log('  Password:     Password@123          (or Admin@123)');
  console.log('\n--- 2. STAFF PORTAL (/staff/login) ---');
  console.log('  Salon Slug:   blossom-salon');
  console.log('  Email/Phone:  staff@blossom.com  (or 9876543211)');
  console.log('  Password:     Staff@123');
  console.log('\n--- 3. STUDENT PORTAL (/student/login) ---');
  console.log('  Salon Slug:   blossom-salon');
  console.log('  Email:        student@blossom.com');
  console.log('  Password:     Student@123');
  console.log('\n--- 4. CUSTOMER PORTAL (/customer/login) ---');
  console.log('  Phone/Email:  9876543210  (or customer@blossom.com)');
  console.log('  Password:     Customer@123');
  console.log('\n--- 5. SUPER ADMIN PORTAL (/superadmin/login) ---');
  console.log('  Email:        superadmin@beautysaas.local');
  console.log('  Password:     SuperAdmin@Secure2026!');
  console.log('======================================================\n');

  await disconnectCentralDB();
};

if (process.argv[1] && process.argv[1].endsWith('seed-demo-tenant.js')) {
  seedDemoTenant()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[ERROR] Seeding failed:', err);
      process.exit(1);
    });
}
