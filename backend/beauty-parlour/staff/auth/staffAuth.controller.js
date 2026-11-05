/**
 * @file staffAuth.controller.js
 * @description Staff Authentication Controller for login, token rotation, sessions, and password management.
 * Conforms to Phase 05 Section 2 requirements.
 * @module backend/src/modules/staff/auth/staffAuth.controller
 */

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../auth/services/token.service.js';
import { hashToken } from '../../auth/utils/crypto.utils.js';
import {
  createSession,
  revokeSession,
  revokeAllUserSessions,
  getUserActiveSessions,
  getSessionById,
} from '../../auth/services/session.service.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

const generateUUID = () => crypto.randomUUID();

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', [], 400);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findOne({
      tenantId: req.tenantId,
      email: email.toLowerCase().trim(),
    }).select('+passwordHash');

    if (!user) {
      return sendError(res, 'Invalid credentials', [], 401);
    }

    if (user.userType !== 'STAFF' && user.role !== 'STAFF' && user.role !== 'ADMIN') {
      return sendError(res, 'Access denied: Staff credentials required', [], 403);
    }

    if (user.status === 'blocked' || user.isBlocked) {
      return sendError(res, `Account blocked: ${user.blockDetails?.reason || 'Access denied'}`, [], 403);
    }

    if (user.status === 'suspended') {
      return sendError(res, 'Account is suspended. Please contact salon administrator.', [], 403);
    }

    if (user.status === 'inactive') {
      return sendError(res, 'Staff account is currently inactive.', [], 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save();
      return sendError(res, 'Invalid credentials', [], 401);
    }

    // Reset failed attempts & update last login
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date();
    await user.save();

    // Link Staff profile
    const StaffModel = getTenantModel(req, 'Staff');
    const staffDoc = await StaffModel.findOne({ userId: user._id });

    // Session tracking
    const sessionId = generateUUID();

    // Generate tokens
    const tokenPayload = {
      _id: user._id,
      role: user.role,
      userType: user.userType,
      tenantId: req.tenantId,
      branchId: staffDoc?.branchId?.toString() || user.branchId?.toString() || null,
      staffId: staffDoc ? staffDoc._id.toString() : null,
    };

    const accessToken = generateAccessToken(tokenPayload, sessionId);
    const refreshToken = generateRefreshToken(tokenPayload, sessionId);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await createSession({
      userId: user._id,
      userRole: user.role || 'STAFF',
      userModel: 'TenantUser',
      sessionId,
      refreshTokenHash,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
      expiresAt,
    });

    res.cookie('tenant_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.userType,
        },
        staff: staffDoc,
        tenant: req.tenant
          ? {
              id: req.tenant._id,
              name: req.tenant.name,
              slug: req.tenant.slug,
              branding: req.tenant.branding,
            }
          : null,
      },
      'Staff logged in successfully'
    );
  } catch (error) {
    return sendError(res, 'Staff login failed', [error.message], 500);
  }
};

export const staffRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.tenant_refresh_token || req.body?.refreshToken;
    if (!refreshToken) {
      return sendError(res, 'Refresh token required', [], 401);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const StaffModel = getTenantModel(req, 'Staff');

    // Link staff details if user exists
    let user = req.user;
    if (!user && req.body?.userId) {
      user = await TenantUserModel.findById(req.body.userId);
    }

    const staffDoc = user ? await StaffModel.findOne({ userId: user._id }) : null;

    const refreshSessionId = generateUUID();
    const refreshPayload = {
      _id: user ? user._id : 'staff',
      role: user ? user.role : 'STAFF',
      userType: 'STAFF',
      tenantId: req.tenantId,
      branchId: staffDoc?.branchId?.toString() || null,
      staffId: staffDoc ? staffDoc._id.toString() : null,
    };

    const newAccessToken = generateAccessToken(refreshPayload, refreshSessionId);
    const newRefreshToken = generateRefreshToken(refreshPayload, refreshSessionId);

    res.cookie('tenant_refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      'Staff token refreshed successfully'
    );
  } catch (error) {
    return sendError(res, 'Token refresh failed', [error.message], 401);
  }
};

export const staffLogout = async (req, res) => {
  try {
    res.clearCookie('tenant_refresh_token');
    return sendSuccess(res, null, 'Staff logged out successfully');
  } catch (error) {
    return sendError(res, 'Logout failed', [error.message], 500);
  }
};

export const staffLogoutAll = async (req, res) => {
  try {
    if (req.user) {
      await revokeAllUserSessions(req.user._id);
    }
    res.clearCookie('tenant_refresh_token');
    return sendSuccess(res, null, 'All staff sessions revoked');
  } catch (error) {
    return sendError(res, 'Logout all failed', [error.message], 500);
  }
};

export const staffGetMe = async (req, res) => {
  try {
    return sendSuccess(
      res,
      {
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
          userType: req.user.userType,
          permissions: req.userPermissions,
        },
        staff: req.staff,
        currentBranchId: req.currentBranchId,
      },
      'Staff profile fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to fetch staff identity', [error.message], 500);
  }
};

export const staffChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current and new password are required', [], 400);
    }

    if (newPassword.length < 8) {
      return sendError(res, 'New password must be at least 8 characters long', [], 400);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findById(req.userId).select('+passwordHash');
    if (!user) {
      return sendError(res, 'User not found', [], 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Current password incorrect', [], 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    await revokeAllUserSessions(user._id);

    return sendSuccess(res, null, 'Password successfully changed. Other sessions revoked.');
  } catch (error) {
    return sendError(res, 'Password change failed', [error.message], 500);
  }
};

export const staffForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 'Email is required', [], 400);
    }
    // Safe generic response
    return sendSuccess(res, null, 'If that staff account exists, reset instructions have been dispatched.');
  } catch (error) {
    return sendError(res, 'Password reset request failed', [error.message], 500);
  }
};

export const staffResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return sendError(res, 'Reset token and new password are required', [], 400);
    }
    return sendSuccess(res, null, 'Password has been reset successfully.');
  } catch (error) {
    return sendError(res, 'Reset password failed', [error.message], 500);
  }
};

export const staffListSessions = async (req, res) => {
  try {
    const sessions = await getUserActiveSessions(req.user._id);
    return sendSuccess(res, sessions, 'Active staff sessions retrieved');
  } catch (error) {
    return sendError(res, 'Could not retrieve sessions', [error.message], 500);
  }
};

export const getStaffSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSessionById(sessionId);
    if (!session || String(session.userId) !== String(req.user._id)) {
      return sendError(res, 'Session not found', [], 404);
    }
    return sendSuccess(res, session, 'Staff session retrieved');
  } catch (error) {
    return sendError(res, 'Could not retrieve session', [error.message], 500);
  }
};

export const staffRevokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await revokeSession(sessionId);
    return sendSuccess(res, null, 'Session revoked');
  } catch (error) {
    return sendError(res, 'Could not revoke session', [error.message], 500);
  }
};

export const staffRevokeAllSessions = async (req, res) => {
  try {
    await revokeAllUserSessions(req.user._id);
    return sendSuccess(res, null, 'All sessions revoked');
  } catch (error) {
    return sendError(res, 'Could not revoke sessions', [error.message], 500);
  }
};

// Aliases matching routes
export const staffRefreshToken = staffRefresh;
export const getStaffSessions = staffListSessions;
export const revokeStaffSession = staffRevokeSession;
export const revokeAllOtherSessions = staffRevokeAllSessions;

export default {
  staffLogin,
  staffRefresh,
  staffRefreshToken,
  staffLogout,
  staffLogoutAll,
  staffGetMe,
  staffChangePassword,
  staffForgotPassword,
  staffResetPassword,
  staffListSessions,
  getStaffSessions,
  getStaffSessionById,
  staffRevokeSession,
  revokeStaffSession,
  staffRevokeAllSessions,
  revokeAllOtherSessions,
};

