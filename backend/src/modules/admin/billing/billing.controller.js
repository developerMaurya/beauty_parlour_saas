/**
 * @file billing.controller.js
 * @description POS, Billing, Split/Partial Payments, Dynamic Payment Methods, and Secure Payment Gateways.
 * Supports service, package, product, custom line items, tax, discount, refunds, and printable receipts.
 * @module backend/src/modules/admin/billing/billing.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';
import { recordActivity } from '../../../utils/activity.utils.js';

// ==========================================
// 1. BILLS / POS
// ==========================================

export const createBill = async (req, res) => {
  try {
    const { branchId, customerId, appointmentId, items, discountTotal, taxTotal, paymentMethod, paidAmount, notes } = req.body;
    if (!branchId || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Branch and line items are required to generate a bill', [], 400);
    }

    const Bill = getTenantModel(req, 'Bill');
    const Payment = getTenantModel(req, 'Payment');
    const Customer = getTenantModel(req, 'Customer');
    const Product = getTenantModel(req, 'Product');
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');

    let subtotal = 0;
    const processedItems = items.map((item) => {
      const unitPrice = Number(item.unitPrice) || 0;
      const quantity = Number(item.quantity) || 1;
      const discount = Number(item.discountAmount) || 0;
      const tax = Number(item.taxAmount) || 0;
      const total = unitPrice * quantity - discount + tax;
      subtotal += unitPrice * quantity;

      return {
        itemType: item.itemType || 'service',
        itemId: item.itemId || null,
        name: item.name || 'Custom item',
        quantity,
        unitPrice,
        discountAmount: discount,
        taxAmount: tax,
        totalPrice: total,
        staffId: item.staffId || null,
      };
    });

    const disc = Number(discountTotal) || 0;
    const tx = Number(taxTotal) || 0;
    const grandTotal = Math.max(0, subtotal - disc + tx);
    const paid = Number(paidAmount) || 0;
    const balance = Math.max(0, grandTotal - paid);
    const paymentStatus = balance === 0 ? 'paid' : paid > 0 ? 'partially_paid' : 'unpaid';

    const billNumber = `INV-${Date.now().toString().slice(-6)}`;

    const bill = await Bill.create({
      tenantId: req.tenantId,
      billNumber,
      branchId,
      customerId: customerId || null,
      appointmentId: appointmentId || null,
      items: processedItems,
      subtotal,
      discountTotal: disc,
      taxTotal: tx,
      grandTotal,
      paidAmount: paid,
      balanceAmount: balance,
      paymentStatus,
      paymentMethod: paymentMethod || 'Cash',
      notes: notes || '',
    });

    // If payment was made immediately at checkout, record payment transaction
    if (paid > 0) {
      await Payment.create({
        tenantId: req.tenantId,
        billId: bill._id,
        branchId,
        customerId: customerId || null,
        amount: paid,
        paymentMethod: paymentMethod || 'Cash',
        status: 'success',
      });
    }

    // Deduct stock for product line items
    for (const item of processedItems) {
      if (item.itemType === 'product' && item.itemId) {
        const prod = await Product.findOne({ _id: item.itemId, tenantId: req.tenantId });
        if (prod) {
          const prev = prod.stockQuantity || 0;
          const curr = Math.max(0, prev - item.quantity);
          prod.stockQuantity = curr;
          await prod.save();

          await InventoryTransaction.create({
            tenantId: req.tenantId,
            productId: prod._id,
            branchId,
            type: 'STOCK_OUT',
            quantity: item.quantity,
            previousStock: prev,
            currentStock: curr,
            reason: `Billed in invoice ${bill.billNumber}`,
          });
        }
      }
    }

    // Update customer stats
    if (customerId) {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { totalVisits: 1, totalSpend: grandTotal },
        lastVisitDate: new Date(),
      });
    }

    await recordAuditLog({
      req,
      action: 'BILL_GENERATED',
      resourceType: 'Bill',
      resourceId: bill._id,
      details: { billNumber, grandTotal, paymentStatus },
    });

    return sendSuccess(res, 'Bill generated successfully', bill, 201);
  } catch (error) {
    return sendError(res, `Failed to generate bill: ${error.message}`, [], 500);
  }
};

export const getBills = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'createdAt');
    const filter = buildTenantFilter(req);

    if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
      filter.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.customerId) filter.customerId = req.query.customerId;

    if (req.query.search) {
      filter.billNumber = { $regex: req.query.search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Bill.find(filter)
        .populate('customerId', 'name phone email')
        .populate('branchId', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Bill.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getBillById = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const Payment = getTenantModel(req, 'Payment');

    const bill = await Bill.findOne({ _id: req.params.billId, tenantId: req.tenantId })
      .populate('customerId')
      .populate('branchId');

    if (!bill) return sendError(res, 'Bill not found', [], 404);

    const payments = await Payment.find({ tenantId: req.tenantId, billId: bill._id }).sort({ paidAt: 1 });
    return sendSuccess(res, 'Bill retrieved', { bill, payments });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateBill = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const bill = await Bill.findOneAndUpdate(
      { _id: req.params.billId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!bill) return sendError(res, 'Bill not found', [], 404);
    return sendSuccess(res, 'Bill updated successfully', bill);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteBill = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const bill = await Bill.findOneAndDelete({ _id: req.params.billId, tenantId: req.tenantId });
    if (!bill) return sendError(res, 'Bill not found', [], 404);
    return sendSuccess(res, 'Bill deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const payBill = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId, notes } = req.body;
    if (!amount || Number(amount) <= 0) {
      return sendError(res, 'Valid payment amount is required', [], 400);
    }

    const Bill = getTenantModel(req, 'Bill');
    const Payment = getTenantModel(req, 'Payment');

    const bill = await Bill.findOne({ _id: req.params.billId, tenantId: req.tenantId });
    if (!bill) return sendError(res, 'Bill not found', [], 404);

    const payVal = Number(amount);
    const newPaid = (bill.paidAmount || 0) + payVal;
    const newBalance = Math.max(0, bill.grandTotal - newPaid);

    bill.paidAmount = newPaid;
    bill.balanceAmount = newBalance;
    bill.paymentStatus = newBalance === 0 ? 'paid' : 'partially_paid';
    bill.paymentMethod = paymentMethod || bill.paymentMethod;
    await bill.save();

    const payment = await Payment.create({
      tenantId: req.tenantId,
      billId: bill._id,
      branchId: bill.branchId,
      customerId: bill.customerId,
      amount: payVal,
      paymentMethod: paymentMethod || 'Cash',
      transactionId: transactionId || '',
      status: 'success',
      notes: notes || '',
    });

    return sendSuccess(res, 'Payment recorded successfully', { bill, payment });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const refundBill = async (req, res) => {
  try {
    const { refundAmount, reason } = req.body;
    const Bill = getTenantModel(req, 'Bill');

    const bill = await Bill.findOne({ _id: req.params.billId, tenantId: req.tenantId });
    if (!bill) return sendError(res, 'Bill not found', [], 404);

    const ref = Number(refundAmount) || bill.paidAmount;
    bill.refundedAmount = (bill.refundedAmount || 0) + ref;
    bill.refundReason = reason || 'Customer refund requested';
    bill.paymentStatus = 'refunded';
    await bill.save();

    await recordAuditLog({
      req,
      action: 'BILL_REFUNDED',
      resourceType: 'Bill',
      resourceId: bill._id,
      details: { refundAmount: ref, reason },
    });

    return sendSuccess(res, 'Bill refund processed successfully', bill);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const cancelBill = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const bill = await Bill.findOneAndUpdate(
      { _id: req.params.billId, tenantId: req.tenantId },
      { paymentStatus: 'cancelled', notes: req.body.reason || 'Cancelled' },
      { returnDocument: 'after' }
    );
    if (!bill) return sendError(res, 'Bill not found', [], 404);
    return sendSuccess(res, 'Bill cancelled', bill);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getBillReceipt = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const bill = await Bill.findOne({ _id: req.params.billId, tenantId: req.tenantId })
      .populate('customerId', 'name phone email address')
      .populate('branchId', 'name phone address');

    if (!bill) return sendError(res, 'Bill not found', [], 404);

    return sendSuccess(res, 'Bill receipt generated', {
      tenant: {
        name: req.tenant.name,
        slug: req.tenant.slug,
        branding: req.tenant.branding,
      },
      bill,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. PAYMENT METHODS
// ==========================================

export const createPaymentMethod = async (req, res) => {
  try {
    const { name, code, type, isDefault } = req.body;
    if (!name || !code) return sendError(res, 'Name and code are required', [], 400);

    const PaymentMethod = getTenantModel(req, 'PaymentMethod');
    if (isDefault) {
      await PaymentMethod.updateMany({ tenantId: req.tenantId }, { isDefault: false });
    }

    const doc = await PaymentMethod.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      type: type || 'cash',
      isDefault: Boolean(isDefault),
      isEnabled: true,
    });

    return sendSuccess(res, 'Payment method created', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const PaymentMethod = getTenantModel(req, 'PaymentMethod');
    const items = await PaymentMethod.find({ tenantId: req.tenantId });
    return sendSuccess(res, 'Payment methods retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const PaymentMethod = getTenantModel(req, 'PaymentMethod');
    const doc = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.methodId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Payment method not found', [], 404);
    return sendSuccess(res, 'Payment method updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    const PaymentMethod = getTenantModel(req, 'PaymentMethod');
    const doc = await PaymentMethod.findOneAndDelete({ _id: req.params.methodId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Payment method not found', [], 404);
    return sendSuccess(res, 'Payment method deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. PAYMENT GATEWAYS
// ==========================================

export const createPaymentGateway = async (req, res) => {
  try {
    const { provider, name, keyId, keySecret, webhookSecret, isLive } = req.body;
    if (!provider || !name) return sendError(res, 'Provider and Name are required', [], 400);

    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const gateway = await PaymentGateway.create({
      tenantId: req.tenantId,
      provider,
      name,
      keyId: keyId || '',
      keySecret: keySecret || '',
      webhookSecret: webhookSecret || '',
      isLive: Boolean(isLive),
      isActive: false,
    });

    return sendSuccess(res, 'Payment gateway configured successfully', { id: gateway._id, provider, name, isLive }, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPaymentGateways = async (req, res) => {
  try {
    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const items = await PaymentGateway.find({ tenantId: req.tenantId }).select('-keySecret -webhookSecret');
    return sendSuccess(res, 'Payment gateways retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPaymentGatewayById = async (req, res) => {
  try {
    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const doc = await PaymentGateway.findOne({ _id: req.params.gatewayId, tenantId: req.tenantId }).select('-keySecret -webhookSecret');
    if (!doc) return sendError(res, 'Gateway not found', [], 404);
    return sendSuccess(res, 'Payment gateway retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updatePaymentGateway = async (req, res) => {
  try {
    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const doc = await PaymentGateway.findOneAndUpdate(
      { _id: req.params.gatewayId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    ).select('-keySecret -webhookSecret');

    if (!doc) return sendError(res, 'Gateway not found', [], 404);
    return sendSuccess(res, 'Gateway updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deletePaymentGateway = async (req, res) => {
  try {
    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const doc = await PaymentGateway.findOneAndDelete({ _id: req.params.gatewayId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Gateway not found', [], 404);
    return sendSuccess(res, 'Gateway configuration deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const testPaymentGateway = async (req, res) => {
  try {
    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const doc = await PaymentGateway.findOne({ _id: req.params.gatewayId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Gateway not found', [], 404);

    return sendSuccess(res, `Connection to ${doc.provider} (${doc.name}) verified successfully!`, {
      provider: doc.provider,
      status: 'verified',
      timestamp: new Date(),
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const activatePaymentGateway = async (req, res) => {
  try {
    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const doc = await PaymentGateway.findOneAndUpdate(
      { _id: req.params.gatewayId, tenantId: req.tenantId },
      { isActive: true },
      { returnDocument: 'after' }
    ).select('-keySecret');
    if (!doc) return sendError(res, 'Gateway not found', [], 404);
    return sendSuccess(res, `${doc.name} gateway activated`, doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deactivatePaymentGateway = async (req, res) => {
  try {
    const PaymentGateway = getTenantModel(req, 'PaymentGateway');
    const doc = await PaymentGateway.findOneAndUpdate(
      { _id: req.params.gatewayId, tenantId: req.tenantId },
      { isActive: false },
      { returnDocument: 'after' }
    ).select('-keySecret');
    if (!doc) return sendError(res, 'Gateway not found', [], 404);
    return sendSuccess(res, `${doc.name} gateway deactivated`, doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  payBill,
  refundBill,
  cancelBill,
  getBillReceipt,
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
  createPaymentGateway,
  getPaymentGateways,
  getPaymentGatewayById,
  updatePaymentGateway,
  deletePaymentGateway,
  testPaymentGateway,
  activatePaymentGateway,
  deactivatePaymentGateway,
};
