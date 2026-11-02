/**
 * @file token.service.js
 * @description JWT access and refresh token creation, verification, and expiry parsing.
 * @module backend/src/modules/auth/services/token.service
 */

import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { TOKEN_TYPES } from '../constants/auth.constants.js';
import { generateUUID } from '../utils/crypto.utils.js';

/**
 * Convert duration string (e.g., '15m', '7d', '24h', '30s') to milliseconds
 * @param {string} duration
 * @returns {number}
 */
export const parseDurationToMs = (duration) => {
  if (typeof duration === 'number') {
    return duration * 1000;
  }

  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) {
    // Default to 15 minutes if unparseable
    return 15 * 60 * 1000;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
};

/**
 * Generate Access Token
 * @param {object} user
 * @param {string} sessionId
 * @returns {string} Signed JWT
 */
export const generateAccessToken = (user, sessionId) => {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    sessionId,
    tokenType: TOKEN_TYPES.ACCESS,
    jti: generateUUID(),
  };

  const options = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

/**
 * Generate Refresh Token
 * @param {object} user
 * @param {string} sessionId
 * @returns {string} Signed JWT
 */
export const generateRefreshToken = (user, sessionId) => {
  const payload = {
    sub: user._id.toString(),
    sessionId,
    tokenType: TOKEN_TYPES.REFRESH,
    jti: generateUUID(),
  };

  const options = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

/**
 * Verify Access Token
 * @param {string} token
 * @returns {object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });

    if (decoded.tokenType !== TOKEN_TYPES.ACCESS) {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });

    if (decoded.tokenType !== TOKEN_TYPES.REFRESH) {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    throw error;
  }
};

export default {
  parseDurationToMs,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
