/**
 * @file user.controller.js
 * @description Dynamic User Management Controller for primary user types (ADMIN, STAFF, STUDENT, CUSTOMER).
 * Provides activate, deactivate, block, unblock, password reset, and session revocation.
 * @module backend/src/modules/admin/users/user.controller
 */

import bcrypt from 'bcrypt';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { revokeAllUserSessions } from '../../auth/services/session.service.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      username,
      password,
      role,
      userType,
      targetBusiness,
      customRoleId,
      branchId,
      allowedBranches,
      status,
    } = req.body;

    const assignedRole = (role || userType || 'STAFF').trim().toUpperCase();
    const assignedUserType = (userType || 'STAFF').trim().toUpperCase();
    const assignedTargetBusiness = (targetBusiness || 'ALL').trim().toUpperCase();

    if (!password || password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', [], 400);
    }

    const TenantUser = getTenantModel(req, 'TenantUser');

    // Duplicate check
    const query = { tenantId: req.tenantId, $or: [] };
    if (email) query.$or.push({ email: email.trim().toLowerCase() });
    if (phone) query.$or.push({ phone: phone.trim() });
    if (username) query.$or.push({ username: username.trim().toLowerCase() });

    if (query.$or.length > 0) {
      const existing = await TenantUser.findOne(query);
      if (existing) {
        return sendError(res, 'A user with this email, phone, or username already exists', [], 409);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await TenantUser.create({
      tenantId: req.tenantId,
      name: name ? name.trim() : (username || ''),
      email: email ? email.trim().toLowerCase() : null,
      phone: phone ? phone.trim() : null,
      username: username ? username.trim().toLowerCase() : null,
      passwordHash,
      targetBusiness: assignedTargetBusiness,
      userType: assignedUserType,
      role: assignedRole,
      customRoleId: customRoleId || null,
      branchId: branchId || null,
      allowedBranches: Array.isArray(allowedBranches) ? allowedBranches : [],
      status: status || 'active',
    });

    await recordAuditLog({
      req,
      action: 'USER_CREATED',
      resourceType: 'User',
      resourceId: user._id,
      details: { role: assignedRole, userType: assignedUserType, targetBusiness: assignedTargetBusiness, email: user.email },
    });

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return sendSuccess(res, 'User created successfully in Database', userResponse, 201);
  } catch (error) {
    return sendError(res, `Failed to create user in DB: ${error.message}`, [], 500);
  }
};

export const getUsers = async (req, res) => {
  try {
    const TenantUser = getTenantModel(req, 'TenantUser');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'createdAt');
    const filter = buildTenantFilter(req);

    if (req.query.targetBusiness && req.query.targetBusiness !== 'ALL') {
      filter.targetBusiness = req.query.targetBusiness.toUpperCase();
    }

    if (req.query.userType && req.query.userType !== 'all') {
      filter.userType = req.query.userType.toUpperCase();
    } else if (req.query.role && req.query.role !== 'all') {
      filter.role = req.query.role.toUpperCase();
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    let [items, total] = await Promise.all([
      TenantUser.find(filter)
        .select('-passwordHash')
        .populate('branchId', 'name code')
        .populate('customRoleId', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      TenantUser.countDocuments(filter),
    ]);

    // If no users exist, auto-seed only 2 standard accounts into MongoDB
    if (total === 0) {
      const defaultSalt = await bcrypt.genSalt(10);
      const defaultPwHash = await bcrypt.hash('Kashi@123', defaultSalt);
      const defaultUsers = [
        {
          tenantId: req.tenantId,
          name: 'Kashi Super Admin',
          email: 'admin@kashiservice.com',
          phone: '+91 98765 43210',
          username: 'superadmin',
          passwordHash: defaultPwHash,
          targetBusiness: 'ALL',
          userType: 'ADMIN',
          role: 'SUPER_ADMIN',
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          name: 'Priya Sharma (Beauty Stylist Lead)',
          email: 'priya.stylist@kashiservice.com',
          phone: '+91 98765 43211',
          username: 'priya.stylist',
          passwordHash: defaultPwHash,
          targetBusiness: 'PARLOUR',
          userType: 'STAFF',
          role: 'SENIOR_STYLIST',
          status: 'active',
        },
      ];
      await TenantUser.insertMany(defaultUsers);
      items = await TenantUser.find(filter)
        .select('-passwordHash')
        .populate('branchId', 'name code')
        .populate('customRoleId', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit);
      total = items.length;
    }

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve users from DB: ${error.message}`, [], 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const TenantUser = getTenantModel(req, 'TenantUser');
    const user = await TenantUser.findOne({ _id: req.params.userId, tenantId: req.tenantId })
      .select('-passwordHash')
      .populate('branchId')
      .populate('customRoleId');

    if (!user) return sendError(res, 'User not found in DB', [], 404);
    return sendSuccess(res, 'User retrieved from DB', user);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const TenantUser = getTenantModel(req, 'TenantUser');
    const user = await TenantUser.findOne({ _id: req.params.userId, tenantId: req.tenantId });
    if (!user) return sendError(res, 'User not found in DB', [], 404);

    const {
      name,
      email,
      phone,
      username,
      role,
      userType,
      targetBusiness,
      customRoleId,
      branchId,
      allowedBranches,
      permissions,
      status,
    } = req.body;

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (phone) user.phone = phone.trim();
    if (username) user.username = username.trim().toLowerCase();
    if (targetBusiness) user.targetBusiness = targetBusiness.toUpperCase();
    if (userType) user.userType = userType.toUpperCase();
    if (role) user.role = role.trim().toUpperCase();
    if (status) user.status = status;
    if (customRoleId !== undefined) user.customRoleId = customRoleId || null;
    if (branchId !== undefined) user.branchId = branchId || null;
    if (Array.isArray(allowedBranches)) user.allowedBranches = allowedBranches;
    if (Array.isArray(permissions)) user.permissions = permissions;

    await user.save();
    const response = user.toObject();
    delete response.passwordHash;
    return sendSuccess(res, 'User updated successfully in Database', response);
  } catch (error) {
    return sendError(res, `Failed to update user: ${error.message}`, [], 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const TenantUser = getTenantModel(req, 'TenantUser');
    const user = await TenantUser.findOne({ _id: req.params.userId, tenantId: req.tenantId });
    if (!user) return sendError(res, 'User not found', [], 404);

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return sendError(res, 'You cannot delete your own account', [], 400);
    }

    await user.deleteOne();
    await revokeAllUserSessions(user._id);

    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'suspended', 'blocked'].includes(status)) {
      return sendError(res, 'Invalid status', [], 400);
    }

    const TenantUser = getTenantModel(req, 'TenantUser');
    const user = await TenantUser.findOneAndUpdate(
      { _id: req.params.userId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    ).select('-passwordHash');

    if (!user) return sendError(res, 'User not found', [], 404);
    if (status !== 'active') {
      await revokeAllUserSessions(user._id);
    }

    return sendSuccess(res, `User status updated to ${status}`, user);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const blockUser = async (req, res) => {
  try {
    const { reason, expiresAt } = req.body;
    const TenantUser = getTenantModel(req, 'TenantUser');

    const user = await TenantUser.findOne({ _id: req.params.userId, tenantId: req.tenantId });
    if (!user) return sendError(res, 'User not found', [], 404);

    user.status = 'blocked';
    user.isBlocked = true;
    user.blockDetails = {
      reason: reason || 'Blocked by administrator',
      blockedBy: req.user._id,
      blockedAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    };

    await user.save();
    await revokeAllUserSessions(user._id);

    await recordAuditLog({
      req,
      action: 'USER_BLOCKED',
      resourceType: 'User',
      resourceId: user._id,
      details: { reason },
    });

    return sendSuccess(res, 'User blocked successfully', { id: user._id, status: user.status });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const unblockUser = async (req, res) => {
  try {
    const TenantUser = getTenantModel(req, 'TenantUser');
    const user = await TenantUser.findOne({ _id: req.params.userId, tenantId: req.tenantId });
    if (!user) return sendError(res, 'User not found', [], 404);

    user.status = 'active';
    user.isBlocked = false;
    user.blockDetails = {
      reason: null,
      blockedBy: null,
      blockedAt: null,
      expiresAt: null,
    };

    await user.save();

    await recordAuditLog({
      req,
      action: 'USER_UNBLOCKED',
      resourceType: 'User',
      resourceId: user._id,
    });

    return sendSuccess(res, 'User unblocked successfully', { id: user._id, status: user.status });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters', [], 400);
    }

    const TenantUser = getTenantModel(req, 'TenantUser');
    const user = await TenantUser.findOne({ _id: req.params.userId, tenantId: req.tenantId });
    if (!user) return sendError(res, 'User not found', [], 404);

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.sessionVersion = (user.sessionVersion || 1) + 1;
    await user.save();

    await revokeAllUserSessions(user._id);

    await recordAuditLog({
      req,
      action: 'USER_PASSWORD_RESET',
      resourceType: 'User',
      resourceId: user._id,
    });

    return sendSuccess(res, 'Password reset successfully. Active sessions revoked.');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const revokeUserSessions = async (req, res) => {
  try {
    const TenantUser = getTenantModel(req, 'TenantUser');
    const user = await TenantUser.findOne({ _id: req.params.userId, tenantId: req.tenantId });
    if (!user) return sendError(res, 'User not found', [], 404);

    user.sessionVersion = (user.sessionVersion || 1) + 1;
    await user.save();
    await revokeAllUserSessions(user._id);

    return sendSuccess(res, 'All active sessions for this user revoked successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  blockUser,
  unblockUser,
  resetUserPassword,
  revokeUserSessions,
};
