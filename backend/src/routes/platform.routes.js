/**
 * @file platform.routes.js
 * @description Master Platform & Service Marketplace Routes.
 * Mounts under /api/v1/platform/* and /api/v1/kashi/*
 * @module backend/src/routes/platform.routes
 */

import { Router } from 'express';
import multer from 'multer';
import { kashiPlatformController as platformController } from '../controllers/platform.controller.js';
import eventRoutes from '../modules/events/routes/event.routes.js';
import plottingRoutes from '../modules/plotting/routes/plotting.routes.js';
import rentRoutes from '../modules/rent/routes/rent.routes.js';
import softwareRoutes from '../modules/software/routes/software.routes.js';
import beautyParlourRoutes from '../modules/beauty-parlour/routes/beautyParlour.routes.js';

// In-Memory Multer storage: NEVER writes files to disk/project folders
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: Images (PNG, JPG, WebP) and PDF documents`), false);
    }
  },
});

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

// ── Complete 01-07 Customer Journey Endpoints ──
router.post('/upload', memoryUpload.single('file'), platformController.uploadFile);
router.post('/auth/send-otp', platformController.sendOtp);
router.post('/auth/verify-otp', platformController.verifyOtp);
router.post('/onboarding/check-subdomain', platformController.checkSubdomainAvailability);
router.post('/onboarding/demo-request', platformController.submitDemoRequest);
router.post('/onboarding/complete-journey', platformController.completeCustomerJourney);

// ── Tenant Self-Registration & 14-Day Free Trial Provisioning ──
router.post('/onboarding/register', platformController.registerTenant);
router.post('/register', platformController.registerTenant);

// ── Live Seeded Demo Tenants Discovery ──
router.get('/demo-tenants', platformController.getDemoTenants);

export default router;

