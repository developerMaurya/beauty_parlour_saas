/**
 * @file support.model.js
 * @description Central Mongoose Model for Super Admin Support Ticket Management.
 * @module backend/src/modules/superadmin/support/models/support.model
 */

import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
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
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['billing', 'technical', 'database', 'domain', 'feature_request', 'other'],
      default: 'technical',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    messages: [
      {
        sender: { type: String, required: true },
        senderRole: { type: String, enum: ['superadmin', 'tenant_admin', 'user'], default: 'tenant_admin' },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const SupportTicket =
  mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
export default SupportTicket;
