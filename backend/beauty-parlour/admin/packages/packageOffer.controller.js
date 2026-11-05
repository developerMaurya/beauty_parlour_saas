/**
 * @file packageOffer.controller.js
 * @description Dynamic Packages, Promotional Offers, and Coupons Controller.
 * Supports custom text inclusions (e.g. Free Bridal Consultation), pricing, and validity.
 * @module backend/src/modules/admin/packages/packageOffer.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';

// ==========================================
// 1. DYNAMIC PACKAGES
// ==========================================

export const createPackage = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      imageUrl,
      price,
      discountPrice,
      taxRate,
      durationMinutes,
      validFrom,
      validUntil,
      services,
      options,
      addons,
      products,
      customText,
      terms,
      conditions,
      branchIds,
      homeServiceAllowed,
    } = req.body;

    if (!name || price === undefined) {
      return sendError(res, 'Package name and price are required', [], 400);
    }

    const Package = getTenantModel(req, 'Package');
    const pkg = await Package.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: code ? code.toUpperCase() : name.slice(0, 4).toUpperCase(),
      description: description || '',
      imageUrl: imageUrl || '',
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      taxRate: Number(taxRate) || 0,
      durationMinutes: Number(durationMinutes) || 120,
      validFrom: validFrom ? new Date(validFrom) : null,
      validUntil: validUntil ? new Date(validUntil) : null,
      services: Array.isArray(services) ? services : [],
      options: Array.isArray(options) ? options : [],
      addons: Array.isArray(addons) ? addons : [],
      products: Array.isArray(products) ? products : [],
      customText: Array.isArray(customText) ? customText : [],
      terms: terms || '',
      conditions: conditions || '',
      branchIds: Array.isArray(branchIds) ? branchIds : [],
      homeServiceAllowed: Boolean(homeServiceAllowed),
      status: 'active',
    });

    await recordAuditLog({
      req,
      action: 'PACKAGE_CREATED',
      resourceType: 'Package',
      resourceId: pkg._id,
      details: { name: pkg.name, price: pkg.price },
    });

    return sendSuccess(res, 'Package created successfully', pkg, 201);
  } catch (error) {
    return sendError(res, `Failed to create package: ${error.message}`, [], 500);
  }
};

export const getPackages = async (req, res) => {
  try {
    const Package = getTenantModel(req, 'Package');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = { tenantId: req.tenantId };

    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    if (req.branchId && req.branchId !== 'all') {
      filter.$or = [{ branchIds: req.branchId }, { branchIds: { $size: 0 } }];
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Package.find(filter)
        .populate('services.serviceId', 'name price')
        .populate('branchIds', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Package.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPackageById = async (req, res) => {
  try {
    const Package = getTenantModel(req, 'Package');
    const doc = await Package.findOne({ _id: req.params.packageId, tenantId: req.tenantId })
      .populate('services.serviceId')
      .populate('branchIds');

    if (!doc) return sendError(res, 'Package not found', [], 404);
    return sendSuccess(res, 'Package retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updatePackage = async (req, res) => {
  try {
    const Package = getTenantModel(req, 'Package');
    const doc = await Package.findOneAndUpdate(
      { _id: req.params.packageId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Package not found', [], 404);
    return sendSuccess(res, 'Package updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deletePackage = async (req, res) => {
  try {
    const Package = getTenantModel(req, 'Package');
    const doc = await Package.findOneAndDelete({ _id: req.params.packageId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Package not found', [], 404);
    return sendSuccess(res, 'Package deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updatePackageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const Package = getTenantModel(req, 'Package');
    const doc = await Package.findOneAndUpdate(
      { _id: req.params.packageId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Package not found', [], 404);
    return sendSuccess(res, `Package status updated to ${status}`, doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const duplicatePackage = async (req, res) => {
  try {
    const Package = getTenantModel(req, 'Package');
    const original = await Package.findOne({ _id: req.params.packageId, tenantId: req.tenantId });
    if (!original) return sendError(res, 'Package not found', [], 404);

    const dupData = original.toObject();
    delete dupData._id;
    delete dupData.createdAt;
    delete dupData.updatedAt;
    dupData.name = `${original.name} (Copy)`;

    const newPkg = await Package.create(dupData);
    return sendSuccess(res, 'Package duplicated successfully', newPkg, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. PROMOTIONAL OFFERS
// ==========================================

export const createOffer = async (req, res) => {
  try {
    const {
      name,
      description,
      services,
      packages,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      validFrom,
      validUntil,
      daysOfWeek,
      startTime,
      endTime,
      customerType,
      branchId,
      usageLimit,
    } = req.body;

    if (!name || discountValue === undefined) {
      return sendError(res, 'Offer name and discount value are required', [], 400);
    }

    const Offer = getTenantModel(req, 'Offer');
    const offer = await Offer.create({
      tenantId: req.tenantId,
      name: name.trim(),
      description: description || '',
      services: Array.isArray(services) ? services : [],
      packages: Array.isArray(packages) ? packages : [],
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minimumAmount: Number(minimumAmount) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: validUntil ? new Date(validUntil) : null,
      daysOfWeek: Array.isArray(daysOfWeek) ? daysOfWeek : [],
      startTime: startTime || '09:00',
      endTime: endTime || '20:00',
      customerType: customerType || 'all',
      branchId: branchId || null,
      usageLimit: Number(usageLimit) || 0,
      status: 'active',
    });

    return sendSuccess(res, 'Offer created successfully', offer, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getOffers = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    const [items, total] = await Promise.all([
      Offer.find(filter).populate('services', 'name price').populate('packages', 'name price').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Offer.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getOfferById = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const doc = await Offer.findOne({ _id: req.params.offerId, tenantId: req.tenantId })
      .populate('services')
      .populate('packages');

    if (!doc) return sendError(res, 'Offer not found', [], 404);
    return sendSuccess(res, 'Offer retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateOffer = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const doc = await Offer.findOneAndUpdate(
      { _id: req.params.offerId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Offer not found', [], 404);
    return sendSuccess(res, 'Offer updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const doc = await Offer.findOneAndDelete({ _id: req.params.offerId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Offer not found', [], 404);
    return sendSuccess(res, 'Offer deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const activateOffer = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const doc = await Offer.findOneAndUpdate(
      { _id: req.params.offerId, tenantId: req.tenantId },
      { status: 'active' },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Offer not found', [], 404);
    return sendSuccess(res, 'Offer activated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deactivateOffer = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const doc = await Offer.findOneAndUpdate(
      { _id: req.params.offerId, tenantId: req.tenantId },
      { status: 'inactive' },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Offer not found', [], 404);
    return sendSuccess(res, 'Offer deactivated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. COUPONS
// ==========================================

export const createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minimumAmount, maximumDiscount, validFrom, validUntil, usageLimit } = req.body;
    if (!code || discountValue === undefined) {
      return sendError(res, 'Coupon code and discount value are required', [], 400);
    }

    const Coupon = getTenantModel(req, 'Coupon');
    const couponCode = code.trim().toUpperCase();

    const existing = await Coupon.findOne({ tenantId: req.tenantId, code: couponCode });
    if (existing) return sendError(res, 'A coupon with this code already exists', [], 409);

    const doc = await Coupon.create({
      tenantId: req.tenantId,
      code: couponCode,
      description: description || '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minimumAmount: Number(minimumAmount) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: validUntil ? new Date(validUntil) : null,
      usageLimit: Number(usageLimit) || 0,
      status: 'active',
    });

    return sendSuccess(res, 'Coupon created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCoupons = async (req, res) => {
  try {
    const Coupon = getTenantModel(req, 'Coupon');
    const { page, limit, skip } = getPagination(req.query);
    const filter = { tenantId: req.tenantId };
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;

    const [items, total] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Coupon.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCouponById = async (req, res) => {
  try {
    const Coupon = getTenantModel(req, 'Coupon');
    const doc = await Coupon.findOne({ _id: req.params.couponId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Coupon not found', [], 404);
    return sendSuccess(res, 'Coupon retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const Coupon = getTenantModel(req, 'Coupon');
    const doc = await Coupon.findOneAndUpdate(
      { _id: req.params.couponId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Coupon not found', [], 404);
    return sendSuccess(res, 'Coupon updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const Coupon = getTenantModel(req, 'Coupon');
    const doc = await Coupon.findOneAndDelete({ _id: req.params.couponId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Coupon not found', [], 404);
    return sendSuccess(res, 'Coupon deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateCouponStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const Coupon = getTenantModel(req, 'Coupon');
    const doc = await Coupon.findOneAndUpdate(
      { _id: req.params.couponId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Coupon not found', [], 404);
    return sendSuccess(res, `Coupon status updated to ${status}`, doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  updatePackageStatus,
  duplicatePackage,
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  activateOffer,
  deactivateOffer,
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
};
