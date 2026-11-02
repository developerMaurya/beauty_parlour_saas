/**
 * @file staff-auth.middleware.js
 * @description Dedicated Staff Authentication & Context Middleware.
 * Enforces STAFF userType, verifies account status, links Staff profile, resolves assigned branches & permissions.
 * @module backend/src/middleware/staff-auth.middleware
 */

import { verifyAccessToken } from '../modules/auth/services/token.service.js';
import { getTenantModel } from '../database/tenant/tenantModels.js';
import { sendError } from '../utils/response.utils.js';

/**
 * Authenticate Staff User and attach staff profile & branch context
 */
export const authenticateStaffUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendError(res, 'Authorization header missing', [], 401);
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return sendError(res, 'Invalid authorization format. Format must be: Bearer <token>', [], 401);
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Access token has expired', [], 401);
    }
    return sendError(res, 'Invalid or malformed access token', [], 401);
  }

  try {
    if (!req.tenantId && decoded.tenantId) {
      req.tenantId = decoded.tenantId;
    }

    if (decoded.tenantId && req.tenantId && String(decoded.tenantId) !== String(req.tenantId)) {
      return sendError(res, 'Access forbidden: Token does not grant access to this tenant workspace', [], 403);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findById(decoded.sub);

    if (!user) {
      return sendError(res, 'Staff user account not found in this business', [], 401);
    }

    if (user.tenantId && req.tenantId && String(user.tenantId) !== String(req.tenantId)) {
      return sendError(res, 'Access forbidden: Staff user does not belong to this tenant', [], 403);
    }

    // Security check: Only STAFF or ADMIN allowed on Staff portal
    if (user.userType !== 'STAFF' && user.role !== 'STAFF' && user.role !== 'ADMIN') {
      return sendError(res, 'Access forbidden: Staff credentials required', [], 403);
    }

    // Status check
    if (user.status === 'blocked' || user.isBlocked) {
      return sendError(res, `Account blocked: ${user.blockDetails?.reason || 'Access denied'}`, [], 403);
    }

    if (user.status === 'suspended') {
      return sendError(res, 'Account is suspended. Please contact salon administrator.', [], 403);
    }

    if (user.status === 'inactive') {
      return sendError(res, 'Staff account is currently deactivated.', [], 403);
    }

    // Link Staff profile
    const StaffModel = getTenantModel(req, 'Staff');
    let staffDoc = await StaffModel.findOne({ userId: user._id });

    // Fallback if user is ADMIN testing staff portal or direct staff match
    if (!staffDoc && user.role === 'ADMIN') {
      staffDoc = await StaffModel.findOne({ tenantId: req.tenantId });
    }

    // Branch context resolution
    let activeBranchId = null;
    const requestedBranch = req.headers['x-branch-id'];

    if (staffDoc) {
      const allowedBranches = [
        staffDoc.branchId?.toString(),
        staffDoc.primaryBranch?.toString(),
        ...(staffDoc.assignedBranches || []).map((b) => b.toString()),
      ].filter(Boolean);

      if (requestedBranch && (allowedBranches.includes(requestedBranch) || user.role === 'ADMIN')) {
        activeBranchId = requestedBranch;
      } else {
        activeBranchId = staffDoc.branchId?.toString() || staffDoc.primaryBranch?.toString() || null;
      }
    }

    // Resolve permissions
    let permissions = [];
    if (user.role === 'ADMIN') {
      permissions = ['*'];
    } else if (user.customRoleId) {
      const RoleModel = getTenantModel(req, 'Role');
      const roleDoc = await RoleModel.findById(user.customRoleId);
      if (roleDoc) {
        permissions = roleDoc.permissions || [];
      }
    }

    req.user = user;
    req.userId = user._id.toString();
    req.userRole = user.role;
    req.userType = user.userType;
    req.userPermissions = permissions;
    req.staff = staffDoc;
    req.staffId = staffDoc ? staffDoc._id.toString() : null;
    req.currentBranchId = activeBranchId;
    req.tokenPayload = decoded;

    return next();
  } catch (error) {
    return sendError(res, 'Staff authentication failed', [error.message], 500);
  }
};

/**
 * Require specific staff permission
 * @param {string} permissionCode
 */
export const requireStaffPermission = (permissionCode) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', [], 401);
    }

    if (req.userRole === 'ADMIN' || req.userPermissions?.includes('*')) {
      return next();
    }

    if (req.userPermissions && req.userPermissions.includes(permissionCode)) {
      return next();
    }

    return sendError(
      res,
      `Permission denied: Missing '${permissionCode}' capability`,
      [],
      403,
      'FORBIDDEN'
    );
  };
};

/**
 * Ensure staff member is accessing their own resource
 */
export const requireSelfStaff = (req, res, next) => {
  const targetStaffId = req.params.staffId || req.body.staffId;
  if (!targetStaffId) return next();

  if (req.userRole === 'ADMIN') return next();

  if (req.staffId && req.staffId === targetStaffId) {
    return next();
  }

  return sendError(res, 'Access denied: You can only access your own staff records', [], 403, 'FORBIDDEN');
};

export default {
  authenticateStaffUser,
  requireStaffPermission,
  requireSelfStaff,
};
