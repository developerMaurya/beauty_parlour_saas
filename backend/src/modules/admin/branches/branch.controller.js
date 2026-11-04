/**
 * @file branch.controller.js
 * @description Multi-Branch Management Controller with Opening Hours, Dashboard Stats, and Default Branch Setting.
 * @module backend/src/modules/admin/branches/branch.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';

export const createBranch = async (req, res) => {
  try {
    const { name, code, phone, email, address, openingTime, closingTime, weeklyOff, isDefault } = req.body;

    if (!name) return sendError(res, 'Branch name is required', [], 400);

    const Branch = getTenantModel(req, 'Branch');
    const branchCode = (code || name.slice(0, 3)).toUpperCase();

    // If marked default, unset others
    if (isDefault) {
      await Branch.updateMany({ tenantId: req.tenantId }, { isDefault: false });
    }

    const branch = await Branch.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: branchCode,
      phone: phone || '',
      email: email ? email.trim().toLowerCase() : '',
      address: address || {},
      openingTime: openingTime || '09:00',
      closingTime: closingTime || '20:00',
      weeklyOff: Array.isArray(weeklyOff) ? weeklyOff : [],
      isDefault: Boolean(isDefault),
      status: 'active',
    });

    await recordAuditLog({
      req,
      action: 'BRANCH_CREATED',
      resourceType: 'Branch',
      resourceId: branch._id,
      details: { name: branch.name, code: branch.code },
    });

    return sendSuccess(res, 'Branch created successfully', branch, 201);
  } catch (error) {
    return sendError(res, `Failed to create branch: ${error.message}`, [], 500);
  }
};

export const getBranches = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = { tenantId: req.tenantId };

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
        { 'address.city': { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Branch.find(filter).sort(sort).skip(skip).limit(limit),
      Branch.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve branches: ${error.message}`, [], 500);
  }
};

export const getBranchById = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const branch = await Branch.findOne({ _id: req.params.branchId, tenantId: req.tenantId });
    if (!branch) return sendError(res, 'Branch not found', [], 404);
    return sendSuccess(res, 'Branch retrieved', branch);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateBranch = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const branch = await Branch.findOne({ _id: req.params.branchId, tenantId: req.tenantId });
    if (!branch) return sendError(res, 'Branch not found', [], 404);

    if (req.body.isDefault) {
      await Branch.updateMany({ tenantId: req.tenantId }, { isDefault: false });
    }

    Object.assign(branch, req.body);
    await branch.save();

    return sendSuccess(res, 'Branch updated successfully', branch);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const branch = await Branch.findOne({ _id: req.params.branchId, tenantId: req.tenantId });
    if (!branch) return sendError(res, 'Branch not found', [], 404);

    const totalBranches = await Branch.countDocuments({ tenantId: req.tenantId });
    if (totalBranches <= 1) {
      return sendError(res, 'Cannot delete the only branch of the salon. At least one branch must remain active.', [], 400);
    }

    const wasDefault = branch.isDefault;
    await branch.deleteOne();

    // If default branch was deleted, ensure another active branch becomes default
    if (wasDefault) {
      const remainingDefault = await Branch.findOne({ tenantId: req.tenantId, isDefault: true });
      if (!remainingDefault) {
        await Branch.findOneAndUpdate({ tenantId: req.tenantId }, { isDefault: true });
      }
    }

    return sendSuccess(res, 'Branch deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateBranchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return sendError(res, 'Status must be active or inactive', [], 400);
    }

    const Branch = getTenantModel(req, 'Branch');
    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.branchId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    );
    if (!branch) return sendError(res, 'Branch not found', [], 404);

    return sendSuccess(res, `Branch status updated to ${status}`, branch);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const setDefaultBranch = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const branch = await Branch.findOne({ _id: req.params.branchId, tenantId: req.tenantId });
    if (!branch) return sendError(res, 'Branch not found', [], 404);

    await Branch.updateMany({ tenantId: req.tenantId }, { isDefault: false });
    branch.isDefault = true;
    await branch.save();

    return sendSuccess(res, `${branch.name} is now the default branch`, branch);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getBranchDashboard = async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const Appointment = getTenantModel(req, 'Appointment');
    const Staff = getTenantModel(req, 'Staff');
    const Bill = getTenantModel(req, 'Bill');

    const todayStr = new Date().toISOString().split('T')[0];

    const [todayAppointments, activeStaff, revenueAggregate] = await Promise.all([
      Appointment.countDocuments({ tenantId: req.tenantId, branchId, date: todayStr }),
      Staff.countDocuments({ tenantId: req.tenantId, branchId, status: 'active' }),
      Bill.aggregate([
        { $match: { tenantId: req.tenantId, branchId: new (getTenantModel(req, 'Branch').base.Types.ObjectId)(branchId), paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } },
      ]),
    ]);

    return sendSuccess(res, 'Branch dashboard metrics retrieved', {
      branchId,
      todayAppointments,
      activeStaff,
      totalRevenue: revenueAggregate[0]?.total || 0,
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve branch dashboard: ${error.message}`, [], 500);
  }
};

export const getBranchStats = async (req, res) => {
  return getBranchDashboard(req, res);
};

export const getBranchHours = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const branch = await Branch.findOne({ _id: req.params.branchId, tenantId: req.tenantId });
    if (!branch) return sendError(res, 'Branch not found', [], 404);

    return sendSuccess(res, 'Branch hours retrieved', {
      openingTime: branch.openingTime,
      closingTime: branch.closingTime,
      weeklyOff: branch.weeklyOff,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateBranchHours = async (req, res) => {
  try {
    const { openingTime, closingTime, weeklyOff } = req.body;
    const Branch = getTenantModel(req, 'Branch');

    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.branchId, tenantId: req.tenantId },
      { $set: { openingTime, closingTime, weeklyOff } },
      { returnDocument: 'after' }
    );
    if (!branch) return sendError(res, 'Branch not found', [], 404);

    return sendSuccess(res, 'Branch hours updated successfully', branch);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getBusinessHours = async (req, res) => {
  try {
    const Settings = getTenantModel(req, 'TenantSettings');
    let settings = await Settings.findOne({ tenantId: req.tenantId });
    if (!settings) {
      settings = await Settings.create({ tenantId: req.tenantId });
    }

    return sendSuccess(res, 'Business operating hours retrieved', {
      openingTime: settings.openingTime,
      closingTime: settings.closingTime,
      bufferTimeMinutes: settings.bufferTimeMinutes,
      weeklyWorkingDays: settings.weeklyWorkingDays,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateBusinessHours = async (req, res) => {
  try {
    const { openingTime, closingTime, bufferTimeMinutes, weeklyWorkingDays } = req.body;
    const Settings = getTenantModel(req, 'TenantSettings');

    const settings = await Settings.findOneAndUpdate(
      { tenantId: req.tenantId },
      { $set: { openingTime, closingTime, bufferTimeMinutes, weeklyWorkingDays } },
      { upsert: true, returnDocument: 'after' }
    );

    return sendSuccess(res, 'Business hours updated successfully', settings);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  updateBranchStatus,
  setDefaultBranch,
  getBranchDashboard,
  getBranchStats,
  getBranchHours,
  updateBranchHours,
  getBusinessHours,
  updateBusinessHours,
};
