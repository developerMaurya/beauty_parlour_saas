import { Transaction, Invoice, Refund } from '../models/billing.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const billingController = {
  async getOverview(_req, res, next) {
    try {
      const [totalTransactions, totalInvoices, totalRefunds, revenueSum] = await Promise.all([
        Transaction.countDocuments(),
        Invoice.countDocuments(),
        Refund.countDocuments(),
        Transaction.aggregate([{ $match: { status: 'succeeded' } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
      ]);

      return sendSuccess(res, 'Billing overview', {
        totalRevenue: revenueSum[0]?.sum || 0,
        totalTransactions,
        totalInvoices,
        totalRefunds,
      });
    } catch (e) { next(e); }
  },

  async listTransactions(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '15', 10);

      const total = await Transaction.countDocuments();
      const items = await Transaction.find().populate('tenantId', 'name slug email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      return sendSuccess(res, 'Transactions retrieved', { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (e) { next(e); }
  },

  async getTransactionById(req, res, next) {
    try {
      const tx = await Transaction.findById(req.params.transactionId).populate('tenantId');
      if (!tx) return sendError(res, 'Transaction not found', [], 404);
      return sendSuccess(res, 'Transaction details', tx);
    } catch (e) { next(e); }
  },

  async listInvoices(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '15', 10);

      const total = await Invoice.countDocuments();
      const items = await Invoice.find().populate('tenantId', 'name slug email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      return sendSuccess(res, 'Invoices retrieved', { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (e) { next(e); }
  },

  async createInvoice(req, res, next) {
    try {
      const { tenantId, amount, lineItems = [] } = req.body;
      const invoiceNumber = `INV-${Date.now()}`;
      const taxAmount = Math.round(amount * 0.18);
      const totalAmount = amount + taxAmount;

      const invoice = await Invoice.create({
        invoiceNumber,
        tenantId,
        amount,
        taxAmount,
        totalAmount,
        lineItems: lineItems.length ? lineItems : [{ description: 'Platform Services', amount, quantity: 1 }],
      });

      return sendSuccess(res, 'Invoice generated', invoice, 201);
    } catch (e) { next(e); }
  },

  async getInvoiceById(req, res, next) {
    try {
      const inv = await Invoice.findById(req.params.invoiceId).populate('tenantId');
      if (!inv) return sendError(res, 'Invoice not found', [], 404);
      return sendSuccess(res, 'Invoice details', inv);
    } catch (e) { next(e); }
  },

  async updateInvoice(req, res, next) {
    try {
      const inv = await Invoice.findByIdAndUpdate(req.params.invoiceId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Invoice updated', inv);
    } catch (e) { next(e); }
  },

  async listRefunds(req, res, next) {
    try {
      const refunds = await Refund.find().populate('tenantId', 'name slug email').sort({ createdAt: -1 });
      return sendSuccess(res, 'Refunds retrieved', refunds);
    } catch (e) { next(e); }
  },

  async createRefund(req, res, next) {
    try {
      const { transactionId, amount, reason } = req.body;
      const tx = await Transaction.findById(transactionId);
      if (!tx) return sendError(res, 'Transaction not found', [], 404);

      const refund = await Refund.create({
        transactionId: tx._id,
        invoiceId: tx.invoiceId,
        tenantId: tx.tenantId,
        amount: amount || tx.amount,
        reason: reason || 'Customer refund',
        status: 'succeeded',
      });

      tx.status = 'refunded';
      await tx.save();

      return sendSuccess(res, 'Refund processed successfully', refund, 201);
    } catch (e) { next(e); }
  },

  async getRevenueReport(_req, res, next) {
    try {
      const total = await Transaction.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, sum: { $sum: '$amount' } } },
      ]);
      return sendSuccess(res, 'Revenue report', { totalRevenue: total[0]?.sum || 0 });
    } catch (e) { next(e); }
  },
};

export default billingController;
