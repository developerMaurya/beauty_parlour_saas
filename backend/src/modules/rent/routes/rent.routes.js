/**
 * @file rent.routes.js
 * @description Property Leases & Rental Asset Routes under /api/v1/kashi/rent/*
 * @module backend/src/modules/kashi-service/rent-services/routes/rent.routes
 */

import { Router } from 'express';
import { rentController } from '../controllers/rent.controller.js';
import { rentalFloorsController } from '../controllers/rentalFloors.controller.js';

const router = Router();

// ── Building Floors Master ──
router.get('/floors', rentalFloorsController.listFloors);
router.post('/floors', rentalFloorsController.createFloor);

// ── Commercial Halls & Spaces (Length x Width x Height) ──
router.get('/halls', rentalFloorsController.listHalls);
router.post('/halls', rentalFloorsController.createHall);
router.delete('/halls/:id', rentalFloorsController.deleteHall);

// ── Residential House Range, Advance & Electricity Ledger ──
router.get('/residential-rentals', rentalFloorsController.listResidentialRentals);
router.post('/residential-rentals', rentalFloorsController.createResidentialRental);
router.post('/residential-rentals/:id/payment', rentalFloorsController.recordMonthlyPayment);

// ── Legacy Assets & Bookings ──
router.get('/assets', rentController.listRentalAssets);
router.get('/assets/:assetId', rentController.getAssetById);
router.post('/generate-invoice', rentController.generateMonthlyInvoice);
router.post('/book', rentController.bookRental);

export default router;

