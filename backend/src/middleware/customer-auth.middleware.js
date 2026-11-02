/**
 * @file customer-auth.middleware.js
 * @description Dedicated Customer Authentication & Multi-Tenant Isolation Middleware.
 * Enforces CUSTOMER role, validates account statuses, attaches Customer profile,
 * verifies branch context and ensures strict customer-to-customer data isolation.
 * @module backend/src/middleware/customer-auth.middleware
 */

import { verifyAccessToken } from '../modules/auth/services/token.service.js';
import { getTenantModel } from '../database/tenant/tenantModels.js';
import { sendError } from '../utils/response.utils.js';

/**
 * Authenticate Customer User and attach customer profile & tenant context
 */
export const authenticateCustomerUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    if (req.path.includes('/home-services/') && req.path.includes('/tracking')) {
      return next();
    }
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

    const CustomerModel = getTenantModel(req, 'Customer');
    let customer = null;

    if (decoded.customerId) {
      customer = await CustomerModel.findOne({
        _id: decoded.customerId,
        tenantId: req.tenantId,
      });
    }

    if (!customer && decoded.sub) {
      customer = await CustomerModel.findOne({
        $or: [{ _id: decoded.sub }, { userId: decoded.sub }],
        tenantId: req.tenantId,
      });
    }

    if (!customer) {
      const TenantUserModel = getTenantModel(req, 'TenantUser');
      const user = await TenantUserModel.findById(decoded.sub);
      if (user && (user.userType === 'CUSTOMER' || user.role === 'CUSTOMER')) {
        customer = await CustomerModel.findOne({
          $or: [{ userId: user._id }, { email: user.email }, { phone: user.phone }],
          tenantId: req.tenantId,
        });
      }
    }

    if (!customer) {
      return sendError(res, 'Customer account not found in this establishment', [], 401);
    }

    // Tenant check
    if (customer.tenantId && req.tenantId && String(customer.tenantId) !== String(req.tenantId)) {
      return sendError(res, 'Access forbidden: Customer does not belong to this establishment', [], 403);
    }

    // Status check
    const statusUpper = (customer.status || '').toUpperCase();
    if (customer.isBlocked || statusUpper === 'BLOCKED' || statusUpper === 'SUSPENDED' || statusUpper === 'DELETED') {
      return sendError(res, 'Customer account is suspended or blocked. Please contact salon management.', [], 403);
    }

    req.customer = customer;
    req.customerId = customer._id;
    req.user = {
      _id: customer.userId || customer._id,
      customerId: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      tenantId: req.tenantId,
    };

    req.branchId = req.headers['x-branch-id'] || customer.preferredBranch || customer.branchId || null;

    return next();
  } catch (err) {
    return sendError(res, 'Authentication verification failed: ' + err.message, [], 500);
  }
};

/**
 * Optional Customer Authentication (Permits both logged-in and guest users)
 */
export const optionalCustomerAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  return authenticateCustomerUser(req, res, (err) => {
    // If auth fails on optional route, proceed as guest
    next();
  });
};

export default {
  authenticateCustomerUser,
  optionalCustomerAuth,
};
