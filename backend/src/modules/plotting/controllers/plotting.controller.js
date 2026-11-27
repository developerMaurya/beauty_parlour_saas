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

// Master In-Memory Plots Inventory
let MASTER_PLOTS_DATABASE = [
  {
    id: 'plot_101',
    number: 'A-101',
    colonyId: 'colony_1',
    colonyName: 'Kashi Green Valley City (Phase 1)',
    location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor, UP',
    biswa: 1.5,
    sizeSqFt: 1350,
    ratePerBiswa: 1450000,
    grossPrice: 2175000,
    discount: 50000,
    price: 2125000,
    roadWidth: '30 Ft Wide Blacktop Road',
    dimensions: '30 × 45 ft',
    frontFt: 30,
    depthFt: 45,
    facing: 'East Facing (Vastu Compliant)',
    landmark: '500m from NH-19 Highway, Near DPS Varanasi',
    familyZone: 'Gated Family Residential Township (Park Facing)',
    amenities: ['24x7 Water Pipeline', 'Electricity Transformer', 'RCC Drainage', 'Street LED Lights', 'Gated Security', '143 Conversion Approved'],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'],
    status: 'AVAILABLE',
    tokenAmount: 51000,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'plot_102',
    number: 'A-102',
    colonyId: 'colony_1',
    colonyName: 'Kashi Green Valley City (Phase 1)',
    location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor, UP',
    biswa: 2.0,
    sizeSqFt: 1800,
    ratePerBiswa: 1450000,
    grossPrice: 2900000,
    discount: 100000,
    price: 2800000,
    roadWidth: '40 Ft Main Boulevard Road',
    dimensions: '40 × 45 ft',
    frontFt: 40,
    depthFt: 45,
    facing: 'North Facing Corner',
    landmark: 'Direct Expressway entry, 10 min to Cantt Station',
    familyZone: 'Residential Gated Society with Children Park',
    amenities: ['Electricity', 'Water', 'RCC Drainage', 'Boundary Wall', 'Clubhouse & Temple'],
    images: ['https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=600&q=80'],
    status: 'BOOKED',
    buyer: 'Sunil Pandey',
    tokenAmount: 100000,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'plot_103',
    number: 'SCO-01',
    colonyId: 'colony_2',
    colonyName: 'Ganga Enclave SCO Commercial Plaza',
    location: 'Ring Road Phase-2, Near Sarnath Junction, Varanasi',
    biswa: 2.5,
    sizeSqFt: 2250,
    ratePerBiswa: 2250000,
    grossPrice: 5625000,
    discount: 125000,
    price: 5500000,
    roadWidth: '60 Ft Commercial Highway',
    dimensions: '50 × 45 ft',
    frontFt: 50,
    depthFt: 45,
    facing: 'Highway Frontage SCO Commercial',
    landmark: 'Adjacent to Ring Road Overbridge & Sarnath Tourist Hub',
    familyZone: 'High ROI Commercial Plaza (Banks, Hospital & Showrooms)',
    amenities: ['3-Phase Commercial Power', 'Heavy Truck Loading', 'Underground Drainage', 'Street Lights'],
    images: ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80'],
    status: 'AVAILABLE',
    tokenAmount: 200000,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'plot_104',
    number: 'B-205',
    colonyId: 'colony_1',
    colonyName: 'Kashi Green Valley City (Phase 1)',
    location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor, UP',
    biswa: 1.0,
    sizeSqFt: 900,
    ratePerBiswa: 1500000,
    grossPrice: 1500000,
    discount: 50000,
    price: 1450000,
    roadWidth: '25 Ft Interlocking Road',
    dimensions: '25 × 36 ft',
    frontFt: 25,
    depthFt: 36,
    facing: 'East Facing',
    landmark: 'Near Colony Meditation Center & Park',
    familyZone: 'Affordable Residential Gated Society',
    amenities: ['Water Connection', 'Electricity Meter Ready', '24x7 Security', '143 Conversion'],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'],
    status: 'AVAILABLE',
    tokenAmount: 31000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'plot_105',
    number: 'C-310',
    colonyId: 'colony_1',
    colonyName: 'Royal Orchid Township',
    location: 'Babatpur Airport Highway Corridor, Varanasi',
    biswa: 3.0,
    sizeSqFt: 2700,
    ratePerBiswa: 1400000,
    grossPrice: 4200000,
    discount: 100000,
    price: 4100000,
    roadWidth: '40 Ft Wide Sector Road',
    dimensions: '45 × 60 ft',
    frontFt: 45,
    depthFt: 60,
    facing: 'North-East Corner (Double Road)',
    landmark: '5 Mins from Lal Bahadur Shastri International Airport',
    familyZone: 'Luxury Villa & Farmhouse Residential Community',
    amenities: ['Gated Boundary Wall', 'Solar Street Lighting', 'Plantation & Green Belt', 'Bank Loan Available'],
    images: ['https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=600&q=80'],
    status: 'AVAILABLE',
    tokenAmount: 100000,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const plottingController = {
  /**
   * GET /api/v1/plotting/plots
   * List all plots with search & filter
   */
  async listPlots(req, res) {
    try {
      const { status, colonyId, search } = req.query;
      let plots = [...MASTER_PLOTS_DATABASE];

      if (status && status !== 'ALL') {
        plots = plots.filter((p) => p.status?.toUpperCase() === status.toUpperCase());
      }
      if (colonyId && colonyId !== 'ALL') {
        plots = plots.filter((p) => p.colonyId === colonyId);
      }
      if (search) {
        const q = search.toLowerCase();
        plots = plots.filter(
          (p) =>
            p.number?.toLowerCase().includes(q) ||
            p.colonyName?.toLowerCase().includes(q) ||
            p.location?.toLowerCase().includes(q) ||
            p.landmark?.toLowerCase().includes(q)
        );
      }

      return sendSuccess(res, 'Plots retrieved successfully', {
        total: plots.length,
        plots,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/plotting/plots
   * Create a new plot
   */
  async createPlot(req, res) {
    try {
      const {
        number,
        colonyName,
        colonyId,
        location,
        biswa,
        ratePerBiswa,
        discount = 0,
        roadWidth,
        frontFt,
        depthFt,
        facing,
        landmark,
        familyZone,
        amenities = [],
        images = [],
        tokenAmount = 51000,
        status = 'AVAILABLE',
      } = req.body;

      if (!number || !colonyName || !location) {
        return sendError(res, 'Plot number, project name, and location are required', [], 400);
      }

      const biswaNum = Number(biswa) || 1;
      const rateNum = Number(ratePerBiswa) || 1500000;
      const grossPrice = Math.round(biswaNum * rateNum);
      const discountNum = Number(discount) || 0;
      const netPrice = Math.max(0, grossPrice - discountNum);
      const sizeSqFt = Math.round(biswaNum * 900); // 1 Biswa approx 900 sq.ft (East UP standard)
      const dimensions = `${frontFt || 30} × ${depthFt || 45} ft`;

      const newPlot = {
        id: `plot_${Date.now()}`,
        number,
        colonyId: colonyId || `colony_${Date.now()}`,
        colonyName,
        location,
        biswa: biswaNum,
        sizeSqFt,
        ratePerBiswa: rateNum,
        grossPrice,
        discount: discountNum,
        price: netPrice,
        roadWidth: roadWidth || '30 Ft Wide Road',
        dimensions,
        frontFt: Number(frontFt) || 30,
        depthFt: Number(depthFt) || 45,
        facing: facing || 'East Facing',
        landmark: landmark || '',
        familyZone: familyZone || 'Gated Residential Society',
        amenities: Array.isArray(amenities) ? amenities : ['Electricity', 'Water', 'Road'],
        images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'],
        tokenAmount: Number(tokenAmount) || 51000,
        status: status.toUpperCase(),
        createdAt: new Date().toISOString(),
      };

      MASTER_PLOTS_DATABASE.unshift(newPlot);
      return sendSuccess(res, `Plot #${number} created successfully in ${colonyName}`, newPlot, 201);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * PUT /api/v1/plotting/plots/:plotId
   * Update plot
   */
  async updatePlot(req, res) {
    try {
      const { plotId } = req.params;
      const idx = MASTER_PLOTS_DATABASE.findIndex((p) => p.id === plotId);
      if (idx === -1) return sendError(res, 'Plot not found', [], 404);

      const existing = MASTER_PLOTS_DATABASE[idx];
      const updated = {
        ...existing,
        ...req.body,
        id: existing.id,
      };

      if (req.body.biswa || req.body.ratePerBiswa || req.body.discount !== undefined) {
        const b = Number(updated.biswa) || 1;
        const r = Number(updated.ratePerBiswa) || 1500000;
        updated.grossPrice = Math.round(b * r);
        const d = Number(updated.discount) || 0;
        updated.price = Math.max(0, updated.grossPrice - d);
        updated.sizeSqFt = Math.round(b * 900);
      }

      MASTER_PLOTS_DATABASE[idx] = updated;
      return sendSuccess(res, `Plot #${updated.number} updated successfully`, updated);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * DELETE /api/v1/plotting/plots/:plotId
   */
  async deletePlot(req, res) {
    try {
      const { plotId } = req.params;
      const beforeLen = MASTER_PLOTS_DATABASE.length;
      MASTER_PLOTS_DATABASE = MASTER_PLOTS_DATABASE.filter((p) => p.id !== plotId);
      if (MASTER_PLOTS_DATABASE.length === beforeLen) {
        return sendError(res, 'Plot not found', [], 404);
      }
      return sendSuccess(res, 'Plot deleted successfully', { id: plotId });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
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

