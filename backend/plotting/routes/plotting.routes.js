/**
 * @file plotting.routes.js
 * @description Real Estate Colony Masterplan & Plot Booking Routes under /api/v1/kashi/plotting/*
 * @module backend/src/modules/kashi-service/plotting-services/routes/plotting.routes
 */

import { Router } from 'express';
import { plottingController } from '../controllers/plotting.controller.js';

const router = Router();

router.get('/colonies', plottingController.listColonies);
router.get('/colonies/:colonyId', plottingController.getColonyById);
router.post('/calculate-emi', plottingController.calculateEmi);
router.post('/book-plot', plottingController.bookPlot);

export default router;

