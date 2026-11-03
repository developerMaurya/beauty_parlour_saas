/**
 * @file tenantAdminAuth.controller.js
 * @description Authentication, Session Management, and Branch Switching for Tenant Users (ADMIN, STAFF, STUDENT, CUSTOMER).
 * @module backend/src/modules/admin/auth/tenantAdminAuth.controller
 */

import bcrypt from 'bcrypt';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../auth/services/token.service.js';
import { createSession, revokeSession, validateSessionAndCheckReuse, rotateSessionToken } from '../../auth/services/session.service.js';
import { generateUUID, hashToken } from '../../auth/utils/crypto.utils.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';
import { recordActivity } from '../../../utils/activity.utils.js';

export const tenantLogin = async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.username || req.body.phone;
    const { password, branchId } = req.body;

    if (!identifier || !password) {
      return sendError(res, 'Email, phone, or username and password are required', [], 400);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const normalizedIdentifier = identifier.trim().toLowerCase();

    // Find user across email, phone, or username within current tenant
    const user = await TenantUserModel.findOne({
      tenantId: req.tenantId,
      $or: [
        { email: normalizedIdentifier },
        { phone: identifier.trim() },
        { username: normalizedIdentifier },
      ],
    }).select('+passwordHash');

    if (!user) {
      return sendError(res, 'Invalid credentials provided', [], 401);
    }

    // Check account status
    if (user.status === 'blocked' || user.isBlocked) {
      return sendError(res, `Account blocked: ${user.blockDetails?.reason || 'Access denied'}`, [], 403);
    }
    if (user.status === 'suspended') {
      return sendError(res, 'Account is suspended. Please contact administrator.', [], 403);
    }
    if (user.status === 'inactive') {
      return sendError(res, 'Account is deactivated. Please contact administrator.', [], 403);
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      const waitMins = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return sendError(res, `Account temporarily locked. Try again in ${waitMins} minute(s).`, [], 423);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }
      await user.save();
      return sendError(res, 'Invalid credentials provided', [], 401);
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip || '';

    // If specific branch provided, validate
    let targetBranchId = user.branchId;
    if (branchId) {
      if (user.role === 'ADMIN' || user.allowedBranches?.some((b) => b.toString() === branchId)) {
        targetBranchId = branchId;
      }
    }
    await user.save();

    // Create session and JWT tokens
    const sessionId = generateUUID();
    const tokenUser = {
      _id: user._id,
      role: user.role,
      tenantId: req.tenantId,
      branchId: targetBranchId ? targetBranchId.toString() : null,
    };

    const accessToken = generateAccessToken(tokenUser, sessionId);
    const refreshToken = generateRefreshToken(tokenUser, sessionId);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await createSession({
      userId: user._id,
      userRole: user.role,
      userModel: 'TenantUser',
      sessionId,
      refreshTokenHash,
      expiresAt,
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
    });

    // Set refresh token in HttpOnly cookie
    res.cookie('tenant_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Resolve details if Staff or Student
    let profileData = null;
    if (user.role === 'STAFF') {
      const StaffModel = getTenantModel(req, 'Staff');
      profileData = await StaffModel.findOne({ userId: user._id, tenantId: req.tenantId });
    } else if (user.role === 'STUDENT') {
      const StudentModel = getTenantModel(req, 'Student');
      profileData = await StudentModel.findOne({ userId: user._id, tenantId: req.tenantId });
    } else if (user.role === 'CUSTOMER') {
      const CustomerModel = getTenantModel(req, 'Customer');
      profileData = await CustomerModel.findOne({ userId: user._id, tenantId: req.tenantId });
    }

    await recordAuditLog({
      req,
      action: 'TENANT_USER_LOGIN',
      resourceType: 'User',
      resourceId: user._id,
      details: { role: user.role, identifier },
    });

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        branchId: targetBranchId,
        tenantId: req.tenantId,
        tenantName: req.tenant?.name,
        profile: profileData,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return sendError(res, `Login failed: ${error.message}`, [], 500);
  }
};

export const tenantLogout = async (req, res) => {
  try {
    const sessionId = req.tokenPayload?.sessionId;
    if (sessionId) {
      await revokeSession(sessionId);
    }
    res.clearCookie('tenant_refresh_token');
    return sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    return sendError(res, `Logout failed: ${error.message}`, [], 500);
  }
};

export const tenantRefreshToken = async (req, res) => {
  try {
    const token = req.cookies?.tenant_refresh_token || req.body?.refreshToken;
    if (!token) {
      return sendError(res, 'Refresh token missing', [], 401);
    }

    const decoded = verifyRefreshToken(token);
    const incomingHash = hashToken(token);
    const reuseCheck = await validateSessionAndCheckReuse(decoded.sessionId, incomingHash);

    if (reuseCheck.status !== 'VALID') {
      res.clearCookie('tenant_refresh_token');
      return sendError(res, 'Session expired or revoked. Please log in again.', [], 401);
    }

    const TenantUserModel = getTenantModel(req, 'TenantUser');
    const user = await TenantUserModel.findById(decoded.sub);

    if (!user || user.status !== 'active') {
      return sendError(res, 'User inactive or no longer exists', [], 401);
    }

    const tokenUser = {
      _id: user._id,
      role: user.role,
      tenantId: req.tenantId,
      branchId: user.branchId ? user.branchId.toString() : null,
    };

    const newAccessToken = generateAccessToken(tokenUser, decoded.sessionId);
    const newRefreshToken = generateRefreshToken(tokenUser, decoded.sessionId);
    const newTokenHash = hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await rotateSessionToken(decoded.sessionId, incomingHash, newTokenHash, newExpiresAt);

    res.cookie('tenant_refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, 'Token refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return sendError(res, 'Refresh token invalid or expired', [], 401);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    let profileData = null;

    if (user.role === 'STAFF') {
      const StaffModel = getTenantModel(req, 'Staff');
      profileData = await StaffModel.findOne({ userId: user._id, tenantId: req.tenantId })
        .populate('departmentId')
        .populate('designationId')
        .populate('branchId');
    } else if (user.role === 'STUDENT') {
      const StudentModel = getTenantModel(req, 'Student');
      profileData = await StudentModel.findOne({ userId: user._id, tenantId: req.tenantId }).populate('planId');
    } else if (user.role === 'CUSTOMER') {
      const CustomerModel = getTenantModel(req, 'Customer');
      profileData = await CustomerModel.findOne({ userId: user._id, tenantId: req.tenantId });
    }

    return sendSuccess(res, 'User profile retrieved', {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        branchId: user.branchId,
        permissions: req.userPermissions,
        profile: profileData,
      },
      tenant: {
        id: req.tenant._id,
        name: req.tenant.name,
        slug: req.tenant.slug,
        branding: req.tenant.branding,
        limits: req.tenant.limits,
      },
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve profile: ${error.message}`, [], 500);
  }
};

export const switchBranch = async (req, res) => {
  try {
    const { branchId } = req.body;
    const user = req.user;

    if (branchId !== 'all') {
      const BranchModel = getTenantModel(req, 'Branch');
      const branch = await BranchModel.findOne({ _id: branchId, tenantId: req.tenantId, status: 'active' });
      if (!branch) {
        return sendError(res, 'Branch not found or inactive', [], 404);
      }

      if (user.role !== 'ADMIN' && user.allowedBranches?.length > 0) {
        const allowed = user.allowedBranches.some((b) => b.toString() === branchId);
        if (!allowed && user.branchId?.toString() !== branchId) {
          return sendError(res, 'You do not have access to switch to this branch', [], 403);
        }
      }
    }

    user.branchId = branchId === 'all' ? null : branchId;
    await user.save();

    return sendSuccess(res, 'Branch switched successfully', {
      selectedBranchId: user.branchId,
    });
  } catch (error) {
    return sendError(res, `Failed to switch branch: ${error.message}`, [], 500);
  }
};

export default {
  tenantLogin,
  tenantLogout,
  tenantRefreshToken,
  getMe,
  switchBranch,
};
