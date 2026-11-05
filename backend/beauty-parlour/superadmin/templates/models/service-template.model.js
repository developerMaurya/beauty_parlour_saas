/**
 * @file service-template.model.js
 * @description Central Schema for Pre-Seeded Industry Service Catalogues (Salon, Spa, Makeup, Academy)
 */

import mongoose from 'mongoose';

const ServiceTemplateSchema = new mongoose.Schema(
  {
    verticalCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    recommendedPrice: {
      type: Number,
      required: true,
      default: 50,
    },
    targetAudience: {
      type: String,
      enum: ['ALL', 'WOMEN_ONLY', 'MEN_ONLY', 'BRIDAL', 'STUDENTS'],
      default: 'ALL',
    },
    requirements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    collection: 'service_templates',
  }
);

ServiceTemplateSchema.index({ verticalCode: 1, category: 1 });
ServiceTemplateSchema.index({ name: 'text', description: 'text' });

export const ServiceTemplate = mongoose.models.ServiceTemplate || mongoose.model('ServiceTemplate', ServiceTemplateSchema);
export default ServiceTemplate;
