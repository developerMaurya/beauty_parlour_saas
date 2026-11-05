/**
 * @file master-entry.model.js
 * @description Central Schema for Super Admin Master Data Entries
 * Categories include:
 * - VERTICAL: Industry business types (Salon, Spa, Nails, Academy)
 * - SERVICE_CATEGORY: Master service groups (Hair, Skin, Bridal, Massage)
 * - EXECUTIVE_ROLE: Standard organizational roles (Regional Director, Franchise Owner, Salon Manager)
 * - TAX_SLAB: Applicable taxes (GST 18%, VAT 5%, Service Tax)
 * - CURRENCY: Supported currencies (INR, USD, EUR, AED)
 * - PLAN_FEATURE: Feature tags assignable to SaaS plans
 */

import mongoose from 'mongoose';

const MasterEntrySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for uniqueness within category
MasterEntrySchema.index({ category: 1, code: 1 }, { unique: true });

export const MasterEntry =
  mongoose.models.MasterEntry || mongoose.model('MasterEntry', MasterEntrySchema);

export default MasterEntry;

