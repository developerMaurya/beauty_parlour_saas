/**
 * @file beautyParlour.controller.js
 * @description Dedicated Beauty Parlour & Luxury Salon SaaS Module Controller.
 * @module backend/src/modules/kashi-service/beauty-parlour/controllers/beautyParlour.controller
 */

import { sendSuccess, sendError } from '../../src/utils/response.utils.js';

export const beautyParlourController = {
  /**
   * GET /api/v1/kashi/beauty-parlour/overview
   */
  async getOverview(_req, res) {
    try {
      return sendSuccess(res, 'Beauty parlour module overview retrieved', {
        name: 'Beauty Parlour & Salon Enterprise Cloud SaaS',
        version: '2.4.0',
        activeTenantsCount: 3,
        primaryFeatures: [
          { name: 'Google Satellite GPS Staff Radar', status: 'ACTIVE', icon: '🛰️', desc: 'Real-time checked-in, checked-out, and on-leave radar tracking' },
          { name: 'Doorstep Home Service Dispatch', status: 'ACTIVE', icon: '🚗', desc: 'Real-time specialist route polyline, distance, and ETA countdown' },
          { name: 'Multi-Branch Salon Operations', status: 'ACTIVE', icon: '🏢', desc: 'Centralized control for Flagship, Cyber City, and South Extension sanctuaries' },
          { name: 'Cosmetology Academy LMS', status: 'ACTIVE', icon: '🎓', desc: 'Admissions, student batches, training plans, and auto PDF certificates' },
          { name: 'POS Billing & GST Split Invoicing', status: 'ACTIVE', icon: '💳', desc: 'UPI QR codes, cash, cards, split payments, and customer loyalty wallets' },
          { name: 'Dynamic Service & Package Catalog', status: 'ACTIVE', icon: '✂️', desc: 'Variants, add-ons, features, and staff product assignment' },
        ],
        seededDemoTenants: [
          { slug: 'blossom-salon', name: 'Blossom Luxury Salon & Spa (Flagship)', demoUrl: '/site/blossom-salon', adminUrl: '/admin/login?tenant=blossom-salon' },
          { slug: 'glamour-academy', name: 'Glamour Cosmetology Academy & Salon', demoUrl: '/site/glamour-academy', adminUrl: '/admin/login?tenant=glamour-academy' },
          { slug: 'serene-spa', name: 'Serene Aesthetic Wellness Retreat', demoUrl: '/site/serene-spa', adminUrl: '/admin/login?tenant=serene-spa' },
        ],
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};

