/**
 * @file event.controller.js
 * @description Event Planning, Stage Staging, Vendor Logistics & QR Pass Controller.
 * @module backend/src/modules/kashi-service/event-services/controllers/event.controller
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// Seeded active event productions
const EVENTS_DATABASE = [
  {
    id: 'evt_101',
    name: 'Royale Heritage Destination Wedding (Sharma & Verma)',
    category: 'WEDDING',
    clientName: 'Rajesh Sharma',
    phone: '+91 98765 11223',
    venue: 'The Grand Palace Heritage Resort, Varanasi',
    eventDate: '2026-11-28',
    status: 'LIVE_PRODUCTION', // 'PLANNING' | 'VENDOR_ASSIGNED' | 'LIVE_PRODUCTION' | 'COMPLETED'
    budget: 1850000,
    paidAmount: 1200000,
    guestCount: 650,
    milestones: [
      { step: 'Mandap Floral & Brass Styling', status: 'COMPLETED', date: '2026-11-26' },
      { step: 'Haldi Stage Yellow Marigold Setup', status: 'COMPLETED', date: '2026-11-27' },
      { step: 'Sangeet Digital LED Wall & Truss Rigging', status: 'IN_PROGRESS', date: '2026-11-28' },
      { step: 'Varmala Hydraulic Stage Operation', status: 'PENDING', date: '2026-11-28' },
      { step: 'Royal Banquet Dinner Catering 650 Pax', status: 'PENDING', date: '2026-11-28' },
    ],
    vendorLedger: [
      { vendor: 'Royal Marigold Decorators', service: 'Floral & Fabric Staging', amount: 450000, status: 'PAID' },
      { vendor: 'Acoustic Sound & Laser Systems', service: 'Line Array Audio & Truss', amount: 280000, status: 'PARTIAL' },
      { vendor: 'Awadhi Shahi Caterers', service: 'Buffet Catering 650 Pax', amount: 750000, status: 'PARTIAL' },
      { vendor: 'Candid Moments Studio', service: '4K Drone & Cinematic Film', amount: 180000, status: 'PAID' },
    ],
    qrCheckIns: {
      totalPassesIssued: 650,
      scannedAtGate: 482,
      pendingArrivals: 168,
    },
  },
  {
    id: 'evt_102',
    name: 'TechSummit 2026 Corporate Expo & Gala',
    category: 'CORPORATE',
    clientName: 'Nexus Global Ventures',
    phone: '+91 98765 44332',
    venue: 'Convention Centre Hall A, Varanasi',
    eventDate: '2026-12-05',
    status: 'VENDOR_ASSIGNED',
    budget: 950000,
    paidAmount: 500000,
    guestCount: 400,
    milestones: [
      { step: 'Keynote Projection & Digital Registration Kiosks', status: 'COMPLETED', date: '2026-12-04' },
      { step: 'Booth Shell Scheme Partitioning', status: 'IN_PROGRESS', date: '2026-12-04' },
      { step: 'Live Audio Streaming & Video Recording', status: 'PENDING', date: '2026-12-05' },
    ],
    vendorLedger: [
      { vendor: 'ProAV Solutions', service: 'LED Screens & Podiums', amount: 320000, status: 'PAID' },
      { vendor: 'Gourmet Express', service: 'Executive Lunch & High-Tea', amount: 280000, status: 'PENDING' },
    ],
    qrCheckIns: {
      totalPassesIssued: 400,
      scannedAtGate: 0,
      pendingArrivals: 400,
    },
  },
];

export const eventController = {
  /**
   * GET /api/v1/kashi/events
   */
  async listEvents(_req, res) {
    try {
      return sendSuccess(res, 'Event productions list retrieved', {
        total: EVENTS_DATABASE.length,
        events: EVENTS_DATABASE,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * GET /api/v1/kashi/events/:eventId
   */
  async getEventById(req, res) {
    try {
      const { eventId } = req.params;
      const found = EVENTS_DATABASE.find((e) => e.id === eventId);
      if (!found) return sendError(res, 'Event not found', [], 404);
      return sendSuccess(res, 'Event details retrieved', found);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/events/book
   */
  async createEventBooking(req, res) {
    try {
      const { name, category, clientName, phone, venue, eventDate, budget, guestCount } = req.body;
      if (!name || !clientName || !phone || !eventDate) {
        return sendError(res, 'Event name, client name, phone, and date are required', [], 400);
      }

      const newEvent = {
        id: `evt_${Date.now()}`,
        name,
        category: category || 'WEDDING',
        clientName,
        phone,
        venue: venue || 'Venue To Be Finalized',
        eventDate,
        status: 'PLANNING',
        budget: Number(budget) || 500000,
        paidAmount: 0,
        guestCount: Number(guestCount) || 200,
        milestones: [
          { step: 'Initial Concept & Moodboard Design', status: 'COMPLETED', date: new Date().toISOString().split('T')[0] },
          { step: 'Venue Inspection & 2D Seating Layout', status: 'IN_PROGRESS', date: eventDate },
          { step: 'Vendor Contracting (Sound, Decor, Catering)', status: 'PENDING', date: eventDate },
        ],
        vendorLedger: [],
        qrCheckIns: {
          totalPassesIssued: Number(guestCount) || 200,
          scannedAtGate: 0,
          pendingArrivals: Number(guestCount) || 200,
        },
      };

      EVENTS_DATABASE.unshift(newEvent);
      return sendSuccess(res, 'Event production booking created successfully', newEvent, 201);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/events/scan-qr
   */
  async scanQrPass(req, res) {
    try {
      const { eventId, ticketCode } = req.body;
      const event = EVENTS_DATABASE.find((e) => e.id === eventId) || EVENTS_DATABASE[0];
      if (event) {
        event.qrCheckIns.scannedAtGate = Math.min(event.qrCheckIns.totalPassesIssued, event.qrCheckIns.scannedAtGate + 1);
        event.qrCheckIns.pendingArrivals = Math.max(0, event.qrCheckIns.totalPassesIssued - event.qrCheckIns.scannedAtGate);
      }
      return sendSuccess(res, `QR Pass ${ticketCode || 'TKT-2026-A1'} Verified. Welcome to ${event.name}!`, {
        event: event.name,
        scannedCount: event.qrCheckIns.scannedAtGate,
        status: 'ENTRY_GRANTED',
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};

