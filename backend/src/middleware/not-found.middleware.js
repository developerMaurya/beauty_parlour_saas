/**
 * @file not-found.middleware.js
 * @description 404 handler for unmatched routes.
 * @module backend/src/middleware/not-found.middleware
 */

import { sendError } from '../utils/response.utils.js';

export const notFoundMiddleware = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, [], 404);
};

export default notFoundMiddleware;
