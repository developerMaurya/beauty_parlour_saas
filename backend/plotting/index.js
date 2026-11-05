/**
 * @file index.js
 * @description Master Modular Monolith Entrypoint for Real Estate & Colony Plotting Suite.
 * @module backend/plotting
 */

import { plottingController } from './controllers/plotting.controller.js';
import plottingRoutes from './routes/plotting.routes.js';

export {
  plottingController,
  plottingRoutes,
};

export default {
  name: 'plotting',
  version: '2.0.0',
  description: 'Enterprise Real Estate Plot Inventory, Interactive SVG Masterplan, Token Booking & EMI Ledger Monolith',
  controller: plottingController,
  routes: plottingRoutes,
};

