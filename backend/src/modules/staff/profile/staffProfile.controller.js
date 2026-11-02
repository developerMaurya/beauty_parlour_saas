/**
 * @file staffProfile.controller.js
 * @description Staff Profile, Dynamic Branch Switching, and Permission Resolution Controller.
 * Conforms to Sections 4, 5, 6 requirements (strictly protects Admin fields: salary, commission, designation, department).
 * @module backend/src/modules/staff/profile/staffProfile.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getProfile = async (req, res) => {
  try {
    const StaffModel = getTenantModel(req, 'Staff');
    const staffDoc = await StaffModel.findById(req.staffId)
      .populate('departmentId', 'name code')
      .populate('designationId', 'name description')
      .populate('branchId', 'name code address openingTime closingTime')
      .populate('primaryBranch', 'name code')
      .populate('assignedBranches', 'name code');

    return sendSuccess(res, staffDoc || req.staff, 'Staff profile fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch staff profile', [error.message], 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const StaffModel = getTenantModel(req, 'Staff');
    const TenantUserModel = getTenantModel(req, 'TenantUser');

    // Section 4 Security Requirement:
    // Staff must NOT modify Admin-controlled fields such as salary, commission, role, permissions, department, designation, branch, employment status
    const forbiddenFields = [
      'salary',
      'commissionRate',
      'commission',
      'role',
      'userType',
      'permissions',
      'departmentId',
      'designationId',
      'branchId',
      'status',
      'employmentType',
    ];

    const updates = { ...req.body };
    for (const field of forbiddenFields) {
      if (updates[field] !== undefined) {
        delete updates[field]; // Silently strip unauthorized fields to prevent mass assignment
      }
    }

    const updatedStaff = await StaffModel.findByIdAndUpdate(
      req.staffId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // If name or phone updated, sync user document
    if (updates.name || updates.phone) {
      await TenantUserModel.findByIdAndUpdate(req.userId, {
        $set: {
          ...(updates.name ? { name: updates.name } : {}),
          ...(updates.phone ? { phone: updates.phone } : {}),
        },
      });
    }

    return sendSuccess(res, updatedStaff, 'Personal profile updated successfully');
  } catch (error) {
    return sendError(res, 'Profile update failed', [error.message], 500);
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) {
      return sendError(res, 'Photo URL is required', [], 400);
    }

    const StaffModel = getTenantModel(req, 'Staff');
    const staffDoc = await StaffModel.findByIdAndUpdate(
      req.staffId,
      { $set: { photo: photoUrl } },
      { new: true }
    );

    return sendSuccess(res, { photo: staffDoc.photo }, 'Staff photo updated');
  } catch (error) {
    return sendError(res, 'Photo update failed', [error.message], 500);
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const StaffModel = getTenantModel(req, 'Staff');
    await StaffModel.findByIdAndUpdate(req.staffId, { $set: { photo: '' } });
    return sendSuccess(res, null, 'Staff photo removed');
  } catch (error) {
    return sendError(res, 'Failed to remove photo', [error.message], 500);
  }
};

export const getSummary = async (req, res) => {
  try {
    return sendSuccess(
      res,
      {
        name: req.staff?.name || req.user.name,
        employeeId: req.staff?.employeeId || 'N/A',
        joiningDate: req.staff?.joiningDate,
        status: req.staff?.status || 'active',
        skillsCount: req.staff?.skills?.length || 0,
      },
      'Staff summary fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to load summary', [error.message], 500);
  }
};

export const getActivity = async (req, res) => {
  try {
    const ActivityModel = getTenantModel(req, 'ActivityTimeline');
    const logs = await ActivityModel.find({
      tenantId: req.tenantId,
      performerId: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return sendSuccess(res, logs, 'Staff activity fetched');
  } catch (error) {
    return sendError(res, 'Failed to load activity', [error.message], 500);
  }
};

// Section 5: Staff Role & Permissions
export const getRole = async (req, res) => {
  try {
    return sendSuccess(
      res,
      {
        role: req.user.role,
        userType: req.user.userType,
        customRoleId: req.user.customRoleId,
      },
      'Staff role fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to get role', [error.message], 500);
  }
};

export const getPermissions = async (req, res) => {
  try {
    return sendSuccess(res, req.userPermissions || [], 'Staff permissions fetched');
  } catch (error) {
    return sendError(res, 'Failed to get permissions', [error.message], 500);
  }
};

export const checkPermission = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return sendError(res, 'Permission code parameter required', [], 400);
    }
    const hasPerm =
      req.userRole === 'ADMIN' ||
      req.userPermissions?.includes('*') ||
      req.userPermissions?.includes(code);

    return sendSuccess(res, { allowed: !!hasPerm, code }, 'Permission checked');
  } catch (error) {
    return sendError(res, 'Failed to check permission', [error.message], 500);
  }
};

// Section 6: Staff Branch Management
export const getBranches = async (req, res) => {
  try {
    const BranchModel = getTenantModel(req, 'Branch');
    const staffDoc = req.staff;

    let branches = [];
    if (req.userRole === 'ADMIN') {
      branches = await BranchModel.find({ tenantId: req.tenantId, status: 'active' });
    } else if (staffDoc) {
      const branchIds = [
        staffDoc.branchId,
        staffDoc.primaryBranch,
        ...(staffDoc.assignedBranches || []),
      ].filter(Boolean);

      branches = await BranchModel.find({
        _id: { $in: branchIds },
        tenantId: req.tenantId,
      });
    }

    return sendSuccess(res, branches, 'Assigned staff branches fetched');
  } catch (error) {
    return sendError(res, 'Failed to get assigned branches', [error.message], 500);
  }
};

export const getBranchById = async (req, res) => {
  try {
    const BranchModel = getTenantModel(req, 'Branch');
    const branch = await BranchModel.findOne({
      _id: req.params.branchId,
      tenantId: req.tenantId,
    });
    if (!branch) {
      return sendError(res, 'Branch not found', [], 404);
    }
    return sendSuccess(res, branch, 'Branch retrieved successfully');
  } catch (error) {
    return sendError(res, 'Failed to get branch', [error.message], 500);
  }
};

export const getCurrentBranch = async (req, res) => {
  try {
    const BranchModel = getTenantModel(req, 'Branch');
    const branch = req.currentBranchId
      ? await BranchModel.findById(req.currentBranchId)
      : null;

    return sendSuccess(res, branch, 'Current staff branch fetched');
  } catch (error) {
    return sendError(res, 'Failed to get current branch', [error.message], 500);
  }
};

export const switchBranch = async (req, res) => {
  try {
    const { branchId } = req.body;
    if (!branchId) {
      return sendError(res, 'branchId is required', [], 400);
    }

    const staffDoc = req.staff;
    const allowedBranches = [
      staffDoc?.branchId?.toString(),
      staffDoc?.primaryBranch?.toString(),
      ...(staffDoc?.assignedBranches || []).map((b) => b.toString()),
    ].filter(Boolean);

    if (req.userRole !== 'ADMIN' && !allowedBranches.includes(branchId)) {
      return sendError(res, 'Access denied: You are not assigned to this branch', [], 403);
    }

    return sendSuccess(
      res,
      { currentBranchId: branchId },
      'Staff active branch switched successfully'
    );
  } catch (error) {
    return sendError(res, 'Failed to switch branch', [error.message], 500);
  }
};

export const getProfileSummary = getSummary;
export const getProfileActivity = getActivity;
export const getStaffRole = getRole;
export const getStaffPermissions = getPermissions;
export const checkStaffPermission = checkPermission;
export const getStaffBranches = getBranches;
export const getStaffBranchById = getBranchById;
export const switchCurrentBranch = switchBranch;

export default {
  getProfile,
  updateProfile,
  uploadPhoto,
  deletePhoto,
  getSummary,
  getProfileSummary,
  getActivity,
  getProfileActivity,
  getRole,
  getStaffRole,
  getPermissions,
  getStaffPermissions,
  checkPermission,
  checkStaffPermission,
  getBranches,
  getStaffBranches,
  getBranchById,
  getStaffBranchById,
  getCurrentBranch,
  switchBranch,
  switchCurrentBranch,
};

