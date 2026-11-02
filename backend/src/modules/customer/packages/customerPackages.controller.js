/**
 * @file customerPackages.controller.js
 * @description Customer Packages and Usage Tracking Controller.
 * Handles purchased package portfolios, remaining sessions ledger, and package acquisition.
 * @module backend/src/modules/customer/packages/customerPackages.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * List all packages purchased by the authenticated customer.
 */
export const getMyPackages = async (req, res) => {
  try {
    const PackagePurchaseModel = getTenantModel(req, 'PackagePurchase');

    const purchases = await PackagePurchaseModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
    })
      .populate('packageId', 'name description price durationMinutes validityDays services')
      .sort({ purchaseDate: -1 });

    const now = new Date();

    const formatted = purchases.map((p) => {
      const isExpired = p.expiryDate && new Date(p.expiryDate) < now;
      const status = isExpired ? 'EXPIRED' : p.remainingServices <= 0 ? 'EXHAUSTED' : p.status || 'ACTIVE';

      return {
        _id: p._id,
        purchaseNumber: p.purchaseNumber,
        packageName: p.packageName || p.packageId?.name || 'Beauty Package',
        packageId: p.packageId?._id || p.packageId,
        totalPrice: p.price,
        totalServices: p.totalServices,
        usedServices: p.usedServices,
        remainingServices: p.remainingServices,
        purchaseDate: p.purchaseDate,
        expiryDate: p.expiryDate,
        status,
        services: p.services || [],
        usageHistory: p.usageHistory || [],
      };
    });

    return sendSuccess(res, 'My purchased packages retrieved successfully', formatted);
  } catch (error) {
    return sendError(res, `Failed to retrieve purchased packages: ${error.message}`, [], 500);
  }
};

/**
 * Get single purchased package details.
 */
export const getPackageById = async (req, res) => {
  try {
    const PackagePurchaseModel = getTenantModel(req, 'PackagePurchase');

    const purchase = await PackagePurchaseModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    }).populate('packageId', 'name description price validityDays services');

    if (!purchase) {
      return sendError(res, 'Purchased package not found', [], 404);
    }

    return sendSuccess(res, 'Purchased package details retrieved', purchase);
  } catch (error) {
    return sendError(res, `Failed to retrieve package: ${error.message}`, [], 500);
  }
};

/**
 * Purchase a package by customer.
 */
export const purchasePackage = async (req, res) => {
  try {
    const { id } = req.params; // Package ID from catalog
    const { paymentMethod = 'ONLINE', branchId } = req.body;

    const PackageModel = getTenantModel(req, 'Package');
    const PackagePurchaseModel = getTenantModel(req, 'PackagePurchase');
    const PaymentModel = getTenantModel(req, 'Payment');

    const pkg = await PackageModel.findOne({
      _id: id,
      tenantId: req.tenantId,
      status: 'active',
    });

    if (!pkg) {
      return sendError(res, 'Package not found or inactive', [], 404);
    }

    const validityDays = pkg.validityDays || 90;
    const expiryDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);

    const includedServices = (pkg.services || []).map((s) => {
      const q = Number(s.quantity || 1);
      return {
        serviceId: s.serviceId,
        name: s.name || 'Service',
        quantity: q,
        totalCount: q,
        usedCount: 0,
        remainingCount: q,
      };
    });

    const totalServices = includedServices.reduce((sum, s) => sum + s.quantity, 0) || 1;
    const purchaseNumber = `PKG-${Date.now().toString().slice(-6)}`;

    const purchase = await PackagePurchaseModel.create({
      tenantId: req.tenantId,
      customerId: req.customerId,
      packageId: pkg._id,
      purchaseNumber,
      packageName: pkg.name,
      price: pkg.price,
      totalServices,
      usedServices: 0,
      remainingServices: totalServices,
      services: includedServices,
      paymentMethod,
      paymentStatus: paymentMethod === 'ONLINE' ? 'COMPLETED' : 'PENDING',
      purchaseDate: new Date(),
      expiryDate,
      status: 'ACTIVE',
      usageHistory: [],
    });

    // Create corresponding payment ledger entry
    const invoiceNumber = `INV-PKG-${Date.now().toString().slice(-6)}`;
    await PaymentModel.create({
      tenantId: req.tenantId,
      customerId: req.customerId,
      branchId: branchId || null,
      packagePurchaseId: purchase._id,
      amount: pkg.price,
      paymentType: 'PACKAGE_PURCHASE',
      paymentMethod,
      status: paymentMethod === 'ONLINE' ? 'COMPLETED' : 'PENDING',
      invoiceNumber,
      transactionId: `TXN-${Date.now()}`,
      paidAt: paymentMethod === 'ONLINE' ? new Date() : null,
    });

    return sendSuccess(res, `Package "${pkg.name}" purchased successfully!`, purchase, 210);
  } catch (error) {
    return sendError(res, `Failed to purchase package: ${error.message}`, [], 500);
  }
};

/**
 * Get usage ledger and session history for a purchased package.
 */
export const getPackageUsage = async (req, res) => {
  try {
    const PackagePurchaseModel = getTenantModel(req, 'PackagePurchase');

    const purchase = await PackagePurchaseModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!purchase) {
      return sendError(res, 'Purchased package record not found', [], 404);
    }

    return sendSuccess(res, 'Package usage record retrieved successfully', {
      purchaseNumber: purchase.purchaseNumber,
      packageName: purchase.packageName,
      totalServices: purchase.totalServices,
      usedServices: purchase.usedServices,
      remainingServices: purchase.remainingServices,
      expiryDate: purchase.expiryDate,
      services: purchase.services || [],
      usageHistory: purchase.usageHistory || [],
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve package usage: ${error.message}`, [], 500);
  }
};

/**
 * Get remaining services breakdown for a purchased package.
 */
export const getRemainingServices = async (req, res) => {
  return getPackageUsage(req, res);
};

export default {
  getMyPackages,
  getPackageById,
  purchasePackage,
  getPackageUsage,
  getRemainingServices,
};
