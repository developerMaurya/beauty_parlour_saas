/**
 * @file subscription.model.js
 * @description Central Mongoose Model for Tenant Subscriptions.
 * @module backend/src/modules/superadmin/subscriptions/models/subscription.model
 */

import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      default: 'monthly',
    },
    status: {
      type: String,
      enum: ['active', 'trial', 'past_due', 'cancelled', 'expired'],
      default: 'trial',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    trialEndsAt: {
      type: Date,
      default: null,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription =
  mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
export default Subscription;
