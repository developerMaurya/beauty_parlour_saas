/**
 * @file billing.model.js
 * @description Central Mongoose Models for SaaS Billing, Invoices, Transactions, and Refunds.
 * @module backend/src/modules/superadmin/billing/models/billing.model
 */

import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['succeeded', 'pending', 'failed', 'refunded'],
      default: 'succeeded',
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'card',
    },
    gatewayTransactionId: {
      type: String,
      default: () => `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      unique: true,
    },
    description: {
      type: String,
      default: 'Subscription payment',
    },
  },
  {
    timestamps: true,
  }
);

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
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
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'overdue', 'void'],
      default: 'paid',
      index: true,
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    lineItems: [
      {
        description: String,
        amount: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const RefundSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    reason: {
      type: String,
      default: 'Customer requested refund',
    },
    status: {
      type: String,
      enum: ['succeeded', 'pending', 'failed'],
      default: 'succeeded',
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction =
  mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export const Refund = mongoose.models.Refund || mongoose.model('Refund', RefundSchema);

export default {
  Transaction,
  Invoice,
  Refund,
};
