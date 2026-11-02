/**
 * @file provisioning.model.js
 * @description Central Mongoose Model for Tenant Provisioning Jobs.
 * @module backend/src/modules/superadmin/provisioning/models/provisioning.model
 */

import mongoose from 'mongoose';

const ProvisioningJobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'retry_required', 'cancelled'],
      default: 'pending',
      index: true,
    },
    steps: [
      {
        step: String,
        status: String,
        databaseName: String,
        collections: [String],
        adminEmail: String,
        error: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    attempts: {
      type: Number,
      default: 1,
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const ProvisioningJob =
  mongoose.models.ProvisioningJob || mongoose.model('ProvisioningJob', ProvisioningJobSchema);
export default ProvisioningJob;
