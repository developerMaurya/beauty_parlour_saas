/**
 * @file platform.routes.js
 * @description Master Platform & Service Marketplace Routes.
 * Mounts under /api/v1/platform/* and /api/v1/kashi/*
 * @module backend/src/routes/platform.routes
 */

import { Router } from 'express';
import { kashiPlatformController as platformController } from '../controllers/platform.controller.js';
import eventRoutes from '../modules/events/routes/event.routes.js';
import plottingRoutes from '../modules/plotting/routes/plotting.routes.js';
import rentRoutes from '../modules/rent/routes/rent.routes.js';
import softwareRoutes from '../modules/software/routes/software.routes.js';
import beautyParlourRoutes from '../modules/beauty-parlour/routes/beautyParlour.routes.js';

const router = Router();

// ── 5 Modular Verticals ──
router.use('/events', eventRoutes);
router.use('/plotting', plottingRoutes);
router.use('/rent', rentRoutes);
router.use('/software', softwareRoutes);
router.use('/beauty-parlour', beautyParlourRoutes);

// ── Master Platform Services Catalog ──
router.get('/services', platformController.getServicesCatalog);
router.get('/services/:serviceId', platformController.getServiceDetails);

// ── Tenant Self-Registration & 14-Day Free Trial Provisioning ──
router.post('/onboarding/register', platformController.registerTenant);
router.post('/register', platformController.registerTenant);

// ── Live Seeded Demo Tenants Discovery ──
router.get('/demo-tenants', platformController.getDemoTenants);

export default router;

