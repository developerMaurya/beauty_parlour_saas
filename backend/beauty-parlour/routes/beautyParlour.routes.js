/**
 * @file beautyParlour.routes.js
 * @description Dedicated Beauty Parlour SaaS Routes under /api/v1/kashi/beauty-parlour/*
 * @module backend/src/modules/kashi-service/beauty-parlour/routes/beautyParlour.routes
 */

import { Router } from 'express';
import { beautyParlourController } from '../controllers/beautyParlour.controller.js';

const router = Router();

router.get('/overview', beautyParlourController.getOverview);

export default router;

