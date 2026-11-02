/**
 * @file auth.middleware.js
 * @description Core JWT authentication, role authorization, and session verification middleware.
 * @module backend/src/modules/auth/middlewares/auth.middleware
 */

import { ROLES, ACCOUNT_STATUS } from '../constants/auth.constants.js';
import { verifyAccessToken } from '../services/token.service.js';
import { isSessionActive } from '../services/session.service.js';
import { SuperAdmin } from '../models/super-admin.model.js';
import { sendError } from '../../../utils/response.utils.js';

/**
 * Middleware to authenticate JWT Access Token
 */
export const authenticateAccessToken = async (req, res, next) => {
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
    // 1. Verify session is still active and not revoked
    if (decoded.sessionId) {
      const active = await isSessionActive(decoded.sessionId);
      if (!active) {
        return sendError(res, 'Session has been revoked or expired. Please log in again.', [], 401);
      }
    }

    // 2. Fetch authenticated user from Central DB
    // Architecture note: SuperAdmin is fetched here; future roles (Admin, Staff, Student) can be resolved dynamically by role.
    let user;
    if (decoded.role === ROLES.SUPER_ADMIN) {
      user = await SuperAdmin.findById(decoded.sub);
    }

    if (!user) {
      return sendError(res, 'User account no longer exists', [], 401);
    }

    // 3. Check account operational status
    if (user.status === ACCOUNT_STATUS.SUSPENDED) {
      return sendError(res, 'Account has been suspended. Please contact support.', [], 403);
    }

    if (user.status === ACCOUNT_STATUS.INACTIVE) {
      return sendError(res, 'Account is currently inactive. Please contact support.', [], 403);
    }

    // 4. Check if password was changed after token issuance
    if (user.passwordChangedAt) {
      const tokenIssuedAt = decoded.iat * 1000;
      if (tokenIssuedAt < user.passwordChangedAt.getTime()) {
        return sendError(res, 'Password was changed recently. Please log in again.', [], 401);
      }
    }

    // Attach validated identity to request
    req.user = user;
    req.sessionId = decoded.sessionId;
    req.tokenPayload = decoded;

    return next();
  } catch (error) {
    return sendError(res, 'Authentication verification failed', [error.message], 500);
  }
};

/**
 * Middleware to restrict access to Super Admin only
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.SUPER_ADMIN) {
    return sendError(res, 'Access forbidden: Super Administrator role required', [], 403);
  }
  return next();
};

/**
 * Optional authentication middleware for public endpoints that may customize output if authenticated
 */
export const optionalAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    if (decoded.sessionId) {
      const active = await isSessionActive(decoded.sessionId);
      if (active) {
        if (decoded.role === ROLES.SUPER_ADMIN) {
          const user = await SuperAdmin.findById(decoded.sub);
          if (user && user.status === ACCOUNT_STATUS.ACTIVE) {
            req.user = user;
            req.sessionId = decoded.sessionId;
            req.tokenPayload = decoded;
          }
        }
      }
    }
  } catch {
    // Ignore error for optional authentication
  }

  return next();
};

export default {
  authenticateAccessToken,
  requireSuperAdmin,
  optionalAuthentication,
};
