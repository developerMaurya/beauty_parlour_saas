/**
 * @file verification.model.js
 * @description Central Mongoose Models for Business KYC Verifications and Tenant Inbound Requests.
 * @module backend/src/modules/superadmin/verifications/models/verification.model
 */

import mongoose from 'mongoose';

/**
 * BusinessVerification Schema
 * Manages optional or compliance-required KYC documents per business tenant.
 */
const BusinessVerificationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
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
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['not_required', 'pending', 'verified', 'rejected'],
      default: 'not_required',
      index: true,
    },
    idType: {
      type: String,
      enum: ['aadhaar', 'pan', 'voter_id', 'passport', 'business_registration', 'other'],
      default: 'pan',
    },
    idNumber: {
      type: String,
      trim: true,
      default: '',
    },
    pan: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    documentBackUrl: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    reviewerNotes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * TenantRequest Schema
 * Manages Model B: Custom Enterprise Requests, Request a Demo, and Contact Sales submissions.
 */
const TenantRequestSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
      trim: true,
    },
    serviceCategory: {
      type: String,
      default: 'software-saas',
    },
    requestType: {
      type: String,
      enum: ['demo_request', 'custom_whitelabel', 'enterprise_pricing', 'general_inquiry'],
      default: 'demo_request',
    },
    estimatedBranches: {
      type: Number,
      default: 1,
    },
    requirements: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'proposal_sent', 'converted', 'closed'],
      default: 'pending',
      index: true,
    },
    proposalNotes: {
      type: String,
      default: '',
    },
    quotedAmount: {
      type: Number,
      default: 0,
    },
    handledBy: {
      type: String,
      default: null,
    },
    convertedTenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const BusinessVerification =
  mongoose.models.BusinessVerification ||
  mongoose.model('BusinessVerification', BusinessVerificationSchema);

export const TenantRequest =
  mongoose.models.TenantRequest ||
  mongoose.model('TenantRequest', TenantRequestSchema);

export default { BusinessVerification, TenantRequest };

