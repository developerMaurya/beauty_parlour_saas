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

const router = Router();

// Mount common utility and health check routes
router.use('/common', commonRoutes);

// Mount SuperAdmin portal routes
router.use('/superadmin', superadminRoutes);

// Mount Tenant Admin system routes
router.use('/admin', adminRoutes);

// Mount Customer Public portal & booking routes
router.use('/public', publicRoutes);

// Mount Staff field & mobile routes
router.use('/staff', staffRoutes);

// Mount Customer live tracking routes
router.use('/customer', customerRoutes);

export default router;
