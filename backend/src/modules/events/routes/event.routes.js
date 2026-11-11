/**
 * @file event.routes.js
 * @description Event Planning & Operations Routes under /api/v1/kashi/events/*
 * @module backend/src/modules/kashi-service/event-services/routes/event.routes
 */

import { Router } from 'express';
import { eventController } from '../controllers/event.controller.js';

const router = Router();

router.get('/', eventController.listEvents);
router.get('/:eventId', eventController.getEventById);
router.post('/book', eventController.createEventBooking);
router.post('/scan-qr', eventController.scanQrPass);

export default router;

