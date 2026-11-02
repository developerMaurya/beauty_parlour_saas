/**
 * @file tenant-admin-auth.middleware.js
 * @description Authentication and Authorization Middleware for Tenant Admin, Staff, Student, and Customer users.
 * @module backend/src/middleware/tenant-admin-auth.middleware
 */

import { verifyAccessToken } from '../modules/auth/services/token.service.js';
import { getTenantModel } from '../database/tenant/tenantModels.js';
import { sendError } from '../utils/response.utils.js';

export const authenticateTenantUser = async (req, res, next) => {
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

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findById(decoded.sub);

    if (!user) {
      return sendError(res, 'User account no longer exists in this business', [], 401);
    }

    if (user.status === 'blocked' || user.isBlocked) {
      return sendError(res, `Account blocked: ${user.blockDetails?.reason || 'Access denied'}`, [], 403);
    }

    if (user.status === 'suspended') {
      return sendError(res, 'Account is suspended. Please contact administrator.', [], 403);
    }

    if (user.status === 'inactive') {
      return sendError(res, 'Account is currently deactivated.', [], 403);
    }

    // Resolve permissions
    let permissions = [];
    if (user.role === 'ADMIN') {
      permissions = ['*']; // Full wildcard access
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
    req.userPermissions = permissions;
    req.tokenPayload = decoded;

    return next();
  } catch (error) {
    return sendError(res, 'Authentication verification failed', [error.message], 500);
  }
};

/**
 * Require User to have ADMIN role
 */
export const requireTenantAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return sendError(res, 'Access forbidden: Tenant Administrator role required', [], 403);
  }
  return next();
};

/**
 * Require specific user role
 * @param  {...string} allowedRoles
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, `Access forbidden: Required role [${allowedRoles.join(', ')}]`, [], 403);
    }
    return next();
  };
};

export default {
  authenticateTenantUser,
  requireTenantAdmin,
  requireRoles,
};
