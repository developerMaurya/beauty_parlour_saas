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

// Seeded event packages / catalog
let EVENTS_CATALOG_DATABASE = [
  {
    id: 'evt_srv_101',
    _id: 'evt_srv_101',
    itemType: 'EVENT', // 'EVENT' (Individual Service) vs 'PACKAGE' (Combo of multiple events)
    name: 'Aadiyogi Theme Grand Wedding Stage (20ft)',
    category: 'STAGE_DECORATION',
    categoryName: 'Stage Decoration & Setup',
    description: 'Spectacular 20ft Mahadev Bust sculpture with golden sun rays aura, Nandi statue, Trishul & Damru centerpiece with programmed warm lighting.',
    features: [
      '20ft High-density Fiberglass Mahadev Bust',
      '360° Circular Sun Rays LED Warm Amber Backlight',
      'Sacred Trishul & Damru Brass Artifacts',
      'Sculpted Nandi Bull Floral Enclosure',
      '40x24ft Heavy Duty Iron Rigging Platform'
    ],
    includedServices: [],
    rate: 250000,
    discount: 25000,
    finalPrice: 225000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '5-7 Hours',
    crewSize: '8 Riggers + 2 Electricians',
    advanceRequired: '40% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_srv_102',
    _id: 'evt_srv_102',
    itemType: 'EVENT',
    name: 'Royal Bridal Entry: 15ft Illuminated Flower Arch Tunnel',
    category: 'BRIDAL_ENTRY',
    categoryName: 'Royal Bridal Entry & Walkways',
    description: 'Regal bridal walkway with 15ft illuminated floral arch tunnel, velvet red carpet, fairy light canopy and handheld floral phoolon ki chaadar.',
    features: [
      '15ft Continuous Flower Arch Tunnel (Fresh Roses & Orchids)',
      'High-Lux Fairy Warm White Curtain Lights',
      '50ft Velvet Red Carpet Runway',
      'LED Handheld Lotus Flower Props for Bridesmaids',
      'Matching Entry Gate Welcome Signage'
    ],
    includedServices: [],
    rate: 95000,
    discount: 10000,
    finalPrice: 85000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '3-4 Hours',
    crewSize: '5 Florists',
    advanceRequired: '30% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_srv_103',
    _id: 'evt_srv_103',
    itemType: 'EVENT',
    name: 'Cold Pyro Sparkle Blasts & Dry Ice Heavy Cloud Fog',
    category: 'SPECIAL_EFFECTS',
    categoryName: 'Cold Pyro, Fog & Fireworks',
    description: 'Indoor-safe electronic cold fireworks (4-6 shots) + high-density low fog dry ice cloud for royal varmala stage and bridal entry moments.',
    features: [
      '6 Wireless DMX Cold Sparkle Pyro Fountain Guns',
      '2 Heavy Fog Dry Ice Sub-Zero Machines (Clouds Floor Effect)',
      'Certified Smokeless & Odorless Chemical Cartridges',
      'Dedicated Pyrotechnic Technician Operator',
      'Instant Emergency Kill Switch Controller'
    ],
    includedServices: [],
    rate: 45000,
    discount: 5000,
    finalPrice: 40000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '1-2 Hours',
    crewSize: '2 FX Specialists',
    advanceRequired: '50% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_srv_104',
    _id: 'evt_srv_104',
    itemType: 'EVENT',
    name: 'Hydraulic & Revolving Varmala Stage with Lotus Pod',
    category: 'VARMALA_STAGE',
    categoryName: 'Hydraulic & Revolving Varmala Stage',
    description: 'Automated 360-degree motorized rotating varmala platform with lifting mechanism and blooming mechanical petal backdrop.',
    features: [
      'Motorized 360° Rotating Steel Turntable Platform (10ft diameter)',
      'Hydraulic Elevating Scissor Mechanism up to 6ft height',
      'Synchronized Rose Flower Cannon Blast on Jaimala',
      'Heavy-duty safety railings & velvet steps',
    ],
    includedServices: [],
    rate: 80000,
    discount: 10000,
    finalPrice: 70000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '4-5 Hours',
    crewSize: '4 Operators',
    advanceRequired: '30% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_pkg_201',
    _id: 'evt_pkg_201',
    itemType: 'PACKAGE', // Combo Package containing multiple event services
    name: 'Grand Royal Shiva Mahadev Wedding Combo Package',
    category: 'COMPLETE_THEME',
    categoryName: 'Complete Grand Theme Package',
    description: 'Complete all-in-one VIP Wedding Staging Package bundling 20ft Aadiyogi Stage, 15ft Royal Bridal Entrance Arch Tunnel, and Cold Pyro Sparkle Blasts.',
    features: [
      'Bundle: 20ft Aadiyogi Theme Stage (Worth ₹2,50,000)',
      'Bundle: Royal Bridal 15ft Flower Arch Tunnel (Worth ₹95,000)',
      'Bundle: Cold Pyro Blasts & Low Fog Cloud Machines (Worth ₹45,000)',
      'Total Savings of ₹65,000 when booked together',
      'Dedicated Production Director & 15 On-site Riggers',
    ],
    includedServices: [
      { id: 'evt_srv_101', name: 'Aadiyogi Theme Grand Wedding Stage (20ft)', price: 250000, category: 'STAGE_DECORATION' },
      { id: 'evt_srv_102', name: 'Royal Bridal Entry: 15ft Illuminated Flower Arch Tunnel', price: 95000, category: 'BRIDAL_ENTRY' },
      { id: 'evt_srv_103', name: 'Cold Pyro Sparkle Blasts & Dry Ice Heavy Cloud Fog', price: 45000, category: 'SPECIAL_EFFECTS' },
    ],
    rate: 390000,
    discount: 65000,
    finalPrice: 325000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '8-10 Hours',
    crewSize: '15 Master Crew + 1 Event Director',
    advanceRequired: '40% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_pkg_202',
    _id: 'evt_pkg_202',
    itemType: 'PACKAGE',
    name: 'Varmala Celebration & Bridal Royalty Duo Package',
    category: 'COMPLETE_THEME',
    categoryName: 'Complete Grand Theme Package',
    description: 'Special combo package combining the Hydraulic Revolving Varmala Stage with the Royal Bridal 15ft Illuminated Flower Arch Tunnel and Pyro entry.',
    features: [
      'Bundle: Hydraulic & Revolving Varmala Stage with Lotus Pod (Worth ₹80,000)',
      'Bundle: Royal Bridal Entry: 15ft Illuminated Flower Arch Tunnel (Worth ₹95,000)',
      'Bundle: Cold Pyro Sparkle Blasts & Dry Ice Cloud Fog (Worth ₹45,000)',
      'Combined Spectacular Experience with ₹30,000 Package Discount',
    ],
    includedServices: [
      { id: 'evt_srv_104', name: 'Hydraulic & Revolving Varmala Stage with Lotus Pod', price: 80000, category: 'VARMALA_STAGE' },
      { id: 'evt_srv_102', name: 'Royal Bridal Entry: 15ft Illuminated Flower Arch Tunnel', price: 95000, category: 'BRIDAL_ENTRY' },
      { id: 'evt_srv_103', name: 'Cold Pyro Sparkle Blasts & Dry Ice Heavy Cloud Fog', price: 45000, category: 'SPECIAL_EFFECTS' },
    ],
    rate: 220000,
    discount: 30000,
    finalPrice: 190000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '6-7 Hours',
    crewSize: '10 Technicians & Operators',
    advanceRequired: '35% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt_srv_103',
    _id: 'evt_srv_103',
    itemType: 'EVENT',
    name: 'Cold Pyro Fireworks & Heavy Dry Ice Cloud Fog Machine',
    category: 'SPECIAL_EFFECTS',
    categoryName: 'Cold Pyro, Fog & Fireworks',
    description: 'Cinematic grand entry & jaimala special effects with 8 smokeless cold pyro guns, heavy low-lying dry ice cloud fog, and confetti blast.',
    features: [
      '8 Electric Remote-Controlled Cold Pyro Guns',
      'Dual Tank High-Volume Dry Ice Cloud Fog Machine',
      'Non-toxic, odourless, fire-safety certified smoke',
      'Double-barrel Confetti Air Cannon with Golden Foil',
      'Dedicated Trained Pyro Technician on site'
    ],
    includedServices: [],
    rate: 45000,
    discount: 5000,
    finalPrice: 40000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '1-2 Hours',
    crewSize: '2 Pyro Operators',
    advanceRequired: '50% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pkg_104',
    _id: 'pkg_104',
    name: 'Royal Hydraulic Revolving Varmala Stage',
    category: 'VARMALA_STAGE',
    categoryName: 'Hydraulic & Revolving Varmala Stage',
    description: 'Automated hydraulic rotating round stage with floral railing, golden pillars and remote elevation for the grand garland exchange ceremony.',
    features: [
      '12ft Diameter Rotating Platform with speed regulator',
      '6ft Hydraulic Vertical Elevation System',
      'Embedded LED Ring Lights & Brass Urli Accents',
      'Safety Railing wrapped in White Carnations',
      'Synchronized Pyro Trigger upon garland exchange'
    ],
    rate: 120000,
    discount: 15000,
    finalPrice: 105000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '4-5 Hours',
    crewSize: '4 Hydraulic Techs',
    advanceRequired: '40% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pkg_105',
    _id: 'pkg_105',
    name: 'Traditional Marigold Haldi & Mehendi Cabana Decor',
    category: 'HALDI_MEHENDI',
    categoryName: 'Haldi, Mehendi & Sangeet',
    description: 'Vibrant yellow and orange fresh marigold floral canopies with traditional brass urlis, colorful kites, floral swings, and Rajasthani cushions.',
    features: [
      '10x10ft Fresh Marigold Canopy with Tassels',
      '5ft Handcrafted Floral Jhoola (Swing)',
      'Brass Urli for Flower Petal Bathing Ceremony',
      '8 Floor Gaddi Mattresses with Bandhani Cushions',
      'Photo Booth with Antique Rickshaw / Cycle Prop'
    ],
    rate: 65000,
    discount: 5000,
    finalPrice: 60000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '3 Hours',
    crewSize: '4 Decorators',
    advanceRequired: '30% Advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pkg_106',
    _id: 'pkg_106',
    name: 'Grand Luxury Destination Wedding Complete Theme Package',
    category: 'COMPLETE_THEME',
    categoryName: 'Complete Grand Theme Package',
    description: 'All-inclusive royal palace wedding production: Stage, Bridal Walkway, Varmala Platform, Banquet Lighting, Sound Truss, and Full Effects.',
    features: [
      'Full Aadiyogi or Crystal Palace Stage Setup',
      'Complete 100ft Illuminated Entry Pathway',
      'Complete Pyro + Heavy Fog + Drone Fireworks',
      'Stage Sound System & Intelligent Moving Head Lights',
      'Full Day Staging & Dismantling Crew Supervision'
    ],
    rate: 0,
    discount: 0,
    finalPrice: 0,
    showPrice: false,
    imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
    status: 'ACTIVE',
    setupTime: '12-16 Hours',
    crewSize: '25 Master Crew',
    advanceRequired: '50% Advance',
    createdAt: new Date().toISOString(),
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

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT CATALOG & PACKAGES CRUD METHODS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * POST /api/v1/kashi/events/catalog/filter or GET /api/v1/kashi/events/catalog
   */
  async listCatalog(req, res) {
    try {
      const payload = { ...req.query, ...(req.body || {}) };
      const { search = '', category = 'ALL', status = 'ALL', itemType = 'ALL' } = payload;

      let filtered = [...EVENTS_CATALOG_DATABASE];

      if (itemType && itemType !== 'ALL') {
        filtered = filtered.filter(
          (item) => (item.itemType || 'EVENT').toUpperCase() === itemType.toUpperCase()
        );
      }

      if (category && category !== 'ALL') {
        filtered = filtered.filter(
          (item) => (item.category || '').toUpperCase() === category.toUpperCase()
        );
      }

      if (status && status !== 'ALL') {
        filtered = filtered.filter(
          (item) => (item.status || 'ACTIVE').toUpperCase() === status.toUpperCase()
        );
      }

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (item) =>
            (item.name || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            (item.categoryName || '').toLowerCase().includes(q) ||
            (item.features || []).some((f) => f.toLowerCase().includes(q)) ||
            (item.includedServices || []).some((s) => (s.name || '').toLowerCase().includes(q))
        );
      }

      return sendSuccess(res, 'Event catalog retrieved successfully', {
        total: filtered.length,
        items: filtered,
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * GET /api/v1/kashi/events/catalog/:id
   */
  async getCatalogById(req, res) {
    try {
      const { id } = req.params;
      const found = EVENTS_CATALOG_DATABASE.find((item) => item.id === id || item._id === id);
      if (!found) return sendError(res, 'Event package not found', [], 404);
      return sendSuccess(res, 'Event package details retrieved', found);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * POST /api/v1/kashi/events/catalog
   */
  async createCatalogItem(req, res) {
    try {
      const {
        name,
        itemType = 'EVENT', // 'EVENT' or 'PACKAGE'
        category = 'STAGE_DECORATION',
        categoryName,
        description = '',
        features = [],
        includedServices = [],
        rate = 0,
        discount = 0,
        showPrice = true,
        imageUrl = '',
        status = 'ACTIVE',
        setupTime = '',
        crewSize = '',
        advanceRequired = '',
      } = req.body;

      if (!name || !name.trim()) {
        return sendError(res, 'Event or Package name is required', [], 400);
      }

      const numRate = Number(rate) || 0;
      const numDiscount = Number(discount) || 0;
      const finalPrice = Math.max(0, numRate - numDiscount);

      const categoryLabels = {
        STAGE_DECORATION: 'Stage Decoration & Setup',
        BRIDAL_ENTRY: 'Royal Bridal Entry & Walkways',
        VARMALA_STAGE: 'Hydraulic & Revolving Varmala Stage',
        SPECIAL_EFFECTS: 'Cold Pyro, Fog & Fireworks',
        HALDI_MEHENDI: 'Haldi, Mehendi & Sangeet',
        COMPLETE_THEME: 'Complete Grand Theme Package',
        OTHER: 'Custom Event Service',
      };

      const newItem = {
        id: itemType === 'PACKAGE' ? `evt_pkg_${Date.now()}` : `evt_srv_${Date.now()}`,
        _id: itemType === 'PACKAGE' ? `evt_pkg_${Date.now()}` : `evt_srv_${Date.now()}`,
        itemType: (itemType || 'EVENT').toUpperCase(),
        name: name.trim(),
        category: category.toUpperCase(),
        categoryName: categoryName || categoryLabels[category.toUpperCase()] || 'Event Service',
        description: description.trim(),
        features: Array.isArray(features) ? features.filter(Boolean) : [],
        includedServices: Array.isArray(includedServices) ? includedServices : [],
        rate: numRate,
        discount: numDiscount,
        finalPrice,
        showPrice: Boolean(showPrice),
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        status: (status || 'ACTIVE').toUpperCase(),
        setupTime: setupTime.trim() || '3-5 Hours',
        crewSize: crewSize.trim() || '4-6 Crew',
        advanceRequired: advanceRequired.trim() || '30% Advance',
        createdAt: new Date().toISOString(),
      };

      EVENTS_CATALOG_DATABASE.unshift(newItem);
      return sendSuccess(res, `${newItem.itemType === 'PACKAGE' ? 'Event Package' : 'Event Service'} created successfully`, newItem, 201);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * PUT/PATCH /api/v1/kashi/events/catalog/:id
   */
  async updateCatalogItem(req, res) {
    try {
      const { id } = req.params;
      const idx = EVENTS_CATALOG_DATABASE.findIndex((item) => item.id === id || item._id === id);
      if (idx === -1) {
        return sendError(res, 'Event or Package not found', [], 404);
      }

      const existing = EVENTS_CATALOG_DATABASE[idx];
      const {
        name,
        itemType,
        category,
        categoryName,
        description,
        features,
        includedServices,
        rate,
        discount,
        showPrice,
        imageUrl,
        status,
        setupTime,
        crewSize,
        advanceRequired,
      } = req.body;

      const numRate = rate !== undefined ? Number(rate) : existing.rate;
      const numDiscount = discount !== undefined ? Number(discount) : existing.discount;
      const finalPrice = Math.max(0, numRate - numDiscount);

      const categoryLabels = {
        STAGE_DECORATION: 'Stage Decoration & Setup',
        BRIDAL_ENTRY: 'Royal Bridal Entry & Walkways',
        VARMALA_STAGE: 'Hydraulic & Revolving Varmala Stage',
        SPECIAL_EFFECTS: 'Cold Pyro, Fog & Fireworks',
        HALDI_MEHENDI: 'Haldi, Mehendi & Sangeet',
        COMPLETE_THEME: 'Complete Grand Theme Package',
        OTHER: 'Custom Event Service',
      };

      const updated = {
        ...existing,
        name: name !== undefined ? name.trim() : existing.name,
        itemType: itemType !== undefined ? itemType.toUpperCase() : (existing.itemType || 'EVENT'),
        category: category !== undefined ? category.toUpperCase() : existing.category,
        categoryName: categoryName || (category ? categoryLabels[category.toUpperCase()] : existing.categoryName),
        description: description !== undefined ? description.trim() : existing.description,
        features: Array.isArray(features) ? features.filter(Boolean) : existing.features,
        includedServices: Array.isArray(includedServices) ? includedServices : (existing.includedServices || []),
        rate: numRate,
        discount: numDiscount,
        finalPrice,
        showPrice: showPrice !== undefined ? Boolean(showPrice) : existing.showPrice,
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : existing.imageUrl,
        status: status !== undefined ? status.toUpperCase() : existing.status,
        setupTime: setupTime !== undefined ? setupTime.trim() : existing.setupTime,
        crewSize: crewSize !== undefined ? crewSize.trim() : existing.crewSize,
        advanceRequired: advanceRequired !== undefined ? advanceRequired.trim() : existing.advanceRequired,
        updatedAt: new Date().toISOString(),
      };

      EVENTS_CATALOG_DATABASE[idx] = updated;
      return sendSuccess(res, 'Item updated successfully', updated);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * DELETE /api/v1/kashi/events/catalog/:id
   */
  async deleteCatalogItem(req, res) {
    try {
      const { id } = req.params;
      const initialLen = EVENTS_CATALOG_DATABASE.length;
      EVENTS_CATALOG_DATABASE = EVENTS_CATALOG_DATABASE.filter((item) => item.id !== id && item._id !== id);

      if (EVENTS_CATALOG_DATABASE.length === initialLen) {
        return sendError(res, 'Event package not found', [], 404);
      }

      return sendSuccess(res, 'Event package deleted successfully', { id });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * PATCH /api/v1/kashi/events/catalog/:id/status
   */
  async toggleCatalogStatus(req, res) {
    try {
      const { id } = req.params;
      const item = EVENTS_CATALOG_DATABASE.find((i) => i.id === id || i._id === id);
      if (!item) return sendError(res, 'Event package not found', [], 404);

      if (req.body && req.body.status) {
        item.status = req.body.status.toUpperCase();
      } else {
        item.status = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      }
      item.updatedAt = new Date().toISOString();

      return sendSuccess(res, `Event package status updated to ${item.status}`, item);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};

