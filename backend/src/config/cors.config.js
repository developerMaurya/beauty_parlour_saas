/**
 * @file cors.config.js
 * @description Dynamic CORS configuration with credentials support for cookies.
 * @module backend/src/config/cors.config
 */

import { env } from './env.js';

export const corsConfig = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or localhost in dev
    if (!origin) {
      return callback(null, true);
    }

    if (env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (env.CORS_ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS Error: Origin ${origin} not allowed by policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Tenant-ID',
    'X-Tenant-Domain',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours preflight cache
};

export default corsConfig;
