/**
 * @file guest.routes.js
 * @description Guest Access & Booking Routes under /api/v1/guest/*
 * @module backend/src/routes/guest.routes
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import guestCtrl from '../modules/guest/guest.controller.js';

const router = Router();

// Apply Tenant Resolution to all guest routes
router.use(tenantResolverMiddleware);

// Guest Catalog Browsing
router.get('/business', guestCtrl.getGuestBusiness);
router.get('/branches', guestCtrl.getGuestBranches);
router.get('/services', guestCtrl.getGuestServices);
router.get('/services/:id', guestCtrl.getGuestServiceById);
router.get('/packages', guestCtrl.getGuestPackages);
router.get('/packages/:id', guestCtrl.getGuestPackageById);
router.get('/offers', guestCtrl.getGuestOffers);
router.get('/offers/:id', guestCtrl.getGuestOfferById);
router.get('/staff', guestCtrl.getGuestStaff);
router.get('/staff/:id', guestCtrl.getGuestStaffById);
router.get('/availability', guestCtrl.getGuestAvailability);
router.get('/working-hours', guestCtrl.getGuestWorkingHours);

// Guest Booking
router.post('/book', guestCtrl.createGuestBooking);
router.post('/bookings', guestCtrl.createGuestBooking);

export default router;
