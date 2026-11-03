/**
 * @file settings.model.js
 * @description Central Mongoose Model for Global Platform Settings.
 * @module backend/src/modules/superadmin/settings/models/settings.model
 */

import mongoose from 'mongoose';

const PlatformSettingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['general', 'branding', 'email', 'payment', 'notifications', 'security', 'domains', 'databases', 'storage'],
      unique: true,
      index: true,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const PlatformSetting =
  mongoose.models.PlatformSetting || mongoose.model('PlatformSetting', PlatformSettingSchema);
export default PlatformSetting;
