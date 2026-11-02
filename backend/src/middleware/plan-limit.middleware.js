/**
 * @file plan-limit.middleware.js
 * @description Enforces SaaS Plan and Feature Limits for Tenant Accounts.
 * @module backend/src/middleware/plan-limit.middleware
 */

import { getTenantModel } from '../database/tenant/tenantModels.js';
import { sendError } from '../utils/response.utils.js';

const LIMIT_MAP = {
  staff: { model: 'Staff', limitField: 'maxStaff', label: 'Staff members' },
  branches: { model: 'Branch', limitField: 'maxBranches', label: 'Branches' },
  services: { model: 'Service', limitField: 'maxServices', label: 'Services' },
  products: { model: 'Product', limitField: 'maxProducts', label: 'Products' },
  students: { model: 'Student', limitField: 'maxStudents', label: 'Students' },
  customers: { model: 'Customer', limitField: 'maxCustomers', label: 'Customers' },
};

export const checkPlanLimit = (resourceType) => {
  return async (req, res, next) => {
    try {
      const config = LIMIT_MAP[resourceType];
      if (!config) {
        return next();
      }

      const tenant = req.tenant;
      if (!tenant || !tenant.limits) {
        return next();
      }

      const limit = tenant.limits[config.limitField];
      // If limit is not set or -1 (unlimited), proceed
      if (limit === undefined || limit === null || limit < 0) {
        return next();
      }

      const Model = getTenantModel(req, config.model);
      const query = { tenantId: req.tenantId };
      if (resourceType === 'staff') {
        query.status = { $ne: 'inactive' };
      }

      const currentCount = await Model.countDocuments(query);

      if (currentCount >= limit) {
        return sendError(
          res,
          `Plan limit reached: Your current subscription allows a maximum of ${limit} ${config.label}. Please upgrade your plan.`,
          {
            resourceType,
            limit,
            currentCount,
          },
          403,
          'PLAN_LIMIT_EXCEEDED'
        );
      }

      return next();
    } catch (error) {
      return sendError(res, `Failed to verify plan limit: ${error.message}`, [], 500);
    }
  };
};

export default checkPlanLimit;
