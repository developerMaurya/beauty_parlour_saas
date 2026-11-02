/**
 * @file notification.model.js
 * @description Central Mongoose Models for Notification Templates and Dispatch Logs.
 * @module backend/src/modules/superadmin/notifications/models/notification.model
 */

import mongoose from 'mongoose';

const NotificationTemplateSchema = new mongoose.Schema(
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
    channels: [
      {
        type: String,
        enum: ['email', 'sms', 'whatsapp', 'in_app'],
      },
    ],
    subject: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      required: true,
    },
    variables: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const NotificationLogSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      default: null,
      index: true,
    },
    channel: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'in_app'],
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent',
    },
    error: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationTemplate =
  mongoose.models.NotificationTemplate ||
  mongoose.model('NotificationTemplate', NotificationTemplateSchema);

export const NotificationLog =
  mongoose.models.NotificationLog || mongoose.model('NotificationLog', NotificationLogSchema);

export default {
  NotificationTemplate,
  NotificationLog,
};
