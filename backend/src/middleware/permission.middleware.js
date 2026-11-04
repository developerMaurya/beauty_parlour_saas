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

/**
 * Check if the tenant has a specific high-level module enabled by SuperAdmin
 * @param {string} moduleKey - e.g. 'appointments', 'inventory', 'payroll', 'academyModule', 'marketing'
 */
export const requireTenantModule = (moduleKey) => {
  return (req, res, next) => {
    if (req.tenant && req.tenant.permissions) {
      const isAllowed = req.tenant.permissions[moduleKey];
      if (isAllowed === false) {
        return sendError(
          res,
          `Module Access Restricted: The "${moduleKey}" feature is not enabled for this business by the platform Super Administrator.`,
          [],
          403
        );
      }
    }
    return next();
  };
};

export default requirePermission;
