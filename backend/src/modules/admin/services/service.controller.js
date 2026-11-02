/**
 * @file service.controller.js
 * @description Dynamic Unified Service Architecture Controller.
 * Manages Service Categories, Subcategories, Services, Options/Variants, Add-ons, Duplication, and Multi-criteria Filtering.
 * Supports Hair, Makeup, Massage, Parlour, Spa, Academy, and any custom vertical from the same dynamic system.
 * @module backend/src/modules/admin/services/service.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';

// ==========================================
// 1. SERVICE CATEGORIES
// ==========================================

export const createServiceCategory = async (req, res) => {
  try {
    const { name, icon, description, sortOrder } = req.body;
    if (!name) return sendError(res, 'Category name is required', [], 400);

    const ServiceCategory = getTenantModel(req, 'ServiceCategory');
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const doc = await ServiceCategory.create({
      tenantId: req.tenantId,
      name: name.trim(),
      slug,
      icon: icon || 'Sparkles',
      description: description || '',
      sortOrder: Number(sortOrder) || 0,
      status: 'active',
    });

    return sendSuccess(res, 'Category created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceCategories = async (req, res) => {
  try {
    const ServiceCategory = getTenantModel(req, 'ServiceCategory');
    const filter = { tenantId: req.tenantId };
    if (req.query.status) filter.status = req.query.status;

    const items = await ServiceCategory.find(filter).sort({ sortOrder: 1, name: 1 });
    return sendSuccess(res, 'Service categories retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceCategoryById = async (req, res) => {
  try {
    const ServiceCategory = getTenantModel(req, 'ServiceCategory');
    const doc = await ServiceCategory.findOne({ _id: req.params.categoryId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Category not found', [], 404);
    return sendSuccess(res, 'Category retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateServiceCategory = async (req, res) => {
  try {
    const ServiceCategory = getTenantModel(req, 'ServiceCategory');
    const doc = await ServiceCategory.findOneAndUpdate(
      { _id: req.params.categoryId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Category not found', [], 404);
    return sendSuccess(res, 'Category updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteServiceCategory = async (req, res) => {
  try {
    const ServiceCategory = getTenantModel(req, 'ServiceCategory');
    const doc = await ServiceCategory.findOneAndDelete({ _id: req.params.categoryId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Category not found', [], 404);
    return sendSuccess(res, 'Category deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. SERVICE SUBCATEGORIES
// ==========================================

export const createServiceSubcategory = async (req, res) => {
  try {
    const { categoryId, name, description, sortOrder } = req.body;
    if (!categoryId || !name) return sendError(res, 'Category ID and Subcategory name are required', [], 400);

    const ServiceSubcategory = getTenantModel(req, 'ServiceSubcategory');
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const doc = await ServiceSubcategory.create({
      tenantId: req.tenantId,
      categoryId,
      name: name.trim(),
      slug,
      description: description || '',
      sortOrder: Number(sortOrder) || 0,
      status: 'active',
    });

    return sendSuccess(res, 'Subcategory created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceSubcategories = async (req, res) => {
  try {
    const ServiceSubcategory = getTenantModel(req, 'ServiceSubcategory');
    const filter = { tenantId: req.tenantId };
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;

    const items = await ServiceSubcategory.find(filter).populate('categoryId', 'name').sort({ sortOrder: 1, name: 1 });
    return sendSuccess(res, 'Service subcategories retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceSubcategoryById = async (req, res) => {
  try {
    const ServiceSubcategory = getTenantModel(req, 'ServiceSubcategory');
    const doc = await ServiceSubcategory.findOne({ _id: req.params.subcategoryId, tenantId: req.tenantId }).populate('categoryId');
    if (!doc) return sendError(res, 'Subcategory not found', [], 404);
    return sendSuccess(res, 'Subcategory retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateServiceSubcategory = async (req, res) => {
  try {
    const ServiceSubcategory = getTenantModel(req, 'ServiceSubcategory');
    const doc = await ServiceSubcategory.findOneAndUpdate(
      { _id: req.params.subcategoryId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Subcategory not found', [], 404);
    return sendSuccess(res, 'Subcategory updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteServiceSubcategory = async (req, res) => {
  try {
    const ServiceSubcategory = getTenantModel(req, 'ServiceSubcategory');
    const doc = await ServiceSubcategory.findOneAndDelete({ _id: req.params.subcategoryId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Subcategory not found', [], 404);
    return sendSuccess(res, 'Subcategory deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. SERVICES (UNIFIED DYNAMIC SYSTEM)
// ==========================================

export const createService = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      subcategoryId,
      description,
      durationMinutes,
      price,
      discountPrice,
      taxRate,
      gender,
      branchIds,
      assignedStaff,
      requiredSkills,
      imageUrl,
      gallery,
      homeServiceAllowed,
      appointmentAllowed,
      walkInAllowed,
    } = req.body;

    if (!name || !categoryId || price === undefined) {
      return sendError(res, 'Service name, category, and price are required', [], 400);
    }

    const Service = getTenantModel(req, 'Service');
    const service = await Service.create({
      tenantId: req.tenantId,
      name: name.trim(),
      categoryId,
      subcategoryId: subcategoryId || null,
      description: description || '',
      durationMinutes: Number(durationMinutes) || 30,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      taxRate: Number(taxRate) || 0,
      gender: gender || 'unisex',
      branchIds: Array.isArray(branchIds) ? branchIds : [],
      assignedStaff: Array.isArray(assignedStaff) ? assignedStaff : [],
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      imageUrl: imageUrl || '',
      gallery: Array.isArray(gallery) ? gallery : [],
      homeServiceAllowed: Boolean(homeServiceAllowed),
      appointmentAllowed: appointmentAllowed !== undefined ? Boolean(appointmentAllowed) : true,
      walkInAllowed: walkInAllowed !== undefined ? Boolean(walkInAllowed) : true,
      status: 'active',
    });

    await recordAuditLog({
      req,
      action: 'SERVICE_CREATED',
      resourceType: 'Service',
      resourceId: service._id,
      details: { name: service.name, price: service.price },
    });

    return sendSuccess(res, 'Service created successfully', service, 201);
  } catch (error) {
    return sendError(res, `Failed to create service: ${error.message}`, [], 500);
  }
};

export const getServices = async (req, res) => {
  try {
    const Service = getTenantModel(req, 'Service');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = { tenantId: req.tenantId };

    if (req.query.categoryId) filter.categoryId = req.query.categoryId;
    if (req.query.subcategoryId) filter.subcategoryId = req.query.subcategoryId;
    if (req.query.gender && req.query.gender !== 'all') filter.gender = req.query.gender;
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;

    if (req.query.homeServiceAllowed !== undefined) {
      filter.homeServiceAllowed = req.query.homeServiceAllowed === 'true';
    }
    if (req.query.appointmentAllowed !== undefined) {
      filter.appointmentAllowed = req.query.appointmentAllowed === 'true';
    }

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
      Service.find(filter)
        .populate('categoryId', 'name icon slug')
        .populate('subcategoryId', 'name slug')
        .populate('branchIds', 'name code')
        .populate('assignedStaff', 'name phone')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Service.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceById = async (req, res) => {
  try {
    const Service = getTenantModel(req, 'Service');
    const ServiceOption = getTenantModel(req, 'ServiceOption');
    const ServiceAddon = getTenantModel(req, 'ServiceAddon');

    const service = await Service.findOne({ _id: req.params.serviceId, tenantId: req.tenantId })
      .populate('categoryId')
      .populate('subcategoryId')
      .populate('branchIds')
      .populate('assignedStaff');

    if (!service) return sendError(res, 'Service not found', [], 404);

    const [options, addons] = await Promise.all([
      ServiceOption.find({ tenantId: req.tenantId, serviceId: service._id, status: 'active' }),
      ServiceAddon.find({ tenantId: req.tenantId, serviceId: service._id, status: 'active' }),
    ]);

    return sendSuccess(res, 'Service retrieved successfully', {
      service,
      options,
      addons,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateService = async (req, res) => {
  try {
    const Service = getTenantModel(req, 'Service');
    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!service) return sendError(res, 'Service not found', [], 404);

    return sendSuccess(res, 'Service updated successfully', service);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteService = async (req, res) => {
  try {
    const Service = getTenantModel(req, 'Service');
    const service = await Service.findOneAndDelete({ _id: req.params.serviceId, tenantId: req.tenantId });
    if (!service) return sendError(res, 'Service not found', [], 404);

    return sendSuccess(res, 'Service deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const Service = getTenantModel(req, 'Service');
    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    );
    if (!service) return sendError(res, 'Service not found', [], 404);
    return sendSuccess(res, `Service status updated to ${status}`, service);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const duplicateService = async (req, res) => {
  try {
    const Service = getTenantModel(req, 'Service');
    const ServiceOption = getTenantModel(req, 'ServiceOption');
    const ServiceAddon = getTenantModel(req, 'ServiceAddon');

    const original = await Service.findOne({ _id: req.params.serviceId, tenantId: req.tenantId });
    if (!original) return sendError(res, 'Original service not found', [], 404);

    const duplicateData = original.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.name = `${original.name} (Copy)`;

    const newService = await Service.create(duplicateData);

    // Duplicate options and addons if any
    const [options, addons] = await Promise.all([
      ServiceOption.find({ tenantId: req.tenantId, serviceId: original._id }),
      ServiceAddon.find({ tenantId: req.tenantId, serviceId: original._id }),
    ]);

    for (const opt of options) {
      const optData = opt.toObject();
      delete optData._id;
      optData.serviceId = newService._id;
      await ServiceOption.create(optData);
    }

    for (const add of addons) {
      const addData = add.toObject();
      delete addData._id;
      addData.serviceId = newService._id;
      await ServiceAddon.create(addData);
    }

    return sendSuccess(res, 'Service duplicated successfully', newService, 201);
  } catch (error) {
    return sendError(res, `Failed to duplicate service: ${error.message}`, [], 500);
  }
};

// ==========================================
// 4. SERVICE OPTIONS / VARIANTS
// ==========================================

export const createServiceOption = async (req, res) => {
  try {
    const { name, price, durationMinutes, description } = req.body;
    if (!name || price === undefined) return sendError(res, 'Option name and price are required', [], 400);

    const ServiceOption = getTenantModel(req, 'ServiceOption');
    const option = await ServiceOption.create({
      tenantId: req.tenantId,
      serviceId: req.params.serviceId,
      name: name.trim(),
      price: Number(price),
      durationMinutes: Number(durationMinutes) || 0,
      description: description || '',
      status: 'active',
    });

    return sendSuccess(res, 'Service option added successfully', option, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceOptions = async (req, res) => {
  try {
    const ServiceOption = getTenantModel(req, 'ServiceOption');
    const items = await ServiceOption.find({ tenantId: req.tenantId, serviceId: req.params.serviceId });
    return sendSuccess(res, 'Service options retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceOptionById = async (req, res) => {
  try {
    const ServiceOption = getTenantModel(req, 'ServiceOption');
    const doc = await ServiceOption.findOne({
      _id: req.params.optionId,
      tenantId: req.tenantId,
      serviceId: req.params.serviceId,
    });
    if (!doc) return sendError(res, 'Option not found', [], 404);
    return sendSuccess(res, 'Service option retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateServiceOption = async (req, res) => {
  try {
    const ServiceOption = getTenantModel(req, 'ServiceOption');
    const doc = await ServiceOption.findOneAndUpdate(
      { _id: req.params.optionId, tenantId: req.tenantId, serviceId: req.params.serviceId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Option not found', [], 404);
    return sendSuccess(res, 'Service option updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteServiceOption = async (req, res) => {
  try {
    const ServiceOption = getTenantModel(req, 'ServiceOption');
    const doc = await ServiceOption.findOneAndDelete({
      _id: req.params.optionId,
      tenantId: req.tenantId,
      serviceId: req.params.serviceId,
    });
    if (!doc) return sendError(res, 'Option not found', [], 404);
    return sendSuccess(res, 'Service option deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 5. SERVICE ADD-ONS
// ==========================================

export const createServiceAddon = async (req, res) => {
  try {
    const { name, price, durationMinutes, description } = req.body;
    if (!name || price === undefined) return sendError(res, 'Add-on name and price are required', [], 400);

    const ServiceAddon = getTenantModel(req, 'ServiceAddon');
    const addon = await ServiceAddon.create({
      tenantId: req.tenantId,
      serviceId: req.params.serviceId,
      name: name.trim(),
      price: Number(price),
      durationMinutes: Number(durationMinutes) || 15,
      description: description || '',
      status: 'active',
    });

    return sendSuccess(res, 'Service add-on added successfully', addon, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceAddons = async (req, res) => {
  try {
    const ServiceAddon = getTenantModel(req, 'ServiceAddon');
    const items = await ServiceAddon.find({ tenantId: req.tenantId, serviceId: req.params.serviceId });
    return sendSuccess(res, 'Service add-ons retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateServiceAddon = async (req, res) => {
  try {
    const ServiceAddon = getTenantModel(req, 'ServiceAddon');
    const doc = await ServiceAddon.findOneAndUpdate(
      { _id: req.params.addonId, tenantId: req.tenantId, serviceId: req.params.serviceId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Add-on not found', [], 404);
    return sendSuccess(res, 'Service add-on updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteServiceAddon = async (req, res) => {
  try {
    const ServiceAddon = getTenantModel(req, 'ServiceAddon');
    const doc = await ServiceAddon.findOneAndDelete({
      _id: req.params.addonId,
      tenantId: req.tenantId,
      serviceId: req.params.serviceId,
    });
    if (!doc) return sendError(res, 'Add-on not found', [], 404);
    return sendSuccess(res, 'Service add-on deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createServiceCategory,
  getServiceCategories,
  getServiceCategoryById,
  updateServiceCategory,
  deleteServiceCategory,
  createServiceSubcategory,
  getServiceSubcategories,
  getServiceSubcategoryById,
  updateServiceSubcategory,
  deleteServiceSubcategory,
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  updateServiceStatus,
  duplicateService,
  createServiceOption,
  getServiceOptions,
  getServiceOptionById,
  updateServiceOption,
  deleteServiceOption,
  createServiceAddon,
  getServiceAddons,
  updateServiceAddon,
  deleteServiceAddon,
};
