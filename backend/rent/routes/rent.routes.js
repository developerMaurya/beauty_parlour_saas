/**
 * @file rent.routes.js
 * @description Property Leases & Rental Asset Routes under /api/v1/kashi/rent/*
 * @module backend/src/modules/kashi-service/rent-services/routes/rent.routes
 */

import { Router } from 'express';
import { rentController } from '../controllers/rent.controller.js';

const router = Router();

router.get('/assets', rentController.listRentalAssets);
router.get('/assets/:assetId', rentController.getAssetById);
router.post('/generate-invoice', rentController.generateMonthlyInvoice);
router.post('/book', rentController.bookRental);

export default router;

