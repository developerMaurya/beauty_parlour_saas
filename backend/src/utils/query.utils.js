/**
 * @file query.utils.js
 * @description Standardized Query, Filter, Search, and Pagination Builder.
 * @module backend/src/utils/query.utils
 */

/**
 * Build standard pagination parameters
 * @param {object} query
 * @param {number} [defaultLimit=20]
 * @returns {{ page: number, limit: number, skip: number }}
 */
export const getPagination = (query, defaultLimit = 20) => {
  const page = Math.max(1, parseInt(query.page || 1, 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || defaultLimit, 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build sort object from query
 * @param {object} query
 * @param {string} [defaultSortField='createdAt']
 * @param {Array<string>} [allowedFields=[]]
 * @returns {object} Mongoose sort object
 */
export const getSort = (query, defaultSortField = 'createdAt', allowedFields = []) => {
  const sortBy = query.sortBy || defaultSortField;
  const sortOrder = query.sortOrder === 'asc' || query.sortOrder === '1' ? 1 : -1;

  if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    return { [defaultSortField]: -1 };
  }

  return { [sortBy]: sortOrder };
};

/**
 * Build standard filter conditions with tenant and branch isolation
 * @param {import('express').Request} req
 * @param {object} [extraFilters={}]
 * @returns {object} Filter query
 */
export const buildTenantFilter = (req, extraFilters = {}) => {
  const filter = { ...extraFilters };

  // Tenant scoping in shared mode
  if (req.tenantId) {
    filter.tenantId = req.tenantId;
  }

  // Branch scoping
  if (req.branchId && req.branchId !== 'all') {
    filter.branchId = req.branchId;
  } else if (req.query.branchId && req.query.branchId !== 'all') {
    filter.branchId = req.query.branchId;
  }

  // Status filtering
  if (req.query.status && req.query.status !== 'all') {
    filter.status = req.query.status;
  }

  // Date range filtering
  if (req.query.fromDate || req.query.toDate) {
    filter.createdAt = {};
    if (req.query.fromDate) {
      filter.createdAt.$gte = new Date(req.query.fromDate);
    }
    if (req.query.toDate) {
      const end = new Date(req.query.toDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  return filter;
};

export default {
  getPagination,
  getSort,
  buildTenantFilter,
};
