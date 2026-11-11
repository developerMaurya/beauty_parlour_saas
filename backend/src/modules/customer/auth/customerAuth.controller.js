/**
 * @file customerAuth.controller.js
 * @description Customer Authentication, Registration & Session Management Controller.
 * @module backend/src/modules/customer/auth
 */

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../auth/services/token.service.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * Register a new Customer
 */
export const register = async (req, res) => {
  try {
    const { name, phone, email, password, gender, preferredBranch } = req.body;

    if (!name || !phone || !password) {
      return sendError(res, 'Name, phone and password are required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');

    // Check duplicate phone or email
    const existing = await CustomerModel.findOne({
      tenantId: req.tenantId,
      $or: [{ phone }, ...(email ? [{ email }] : [])],
    });

    if (existing) {
      return sendError(res, 'Customer account with this phone or email already exists', [], 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const customerNumber = `CUST-${randomSuffix}`;

    const newCustomer = await CustomerModel.create({
      tenantId: req.tenantId,
      customerNumber,
      name,
      phone,
      email: email || '',
      passwordHash,
      gender: gender || 'female',
      preferredBranch: preferredBranch || null,
      status: 'ACTIVE',
      registrationDate: new Date(),
    });

    // Generate tokens
    const tokenPayload = {
      sub: newCustomer._id,
      customerId: newCustomer._id,
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      tenantId: req.tenantId,
      name: newCustomer.name,
      email: newCustomer.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save session
    const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
    await CustomerSessionModel.create({
      tenantId: req.tenantId,
      customerId: newCustomer._id,
      token: refreshToken,
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
      deviceInfo: req.headers['sec-ch-ua-platform'] || 'Web',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const sanitizedCustomer = newCustomer.toObject();
    delete sanitizedCustomer.passwordHash;

    return sendSuccess(res, 'Customer registration successful', {
      customer: sanitizedCustomer,
      accessToken,
      refreshToken,
    }, 201);
  } catch (err) {
    return sendError(res, 'Registration error: ' + err.message, [], 500);
  }
};

/**
 * Customer Login
 */
export const login = async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;
    const loginId = identifier || phone || email;

    if (!loginId || !password) {
      return sendError(res, 'Phone/Email and password are required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findOne({
      tenantId: req.tenantId,
      $or: [{ phone: loginId }, { email: loginId.toLowerCase() }],
    });

    if (!customer) {
      return sendError(res, 'Invalid credentials', [], 401);
    }

    const statusUpper = (customer.status || '').toUpperCase();
    if (customer.isBlocked || statusUpper === 'BLOCKED' || statusUpper === 'SUSPENDED' || statusUpper === 'DELETED') {
      return sendError(res, 'Account is suspended or blocked. Please contact salon support.', [], 403);
    }

    if (!customer.passwordHash) {
      return sendError(res, 'Password not set. Please use OTP or reset password.', [], 400);
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', [], 401);
    }

    // Update last login
    customer.lastLoginAt = new Date();
    await customer.save();

    const tokenPayload = {
      sub: customer._id,
      customerId: customer._id,
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      tenantId: req.tenantId,
      name: customer.name,
      email: customer.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save session
    const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
    await CustomerSessionModel.create({
      tenantId: req.tenantId,
      customerId: customer._id,
      token: refreshToken,
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
      deviceInfo: req.headers['sec-ch-ua-platform'] || 'Web',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const sanitizedCustomer = customer.toObject();
    delete sanitizedCustomer.passwordHash;

    return sendSuccess(res, 'Customer login successful', {
      customer: sanitizedCustomer,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return sendError(res, 'Login error: ' + err.message, [], 500);
  }
};

/**
 * Rotate Refresh Token
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 'Refresh token is required', [], 400);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return sendError(res, 'Invalid or expired refresh token', [], 401);
    }

    const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
    const session = await CustomerSessionModel.findOne({
      token: refreshToken,
      revoked: false,
    });

    if (!session) {
      return sendError(res, 'Session not found or revoked', [], 401);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findById(decoded.customerId || decoded.sub);
    if (!customer) {
      return sendError(res, 'Customer account no longer exists', [], 401);
    }

    const tokenPayload = {
      sub: customer._id,
      customerId: customer._id,
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      tenantId: req.tenantId || decoded.tenantId,
      name: customer.name,
      email: customer.email,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    session.token = newRefreshToken;
    session.lastActive = new Date();
    await session.save();

    return sendSuccess(res, 'Tokens refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return sendError(res, 'Token refresh failed: ' + err.message, [], 500);
  }
};

/**
 * Logout Current Session
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
      await CustomerSessionModel.updateOne(
        { token: refreshToken, customerId: req.customerId },
        { revoked: true }
      );
    }
    return sendSuccess(res, 'Logged out successfully');
  } catch (err) {
    return sendError(res, 'Logout failed: ' + err.message, [], 500);
  }
};

/**
 * Logout All Sessions
 */
export const logoutAll = async (req, res) => {
  try {
    const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
    await CustomerSessionModel.updateMany(
      { customerId: req.customerId, revoked: false },
      { revoked: true }
    );
    return sendSuccess(res, 'All active sessions revoked successfully');
  } catch (err) {
    return sendError(res, 'Session revocation failed: ' + err.message, [], 500);
  }
};

/**
 * Get Authenticated Customer Profile
 */
export const getMe = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findById(req.customerId)
      .populate('preferredBranch', 'name code address phone')
      .populate('preferredServices', 'name price durationMinutes category')
      .populate('favoriteStaff', 'name photo designation')
      .populate('favoritePackages', 'name price validityDays');

    if (!customer) {
      return sendError(res, 'Customer profile not found', [], 404);
    }

    const sanitized = customer.toObject();
    delete sanitized.passwordHash;
    sanitized.role = 'CUSTOMER';
    sanitized.userType = 'CUSTOMER';

    return sendSuccess(res, 'Customer profile retrieved', sanitized);
  } catch (err) {
    return sendError(res, 'Profile retrieval failed: ' + err.message, [], 500);
  }
};

/**
 * Change Customer Password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, oldPassword, newPassword } = req.body;
    const providedOld = oldPassword || currentPassword;
    if (!providedOld || !newPassword) {
      return sendError(res, 'Current and new password are required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findById(req.customerId);
    if (!customer || !customer.passwordHash) {
      return sendError(res, 'Customer account error', [], 400);
    }

    const isMatch = await bcrypt.compare(providedOld, customer.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', [], 400);
    }

    const salt = await bcrypt.genSalt(10);
    customer.passwordHash = await bcrypt.hash(newPassword, salt);
    await customer.save();

    return sendSuccess(res, 'Password changed successfully');
  } catch (err) {
    return sendError(res, 'Password update failed: ' + err.message, [], 500);
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return sendError(res, 'Email or phone is required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findOne({
      tenantId: req.tenantId,
      $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
    });

    if (!customer) {
      return sendError(res, 'Customer account not found', [], 404);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    customer.resetPasswordToken = resetToken;
    customer.resetPasswordExpires = new Date(Date.now() + 3600000);
    await customer.save();

    return sendSuccess(res, 'Password reset instructions dispatched', {
      resetToken,
    });
  } catch (err) {
    return sendError(res, 'Forgot password error: ' + err.message, [], 500);
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return sendError(res, 'Reset token and new password are required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findOne({
      tenantId: req.tenantId,
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!customer) {
      return sendError(res, 'Invalid or expired password reset token', [], 400);
    }

    const salt = await bcrypt.genSalt(10);
    customer.passwordHash = await bcrypt.hash(newPassword, salt);
    customer.resetPasswordToken = undefined;
    customer.resetPasswordExpires = undefined;
    await customer.save();

    return sendSuccess(res, 'Password reset successfully');
  } catch (err) {
    return sendError(res, 'Reset password error: ' + err.message, [], 500);
  }
};

/**
 * Get Active Sessions
 */
export const getSessions = async (req, res) => {
  try {
    const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
    const sessions = await CustomerSessionModel.find({
      customerId: req.customerId,
      revoked: false,
    }).sort({ lastActive: -1 });

    return sendSuccess(res, 'Active sessions retrieved', sessions);
  } catch (err) {
    return sendError(res, 'Failed to fetch sessions: ' + err.message, [], 500);
  }
};

/**
 * Get Session By ID
 */
export const getSessionById = async (req, res) => {
  try {
    const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
    const session = await CustomerSessionModel.findOne({
      _id: req.params.sessionId,
      customerId: req.customerId,
    });
    if (!session) return sendError(res, 'Session not found', [], 404);
    return sendSuccess(res, 'Session details retrieved', session);
  } catch (err) {
    return sendError(res, 'Failed to retrieve session: ' + err.message, [], 500);
  }
};

/**
 * Revoke Specific Session
 */
export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const CustomerSessionModel = getTenantModel(req, 'CustomerSession');
    const session = await CustomerSessionModel.findOneAndUpdate(
      { _id: sessionId, customerId: req.customerId },
      { revoked: true },
      { new: true }
    );

    if (!session) {
      return sendError(res, 'Session not found', [], 404);
    }

    return sendSuccess(res, 'Session revoked successfully');
  } catch (err) {
    return sendError(res, 'Revocation failed: ' + err.message, [], 500);
  }
};

/**
 * Google Sign-In with Email for Customer
 */
export const googleLogin = async (req, res) => {
  try {
    const { email, name, picture, googleId, phone } = req.body;

    if (!email) {
      return sendError(res, 'Google email address is required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    let customer = await CustomerModel.findOne({
      tenantId: req.tenantId,
      email: email.toLowerCase(),
    });

    if (!customer) {
      // Auto-register new customer via Google Sign-In
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const customerNumber = `CUST-${randomSuffix}`;
      const defaultPhone = phone || `G-${Date.now().toString().slice(-8)}`;

      customer = await CustomerModel.create({
        tenantId: req.tenantId,
        customerNumber,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        phone: defaultPhone,
        googleId: googleId || '',
        profilePhoto: picture || '',
        authProvider: 'GOOGLE',
        status: 'ACTIVE',
        isVerified: true,
      });
    } else {
      if (picture) customer.profilePhoto = picture;
      if (name && (!customer.name || customer.name === 'Customer')) customer.name = name;
      if (googleId) customer.googleId = googleId;
      customer.lastLoginAt = new Date();
      await customer.save();
    }

    const tokenPayload = {
      sub: customer._id,
      customerId: customer._id,
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      tenantId: req.tenantId,
      name: customer.name,
      email: customer.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshTokenVal = generateRefreshToken(tokenPayload);

    return sendSuccess(res, 'Google Sign-In successful', {
      customer: {
        _id: customer._id,
        id: customer._id,
        customerNumber: customer.customerNumber,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        profilePhoto: customer.profilePhoto,
        status: customer.status,
      },
      accessToken,
      refreshToken: refreshTokenVal,
    });
  } catch (err) {
    console.error('[customerAuth.googleLogin] Error:', err);
    return sendError(res, err.message || 'Google Login failed', [], 500);
  }
};

export const refreshToken = refresh;
export const revokeAllSessions = logoutAll;

export default {
  register,
  login,
  refresh,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  getSessions,
  getSessionById,
  revokeSession,
  revokeAllSessions,
  googleLogin,
};
