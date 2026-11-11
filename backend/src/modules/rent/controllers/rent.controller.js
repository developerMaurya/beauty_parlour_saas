/**
 * @file rent.controller.js
 * @description Property Leases, Equipment Staging, Monthly Invoicing & Rental Management.
 * @module backend/src/modules/kashi-service/rent-services/controllers/rent.controller
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// Seeded Rental Assets & Active Leases
const RENTALS_DATABASE = [
  {
    id: 'rent_prop_1',
    name: 'Prime Commercial Corner Shop (Ground Floor)',
    category: 'COMMERCIAL_PROPERTY',
    location: 'Bhadohi Road, Lahartara Junction, Varanasi',
    monthlyRent: 35000,
    securityDeposit: 105000,
    sizeSqFt: 650,
    status: 'ACTIVE_LEASE',
    currentTenant: {
      name: 'Vikas Agarwal (M/s Agarwal Medical Store)',
      phone: '+91 98765 22114',
      leaseStart: '2025-04-01',
      leaseEnd: '2028-03-31',
      lastPaidMonth: 'October 2026',
      currentMonthStatus: 'PAID', // 'PAID' | 'DUE' | 'OVERDUE'
    },
    features: ['3-Phase Commercial Power (10 KW)', 'Vitreous Vitrified Flooring', 'Rolling Shutter + Glass Glazing'],
  },
  {
    id: 'rent_prop_2',
    name: 'Luxury 3BHK Gated Apartment (Semi-Furnished)',
    category: 'RESIDENTIAL_FLAT',
    location: 'Ganga Heights Tower-B, Sigra, Varanasi',
    monthlyRent: 28000,
    securityDeposit: 56000,
    sizeSqFt: 1850,
    status: 'AVAILABLE_FOR_RENT',
    features: ['Modular Kitchen with Chimney', 'Covered Car Stilt Parking', '24x7 Power Backup & Lift'],
  },
  {
    id: 'rent_gear_1',
    name: 'Silent Silent Diesel Generator (125 KVA)',
    category: 'HEAVY_EQUIPMENT',
    dailyRent: 8500,
    monthlyRent: 65000,
    securityDeposit: 30000,
    status: 'AVAILABLE_FOR_RENT',
    features: ['Soundproof Acoustic Canopy', 'Digital Auto-Mains Failure Panel', 'Includes In-Transit Mobile Trolley'],
  },
  {
    id: 'rent_bridal_1',
    name: 'Sabyasachi Heritage Crimson Velvet Bridal Lehenga',
    category: 'BRIDAL_COUTURE',
    rentalPeriodDays: 4,
    rentalFee: 18000,
    securityDeposit: 30000,
    status: 'BOOKED_FOR_EVENT',
    currentTenant: {
      name: 'Pooja Tandon (Wedding Booking)',
      phone: '+91 98765 88990',
      dispatchDate: '2026-11-26',
      returnDate: '2026-11-30',
      currentMonthStatus: 'PAID',
    },
    features: ['Zardozi Gold Hand-Embroidered', 'Includes Matching Veil & Dupatta', 'Dry Cleaned & Sanitized Seal'],
  },
];

export const rentController = {
  /**
   * GET /api/v1/kashi/rent/assets
   */
  async listRentalAssets(_req, res) {
    try {
      return sendSuccess(res, 'Rental properties and assets retrieved', {
        total: RENTALS_DATABASE.length,
        assets: RENTALS_DATABASE,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * GET /api/v1/kashi/rent/assets/:assetId
   */
  async getAssetById(req, res) {
    try {
      const { assetId } = req.params;
      const found = RENTALS_DATABASE.find((r) => r.id === assetId);
      if (!found) return sendError(res, 'Rental asset not found', [], 404);
      return sendSuccess(res, 'Rental asset details retrieved', found);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/rent/generate-invoice
   */
  async generateMonthlyInvoice(req, res) {
    try {
      const { assetId, monthYear = 'November 2026' } = req.body;
      const asset = RENTALS_DATABASE.find((r) => r.id === assetId) || RENTALS_DATABASE[0];

      const invoice = {
        invoiceNumber: `INV-RENT-${Date.now().toString().slice(-6)}`,
        assetName: asset.name,
        tenantName: asset.currentTenant?.name || 'Walk-in Tenant',
        tenantPhone: asset.currentTenant?.phone || '+91 98765 00000',
        billingPeriod: monthYear,
        rentAmount: asset.monthlyRent || 25000,
        maintenanceCharges: 1500,
        gst18Percent: Math.round((asset.monthlyRent || 25000) * 0.18),
        totalPayable: (asset.monthlyRent || 25000) + 1500 + Math.round((asset.monthlyRent || 25000) * 0.18),
        dueDate: '07-Nov-2026',
        upiPaymentLink: `upi://pay?pa=kashiservice@upi&pn=KashiRentals&am=${(asset.monthlyRent || 25000) + 1500}&cu=INR`,
        whatsappReminderText: `Namaste! Monthly rent for ${asset.name} (${monthYear}) of Rs. ${(asset.monthlyRent || 25000).toLocaleString()} is generated. Kindly pay before 7th Nov.`,
      };

      return sendSuccess(res, `Rent invoice for ${monthYear} generated successfully`, invoice);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/rent/book
   */
  async bookRental(req, res) {
    try {
      const { assetId, tenantName, tenantPhone, startDate, durationMonths = 11 } = req.body;
      if (!tenantName || !tenantPhone) {
        return sendError(res, 'Tenant name and phone are required', [], 400);
      }

      const asset = RENTALS_DATABASE.find((r) => r.id === assetId) || RENTALS_DATABASE[1];
      asset.status = 'ACTIVE_LEASE';
      asset.currentTenant = {
        name: tenantName,
        phone: tenantPhone,
        leaseStart: startDate || new Date().toISOString().split('T')[0],
        leaseEnd: new Date(Date.now() + Number(durationMonths) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastPaidMonth: 'Initial Advance Logged',
        currentMonthStatus: 'PAID',
      };

      return sendSuccess(res, `Rental lease initiated for ${tenantName}!`, {
        assetName: asset.name,
        monthlyRent: asset.monthlyRent,
        securityDeposit: asset.securityDeposit,
        status: 'LEASE_DOCUMENT_DISPATCHED',
      }, 201);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};

