/**
 * @file index.js
 * @description Master Modular Monolith Entrypoint for Rent & Asset Leasing Services Suite.
 * @module backend/rent
 */

import { rentController } from './controllers/rent.controller.js';
import rentRoutes from './routes/rent.routes.js';

export {
  rentController,
  rentRoutes,
};

export default {
  name: 'rent',
  version: '2.0.0',
  description: 'Enterprise Rental Properties, Heavy Machinery, Lease Agreements & Auto-UPI Invoicing Monolith',
  controller: rentController,
  routes: rentRoutes,
};

