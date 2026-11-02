/**
 * @file public.routes.js
 * @description Customer-facing Public Website & Booking Routes under /api/v1/public/*
 * @module backend/src/routes/public.routes
 */

import { Router } from 'express';
import { tenantResolverMiddleware } from '../middleware/tenant-resolver.middleware.js';
import publicCtrl from '../modules/public/public.controller.js';
import aptCtrl from '../modules/admin/appointments/appointment.controller.js';

const router = Router();

// Apply Tenant Resolution to all public routes
router.use(tenantResolverMiddleware);

router.get('/business', publicCtrl.getPublicBusiness);
router.get('/branches', publicCtrl.getPublicBranches);
router.get('/services', publicCtrl.getPublicServices);
router.get('/service-categories', publicCtrl.getPublicServiceCategories);
router.get('/packages', publicCtrl.getPublicPackages);
router.get('/offers', publicCtrl.getPublicOffers);
router.get('/staff', publicCtrl.getPublicStaff);
router.get('/working-hours', publicCtrl.getPublicWorkingHours);
router.get('/website', publicCtrl.getPublicWebsite);
router.get('/gallery', publicCtrl.getPublicGallery);
router.get('/testimonials', publicCtrl.getPublicTestimonials);
router.get('/faqs', publicCtrl.getPublicFaqs);

// Availability
router.get('/availability', aptCtrl.getGeneralAvailability);
router.get('/booking/availability', aptCtrl.getGeneralAvailability);
router.get('/booking/services', publicCtrl.getPublicServices);
router.get('/booking/packages', publicCtrl.getPublicPackages);

// Public Booking
router.post('/bookings', publicCtrl.createPublicBooking);

export default router;
