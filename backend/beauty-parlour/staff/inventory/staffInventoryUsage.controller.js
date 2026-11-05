/**
 * @file staffInventoryUsage.controller.js
 * @description Staff Product Catalog View, Inventory Stock Requests, and Treatment Product Usage Tracking.
 * Conforms to Sections 27 & 28.
 * @module backend/src/modules/staff/inventory/staffInventoryUsage.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';

// Section 27: Inventory Catalog & Availability
export const getProducts = async (req, res) => {
  try {
    const ProductModel = getTenantModel(req, 'Product');
    const filter = { tenantId: req.tenantId };
    if (req.currentBranchId) {
      filter.branch = req.currentBranchId;
    }

    const products = await ProductModel.find(filter).sort({ name: 1 });
    return sendSuccess(res, products, 'Products fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch products', [error.message], 500);
  }
};

export const getProduct = async (req, res) => {
  try {
    const ProductModel = getTenantModel(req, 'Product');
    const product = await ProductModel.findOne({
      _id: req.params.productId,
      tenantId: req.tenantId,
    });

    if (!product) {
      return sendError(res, 'Product not found', [], 404);
    }

    return sendSuccess(res, product, 'Product details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch product', [error.message], 500);
  }
};

export const getInventoryStock = async (req, res) => {
  return getProducts(req, res);
};

export const getAvailability = async (req, res) => {
  try {
    const ProductModel = getTenantModel(req, 'Product');
    const product = await ProductModel.findOne({
      _id: req.params.productId,
      tenantId: req.tenantId,
    }).select('name sku stockQuantity minStockThreshold');

    return sendSuccess(
      res,
      {
        inStock: (product?.stockQuantity || 0) > 0,
        availableUnits: product?.stockQuantity || 0,
      },
      'Product stock availability fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to check availability', [error.message], 500);
  }
};

// Section 27: Inventory Requests
export const createInventoryRequest = async (req, res) => {
  try {
    const InventoryReqModel = getTenantModel(req, 'InventoryRequest');
    const ProductModel = getTenantModel(req, 'Product');
    const { productId, quantity, reason, priority } = req.body;

    if (!productId || !quantity) {
      return sendError(res, 'Product and required quantity are required', [], 400);
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return sendError(res, 'Target product not found', [], 404);
    }

    const reqDoc = await InventoryReqModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId || req.staff?.branchId,
      staffId: req.staffId,
      productId,
      productName: product.name,
      quantity: Number(quantity),
      reason: reason || 'Salon treatment consumable replenishment',
      priority: priority || 'medium',
      status: 'pending',
    });

    return sendSuccess(res, 'Stock replenishment request logged for inventory manager', reqDoc, 201);
  } catch (error) {
    return sendError(res, 'Failed to submit inventory request', [error.message], 500);
  }
};

export const listInventoryRequests = async (req, res) => {
  try {
    const InventoryReqModel = getTenantModel(req, 'InventoryRequest');
    const requests = await InventoryReqModel.find({
      tenantId: req.tenantId,
      staffId: req.staffId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, requests, 'Staff inventory requests fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch requests', [error.message], 500);
  }
};

export const getInventoryRequest = async (req, res) => {
  try {
    const InventoryReqModel = getTenantModel(req, 'InventoryRequest');
    const request = await InventoryReqModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
    });

    return sendSuccess(res, request, 'Request details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch request', [error.message], 500);
  }
};

export const cancelInventoryRequest = async (req, res) => {
  try {
    const InventoryReqModel = getTenantModel(req, 'InventoryRequest');
    const reqDoc = await InventoryReqModel.findOneAndUpdate(
      { _id: req.params.requestId, tenantId: req.tenantId, staffId: req.staffId, status: 'pending' },
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    return sendSuccess(res, reqDoc, 'Inventory request cancelled');
  } catch (error) {
    return sendError(res, 'Failed to cancel request', [error.message], 500);
  }
};

// Section 28: Staff Service Product Usage
export const recordServiceUsage = async (req, res) => {
  try {
    const UsageModel = getTenantModel(req, 'ServiceUsage');
    const { serviceId, appointmentId, customerId, productId, quantity, notes } = req.body;

    let effectiveServiceId = serviceId;
    let effectiveCustomerId = customerId;

    if (!effectiveServiceId && appointmentId) {
      const AppointmentModel = getTenantModel(req, 'Appointment');
      const appt = await AppointmentModel.findById(appointmentId);
      if (appt) {
        effectiveServiceId = appt.services?.[0]?.serviceId || appt.serviceId || appt.service;
        effectiveCustomerId = effectiveCustomerId || appt.customerId || appt.customer;
      }
    }

    if (!effectiveServiceId || !productId || !quantity) {
      return sendError(res, 'serviceId, productId, and quantity are required', [], 400);
    }

    const branchId = req.currentBranchId || req.staff?.branchId || req.staff?.primaryBranch;

    const usage = await UsageModel.create({
      tenantId: req.tenantId,
      branchId,
      staffId: req.staffId,
      serviceId: effectiveServiceId,
      appointmentId: appointmentId || null,
      customerId: effectiveCustomerId || null,
      productId,
      quantity: Number(quantity),
      notes: notes || '',
    });

    return sendSuccess(res, 'Consumable usage recorded for treatment', usage, 201);
  } catch (error) {
    return sendError(res, 'Failed to record product usage', [error.message], 500);
  }
};

export const listServiceUsage = async (req, res) => {
  try {
    const UsageModel = getTenantModel(req, 'ServiceUsage');
    const usages = await UsageModel.find({
      tenantId: req.tenantId,
      staffId: req.staffId,
    })
      .populate('serviceId', 'name')
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 });

    return sendSuccess(res, usages, 'Service product usage history fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch usage history', [error.message], 500);
  }
};

export const getServiceUsageById = async (req, res) => {
  try {
    const UsageModel = getTenantModel(req, 'ServiceUsage');
    const usage = await UsageModel.findOne({
      _id: req.params.usageId,
      tenantId: req.tenantId,
      staffId: req.staffId,
    })
      .populate('serviceId', 'name')
      .populate('productId', 'name sku');

    if (!usage) {
      return sendError(res, 'Service usage record not found', [], 404);
    }
    return sendSuccess(res, usage, 'Service product usage record fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch usage record', [error.message], 500);
  }
};

export const getProductById = getProduct;
export const getInventory = getInventoryStock;
export const getInventoryAvailability = getAvailability;
export const getInventoryRequests = listInventoryRequests;
export const getInventoryRequestById = getInventoryRequest;
export const logServiceUsage = recordServiceUsage;
export const getServiceUsageList = listServiceUsage;

export default {
  getProducts,
  getProduct,
  getProductById,
  getInventoryStock,
  getInventory,
  getAvailability,
  getInventoryAvailability,
  createInventoryRequest,
  listInventoryRequests,
  getInventoryRequests,
  getInventoryRequest,
  getInventoryRequestById,
  cancelInventoryRequest,
  recordServiceUsage,
  logServiceUsage,
  listServiceUsage,
  getServiceUsageById,
};

