/**
 * @file response.utils.js
 * @description Standardized API JSON response helpers adhering to Section 76 specification.
 * @module backend/src/utils/response.utils
 */

/**
 * Send standard success response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object|null} data
 * @param {number} statusCode
 */
export const sendSuccess = (res, message = 'Operation successful', data = null, statusCode = 200) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Send standard list response with pagination
 * @param {import('express').Response} res
 * @param {Array<object>} data
 * @param {object} pagination
 * @param {number} [statusCode=200]
 */
export const sendListResponse = (res, data = [], pagination = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || data.length,
      total: pagination.total !== undefined ? pagination.total : data.length,
      totalPages: pagination.totalPages || 1,
    },
  });
};

/**
 * Send standard error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {Array<object>|object} errors
 * @param {number} statusCode
 * @param {string} [code]
 */
export const sendError = (res, message = 'An error occurred', errors = [], statusCode = 400, code = 'ERROR') => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

export default {
  sendSuccess,
  sendListResponse,
  sendError,
};
