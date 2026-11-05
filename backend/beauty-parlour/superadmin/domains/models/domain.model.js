/**
 * @file domain.model.js
 * @description Central Mongoose Model for Subdomains and Custom White-Label Domains.
 * @module backend/src/modules/superadmin/domains/models/domain.model
 */

import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'failed', 'active'],
      default: 'pending',
      index: true,
    },
    dnsRecords: [
      {
        type: { type: String, enum: ['A', 'CNAME', 'TXT'], default: 'CNAME' },
        name: String,
        expectedValue: String,
        actualValue: String,
        isVerified: { type: Boolean, default: false },
        verifiedAt: Date,
      },
    ],
    sslStatus: {
      type: String,
      enum: ['pending', 'active', 'failed', 'expired'],
      default: 'pending',
    },
    sslExpiresAt: {
      type: Date,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Domain = mongoose.models.Domain || mongoose.model('Domain', DomainSchema);
export default Domain;
