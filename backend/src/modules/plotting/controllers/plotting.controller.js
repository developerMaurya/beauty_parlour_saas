/**
 * @file plotting.controller.js
 * @description Real Estate Colony Masterplans, Plot Status & EMI Calculator Controller.
 * @module backend/src/modules/kashi-service/plotting-services/controllers/plotting.controller
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// Seeded Colony Layout with Plots
const COLONIES_DATABASE = [
  {
    id: 'colony_1',
    name: 'Kashi Green Valley City (Phase 1)',
    location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor, UP',
    totalPlots: 24,
    availablePlots: 14,
    bookedPlots: 6,
    soldPlots: 4,
    pricePerSqYd: 14500,
    reraRegistration: 'UPRERAAGT2026/89412',
    approvedBy: 'Varanasi Development Authority (VDA Compliant)',
    plots: [
      { number: '101', sizeSqYd: 150, dimensions: '30x45 ft', facing: 'East', price: 2175000, status: 'AVAILABLE', tokenAmount: 51000 },
      { number: '102', sizeSqYd: 150, dimensions: '30x45 ft', facing: 'East', price: 2175000, status: 'BOOKED', buyer: 'Sunil Pandey', tokenAmount: 51000 },
      { number: '103', sizeSqYd: 200, dimensions: '40x45 ft', facing: 'Park Facing Corner', price: 3100000, status: 'SOLD', buyer: 'Dr. Amit Tripathi', tokenAmount: 100000 },
      { number: '104', sizeSqYd: 120, dimensions: '25x43 ft', facing: 'North', price: 1740000, status: 'AVAILABLE', tokenAmount: 31000 },
      { number: '105', sizeSqYd: 120, dimensions: '25x43 ft', facing: 'North', price: 1740000, status: 'AVAILABLE', tokenAmount: 31000 },
      { number: '106', sizeSqYd: 250, dimensions: '50x45 ft', facing: 'Highway Frontage SCO', price: 4250000, status: 'AVAILABLE', tokenAmount: 100000 },
      { number: '107', sizeSqYd: 150, dimensions: '30x45 ft', facing: 'West', price: 2175000, status: 'BOOKED', buyer: 'Rameshwar Jha', tokenAmount: 51000 },
      { number: '108', sizeSqYd: 150, dimensions: '30x45 ft', facing: 'West', price: 2175000, status: 'AVAILABLE', tokenAmount: 51000 },
      { number: '109', sizeSqYd: 180, dimensions: '36x45 ft', facing: 'East Corner', price: 2610000, status: 'SOLD', buyer: 'Smt. Kavita Devi', tokenAmount: 51000 },
      { number: '110', sizeSqYd: 120, dimensions: '25x43 ft', facing: 'North', price: 1740000, status: 'AVAILABLE', tokenAmount: 31000 },
    ],
  },
  {
    id: 'colony_2',
    name: 'Ganga Enclave SCO Commercial Plaza',
    location: 'Ring Road Phase-2, Near Sarnath Junction, Varanasi',
    totalPlots: 12,
    availablePlots: 8,
    bookedPlots: 2,
    soldPlots: 2,
    pricePerSqYd: 28000,
    reraRegistration: 'UPRERACOM2026/41029',
    approvedBy: 'VDA High-Density Commercial Zone',
    plots: [
      { number: 'SCO-1', sizeSqYd: 200, dimensions: '40x45 ft', facing: 'Main 80ft Boulevard', price: 5600000, status: 'AVAILABLE', tokenAmount: 150000 },
      { number: 'SCO-2', sizeSqYd: 200, dimensions: '40x45 ft', facing: 'Main 80ft Boulevard', price: 5600000, status: 'SOLD', buyer: 'Kashi Retailers LLP', tokenAmount: 200000 },
      { number: 'SCO-3', sizeSqYd: 300, dimensions: '60x45 ft', facing: 'Corner Boulevard', price: 8400000, status: 'AVAILABLE', tokenAmount: 250000 },
    ],
  },
];

export const plottingController = {
  /**
   * GET /api/v1/kashi/plotting/colonies
   */
  async listColonies(_req, res) {
    try {
      return sendSuccess(res, 'Colony masterplans list retrieved', {
        total: COLONIES_DATABASE.length,
        colonies: COLONIES_DATABASE,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * GET /api/v1/kashi/plotting/colonies/:colonyId
   */
  async getColonyById(req, res) {
    try {
      const { colonyId } = req.params;
      const found = COLONIES_DATABASE.find((c) => c.id === colonyId);
      if (!found) return sendError(res, 'Colony not found', [], 404);
      return sendSuccess(res, 'Colony details retrieved', found);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/plotting/calculate-emi
   * Real Estate EMI calculator
   */
  async calculateEmi(req, res) {
    try {
      const { totalAmount, downPayment = 0, tenureMonths = 24, annualInterestRate = 9.5 } = req.body;
      const principal = Math.max(0, Number(totalAmount) - Number(downPayment));
      const monthlyRate = (Number(annualInterestRate) / 100) / 12;
      const n = Number(tenureMonths) || 24;

      let monthlyEmi = 0;
      if (monthlyRate > 0 && n > 0 && principal > 0) {
        monthlyEmi = Math.round(
          (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
        );
      } else {
        monthlyEmi = Math.round(principal / n);
      }

      const totalPayable = (monthlyEmi * n) + Number(downPayment);
      const totalInterest = totalPayable - Number(totalAmount);

      return sendSuccess(res, 'EMI calculation completed', {
        totalPlotPrice: Number(totalAmount),
        downPayment: Number(downPayment),
        loanPrincipal: principal,
        tenureMonths: n,
        interestRate: Number(annualInterestRate),
        monthlyEmi,
        totalInterest: Math.max(0, totalInterest),
        totalPayable,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/plotting/book-plot
   */
  async bookPlot(req, res) {
    try {
      const { colonyId, plotNumber, buyerName, buyerPhone, tokenPaid } = req.body;
      if (!plotNumber || !buyerName || !buyerPhone) {
        return sendError(res, 'Plot number, buyer name, and phone are required', [], 400);
      }

      const colony = COLONIES_DATABASE.find((c) => c.id === colonyId) || COLONIES_DATABASE[0];
      const plot = colony.plots.find((p) => p.number === plotNumber);

      if (plot) {
        plot.status = 'BOOKED';
        plot.buyer = buyerName;
        colony.availablePlots = Math.max(0, colony.availablePlots - 1);
        colony.bookedPlots = (colony.bookedPlots || 0) + 1;
      }

      const bookingReceipt = {
        bookingId: `PLT_BKG_${Date.now()}`,
        colonyName: colony.name,
        plotNumber,
        buyerName,
        buyerPhone,
        tokenPaid: Number(tokenPaid) || plot?.tokenAmount || 51000,
        bookingDate: new Date().toISOString(),
        paymentMode: 'UPI_ONLINE_TRANSFER',
        nextStep: 'Registry legal document verification within 15 days',
      };

      return sendSuccess(res, `Plot ${plotNumber} at ${colony.name} successfully booked for ${buyerName}!`, bookingReceipt, 201);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};

