/**
 * @file event.routes.js
 * @description Event Planning & Operations Routes under /api/v1/kashi/events/*
 * @module backend/src/modules/kashi-service/event-services/routes/event.routes
 */

import { Router } from 'express';
import { eventController } from '../controllers/event.controller.js';

const router = Router();

// Event Catalog & Packages CRUD (Supports Body Payload)
router.post('/catalog/filter', eventController.listCatalog);
router.get('/catalog', eventController.listCatalog);
router.get('/catalog/:id', eventController.getCatalogById);
router.post('/catalog', eventController.createCatalogItem);
router.put('/catalog/:id', eventController.updateCatalogItem);
router.patch('/catalog/:id', eventController.updateCatalogItem);
router.delete('/catalog/:id', eventController.deleteCatalogItem);
router.patch('/catalog/:id/status', eventController.toggleCatalogStatus);

// Event Productions & Bookings
router.get('/', eventController.listEvents);
router.get('/:eventId', eventController.getEventById);
router.post('/book', eventController.createEventBooking);
router.post('/scan-qr', eventController.scanQrPass);

export default router;

