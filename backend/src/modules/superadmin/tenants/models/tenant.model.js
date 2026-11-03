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
      enum: ['active', 'inactive', 'trial', 'suspended'],
      default: 'trial',
      index: true,
    },
    suspendedReason: {
      type: String,
      default: null,
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
      provider: { type: String, enum: ['platform_default', 'custom_cloudflare'], default: 'platform_default' },
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
