/**
 * @file rolePermission.controller.js
 * @description Dynamic RBAC Role and Permission Management Controller.
 * Allows Tenant Admin to create custom roles and assign fine-grained permissions dynamically.
 * @module backend/src/modules/admin/roles/rolePermission.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { SYSTEM_PERMISSIONS, PERMISSION_GROUPS } from '../../../constants/permissions.constants.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';

export const getPermissions = async (req, res) => {
  return sendSuccess(res, 'Permissions retrieved', SYSTEM_PERMISSIONS);
};

export const getGroupedPermissions = async (req, res) => {
  const grouped = {};
  for (const group of PERMISSION_GROUPS) {
    grouped[group] = [];
  }
  for (const perm of SYSTEM_PERMISSIONS) {
    if (!grouped[perm.group]) {
      grouped[perm.group] = [];
    }
    grouped[perm.group].push(perm);
  }
  return sendSuccess(res, 'Grouped permissions retrieved', grouped);
};

export const createRole = async (req, res) => {
  try {
    const { name, code, description, permissions } = req.body;
    if (!name) return sendError(res, 'Role name is required', [], 400);

    const Role = getTenantModel(req, 'Role');
    const roleCode = (code || name.replace(/[^a-zA-Z0-9]/g, '_')).toUpperCase();

    const existing = await Role.findOne({ tenantId: req.tenantId, code: roleCode });
    if (existing) return sendError(res, 'A role with this code already exists', [], 409);

    const doc = await Role.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: roleCode,
      description: description || '',
      isSystem: false,
      permissions: Array.isArray(permissions) ? permissions : [],
    });

    return sendSuccess(res, 'Role created successfully', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to create role: ${error.message}`, [], 500);
  }
};

export const getRoles = async (req, res) => {
  try {
    const Role = getTenantModel(req, 'Role');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Role.find(filter).sort(sort).skip(skip).limit(limit),
      Role.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve roles: ${error.message}`, [], 500);
  }
};

export const getRoleById = async (req, res) => {
  try {
    const Role = getTenantModel(req, 'Role');
    const doc = await Role.findOne({ _id: req.params.roleId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Role not found', [], 404);
    return sendSuccess(res, 'Role retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateRole = async (req, res) => {
  try {
    const Role = getTenantModel(req, 'Role');
    const role = await Role.findOne({ _id: req.params.roleId, tenantId: req.tenantId });
    if (!role) return sendError(res, 'Role not found', [], 404);

    if (role.isSystem && req.body.code && req.body.code !== role.code) {
      return sendError(res, 'Cannot change system role code', [], 400);
    }

    Object.assign(role, req.body);
    await role.save();

    return sendSuccess(res, 'Role updated successfully', role);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteRole = async (req, res) => {
  try {
    const Role = getTenantModel(req, 'Role');
    const role = await Role.findOne({ _id: req.params.roleId, tenantId: req.tenantId });
    if (!role) return sendError(res, 'Role not found', [], 404);
    if (role.isSystem) return sendError(res, 'System roles cannot be deleted', [], 403);

    await role.deleteOne();
    return sendSuccess(res, 'Role deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getRolePermissions = async (req, res) => {
  try {
    const Role = getTenantModel(req, 'Role');
    const role = await Role.findOne({ _id: req.params.roleId, tenantId: req.tenantId });
    if (!role) return sendError(res, 'Role not found', [], 404);
    return sendSuccess(res, 'Role permissions retrieved', role.permissions || []);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateRolePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    if (!Array.isArray(permissions)) {
      return sendError(res, 'Permissions must be an array of permission codes', [], 400);
    }

    const Role = getTenantModel(req, 'Role');
    const role = await Role.findOneAndUpdate(
      { _id: req.params.roleId, tenantId: req.tenantId },
      { permissions },
      { returnDocument: 'after' }
    );
    if (!role) return sendError(res, 'Role not found', [], 404);

    return sendSuccess(res, 'Role permissions updated successfully', role);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  getPermissions,
  getGroupedPermissions,
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
};
