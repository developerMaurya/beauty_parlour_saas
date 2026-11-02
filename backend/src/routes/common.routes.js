/**
 * @file common.routes.js
 * @description System health and utility routes.
 * @module backend/src/routes/common.routes
 */

import { Router } from 'express';
import { checkCentralDBHealth } from '../database/central/central.health.js';
import { sendSuccess } from '../utils/response.utils.js';

const router = Router();

router.get('/health', (_req, res) => {
  return sendSuccess(res, 'System operational', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: checkCentralDBHealth(),
  });
});

export default router;
