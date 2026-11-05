/**
 * @file password-reset.model.js
 * @description Mongoose model for single-use cryptographic password reset tokens.
 * @module backend/src/modules/auth/models/password-reset.model
 */

import mongoose from 'mongoose';

const PasswordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'SuperAdmin',
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatic TTL cleanup when token expires
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

PasswordResetSchema.methods.isValid = function () {
  return !this.usedAt && this.expiresAt.getTime() > Date.now();
};

export const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);

export default PasswordReset;
