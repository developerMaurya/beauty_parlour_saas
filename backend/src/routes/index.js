/**
 * @file index.js
 * @description Master Router aggregating all API version 1 route slices.
 * @module backend/src/routes
 */

import { Router } from 'express';
import commonRoutes from './common.routes.js';
import superadminRoutes from './superadmin.routes.js';
import adminRoutes from './admin.routes.js';
import publicRoutes from './public.routes.js';
import staffRoutes from './staff.routes.js';
import customerRoutes from './customer.routes.js';
import studentRoutes from './student.routes.js';
import guestRoutes from './guest.routes.js';
import uploadRoutes from './upload.routes.js';
import platformRoutes from './platform.routes.js';
import beautyParlourRoutes from '../modules/beauty-parlour/routes/beautyParlour.routes.js';
import softwareRoutes from '../modules/software/routes/software.routes.js';
import eventRoutes from '../modules/events/routes/event.routes.js';
import plottingRoutes from '../modules/plotting/routes/plotting.routes.js';
import rentRoutes from '../modules/rent/routes/rent.routes.js';

const router = Router();

// ── Master Platform & Service Marketplace Routes ──
router.use('/platform', platformRoutes);
router.use('/kashi', platformRoutes); // Backwards-compatible alias

// ── 5 Direct Modular Monolith Vertical Routes ──
router.use('/beauty-parlour', beautyParlourRoutes);
router.use('/software', softwareRoutes);
router.use('/events', eventRoutes);
router.use('/plotting', plottingRoutes);
router.use('/rent', rentRoutes);

// ── Common utility and health check routes ──
router.use('/common', commonRoutes);

// ── Cloudflare Images Upload routes ──
router.use('/upload', uploadRoutes);

// ── SuperAdmin portal routes ──
router.use('/superadmin', superadminRoutes);

// ── Tenant Admin system routes ──
router.use('/admin', adminRoutes);

// ── Customer Public portal & booking routes ──
router.use('/public', publicRoutes);

// ── Guest portal & booking routes ──
router.use('/guest', guestRoutes);

// ── Staff field & mobile routes ──
router.use('/staff', staffRoutes);

// ── Customer live tracking routes ──
router.use('/customer', customerRoutes);

// ── Student Academy portal routes ──
router.use('/student', studentRoutes);

export default router;
