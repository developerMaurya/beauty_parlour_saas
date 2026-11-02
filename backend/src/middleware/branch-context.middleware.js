/**
 * @file branch-context.middleware.js
 * @description Extracts and enforces Branch Context for multi-branch salon businesses.
 * Prevents unauthorized cross-branch data access.
 * @module backend/src/middleware/branch-context.middleware
 */

import { sendError } from '../utils/response.utils.js';

export const branchContextMiddleware = (req, res, next) => {
  const branchHeader = req.headers['x-branch-id'] || req.query.branchId || req.body?.branchId;

  if (branchHeader && branchHeader !== 'all') {
    // If user is not ADMIN and has restricted branches, check authorization
    if (req.user && req.user.role !== 'ADMIN' && req.user.allowedBranches && req.user.allowedBranches.length > 0) {
      const allowed = req.user.allowedBranches.some((b) => b.toString() === branchHeader.toString());
      if (!allowed && req.user.branchId?.toString() !== branchHeader.toString()) {
        return sendError(res, 'Access forbidden: You do not have permission to view or manage this branch', [], 403);
      }
    }
    req.branchId = branchHeader.toString();
  } else {
    // Admin selecting "All Branches"
    if (req.user && req.user.role !== 'ADMIN' && req.user.branchId) {
      req.branchId = req.user.branchId.toString();
    } else {
      req.branchId = null;
    }
  }

  return next();
};

export default branchContextMiddleware;
