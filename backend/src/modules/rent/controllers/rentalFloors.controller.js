/**
 * @file rentalFloors.controller.js
 * @description Office & Commercial Rental Floors, Commercial Halls with Physical Dimensions (L x W x H) & Residential Brokerage.
 * @module backend/src/modules/rent/controllers/rentalFloors.controller
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// 1. Building Floors Master Database
let RENTAL_FLOORS = [
  { id: 'flr_ground', name: 'Ground Floor (Sadak / Highway Frontage)', code: 'GF-01', totalAreaSqFt: 4500, status: 'Active' },
  { id: 'flr_first', name: 'First Floor (Commercial Office Complex)', code: '1F-02', totalAreaSqFt: 5000, status: 'Active' },
  { id: 'flr_second', name: 'Second Floor (Executive Tech Suites & Labs)', code: '2F-03', totalAreaSqFt: 5000, status: 'Active' },
  { id: 'flr_basement', name: 'Basement Commercial & Stilt Parking', code: 'BM-00', totalAreaSqFt: 6000, status: 'Active' },
  { id: 'flr_rooftop', name: 'Rooftop Open Terrace & Banquet Deck', code: 'RT-04', totalAreaSqFt: 4000, status: 'Active' },
];

// 2. Commercial Halls & Spaces Database (with Length, Width, Height & Road Specs)
let COMMERCIAL_HALLS = [
  {
    id: 'hall_101',
    title: 'Grand Commercial Exhibition Hall (Ground Floor)',
    floorId: 'flr_ground',
    floorName: 'Ground Floor (Sadak / Highway Frontage)',
    lengthFt: 80,
    widthFt: 45,
    heightFt: 14, // 14 Ft Clear Ceiling Height
    totalCarpetSqFt: 3600,
    monthlyRent: 120000,
    securityDeposit: 360000,
    locationSpecs: 'Main 60ft Highway Frontage, Corner View, Sigra-Rathyatra Link Road, Varanasi',
    landmark: 'Opposite Kashi Central Mall, 500m from Railway Station',
    amenities: [
      'Heavy 3-Phase 25KW Commercial Electric Line',
      'Dual Glass Front Facade & Rolling Automated Shutters',
      '10-Passenger High-Speed Capsule Elevator',
      'Dedicated Male & Female Washroom Suites',
      'Reserved Underground Car Parking (15 Slots)',
      'Fire Sprinklers & Approved Commercial NOC',
    ],
    contactPerson: 'Er. Rajesh Kumar Sharma (Property Estate Officer)',
    contactPhone: '9839014567',
    contactEmail: 'rentals@kashiservice.com',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'AVAILABLE_FOR_LEASE',
  },
  {
    id: 'hall_102',
    title: 'Executive Software IT Lab & Corporate Office Suite',
    floorId: 'flr_first',
    floorName: 'First Floor (Commercial Office Complex)',
    lengthFt: 60,
    widthFt: 35,
    heightFt: 11,
    totalCarpetSqFt: 2100,
    monthlyRent: 65000,
    securityDeposit: 195000,
    locationSpecs: 'First Floor East Facing Glass Facade, Ring Road Phase-2, Sarnath',
    landmark: 'Near Sarnath IT Park & Cantt Bypass Road',
    amenities: [
      'Central VRV High-Efficiency Air Conditioning',
      'High-Speed Leased Line Fiber Optical Network Port',
      'Acoustic False Ceiling with 500 Lux LED Panel Lights',
      'Pantry & Cafeteria Dinette Space',
      '100% DG Generator Power Backup',
    ],
    contactPerson: 'Smt. Vandana Mishra (Commercial Leasing Head)',
    contactPhone: '9415203344',
    contactEmail: 'vandana.commercial@kashiservice.com',
    photos: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'ACTIVE_LEASED',
  },
];

// 3. Residential House, Office & Godam Booking Leases with Advance & Meter DB
let RESIDENTIAL_RENTALS = [
  {
    id: 'hse_201',
    houseName: 'Ganga View 3-BHK Luxury Flat (Flat #302)',
    propertyType: 'HOUSE', // 'HOUSE' | 'OFFICE' | 'GODAM'
    location: 'Ravindrapuri Extension, Near Assi Ghat, Varanasi',
    tenantName: 'Dr. Vivek Upadhyay',
    tenantPhone: '9838019900',
    tenantEmail: 'vivek.upadhyay@gmail.com',
    bookingDate: '2026-11-01',
    checkInDate: '2026-11-15', // Room / House check-in actual date
    bookingMonth: 'November 2026',
    monthlyRent: 32000,
    securityDeposit: 64000,
    advancePaid: 32000, // Advance amount paid during booking
    meterUnitRate: 10, // Default ₹10 per electricity unit
    electricityBillingCycle: {
      previousReading: 1240, // Purana meter reading
      currentReading: 1480,  // Naya meter reading
      unitsConsumed: 240,    // 1480 - 1240
      meterRatePerUnit: 10,  // ₹10 per unit
      electricityBillAmount: 2400, // 240 * 10
      billStatus: 'PAID',
    },
    paymentLedger: [
      {
        month: 'November 2026',
        rentDue: 32000,
        rentPaid: 32000,
        prevMeterReading: 1240,
        newMeterReading: 1480,
        unitsConsumed: 240,
        electricityRate: 10,
        electricityBill: 2400,
        electricityPaid: 2400,
        advanceAdjusted: 0,
        pendingBalance: 0,
        totalPaid: 34400,
        paidDate: '2026-11-15',
        paymentMode: 'UPI (GooglePay)',
        status: 'FULLY_PAID',
      },
    ],
    brokerageCommissionType: '1 Month Rent (Brokerage)',
    brokerageAmount: 32000,
    commissionPaid: true,
    status: 'OCCUPIED',
  },
  {
    id: 'hse_202',
    houseName: 'Prime Highway Logistics Godown & Warehouse #G-4',
    propertyType: 'GODAM',
    location: 'Mohansarai Ring Road Bypass, Varanasi',
    tenantName: 'M/s Kashi Transport Corporation (Anil Yadav)',
    tenantPhone: '9839120044',
    tenantEmail: 'kashitransport@vns.in',
    bookingDate: '2026-11-10',
    checkInDate: '2026-12-01', // Advance booked, will check-in on Dec 1st
    bookingMonth: 'November 2026',
    monthlyRent: 45000,
    securityDeposit: 90000,
    advancePaid: 45000,
    meterUnitRate: 12, // Commercial electric meter ₹12/unit
    electricityBillingCycle: {
      previousReading: 3100,
      currentReading: 3450,
      unitsConsumed: 350,
      meterRatePerUnit: 12,
      electricityBillAmount: 4200,
      billStatus: 'DUE',
    },
    paymentLedger: [
      {
        month: 'November 2026 (Booking Advance)',
        rentDue: 45000,
        rentPaid: 45000,
        prevMeterReading: 3100,
        newMeterReading: 3100,
        unitsConsumed: 0,
        electricityRate: 12,
        electricityBill: 0,
        electricityPaid: 0,
        advanceAdjusted: 45000,
        pendingBalance: 0,
        totalPaid: 45000,
        paidDate: '2026-11-10',
        paymentMode: 'Bank Transfer (NEFT)',
        status: 'FULLY_PAID',
      },
    ],
    brokerageCommissionType: '15 Days Rent',
    brokerageAmount: 22500,
    commissionPaid: true,
    status: 'ADVANCE_BOOKED_OCCUPIED',
  },
];

export const rentalFloorsController = {
  // Floors CRUD
  async listFloors(_req, res) {
    return sendSuccess(res, 'Building floors retrieved', { total: RENTAL_FLOORS.length, floors: RENTAL_FLOORS });
  },
  async createFloor(req, res) {
    const { name, code, totalAreaSqFt } = req.body;
    if (!name) return sendError(res, 'Floor name is required', [], 400);
    const newFlr = {
      id: `flr_${Date.now()}`,
      name,
      code: code || `FLR-${Date.now().toString().slice(-2)}`,
      totalAreaSqFt: Number(totalAreaSqFt) || 3000,
      status: 'Active',
    };
    RENTAL_FLOORS.push(newFlr);
    return sendSuccess(res, 'Floor created', newFlr, 201);
  },

  // Commercial Halls CRUD
  async listHalls(_req, res) {
    return sendSuccess(res, 'Commercial halls retrieved', { total: COMMERCIAL_HALLS.length, halls: COMMERCIAL_HALLS });
  },
  async createHall(req, res) {
    const {
      title,
      floorId,
      floorName,
      lengthFt,
      widthFt,
      heightFt,
      monthlyRent,
      securityDeposit,
      locationSpecs,
      landmark,
      amenities = [],
      contactPerson,
      contactPhone,
      contactEmail,
      photos = [],
      status = 'AVAILABLE_FOR_LEASE',
    } = req.body;

    if (!title || !lengthFt || !widthFt) {
      return sendError(res, 'Hall title, length, and width are required', [], 400);
    }

    const l = Number(lengthFt) || 0;
    const w = Number(widthFt) || 0;
    const h = Number(heightFt) || 12;
    const sqft = Math.round(l * w);

    const newHall = {
      id: `hall_${Date.now()}`,
      title,
      floorId: floorId || 'flr_ground',
      floorName: floorName || 'Ground Floor',
      lengthFt: l,
      widthFt: w,
      heightFt: h,
      totalCarpetSqFt: sqft,
      monthlyRent: Number(monthlyRent) || 50000,
      securityDeposit: Number(securityDeposit) || (Number(monthlyRent) * 3 || 150000),
      locationSpecs: locationSpecs || 'Prime Commercial Corridor',
      landmark: landmark || '',
      amenities,
      contactPerson: contactPerson || 'Property Manager',
      contactPhone: contactPhone || '9876543210',
      contactEmail: contactEmail || 'rentals@kashiservice.com',
      photos: photos.length ? photos : ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'],
      status,
    };
    COMMERCIAL_HALLS.unshift(newHall);
    return sendSuccess(res, 'Commercial Hall added successfully', newHall, 201);
  },
  async deleteHall(req, res) {
    const { id } = req.params;
    COMMERCIAL_HALLS = COMMERCIAL_HALLS.filter((h) => h.id !== id);
    return sendSuccess(res, 'Commercial hall removed', { id });
  },

  // Residential Rentals & Brokerage Ledger
  async listResidentialRentals(_req, res) {
    return sendSuccess(res, 'Residential rentals and brokerage ledger retrieved', {
      total: RESIDENTIAL_RENTALS.length,
      rentals: RESIDENTIAL_RENTALS,
    });
  },
  async createResidentialRental(req, res) {
    const { houseName, location, tenantName, tenantPhone, monthlyRent, securityDeposit, brokerageCommissionType, brokerageAmount } = req.body;
    if (!houseName || !monthlyRent) {
      return sendError(res, 'House name and monthly rent are required', [], 400);
    }
    const newRent = {
      id: `hse_${Date.now()}`,
      houseName,
      propertyType: req.body.propertyType || 'HOUSE',
      location: location || 'Varanasi',
      tenantName: tenantName || 'Tenant',
      tenantPhone: tenantPhone || '',
      tenantEmail: req.body.tenantEmail || '',
      bookingDate: req.body.bookingDate || new Date().toISOString().split('T')[0],
      checkInDate: req.body.checkInDate || new Date().toISOString().split('T')[0],
      bookingMonth: req.body.bookingMonth || 'Current Month',
      monthlyRent: Number(monthlyRent) || 15000,
      securityDeposit: Number(securityDeposit) || Number(monthlyRent) * 2,
      advancePaid: Number(req.body.advancePaid) || Number(monthlyRent),
      meterUnitRate: Number(req.body.meterUnitRate) || 10,
      electricityBillingCycle: {
        previousReading: Number(req.body.initialMeterReading) || 0,
        currentReading: Number(req.body.initialMeterReading) || 0,
        unitsConsumed: 0,
        meterRatePerUnit: Number(req.body.meterUnitRate) || 10,
        electricityBillAmount: 0,
        billStatus: 'PAID',
      },
      paymentLedger: [
        {
          month: `${req.body.bookingMonth || 'Booking Month'} (Advance)`,
          rentDue: Number(monthlyRent) || 15000,
          rentPaid: Number(req.body.advancePaid) || Number(monthlyRent),
          prevMeterReading: Number(req.body.initialMeterReading) || 0,
          newMeterReading: Number(req.body.initialMeterReading) || 0,
          unitsConsumed: 0,
          electricityRate: Number(req.body.meterUnitRate) || 10,
          electricityBill: 0,
          electricityPaid: 0,
          advanceAdjusted: Number(req.body.advancePaid) || Number(monthlyRent),
          pendingBalance: 0,
          totalPaid: Number(req.body.advancePaid) || Number(monthlyRent),
          paidDate: req.body.bookingDate || new Date().toISOString().split('T')[0],
          paymentMode: req.body.paymentMode || 'UPI / Cash',
          status: 'ADVANCE_PAID',
        },
      ],
      brokerageCommissionType: brokerageCommissionType || '1 Month Rent',
      brokerageAmount: Number(brokerageAmount) || Number(monthlyRent),
      commissionPaid: true,
      status: 'ADVANCE_BOOKED_OCCUPIED',
    };
    RESIDENTIAL_RENTALS.unshift(newRent);
    return sendSuccess(res, 'Rental booked with advance payment and check-in date', newRent, 201);
  },

  // Record Monthly Rent & Electricity Meter Reading Payment
  async recordMonthlyPayment(req, res) {
    try {
      const { id } = req.params;
      const {
        month,
        rentAmount,
        rentPaid,
        prevMeterReading,
        newMeterReading,
        meterRatePerUnit = 10,
        electricityPaid = 0,
        advanceAdjusted = 0,
        paymentMode = 'UPI',
        paidDate = new Date().toISOString().split('T')[0],
      } = req.body;

      const property = RESIDENTIAL_RENTALS.find((r) => r.id === id);
      if (!property) return sendError(res, 'Property rental record not found', [], 404);

      // Calculations:
      // Units Consumed = Naya Reading - Purana Reading
      const prev = Number(prevMeterReading) || property.electricityBillingCycle?.currentReading || 0;
      const curr = Number(newMeterReading) || prev;
      const units = Math.max(0, curr - prev);
      const rate = Number(meterRatePerUnit) || property.meterUnitRate || 10;
      const elecBill = Math.round(units * rate);

      const rDue = Number(rentAmount) || property.monthlyRent || 0;
      const rPaid = Number(rentPaid) || 0;
      const ePaid = Number(electricityPaid) || 0;
      const advAdj = Number(advanceAdjusted) || 0;

      const totalDueThisMonth = rDue + elecBill;
      const totalPaidThisMonth = rPaid + ePaid + advAdj;
      const pendingThisMonth = Math.max(0, totalDueThisMonth - totalPaidThisMonth);

      const ledgerEntry = {
        month: month || 'Current Billing Cycle',
        rentDue: rDue,
        rentPaid: rPaid,
        prevMeterReading: prev,
        newMeterReading: curr,
        unitsConsumed: units,
        electricityRate: rate,
        electricityBill: elecBill,
        electricityPaid: ePaid,
        advanceAdjusted: advAdj,
        pendingBalance: pendingThisMonth,
        totalPaid: rPaid + ePaid,
        paidDate,
        paymentMode,
        status: pendingThisMonth === 0 ? 'FULLY_PAID' : 'PARTIALLY_PAID_PENDING',
      };

      // Update property state
      property.electricityBillingCycle = {
        previousReading: prev,
        currentReading: curr,
        unitsConsumed: units,
        meterRatePerUnit: rate,
        electricityBillAmount: elecBill,
        billStatus: ePaid >= elecBill ? 'PAID' : 'DUE',
      };
      property.paymentLedger.unshift(ledgerEntry);

      return sendSuccess(res, 'Monthly rent & electricity calculation recorded successfully', {
        property,
        ledgerEntry,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};
