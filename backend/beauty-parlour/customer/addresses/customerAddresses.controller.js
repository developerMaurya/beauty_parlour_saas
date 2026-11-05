/**
 * @file customerAddresses.controller.js
 * @description Customer Saved Addresses Controller for Home Services.
 * Allows customers to manage residential and office dispatch locations.
 * @module backend/src/modules/customer/addresses/customerAddresses.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getAddresses = async (req, res) => {
  try {
    const AddressModel = getTenantModel(req, 'CustomerAddress');

    const addresses = await AddressModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
    }).sort({ isDefault: -1, createdAt: -1 });

    return sendSuccess(res, 'Customer addresses retrieved successfully', addresses);
  } catch (error) {
    return sendError(res, `Failed to retrieve addresses: ${error.message}`, [], 500);
  }
};

export const createAddress = async (req, res) => {
  try {
    const {
      label = 'Home',
      houseFlat,
      street,
      area,
      city,
      state,
      pincode,
      landmark,
      latitude,
      longitude,
      instructions,
      isDefault = false,
    } = req.body;

    if (!houseFlat || !street || !city || !pincode) {
      return sendError(res, 'House/Flat, street, city, and pincode are required', [], 400);
    }

    const AddressModel = getTenantModel(req, 'CustomerAddress');

    // If marked default, unset existing defaults
    if (isDefault) {
      await AddressModel.updateMany(
        { tenantId: req.tenantId, customerId: req.customerId },
        { $set: { isDefault: false } }
      );
    }

    // Check if first address, make it default automatically
    const count = await AddressModel.countDocuments({
      tenantId: req.tenantId,
      customerId: req.customerId,
    });
    const willBeDefault = isDefault || count === 0;

    const address = await AddressModel.create({
      tenantId: req.tenantId,
      customerId: req.customerId,
      label,
      houseFlat: houseFlat.trim(),
      street: street.trim(),
      area: (area || '').trim(),
      city: city.trim(),
      state: (state || '').trim(),
      pincode: pincode.trim(),
      landmark: (landmark || '').trim(),
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      instructions: (instructions || '').trim(),
      isDefault: willBeDefault,
    });

    return sendSuccess(res, 'Address saved successfully', address, 201);
  } catch (error) {
    return sendError(res, `Failed to save address: ${error.message}`, [], 500);
  }
};

export const getAddressById = async (req, res) => {
  try {
    const AddressModel = getTenantModel(req, 'CustomerAddress');

    const address = await AddressModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!address) {
      return sendError(res, 'Address not found', [], 404);
    }

    return sendSuccess(res, 'Address retrieved', address);
  } catch (error) {
    return sendError(res, `Failed to retrieve address: ${error.message}`, [], 500);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const AddressModel = getTenantModel(req, 'CustomerAddress');

    const { isDefault, ...rest } = req.body;

    if (isDefault) {
      await AddressModel.updateMany(
        { tenantId: req.tenantId, customerId: req.customerId },
        { $set: { isDefault: false } }
      );
    }

    const address = await AddressModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { ...rest, ...(isDefault !== undefined ? { isDefault } : {}) } },
      { new: true }
    );

    if (!address) {
      return sendError(res, 'Address not found or unauthorized', [], 404);
    }

    return sendSuccess(res, 'Address updated successfully', address);
  } catch (error) {
    return sendError(res, `Failed to update address: ${error.message}`, [], 500);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const AddressModel = getTenantModel(req, 'CustomerAddress');

    const address = await AddressModel.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!address) {
      return sendError(res, 'Address not found or unauthorized', [], 404);
    }

    return sendSuccess(res, 'Address deleted successfully', { addressId: req.params.id });
  } catch (error) {
    return sendError(res, `Failed to delete address: ${error.message}`, [], 500);
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const AddressModel = getTenantModel(req, 'CustomerAddress');

    await AddressModel.updateMany(
      { tenantId: req.tenantId, customerId: req.customerId },
      { $set: { isDefault: false } }
    );

    const address = await AddressModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!address) {
      return sendError(res, 'Address not found', [], 404);
    }

    return sendSuccess(res, 'Default address updated successfully', address);
  } catch (error) {
    return sendError(res, `Failed to set default address: ${error.message}`, [], 500);
  }
};

export default {
  getAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
