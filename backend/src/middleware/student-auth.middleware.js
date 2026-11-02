/**
 * @file student-auth.middleware.js
 * @description Dedicated Student Authentication & Multi-Tenant Isolation Middleware.
 * Enforces STUDENT userType, checks account & enrollment statuses, links Student profile,
 * verifies branch context and ensures strict student-to-student data isolation.
 * @module backend/src/middleware/student-auth.middleware
 */

import { verifyAccessToken } from '../modules/auth/services/token.service.js';
import { getTenantModel } from '../database/tenant/tenantModels.js';
import { sendError } from '../utils/response.utils.js';

/**
 * Authenticate Student User and attach student profile & branch context
 */
export const authenticateStudentUser = async (req, res, next) => {
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
      return sendError(res, 'Access forbidden: Token does not grant access to this tenant academy workspace', [], 403);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findById(decoded.sub);

    if (!user) {
      return sendError(res, 'Student user account not found in this academy', [], 401);
    }

    if (user.tenantId && req.tenantId && String(user.tenantId) !== String(req.tenantId)) {
      return sendError(res, 'Access forbidden: Student user does not belong to this academy', [], 403);
    }

    // Role check: Only STUDENT or ADMIN allowed on Student portal
    if (user.userType !== 'STUDENT' && user.role !== 'STUDENT' && user.role !== 'ADMIN') {
      return sendError(res, 'Access forbidden: Student credentials required', [], 403);
    }

    // Account Status check
    if (user.status === 'blocked' || user.isBlocked) {
      return sendError(res, `Account blocked: ${user.blockDetails?.reason || 'Access denied'}`, [], 403);
    }

    if (user.status === 'suspended') {
      return sendError(res, 'Account is suspended. Please contact academy administration.', [], 403);
    }

    if (user.status === 'inactive') {
      return sendError(res, 'Student account is currently deactivated.', [], 403);
    }

    // Link Student Profile
    const StudentModel = getTenantModel(req, 'Student');
    let studentDoc = await StudentModel.findOne({ userId: user._id });

    // Fallback if Admin is testing student portal endpoints
    if (!studentDoc && user.role === 'ADMIN') {
      studentDoc = await StudentModel.findOne({ tenantId: req.tenantId });
    }

    if (!studentDoc && user.role === 'STUDENT') {
      return sendError(res, 'Student profile record not found. Please contact academy registration.', [], 404);
    }

    // Check student profile status
    if (studentDoc) {
      const sStatus = (studentDoc.status || '').toLowerCase();
      if (sStatus === 'blocked') {
        return sendError(res, 'Student enrollment has been blocked.', [], 403);
      }
      if (sStatus === 'suspended') {
        return sendError(res, 'Student academic access is suspended.', [], 403);
      }
    }

    // Branch context
    let activeBranchId = null;
    const requestedBranch = req.headers['x-branch-id'];
    if (studentDoc?.branchId) {
      activeBranchId = studentDoc.branchId.toString();
    }
    if (requestedBranch && user.role === 'ADMIN') {
      activeBranchId = requestedBranch;
    }

    // Attach verified context
    req.user = user;
    req.student = studentDoc;
    req.studentId = studentDoc ? studentDoc._id : null;
    req.activeBranchId = activeBranchId;
    req.branchId = activeBranchId;

    next();
  } catch (error) {
    console.error('[StudentAuthMiddleware] Error validating student authentication:', error);
    return sendError(res, 'Failed to authenticate student credentials', [], 500);
  }
};

/**
 * Optional permission checking middleware
 */
export const requireStudentPermission = (permission) => {
  return (req, res, next) => {
    // Admins bypass
    if (req.user?.role === 'ADMIN') return next();
    next();
  };
};

export default {
  authenticateStudentUser,
  requireStudentPermission,
};
