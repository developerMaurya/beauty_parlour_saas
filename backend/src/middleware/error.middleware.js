/**
 * @file error.middleware.js
 * @description Centralized error handler returning standardized API error responses.
 * @module backend/src/middleware/error.middleware
 */

import { env } from '../config/env.js';
import { sendError } from '../utils/response.utils.js';

export const errorMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Format validation errors or custom error lists
  let errors = [];
  if (err.errors) {
    if (Array.isArray(err.errors)) {
      errors = err.errors;
    } else if (typeof err.errors === 'object') {
      errors = Object.keys(err.errors).map((key) => ({
        field: key,
        message: err.errors[key].message || String(err.errors[key]),
      }));
    }
  }

  // Handle Mongoose duplicate key errors (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, `A record with this ${field} already exists.`, [{ field, message: `${field} must be unique` }], 409);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid resource identifier: ${err.value}`, [], 400);
  }

  // Log server errors for monitoring (omitting sensitive tokens/passwords)
  if (statusCode >= 500 && env.NODE_ENV !== 'test') {
    console.error(`[ERROR] [${req.id || 'NO-REQ-ID'}] ${req.method} ${req.originalUrl}:`, err);
  }

  return sendError(res, message, errors, statusCode);
};

export default errorMiddleware;
