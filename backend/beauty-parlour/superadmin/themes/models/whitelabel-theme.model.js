/**
 * @file whitelabel-theme.model.js
 * @description Central Schema for White-Label Theme Presets (Salon, Spa, Parlour, Makeup, Academy)
 */

import mongoose from 'mongoose';

const WhiteLabelThemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    targetVertical: {
      type: String,
      default: 'ALL',
    },
    previewImageUrl: {
      type: String,
      default: '',
    },
    colors: {
      primary: { type: String, default: '#6366F1' },
      secondary: { type: String, default: '#A855F7' },
      accent: { type: String, default: '#EC4899' },
      background: { type: String, default: '#0B0F19' },
      surface: { type: String, default: '#111827' },
      card: { type: String, default: 'rgba(17, 24, 39, 0.85)' },
    },
    typography: {
      fontFamily: { type: String, default: 'Plus Jakarta Sans' },
      headingFont: { type: String, default: 'Outfit' },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    collection: 'whitelabel_themes',
  }
);

WhiteLabelThemeSchema.index({ targetVertical: 1 });


export const WhiteLabelTheme = mongoose.models.WhiteLabelTheme || mongoose.model('WhiteLabelTheme', WhiteLabelThemeSchema);
export default WhiteLabelTheme;
