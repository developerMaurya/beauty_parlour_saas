/**
 * @file seedTenantWebsiteAndContent.js
 * @description Seeds rich branches, categories, services, packages, offers, academy courses,
 * and WebsiteConfig CMS data for glamour-academy, blossom-salon, and serene-spa.
 */

import { connectCentralDatabase } from '../core/database/centralDatabase.js';
import { Tenant } from '../modules/superadmin/tenants/models/tenant.model.js';
import { tenantDatabaseResolver } from '../core/database/tenantDatabaseResolver.js';
import { getTenantModel } from '../database/tenant/tenantModels.js';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Connecting to central database...');
  await connectCentralDatabase();

  const tenants = await Tenant.find({
    slug: { $in: ['glamour-academy', 'blossom-salon', 'serene-spa'] },
  });

  console.log(`Found ${tenants.length} target tenants`);

  for (const tenant of tenants) {
    console.log(`\nSeeding data for tenant: ${tenant.name} (${tenant.slug})`);
    const dbContext = await tenantDatabaseResolver.resolveDatabaseContext(tenant);
    const fakeReq = { tenant, tenantId: tenant._id.toString(), tenantDb: dbContext.connection };

    const WebsiteConfig = getTenantModel(fakeReq, 'WebsiteConfig');
    const Branch = getTenantModel(fakeReq, 'Branch');
    const ServiceCategory = getTenantModel(fakeReq, 'ServiceCategory');
    const Service = getTenantModel(fakeReq, 'Service');
    const Package = getTenantModel(fakeReq, 'Package');
    const Offer = getTenantModel(fakeReq, 'Offer');
    const StudentPlan = getTenantModel(fakeReq, 'StudentPlan');

    // 1. WebsiteConfig CMS
    await WebsiteConfig.findOneAndUpdate(
      { tenantId: tenant._id.toString() },
      {
        $set: {
          businessName: tenant.name,
          tagline: tenant.slug === 'glamour-academy'
            ? 'Haute Couture Salon & Accredited Cosmetology Academy'
            : 'Luxury Grooming Sanctuary & Wellness Oasis',
          primaryColor: tenant.slug === 'glamour-academy' ? '#ec4899' : (tenant.slug === 'serene-spa' ? '#10b981' : '#f59e0b'),
          heroHeading: tenant.slug === 'glamour-academy'
            ? 'Elevate Your Beauty, Master Your Craft'
            : 'Artisanal Beauty Care & Doorstep Luxury Treatments',
          heroSubheading: tenant.slug === 'glamour-academy'
            ? "India's premier luxury beauty destination and certified academy. Experience bespoke salon rituals or launch your career as an internationally accredited artist."
            : 'Experience bespoke bridal makeovers, customized organic facials, and doorstep home services performed by certified master artists.',
          aboutStory:
            'Founded with a passion for aesthetic perfection and artistic innovation, our salon and academy brings international grooming standards, dermatologically formulated treatments, and couture artistry under one bespoke roof. From restorative rituals to transformative bridal styling, our team of internationally certified cosmetologists crafts every experience around your unique individuality.',
          contactPhone: '+91 98765 43210',
          contactEmail: `concierge@${tenant.slug}.com`,
          address: 'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049',
          openingHoursText: 'Mon - Sun: 9:00 AM - 9:00 PM',
          announcementBar: {
            text: '✨ Special Privilege: 20% OFF on First Online Appointment Booking! Code: GLAM20',
            isVisible: true,
            linkUrl: '/book',
          },
          dynamicCategories: [
            { name: 'Hair Care & Styling', slug: 'hair', icon: '✂️' },
            { name: 'Skin & Facials', slug: 'skin', icon: '💆' },
            { name: 'Bridal Artistry', slug: 'bridal', icon: '💄' },
            { name: 'Nails & Pedicure', slug: 'nails', icon: '💅' },
            { name: 'Academy Training', slug: 'academy', icon: '🎓' },
            { name: 'Luxury Spa', slug: 'spa', icon: '🌿' },
            { name: 'Instant Booking', slug: 'booking', icon: '📅' },
          ],
        },
      },
      { upsert: true, returnDocument: 'after' }
    );
    console.log('✓ WebsiteConfig seeded');

    // 2. Branches
    const branchesData = [
      {
        tenantId: tenant._id.toString(),
        name: `${tenant.name} - South Extension Sanctuary (Flagship)`,
        code: `${tenant.slug.substring(0, 4).toUpperCase()}-DL01`,
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
        name: `${tenant.name} - Connaught Place Heritage Lounge`,
        code: `${tenant.slug.substring(0, 4).toUpperCase()}-DL02`,
        phone: '+91 98765 43211',
        email: `cp@${tenant.slug}.com`,
        address: {
          street: 'Inner Circle, Block C, Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110001',
        },
        isDefault: false,
        status: 'active',
        openingTime: '10:00',
        closingTime: '20:30',
      },
      {
        tenantId: tenant._id.toString(),
        name: `${tenant.name} - Cyber City Academy & Salon`,
        code: `${tenant.slug.substring(0, 4).toUpperCase()}-GGN01`,
        phone: '+91 98765 43212',
        email: `gurgaon@${tenant.slug}.com`,
        address: {
          street: 'DLF Cyber City, Building 10, Tower B',
          city: 'Gurugram',
          state: 'Haryana',
          country: 'India',
          postalCode: '122002',
        },
        isDefault: false,
        status: 'active',
        openingTime: '09:30',
        closingTime: '21:30',
      },
    ];

    for (const b of branchesData) {
      await Branch.findOneAndUpdate({ tenantId: b.tenantId, code: b.code }, { $set: b }, { upsert: true });
    }
    console.log('✓ 3 Branches seeded');

    // 3. Service Categories
    const categoriesData = [
      { tenantId: tenant._id.toString(), name: 'Hair Care & Styling', slug: 'hair', icon: '✂️', description: 'Cut, Balayage, Keratin & Organic Hair Spa', sortOrder: 1, status: 'active' },
      { tenantId: tenant._id.toString(), name: 'Skin & Clinical Facials', slug: 'skin', icon: '💆', description: 'Hydra-Facials, Chemical Peels & Glow Therapies', sortOrder: 2, status: 'active' },
      { tenantId: tenant._id.toString(), name: 'Bridal Artistry & Couture', slug: 'bridal', icon: '💄', description: 'HD Airbrush Makeup & Royal Bridal Drape', sortOrder: 3, status: 'active' },
      { tenantId: tenant._id.toString(), name: 'Nail Architecture & Spa', slug: 'nails', icon: '💅', description: 'Sculpted Gel Extensions & 3D Art', sortOrder: 4, status: 'active' },
      { tenantId: tenant._id.toString(), name: 'Relaxing Spa & Body Care', slug: 'spa', icon: '🌿', description: 'Aromatherapy & Deep Tissue Massage', sortOrder: 5, status: 'active' },
    ];

    const categoryMap = {};
    for (const c of categoriesData) {
      const doc = await ServiceCategory.findOneAndUpdate(
        { tenantId: c.tenantId, slug: c.slug },
        { $set: c },
        { upsert: true, returnDocument: 'after' }
      );
      categoryMap[c.slug] = doc._id;
    }
    console.log('✓ 5 Service Categories seeded');

    // 4. Services
    const servicesData = [
      {
        tenantId: tenant._id.toString(),
        name: 'Signature Keratin Protein Infusion',
        code: 'SRV-KERATIN',
        categoryId: categoryMap['hair'],
        price: 4499,
        durationMinutes: 90,
        description: 'Deep formaldehyde-free keratin treatment providing silkiness and anti-frizz protection up to 5 months.',
        homeServiceAllowed: true,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        name: '24K Gold Hydra-Facial & Rejuvenation',
        code: 'SRV-HYDRA24K',
        categoryId: categoryMap['skin'],
        price: 2999,
        durationMinutes: 60,
        description: 'Vortex suction pore extraction infused with colloidal 24K gold peptides and hyaluronic hydration.',
        homeServiceAllowed: true,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        name: 'HD Airbrush Bridal Glamour Makeup',
        code: 'SRV-BRIDALHD',
        categoryId: categoryMap['bridal'],
        price: 12499,
        durationMinutes: 120,
        description: 'Couture silicone airbrush bridal makeover including luxury lashes, hairstyling, and drape setting.',
        homeServiceAllowed: true,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Royal Gel Sculpted Nail Extensions',
        code: 'SRV-NAILGEL',
        categoryId: categoryMap['nails'],
        price: 1899,
        durationMinutes: 60,
        description: 'Sculpted extensions with non-toxic builder gel, cuticle Russian manicuring, and high-gloss gel polish.',
        homeServiceAllowed: true,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Balayage Blonde Ombré & Gloss',
        code: 'SRV-BALAYAGE',
        categoryId: categoryMap['hair'],
        price: 5999,
        durationMinutes: 120,
        description: 'Freehand sun-kissed French hair painting with bond protector and tone gloss glaze.',
        homeServiceAllowed: false,
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Aromatherapy Relaxing Full Body Spa',
        code: 'SRV-AROMASPA',
        categoryId: categoryMap['spa'],
        price: 3499,
        durationMinutes: 75,
        description: 'Lavender and frankincense botanical oils with heated hot-stone meridian pressure points.',
        homeServiceAllowed: false,
        status: 'active',
      },
    ];

    const serviceMap = {};
    for (const s of servicesData) {
      const sDoc = await Service.findOneAndUpdate(
        { tenantId: s.tenantId, code: s.code },
        { $set: s },
        { upsert: true, returnDocument: 'after' }
      );
      serviceMap[s.code] = sDoc._id;
    }
    console.log('✓ 6 Services seeded');

    // 5. Packages
    const packagesData = [
      {
        tenantId: tenant._id.toString(),
        name: 'Royal Bridal Symphony Package',
        code: 'PKG-BRIDAL-ROYAL',
        price: 24999,
        description: 'All-inclusive pre-bridal glow rituals, body scrub, hair spa, trial makeover, and wedding day HD airbrush styling.',
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Weekend Deluxe Revive Package',
        code: 'PKG-WEEKEND-REVIVE',
        price: 3499,
        description: 'Deep cleansing facial, organic Moroccan hair spa, and classic spa manicure & pedicure.',
        status: 'active',
      },
    ];

    for (const p of packagesData) {
      await Package.findOneAndUpdate({ tenantId: p.tenantId, code: p.code }, { $set: p }, { upsert: true });
    }
    console.log('✓ Packages seeded');

    // 6. Offers
    const offersData = [
      {
        tenantId: tenant._id.toString(),
        name: 'Festive Privilege Glow Offer',
        discountType: 'percentage',
        discountValue: 25,
        validUntil: new Date(Date.now() + 30 * 86400000),
        description: 'Enjoy 25% off across all signature facials and Balayage hair coloring services this festive season.',
        status: 'active',
      },
      {
        tenantId: tenant._id.toString(),
        name: 'First Visit Privilege',
        discountType: 'flat',
        discountValue: 500,
        minimumAmount: 1999,
        validUntil: new Date(Date.now() + 60 * 86400000),
        description: 'Flat ₹500 discount on your inaugural online appointment booking above ₹1,999.',
        status: 'active',
      },
    ];

    for (const o of offersData) {
      await Offer.findOneAndUpdate({ tenantId: o.tenantId, name: o.name }, { $set: o }, { upsert: true });
    }
    console.log('✓ Offers seeded');

    // 7. Student Plans / Academy Courses
    const coursesData = [
      {
        tenantId: tenant._id.toString(),
        name: 'Advanced Diploma in Professional Cosmetology',
        code: 'COSM-ADV-601',
        durationMonths: 6,
        durationHours: 320,
        price: 65000,
        finalPrice: 55000,
        description: 'Comprehensive mastery of clinical skin anatomy, hair architecture, couture chemical treatments, and advanced bridal styling.',
        certificateProvided: true,
        installmentOption: true,
        numberOfInstallments: 4,
        servicesCovered: ['Skin Anatomy & Peels', 'Creative Hair Colouring', 'Bridal & Portfolio HD Makeup', 'Salon Management'],
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Masterclass in Couture Bridal Artistry & Airbrush',
        code: 'BRD-MSTR-301',
        durationMonths: 1,
        durationHours: 60,
        price: 35000,
        finalPrice: 29999,
        description: 'Ultra-HD silicone airbrush techniques, traditional Indian bridal drape styling, jewelry setting, and high-fashion editorial makeup.',
        certificateProvided: true,
        installmentOption: true,
        numberOfInstallments: 2,
        servicesCovered: ['Airbrush Makeup', 'Traditional Bridal Drapes', 'Color Theory & Lighting', 'Client Consultation'],
      },
      {
        tenantId: tenant._id.toString(),
        name: 'Professional Hair Dressing & Chemical Design',
        code: 'HAIR-PRO-401',
        durationMonths: 3,
        durationHours: 160,
        price: 42000,
        finalPrice: 38000,
        description: 'Precision scissor ergonomics, Balayage ombré melting, Brazilian keratin protocols, and creative hair extensions.',
        certificateProvided: true,
        installmentOption: true,
        numberOfInstallments: 3,
        servicesCovered: ['Precision Scissor Cuts', 'Balayage & Foiling', 'Keratin & Nanoplastia', 'Scalp Spa Therapies'],
      },
    ];

    for (const c of coursesData) {
      await StudentPlan.findOneAndUpdate({ tenantId: c.tenantId, code: c.code }, { $set: c }, { upsert: true });
    }
    console.log('✓ Academy Courses seeded');

    // 8. Tenant Admin Users & Staff
    const TenantUser = getTenantModel(fakeReq, 'TenantUser');
    const Staff = getTenantModel(fakeReq, 'Staff');
    const Customer = getTenantModel(fakeReq, 'Customer');
    const Product = getTenantModel(fakeReq, 'Product');
    const Appointment = getTenantModel(fakeReq, 'Appointment');

    const passwordHash = await bcrypt.hash('Password@123', 10);
    const primaryBranch = await Branch.findOne({ tenantId: tenant._id.toString() });
    const primaryBranchId = primaryBranch?._id;

    const adminEmails = [
      tenant.email.toLowerCase().trim(),
      `admin@${tenant.slug}.com`,
      `admin@${tenant.slug.replace('-salon', '').replace('-academy', '').replace('-spa', '')}.com`,
      'admin@parlour.local',
    ];

    for (const email of adminEmails) {
      const user = await TenantUser.findOneAndUpdate(
        { tenantId: tenant._id.toString(), email },
        {
          $set: {
            tenantId: tenant._id.toString(),
            email,
            phone: tenant.phone || '+91 98765 43210',
            username: email.split('@')[0],
            passwordHash,
            role: 'ADMIN',
            branchId: primaryBranchId,
            status: 'active',
            isBlocked: false,
            failedLoginAttempts: 0,
            lockUntil: null,
            sessionVersion: 1,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      // Ensure a Staff profile exists for the admin
      if (primaryBranchId) {
        await Staff.findOneAndUpdate(
          { tenantId: tenant._id.toString(), email },
          {
            $set: {
              tenantId: tenant._id.toString(),
              userId: user._id,
              branchId: primaryBranchId,
              name: `${tenant.name} Director`,
              phone: tenant.phone || '+91 98765 43210',
              email,
              designation: 'Managing Director & Lead Stylist',
              department: 'Management',
              status: 'active',
              joiningDate: new Date('2024-01-01'),
            },
          },
          { upsert: true }
        );
      }
    }
    console.log(`✓ Admin accounts created/updated (${adminEmails.join(', ')}) with Password@123`);

    // 9. Sample Staff Stylists
    if (primaryBranchId) {
      const stylists = [
        { name: 'Priya Sharma', email: `priya@${tenant.slug}.com`, phone: '+91 98111 22334', designation: 'Senior Hair Artist', department: 'Hair Care' },
        { name: 'Ananya Roy', email: `ananya@${tenant.slug}.com`, phone: '+91 98222 33445', designation: 'Dermatology & Skin Expert', department: 'Skin Care' },
        { name: 'Rohit Verma', email: `rohit@${tenant.slug}.com`, phone: '+91 98333 44556', designation: 'Master Colorist', department: 'Hair Care' },
      ];

      for (const s of stylists) {
        const staffUser = await TenantUser.findOneAndUpdate(
          { tenantId: tenant._id.toString(), email: s.email },
          {
            $set: {
              tenantId: tenant._id.toString(),
              email: s.email,
              phone: s.phone,
              username: s.email.split('@')[0],
              passwordHash,
              role: 'STAFF',
              branchId: primaryBranchId,
              status: 'active',
              isBlocked: false,
              failedLoginAttempts: 0,
            },
          },
          { upsert: true, returnDocument: 'after' }
        );

        await Staff.findOneAndUpdate(
          { tenantId: tenant._id.toString(), email: s.email },
          {
            $set: {
              tenantId: tenant._id.toString(),
              userId: staffUser._id,
              branchId: primaryBranchId,
              name: s.name,
              phone: s.phone,
              email: s.email,
              designation: s.designation,
              department: s.department,
              status: 'active',
              joiningDate: new Date('2024-03-15'),
            },
          },
          { upsert: true }
        );
      }
      console.log('✓ Sample Staff Stylists seeded');
    }

    // 10. Sample Customers
    const sampleCustomers = [
      { name: 'Sunita Kapoor', phone: '+91 99001 12233', email: 'sunita.k@gmail.com', city: 'Delhi', loyaltyPoints: 350 },
      { name: 'Meera Rajput', phone: '+91 99002 23344', email: 'meera.r@gmail.com', city: 'Gurugram', loyaltyPoints: 520 },
      { name: 'Kavita Singhal', phone: '+91 99003 34455', email: 'kavita.s@gmail.com', city: 'Noida', loyaltyPoints: 180 },
    ];

    const customerIds = [];
    for (const c of sampleCustomers) {
      const cust = await Customer.findOneAndUpdate(
        { tenantId: tenant._id.toString(), phone: c.phone },
        {
          $set: {
            tenantId: tenant._id.toString(),
            name: c.name,
            phone: c.phone,
            email: c.email,
            address: { city: c.city, state: 'Delhi', country: 'India' },
            loyaltyPoints: c.loyaltyPoints,
            status: 'active',
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
      if (cust?._id) customerIds.push(cust._id);
    }
    console.log('✓ Sample Customers seeded');

    // 11. Sample Inventory Products
    const sampleProducts = [
      { name: 'Olaplex No. 3 Hair Perfector 100ml', sku: 'OLA-003', barcode: '8901234567890', costPrice: 1800, sellingPrice: 2800, currentStock: 35, category: 'Hair Care' },
      { name: "L'Oréal Professionnel Serie Expert Mask 500g", sku: 'LOR-500', barcode: '8901234567891', costPrice: 950, sellingPrice: 1450, currentStock: 50, category: 'Hair Care' },
      { name: 'Dermalogica Daily Microfoliant 74g', sku: 'DER-074', barcode: '8901234567892', costPrice: 2900, sellingPrice: 4200, currentStock: 18, category: 'Skin Care' },
      { name: 'Moroccanoil Treatment Oil 100ml', sku: 'MOR-100', barcode: '8901234567893', costPrice: 2200, sellingPrice: 3300, currentStock: 24, category: 'Hair Care' },
      { name: 'Kérastase Chronologiste Masque 200ml', sku: 'KER-200', barcode: '8901234567894', costPrice: 3400, sellingPrice: 4800, currentStock: 12, category: 'Hair Luxury' },
    ];

    for (const p of sampleProducts) {
      await Product.findOneAndUpdate(
        { tenantId: tenant._id.toString(), sku: p.sku },
        {
          $set: {
            tenantId: tenant._id.toString(),
            name: p.name,
            sku: p.sku,
            barcode: p.barcode,
            costPrice: p.costPrice,
            sellingPrice: p.sellingPrice,
            currentStock: p.currentStock,
            reorderLevel: 5,
            category: p.category,
            status: 'active',
          },
        },
        { upsert: true }
      );
    }
    console.log('✓ Sample Inventory Products seeded');

    // 12. Sample Appointments
    if (primaryBranchId && customerIds.length > 0) {
      const today = new Date();
      const appts = [
        {
          tenantId: tenant._id.toString(),
          customerId: customerIds[0],
          branchId: primaryBranchId,
          appointmentNumber: `APT-${tenant.slug.substring(0, 3).toUpperCase()}-101`,
          date: today,
          startTime: '11:00',
          endTime: '12:30',
          status: 'confirmed',
          serviceType: 'in_salon',
          totalAmount: 3800,
          paidAmount: 3800,
          paymentStatus: 'paid',
        },
        {
          tenantId: tenant._id.toString(),
          customerId: customerIds[1],
          branchId: primaryBranchId,
          appointmentNumber: `APT-${tenant.slug.substring(0, 3).toUpperCase()}-102`,
          date: today,
          startTime: '14:00',
          endTime: '15:30',
          status: 'in_progress',
          serviceType: 'in_salon',
          totalAmount: 5500,
          paidAmount: 2000,
          paymentStatus: 'partial',
        },
        {
          tenantId: tenant._id.toString(),
          customerId: customerIds[2],
          branchId: primaryBranchId,
          appointmentNumber: `APT-${tenant.slug.substring(0, 3).toUpperCase()}-103`,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          startTime: '16:00',
          endTime: '17:00',
          status: 'confirmed',
          serviceType: 'home_service',
          totalAmount: 4200,
          paidAmount: 0,
          paymentStatus: 'pending',
        },
      ];

      for (const a of appts) {
        await Appointment.findOneAndUpdate(
          { tenantId: a.tenantId, appointmentNumber: a.appointmentNumber },
          { $set: a },
          { upsert: true }
        );
      }
      console.log('✓ Sample Appointments seeded');
    }
  }

  console.log('\nSeeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
