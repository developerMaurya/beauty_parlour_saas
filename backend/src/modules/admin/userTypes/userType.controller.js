/**
 * @file userType.controller.js
 * @description Dynamic User Type Management Controller stored directly in MongoDB per Tenant.
 * Enables creating, updating, listing, and deleting custom user classifications across all business portals.
 * @module backend/src/modules/admin/userTypes/userType.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';

export const getUserTypes = async (req, res) => {
  try {
    const UserType = getTenantModel(req, 'UserType');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.targetBusiness && req.query.targetBusiness !== 'ALL') {
      filter.$or = [
        { targetBusiness: req.query.targetBusiness.toUpperCase() },
        { targetBusiness: 'ALL' },
      ];
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    let [items, total] = await Promise.all([
      UserType.find(filter).sort(sort).skip(skip).limit(limit),
      UserType.countDocuments(filter),
    ]);

    // If no user types exist in DB for this tenant, auto-seed only 2 standard user types into MongoDB
    if (total === 0) {
      const defaultUserTypes = [
        {
          tenantId: req.tenantId,
          name: 'Administrator',
          code: 'ADMIN',
          targetBusiness: 'ALL',
          description: 'Full administrative access across target business modules and dashboards.',
          isSystem: true,
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          name: 'Staff Member',
          code: 'STAFF',
          targetBusiness: 'PARLOUR',
          description: 'Operational and salon staff employee.',
          isSystem: true,
          status: 'active',
        },
      ];
      await UserType.insertMany(defaultUserTypes);
      items = await UserType.find(filter).sort(sort).skip(skip).limit(limit);
      total = items.length;
    }

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve user types from DB: ${error.message}`, [], 500);
  }
};

export const getUserTypeById = async (req, res) => {
  try {
    const UserType = getTenantModel(req, 'UserType');
    const doc = await UserType.findOne({ _id: req.params.typeId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'User Type not found', [], 404);
    return sendSuccess(res, 'User Type retrieved from DB', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const createUserType = async (req, res) => {
  try {
    const { name, code, description, targetBusiness, status } = req.body;
    if (!name) return sendError(res, 'User type name is required', [], 400);

    const UserType = getTenantModel(req, 'UserType');
    const typeCode = (code || name.replace(/[^a-zA-Z0-9]/g, '_')).toUpperCase();

    const existing = await UserType.findOne({ tenantId: req.tenantId, code: typeCode });
    if (existing) return sendError(res, 'A user type with this code already exists', [], 409);

    const doc = await UserType.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: typeCode,
      targetBusiness: (targetBusiness || 'ALL').toUpperCase(),
      description: description || '',
      isSystem: false,
      status: status || 'active',
    });

    return sendSuccess(res, 'User type created successfully in Database', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to create user type in DB: ${error.message}`, [], 500);
  }
};

export const updateUserType = async (req, res) => {
  try {
    const UserType = getTenantModel(req, 'UserType');
    const doc = await UserType.findOne({ _id: req.params.typeId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'User type not found', [], 404);

    if (doc.isSystem && req.body.code && req.body.code !== doc.code) {
      return sendError(res, 'Cannot change system user type code', [], 400);
    }

    if (req.body.name) doc.name = req.body.name.trim();
    if (req.body.code) doc.code = req.body.code.trim().toUpperCase();
    if (req.body.targetBusiness) doc.targetBusiness = req.body.targetBusiness.toUpperCase();
    if (req.body.description !== undefined) doc.description = req.body.description;
    if (req.body.status) doc.status = req.body.status;

    await doc.save();
    return sendSuccess(res, 'User type updated successfully in Database', doc);
  } catch (error) {
    return sendError(res, `Failed to update user type: ${error.message}`, [], 500);
  }
};

export const deleteUserType = async (req, res) => {
  try {
    const UserType = getTenantModel(req, 'UserType');
    const doc = await UserType.findOne({ _id: req.params.typeId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'User type not found', [], 404);
    if (doc.isSystem) return sendError(res, 'Core system user types cannot be deleted', [], 403);

    await doc.deleteOne();
    return sendSuccess(res, 'User type deleted successfully from Database');
  } catch (error) {
    return sendError(res, `Failed to delete user type: ${error.message}`, [], 500);
  }
};

export default {
  getUserTypes,
  getUserTypeById,
  createUserType,
  updateUserType,
  deleteUserType,
};

