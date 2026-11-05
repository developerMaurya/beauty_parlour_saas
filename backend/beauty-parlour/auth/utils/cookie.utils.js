/**
 * @file cookie.utils.js
 * @description Secure HTTP-only cookie handlers for refresh tokens.
 * @module backend/src/modules/auth/utils/cookie.utils
 */

import { env } from '../../../config/env.js';
import { COOKIE_NAMES, REFRESH_COOKIE_PATH } from '../constants/auth.constants.js';

/**
 * Build standard secure cookie options
 * @param {number} [maxAgeMs]
 * @returns {import('express').CookieOptions}
 */
export const getCookieOptions = (maxAgeMs = 7 * 24 * 60 * 60 * 1000) => {
  const options = {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeMs,
  };

  if (env.COOKIE_DOMAIN) {
    options.domain = env.COOKIE_DOMAIN;
  }

  return options;
};

/**
 * Set the refresh token in an HttpOnly secure cookie
 * @param {import('express').Response} res
 * @param {string} refreshToken
 * @param {number} [maxAgeMs]
 */
export const setRefreshTokenCookie = (res, refreshToken, maxAgeMs) => {
  const options = getCookieOptions(maxAgeMs);
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, options);
};

/**
 * Clear the refresh token cookie
 * @param {import('express').Response} res
 */
export const clearRefreshTokenCookie = (res) => {
  const options = getCookieOptions();
  delete options.maxAge;
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, options);
};

/**
 * Extract refresh token from cookie or Authorization header fallback
 * @param {import('express').Request} req
 * @returns {string|null}
 */
export const getRefreshTokenFromRequest = (req) => {
  // Primary: secure HttpOnly cookie
  if (req.cookies && req.cookies[COOKIE_NAMES.REFRESH_TOKEN]) {
    return req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
  }

  // Fallback: custom header (e.g. for native/mobile API clients)
  if (req.headers['x-refresh-token']) {
    return req.headers['x-refresh-token'];
  }

  return null;
};

export default {
  getCookieOptions,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
};
