/**
 * @file auth.constants.js
 * @description Centralized constants for the authentication subsystem.
 * @module backend/src/modules/auth/constants/auth.constants
 */

export const ROLES = Object.freeze({
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  STAFF: 'staff',
  STUDENT: 'student',
  CUSTOMER: 'customer',
  GUEST: 'guest',
});

export const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
});

export const TOKEN_TYPES = Object.freeze({
  ACCESS: 'access',
  REFRESH: 'refresh',
  PASSWORD_RESET: 'password_reset',
});

export const COOKIE_NAMES = Object.freeze({
  REFRESH_TOKEN: 'refreshToken',
});

export const LOCKOUT_CONFIG = Object.freeze({
  MAX_FAILED_ATTEMPTS: 5,
  LOCK_TIME_MS: 15 * 60 * 1000, // 15 minutes
});

export const PASSWORD_RESET_CONFIG = Object.freeze({
  EXPIRES_IN_MS: 15 * 60 * 1000, // 15 minutes
});

export const REFRESH_COOKIE_PATH = '/api/v1/superadmin/auth';
