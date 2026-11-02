/**
 * @file feature.model.js
 * @description Central Mongoose Models for SaaS Features and Feature Categories.
 * @module backend/src/modules/superadmin/features/models/feature.model
 */

import mongoose from 'mongoose';

const FeatureCategorySchema = new mongoose.Schema(
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
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const FeatureSchema = new mongoose.Schema(
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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeatureCategory',
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
    isAddon: {
      type: Boolean,
      default: false,
    },
    addonPriceMonthly: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const FeatureCategory =
  mongoose.models.FeatureCategory || mongoose.model('FeatureCategory', FeatureCategorySchema);
export const Feature = mongoose.models.Feature || mongoose.model('Feature', FeatureSchema);

export default {
  FeatureCategory,
  Feature,
};
