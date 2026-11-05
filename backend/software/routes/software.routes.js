/**
 * @file software.routes.js
 * @description Dedicated Multi-Tenant Software SaaS Routes under /api/v1/kashi/software/*
 * @module backend/src/modules/software/routes/software.routes
 */

import { Router } from 'express';
import { softwareController } from '../controllers/software.controller.js';
import { groceryController } from '../grocery/grocery.controller.js';
import { instituteController } from '../institute/institute.controller.js';
import { electronicsController } from '../electronics/electronics.controller.js';
import { boutiqueController } from '../boutique/boutique.controller.js';

const router = Router();

// Master software suite overview & verticals catalog
router.get('/overview', softwareController.listVerticals);
router.get('/verticals', softwareController.listVerticals);
router.get('/verticals/:id', softwareController.getVerticalDetails);

// Grocery & Supermarket Cloud POS
router.get('/grocery/inventory', groceryController.getInventory);
router.post('/grocery/scan-barcode', groceryController.scanBarcode);

// Computer Institute & Academy LMS
router.get('/institute/batches', instituteController.getBatches);
router.post('/institute/issue-certificate', instituteController.issueCertificate);

// Electronics & Mobile Repair ERP
router.get('/electronics/job-cards', electronicsController.getJobCards);
router.post('/electronics/track-warranty', electronicsController.trackImeiWarranty);

// Designer Boutique & Custom Tailoring ERP
router.get('/boutique/orders', boutiqueController.getOrders);
router.post('/boutique/update-status', boutiqueController.updateGarmentStatus);

export default router;
