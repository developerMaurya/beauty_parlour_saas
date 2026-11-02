/**
 * @file staffServicesCatalog.controller.js
 * @description Staff Services Catalogue, Skills, Packages, and Active Offers Controller.
 * Conforms to Sections 16, 17, 18, 19.
 * @module backend/src/modules/staff/services/staffServicesCatalog.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getServices = async (req, res) => {
  try {
    const ServiceModel = getTenantModel(req, 'Service');
    const filter = { tenantId: req.tenantId, status: 'active' };

    // If staff has assigned services, include those or branch-allowed services
    if (req.staff?.assignedServices?.length > 0) {
      filter.$or = [
        { _id: { $in: req.staff.assignedServices } },
        { branch: req.currentBranchId || req.staff?.branchId },
      ];
    } else if (req.currentBranchId) {
      filter.branch = req.currentBranchId;
    }

    const services = await ServiceModel.find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ name: 1 });

    return sendSuccess(res, services, 'Staff assigned services fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch services', [error.message], 500);
  }
};

export const getService = async (req, res) => {
  try {
    const ServiceModel = getTenantModel(req, 'Service');
    const service = await ServiceModel.findOne({
      _id: req.params.serviceId,
      tenantId: req.tenantId,
    })
      .populate('category', 'name')
      .populate('subcategory', 'name');

    if (!service) {
      return sendError(res, 'Service not found', [], 404);
    }

    return sendSuccess(res, service, 'Service details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch service', [error.message], 500);
  }
};

export const getCategories = async (req, res) => {
  try {
    const CategoryModel = getTenantModel(req, 'ServiceCategory');
    const categories = await CategoryModel.find({ tenantId: req.tenantId }).sort({ name: 1 });
    return sendSuccess(res, categories, 'Service categories fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch categories', [error.message], 500);
  }
};

export const getOptions = async (req, res) => {
  try {
    const ServiceModel = getTenantModel(req, 'Service');
    const services = await ServiceModel.find({ tenantId: req.tenantId }).select('name options addons');
    return sendSuccess(res, services, 'Service options fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch options', [error.message], 500);
  }
};

// Section 17: Staff Skills & Requests
export const getSkills = async (req, res) => {
  try {
    return sendSuccess(res, req.staff?.skills || [], 'Staff current skills fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch skills', [error.message], 500);
  }
};

export const getSpecializations = async (req, res) => {
  try {
    return sendSuccess(res, req.staff?.specializations || [], 'Staff specializations fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch specializations', [error.message], 500);
  }
};

export const createSkillRequest = async (req, res) => {
  try {
    const SkillReqModel = getTenantModel(req, 'SkillRequest');
    const { skillName, reason } = req.body;

    if (!skillName) {
      return sendError(res, 'Skill name is required', [], 400);
    }

    const request = await SkillReqModel.create({
      tenantId: req.tenantId,
      staffId: req.staffId,
      skillName,
      reason: reason || '',
      status: 'pending',
    });

    return sendSuccess(res, request, 'Skill update request submitted to administrator');
  } catch (error) {
    return sendError(res, 'Failed to request skill update', [error.message], 500);
  }
};

export const listSkillRequests = async (req, res) => {
  try {
    const SkillReqModel = getTenantModel(req, 'SkillRequest');
    const requests = await SkillReqModel.find({
      tenantId: req.tenantId,
      staffId: req.staffId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, requests, 'Skill requests fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch skill requests', [error.message], 500);
  }
};

export const cancelSkillRequest = async (req, res) => {
  try {
    const SkillReqModel = getTenantModel(req, 'SkillRequest');
    const reqDoc = await SkillReqModel.findOneAndUpdate(
      { _id: req.params.requestId, tenantId: req.tenantId, staffId: req.staffId, status: 'pending' },
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    return sendSuccess(res, reqDoc, 'Skill request cancelled');
  } catch (error) {
    return sendError(res, 'Failed to cancel request', [error.message], 500);
  }
};

// Section 18: Packages
export const getPackages = async (req, res) => {
  try {
    const PackageModel = getTenantModel(req, 'Package');
    const packages = await PackageModel.find({
      tenantId: req.tenantId,
      status: 'active',
    }).sort({ name: 1 });

    return sendSuccess(res, packages, 'Available combo packages fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch packages', [error.message], 500);
  }
};

export const getPackage = async (req, res) => {
  try {
    const PackageModel = getTenantModel(req, 'Package');
    const pkg = await PackageModel.findOne({
      _id: req.params.packageId,
      tenantId: req.tenantId,
    });

    if (!pkg) {
      return sendError(res, 'Package not found', [], 404);
    }

    return sendSuccess(res, pkg, 'Package details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch package', [error.message], 500);
  }
};

// Section 19: Offers
export const getOffers = async (req, res) => {
  try {
    const OfferModel = getTenantModel(req, 'Offer');
    const offers = await OfferModel.find({
      tenantId: req.tenantId,
      status: 'active',
    }).sort({ validUntil: 1 });

    return sendSuccess(res, offers, 'Active salon offers fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch offers', [error.message], 500);
  }
};

export const getOffer = async (req, res) => {
  try {
    const OfferModel = getTenantModel(req, 'Offer');
    const offer = await OfferModel.findOne({
      _id: req.params.offerId,
      tenantId: req.tenantId,
    });

    return sendSuccess(res, offer, 'Offer details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch offer', [error.message], 500);
  }
};

export const getSkillRequestById = async (req, res) => {
  try {
    const SkillReqModel = getTenantModel(req, 'SkillRequest');
    const item = await SkillReqModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
    });
    if (!item) {
      return sendError(res, 'Skill request not found', [], 404);
    }
    return sendSuccess(res, item, 'Skill request fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch skill request', [error.message], 500);
  }
};

export const getServiceCategories = getCategories;
export const getServiceOptions = getOptions;
export const getServiceById = getService;
export const getPackageById = getPackage;
export const getOfferById = getOffer;
export const getSkillRequests = listSkillRequests;

export default {
  getServices,
  getService,
  getServiceById,
  getCategories,
  getServiceCategories,
  getOptions,
  getServiceOptions,
  getSkills,
  getSpecializations,
  createSkillRequest,
  listSkillRequests,
  getSkillRequests,
  getSkillRequestById,
  cancelSkillRequest,
  getPackages,
  getPackage,
  getPackageById,
  getOffers,
  getOffer,
  getOfferById,
};

