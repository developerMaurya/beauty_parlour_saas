/**
 * @file auth-rate-limiter.middleware.js
 * @description Specialized rate limiting middleware for authentication endpoints.
 * @module backend/src/modules/auth/middlewares/auth-rate-limiter.middleware
 */

import rateLimit from 'express-rate-limit';
import { securityConfig } from '../../../config/security.config.js';

export const loginRateLimiter = rateLimit({
  windowMs: securityConfig.authRateLimit.windowMs,
  max: securityConfig.authRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  skipSuccessfulRequests: true, // Only count failed attempts towards rate limit
  message: {
    success: false,
    message: 'Too many failed login attempts from this IP. Please try again after 15 minutes.',
    errors: [],
  },
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: securityConfig.authRateLimit.windowMs,
  max: 5, // Max 5 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Too many password reset requests from this IP. Please try again after 15 minutes.',
    errors: [],
  },
});

export default {
  loginRateLimiter,
  forgotPasswordRateLimiter,
};
