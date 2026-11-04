/**
 * @file seedCentralBillingAndNotifications.js
 * @description Seeds realistic billing records, invoices, transactions, and notifications for all tenants.
 */

import { connectCentralDatabase } from '../core/database/centralDatabase.js';
import { Tenant } from '../modules/superadmin/tenants/models/tenant.model.js';
import { Plan } from '../modules/superadmin/plans/models/plan.model.js';
import { Subscription } from '../modules/superadmin/subscriptions/models/subscription.model.js';
import { Transaction, Invoice } from '../modules/superadmin/billing/models/billing.model.js';
import { NotificationTemplate, NotificationLog } from '../modules/superadmin/notifications/models/notification.model.js';

async function seed() {
  console.log('Connecting to central database...');
  await connectCentralDatabase();

  const plans = await Plan.find().lean();
  const growthPlan = plans.find(p => p.slug === 'growth-salon-pro') || plans[1] || plans[0];
  const enterprisePlan = plans.find(p => p.slug === 'enterprise-chain') || plans[2] || plans[0];
  const starterPlan = plans.find(p => p.slug === 'starter-studio') || plans[0];

  const tenants = await Tenant.find();
  console.log(`Found ${tenants.length} tenants`);

  for (const t of tenants) {
    if (t.slug === 'blossom-salon') {
      t.planId = growthPlan._id;
      t.subdomain = 'blossom-salon';
      t.primaryDomain = 'blossom-luxury.com';
      t.status = 'active';
      t.trialExpiresAt = new Date(Date.now() + 25 * 86400000);
    } else if (t.slug === 'serene-spa') {
      t.planId = enterprisePlan._id;
      t.subdomain = 'serene-spa';
      t.primaryDomain = 'serene-wellness.local';
      t.status = 'active';
      t.trialExpiresAt = new Date(Date.now() + 12 * 86400000);
    } else if (t.slug === 'glamour-academy') {
      t.planId = growthPlan._id;
      t.subdomain = 'glamour-academy';
      t.primaryDomain = 'glamouracademy.in';
      t.status = 'active';
      t.trialExpiresAt = new Date(Date.now() + 3 * 86400000);
    } else {
      t.planId = starterPlan._id;
      t.subdomain = t.slug;
      t.status = 'active';
      t.trialExpiresAt = new Date(Date.now() + 14 * 86400000);
    }
    await t.save();

    // Ensure active subscription exists
    let sub = await Subscription.findOne({ tenantId: t._id });
    if (!sub) {
      sub = await Subscription.create({
        tenantId: t._id,
        planId: t.planId,
        billingCycle: 'monthly',
        status: 'active',
        amount: t.planId.equals(enterprisePlan._id) ? 1999 : 999,
        currency: 'INR',
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: t.trialExpiresAt,
        autoRenew: true,
      });
    } else {
      sub.planId = t.planId;
      sub.status = 'active';
      sub.endDate = t.trialExpiresAt;
      await sub.save();
    }
    t.subscriptionId = sub._id;
    await t.save();
  }

  console.log('Tenants & Subscriptions updated.');

  // Clear existing dummy invoices and transactions to replace with full realistic ledger
  await Invoice.deleteMany({});
  await Transaction.deleteMany({});

  const invoiceRecords = [
    {
      tenantSlug: 'blossom-salon',
      invoiceNumber: 'INV-2026-101',
      amount: 1999,
      taxAmount: 359.82,
      totalAmount: 2358.82,
      status: 'paid',
      dueDate: new Date(Date.now() - 15 * 86400000),
      paidAt: new Date(Date.now() - 15 * 86400000),
      description: 'Growth Salon Pro - Monthly Platform Subscription (October 2026)',
      paymentMethod: 'card_visa',
      txStatus: 'succeeded',
    },
    {
      tenantSlug: 'blossom-salon',
      invoiceNumber: 'INV-2026-102',
      amount: 1999,
      taxAmount: 359.82,
      totalAmount: 2358.82,
      status: 'paid',
      dueDate: new Date(Date.now() + 15 * 86400000),
      paidAt: new Date(),
      description: 'Growth Salon Pro - Monthly Platform Subscription (November 2026)',
      paymentMethod: 'razorpay_upi',
      txStatus: 'succeeded',
    },
    {
      tenantSlug: 'serene-spa',
      invoiceNumber: 'INV-2026-103',
      amount: 4999,
      taxAmount: 899.82,
      totalAmount: 5898.82,
      status: 'paid',
      dueDate: new Date(Date.now() - 18 * 86400000),
      paidAt: new Date(Date.now() - 18 * 86400000),
      description: 'Enterprise Multi-Chain - Branch & Multi-DB Cluster Add-on',
      paymentMethod: 'razorpay_netbanking',
      txStatus: 'succeeded',
    },
    {
      tenantSlug: 'serene-spa',
      invoiceNumber: 'INV-2026-104',
      amount: 4999,
      taxAmount: 899.82,
      totalAmount: 5898.82,
      status: 'unpaid',
      dueDate: new Date(Date.now() + 12 * 86400000),
      paidAt: null,
      description: 'Enterprise Multi-Chain - Renewal Term (November 2026)',
      paymentMethod: 'pending',
      txStatus: 'pending',
    },
    {
      tenantSlug: 'glamour-academy',
      invoiceNumber: 'INV-2026-105',
      amount: 2499,
      taxAmount: 449.82,
      totalAmount: 2948.82,
      status: 'paid',
      dueDate: new Date(Date.now() - 27 * 86400000),
      paidAt: new Date(Date.now() - 27 * 86400000),
      description: 'Academy Cosmetology Portal & Student Licensing (Term 1)',
      paymentMethod: 'stripe_card',
      txStatus: 'succeeded',
    },
    {
      tenantSlug: 'glamour-academy',
      invoiceNumber: 'INV-2026-106',
      amount: 2499,
      taxAmount: 449.82,
      totalAmount: 2948.82,
      status: 'overdue',
      dueDate: new Date(Date.now() - 2 * 86400000),
      paidAt: null,
      description: 'Academy Cosmetology Portal & Student Licensing (Term 2 Renewal)',
      paymentMethod: 'razorpay_upi',
      txStatus: 'failed',
    },
  ];

  for (const invData of invoiceRecords) {
    const tenant = tenants.find(t => t.slug === invData.tenantSlug);
    if (!tenant) continue;

    const invoice = await Invoice.create({
      invoiceNumber: invData.invoiceNumber,
      tenantId: tenant._id,
      amount: invData.amount,
      taxAmount: invData.taxAmount,
      totalAmount: invData.totalAmount,
      currency: 'INR',
      status: invData.status,
      dueDate: invData.dueDate,
      paidAt: invData.paidAt,
      lineItems: [
        {
          description: invData.description,
          amount: invData.amount,
          quantity: 1,
        },
      ],
    });

    await Transaction.create({
      tenantId: tenant._id,
      subscriptionId: tenant.subscriptionId,
      invoiceId: invoice._id,
      amount: invData.totalAmount,
      currency: 'INR',
      status: invData.txStatus,
      paymentMethod: invData.paymentMethod,
      gatewayTransactionId: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      description: invData.description,
      createdAt: invData.paidAt || invData.dueDate,
    });
  }

  console.log(`Seeded ${invoiceRecords.length} invoices and transactions.`);

  // Seed Notification Templates if missing
  const templates = [
    {
      name: 'Tenant Welcome & Onboarding',
      slug: 'tenant-welcome',
      channels: ['email', 'in_app', 'whatsapp'],
      subject: 'Welcome to Beauty SaaS Platform - Account Provisioned!',
      body: 'Hello {{tenantName}}, your salon cloud workspace and white-label booking portals are now active.',
      variables: ['tenantName', 'domain', 'loginUrl'],
      status: 'active',
    },
    {
      name: 'Subscription Expiry & Renewal Reminder',
      slug: 'subscription-renewal-reminder',
      channels: ['email', 'whatsapp', 'sms', 'in_app'],
      subject: 'Action Required: Your SaaS Subscription expires in {{daysLeft}} days',
      body: 'Dear {{ownerName}}, your subscription for {{tenantName}} expires on {{expiryDate}}. Renew to avoid service interruption.',
      variables: ['ownerName', 'tenantName', 'daysLeft', 'expiryDate', 'renewUrl'],
      status: 'active',
    },
    {
      name: 'Invoice Payment Confirmation',
      slug: 'invoice-payment-success',
      channels: ['email', 'whatsapp'],
      subject: 'Payment Received: Invoice {{invoiceNumber}} Settled',
      body: 'Thank you! Payment of {{amount}} for invoice {{invoiceNumber}} has been successfully processed.',
      variables: ['tenantName', 'invoiceNumber', 'amount', 'date'],
      status: 'active',
    },
    {
      name: 'Critical System Maintenance Advisory',
      slug: 'system-maintenance-alert',
      channels: ['in_app', 'email', 'sms'],
      subject: 'Notice: Scheduled Database Maintenance Window',
      body: 'Attention Admin: Scheduled central database indexing will occur this Sunday from 02:00 to 03:00 AM IST.',
      variables: ['date', 'duration'],
      status: 'active',
    },
  ];

  for (const tpl of templates) {
    await NotificationTemplate.findOneAndUpdate(
      { slug: tpl.slug },
      { $set: tpl },
      { upsert: true, new: true }
    );
  }

  // Seed realistic Notification Logs
  const logEntries = [
    {
      tenantSlug: 'blossom-salon',
      channel: 'whatsapp',
      recipient: '+91 98765 43210',
      subject: 'Renewal Confirmation WhatsApp',
      body: 'Blossom Luxury Salon: Your November monthly subscription payment of ₹2,358.82 was successfully received via Razorpay UPI.',
      status: 'delivered',
      sentAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      tenantSlug: 'glamour-academy',
      channel: 'email',
      recipient: 'info@glamouracademy.local',
      subject: 'Urgent: Subscription Renewal Notice (3 Days Left)',
      body: 'Your Glamour Cosmetology Academy subscription will expire on 07 Nov 2026. Please settle Invoice INV-2026-106.',
      status: 'delivered',
      sentAt: new Date(Date.now() - 3600000 * 8),
    },
    {
      tenantSlug: 'serene-spa',
      channel: 'sms',
      recipient: '+91 98111 22334',
      subject: 'Security Alert: New IP Login',
      body: 'Serene Spa Admin: A successful login was verified from IP 103.21.244.15 (Delhi NCR).',
      status: 'delivered',
      sentAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      tenantSlug: 'blossom-salon',
      channel: 'in_app',
      recipient: 'admin@parlour.local',
      subject: 'New Feature: AI WhatsApp Customer Assistant Enabled',
      body: 'Your salon workspace now includes automated appointment reminders via WhatsApp.',
      status: 'delivered',
      sentAt: new Date(Date.now() - 3600000 * 48),
    },
  ];

  for (const log of logEntries) {
    const tenant = tenants.find(t => t.slug === log.tenantSlug);
    await NotificationLog.create({
      tenantId: tenant ? tenant._id : null,
      channel: log.channel,
      recipient: log.recipient,
      subject: log.subject,
      body: log.body,
      status: log.status,
      sentAt: log.sentAt,
    });
  }

  console.log('Seeded notification templates and logs successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

