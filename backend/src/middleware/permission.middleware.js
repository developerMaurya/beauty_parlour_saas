/**
 * @file permission.middleware.js
 * @description Dynamic RBAC Permission Authorization Middleware.
 * @module backend/src/middleware/permission.middleware
 */

import { sendError } from '../utils/response.utils.js';

/**
 * Check if the authenticated user has a specific permission
 * @param {string} permissionCode
 */
export const requirePermission = (permissionCode) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', [], 401);
    }

    // Tenant ADMIN has universal wildcard permission
    if (req.user.role === 'ADMIN') {
      return next();
    }

    const permissions = req.userPermissions || [];
    if (permissions.includes('*') || permissions.includes(permissionCode)) {
      return next();
    }

    return sendError(
      res,
      `Access forbidden: You do not have the required permission (${permissionCode}) to perform this action.`,
      [],
      403
    );
  };
};

export default requirePermission;
