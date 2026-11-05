/**
 * @file superadmin-auth.routes.js
 * @description Route definitions for Super Administrator authentication endpoints.
 * @module backend/src/modules/auth/routes/superadmin-auth.routes
 */

import { Router } from 'express';
import { superAdminAuthController } from '../controllers/superadmin-auth.controller.js';
import {
  authenticateAccessToken,
  requireSuperAdmin,
  optionalAuthentication,
} from '../middlewares/auth.middleware.js';
import {
  loginRateLimiter,
  forgotPasswordRateLimiter,
} from '../middlewares/auth-rate-limiter.middleware.js';
import { validateBody } from '../../../middleware/validation.middleware.js';
import {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

// 1. Login
router.post(
  '/login',
  loginRateLimiter,
  validateBody(loginSchema),
  superAdminAuthController.login
);

// 2. Refresh Token
router.post(
  '/refresh',
  superAdminAuthController.refresh
);

// 3. Logout Current Session
router.post(
  '/logout',
  optionalAuthentication,
  superAdminAuthController.logout
);

// 4. Logout All Sessions
router.post(
  '/logout-all',
  authenticateAccessToken,
  requireSuperAdmin,
  superAdminAuthController.logoutAll
);

// 5. Get Current Super Admin Profile
router.get(
  '/me',
  authenticateAccessToken,
  requireSuperAdmin,
  superAdminAuthController.getMe
);

// Update Current Super Admin Profile
router.put(
  '/me',
  authenticateAccessToken,
  requireSuperAdmin,
  superAdminAuthController.updateProfile
);

router.patch(
  '/me',
  authenticateAccessToken,
  requireSuperAdmin,
  superAdminAuthController.updateProfile
);

// 6. Change Password
router.post(
  '/change-password',
  authenticateAccessToken,
  requireSuperAdmin,
  validateBody(changePasswordSchema),
  superAdminAuthController.changePassword
);

// 7. Forgot Password Request
router.post(
  '/forgot-password',
  forgotPasswordRateLimiter,
  validateBody(forgotPasswordSchema),
  superAdminAuthController.forgotPassword
);

// 8. Reset Password with Token
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  superAdminAuthController.resetPassword
);

export default router;
