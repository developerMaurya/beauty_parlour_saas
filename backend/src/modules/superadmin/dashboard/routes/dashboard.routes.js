/**
 * @file dashboard.routes.js
 * @description Super Admin Dashboard routes.
 * @module backend/src/modules/superadmin/dashboard/routes/dashboard.routes
 */

import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import {
  authenticateAccessToken,
  requireSuperAdmin,
} from '../../../auth/middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateAccessToken, requireSuperAdmin);

router.get('/overview', dashboardController.getOverview);
router.get('/revenue', dashboardController.getRevenueReports);
router.get('/tenant-growth', dashboardController.getTenantGrowth);
router.get('/subscription-stats', dashboardController.getSubscriptionStats);
router.get('/plan-distribution', dashboardController.getPlanDistribution);
router.get('/recent-activities', dashboardController.getRecentActivities);
router.get('/expiring-subscriptions', dashboardController.getExpiringSubscriptions);

export default router;
