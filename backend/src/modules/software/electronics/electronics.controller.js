/**
 * @file electronics.controller.js
 * @description Electronics & Mobile Repair ERP Controller (IMEI Registry, Job Cards, Warranty Claims).
 * @module backend/software/electronics
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const electronicsController = {
  getJobCards: async (req, res, next) => {
    try {
      return sendSuccess(res, [
        { id: 'JOB-901', customerName: 'Vikram Malhotra', phone: '+91 98765 11223', device: 'Apple iPhone 15 Pro', issue: 'Cracked OLED & TrueDepth Sensor', status: 'IN_REPAIR', technician: 'Manoj Kumar', estimate: 14500 },
        { id: 'JOB-902', customerName: 'Anjali Gupta', phone: '+91 98111 22334', device: 'Samsung Galaxy S24 Ultra', issue: 'Motherboard IC Short / No Power', status: 'DIAGNOSED', technician: 'Praveen Singh', estimate: 8200 },
        { id: 'JOB-903', customerName: 'Rahul Verma', phone: '+91 98222 33445', device: 'Dell XPS 15 9520', issue: 'Cooling Fan Replacement & Thermal Paste', status: 'READY_FOR_PICKUP', technician: 'Manoj Kumar', estimate: 2400 },
      ], 'Electronics job cards fetched');
    } catch (err) {
      next(err);
    }
  },

  trackImeiWarranty: async (req, res, next) => {
    try {
      const { imei } = req.body;
      return sendSuccess(res, {
        imei: imei || '354892110293847',
        deviceModel: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
        soldDate: '2025-10-14',
        warrantyExpiry: '2026-10-13',
        status: 'UNDER_WARRANTY',
        serviceHistory: [
          { date: '2026-02-10', repairType: 'Speaker Grill Cleaning', cost: 0, warrantyCovered: true }
        ],
      }, 'IMEI warranty status fetched');
    } catch (err) {
      next(err);
    }
  },
};
