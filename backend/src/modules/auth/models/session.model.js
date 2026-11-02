/**
 * @file session.model.js
 * @description Mongoose model definition for user authentication sessions and refresh tokens.
 * @module backend/src/modules/auth/models/session.model
 */

import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userModel',
      index: true,
    },
    userModel: {
      type: String,
      required: true,
      enum: ['SuperAdmin', 'Admin', 'Staff', 'Student', 'Customer', 'TenantUser'],
      default: 'SuperAdmin',
    },
    userRole: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
    revokedReason: {
      type: String,
      default: null,
    },
    replacedByTokenHash: {
      type: String,
      default: null,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB TTL index to automatically prune expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for querying active sessions by user
SessionSchema.index({ userId: 1, revokedAt: 1 });

SessionSchema.methods.isRevoked = function () {
  return Boolean(this.revokedAt);
};

SessionSchema.methods.isExpired = function () {
  return this.expiresAt.getTime() < Date.now();
};

export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);

export default Session;
