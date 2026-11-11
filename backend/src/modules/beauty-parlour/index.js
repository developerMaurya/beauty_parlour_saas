/**
 * @file index.js
 * @description Master Modular Monolith Entrypoint for Beauty Parlour SaaS Suite.
 * @module backend/beauty-parlour
 */

import { beautyParlourController } from './controllers/beautyParlour.controller.js';
import beautyParlourRoutes from './routes/beautyParlour.routes.js';

export {
  beautyParlourController,
  beautyParlourRoutes,
};

export default {
  name: 'beauty-parlour',
  version: '2.0.0',
  description: 'Enterprise Beauty Parlour, Salon & Luxury Spa Management Monolith',
  controller: beautyParlourController,
  routes: beautyParlourRoutes,
};

