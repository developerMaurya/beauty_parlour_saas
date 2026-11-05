/**
 * @file superadmin-auth.service.js
 * @description Super Admin authentication business logic orchestration.
 * @module backend/src/modules/auth/services/superadmin-auth.service
 */

import { env } from '../../../config/env.js';
import { ROLES, ACCOUNT_STATUS, PASSWORD_RESET_CONFIG } from '../constants/auth.constants.js';
import { SuperAdmin } from '../models/super-admin.model.js';
import { PasswordReset } from '../models/password-reset.model.js';
import { comparePassword, hashPassword } from './password.service.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  parseDurationToMs,
} from './token.service.js';
import {
  createSession,
  validateSessionAndCheckReuse,
  rotateSessionToken,
  revokeSession,
  revokeAllUserSessions,
} from './session.service.js';
import { hashToken, generateRandomToken, generateUUID } from '../utils/crypto.utils.js';
import { emailService } from './email.service.js';

export const superAdminAuthService = {
  /**
   * Super Admin Login
   */
  async login({ emailOrUsername, password, ipAddress = '', userAgent = '' }) {
    const identifier = (emailOrUsername || '').toLowerCase().trim();

    // Find Super Admin by email or username including passwordHash
    let user = await SuperAdmin.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+passwordHash');

    // Auto-bootstrap fail-safe: if default superadmin not yet in DB, create on first login
    const bootstrapEmail = (env.SUPERADMIN_BOOTSTRAP_EMAIL || 'superadmin@beautysaas.local').toLowerCase();
    const bootstrapUsername = (env.SUPERADMIN_BOOTSTRAP_USERNAME || 'superadmin').toLowerCase();
    const bootstrapPassword = env.SUPERADMIN_BOOTSTRAP_PASSWORD || 'SuperAdmin@Secure2026!';

    if (!user && (identifier === bootstrapEmail || identifier === bootstrapUsername)) {
      if (password === bootstrapPassword) {
        const passwordHash = await hashPassword(bootstrapPassword);
        user = await SuperAdmin.create({
          name: env.SUPERADMIN_BOOTSTRAP_NAME || 'Master Super Admin',
          email: bootstrapEmail,
          username: bootstrapUsername,
          passwordHash,
          role: ROLES.SUPER_ADMIN,
          status: ACCOUNT_STATUS.ACTIVE,
          isEmailVerified: true,
        });
        console.log('[AUTH] Auto-bootstrapped Master SuperAdmin user on login:', user.email);
      }
    }

    if (!user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid credentials',
      };
    }

    // Check account lockout status
    if (user.isLocked) {
      const lockRemainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
      return {
        success: false,
        statusCode: 423, // Locked
        message: `Account is temporarily locked due to repeated failed login attempts. Please try again in ${lockRemainingMinutes} minute(s).`,
      };
    }

    // Check account status
    if (user.status === ACCOUNT_STATUS.SUSPENDED) {
      return {
        success: false,
        statusCode: 403,
        message: 'Account has been suspended. Please contact platform support.',
      };
    }

    if (user.status === ACCOUNT_STATUS.INACTIVE) {
      return {
        success: false,
        statusCode: 403,
        message: 'Account is currently inactive. Please contact platform support.',
      };
    }

    // Verify password securely using bcrypt
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid credentials',
      };
    }

    // Password is valid - reset failed attempts and record login
    await user.resetLoginAttempts();
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress;
    await user.save();

    // Create session and JWT tokens
    const sessionId = generateUUID();
    const accessToken = generateAccessToken(user, sessionId);
    const refreshToken = generateRefreshToken(user, sessionId);
    const refreshTokenHash = hashToken(refreshToken);
    const refreshDurationMs = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);
    const expiresAt = new Date(Date.now() + refreshDurationMs);

    await createSession({
      userId: user._id,
      userRole: ROLES.SUPER_ADMIN,
      sessionId,
      refreshTokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
        },
      },
      refreshToken,
      refreshDurationMs,
    };
  },

  /**
   * Refresh Access and Refresh Tokens with Rotation & Reuse Detection
   */
  async refresh({ refreshToken, ipAddress = '', userAgent = '' }) {
    if (!refreshToken) {
      return {
        success: false,
        statusCode: 401,
        message: 'Refresh token missing',
      };
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return {
        success: false,
        statusCode: 401,
        message: error.name === 'TokenExpiredError' ? 'Refresh token has expired' : 'Invalid refresh token',
      };
    }

    const incomingTokenHash = hashToken(refreshToken);

    // Validate session and check for token reuse attack
    const { session, status } = await validateSessionAndCheckReuse(decoded.sessionId, incomingTokenHash);

    if (status === 'REUSED') {
      return {
        success: false,
        statusCode: 403,
        message: 'Security alert: Refresh token reuse detected. Session has been revoked.',
      };
    }

    if (status === 'REVOKED') {
      return {
        success: false,
        statusCode: 401,
        message: 'Session has been revoked. Please log in again.',
      };
    }

    if (status === 'EXPIRED') {
      return {
        success: false,
        statusCode: 401,
        message: 'Session has expired. Please log in again.',
      };
    }

    if (status === 'NOT_FOUND' || !session) {
      return {
        success: false,
        statusCode: 401,
        message: 'Session not found. Please log in again.',
      };
    }

    // Verify user exists and is active
    const user = await SuperAdmin.findById(decoded.sub);
    if (!user) {
      return {
        success: false,
        statusCode: 401,
        message: 'User account not found',
      };
    }

    if (user.status !== ACCOUNT_STATUS.ACTIVE) {
      return {
        success: false,
        statusCode: 403,
        message: `Account is ${user.status}. Please contact support.`,
      };
    }

    // Generate rotated access and refresh tokens
    const newAccessToken = generateAccessToken(user, session.sessionId);
    const newRefreshToken = generateRefreshToken(user, session.sessionId);
    const newRefreshTokenHash = hashToken(newRefreshToken);
    const refreshDurationMs = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);
    const newExpiresAt = new Date(Date.now() + refreshDurationMs);

    // Persist token rotation with reference to previous token for reuse detection
    await rotateSessionToken(session.sessionId, incomingTokenHash, newRefreshTokenHash, newExpiresAt);

    return {
      success: true,
      statusCode: 200,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
      refreshToken: newRefreshToken,
      refreshDurationMs,
    };
  },

  /**
   * Logout single current session
   */
  async logout({ sessionId, refreshToken }) {
    if (sessionId) {
      await revokeSession(sessionId, 'LOGOUT');
    } else if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded.sessionId) {
          await revokeSession(decoded.sessionId, 'LOGOUT');
        }
      } catch {
        // If token invalid, still attempt hash lookup
        const tokenHash = hashToken(refreshToken);
        await Session.findOneAndUpdate({ refreshTokenHash: tokenHash }, { $set: { revokedAt: new Date(), revokedReason: 'LOGOUT' } });
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Logged out successfully',
    };
  },

  /**
   * Logout all active sessions for authenticated Super Admin
   */
  async logoutAll({ userId }) {
    await revokeAllUserSessions(userId, 'LOGOUT_ALL');

    return {
      success: true,
      statusCode: 200,
      message: 'All sessions revoked successfully',
    };
  },

  /**
   * Get safe profile of authenticated Super Admin
   */
  async getMe({ userId }) {
    const user = await SuperAdmin.findById(userId);
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: 'Super Admin not found',
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
          lastLoginIp: user.lastLoginIp,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };
  },

  /**
   * Update safe profile of authenticated Super Admin
   */
  async updateProfile({ userId, name, email, avatarUrl }) {
    const user = await SuperAdmin.findById(userId);
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: 'Super Admin not found',
      };
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    return {
      success: true,
      statusCode: 200,
      message: 'Master profile updated successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
          lastLoginIp: user.lastLoginIp,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };
  },

  /**
   * Change Password
   */
  async changePassword({ userId, currentPassword, newPassword }) {
    const user = await SuperAdmin.findById(userId).select('+passwordHash');
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: 'User account not found',
      };
    }

    // Verify current password
    const isCurrentValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return {
        success: false,
        statusCode: 400,
        message: 'Current password is incorrect',
      };
    }

    // Hash new password and update
    user.passwordHash = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    await user.save();

    // Revoke all existing sessions so user must log in again with new password
    await revokeAllUserSessions(userId, 'PASSWORD_CHANGED');

    return {
      success: true,
      statusCode: 200,
      message: 'Password changed successfully. Please log in again with your new password.',
    };
  },

  /**
   * Forgot Password - request password reset email
   */
  async forgotPassword({ email }) {
    const user = await SuperAdmin.findOne({ email: email.toLowerCase().trim() });

    // Consistent response timing and message to prevent user enumeration
    if (user && user.status === ACCOUNT_STATUS.ACTIVE) {
      const resetToken = generateRandomToken(32);
      const tokenHash = hashToken(resetToken);
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_CONFIG.EXPIRES_IN_MS);

      // Invalidate any previously requested unused tokens for this user
      await PasswordReset.updateMany({ userId: user._id, usedAt: null }, { $set: { usedAt: new Date() } });

      await PasswordReset.create({
        userId: user._id,
        email: user.email,
        tokenHash,
        expiresAt,
      });

      await emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    return {
      success: true,
      statusCode: 200,
      message: 'If an account with that email exists, password reset instructions have been sent.',
    };
  },

  /**
   * Reset Password with token
   */
  async resetPassword({ token, newPassword }) {
    const tokenHash = hashToken(token);

    const resetRecord = await PasswordReset.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return {
        success: false,
        statusCode: 400,
        message: 'Invalid or expired password reset token',
      };
    }

    const user = await SuperAdmin.findById(resetRecord.userId);
    if (!user) {
      return {
        success: false,
        statusCode: 400,
        message: 'Associated user account no longer exists',
      };
    }

    // Hash new password and update user
    user.passwordHash = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    await user.save();

    // Mark reset token as used
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // Invalidate all active sessions
    await revokeAllUserSessions(user._id, 'PASSWORD_RESET');

    return {
      success: true,
      statusCode: 200,
      message: 'Password reset successfully. Please log in with your new password.',
    };
  },
};

export default superAdminAuthService;
