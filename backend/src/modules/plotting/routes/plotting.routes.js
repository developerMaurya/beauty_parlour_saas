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

// ── Plot CRUD Endpoints ──
router.get('/plots', plottingController.listPlots);
router.post('/plots', plottingController.createPlot);
router.put('/plots/:plotId', plottingController.updatePlot);
router.delete('/plots/:plotId', plottingController.deletePlot);

// ── Plot Inquiries & Requests Endpoints ──
router.get('/inquiries', plottingController.listInquiries);
router.post('/inquiries', plottingController.createInquiry);
router.put('/inquiries/:inquiryId', plottingController.updateInquiry);
router.delete('/inquiries/:inquiryId', plottingController.deleteInquiry);

// ── Plot Media & Gallery Endpoints ──
router.get('/gallery', plottingController.listGallery);
router.post('/gallery', plottingController.createGalleryItem);
router.delete('/gallery/:galleryId', plottingController.deleteGalleryItem);

export default router;

