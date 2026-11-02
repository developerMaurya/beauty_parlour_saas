/**
 * @file usage.model.js
 * @description Central Mongoose Model for Platform and Tenant Resource Usage Limits.
 * @module backend/src/modules/superadmin/usage/models/usage.model
 */

import mongoose from 'mongoose';

const UsageLimitSchema = new mongoose.Schema(
  {
    resourceName: {
      type: String,
      required: true,
      trim: true,
    },
    resourceKey: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    defaultLimit: {
      type: Number,
      required: true,
      default: 100,
    },
    unit: {
      type: String,
      default: 'count',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const UsageLimit =
  mongoose.models.UsageLimit || mongoose.model('UsageLimit', UsageLimitSchema);
export default UsageLimit;
