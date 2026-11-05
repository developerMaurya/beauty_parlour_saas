/**
 * @file tenant.model.js
 * @description Central Mongoose Model for SaaS Tenants.
 * @module backend/src/modules/superadmin/tenants/models/tenant.model
 */

import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug/code is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    businessType: {
      type: String,
      default: 'salon',
    },
    theme: {
      type: String,
      default: 'rose_gold_glamour',
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerDob: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'IN' },
      postalCode: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'trial', 'suspended', 'pending'],
      default: 'trial',
      index: true,
    },
    suspendedReason: {
      type: String,
      default: null,
    },
    kycStatus: {
      type: String,
      enum: ['not_required', 'pending', 'verified', 'rejected'],
      default: 'not_required',
      index: true,
    },
    kycDetails: {
      idType: { type: String, default: '' },
      idNumber: { type: String, default: '' },
      pan: { type: String, default: '' },
      gstin: { type: String, default: '' },
      docUrl: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
      reviewedAt: { type: Date, default: null },
      reviewerNotes: { type: String, default: '' },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    purchaseModel: {
      type: String,
      enum: ['direct_buy', 'demo_request', 'free_trial'],
      default: 'direct_buy',
    },
    onboardingStep: {
      type: Number,
      default: 7,
    },
    databaseMode: {
      type: String,
      enum: ['shared', 'separate', 'custom_uri'],
      default: 'shared',
      required: true,
    },
    databaseConfig: {
      databaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'DatabaseRegistry', default: null },
      databaseName: { type: String, default: 'beauty_saas_shared' },
      uri: { type: String, default: null },
      allowCustomDatabase: { type: Boolean, default: false },
      customUri: { type: String, default: null },
      connectionStatus: { type: String, default: 'connected' },
      lastProvisionedAt: { type: Date, default: null },
    },
    storageConfig: {
      allowCustomCloudflare: { type: Boolean, default: false }, // Controlled by SuperAdmin
      provider: {
        type: String,
        enum: ['platform_default', 'custom_cloudflare', 'tenant_custom', 'cloudflare', 's3', 'local', 'custom'],
        default: 'platform_default',
      },
      cloudflareApiToken: { type: String, default: null },
      cloudflareApiUrl: { type: String, default: null },
    },
    domainAccess: {
      customDomainAllowed: { type: Boolean, default: false }, // Controlled by SuperAdmin
      isDomainActive: { type: Boolean, default: true },       // Controlled by SuperAdmin
      restrictedMessage: {
        type: String,
        default: 'Connect to Super Admin for access to your website portal.',
      },
    },
    securityConfig: {
      ipWhitelistEnabled: { type: Boolean, default: false },
      whitelistedIps: [{ type: String, trim: true }],
      allowedOrigins: [{ type: String, trim: true }],
      whiteLabelEnabled: { type: Boolean, default: true },
    },
    permissions: {
      appointments: { type: Boolean, default: true },
      customerManagement: { type: Boolean, default: true },
      staffManagement: { type: Boolean, default: true },
      inventory: { type: Boolean, default: false },
      financialReports: { type: Boolean, default: false },
      payroll: { type: Boolean, default: false },
      academyModule: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
      customDomain: { type: Boolean, default: false },
      customCloudflare: { type: Boolean, default: false },
      customDatabase: { type: Boolean, default: false },
      ipWhitelist: { type: Boolean, default: false },
      multiBranch: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      webhooks: { type: Boolean, default: false },
      dataExport: { type: Boolean, default: true },
      whiteLabelBranding: { type: Boolean, default: true },
    },
    masterAdmin: {
      assignedMasterId: { type: mongoose.Schema.Types.ObjectId, ref: 'TenantUser', default: null },
      masterAdminName: { type: String, default: '' },
      masterAdminEmail: { type: String, default: '' },
      masterRole: { type: String, default: 'General Master Manager' },
      assignedAt: { type: Date, default: null },
      notes: { type: String, default: '' },
    },
    blockSecurity: {
      isBlocked: { type: Boolean, default: false },
      blockType: {
        type: String,
        enum: ['none', 'login_only', 'api_only', 'notifications_only', 'full_account', 'blacklist'],
        default: 'none',
      },
      reason: { type: String, default: '' },
      blockedAt: { type: Date, default: null },
      blockedBy: { type: String, default: 'Super Admin' },
      isPermanent: { type: Boolean, default: true },
      autoUnblockDate: { type: Date, default: null },
      blockHistory: [
        {
          action: String,
          blockType: String,
          reason: String,
          timestamp: { type: Date, default: Date.now },
          performedBy: String,
        },
      ],
    },
    devices: [
      {
        deviceId: { type: String, required: true },
        deviceName: { type: String, default: 'Browser / Desktop' },
        os: { type: String, default: 'Web / Linux' },
        browser: { type: String, default: 'Chrome' },
        fcmToken: { type: String, default: '' },
        tokenStatus: { type: String, enum: ['active', 'expired', 'disabled', 'revoked'], default: 'active' },
        notificationsEnabled: { type: Boolean, default: true },
        appVersion: { type: String, default: 'v2.4.0' },
        lastActiveAt: { type: Date, default: Date.now },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      default: null,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    primaryDomain: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    subdomain: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    provisioningStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'retry_required'],
      default: 'pending',
    },
    provisioningJobId: {
      type: String,
      default: null,
    },
    branding: {
      companyName: { type: String, default: '' },
      portalTitle: { type: String, default: '' },
      logoUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '' },
      primaryColor: { type: String, default: '#e11d48' },
      secondaryColor: { type: String, default: '#4f46e5' },
      supportEmail: { type: String, default: '' },
      supportPhone: { type: String, default: '' },
    },
    limits: {
      maxStaff: { type: Number, default: 5 },
      maxBranches: { type: Number, default: 1 },
      maxAppointmentsMonthly: { type: Number, default: 500 },
      storageMb: { type: Number, default: 1024 },
    },
  },
  {
    timestamps: true,
  }
);

export const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
export default Tenant;
