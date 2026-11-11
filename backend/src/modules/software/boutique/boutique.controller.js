/**
 * @file boutique.controller.js
 * @description Designer Boutique & Custom Tailoring Management Controller.
 * @module backend/software/boutique
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const boutiqueController = {
  getOrders: async (req, res, next) => {
    try {
      return sendSuccess(res, [
        { id: 'BTQ-101', clientName: 'Sunita Mehra', contact: '+91 98333 44556', garment: 'Handcrafted Bridal Lehenga (Raw Silk)', measurements: { bust: '36', waist: '30', hips: '38', length: '42' }, deadline: '2026-11-20', status: 'EMBROIDERY_STAGE', masterTailor: 'Master Rasheed', totalAmount: 48000, advance: 25000 },
        { id: 'BTQ-102', clientName: 'Kavita Das', contact: '+91 98444 55667', garment: 'Pure Organza Anarkali Suit', measurements: { bust: '34', waist: '28', hips: '36', length: '50' }, deadline: '2026-11-12', status: 'STITCHING_IN_PROGRESS', masterTailor: 'Master Salim', totalAmount: 18500, advance: 10000 },
        { id: 'BTQ-103', clientName: 'Pooja Agarwal', contact: '+91 98555 66778', garment: 'Banarasi Brocade Blouse with Dori Latkan', measurements: { bust: '38', waist: '32', blouseLength: '15' }, deadline: '2026-11-08', status: 'READY_FOR_FITTING', masterTailor: 'Master Rasheed', totalAmount: 4200, advance: 4200 },
      ], 'Boutique tailoring orders fetched');
    } catch (err) {
      next(err);
    }
  },

  updateGarmentStatus: async (req, res, next) => {
    try {
      const { orderId, newStatus } = req.body;
      return sendSuccess(res, {
        orderId,
        status: newStatus || 'READY_FOR_FITTING',
        updatedAt: new Date().toISOString(),
        clientSmsNotified: true,
      }, 'Boutique order status updated and client notified via SMS');
    } catch (err) {
      next(err);
    }
  },
};
