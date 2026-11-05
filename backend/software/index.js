/**
 * @file index.js
 * @description Master Modular Monolith Entrypoint for Software SaaS Suite (Grocery, Institute, Electronics, Boutique).
 * @module backend/software
 */

import { softwareController } from './controllers/software.controller.js';
import softwareRoutes from './routes/software.routes.js';
import { groceryController } from './grocery/grocery.controller.js';
import { instituteController } from './institute/institute.controller.js';
import { electronicsController } from './electronics/electronics.controller.js';
import { boutiqueController } from './boutique/boutique.controller.js';

export {
  softwareController,
  softwareRoutes,
  groceryController,
  instituteController,
  electronicsController,
  boutiqueController,
};

export default {
  name: 'software',
  version: '2.0.0',
  description: 'Enterprise Cloud Software Suite: Grocery POS, Computer Institute LMS, Electronics Repair ERP, Designer Boutique',
  verticals: {
    grocery: groceryController,
    institute: instituteController,
    electronics: electronicsController,
    boutique: boutiqueController,
  },
  controller: softwareController,
  routes: softwareRoutes,
};
