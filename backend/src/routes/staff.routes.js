/**
 * @file staff.routes.js
 * @description Staff Field & Home-Service Mobile Operations Router under /api/v1/staff/*
 * @module backend/src/routes/staff.routes
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import { authenticateTenantUser, requireRoles } from '../middleware/tenant-admin-auth.middleware.js';
import homeCtrl from '../modules/admin/homeServices/homeService.controller.js';

const router = Router();

router.use(tenantResolverMiddleware);
router.use(authenticateTenantUser);
router.use(requireRoles('STAFF', 'ADMIN'));

router.get('/home-services', homeCtrl.getStaffHomeServices);
router.get('/home-services/:appointmentId', homeCtrl.getHomeServiceStatus);

// Staff journey actions
router.post('/home-services/:appointmentId/accept', homeCtrl.staffAccept);
router.post('/home-services/:appointmentId/reject', homeCtrl.staffReject);
router.post('/home-services/:appointmentId/on-the-way', homeCtrl.staffOnTheWay);
router.post('/home-services/:appointmentId/arrived', homeCtrl.staffArrived);
router.post('/home-services/:appointmentId/start', homeCtrl.staffStart);
router.post('/home-services/:appointmentId/pause', homeCtrl.staffPause);
router.post('/home-services/:appointmentId/resume', homeCtrl.staffResume);
router.post('/home-services/:appointmentId/complete', homeCtrl.staffComplete);
router.post('/home-services/:appointmentId/depart', homeCtrl.staffDepart);

export default router;
