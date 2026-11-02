/**
 * @file plan.model.js
 * @description Central Mongoose Model for SaaS Subscription Plans.
 * @module backend/src/modules/superadmin/plans/models/plan.model
 */

import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    priceMonthly: {
      type: Number,
      required: true,
      default: 0,
    },
    priceYearly: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    trialDays: {
      type: Number,
      default: 14,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
      index: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    features: [
      {
        type: String,
      },
    ],
    limits: {
      maxStaff: { type: Number, default: 5 },
      maxBranches: { type: Number, default: 1 },
      maxAppointmentsMonthly: { type: Number, default: 500 },
      storageMb: { type: Number, default: 1024 },
      customDomainAllowed: { type: Boolean, default: false },
      whiteLabelAllowed: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
export default Plan;
