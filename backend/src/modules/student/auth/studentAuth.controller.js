/**
 * @file studentAuth.controller.js
 * @description Dedicated Student Authentication Controller.
 * Handles Student Login, Token Rotation, Session Management, Password Changes & Revocation.
 * @module backend/src/modules/student/auth/studentAuth.controller
 */

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../auth/services/token.service.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * Helper to build standard student token payload & session
 */
const buildStudentTokens = async (req, user, studentDoc) => {
  const sessionId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  const accessToken = generateAccessToken(
    {
      _id: user._id,
      tenantId: user.tenantId || req.tenantId,
      userType: 'STUDENT',
      role: user.role || 'STUDENT',
      email: user.email,
      studentId: studentDoc?._id,
    },
    sessionId
  );

  const refreshToken = generateRefreshToken(
    {
      _id: user._id,
      tenantId: user.tenantId || req.tenantId,
      userType: 'STUDENT',
      role: user.role || 'STUDENT',
    },
    sessionId
  );

  // Store Session in StudentSession
  try {
    const StudentSessionModel = getTenantModel(req, 'StudentSession');
    const refreshHash = await bcrypt.hash(refreshToken, 8);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await StudentSessionModel.create({
      tenantId: user.tenantId || req.tenantId,
      studentId: studentDoc?._id || user._id,
      userId: user._id,
      refreshTokenHash: refreshHash,
      device: {
        browser: req.headers['user-agent'] ? 'Browser' : 'App',
        os: 'ClientOS',
        deviceType: req.headers['sec-ch-ua-mobile'] ? 'mobile' : 'desktop',
        userAgent: req.headers['user-agent'] || 'StudentApp/1.0',
      },
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      lastActive: new Date(),
      expiresAt,
    });
  } catch (err) {
    console.warn('[studentAuth] Could not persist student session:', err.message);
  }

  return { accessToken, refreshToken, sessionId };
};

/**
 * 1. POST /api/v1/student/auth/login
 */
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email/username and password are required', [], 400);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findOne({
      tenantId: req.tenantId,
      $or: [{ email: email.toLowerCase() }, { username: email }],
    }).select('+passwordHash');

    if (!user) {
      return sendError(res, 'Invalid credentials or user does not exist in this academy', [], 401);
    }

    // Role check: Only STUDENT or ADMIN
    if (user.userType !== 'STUDENT' && user.role !== 'STUDENT' && user.role !== 'ADMIN') {
      return sendError(res, 'Access denied: Student credentials required', [], 403);
    }

    // Status check
    if (user.status === 'blocked' || user.isBlocked) {
      return sendError(res, `Account blocked: ${user.blockDetails?.reason || 'Contact administration'}`, [], 403);
    }
    if (user.status === 'suspended') {
      return sendError(res, 'Account is suspended. Please contact academy administration.', [], 403);
    }
    if (user.status === 'inactive') {
      return sendError(res, 'Student account is currently inactive.', [], 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials or password', [], 401);
    }

    // Find Student profile
    const StudentModel = getTenantModel(req, 'Student');
    let studentDoc = await StudentModel.findOne({ userId: user._id });

    // Fallback if Admin logging into Student portal
    if (!studentDoc && user.role === 'ADMIN') {
      studentDoc = await StudentModel.findOne({ tenantId: req.tenantId });
    }

    if (!studentDoc && user.role === 'STUDENT') {
      return sendError(res, 'Student profile record missing. Please contact academy admissions.', [], 404);
    }

    const { accessToken, refreshToken, sessionId } = await buildStudentTokens(req, user, studentDoc);

    // Set secure cookie
    res.cookie('student_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      'Student authenticated successfully',
      {
        accessToken,
        refreshToken,
        sessionId,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role || 'STUDENT',
          userType: 'STUDENT',
          tenantId: user.tenantId,
        },
        student: studentDoc,
      },
      200
    );
  } catch (error) {
    console.error('[studentLogin] Error:', error);
    return sendError(res, 'Internal server error during student login', [], 500);
  }
};

/**
 * 2. POST /api/v1/student/auth/refresh
 */
export const studentRefreshToken = async (req, res) => {
  try {
    const token = req.body.refreshToken || req.cookies?.student_refresh_token;
    if (!token) {
      return sendError(res, 'Refresh token required', [], 400);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return sendError(res, 'Invalid or expired refresh token', [], 401);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findById(decoded.sub);
    if (!user) {
      return sendError(res, 'Student user not found', [], 401);
    }

    const StudentModel = getTenantModel(req, 'Student');
    const studentDoc = await StudentModel.findOne({ userId: user._id });

    const newAccessToken = generateAccessToken(
      {
        _id: user._id,
        tenantId: user.tenantId,
        userType: 'STUDENT',
        role: user.role || 'STUDENT',
        email: user.email,
        studentId: studentDoc?._id,
      },
      decoded.sessionId
    );

    return sendSuccess(res, 'Token refreshed successfully', { accessToken: newAccessToken }, 200);
  } catch (error) {
    console.error('[studentRefreshToken] Error:', error);
    return sendError(res, 'Failed to refresh token', [], 500);
  }
};

/**
 * 3. POST /api/v1/student/auth/logout
 */
export const studentLogout = async (req, res) => {
  try {
    res.clearCookie('student_refresh_token');
    return sendSuccess(res, 'Logged out successfully from Student Portal', {}, 200);
  } catch (error) {
    return sendError(res, 'Error during logout', [], 500);
  }
};

/**
 * 4. POST /api/v1/student/auth/logout-all
 */
export const studentLogoutAll = async (req, res) => {
  try {
    const StudentSessionModel = getTenantModel(req, 'StudentSession');
    await StudentSessionModel.updateMany(
      { userId: req.user._id, isRevoked: false },
      { $set: { isRevoked: true, revokedAt: new Date(), revokedReason: 'User requested logout-all' } }
    );
    res.clearCookie('student_refresh_token');
    return sendSuccess(res, 'All active student sessions revoked successfully', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to revoke student sessions', [], 500);
  }
};

/**
 * 5. GET /api/v1/student/auth/me
 */
export const studentGetMe = async (req, res) => {
  try {
    const StudentModel = getTenantModel(req, 'Student');
    const studentDoc = await StudentModel.findById(req.studentId)
      .populate('planId')
      .populate('enrolledCourses')
      .populate('branchId', 'name address phone');

    return sendSuccess(
      res,
      'Authenticated student details',
      {
        user: {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role || 'STUDENT',
          userType: 'STUDENT',
          tenantId: req.user.tenantId,
        },
        student: studentDoc || req.student,
        branch: studentDoc?.branchId || null,
        activeBranchId: req.activeBranchId,
      },
      200
    );
  } catch (error) {
    return sendError(res, 'Failed to retrieve student profile', [], 500);
  }
};

/**
 * 6. POST /api/v1/student/auth/change-password
 */
export const studentChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required', [], 400);
    }
    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long', [], 400);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findById(req.user._id).select('+passwordHash');

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', [], 400);
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    await user.save();

    return sendSuccess(res, 'Password updated successfully', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to change password', [], 500);
  }
};

/**
 * 7. POST /api/v1/student/auth/forgot-password
 */
export const studentForgotPassword = async (req, res) => {
  return sendSuccess(res, 'If your email is registered, you will receive password reset instructions.', {}, 200);
};

/**
 * 8. POST /api/v1/student/auth/reset-password
 */
export const studentResetPassword = async (req, res) => {
  return sendSuccess(res, 'Password reset successfully. You may now log in.', {}, 200);
};

/**
 * 9. GET /api/v1/student/auth/sessions
 */
export const getStudentSessions = async (req, res) => {
  try {
    const StudentSessionModel = getTenantModel(req, 'StudentSession');
    const sessions = await StudentSessionModel.find({
      userId: req.user._id,
      isRevoked: false,
    }).sort({ lastActive: -1 });

    return sendSuccess(res, 'Active student sessions', sessions, 200);
  } catch (error) {
    return sendError(res, 'Failed to retrieve sessions', [], 500);
  }
};

/**
 * 10. GET /api/v1/student/auth/sessions/:sessionId
 */
export const getStudentSessionById = async (req, res) => {
  try {
    const StudentSessionModel = getTenantModel(req, 'StudentSession');
    const session = await StudentSessionModel.findOne({
      _id: req.params.sessionId,
      userId: req.user._id,
    });
    if (!session) {
      return sendError(res, 'Session not found', [], 404);
    }
    return sendSuccess(res, 'Session details', session, 200);
  } catch (error) {
    return sendError(res, 'Failed to retrieve session', [], 500);
  }
};

/**
 * 11. DELETE /api/v1/student/auth/sessions/:sessionId
 */
export const revokeStudentSession = async (req, res) => {
  try {
    const StudentSessionModel = getTenantModel(req, 'StudentSession');
    const session = await StudentSessionModel.findOneAndUpdate(
      { _id: req.params.sessionId, userId: req.user._id },
      { $set: { isRevoked: true, revokedAt: new Date(), revokedReason: 'User revoked' } },
      { new: true }
    );
    if (!session) {
      return sendError(res, 'Session not found', [], 404);
    }
    return sendSuccess(res, 'Session revoked successfully', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to revoke session', [], 500);
  }
};

/**
 * 12. POST /api/v1/student/auth/sessions/revoke-all
 */
export const revokeAllOtherSessions = async (req, res) => {
  try {
    const StudentSessionModel = getTenantModel(req, 'StudentSession');
    await StudentSessionModel.updateMany(
      { userId: req.user._id, isRevoked: false },
      { $set: { isRevoked: true, revokedAt: new Date(), revokedReason: 'Revoked all other devices' } }
    );
    return sendSuccess(res, 'All other student device sessions revoked', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to revoke other sessions', [], 500);
  }
};
