/**
 * @file inventory.controller.js
 * @description Complete Inventory, Stock In/Out, Adjustments, Transfers, Low-stock alerts, Suppliers, and Purchases Controller.
 * Categories: Products, Beauty products, Makeup, Hair products, Massage products, Consumables, Accessories, Equipment, Tools.
 * @module backend/src/modules/admin/inventory/inventory.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';

// ==========================================
// 1. PRODUCTS
// ==========================================

export const createProduct = async (req, res) => {
  try {
    const { name, sku, barcode, category, brand, description, costPrice, sellingPrice, stockQuantity, minStockAlert, unit, branchId, imageUrl } = req.body;
    if (!name || costPrice === undefined || sellingPrice === undefined) {
      return sendError(res, 'Product name, cost price, and selling price are required', [], 400);
    }

    const Product = getTenantModel(req, 'Product');
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');

    const productSku = sku || `SKU-${Date.now().toString().slice(-6)}`;

    const product = await Product.create({
      tenantId: req.tenantId,
      name: name.trim(),
      sku: productSku,
      barcode: barcode || '',
      category: category || 'Beauty Products',
      brand: brand || '',
      description: description || '',
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity) || 0,
      minStockAlert: Number(minStockAlert) || 5,
      unit: unit || 'pcs',
      branchId: branchId || null,
      imageUrl: imageUrl || '',
      status: 'active',
    });

    if (product.stockQuantity > 0) {
      await InventoryTransaction.create({
        tenantId: req.tenantId,
        productId: product._id,
        branchId: branchId || null,
        type: 'STOCK_IN',
        quantity: product.stockQuantity,
        previousStock: 0,
        currentStock: product.stockQuantity,
        reason: 'Initial opening stock',
        performedBy: req.user?._id || null,
      });
    }

    await recordAuditLog({
      req,
      action: 'PRODUCT_CREATED',
      resourceType: 'Product',
      resourceId: product._id,
      details: { name: product.name, sku: product.sku },
    });

    return sendSuccess(res, 'Product created successfully', product, 201);
  } catch (error) {
    return sendError(res, `Failed to create product: ${error.message}`, [], 500);
  }
};

export const getProducts = async (req, res) => {
  try {
    const Product = getTenantModel(req, 'Product');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filter).populate('branchId', 'name code').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getProductById = async (req, res) => {
  try {
    const Product = getTenantModel(req, 'Product');
    const product = await Product.findOne({ _id: req.params.productId, tenantId: req.tenantId }).populate('branchId');
    if (!product) return sendError(res, 'Product not found', [], 404);
    return sendSuccess(res, 'Product retrieved', product);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const Product = getTenantModel(req, 'Product');
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!product) return sendError(res, 'Product not found', [], 404);
    return sendSuccess(res, 'Product updated successfully', product);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const Product = getTenantModel(req, 'Product');
    const product = await Product.findOneAndDelete({ _id: req.params.productId, tenantId: req.tenantId });
    if (!product) return sendError(res, 'Product not found', [], 404);
    return sendSuccess(res, 'Product deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. INVENTORY TRANSACTIONS & OPERATIONS
// ==========================================

export const getInventoryOverview = async (req, res) => {
  return getProducts(req, res);
};

export const getLowStockProducts = async (req, res) => {
  try {
    const Product = getTenantModel(req, 'Product');
    const items = await Product.find({
      tenantId: req.tenantId,
      status: 'active',
      $expr: { $lte: ['$stockQuantity', '$minStockAlert'] },
    }).populate('branchId', 'name');

    return sendSuccess(res, 'Low stock items retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const stockIn = async (req, res) => {
  try {
    const { productId, branchId, quantity, reason } = req.body;
    if (!productId || !quantity || Number(quantity) <= 0) {
      return sendError(res, 'Product ID and valid quantity are required', [], 400);
    }

    const Product = getTenantModel(req, 'Product');
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');

    const product = await Product.findOne({ _id: productId, tenantId: req.tenantId });
    if (!product) return sendError(res, 'Product not found', [], 404);

    const prev = product.stockQuantity || 0;
    const curr = prev + Number(quantity);

    product.stockQuantity = curr;
    await product.save();

    const tx = await InventoryTransaction.create({
      tenantId: req.tenantId,
      productId: product._id,
      branchId: branchId || product.branchId,
      type: 'STOCK_IN',
      quantity: Number(quantity),
      previousStock: prev,
      currentStock: curr,
      reason: reason || 'Stock In replenishment',
      performedBy: req.user?._id || null,
    });

    return sendSuccess(res, 'Stock added successfully', { product, transaction: tx });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const stockOut = async (req, res) => {
  try {
    const { productId, branchId, quantity, reason } = req.body;
    if (!productId || !quantity || Number(quantity) <= 0) {
      return sendError(res, 'Product ID and valid quantity are required', [], 400);
    }

    const Product = getTenantModel(req, 'Product');
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');

    const product = await Product.findOne({ _id: productId, tenantId: req.tenantId });
    if (!product) return sendError(res, 'Product not found', [], 404);

    const prev = product.stockQuantity || 0;
    const curr = Math.max(0, prev - Number(quantity));

    product.stockQuantity = curr;
    await product.save();

    const tx = await InventoryTransaction.create({
      tenantId: req.tenantId,
      productId: product._id,
      branchId: branchId || product.branchId,
      type: 'STOCK_OUT',
      quantity: Number(quantity),
      previousStock: prev,
      currentStock: curr,
      reason: reason || 'Stock Out consumption',
      performedBy: req.user?._id || null,
    });

    return sendSuccess(res, 'Stock deducted successfully', { product, transaction: tx });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { productId, branchId, newStockQuantity, reason } = req.body;
    if (!productId || newStockQuantity === undefined) {
      return sendError(res, 'Product ID and new stock quantity are required', [], 400);
    }

    const Product = getTenantModel(req, 'Product');
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');

    const product = await Product.findOne({ _id: productId, tenantId: req.tenantId });
    if (!product) return sendError(res, 'Product not found', [], 404);

    const prev = product.stockQuantity || 0;
    const curr = Math.max(0, Number(newStockQuantity));
    const diff = curr - prev;

    product.stockQuantity = curr;
    await product.save();

    const tx = await InventoryTransaction.create({
      tenantId: req.tenantId,
      productId: product._id,
      branchId: branchId || product.branchId,
      type: 'ADJUST',
      quantity: Math.abs(diff),
      previousStock: prev,
      currentStock: curr,
      reason: reason || 'Stock audit adjustment',
      performedBy: req.user?._id || null,
    });

    return sendSuccess(res, 'Stock adjusted successfully', { product, transaction: tx });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const transferStock = async (req, res) => {
  try {
    const { productId, fromBranchId, toBranchId, quantity, reason } = req.body;
    if (!productId || !fromBranchId || !toBranchId || !quantity) {
      return sendError(res, 'Product, source branch, destination branch, and quantity are required', [], 400);
    }

    const Product = getTenantModel(req, 'Product');
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');

    const product = await Product.findOne({ _id: productId, tenantId: req.tenantId });
    if (!product) return sendError(res, 'Product not found', [], 404);

    const tx = await InventoryTransaction.create({
      tenantId: req.tenantId,
      productId: product._id,
      branchId: toBranchId,
      type: 'TRANSFER',
      quantity: Number(quantity),
      previousStock: product.stockQuantity,
      currentStock: product.stockQuantity,
      reason: `Transfer from branch ${fromBranchId} to ${toBranchId}. ${reason || ''}`,
      performedBy: req.user?._id || null,
    });

    return sendSuccess(res, 'Stock transfer recorded successfully', tx);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getInventoryTransactions = async (req, res) => {
  try {
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    if (req.query.productId) filter.productId = req.query.productId;
    if (req.query.type) filter.type = req.query.type;

    const [items, total] = await Promise.all([
      InventoryTransaction.find(filter)
        .populate('productId', 'name sku unit')
        .populate('branchId', 'name')
        .populate('performedBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      InventoryTransaction.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. SUPPLIERS & PURCHASES
// ==========================================

export const createSupplier = async (req, res) => {
  try {
    const { name, contactPerson, phone, email, address, gstNumber } = req.body;
    if (!name) return sendError(res, 'Supplier name is required', [], 400);

    const Supplier = getTenantModel(req, 'Supplier');
    const supplier = await Supplier.create({
      tenantId: req.tenantId,
      name: name.trim(),
      contactPerson: contactPerson || '',
      phone: phone || '',
      email: email ? email.trim().toLowerCase() : '',
      address: address || '',
      gstNumber: gstNumber || '',
      status: 'active',
    });

    return sendSuccess(res, 'Supplier created successfully', supplier, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const Supplier = getTenantModel(req, 'Supplier');
    const items = await Supplier.find({ tenantId: req.tenantId }).sort({ name: 1 });
    return sendSuccess(res, 'Suppliers retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const Supplier = getTenantModel(req, 'Supplier');
    const doc = await Supplier.findOne({ _id: req.params.supplierId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Supplier not found', [], 404);
    return sendSuccess(res, 'Supplier retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const Supplier = getTenantModel(req, 'Supplier');
    const doc = await Supplier.findOneAndUpdate(
      { _id: req.params.supplierId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Supplier not found', [], 404);
    return sendSuccess(res, 'Supplier updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const Supplier = getTenantModel(req, 'Supplier');
    const doc = await Supplier.findOneAndDelete({ _id: req.params.supplierId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Supplier not found', [], 404);
    return sendSuccess(res, 'Supplier deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const createPurchase = async (req, res) => {
  try {
    const { supplierId, branchId, items, invoiceNumber, invoiceDate, paidAmount } = req.body;
    if (!supplierId || !branchId || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Supplier, branch, and purchase items are required', [], 400);
    }

    const Purchase = getTenantModel(req, 'Purchase');
    const Product = getTenantModel(req, 'Product');
    const InventoryTransaction = getTenantModel(req, 'InventoryTransaction');

    let total = 0;
    const processedItems = items.map((it) => {
      const q = Number(it.quantity) || 1;
      const c = Number(it.unitCost) || 0;
      total += q * c;
      return {
        productId: it.productId,
        name: it.name,
        quantity: q,
        unitCost: c,
        totalCost: q * c,
      };
    });

    const purchaseNumber = `PO-${Date.now().toString().slice(-6)}`;
    const paid = Number(paidAmount) || 0;

    const purchase = await Purchase.create({
      tenantId: req.tenantId,
      purchaseNumber,
      supplierId,
      branchId,
      items: processedItems,
      totalAmount: total,
      paidAmount: paid,
      paymentStatus: paid >= total ? 'paid' : paid > 0 ? 'partially_paid' : 'unpaid',
      invoiceNumber: invoiceNumber || '',
      invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
    });

    // Replenish stock for all purchased items
    for (const item of processedItems) {
      if (item.productId) {
        const prod = await Product.findOne({ _id: item.productId, tenantId: req.tenantId });
        if (prod) {
          const prev = prod.stockQuantity || 0;
          const curr = prev + item.quantity;
          prod.stockQuantity = curr;
          await prod.save();

          await InventoryTransaction.create({
            tenantId: req.tenantId,
            productId: prod._id,
            branchId,
            type: 'STOCK_IN',
            quantity: item.quantity,
            previousStock: prev,
            currentStock: curr,
            reason: `Purchase order ${purchase.purchaseNumber}`,
          });
        }
      }
    }

    return sendSuccess(res, 'Purchase order recorded and stock replenished', purchase, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPurchases = async (req, res) => {
  try {
    const Purchase = getTenantModel(req, 'Purchase');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    const [items, total] = await Promise.all([
      Purchase.find(filter)
        .populate('supplierId', 'name contactPerson phone')
        .populate('branchId', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Purchase.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const Purchase = getTenantModel(req, 'Purchase');
    const doc = await Purchase.findOne({ _id: req.params.purchaseId, tenantId: req.tenantId })
      .populate('supplierId')
      .populate('branchId');
    if (!doc) return sendError(res, 'Purchase order not found', [], 404);
    return sendSuccess(res, 'Purchase retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getInventoryOverview,
  getLowStockProducts,
  stockIn,
  stockOut,
  adjustStock,
  transferStock,
  getInventoryTransactions,
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  createPurchase,
  getPurchases,
  getPurchaseById,
};
