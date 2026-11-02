/**
 * @file addon.model.js
 * @description Central Mongoose Models for Add-ons and Tenant Add-on Assignments.
 * @module backend/src/modules/superadmin/addons/models/addon.model
 */

import mongoose from 'mongoose';

const AddonSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    limitsBonus: {
      extraStaff: { type: Number, default: 0 },
      extraBranches: { type: Number, default: 0 },
      extraStorageMb: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const TenantAddonSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    addonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Addon',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    pricePaid: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Addon = mongoose.models.Addon || mongoose.model('Addon', AddonSchema);
export const TenantAddon =
  mongoose.models.TenantAddon || mongoose.model('TenantAddon', TenantAddonSchema);

export default {
  Addon,
  TenantAddon,
};
