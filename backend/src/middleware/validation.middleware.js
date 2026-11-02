/**
 * @file validation.middleware.js
 * @description Generic request payload validation middleware using Zod.
 * @module backend/src/middleware/validation.middleware
 */

import { sendError } from '../utils/response.utils.js';

/**
 * Validate request body against a Zod schema
 * @param {import('zod').ZodSchema} schema
 */
export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      return next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return sendError(res, 'Validation failed', formattedErrors, 400);
      }
      return sendError(res, error.message || 'Validation error', [], 400);
    }
  };
};

export const validateRequest = validateBody;

export default {
  validateBody,
  validateRequest,
};
