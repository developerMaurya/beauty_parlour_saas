/**
 * @file business-vertical.model.js
 * @description Central Schema for SaaS Industry Verticals (Salon, Spa, Parlour, Makeup, Academy)
 */

import mongoose from 'mongoose';

const BusinessVerticalSchema = new mongoose.Schema(
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
    bookingMode: {
      type: String,
      enum: ['CHAIR_BASED', 'ROOM_BASED', 'APPOINTMENT_SLOT', 'COURSE_BATCH'],
      default: 'APPOINTMENT_SLOT',
    },
    allowedFeatures: {
      type: [String],
      default: ['online_booking', 'pos_billing', 'staff_management', 'crm_clients', 'inventory'],
    },
    intakeFormRequired: {
      type: Boolean,
      default: false,
    },
    defaultTheme: {
      type: String,
      default: 'rose_gold_glamour',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'business_verticals',
  }
);

BusinessVerticalSchema.index({ status: 1 });


export const BusinessVertical = mongoose.models.BusinessVertical || mongoose.model('BusinessVertical', BusinessVerticalSchema);
export default BusinessVertical;
