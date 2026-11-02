/**
 * @file customer.routes.js
 * @description Customer Live Tracking Routes under /api/v1/customer/*
 * @module backend/src/routes/customer.routes
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import homeCtrl from '../modules/admin/homeServices/homeService.controller.js';

const router = Router();

router.use(tenantResolverMiddleware);

router.get('/home-services/:appointmentId', homeCtrl.getCustomerHomeServiceTracking);
router.get('/home-services/:appointmentId/tracking', homeCtrl.getCustomerHomeServiceTracking);
router.get('/home-services/:appointmentId/status', homeCtrl.getCustomerHomeServiceTracking);

export default router;
