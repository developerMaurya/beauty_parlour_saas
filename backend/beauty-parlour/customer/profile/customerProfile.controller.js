/**
 * @file customerProfile.controller.js
 * @description Customer Profile Management & Mass-Assignment Protection Controller.
 * @module backend/src/modules/customer/profile
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getProfile = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findById(req.customerId)
      .populate('preferredBranch', 'name code address phone')
      .populate('assignedBranch', 'name code address phone');

    if (!customer) {
      return sendError(res, 'Customer profile not found', [], 404);
    }

    const data = customer.toObject();
    delete data.passwordHash;

    return sendSuccess(res, 'Customer profile retrieved', data);
  } catch (err) {
    return sendError(res, 'Error fetching profile: ' + err.message, [], 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findById(req.customerId);

    if (!customer) {
      return sendError(res, 'Customer profile not found', [], 404);
    }

    // Mass-assignment protection: reject attempts to alter sensitive administrative fields
    const disallowedFields = ['customerId', 'customerNumber', 'tenantId', 'status', 'totalSpend', 'totalSpent', 'totalVisits', 'membership', 'loyaltyPoints'];
    for (const field of disallowedFields) {
      if (req.body[field] !== undefined) {
        delete req.body[field];
      }
    }

    const allowedUpdates = [
      'name',
      'gender',
      'dateOfBirth',
      'anniversaryDate',
      'email',
      'phone',
      'profilePhoto',
      'emergencyContact',
      'preferredBranch',
      'city',
      'state',
      'country',
      'pincode',
      'address',
    ];

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        if (key === 'address' && typeof req.body.address === 'object') {
          customer.address = { ...customer.address?.toObject?.() || {}, ...req.body.address };
        } else if (key === 'emergencyContact' && typeof req.body.emergencyContact === 'object') {
          customer.emergencyContact = { ...customer.emergencyContact?.toObject?.() || {}, ...req.body.emergencyContact };
        } else {
          customer[key] = req.body[key];
          if (['city', 'state', 'country', 'pincode'].includes(key)) {
            if (!customer.address) customer.address = {};
            customer.address[key] = req.body[key];
          }
        }
      }
    }

    await customer.save();

    const sanitized = customer.toObject();
    delete sanitized.passwordHash;

    return sendSuccess(res, 'Customer profile updated successfully', sanitized);
  } catch (err) {
    return sendError(res, 'Failed to update profile: ' + err.message, [], 500);
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) {
      return sendError(res, 'Photo URL is required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findByIdAndUpdate(
      req.customerId,
      { profilePhoto: photoUrl },
      { new: true }
    );

    return sendSuccess(res, 'Profile photo updated', { profilePhoto: customer.profilePhoto });
  } catch (err) {
    return sendError(res, 'Failed to upload photo: ' + err.message, [], 500);
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    await CustomerModel.findByIdAndUpdate(req.customerId, { profilePhoto: '' });
    return sendSuccess(res, 'Profile photo removed');
  } catch (err) {
    return sendError(res, 'Failed to remove photo: ' + err.message, [], 500);
  }
};

export const uploadProfilePhoto = uploadPhoto;
export const deleteProfilePhoto = deletePhoto;

export default {
  getProfile,
  updateProfile,
  uploadPhoto,
  uploadProfilePhoto,
  deletePhoto,
  deleteProfilePhoto,
};
