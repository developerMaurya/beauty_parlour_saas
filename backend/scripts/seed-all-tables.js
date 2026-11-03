#!/usr/bin/env node

/**
 * @file seed-all-tables.js
 * @description Master Database Seeder for Beauty SaaS Platform.
 * Populates 2-3 realistic records for EVERY central database table/collection across the SaaS platform.
 * Keeps record count clean and minimal (2-3 items per table) as requested.
 *
 * Usage:
 *   node scripts/seed-all-tables.js
 *   npm run seed:all
 */

import bcrypt from 'bcrypt';
import { connectCentralDB, disconnectCentralDB } from '../src/database/central/central.connection.js';

// Central Models
import { SuperAdmin } from '../src/modules/auth/models/super-admin.model.js';
import { Tenant } from '../src/modules/superadmin/tenants/models/tenant.model.js';
import { Plan } from '../src/modules/superadmin/plans/models/plan.model.js';
import { Subscription } from '../src/modules/superadmin/subscriptions/models/subscription.model.js';
import { Feature, FeatureCategory } from '../src/modules/superadmin/features/models/feature.model.js';
import { Addon, TenantAddon } from '../src/modules/superadmin/addons/models/addon.model.js';
import { Domain } from '../src/modules/superadmin/domains/models/domain.model.js';
import { DatabaseRegistry } from '../src/modules/superadmin/databases/models/database.model.js';
import { Invoice, Transaction } from '../src/modules/superadmin/billing/models/billing.model.js';
import { Coupon } from '../src/modules/superadmin/coupons/models/coupon.model.js';
import { NotificationTemplate, NotificationLog } from '../src/modules/superadmin/notifications/models/notification.model.js';
import { SupportTicket } from '../src/modules/superadmin/support/models/support.model.js';
import { AuditLog } from '../src/modules/superadmin/audit-logs/models/audit-log.model.js';
import { BusinessVertical } from '../src/modules/superadmin/verticals/models/business-vertical.model.js';
import { WhiteLabelTheme } from '../src/modules/superadmin/themes/models/whitelabel-theme.model.js';
import { ServiceTemplate } from '../src/modules/superadmin/templates/models/service-template.model.js';
import { UsageLimit } from '../src/modules/superadmin/usage/models/usage.model.js';
import { PlatformSetting } from '../src/modules/superadmin/settings/models/settings.model.js';
import { hashPassword } from '../src/modules/auth/services/password.service.js';
import { ROLES } from '../src/modules/auth/constants/auth.constants.js';
import { seedDemoTenant } from './seed-demo-tenant.js';

export const seedAllTables = async () => {
  console.log('\n=============================================================');
  console.log('🚀 [SEEDER] Starting Master Beauty SaaS Database Seeder...');
  console.log('=============================================================\n');

  await connectCentralDB();

  // 1. SuperAdmin Accounts (2 records)
  console.log('1. Seeding SuperAdmin Accounts...');
  const masterPasswordHash = await hashPassword('SuperAdmin@Secure2026!');
  
  const superAdmins = [
    {
      name: 'Master Super Admin',
      email: 'superadmin@beautysaas.local',
      username: 'superadmin',
      passwordHash: masterPasswordHash,
      role: ROLES.SUPER_ADMIN,
      status: 'active',
      isEmailVerified: true,
    },
    {
      name: 'Operations Super Admin',
      email: 'ops.admin@beautysaas.local',
      username: 'opsadmin',
      passwordHash: masterPasswordHash,
      role: ROLES.SUPER_ADMIN,
      status: 'active',
      isEmailVerified: true,
    },
  ];

  for (const sa of superAdmins) {
    await SuperAdmin.findOneAndUpdate(
      { email: sa.email },
      { $set: sa },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ SuperAdmins seeded (2 accounts)');

  // 2. Tenants (3 records)
  console.log('2. Seeding Tenants (3 businesses: Salon, Spa, Academy)...');
  const tenantsData = [
    {
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
      storageConfig: {
        allowCustomCloudflare: true,
        provider: 'platform_default',
      },
      domainAccess: {
        customDomainAllowed: true,
        isDomainActive: true,
        restrictedMessage: 'Connect to Super Admin for access to your website portal.',
      },
      securityConfig: {
        whiteLabelEnabled: true,
        ipWhitelistEnabled: false,
        whitelistedIps: ['127.0.0.1', '::1'],
      },
      limits: { maxStaff: 50, maxBranches: 10, maxAppointmentsMonthly: 1000 },
    },
    {
      name: 'Serene Ayurveda & Day Spa',
      slug: 'serene-spa',
      code: 'SERENE',
      businessType: 'spa',
      theme: 'serene_emerald_zen',
      ownerName: 'Rajesh Sharma',
      email: 'serene@spawellness.local',
      phone: '9812345678',
      status: 'active',
      databaseMode: 'separate',
      storageConfig: {
        allowCustomCloudflare: true,
        provider: 'tenant_custom',
      },
      domainAccess: {
        customDomainAllowed: true,
        isDomainActive: true,
        restrictedMessage: 'Connect to Super Admin for access to your website portal.',
      },
      securityConfig: {
        whiteLabelEnabled: true,
        ipWhitelistEnabled: false,
        whitelistedIps: ['127.0.0.1'],
      },
      limits: { maxStaff: 100, maxBranches: 25, maxAppointmentsMonthly: 2000 },
    },
    {
      name: 'Glamour Cosmetology Academy',
      slug: 'glamour-academy',
      code: 'GLAMOUR',
      businessType: 'academy',
      theme: 'velvet_midnight_pro',
      ownerName: 'Ananya Gupta',
      email: 'info@glamouracademy.local',
      phone: '9765432109',
      status: 'trial',
      databaseMode: 'shared',
      storageConfig: {
        allowCustomCloudflare: false,
        provider: 'platform_default',
      },
      domainAccess: {
        customDomainAllowed: true,
        isDomainActive: true,
        restrictedMessage: 'Connect to Super Admin for access to your website portal.',
      },
      securityConfig: {
        whiteLabelEnabled: false,
        ipWhitelistEnabled: false,
      },
      limits: { maxStaff: 20, maxBranches: 3, maxAppointmentsMonthly: 500 },
    },
  ];

  const tenantDocs = [];
  for (const t of tenantsData) {
    const doc = await Tenant.findOneAndUpdate(
      { slug: t.slug },
      { $set: t },
      { upsert: true, new: true }
    );
    tenantDocs.push(doc);
  }
  console.log(`   ✓ Tenants seeded (${tenantDocs.length} records)`);

  // 3. Plans (3 records)
  console.log('3. Seeding Subscription Plans (3 tiers)...');
  const plansData = [
    {
      name: 'Starter Studio',
      slug: 'starter-studio',
      description: 'Essential management for single-location boutique studios and independent stylists.',
      priceMonthly: 49,
      priceYearly: 490,
      currency: 'INR',
      trialDays: 14,
      status: 'active',
      isPopular: false,
      features: ['online_booking', 'pos_billing', 'crm_clients', 'inventory_basic'],
      limits: {
        maxStaff: 5,
        maxBranches: 1,
        maxAppointmentsMonthly: 500,
        storageMb: 2048,
        customDomainAllowed: false,
        whiteLabelAllowed: false,
      },
    },
    {
      name: 'Growth Salon Pro',
      slug: 'growth-salon-pro',
      description: 'Advanced multi-chair salon operations with WhatsApp automation and custom domain.',
      priceMonthly: 99,
      priceYearly: 990,
      currency: 'INR',
      trialDays: 14,
      status: 'active',
      isPopular: true,
      features: ['online_booking', 'pos_billing', 'crm_clients', 'whatsapp_marketing', 'custom_domain'],
      limits: {
        maxStaff: 25,
        maxBranches: 5,
        maxAppointmentsMonthly: 2500,
        storageMb: 10240,
        customDomainAllowed: true,
        whiteLabelAllowed: true,
      },
    },
    {
      name: 'Enterprise Multi-Chain',
      slug: 'enterprise-chain',
      description: 'Comprehensive franchise operations with dedicated database and full white-labeling.',
      priceMonthly: 199,
      priceYearly: 1990,
      currency: 'INR',
      trialDays: 30,
      status: 'active',
      isPopular: false,
      features: ['online_booking', 'pos_billing', 'crm_clients', 'whatsapp_marketing', 'custom_domain', 'dedicated_db', 'franchise_reporting'],
      limits: {
        maxStaff: 100,
        maxBranches: 25,
        maxAppointmentsMonthly: 10000,
        storageMb: 51200,
        customDomainAllowed: true,
        whiteLabelAllowed: true,
      },
    },
  ];

  const planDocs = [];
  for (const p of plansData) {
    const doc = await Plan.findOneAndUpdate(
      { slug: p.slug },
      { $set: p },
      { upsert: true, new: true }
    );
    planDocs.push(doc);
  }
  console.log(`   ✓ Plans seeded (${planDocs.length} tiers)`);

  // 4. Subscriptions (3 records)
  console.log('4. Seeding Subscriptions (3 tenant active/trial subscriptions)...');
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const subscriptionsData = [
    {
      tenantId: tenantDocs[0]._id, // Blossom
      planId: planDocs[1]._id,     // Growth Salon Pro
      billingCycle: 'monthly',
      status: 'active',
      amount: 99,
      currency: 'INR',
      startDate: now,
      endDate: nextMonth,
      autoRenew: true,
    },
    {
      tenantId: tenantDocs[1]._id, // Serene Spa
      planId: planDocs[2]._id,     // Enterprise Multi-Chain
      billingCycle: 'yearly',
      status: 'active',
      amount: 1990,
      currency: 'INR',
      startDate: now,
      endDate: nextYear,
      autoRenew: true,
    },
    {
      tenantId: tenantDocs[2]._id, // Glamour Academy
      planId: planDocs[0]._id,     // Starter Studio
      billingCycle: 'monthly',
      status: 'trial',
      amount: 0,
      currency: 'INR',
      startDate: now,
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      trialEndsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      autoRenew: true,
    },
  ];

  const subDocs = [];
  for (const s of subscriptionsData) {
    const doc = await Subscription.findOneAndUpdate(
      { tenantId: s.tenantId },
      { $set: s },
      { upsert: true, new: true }
    );
    subDocs.push(doc);
  }
  console.log(`   ✓ Subscriptions seeded (${subDocs.length} records)`);

  // 5. Feature Categories (3 records) & Features (3 records)
  console.log('5. Seeding Feature Categories & Features...');
  const categoriesData = [
    { name: 'Core Operations', slug: 'core-operations', description: 'Essential day-to-day salon operations', order: 1 },
    { name: 'Marketing & Growth', slug: 'marketing-growth', description: 'Client acquisition & retention tools', order: 2 },
    { name: 'Enterprise & Security', slug: 'enterprise-security', description: 'Advanced security, white-label, and scale', order: 3 },
  ];

  const catDocs = [];
  for (const c of categoriesData) {
    const doc = await FeatureCategory.findOneAndUpdate(
      { slug: c.slug },
      { $set: c },
      { upsert: true, new: true }
    );
    catDocs.push(doc);
  }

  const featuresData = [
    {
      name: 'Online Appointment Booking Engine',
      slug: 'feat-online-booking',
      categoryId: catDocs[0]._id,
      description: 'Real-time multi-staff appointment scheduler with dynamic availability',
      status: 'active',
      isAddon: false,
    },
    {
      name: 'Automated WhatsApp Marketing & CRM',
      slug: 'feat-whatsapp-reminders',
      categoryId: catDocs[1]._id,
      description: 'Send automated appointment confirmation and birthday discount vouchers',
      status: 'active',
      isAddon: true,
      addonPriceMonthly: 15,
    },
    {
      name: 'Multi-Branch Central Inventory',
      slug: 'feat-central-inventory',
      categoryId: catDocs[2]._id,
      description: 'Track stock transfers, supplier POs, and barcode audits across branches',
      status: 'active',
      isAddon: false,
    },
  ];

  for (const f of featuresData) {
    await Feature.findOneAndUpdate(
      { slug: f.slug },
      { $set: f },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Feature categories & features seeded (3 categories, 3 features)');

  // 6. Addons (3 records) & TenantAddons (2 records)
  console.log('6. Seeding Add-ons & Tenant Assignments...');
  const addonsData = [
    {
      name: 'Extra 10,000 WhatsApp Credits',
      slug: 'addon-whatsapp-10k',
      description: 'High-volume WhatsApp promotional messaging pack for seasonal campaigns',
      priceMonthly: 15,
      priceYearly: 150,
      status: 'active',
      limitsBonus: { extraStaff: 0, extraBranches: 0, extraStorageMb: 0 },
    },
    {
      name: 'High-Speed Dedicated MongoDB Cluster Node',
      slug: 'addon-dedicated-db',
      description: 'Isolated enterprise database instance with dedicated IOPS and zero noisy-neighbor impact',
      priceMonthly: 50,
      priceYearly: 500,
      status: 'active',
      limitsBonus: { extraStaff: 10, extraBranches: 2, extraStorageMb: 20480 },
    },
    {
      name: 'White-Label Custom Mobile App (iOS & Android)',
      slug: 'addon-whitelabel-app',
      description: 'Branded mobile client app published under your own App Store & Play Store developer accounts',
      priceMonthly: 75,
      priceYearly: 750,
      status: 'active',
      limitsBonus: { extraStaff: 5, extraBranches: 1, extraStorageMb: 10240 },
    },
  ];

  const addonDocs = [];
  for (const a of addonsData) {
    const doc = await Addon.findOneAndUpdate(
      { slug: a.slug },
      { $set: a },
      { upsert: true, new: true }
    );
    addonDocs.push(doc);
  }

  // Tenant Addon assignments (2 records)
  await TenantAddon.findOneAndUpdate(
    { tenantId: tenantDocs[0]._id, addonId: addonDocs[0]._id },
    { $set: { status: 'active', activatedAt: now } },
    { upsert: true, new: true }
  );
  await TenantAddon.findOneAndUpdate(
    { tenantId: tenantDocs[1]._id, addonId: addonDocs[1]._id },
    { $set: { status: 'active', activatedAt: now } },
    { upsert: true, new: true }
  );
  console.log('   ✓ Addons & assignments seeded (3 addons, 2 tenant assignments)');

  // 7. Domains (3 records)
  console.log('7. Seeding Custom Domains (3 records)...');
  const domainsData = [
    {
      tenantId: tenantDocs[0]._id,
      domain: 'blossomluxurysalon.com',
      isCustom: true,
      isPrimary: true,
      status: 'active',
      sslStatus: 'active',
      sslExpiresAt: nextYear,
      verifiedAt: now,
      dnsRecords: [
        { type: 'CNAME', name: '@', expectedValue: 'cname.beautysaas.local', actualValue: 'cname.beautysaas.local', isVerified: true, verifiedAt: now },
      ],
    },
    {
      tenantId: tenantDocs[1]._id,
      domain: 'serene-wellness.spa',
      isCustom: true,
      isPrimary: true,
      status: 'pending',
      sslStatus: 'pending',
      dnsRecords: [
        { type: 'CNAME', name: '@', expectedValue: 'cname.beautysaas.local', actualValue: '', isVerified: false },
      ],
    },
    {
      tenantId: tenantDocs[2]._id,
      domain: 'glamouracademy.in',
      isCustom: true,
      isPrimary: true,
      status: 'active',
      sslStatus: 'active',
      sslExpiresAt: nextYear,
      verifiedAt: now,
      dnsRecords: [
        { type: 'CNAME', name: '@', expectedValue: 'cname.beautysaas.local', actualValue: 'cname.beautysaas.local', isVerified: true, verifiedAt: now },
      ],
    },
  ];

  for (const d of domainsData) {
    await Domain.findOneAndUpdate(
      { domain: d.domain },
      { $set: d },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Custom domains seeded (3 domains)');

  // 8. Database Registry (2 records)
  console.log('8. Seeding Database Registry (2 cluster nodes)...');
  const dbsData = [
    {
      name: 'Primary Multi-Tenant Shared Cluster',
      type: 'shared',
      databaseName: 'beauty_parlour_saas',
      host: 'cluster0.c4qroz0.mongodb.net',
      port: 27017,
      status: 'active',
      isDefault: true,
      maxTenants: 1000,
      tenantCount: 2,
      notes: 'MongoDB Atlas Tier M30 Multi-Tenant Shared Database',
    },
    {
      name: 'Dedicated Enterprise Node - Serene Spa',
      type: 'separate',
      databaseName: 'tenant_serene_spa',
      host: 'dedicated-node-01.beautysaas.local',
      port: 27017,
      status: 'active',
      isDefault: false,
      maxTenants: 1,
      tenantCount: 1,
      notes: 'Isolated NVMe SSD Mongo Node with TLS encryption',
    },
  ];

  for (const db of dbsData) {
    await DatabaseRegistry.findOneAndUpdate(
      { databaseName: db.databaseName },
      { $set: db },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Database registry seeded (2 cluster nodes)');

  // 9. Invoices (2 records) & Transactions (2 records)
  console.log('9. Seeding Invoices & Financial Transactions...');
  const invoicesData = [
    {
      invoiceNumber: 'INV-2026-001',
      tenantId: tenantDocs[0]._id,
      subscriptionId: subDocs[0]._id,
      amount: 99,
      taxAmount: 17.82,
      totalAmount: 116.82,
      currency: 'INR',
      status: 'paid',
      dueDate: new Date(now.getTime() + 7 * 86400000),
      paidAt: now,
      lineItems: [
        { description: 'Growth Salon Pro - Monthly Subscription Term', amount: 99, quantity: 1 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-002',
      tenantId: tenantDocs[1]._id,
      subscriptionId: subDocs[1]._id,
      amount: 1990,
      taxAmount: 358.20,
      totalAmount: 2348.20,
      currency: 'INR',
      status: 'paid',
      dueDate: new Date(now.getTime() + 14 * 86400000),
      paidAt: now,
      lineItems: [
        { description: 'Enterprise Multi-Chain - Annual Subscription Term', amount: 1990, quantity: 1 },
      ],
    },
  ];

  const invoiceDocs = [];
  for (const inv of invoicesData) {
    const doc = await Invoice.findOneAndUpdate(
      { invoiceNumber: inv.invoiceNumber },
      { $set: inv },
      { upsert: true, new: true }
    );
    invoiceDocs.push(doc);
  }

  const transactionsData = [
    {
      tenantId: tenantDocs[0]._id,
      subscriptionId: subDocs[0]._id,
      invoiceId: invoiceDocs[0]._id,
      amount: 116.82,
      currency: 'INR',
      status: 'succeeded',
      paymentMethod: 'card_visa',
      gatewayTransactionId: 'tx_stripe_984210',
      description: 'Growth Salon Pro Plan Term Renewal',
    },
    {
      tenantId: tenantDocs[1]._id,
      subscriptionId: subDocs[1]._id,
      invoiceId: invoiceDocs[1]._id,
      amount: 2348.20,
      currency: 'INR',
      status: 'succeeded',
      paymentMethod: 'razorpay_netbanking',
      gatewayTransactionId: 'tx_rzp_984211',
      description: 'Enterprise Multi-Chain Annual Subscription Settlement',
    },
  ];

  for (const tx of transactionsData) {
    await Transaction.findOneAndUpdate(
      { gatewayTransactionId: tx.gatewayTransactionId },
      { $set: tx },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Invoices & Transactions seeded (2 invoices, 2 transactions)');

  // 10. Promotional Coupons (3 records)
  console.log('10. Seeding Promotional Coupons (3 records)...');
  const couponsData = [
    {
      code: 'BEAUTY20',
      discountType: 'percentage',
      discountValue: 20,
      maxUses: 100,
      usedCount: 5,
      validFrom: now,
      validUntil: new Date(now.getTime() + 90 * 86400000),
      status: 'active',
      applicablePlans: [planDocs[0]._id, planDocs[1]._id],
    },
    {
      code: 'WELLNESS50',
      discountType: 'percentage',
      discountValue: 50,
      maxUses: 50,
      usedCount: 2,
      validFrom: now,
      validUntil: new Date(now.getTime() + 60 * 86400000),
      status: 'active',
      applicablePlans: [planDocs[1]._id, planDocs[2]._id],
    },
    {
      code: 'FLAT500',
      discountType: 'fixed',
      discountValue: 500,
      maxUses: 200,
      usedCount: 14,
      validFrom: now,
      validUntil: new Date(now.getTime() + 180 * 86400000),
      status: 'active',
      applicablePlans: [planDocs[2]._id],
    },
  ];

  for (const c of couponsData) {
    await Coupon.findOneAndUpdate(
      { code: c.code },
      { $set: c },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Promotional coupons seeded (3 codes: BEAUTY20, WELLNESS50, FLAT500)');

  // 11. Notification Templates (3 records) & Notification Logs (2 records)
  console.log('11. Seeding Notification Templates & Logs...');
  const templatesData = [
    {
      name: 'Salon Owner Welcome & Setup Guide',
      slug: 'welcome-email',
      channels: ['email'],
      subject: 'Welcome to Beauty SaaS - Complete your salon setup',
      body: 'Hi {{ownerName}}, your portal is ready! Access your dashboard at {{portalUrl}}.',
      variables: ['ownerName', 'portalUrl', 'businessName'],
      status: 'active',
    },
    {
      name: 'Subscription Payment Receipt',
      slug: 'subscription-receipt',
      channels: ['email', 'whatsapp'],
      subject: 'Payment Successful: Invoice {{invoiceNumber}}',
      body: 'Thank you for your payment of {{amount}} for {{planName}}.',
      variables: ['invoiceNumber', 'amount', 'planName'],
      status: 'active',
    },
    {
      name: 'Subscription Renewal Alert',
      slug: 'renewal-reminder',
      channels: ['email', 'sms'],
      subject: 'Action Required: Your subscription renews in 3 days',
      body: 'Dear {{ownerName}}, your plan {{planName}} will auto-renew on {{renewalDate}}.',
      variables: ['ownerName', 'planName', 'renewalDate'],
      status: 'active',
    },
  ];

  for (const tmpl of templatesData) {
    await NotificationTemplate.findOneAndUpdate(
      { slug: tmpl.slug },
      { $set: tmpl },
      { upsert: true, new: true }
    );
  }

  const logsData = [
    {
      tenantId: tenantDocs[0]._id,
      channel: 'email',
      recipient: 'admin@parlour.local',
      subject: 'Welcome to Beauty SaaS - Complete your salon setup',
      body: 'Hi Pooja Verma, your portal is ready at https://blossomluxurysalon.com',
      status: 'delivered',
      sentAt: now,
    },
    {
      tenantId: tenantDocs[1]._id,
      channel: 'email',
      recipient: 'serene@spawellness.local',
      subject: 'Payment Successful: Invoice INV-2026-002',
      body: 'Payment of INR 2,348.20 received via Razorpay Netbanking.',
      status: 'delivered',
      sentAt: now,
    },
  ];

  for (const l of logsData) {
    await NotificationLog.create(l);
  }
  console.log('   ✓ Notification templates & delivery logs seeded (3 templates, 2 logs)');

  // 12. Support Tickets (2 records)
  console.log('12. Seeding Support Helpdesk Tickets (2 records)...');
  const ticketsData = [
    {
      ticketNumber: 'TICK-1001',
      tenantId: tenantDocs[0]._id,
      subject: 'Assistance verifying CNAME record for custom domain',
      category: 'domain',
      priority: 'medium',
      status: 'open',
      messages: [
        {
          sender: 'Pooja Verma',
          senderRole: 'tenant_admin',
          message: 'Hello Support, we pointed blossomluxurysalon.com to cname.beautysaas.local. Can you check if SSL is ready?',
          createdAt: new Date(now.getTime() - 3600000),
        },
      ],
    },
    {
      ticketNumber: 'TICK-1002',
      tenantId: tenantDocs[1]._id,
      subject: 'Scheduled automated database backup inquiry',
      category: 'database',
      priority: 'low',
      status: 'resolved',
      messages: [
        {
          sender: 'Rajesh Sharma',
          senderRole: 'tenant_admin',
          message: 'What time are daily encrypted snapshots taken of our separate database?',
          createdAt: new Date(now.getTime() - 86400000),
        },
        {
          sender: 'Master Super Admin',
          senderRole: 'superadmin',
          message: 'Automated snapshots execute every night at 02:00 UTC and are retained for 30 days.',
          createdAt: new Date(now.getTime() - 80000000),
        },
      ],
    },
  ];

  for (const t of ticketsData) {
    await SupportTicket.findOneAndUpdate(
      { ticketNumber: t.ticketNumber },
      { $set: t },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Support tickets seeded (2 tickets)');

  // 13. Audit Logs (3 records)
  console.log('13. Seeding Administrative Audit Logs (3 records)...');
  const auditLogsData = [
    {
      actorEmail: 'superadmin@beautysaas.local',
      actorRole: 'superadmin',
      action: 'TENANT_PROVISIONED',
      resourceType: 'Tenant',
      resourceId: tenantDocs[0]._id.toString(),
      details: { tenantName: tenantDocs[0].name, slug: tenantDocs[0].slug, businessType: 'salon' },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Control Plane Admin)',
    },
    {
      actorEmail: 'superadmin@beautysaas.local',
      actorRole: 'superadmin',
      action: 'PLAN_MODIFIED',
      resourceType: 'Plan',
      resourceId: planDocs[1]._id.toString(),
      details: { planName: planDocs[1].name, newPrice: 99 },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Control Plane Admin)',
    },
    {
      actorEmail: 'superadmin@beautysaas.local',
      actorRole: 'superadmin',
      action: 'CUSTOM_DOMAIN_VERIFIED',
      resourceType: 'Domain',
      resourceId: 'blossomluxurysalon.com',
      details: { domain: 'blossomluxurysalon.com', ssl: 'active' },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Control Plane Admin)',
    },
  ];

  for (const a of auditLogsData) {
    await AuditLog.create(a);
  }
  console.log('   ✓ Audit logs seeded (3 audit records)');

  // 14. Business Verticals (3 records)
  console.log('14. Seeding Industry Verticals (3 records)...');
  const verticalsData = [
    {
      name: 'Hair & Beauty Salon',
      code: 'SALON',
      description: 'Full-service unisex hair styling, blowouts, manicures, and aesthetic beauty treatments.',
      icon: 'Scissors',
      bookingMode: 'CHAIR_BASED',
      allowedFeatures: ['online_booking', 'pos_billing', 'staff_management', 'crm_clients', 'inventory'],
      intakeFormRequired: false,
      defaultTheme: 'rose_gold_glamour',
      status: 'ACTIVE',
      isSystem: true,
    },
    {
      name: 'Luxury Day Spa & Wellness',
      code: 'SPA_MASSAGE',
      description: 'Holistic Ayurvedic therapies, hot stone massage, steam bath, and facial relaxation suites.',
      icon: 'Flower2',
      bookingMode: 'ROOM_BASED',
      allowedFeatures: ['online_booking', 'pos_billing', 'staff_management', 'crm_clients', 'room_scheduling'],
      intakeFormRequired: true,
      defaultTheme: 'serene_emerald_zen',
      status: 'ACTIVE',
      isSystem: true,
    },
    {
      name: 'Cosmetology & Makeup Academy',
      code: 'ACADEMY',
      description: 'Diploma vocational beauty training, batch schedules, certification exams, and student fees.',
      icon: 'GraduationCap',
      bookingMode: 'COURSE_BATCH',
      allowedFeatures: ['student_management', 'course_batches', 'fee_installments', 'attendance_tracking'],
      intakeFormRequired: true,
      defaultTheme: 'velvet_midnight_pro',
      status: 'ACTIVE',
      isSystem: true,
    },
  ];

  for (const v of verticalsData) {
    await BusinessVertical.findOneAndUpdate(
      { code: v.code },
      { $set: v },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Business verticals seeded (3 verticals: SALON, SPA_MASSAGE, ACADEMY)');

  // 15. WhiteLabel Themes (3 records)
  console.log('15. Seeding White-Label Theme Presets (3 records)...');
  const themesData = [
    {
      name: 'Rose Gold Glamour',
      code: 'rose_gold_glamour',
      targetVertical: 'SALON',
      previewImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      colors: {
        primary: '#E11D48',
        secondary: '#FB7185',
        accent: '#FDA4AF',
        background: '#0B0F19',
        surface: '#111827',
        card: 'rgba(17, 24, 39, 0.85)',
      },
      typography: {
        fontFamily: 'Plus Jakarta Sans',
        headingFont: 'Outfit',
      },
      isDefault: true,
      status: 'ACTIVE',
    },
    {
      name: 'Serene Emerald Zen',
      code: 'serene_emerald_zen',
      targetVertical: 'SPA_MASSAGE',
      previewImageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#34D399',
        background: '#06130E',
        surface: '#0B1F17',
        card: 'rgba(11, 31, 23, 0.85)',
      },
      typography: {
        fontFamily: 'Plus Jakarta Sans',
        headingFont: 'Outfit',
      },
      isDefault: false,
      status: 'ACTIVE',
    },
    {
      name: 'Velvet Midnight Pro',
      code: 'velvet_midnight_pro',
      targetVertical: 'ALL',
      previewImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#A855F7',
        background: '#080C15',
        surface: '#0F172A',
        card: 'rgba(15, 23, 42, 0.85)',
      },
      typography: {
        fontFamily: 'Plus Jakarta Sans',
        headingFont: 'Outfit',
      },
      isDefault: false,
      status: 'ACTIVE',
    },
  ];

  for (const th of themesData) {
    await WhiteLabelTheme.findOneAndUpdate(
      { code: th.code },
      { $set: th },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ White-label themes seeded (3 presets)');

  // 16. Service Catalog Templates (3 records)
  console.log('16. Seeding Service Catalog Templates (3 records)...');
  const serviceTemplatesData = [
    {
      verticalCode: 'SALON',
      category: 'Hair Styling & Cut',
      name: 'Signature Precision Hair Cut & Blowout',
      description: 'Consultation, scalp massage, master precision haircut and ionic shine blowout.',
      durationMinutes: 45,
      recommendedPrice: 35,
      targetAudience: 'ALL',
      status: 'ACTIVE',
    },
    {
      verticalCode: 'SPA_MASSAGE',
      category: 'Body Therapy',
      name: 'Deep Tissue Aromatherapy Herbal Massage',
      description: 'Stress-relief full body massage with warm organic lavender and cedarwood essential oils.',
      durationMinutes: 60,
      recommendedPrice: 75,
      targetAudience: 'ALL',
      status: 'ACTIVE',
    },
    {
      verticalCode: 'ACADEMY',
      category: 'Certifications',
      name: 'Master Bridal Makeup & Airbrush Certificate Course',
      description: 'Comprehensive 4-week professional course covering HD bridal and airbrush makeup techniques.',
      durationMinutes: 240,
      recommendedPrice: 450,
      targetAudience: 'STUDENTS',
      status: 'ACTIVE',
    },
  ];

  for (const st of serviceTemplatesData) {
    await ServiceTemplate.findOneAndUpdate(
      { name: st.name, verticalCode: st.verticalCode },
      { $set: st },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Service catalog templates seeded (3 templates)');

  // 17. Usage Limits (3 records)
  console.log('17. Seeding Usage Limits (3 records)...');
  const usageLimitsData = [
    {
      resourceName: 'Monthly Appointments',
      resourceKey: 'monthly_appointments',
      defaultLimit: 2500,
      unit: 'appointments',
      description: 'Total appointment bookings allowed per calendar billing cycle',
    },
    {
      resourceName: 'Staff & Stylist Accounts',
      resourceKey: 'staff_accounts',
      defaultLimit: 25,
      unit: 'seats',
      description: 'Total staff employee login credentials permitted across branches',
    },
    {
      resourceName: 'Cloud Storage Capacity',
      resourceKey: 'file_storage_mb',
      defaultLimit: 10240,
      unit: 'megabytes',
      description: 'Storage for client portfolio images, receipts, and consultation documents',
    },
  ];

  for (const ul of usageLimitsData) {
    await UsageLimit.findOneAndUpdate(
      { resourceKey: ul.resourceKey },
      { $set: ul },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Usage limits seeded (3 limits)');

  // 18. Platform Settings (4 categories)
  console.log('18. Seeding Platform Settings (4 categories)...');
  const settingsData = [
    {
      category: 'general',
      settings: {
        platformName: 'Beauty SaaS Control Plane',
        supportEmail: 'support@beautysaas.local',
        currency: 'INR',
        locale: 'en-IN',
        maintenanceMode: false,
      },
    },
    {
      category: 'branding',
      settings: {
        primaryColor: '#6366F1',
        accentColor: '#A855F7',
        portalTitle: 'Beauty & Wellness Cloud Control Plane',
        logoUrl: '',
        faviconUrl: '',
      },
    },
    {
      category: 'security',
      settings: {
        sessionTimeoutMinutes: 120,
        maxFailedLogins: 5,
        ipWhitelistEnabled: false,
        twoFactorRequired: false,
      },
    },
    {
      category: 'storage',
      settings: {
        provider: 'cloudflare_images',
        allowTenantCustomCredentials: true,
        maxFileSizeMb: 10,
      },
    },
  ];

  for (const ps of settingsData) {
    await PlatformSetting.findOneAndUpdate(
      { category: ps.category },
      { $set: ps },
      { upsert: true, new: true }
    );
  }
  console.log('   ✓ Platform settings seeded (4 categories)');

  // 19. Seed Demo Tenant Sub-data (Branches, Staff, Student, Customer)
  console.log('19. Seeding Demo Salon Sub-accounts (Admin, Staff, Student, Customer)...');
  await seedDemoTenant();
  console.log('   ✓ Demo salon internal data seeded');

  console.log('\n=============================================================');
  console.log('🎉 [SUCCESS] All Database Tables & Collections Successfully Seeded!');
  console.log('   - Exactly 2 to 3 clean records per table');
  console.log('   - Super Admin Master: superadmin@beautysaas.local / SuperAdmin@Secure2026!');
  console.log('   - Salon Admin: admin@parlour.local / Password123!');
  console.log('=============================================================\n');

  await disconnectCentralDB();
  process.exit(0);
};

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seed-all-tables.js')) {
  seedAllTables().catch((err) => {
    console.error('❌ [FATAL] Seeding failed with error:', err);
    process.exit(1);
  });
}
