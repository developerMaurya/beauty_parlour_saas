/**
 * @file password.service.js
 * @description Secure password hashing and verification using bcrypt.
 * @module backend/src/modules/auth/services/password.service
 */

import bcrypt from 'bcrypt';
import { securityConfig } from '../../../config/security.config.js';

/**
 * Validate password complexity:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special symbol
 * @param {string} password
 * @returns {{ isValid: boolean, message?: string }}
 */
export const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }

  return { isValid: true };
};

/**
 * Hash a plain password using bcrypt
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
export const hashPassword = async (plainPassword) => {
  const strengthCheck = validatePasswordStrength(plainPassword);
  if (!strengthCheck.isValid) {
    throw new Error(strengthCheck.message);
  }
  return bcrypt.hash(plainPassword, securityConfig.bcryptSaltRounds);
};

/**
 * Compare plain password against bcrypt hash
 * @param {string} plainPassword
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (plainPassword, passwordHash) => {
  if (!plainPassword || !passwordHash) {
    return false;
  }
  return bcrypt.compare(plainPassword, passwordHash);
};

export default {
  validatePasswordStrength,
  hashPassword,
  comparePassword,
};
