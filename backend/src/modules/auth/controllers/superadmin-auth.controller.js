/**
 * @file superadmin-auth.controller.js
 * @description HTTP Controller handling Super Admin authentication endpoints.
 * @module backend/src/modules/auth/controllers/superadmin-auth.controller
 */

import { superAdminAuthService } from '../services/superadmin-auth.service.js';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
} from '../utils/cookie.utils.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const superAdminAuthController = {
  /**
   * POST /api/v1/superadmin/auth/login
   */
  async login(req, res, next) {
    try {
      const { emailOrUsername, email, username, password } = req.body;
      const identifier = emailOrUsername || email || username;

      const ipAddress = req.ip || req.connection.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';

      const result = await superAdminAuthService.login({
        emailOrUsername: identifier,
        password,
        ipAddress,
        userAgent,
      });

      if (!result.success) {
        return sendError(res, result.message, [], result.statusCode);
      }

      // Set refresh token in HttpOnly secure cookie
      setRefreshTokenCookie(res, result.refreshToken, result.refreshDurationMs);

      return sendSuccess(res, result.message, result.data, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      const refreshToken = getRefreshTokenFromRequest(req);
      const ipAddress = req.ip || req.connection.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';

      const result = await superAdminAuthService.refresh({
        refreshToken,
        ipAddress,
        userAgent,
      });

      if (!result.success) {
        // If refresh fails or token reuse was detected, clear the cookie
        clearRefreshTokenCookie(res);
        return sendError(res, result.message, [], result.statusCode);
      }

      // Set new rotated refresh token in cookie
      setRefreshTokenCookie(res, result.refreshToken, result.refreshDurationMs);

      return sendSuccess(res, result.message, result.data, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/auth/logout
   */
  async logout(req, res, next) {
    try {
      const refreshToken = getRefreshTokenFromRequest(req);
      const sessionId = req.sessionId;

      const result = await superAdminAuthService.logout({
        sessionId,
        refreshToken,
      });

      clearRefreshTokenCookie(res);

      return sendSuccess(res, result.message, null, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/auth/logout-all
   */
  async logoutAll(req, res, next) {
    try {
      const userId = req.user._id;

      const result = await superAdminAuthService.logoutAll({ userId });

      clearRefreshTokenCookie(res);

      return sendSuccess(res, result.message, null, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/auth/me
   */
  async getMe(req, res, next) {
    try {
      const userId = req.user._id;

      const result = await superAdminAuthService.getMe({ userId });

      if (!result.success) {
        return sendError(res, result.message, [], result.statusCode);
      }

      return sendSuccess(res, result.message, result.data, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword } = req.body;

      const result = await superAdminAuthService.changePassword({
        userId,
        currentPassword,
        newPassword,
      });

      if (!result.success) {
        return sendError(res, result.message, [], result.statusCode);
      }

      // Clear refresh token cookie since all sessions have been revoked
      clearRefreshTokenCookie(res);

      return sendSuccess(res, result.message, null, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const result = await superAdminAuthService.forgotPassword({ email });

      return sendSuccess(res, result.message, null, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      const result = await superAdminAuthService.resetPassword({
        token,
        newPassword,
      });

      if (!result.success) {
        return sendError(res, result.message, [], result.statusCode);
      }

      clearRefreshTokenCookie(res);

      return sendSuccess(res, result.message, null, result.statusCode);
    } catch (error) {
      return next(error);
    }
  },
};

export default superAdminAuthController;
