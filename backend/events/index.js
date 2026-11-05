/**
 * @file index.js
 * @description Master Modular Monolith Entrypoint for Event Services Suite.
 * @module backend/events
 */

import { eventController } from './controllers/event.controller.js';
import eventRoutes from './routes/event.routes.js';

export {
  eventController,
  eventRoutes,
};

export default {
  name: 'events',
  version: '2.0.0',
  description: 'Enterprise Event Planning, Live QR Gate Tickets, Stages, Sound & Vendor Ledger Management Monolith',
  controller: eventController,
  routes: eventRoutes,
};

