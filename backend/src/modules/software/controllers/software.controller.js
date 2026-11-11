/**
 * @file software.controller.js
 * @description Multi-Tenant SaaS Software Verticals (Beauty Parlour, Grocery, Institute, Electronics, Boutique).
 * @module backend/src/modules/kashi-service/software-services/controllers/software.controller
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

const SOFTWARE_VERTICALS = [
  {
    id: 'beauty-parlour',
    title: 'Beauty Parlour & Luxury Salon SaaS',
    icon: '💄',
    badge: 'Production Ready',
    status: 'ACTIVE_PRODUCTION',
    modulesIncluded: ['Admin Dashboard', 'Live GPS Staff Radar', 'Biometric Punch Clock', 'Academy LMS', 'POS Billing & GST', 'Doorstep Home Service'],
    demoSlug: 'blossom-salon',
    demoUrl: '/site/blossom-salon',
    adminLoginUrl: '/admin/login?tenant=blossom-salon',
    description: 'Enterprise beauty & wellness management platform with multi-branch support, live GPS tracking, and academy certifications.',
  },
  {
    id: 'grocery-shop',
    title: 'Grocery & Supermarket Cloud POS',
    icon: '🛒',
    badge: 'Module Available',
    status: 'ACTIVE_MODULE',
    modulesIncluded: ['Barcode Scanner API', 'Batch Expiry Alerts', 'Weighing Scale Integration', 'Doorstep Grocery App', 'Inventory Reorder Alerts'],
    demoSlug: 'kashi-fresh',
    demoUrl: '/site/blossom-salon',
    adminLoginUrl: '/admin/login',
    description: 'Cloud point-of-sale for retail supermarkets with fast billing, purchase orders, and supplier accounting.',
  },
  {
    id: 'computer-institute',
    title: 'Computer Institute & Academy Management',
    icon: '🎓',
    badge: 'Production Ready',
    status: 'ACTIVE_PRODUCTION',
    modulesIncluded: ['Student Admissions & KYC', 'Batch Timetable Scheduler', 'Online Exam & Grading', 'Auto PDF Certificates', 'Fee Installment Ledger'],
    demoSlug: 'glamour-academy',
    demoUrl: '/site/glamour-academy',
    adminLoginUrl: '/admin/login?tenant=glamour-academy',
    description: 'Complete training center operating system with student portals, fee receipts, digital certificate generator, and grade reports.',
  },
  {
    id: 'electronic-shop',
    title: 'Electronic & Mobile Repair Shop ERP',
    icon: '📱',
    badge: 'Module Available',
    status: 'ACTIVE_MODULE',
    modulesIncluded: ['IMEI & Serial Number Tracker', 'Repair Job Sheets & Status SMS', 'Technician Commission Matrix', 'Spare Parts Inventory', 'Warranty Cards'],
    demoSlug: 'tech-zone',
    demoUrl: '/site/blossom-salon',
    adminLoginUrl: '/admin/login',
    description: 'Service center and retail electronic store management with job card dispatch and warranty management.',
  },
  {
    id: 'boutique-studio',
    title: 'Boutique & Designer Studio Management',
    icon: '✂️',
    badge: 'Module Available',
    status: 'ACTIVE_MODULE',
    modulesIncluded: ['Custom Client Measurements Ledger', 'Fabric & Tailor Stage Tracking', 'Trial Fitting Appointments', 'Embroidery Artisan Allocation', 'Designer Invoicing'],
    demoSlug: 'couture-studio',
    demoUrl: '/site/blossom-salon',
    adminLoginUrl: '/admin/login',
    description: 'Fashion designer ERP managing custom stitching orders, fitting appointments, and artisan payouts.',
  },
];

export const softwareController = {
  /**
   * GET /api/v1/kashi/software/verticals
   */
  async listVerticals(_req, res) {
    try {
      return sendSuccess(res, 'Software SaaS verticals retrieved', {
        total: SOFTWARE_VERTICALS.length,
        verticals: SOFTWARE_VERTICALS,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * GET /api/v1/kashi/software/verticals/:id
   */
  async getVerticalDetails(req, res) {
    try {
      const { id } = req.params;
      const found = SOFTWARE_VERTICALS.find((v) => v.id === id);
      if (!found) return sendError(res, 'Vertical not found', [], 404);
      return sendSuccess(res, `Details for ${found.title}`, found);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};

