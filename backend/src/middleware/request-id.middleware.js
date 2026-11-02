/**
 * @file request-id.middleware.js
 * @description Unique request tracing identifier middleware.
 * @module backend/src/middleware/request-id.middleware
 */

import crypto from 'crypto';

export const requestIdMiddleware = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = (typeof incomingId === 'string' && incomingId.trim()) || crypto.randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  return next();
};

export default requestIdMiddleware;
