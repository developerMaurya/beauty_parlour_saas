/**
 * @file customerFavorites.controller.js
 * @description Customer Favorites Controller.
 * Allows customers to bookmark favorite services, stylists/staff, and packages.
 * @module backend/src/modules/customer/favorites/customerFavorites.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * Get all favorite services, staff, and packages for the authenticated customer.
 */
export const getFavorites = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const ServiceModel = getTenantModel(req, 'Service');
    const StaffModel = getTenantModel(req, 'Staff');
    const PackageModel = getTenantModel(req, 'Package');

    const customer = await CustomerModel.findOne({
      _id: req.customerId,
      tenantId: req.tenantId,
    });

    if (!customer) {
      return sendError(res, 'Customer profile not found', [], 404);
    }

    const preferredServices = customer.preferredServices || [];
    const favoriteStaff = customer.favoriteStaff || [];
    const favoritePackages = customer.favoritePackages || [];

    const [services, staff, packages] = await Promise.all([
      preferredServices.length
        ? ServiceModel.find({ _id: { $in: preferredServices }, tenantId: req.tenantId, status: 'active' }).populate('categoryId', 'name')
        : [],
      favoriteStaff.length
        ? StaffModel.find({ _id: { $in: favoriteStaff }, tenantId: req.tenantId, status: 'active' }).select('name photo designation skills rating')
        : [],
      favoritePackages.length
        ? PackageModel.find({ _id: { $in: favoritePackages }, tenantId: req.tenantId, status: 'active' })
        : [],
    ]);

    return sendSuccess(res, 'Customer favorites retrieved successfully', {
      services,
      staff,
      packages,
      counts: {
        services: services.length,
        staff: staff.length,
        packages: packages.length,
      },
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve favorites: ${error.message}`, [], 500);
  }
};

/**
 * Add a service to favorites.
 */
export const addFavoriteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const CustomerModel = getTenantModel(req, 'Customer');
    const ServiceModel = getTenantModel(req, 'Service');

    const service = await ServiceModel.findOne({ _id: serviceId, tenantId: req.tenantId });
    if (!service) {
      return sendError(res, 'Service not found in this establishment', [], 404);
    }

    await CustomerModel.updateOne(
      { _id: req.customerId, tenantId: req.tenantId },
      { $addToSet: { preferredServices: serviceId } }
    );

    return sendSuccess(res, 'Service added to your favorites', { serviceId });
  } catch (error) {
    return sendError(res, `Failed to add favorite service: ${error.message}`, [], 500);
  }
};

/**
 * Remove a service from favorites.
 */
export const removeFavoriteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const CustomerModel = getTenantModel(req, 'Customer');

    await CustomerModel.updateOne(
      { _id: req.customerId, tenantId: req.tenantId },
      { $pull: { preferredServices: serviceId } }
    );

    return sendSuccess(res, 'Service removed from favorites', { serviceId });
  } catch (error) {
    return sendError(res, `Failed to remove favorite service: ${error.message}`, [], 500);
  }
};

/**
 * Add a staff member to favorites.
 */
export const addFavoriteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const CustomerModel = getTenantModel(req, 'Customer');
    const StaffModel = getTenantModel(req, 'Staff');

    const staff = await StaffModel.findOne({ _id: staffId, tenantId: req.tenantId });
    if (!staff) {
      return sendError(res, 'Staff member not found', [], 404);
    }

    await CustomerModel.updateOne(
      { _id: req.customerId, tenantId: req.tenantId },
      { $addToSet: { favoriteStaff: staffId } }
    );

    return sendSuccess(res, 'Stylist added to your favorites', { staffId });
  } catch (error) {
    return sendError(res, `Failed to add favorite staff: ${error.message}`, [], 500);
  }
};

/**
 * Remove a staff member from favorites.
 */
export const removeFavoriteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const CustomerModel = getTenantModel(req, 'Customer');

    await CustomerModel.updateOne(
      { _id: req.customerId, tenantId: req.tenantId },
      { $pull: { favoriteStaff: staffId } }
    );

    return sendSuccess(res, 'Stylist removed from favorites', { staffId });
  } catch (error) {
    return sendError(res, `Failed to remove favorite staff: ${error.message}`, [], 500);
  }
};

/**
 * Add a package to favorites.
 */
export const addFavoritePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const CustomerModel = getTenantModel(req, 'Customer');
    const PackageModel = getTenantModel(req, 'Package');

    const pkg = await PackageModel.findOne({ _id: packageId, tenantId: req.tenantId });
    if (!pkg) {
      return sendError(res, 'Package not found', [], 404);
    }

    await CustomerModel.updateOne(
      { _id: req.customerId, tenantId: req.tenantId },
      { $addToSet: { favoritePackages: packageId } }
    );

    return sendSuccess(res, 'Package added to your favorites', { packageId });
  } catch (error) {
    return sendError(res, `Failed to add favorite package: ${error.message}`, [], 500);
  }
};

/**
 * Remove a package from favorites.
 */
export const removeFavoritePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const CustomerModel = getTenantModel(req, 'Customer');

    await CustomerModel.updateOne(
      { _id: req.customerId, tenantId: req.tenantId },
      { $pull: { favoritePackages: packageId } }
    );

    return sendSuccess(res, 'Package removed from favorites', { packageId });
  } catch (error) {
    return sendError(res, `Failed to remove favorite package: ${error.message}`, [], 500);
  }
};

export default {
  getFavorites,
  addFavoriteService,
  removeFavoriteService,
  addFavoriteStaff,
  removeFavoriteStaff,
  addFavoritePackage,
  removeFavoritePackage,
};
