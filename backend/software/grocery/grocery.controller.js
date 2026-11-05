/**
 * @file grocery.controller.js
 * @description Grocery & Supermarket POS Billing, Batch Expiry & Inventory Controller.
 * @module backend/software/grocery
 */

import { sendSuccess, sendError } from '../../src/utils/response.utils.js';

export const groceryController = {
  getInventory: async (req, res, next) => {
    try {
      return sendSuccess(res, [
        { id: 'GRC-001', name: 'Organic Basmati Rice 5kg', barcode: '8901030382910', stock: 120, unit: 'bags', expiryDate: '2027-06-30', price: 650 },
        { id: 'GRC-002', name: 'Aashirvaad Shudh Chakki Atta 10kg', barcode: '8901030382927', stock: 85, unit: 'bags', expiryDate: '2026-12-15', price: 440 },
        { id: 'GRC-003', name: 'Tata Tea Gold 500g', barcode: '8901030382934', stock: 210, unit: 'packets', expiryDate: '2027-04-10', price: 310 },
        { id: 'GRC-004', name: 'Amul Butter 500g', barcode: '8901030382941', stock: 45, unit: 'packs', expiryDate: '2026-11-28', price: 275 },
      ], 'Grocery inventory fetched');
    } catch (err) {
      next(err);
    }
  },

  scanBarcode: async (req, res, next) => {
    try {
      const { barcode } = req.body;
      return sendSuccess(res, {
        barcode,
        matched: true,
        productName: 'Organic Basmati Rice 5kg',
        mrp: 720,
        offerPrice: 650,
        taxPercent: 5,
        availableStock: 120,
      }, 'Barcode scanned successfully');
    } catch (err) {
      next(err);
    }
  },
};
