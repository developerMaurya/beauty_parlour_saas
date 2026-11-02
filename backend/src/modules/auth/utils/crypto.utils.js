/**
 * @file crypto.utils.js
 * @description Cryptographic utilities for secure token generation and hashing.
 * @module backend/src/modules/auth/utils/crypto.utils
 */

import crypto from 'crypto';

/**
 * Hash a plain string or token using SHA-256
 * @param {string} token
 * @returns {string} Hex encoded hash
 */
export const hashToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a non-empty string');
  }
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate cryptographically secure random token
 * @param {number} bytes
 * @returns {string} Hex encoded random string
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Generate a standard UUID v4
 * @returns {string}
 */
export const generateUUID = () => {
  return crypto.randomUUID();
};

export default {
  hashToken,
  generateRandomToken,
  generateUUID,
};
