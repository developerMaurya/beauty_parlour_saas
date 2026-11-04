/**
 * @file seedMasterSalonData.js
 * @description Comprehensive Master Seeding & Deduplication Script for Multi-Tenant Beauty SaaS.
 * Populates complete, realistic data for EVERY tab in Tenant Admin:
 *   - Deduplicated Branches
 *   - 7 RBAC System Roles
 *   - TenantUsers across ADMIN, STAFF, STUDENT, CUSTOMER
 *   - Departments (Parlour, Makeup, Hair, Skin, Spa, Academy)
 *   - Designations (Senior Makeup Artist, General Parlour Employee, Senior Stylist, etc.)
 *   - Staff Members linked with Department and Designation references
 *   - Attendance Check-In (🟢 Green) and Check-Out (🔴 Red)
 *   - Staff Leaves & Salon Holidays
 *   - Customers Directory with VIP tiers
 *   - Unified Service Catalog across Hair, Makeup, Skin, Nails, Spa
 *   - Packages, Seasonal Offers, and Coupons
 *   - Appointments across PENDING, CONFIRMED, ON_THE_WAY, COMPLETED
 *   - Billing POS Bills
 *   - Products, Creams, Powders, and Stock Materials
 *   - Salon Equipment & Machines Asset Tracker (Hydra-Facial, Laser, Steamer, UV Lamps, Autoclave, Chairs)
 *   - Academy Students, Training Plans & Active Enrollments
 */

import { connectCentralDatabase } from '../core/database/centralDatabase.js';
import { Tenant } from '../modules/superadmin/tenants/models/tenant.model.js';
import { tenantDatabaseResolver } from '../core/database/tenantDatabaseResolver.js';
import { getTenantModel } from '../database/tenant/tenantModels.js';
import bcrypt from 'bcrypt';

async function seedMasterData() {
  console.log('Connecting to central database...');
  await connectCentralDatabase();

  const tenants = await Tenant.find({
    slug: { $in: ['blossom-salon', 'glamour-academy', 'serene-spa'] },
  });

  console.log(`Found ${tenants.length} tenants to seed and verify`);

  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('Password@123', salt);

  for (const tenant of tenants) {
    console.log(`\n========================================================`);
    console.log(`Processing Tenant: ${tenant.name} (${tenant.slug})`);
    console.log(`========================================================`);

    const dbContext = await tenantDatabaseResolver.resolveDatabaseContext(tenant);
    const fakeReq = { tenant, tenantId: tenant._id.toString(), tenantDb: dbContext.connection };

    // Models
    const Branch = getTenantModel(fakeReq, 'Branch');
    const Role = getTenantModel(fakeReq, 'Role');
    const TenantUser = getTenantModel(fakeReq, 'TenantUser');
    const Department = getTenantModel(fakeReq, 'Department');
    const Designation = getTenantModel(fakeReq, 'Designation');
    const Skill = getTenantModel(fakeReq, 'Skill');
    const Staff = getTenantModel(fakeReq, 'Staff');
    const Attendance = getTenantModel(fakeReq, 'Attendance');
    const Leave = getTenantModel(fakeReq, 'Leave');
    const Holiday = getTenantModel(fakeReq, 'Holiday');
    const Customer = getTenantModel(fakeReq, 'Customer');
    const ServiceCategory = getTenantModel(fakeReq, 'ServiceCategory');
    const Service = getTenantModel(fakeReq, 'Service');
    const Package = getTenantModel(fakeReq, 'Package');
    const Offer = getTenantModel(fakeReq, 'Offer');
    const Coupon = getTenantModel(fakeReq, 'Coupon');
    const Appointment = getTenantModel(fakeReq, 'Appointment');
    const Product = getTenantModel(fakeReq, 'Product');
    const Bill = getTenantModel(fakeReq, 'Bill');
    const Asset = getTenantModel(fakeReq, 'Asset');
    const StudentPlan = getTenantModel(fakeReq, 'StudentPlan');
    const Student = getTenantModel(fakeReq, 'Student');
    const Enrollment = getTenantModel(fakeReq, 'Enrollment');

    // ─────────────────────────────────────────────────────────────
    // 1. DEDUPLICATE BRANCHES
    // ─────────────────────────────────────────────────────────────
    console.log('1. Cleaning duplicate branches...');
    await Branch.deleteMany({
      tenantId: tenant._id.toString(),
      $or: [
        { code: 'BLOSSOM-01' },
        { name: /Main Flagship Sanctuary - Bandra West/i },
      ],
    });

    const prefix = tenant.slug.substring(0, 4).toUpperCase();
    const branchesData = [
      {
        tenantId: tenant._id.toString(),
        name: `${tenant.name} - South Extension Sanctuary (Flagship)`,
        code: `${prefix}-DL01`,
        phone: '+91 98765 43210',
        email: `southex@${tenant.slug}.com`,
        address: {
          street: 'Plot 42, Ring Road, South Extension Part 2',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110049',
        },
        isDefault: true,
        status: 'active',
        openingTime: '09:00',
        closingTime: '21:00',
      },
      {
        tenantId: tenant._id.toString(),
        name: `${tenant.name} - Cyber City Academy & Salon`,
        code: `${prefix}-GGN01`,
        phone: '+91 98765 43212',
        email: `gurgaon@${tenant.slug}.com`,
        address: {
          street: 'Tower C, DLF Cyber City Phase 2',
          city: 'Gurugram',
          state: 'Haryana',
          country: 'India',
          postalCode: '122002',
        },
        isDefault: false,
        status: 'active',
        openingTime: '09:00',
        closingTime: '20:00',
      },
      {
        tenantId: tenant._id.toString(),
        name: `${tenant.name} - Connaught Place Heritage Lounge`,
        code: `${prefix}-DL02`,
        phone: '+91 98765 43211',
        email: `cp@${tenant.slug}.com`,
        address: {
          street: 'Block B, Inner Circle, Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110001',
        },
        isDefault: false,
        status: 'active',
        openingTime: '10:00',
        closingTime: '21:00',
      },
    ];

    const seededBranches = [];
    for (const b of branchesData) {
      const doc = await Branch.findOneAndUpdate(
        { tenantId: b.tenantId, code: b.code },
        { $set: b },
        { upsert: true, returnDocument: 'after' }
      );
      seededBranches.push(doc);
    }
    const defaultBranch = seededBranches[0];
    console.log(`✓ 3 Clean active branches established`);

    // ─────────────────────────────────────────────────────────────
    // 2. SEED DEPARTMENTS & DESIGNATIONS (STRUCTURE)
    // ─────────────────────────────────────────────────────────────
    console.log('2. Seeding Departments, Designations & Skills...');
    const deptsData = [
      { name: 'Parlour Department', code: 'PARLOUR', description: 'Core beauty parlour, waxing, threading, and body treatments' },
      { name: 'Makeup Department', code: 'MAKEUP', description: 'Bridal HD, airbrush artistry, and party makeover styling' },
      { name: 'Hair Department', code: 'HAIR', description: 'Precision styling, global colors, balayage, and keratin treatments' },
      { name: 'Skin & Facial Department', code: 'SKIN', description: 'Clinical facials, hydra-infusion, derma peeling, and acne therapy' },
      { name: 'Spa & Wellness Department', code: 'SPA', description: 'Aromatherapy massages, Swedish therapies, and body wraps' },
      { name: 'Academy & Training Department', code: 'ACADEMY', description: 'Cosmetology courses, trainee labs, and certifications' },
    ];

    const deptMap = {};
    for (const d of deptsData) {
      const doc = await Department.findOneAndUpdate(
        { tenantId: tenant._id.toString(), name: d.name },
        { $set: { ...d, tenantId: tenant._id.toString(), status: 'active' } },
        { upsert: true, returnDocument: 'after' }
      );
      deptMap[d.name] = doc;
    }

    const designationsData = [
      { name: 'Senior Makeup Artist', dept: 'Makeup Department', description: 'Head bridal artist handling cinematic HD and airbrush' },
      { name: 'General Parlour Employee', dept: 'Parlour Department', description: 'General salon services, waxing, cleanups, threading' },
      { name: 'Senior Hair Stylist', dept: 'Hair Department', description: 'Master stylist for creative cuts, balayage, and nanoplastia' },
      { name: 'Junior Hair Stylist', dept: 'Hair Department', description: 'Blowouts, root touchups, and shampoo treatments' },
      { name: 'Clinical Esthetician / Skin Specialist', dept: 'Skin & Facial Department', description: 'Hydra-Facial machines and chemical peels' },
      { name: 'Certified Spa Therapist', dept: 'Spa & Wellness Department', description: 'Holistic deep tissue and aromatherapy therapies' },
      { name: 'Academy Master Trainer / Faculty Lead', dept: 'Academy & Training Department', description: 'Curriculum delivery, theory exams, and viva' },
    ];

    const desigMap = {};
    for (const d of designationsData) {
      const parentDept = deptMap[d.dept];
      const doc = await Designation.findOneAndUpdate(
        { tenantId: tenant._id.toString(), name: d.name },
        {
          $set: {
            tenantId: tenant._id.toString(),
            name: d.name,
            departmentId: parentDept?._id || null,
            description: d.description,
            status: 'active',
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
      desigMap[d.name] = doc;
    }
    console.log(`✓ 6 Departments and 7 Designations established`);

    // ─────────────────────────────────────────────────────────────
    // 3. SEED RBAC ROLES
    // ─────────────────────────────────────────────────────────────
    console.log('3. Seeding RBAC Roles...');
    const defaultRoles = [
      { tenantId: tenant._id.toString(), name: 'Salon Administrator', code: 'ADMIN', description: 'Full access to all salon operations', isSystem: true, permissions: ['*'] },
      { tenantId: tenant._id.toString(), name: 'Branch Operations Manager', code: 'MANAGER', description: 'Branch staff, schedule and inventory management', isSystem: false, permissions: ['staff.*', 'customer.*', 'appointment.*', 'billing.*', 'inventory.*'] },
      { tenantId: tenant._id.toString(), name: 'Senior Hair Stylist', code: 'SENIOR_STYLIST', description: 'VIP client service and home visit dispatch', isSystem: false, permissions: ['appointment.view', 'appointment.update', 'customer.view'] },
      { tenantId: tenant._id.toString(), name: 'Salon Staff Member', code: 'STAFF', description: 'Staff portal mobile view and attendance', isSystem: true, permissions: ['appointment.view', 'attendance.create'] },
      { tenantId: tenant._id.toString(), name: 'Academy Student Trainee', code: 'STUDENT', description: 'Student portal, curriculum modules and tests', isSystem: true, permissions: ['student.view'] },
      { tenantId: tenant._id.toString(), name: 'Customer & Client', code: 'CUSTOMER', description: 'Client profile with appointment booking', isSystem: true, permissions: ['customer.view', 'appointment.create'] },
      { tenantId: tenant._id.toString(), name: 'Front Desk Receptionist', code: 'RECEPTIONIST', description: 'Customer check-ins, billing POS and scheduling', isSystem: false, permissions: ['dashboard.view', 'customer.*', 'appointment.*', 'billing.*'] },
    ];

    const seededRoles = {};
    for (const r of defaultRoles) {
      const doc = await Role.findOneAndUpdate(
        { tenantId: r.tenantId, code: r.code },
        { $set: r },
        { upsert: true, returnDocument: 'after' }
      );
      seededRoles[r.code] = doc;
    }
    console.log(`✓ 7 RBAC roles established`);

    // ─────────────────────────────────────────────────────────────
    // 4. SEED USERS FOR ALL 4 PRIMARY TYPES
    // ─────────────────────────────────────────────────────────────
    console.log('4. Seeding TenantUsers across ADMIN, STAFF, STUDENT, CUSTOMER...');
    const usersToSeed = [
      { name: `${tenant.name} Executive Admin`, email: `admin@${tenant.slug}.com`, username: `admin_${tenant.slug}`, phone: '+91 98765 43210', role: 'ADMIN', customRoleId: seededRoles['ADMIN']?._id, branchId: defaultBranch._id },
      { name: 'Priya Sharma', email: `priya.stylist@${tenant.slug}.com`, username: `priya_stylist`, phone: '+91 98765 43211', role: 'STAFF', customRoleId: seededRoles['SENIOR_STYLIST']?._id, branchId: defaultBranch._id },
      { name: 'Rohit Verma', email: `rohit.artist@${tenant.slug}.com`, username: `rohit_artist`, phone: '+91 98765 43212', role: 'STAFF', customRoleId: seededRoles['STAFF']?._id, branchId: defaultBranch._id },
      { name: 'Alisha Merchant', email: `alisha.parlour@${tenant.slug}.com`, username: `alisha_parlour`, phone: '+91 98765 43220', role: 'STAFF', customRoleId: seededRoles['STAFF']?._id, branchId: defaultBranch._id },
      { name: 'Aryan Mehta', email: `aryan.student@${tenant.slug}.com`, username: `aryan_student`, phone: '+91 98765 43213', role: 'STUDENT', customRoleId: seededRoles['STUDENT']?._id, branchId: defaultBranch._id },
      { name: 'Neha Verma', email: `neha.academy@${tenant.slug}.com`, username: `neha_academy`, phone: '+91 98765 43214', role: 'STUDENT', customRoleId: seededRoles['STUDENT']?._id, branchId: defaultBranch._id },
      { name: 'Kavita Patel', email: `kavita.patel@gmail.com`, username: `kavita_patel`, phone: '+91 98765 43215', role: 'CUSTOMER', customRoleId: seededRoles['CUSTOMER']?._id, branchId: defaultBranch._id },
      { name: 'Sunita Kapoor', email: `sunita.kapoor@gmail.com`, username: `sunita_kapoor`, phone: '+91 98765 43216', role: 'CUSTOMER', customRoleId: seededRoles['CUSTOMER']?._id, branchId: defaultBranch._id },
    ];

    const seededUsers = [];
    for (const u of usersToSeed) {
      const doc = await TenantUser.findOneAndUpdate(
        { tenantId: tenant._id.toString(), email: u.email },
        { $set: { ...u, tenantId: tenant._id.toString(), passwordHash: commonPasswordHash, status: 'active' } },
        { upsert: true, returnDocument: 'after' }
      );
      seededUsers.push(doc);
    }
    console.log(`✓ ${seededUsers.length} TenantUsers established`);

    // ─────────────────────────────────────────────────────────────
    // 5. SEED STAFF LINKED WITH DEPARTMENT & DESIGNATION
    // ─────────────────────────────────────────────────────────────
    console.log('5. Seeding Staff directory with Department & Designation links...');
    const staffData = [
      {
        tenantId: tenant._id.toString(),
        userId: seededUsers.find((u) => u.username === 'priya_stylist')?._id,
        branchId: defaultBranch._id,
        name: 'Priya Sharma',
        phone: '+91 98765 43211',
        email: `priya.stylist@${tenant.slug}.com`,
        department: 'Makeup Department',
        departmentId: deptMap['Makeup Department']?._id,
        designation: 'Senior Makeup Artist',
        designationId: desigMap['Senior Makeup Artist']?._id,
        employeeId: 'STF-001',
        gender: 'female',
        salary: 45000,
        commissionRate: 15,
        status: 'active',
        skills: ['HD Airbrush Makeup', 'Keratin Wash', 'Organic Facials'],
        specializations: ['Bridal Styling', 'Airbrush Makeup'],
      },
      {
        tenantId: tenant._id.toString(),
        userId: seededUsers.find((u) => u.username === 'rohit_artist')?._id,
        branchId: defaultBranch._id,
        name: 'Rohit Verma',
        phone: '+91 98765 43212',
        email: `rohit.artist@${tenant.slug}.com`,
        department: 'Hair Department',
        departmentId: deptMap['Hair Department']?._id,
        designation: 'Senior Hair Stylist',
        designationId: desigMap['Senior Hair Stylist']?._id,
        employeeId: 'STF-002',
        gender: 'male',
        salary: 42000,
        commissionRate: 12,
        status: 'active',
        skills: ['Keratin Treatment', 'Creative Cuts', 'Global Hair Color'],
        specializations: ['Balayage', 'Hair Architecture'],
      },
      {
        tenantId: tenant._id.toString(),
        userId: seededUsers.find((u) => u.username === 'alisha_parlour')?._id,
        branchId: defaultBranch._id,
        name: 'Alisha Merchant',
        phone: '+91 98765 43220',
        email: `alisha.parlour@${tenant.slug}.com`,
        department: 'Parlour Department',
        departmentId: deptMap['Parlour Department']?._id,
        designation: 'General Parlour Employee',
        designationId: desigMap['General Parlour Employee']?._id,
        employeeId: 'STF-003',
        gender: 'female',
        salary: 28000,
        commissionRate: 10,
        status: 'active',
        skills: ['Full Body Waxing', 'Threading', 'Fruit Cleanup'],
        specializations: ['General Parlour Services'],
      },
      {
        tenantId: tenant._id.toString(),
        branchId: seededBranches[1]?._id || defaultBranch._id,
        name: 'Sneha Sen',
        phone: '+91 98765 43217',
        email: `sneha.sen@${tenant.slug}.com`,
        department: 'Skin & Facial Department',
        departmentId: deptMap['Skin & Facial Department']?._id,
        designation: 'Clinical Esthetician / Skin Specialist',
        designationId: desigMap['Clinical Esthetician / Skin Specialist']?._id,
        employeeId: 'STF-004',
        gender: 'female',
        salary: 38000,
        commissionRate: 12,
        status: 'active',
        skills: ['Hydra-Facials', 'Chemical Peels', 'Microdermabrasion'],
        specializations: ['Derma Peels', 'Skin Rejuvenation'],
      },
    ];

    const seededStaff = [];
    for (const s of staffData) {
      const doc = await Staff.findOneAndUpdate(
        { tenantId: s.tenantId, phone: s.phone },
        { $set: s },
        { upsert: true, returnDocument: 'after' }
      );
      seededStaff.push(doc);
    }
    console.log(`✓ 4 Staff members seeded with full Department & Designation links`);

    // ─────────────────────────────────────────────────────────────
    // 6. SEED ATTENDANCE & LEAVES
    // ─────────────────────────────────────────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendancePunches = [
      {
        tenantId: tenant._id.toString(),
        staffId: seededStaff[0]._id,
        branchId: defaultBranch._id,
        date: today,
        checkInTime: new Date(Date.now() - 4 * 3600000), // Checked-In 4 hrs ago (Green)
        checkOutTime: null,
        totalWorkingHours: 4.0,
        status: 'present',
        punchMethod: 'Mobile GPS Biometric',
      },
      {
        tenantId: tenant._id.toString(),
        staffId: seededStaff[1]._id,
        branchId: defaultBranch._id,
        date: today,
        checkInTime: new Date(Date.now() - 5 * 3600000), // Checked-In 5 hrs ago (Green)
        checkOutTime: null,
        totalWorkingHours: 5.0,
        status: 'present',
        punchMethod: 'Station Scanner',
      },
      {
        tenantId: tenant._id.toString(),
        staffId: seededStaff[2]._id,
        branchId: defaultBranch._id,
        date: today,
        checkInTime: new Date(Date.now() - 8 * 3600000),
        checkOutTime: new Date(Date.now() - 1 * 3600000), // Checked-Out 1 hr ago (Red)
        totalWorkingHours: 7.0,
        status: 'present',
        punchMethod: 'Mobile GPS Biometric',
      },
    ];

    for (const att of attendancePunches) {
      await Attendance.findOneAndUpdate(
        { tenantId: att.tenantId, staffId: att.staffId, date: att.date },
        { $set: att },
        { upsert: true }
      );
    }

    await Leave.findOneAndUpdate(
      { tenantId: tenant._id.toString(), staffId: seededStaff[0]._id },
      {
        $set: {
          tenantId: tenant._id.toString(),
          staffId: seededStaff[0]._id,
          leaveType: 'casual',
          startDate: new Date(Date.now() + 2 * 86400000),
          endDate: new Date(Date.now() + 3 * 86400000),
          reason: 'Family wedding ceremony',
          status: 'approved',
          approvedBy: seededUsers[0]._id,
        },
      },
      { upsert: true }
    );
    console.log(`✓ Attendance & Leaves seeded`);

    // ─────────────────────────────────────────────────────────────
    // 7. SEED CUSTOMERS
    // ─────────────────────────────────────────────────────────────
    const customersData = [
      { tenantId: tenant._id.toString(), name: 'Kavita Patel', phone: '+91 98765 43215', email: 'kavita.patel@gmail.com', tier: 'VIP PLATINUM', totalSpent: 28400, appointmentsCount: 6, status: 'active' },
      { tenantId: tenant._id.toString(), name: 'Sunita Kapoor', phone: '+91 98765 43216', email: 'sunita.kapoor@gmail.com', tier: 'VIP GOLD', totalSpent: 16800, appointmentsCount: 4, status: 'active' },
      { tenantId: tenant._id.toString(), name: 'Meera Iyer', phone: '+91 98765 43218', email: 'meera.iyer@gmail.com', tier: 'PREMIUM SILVER', totalSpent: 8900, appointmentsCount: 2, status: 'active' },
    ];

    const seededCustomers = [];
    for (const c of customersData) {
      const doc = await Customer.findOneAndUpdate(
        { tenantId: c.tenantId, phone: c.phone },
        { $set: c },
        { upsert: true, returnDocument: 'after' }
      );
      seededCustomers.push(doc);
    }
    console.log(`✓ 3 VIP Customers seeded`);

    // ─────────────────────────────────────────────────────────────
    // 8. SEED SERVICES & PACKAGES
    // ─────────────────────────────────────────────────────────────
    const catDoc = await ServiceCategory.findOneAndUpdate(
      { tenantId: tenant._id.toString(), name: 'Bridal & Salon Artistry' },
      { $set: { tenantId: tenant._id.toString(), name: 'Bridal & Salon Artistry', slug: 'bridal-salon-artistry', status: 'active' } },
      { upsert: true, returnDocument: 'after' }
    );

    const srv1 = await Service.findOneAndUpdate(
      { tenantId: tenant._id.toString(), name: 'HD Airbrush Bridal Glamour Makeup' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          name: 'HD Airbrush Bridal Glamour Makeup',
          categoryId: catDoc._id,
          price: 12499,
          durationMinutes: 120,
          homeServiceAllowed: true,
          gender: 'female',
          status: 'active',
          description: 'Flawless 24-hr waterproof silicone HD finish with lashes & draping.',
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const srv2 = await Service.findOneAndUpdate(
      { tenantId: tenant._id.toString(), name: 'Signature Keratin Protein Infusion' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          name: 'Signature Keratin Protein Infusion',
          categoryId: catDoc._id,
          price: 4499,
          durationMinutes: 90,
          homeServiceAllowed: true,
          gender: 'unisex',
          status: 'active',
          description: 'Formaldehyde-free protein smoothing with intense shine.',
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const pkgDoc = await Package.findOneAndUpdate(
      { tenantId: tenant._id.toString(), name: 'Royal Bridal Couture Makeover Package' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          name: 'Royal Bridal Couture Makeover Package',
          code: 'PKG-BRIDE-ROYAL',
          description: 'Complete bride makeover: HD Makeup, Hair Styling, Saree Draping & Gel Nails',
          price: 19999,
          discountPrice: 16999,
          durationMinutes: 240,
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    await Offer.findOneAndUpdate(
      { tenantId: tenant._id.toString(), name: 'Festive Wedding & Diwali 25% Off Bonanza' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          name: 'Festive Wedding & Diwali 25% Off Bonanza',
          discountType: 'percentage',
          discountValue: 25,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 25 * 86400000),
          minimumAmount: 2000,
          maximumDiscount: 2500,
          status: 'active',
        },
      },
      { upsert: true }
    );
    console.log(`✓ Services, Packages & Offers seeded`);

    // ─────────────────────────────────────────────────────────────
    // 9. SEED APPOINTMENTS ACROSS STATUSES (PENDING, CONFIRMED, TRANSIT, COMPLETED)
    // ─────────────────────────────────────────────────────────────
    console.log('9. Seeding Appointments across all approval states...');
    const apptsData = [
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        customerId: seededCustomers[0]._id,
        staffId: seededStaff[0]._id,
        appointmentNumber: 'APT-2026-7842',
        scheduledStartTime: new Date(Date.now() + 24 * 3600000),
        status: 'confirmed',
        serviceMode: 'IN_STORE',
        totalAmount: 4499,
        notes: 'Confirmed in-salon appointment with Priya Sharma.',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        customerId: seededCustomers[1]._id,
        staffId: seededStaff[1]._id,
        appointmentNumber: 'APT-2026-7840',
        scheduledStartTime: new Date(Date.now() + 2 * 3600000),
        status: 'on_the_way',
        serviceMode: 'HOME_SERVICE',
        totalAmount: 12499,
        notes: 'Doorstep bridal makeover visit in transit.',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        customerId: seededCustomers[2]._id,
        staffId: seededStaff[2]._id,
        appointmentNumber: 'APT-2026-7839',
        scheduledStartTime: new Date(Date.now() - 3 * 3600000),
        status: 'completed',
        serviceMode: 'IN_STORE',
        totalAmount: 2500,
        notes: 'Facial completed and client checked out.',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        customerId: seededCustomers[0]._id,
        staffId: seededStaff[0]._id,
        appointmentNumber: 'APT-2026-7845',
        scheduledStartTime: new Date(Date.now() + 48 * 3600000),
        status: 'pending',
        serviceMode: 'HOME_SERVICE',
        totalAmount: 16999,
        notes: 'New booking awaiting salon admin approval.',
      },
    ];

    for (const a of apptsData) {
      await Appointment.findOneAndUpdate(
        { tenantId: a.tenantId, appointmentNumber: a.appointmentNumber },
        { $set: a },
        { upsert: true }
      );
    }
    console.log(`✓ 4 Appointments seeded (Pending, Confirmed, On The Way, Completed)`);

    // ─────────────────────────────────────────────────────────────
    // 10. SEED PRODUCTS & BILLS
    // ─────────────────────────────────────────────────────────────
    await Product.findOneAndUpdate(
      { tenantId: tenant._id.toString(), sku: 'SKU-KER-01' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          branchId: defaultBranch._id,
          name: "L'Oréal Professional Keratin Serum",
          sku: 'SKU-KER-01',
          category: 'Hair Care',
          price: 1850,
          costPrice: 950,
          currentStock: 14,
          reorderThreshold: 5,
          unit: 'bottles',
          status: 'in_stock',
        },
      },
      { upsert: true }
    );

    await Bill.findOneAndUpdate(
      { tenantId: tenant._id.toString(), billNumber: 'BILL-2026-081' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          branchId: defaultBranch._id,
          customerId: seededCustomers[0]._id,
          billNumber: 'BILL-2026-081',
          subtotal: 4499,
          taxTotal: 809.82,
          grandTotal: 5308.82,
          paidAmount: 5308.82,
          balanceAmount: 0,
          status: 'paid',
        },
      },
      { upsert: true }
    );
    console.log(`✓ Products & Bills seeded`);

    // ─────────────────────────────────────────────────────────────
    // 11. SEED SALON EQUIPMENT & MACHINES ASSET TRACKER
    // ─────────────────────────────────────────────────────────────
    console.log('11. Seeding Salon Equipment & Machine Assets...');
    const assetsData = [
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        name: '7-in-1 Hydra-Facial Machine with RF & Ultrasound',
        category: 'Aesthetic Machines',
        modelNumber: 'HF-HYDRO-PRO-V2',
        serialNumber: 'SN-HF-2026-901',
        cost: 185000,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        name: 'Diode Laser 808nm Permanent Hair Reduction Console',
        category: 'Aesthetic Machines',
        modelNumber: 'DL-808-TITANIUM',
        serialNumber: 'SN-DL-2026-44',
        cost: 350000,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        name: 'Climazone Infrared Professional Hair Steamer Console',
        category: 'Hair Equipment',
        modelNumber: 'CLIMA-STEAM-90',
        serialNumber: 'SN-ST-2026-12',
        cost: 65000,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        name: 'UV LED Gel Curing Nail Lamps (Station 1-4)',
        category: 'Nail Tech',
        modelNumber: 'SUN-UV-48W',
        serialNumber: 'SN-UV-2026-08',
        cost: 18000,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        name: 'Medical Grade Autoclave Sterilizer 18L Class B',
        category: 'Sterilizers',
        modelNumber: 'AUTO-STERIL-18',
        serialNumber: 'SN-AC-2026-03',
        cost: 45000,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        branchId: defaultBranch._id,
        name: 'Hydraulic Reclining Luxury Styling Salon Chair',
        category: 'Furniture',
        modelNumber: 'CHAIR-HYD-LUX',
        serialNumber: 'SN-CH-2026-21',
        cost: 32000,
        status: 'active',
      },
    ];

    for (const a of assetsData) {
      await Asset.findOneAndUpdate(
        { tenantId: a.tenantId, serialNumber: a.serialNumber },
        { $set: a },
        { upsert: true }
      );
    }
    console.log(`✓ 6 Machines & Equipment Assets seeded`);

    // ─────────────────────────────────────────────────────────────
    // 12. SEED ACADEMY PLANS, STUDENTS & ENROLLMENTS
    // ─────────────────────────────────────────────────────────────
    console.log('12. Seeding Academy Training Plans, Students & Enrollments...');
    const plansData = [
      {
        tenantId: tenant._id.toString(),
        name: 'Foundation Basic Beauty & Hair Artistry',
        code: 'PLAN-BASIC',
        description: 'Comprehensive entry-level curriculum for aspiring salon beauticians',
        durationMonths: 3,
        durationHours: 120,
        price: 24999,
        finalPrice: 24999,
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Advanced Cosmetology & Chemical Hair Sciences',
        code: 'PLAN-ADVANCE',
        description: 'Senior technician training covering keratin, balayage, and clinical peels',
        durationMonths: 6,
        durationHours: 240,
        price: 49999,
        finalPrice: 49999,
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Extra Advance & Basic Master Combo Specialization',
        code: 'PLAN-EXTRA-ADV',
        description: 'Ground-up master combo from basics to cinematic airbrush & lasers',
        durationMonths: 9,
        durationHours: 360,
        price: 69999,
        finalPrice: 69999,
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Master International Cosmetology & Spa Diploma',
        code: 'PLAN-MASTER-DIP',
        description: 'CIDESCO aligned 1-year diploma with clinic director certification',
        durationMonths: 12,
        durationHours: 480,
        price: 89999,
        finalPrice: 89999,
      },
    ];

    const seededPlans = [];
    for (const p of plansData) {
      const doc = await StudentPlan.findOneAndUpdate(
        { tenantId: p.tenantId, code: p.code },
        { $set: p },
        { upsert: true, returnDocument: 'after' }
      );
      seededPlans.push(doc);
    }

    // Seed Students
    const studentAryan = await Student.findOneAndUpdate(
      { tenantId: tenant._id.toString(), studentId: 'STU-001' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          userId: seededUsers.find((u) => u.username === 'aryan_student')?._id,
          branchId: defaultBranch._id,
          name: 'Aryan Mehta',
          phone: '+91 98765 43213',
          email: `aryan.student@${tenant.slug}.com`,
          studentId: 'STU-001',
          admissionNumber: 'ADM-2026-001',
          status: 'active',
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const studentNeha = await Student.findOneAndUpdate(
      { tenantId: tenant._id.toString(), studentId: 'STU-002' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          userId: seededUsers.find((u) => u.username === 'neha_academy')?._id,
          branchId: defaultBranch._id,
          name: 'Neha Verma',
          phone: '+91 98765 43214',
          email: `neha.academy@${tenant.slug}.com`,
          studentId: 'STU-002',
          admissionNumber: 'ADM-2026-002',
          status: 'active',
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Seed Enrollments
    await Enrollment.findOneAndUpdate(
      { tenantId: tenant._id.toString(), enrollmentNumber: 'ENR-2026-001' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          studentId: studentAryan._id,
          planId: seededPlans[3]._id, // Master Diploma
          branchId: defaultBranch._id,
          enrollmentNumber: 'ENR-2026-001',
          totalFee: 89999,
          paidAmount: 45000,
          balanceAmount: 44999,
          paymentStatus: 'partially_paid',
          status: 'active',
        },
      },
      { upsert: true }
    );

    await Enrollment.findOneAndUpdate(
      { tenantId: tenant._id.toString(), enrollmentNumber: 'ENR-2026-002' },
      {
        $set: {
          tenantId: tenant._id.toString(),
          studentId: studentNeha._id,
          planId: seededPlans[1]._id, // Advanced Cosmetology
          branchId: defaultBranch._id,
          enrollmentNumber: 'ENR-2026-002',
          totalFee: 49999,
          paidAmount: 49999,
          balanceAmount: 0,
          paymentStatus: 'paid',
          status: 'active',
        },
      },
      { upsert: true }
    );
    console.log(`✓ 4 Academy Plans, 2 Students, and 2 Active Enrollments seeded`);
  }

  console.log('\n========================================================');
  console.log('🎉 ALL TENANT DATA SEEDED ACCROSS ALL TABS SUCCESSFULLY!');
  console.log('========================================================');
  process.exit(0);
}

seedMasterData().catch((err) => {
  console.error('Master seed failed:', err);
  process.exit(1);
});
