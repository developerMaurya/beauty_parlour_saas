/**
 * @file customerCatalog.controller.js
 * @description Customer Catalog Browsing, Packages, Offers & Server-Side Coupon Verification.
 * @module backend/src/modules/customer/catalog
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getServices = async (req, res) => {
  try {
    const { categoryId, branchId, search } = req.query;
    const filter = {
      tenantId: req.tenantId,
      status: 'active',
    };

    if (categoryId) filter.categoryId = categoryId;
    if (branchId) filter.branches = branchId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const ServiceModel = getTenantModel(req, 'Service');
    const services = await ServiceModel.find(filter)
      .populate('categoryId', 'name icon slug')
      .sort({ name: 1 });

    return sendSuccess(res, 'Services catalog retrieved', { services, total: services.length });
  } catch (err) {
    return sendError(res, 'Failed to fetch services: ' + err.message, [], 500);
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const ServiceModel = getTenantModel(req, 'Service');
    const service = await ServiceModel.findOne({ _id: id, tenantId: req.tenantId })
      .populate('categoryId', 'name icon slug');

    if (!service) {
      return sendError(res, 'Service not found', [], 404);
    }

    return sendSuccess(res, 'Service details retrieved', service);
  } catch (err) {
    return sendError(res, 'Error fetching service: ' + err.message, [], 500);
  }
};

export const getCategories = async (req, res) => {
  try {
    const ServiceCategoryModel = getTenantModel(req, 'ServiceCategory');
    const categories = await ServiceCategoryModel.find({
      tenantId: req.tenantId,
      status: 'active',
    }).sort({ displayOrder: 1, name: 1 });

    return sendSuccess(res, 'Service categories retrieved', categories);
  } catch (err) {
    return sendError(res, 'Failed to fetch categories: ' + err.message, [], 500);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const ServiceCategoryModel = getTenantModel(req, 'ServiceCategory');
    const category = await ServiceCategoryModel.findOne({ _id: id, tenantId: req.tenantId });
    if (!category) {
      return sendError(res, 'Category not found', [], 404);
    }
    return sendSuccess(res, 'Category details retrieved', category);
  } catch (err) {
    return sendError(res, 'Error fetching category: ' + err.message, [], 500);
  }
};

export const getPackages = async (req, res) => {
  try {
    const PackageModel = getTenantModel(req, 'Package');
    const packages = await PackageModel.find({
      tenantId: req.tenantId,
      status: 'active',
    }).populate('services.serviceId', 'name price durationMinutes');

    return sendSuccess(res, 'Packages catalog retrieved', packages);
  } catch (err) {
    return sendError(res, 'Failed to fetch packages: ' + err.message, [], 500);
  }
};

export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const PackageModel = getTenantModel(req, 'Package');
    const pkg = await PackageModel.findOne({ _id: id, tenantId: req.tenantId })
      .populate('services.serviceId', 'name price durationMinutes');

    if (!pkg) {
      return sendError(res, 'Package not found', [], 404);
    }
    return sendSuccess(res, 'Package details retrieved', pkg);
  } catch (err) {
    return sendError(res, 'Error fetching package: ' + err.message, [], 500);
  }
};

export const getOffers = async (req, res) => {
  try {
    const now = new Date();
    const OfferModel = getTenantModel(req, 'Offer');
    const offers = await OfferModel.find({
      tenantId: req.tenantId,
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate('applicableServices', 'name price');

    return sendSuccess(res, 'Active seasonal offers retrieved', offers);
  } catch (err) {
    return sendError(res, 'Failed to fetch offers: ' + err.message, [], 500);
  }
};

export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const OfferModel = getTenantModel(req, 'Offer');
    const offer = await OfferModel.findOne({ _id: id, tenantId: req.tenantId })
      .populate('applicableServices', 'name price');

    if (!offer) {
      return sendError(res, 'Offer not found or expired', [], 404);
    }
    return sendSuccess(res, 'Offer details retrieved', offer);
  } catch (err) {
    return sendError(res, 'Error fetching offer: ' + err.message, [], 500);
  }
};

export const getCoupons = async (req, res) => {
  try {
    const now = new Date();
    const CouponModel = getTenantModel(req, 'Coupon');
    const coupons = await CouponModel.find({
      tenantId: req.tenantId,
      status: 'active',
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    });

    return sendSuccess(res, 'Coupons list retrieved', coupons);
  } catch (err) {
    return sendError(res, 'Failed to fetch coupons: ' + err.message, [], 500);
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, orderAmount, cartAmount } = req.body;
    const total = Number(orderAmount || cartTotal || cartAmount || 0);

    if (!code) {
      return sendError(res, 'Coupon code is required', [], 400);
    }

    const CouponModel = getTenantModel(req, 'Coupon');
    const cleanCode = code.trim().toUpperCase();
    const coupon = await CouponModel.findOne({
      code: cleanCode,
      status: { $in: ['active', 'ACTIVE'] },
    });

    if (!coupon || (coupon.tenantId && String(coupon.tenantId) !== String(req.tenantId))) {
      return sendError(res, 'Invalid, expired, or non-existent coupon code', [], 400);
    }

    const minAmount = coupon.minCartValue || coupon.minOrderAmount || coupon.minimumAmount || 0;
    if (minAmount && total < minAmount) {
      return sendError(res, `Minimum order total of ₹${minAmount} required for this coupon`, [], 400);
    }

    // Calculate discount server-side
    let discount = 0;
    const discTypeLower = (coupon.discountType || '').toLowerCase();
    if (discTypeLower.includes('percent')) {
      discount = Math.round((total * (coupon.discountValue || 0)) / 100);
      const maxDisc = coupon.maxDiscount || coupon.maxDiscountAmount || coupon.maximumDiscount;
      if (maxDisc && discount > maxDisc) {
        discount = maxDisc;
      }
    } else {
      discount = Number(coupon.discountValue || 0);
    }

    return sendSuccess(res, 'Coupon validated successfully', {
      valid: true,
      code: coupon.code,
      discountAmount: discount,
      finalAmount: Math.max(0, total - discount),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (err) {
    return sendError(res, 'Coupon verification error: ' + err.message, [], 500);
  }
};

export const getServiceCategories = getCategories;
export const getServiceCategoryById = getCategoryById;

export default {
  getServices,
  getServiceById,
  getCategories,
  getCategoryById,
  getServiceCategories,
  getServiceCategoryById,
  getPackages,
  getPackageById,
  getOffers,
  getOfferById,
  getCoupons,
  validateCoupon,
};
