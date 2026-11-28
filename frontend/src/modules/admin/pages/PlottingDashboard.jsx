/**
 * @file PlottingDashboard.jsx
 * @description Master Plotting & Real Estate Workspace for Kashi Plotting Services.
 * Fully managed through Left Sidebar & Top Tabs:
 *   - Overview: KPIs, Revenue Analytics, Quick Actions, Colony Locations
 *   - Inquiries & Booking Requests: Customer Land Requests, Approve, Site Visit Schedule, Direct Call & WhatsApp
 *   - Plots & Land Inventory: Detailed Plot Management with Automation Mode (Rate per Biswa, Road Width,
 *     Front/Depth Dimensions, Landmarks, Family Selection, Nearby Amenities, Discounts, Real-time calculations)
 *   - Media & Video Gallery: Photo & Drone Gallery with Embedded Interactive YouTube Video Player
 *   - Plot Buyers & Clients: Customer Roster, Registry Status, Token & Ledger
 * @module frontend/src/modules/admin/pages/PlottingDashboard
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Trees,
  Home,
  Building,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  FileText,
  BarChart3,
  Box,
  Send,
  X,
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
  Globe,
  Video,
  Play,
  Phone,
  MessageSquare,
  MessageCircle,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Share2,
  Compass,
  ShieldCheck,
  Eye,
  Layers,
  PhoneCall,
  UserCheck,
  DollarSign,
  Upload,
  Camera,
  Film,
} from 'lucide-react';

import { plottingFetcher } from '../../../services/api/admin/adminApi.js';

// ── Default Seed Data for Plots Inventory ──
const INITIAL_PLOTS = [
  {
    id: 'plot_101',
    number: 'A-101',
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
    status: 'SOLD',
    buyer: 'Dr. Amit Tripathi',
    tokenAmount: 100000,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// ── Default Seed Data for Customer Inquiries & Requests ──
const INITIAL_INQUIRIES = [
  {
    id: 'PLT-REQ-101',
    customerName: 'Rajesh Verma',
    customerPhone: '9812345678',
    customerEmail: 'rajesh.verma@outlook.com',
    serviceName: 'Green Valley Enclave - Plot #A-101 (1.5 Biswa)',
    location: 'Varanasi-Prayagraj Expressway',
    preferredDate: '2026-11-29',
    timeSlot: '11:00 AM',
    budget: '₹20,00,000 - ₹25,00,000',
    notes: 'Interested in registry paperwork and 24-month bank loan EMI plan. Wants East-facing plot.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'PLT-REQ-102',
    customerName: 'Sunil Kumar Maurya',
    customerPhone: '9876543210',
    customerEmail: 'sk.maurya@gmail.com',
    serviceName: 'Ganga Enclave Commercial SCO Plot',
    location: 'Ring Road Phase-2, Sarnath',
    preferredDate: '2026-11-30',
    timeSlot: '03:30 PM',
    budget: '₹50,00,000+',
    notes: 'Looking for main highway road frontage for retail pharmacy & clinic showroom.',
    status: 'Approved',
    visitDate: '2026-11-30',
    assignedStaff: 'Vinod Tiwari (Senior Consultant)',
    approvalRemarks: 'Site visit confirmed with buyer. Pick up arranged from Cantt.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'PLT-REQ-103',
    customerName: 'Smt. Anjali Singh',
    customerPhone: '9935123456',
    customerEmail: 'anjali.singh.vns@yahoo.com',
    serviceName: 'Royal Orchid Township - Residential Villa Plot',
    location: 'Babatpur Airport Road',
    preferredDate: '2026-12-02',
    timeSlot: '01:00 PM',
    budget: '₹35,00,000',
    notes: 'Family wants gated society with park facing and 24x7 security for building dream house.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'PLT-REQ-104',
    customerName: 'Vikramaditya Pandey',
    customerPhone: '9794012345',
    customerEmail: 'vikram.pandey@gmail.com',
    serviceName: 'Affordable Residential Plot (1 Biswa)',
    location: 'Mohansarai Ring Road Bypass',
    preferredDate: '2026-12-05',
    timeSlot: '04:00 PM',
    budget: '₹15,00,000',
    notes: 'Immediate token payment ready if 143 conversion paper is verified.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600000 * 45).toISOString(),
  },
];

// ── Default Seed Data for Media Gallery (Photos, Videos & YouTube Links) ──
const INITIAL_GALLERY = [
  {
    id: 'gal_yt_01',
    type: 'YOUTUBE',
    title: 'Drone Aerial Shoot & Complete Site Tour - Kashi Green Valley City',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Sample clean YouTube video
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    colonyName: 'Kashi Green Valley City (Phase 1)',
    category: 'DRONE_AERIAL',
    description: '4K Drone view of 40ft blacktop entrance boulevard, underground drainage and ready-to-build plots in Varanasi.',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'gal_yt_02',
    type: 'YOUTUBE',
    title: 'Customer Site Visit & Client Registry Review - Ganga Enclave SCO',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    youtubeId: 'L_LUpnjgPso',
    thumbnail: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    colonyName: 'Ganga Enclave SCO Commercial Plaza',
    category: 'SITE_TOUR',
    description: 'Actual video discussion with clients during on-spot registry paper verification and landmark inspection.',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'gal_img_01',
    type: 'IMAGE',
    title: 'Main Grand Entrance Arch & 40ft Wide Road Construction',
    imageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=800&q=80',
    colonyName: 'Kashi Green Valley City (Phase 1)',
    category: 'ROAD_CONSTRUCTION',
    description: 'Finished blacktop 40ft sector road with electricity poles and tree plantation.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'gal_img_02',
    type: 'IMAGE',
    title: 'Township Master Layout Map & Boundary Demarcation',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    colonyName: 'Royal Orchid Township',
    category: 'MASTERPLAN',
    description: 'Approved VDA/143 zoned layout showing Sector A, Sector B and central park.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// Helper to extract clean YouTube Video ID from any format of YouTube link
function extractYouTubeId(url) {
  if (!url) return '';
  const cleanUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}

export default function PlottingDashboard({ defaultTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view determined strictly from tab query, route path, or defaultTab
  const tabParam = searchParams.get('tab');
  const getInitialView = () => {
    if (tabParam) return tabParam.toLowerCase();
    if (location.pathname.includes('inquiries') || location.pathname.includes('requests')) return 'requests';
    if (location.pathname.includes('inventory') || location.pathname.includes('plots')) return 'inventory';
    if (location.pathname.includes('gallery') || location.pathname.includes('media')) return 'gallery';
    if (location.pathname.includes('users') || location.pathname.includes('buyers')) return 'users';
    if (location.pathname.includes('agents')) return 'agents';
    if (defaultTab) return defaultTab.toLowerCase();
    return 'overview';
  };

  const [activeView, setActiveView] = useState(getInitialView);

  useEffect(() => {
    if (tabParam) {
      setActiveView(tabParam.toLowerCase());
    } else if (location.pathname.includes('inquiries')) {
      setActiveView('requests');
    } else if (location.pathname.includes('inventory')) {
      setActiveView('inventory');
    } else if (location.pathname.includes('gallery')) {
      setActiveView('gallery');
    } else if (defaultTab) {
      setActiveView(defaultTab.toLowerCase());
    }
  }, [tabParam, defaultTab, location.pathname]);

  const handleTabSwitch = (viewKey) => {
    setActiveView(viewKey);
    setSearchParams({ tab: viewKey });
  };

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 1. PLOTS INVENTORY STATE (Synchronized with Backend REST DB + localStorage fallback)
  // ══════════════════════════════════════════════════════════════════════════
  const [plots, setPlots] = useState(() => {
    try {
      const stored = localStorage.getItem('kashi_plotting_plots');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_PLOTS;
  });

  const [isLoadingPlots, setIsLoadingPlots] = useState(false);
  const [plotsPage, setPlotsPage] = useState(1);
  const [plotsLimit, setPlotsLimit] = useState(6);

  const fetchPlotsFromDb = async () => {
    try {
      setIsLoadingPlots(true);
      const res = await plottingFetcher.listPlots({ status: plotStatusFilter });
      if (res?.data?.plots && Array.isArray(res.data.plots)) {
        setPlots(res.data.plots);
        localStorage.setItem('kashi_plotting_plots', JSON.stringify(res.data.plots));
      }
    } catch (err) {
      console.warn('Backend fetch plots fallback:', err?.message);
    } finally {
      setIsLoadingPlots(false);
    }
  };

  useEffect(() => {
    fetchPlotsFromDb();
  }, [plotStatusFilter]);

  useEffect(() => {
    try {
      localStorage.setItem('kashi_plotting_plots', JSON.stringify(plots));
    } catch (e) {
      console.warn(e);
    }
  }, [plots]);

  // Plots Filter & Search
  const [plotSearch, setPlotSearch] = useState('');
  const [plotStatusFilter, setPlotStatusFilter] = useState('ALL');
  const [plotRoadFilter, setPlotRoadFilter] = useState('ALL');
  const [plotSort, setPlotSort] = useState('newest');

  // Add / Edit Plot Modal State
  const [plotModalOpen, setPlotModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);

  // AUTOMATION MODE FORM STATE for Plot Entry
  const [plotForm, setPlotForm] = useState({
    number: '',
    colonyName: 'Kashi Green Valley City (Phase 1)',
    location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor, UP',
    biswa: '1.5',
    ratePerBiswa: '1500000', // ₹15 Lakh / Biswa
    discount: '50000',
    roadWidth: '30 Ft Wide Blacktop Road',
    frontFt: '30',
    depthFt: '45',
    facing: 'East Facing (Vastu Compliant)',
    landmark: '500m from NH-19 Highway, Near DPS School',
    familyZone: 'Gated Family Residential Township (Park Facing)',
    amenities: ['24x7 Water Pipeline', 'Electricity Transformer', 'RCC Drainage', 'Street LED Lights', 'Gated Security', '143 Conversion Approved'],
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    tokenAmount: '51000',
  });

  // Reactive Automation Calculations
  const autoCalculations = useMemo(() => {
    const b = Number(plotForm.biswa) || 0;
    const r = Number(plotForm.ratePerBiswa) || 0;
    const gross = Math.round(b * r);
    const d = Number(plotForm.discount) || 0;
    const net = Math.max(0, gross - d);
    const sqft = Math.round(b * 900); // 1 Biswa = 900 Sq.Ft in East UP
    const estEmi24 = net > 0 ? Math.round((net * 0.9) / 24) : 0;
    return { gross, net, sqft, estEmi24 };
  }, [plotForm.biswa, plotForm.ratePerBiswa, plotForm.discount]);

  const handleOpenAddPlot = () => {
    setEditingPlot(null);
    setPlotForm({
      number: `A-${Math.floor(100 + Math.random() * 900)}`,
      colonyName: 'Kashi Green Valley City (Phase 1)',
      location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor, UP',
      biswa: '1.5',
      ratePerBiswa: '1500000',
      discount: '50000',
      roadWidth: '30 Ft Wide Blacktop Road',
      frontFt: '30',
      depthFt: '45',
      facing: 'East Facing (Vastu Compliant)',
      landmark: '500m from NH-19 Highway, Near DPS School',
      familyZone: 'Gated Family Residential Township (Park Facing)',
      amenities: ['24x7 Water Pipeline', 'Electricity Transformer', 'RCC Drainage', 'Street LED Lights', 'Gated Security', '143 Conversion Approved'],
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      status: 'AVAILABLE',
      tokenAmount: '51000',
    });
    setPlotModalOpen(true);
  };

  const handleOpenEditPlot = (p) => {
    setEditingPlot(p);
    setPlotForm({
      number: p.number,
      colonyName: p.colonyName,
      location: p.location,
      biswa: String(p.biswa || '1.5'),
      ratePerBiswa: String(p.ratePerBiswa || '1500000'),
      discount: String(p.discount || '0'),
      roadWidth: p.roadWidth || '30 Ft Wide Blacktop Road',
      frontFt: String(p.frontFt || '30'),
      depthFt: String(p.depthFt || '45'),
      facing: p.facing || 'East Facing',
      landmark: p.landmark || '',
      familyZone: p.familyZone || 'Gated Family Residential Township',
      amenities: p.amenities || [],
      imageUrl: p.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      status: p.status || 'AVAILABLE',
      tokenAmount: String(p.tokenAmount || '51000'),
    });
    setPlotModalOpen(true);
  };

  const handleSavePlot = (e) => {
    e.preventDefault();
    const dimensions = `${plotForm.frontFt} × ${plotForm.depthFt} ft`;
    if (editingPlot) {
      setPlots((prev) =>
        prev.map((item) =>
          item.id === editingPlot.id
            ? {
                ...item,
                ...plotForm,
                biswa: Number(plotForm.biswa),
                ratePerBiswa: Number(plotForm.ratePerBiswa),
                grossPrice: autoCalculations.gross,
                discount: Number(plotForm.discount),
                price: autoCalculations.net,
                sizeSqFt: autoCalculations.sqft,
                dimensions,
                frontFt: Number(plotForm.frontFt),
                depthFt: Number(plotForm.depthFt),
                images: [plotForm.imageUrl],
                tokenAmount: Number(plotForm.tokenAmount),
              }
            : item
        )
      );
      showToast(`Plot #${plotForm.number} updated successfully!`);
    } else {
      const newEntry = {
        id: `plot_${Date.now()}`,
        ...plotForm,
        biswa: Number(plotForm.biswa),
        ratePerBiswa: Number(plotForm.ratePerBiswa),
        grossPrice: autoCalculations.gross,
        discount: Number(plotForm.discount),
        price: autoCalculations.net,
        sizeSqFt: autoCalculations.sqft,
        dimensions,
        frontFt: Number(plotForm.frontFt),
        depthFt: Number(plotForm.depthFt),
        images: [plotForm.imageUrl],
        tokenAmount: Number(plotForm.tokenAmount),
        createdAt: new Date().toISOString(),
      };
      setPlots((prev) => [newEntry, ...prev]);
      showToast(`New Plot #${plotForm.number} added to inventory!`);
    }
    setPlotModalOpen(false);
  };

  const handleDeletePlot = (plotId) => {
    if (window.confirm('Are you sure you want to delete this plot from inventory?')) {
      setPlots((prev) => prev.filter((p) => p.id !== plotId));
      showToast('Plot deleted from inventory.');
    }
  };

  const handleTogglePlotStatus = (plotId) => {
    setPlots((prev) =>
      prev.map((p) => {
        if (p.id !== plotId) return p;
        const nextStatus = p.status === 'AVAILABLE' ? 'BOOKED' : p.status === 'BOOKED' ? 'SOLD' : 'AVAILABLE';
        return { ...p, status: nextStatus };
      })
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 2. INQUIRIES & CUSTOMER BOOKING REQUESTS STATE (Synchronized with Backend DB)
  // ══════════════════════════════════════════════════════════════════════════
  const [inquiries, setInquiries] = useState(() => {
    try {
      const stored = localStorage.getItem('all_customer_service_requests');
      if (stored) {
        const all = JSON.parse(stored);
        const plottingOnes = all.filter((r) => r.serviceType === 'plotting');
        if (plottingOnes.length > 0) return plottingOnes;
      }
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_INQUIRIES;
  });

  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [inquiriesLimit, setInquiriesLimit] = useState(5);

  const fetchInquiriesFromDb = async () => {
    try {
      setIsLoadingInquiries(true);
      const res = await plottingFetcher.listInquiries({ status: inquiryStatusFilter });
      if (res?.data?.inquiries && Array.isArray(res.data.inquiries)) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.warn('Backend fetch inquiries fallback:', err?.message);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInquiriesFromDb();
  }, [inquiryStatusFilter]);

  // Inquiries Filters
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [inquirySort, setInquirySort] = useState('newest');
  const [expandedInquiryId, setExpandedInquiryId] = useState(null);

  // Approval Modal State
  const [approveModalInquiry, setApproveModalInquiry] = useState(null);
  const [approveForm, setApproveForm] = useState({
    visitDate: '',
    timeSlot: '11:00 AM',
    assignedStaff: 'Vinod Tiwari (Senior Consultant)',
    remarks: 'Approved. Pick-up arranged from Cantt Station for site inspection.',
  });

  // Call Discussion Log Modal State
  const [callModalInquiry, setCallModalInquiry] = useState(null);
  const [callNote, setCallNote] = useState('Spoke with customer. They confirmed interest in East-facing plot and requested Sunday 11 AM site visit.');

  const handleOpenApproveModal = (inq) => {
    setApproveModalInquiry(inq);
    setApproveForm({
      visitDate: inq.preferredDate || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      timeSlot: inq.timeSlot || '11:00 AM',
      assignedStaff: 'Vinod Tiwari (Senior Consultant)',
      remarks: 'Site visit approved. Dedicated vehicle and legal 143 conversion docs file prepared.',
    });
  };

  const handleConfirmApproval = (e) => {
    e.preventDefault();
    if (!approveModalInquiry) return;
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === approveModalInquiry.id
          ? {
              ...item,
              status: 'Approved',
              visitDate: approveForm.visitDate,
              timeSlot: approveForm.timeSlot,
              assignedStaff: approveForm.assignedStaff,
              approvalRemarks: approveForm.remarks,
            }
          : item
      )
    );
    showToast(`Request #${approveModalInquiry.id} approved! Site visit scheduled.`);
    setApproveModalInquiry(null);
  };

  const handleSaveCallLog = (e) => {
    e.preventDefault();
    if (!callModalInquiry) return;
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === callModalInquiry.id
          ? {
              ...item,
              lastCallAt: new Date().toISOString(),
              callNotes: callNote,
              status: item.status === 'Pending' ? 'Contacted' : item.status,
            }
          : item
      )
    );
    showToast(`Call notes recorded for ${callModalInquiry.customerName}.`);
    setCallModalInquiry(null);
  };

  const handleRejectInquiry = (inqId) => {
    const reason = window.prompt('Enter reason for cancellation / archiving:', 'Budget mismatch / plot not available');
    if (reason !== null) {
      setInquiries((prev) =>
        prev.map((item) => (item.id === inqId ? { ...item, status: 'Cancelled', cancelReason: reason } : item))
      );
      showToast('Inquiry status updated to Cancelled.');
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 3. MEDIA & VIDEO GALLERY STATE (Synchronized with Backend DB)
  // ══════════════════════════════════════════════════════════════════════════
  const [gallery, setGallery] = useState(() => {
    try {
      const stored = localStorage.getItem('kashi_plotting_gallery');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_GALLERY;
  });

  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryLimit, setGalleryLimit] = useState(6);

  const fetchGalleryFromDb = async () => {
    try {
      setIsLoadingGallery(true);
      const res = await plottingFetcher.listGallery({ type: galleryFilter });
      if (res?.data?.items && Array.isArray(res.data.items)) {
        setGallery(res.data.items);
      }
    } catch (err) {
      console.warn('Backend fetch gallery fallback:', err?.message);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    fetchGalleryFromDb();
  }, [galleryFilter]);

  useEffect(() => {
    try {
      localStorage.setItem('kashi_plotting_gallery', JSON.stringify(gallery));
    } catch (e) {
      console.warn(e);
    }
  }, [gallery]);

  const [galleryFilter, setGalleryFilter] = useState('ALL'); // 'ALL' | 'YOUTUBE' | 'IMAGE' | 'DRONE'
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  const [mediaForm, setMediaForm] = useState({
    type: 'YOUTUBE', // 'YOUTUBE' | 'IMAGE'
    title: '',
    youtubeUrl: '',
    imageUrl: '',
    colonyName: 'Kashi Green Valley City (Phase 1)',
    category: 'DRONE_AERIAL',
    description: '',
  });

  const handleSaveMedia = (e) => {
    e.preventDefault();
    if (mediaForm.type === 'YOUTUBE') {
      const yId = extractYouTubeId(mediaForm.youtubeUrl);
      if (!yId) {
        alert('Please enter a valid YouTube video link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)');
        return;
      }
      const newMedia = {
        id: `gal_yt_${Date.now()}`,
        type: 'YOUTUBE',
        title: mediaForm.title || 'Project Drone & Site Video',
        youtubeUrl: mediaForm.youtubeUrl,
        youtubeId: yId,
        thumbnail: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
        colonyName: mediaForm.colonyName,
        category: mediaForm.category,
        description: mediaForm.description,
        createdAt: new Date().toISOString(),
      };
      setGallery((prev) => [newMedia, ...prev]);
      showToast('YouTube video successfully embedded into project gallery!');
    } else {
      const newMedia = {
        id: `gal_img_${Date.now()}`,
        type: 'IMAGE',
        title: mediaForm.title || 'Township Site Photo',
        imageUrl: mediaForm.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        colonyName: mediaForm.colonyName,
        category: mediaForm.category,
        description: mediaForm.description,
        createdAt: new Date().toISOString(),
      };
      setGallery((prev) => [newMedia, ...prev]);
      showToast('Project photo added to gallery!');
    }
    setMediaModalOpen(false);
  };

  const handleDeleteMedia = (id) => {
    if (window.confirm('Delete this media item from gallery?')) {
      setGallery((prev) => prev.filter((m) => m.id !== id));
      showToast('Media removed.');
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // FILTERED DATASETS
  // ══════════════════════════════════════════════════════════════════════════
  const filteredPlots = useMemo(() => {
    return plots
      .filter((p) => {
        if (plotStatusFilter !== 'ALL' && p.status !== plotStatusFilter) return false;
        if (plotRoadFilter !== 'ALL' && !p.roadWidth?.toLowerCase().includes(plotRoadFilter.toLowerCase())) return false;
        if (!plotSearch.trim()) return true;
        const q = plotSearch.toLowerCase();
        return (
          p.number?.toLowerCase().includes(q) ||
          p.colonyName?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.landmark?.toLowerCase().includes(q) ||
          p.facing?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (plotSort === 'price_low') return a.price - b.price;
        if (plotSort === 'price_high') return b.price - a.price;
        if (plotSort === 'size_high') return b.biswa - a.biswa;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [plots, plotStatusFilter, plotRoadFilter, plotSearch, plotSort]);

  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        if (inquiryStatusFilter !== 'ALL' && inq.status?.toUpperCase() !== inquiryStatusFilter.toUpperCase()) return false;
        if (!inquirySearch.trim()) return true;
        const q = inquirySearch.toLowerCase();
        return (
          inq.customerName?.toLowerCase().includes(q) ||
          inq.customerPhone?.toLowerCase().includes(q) ||
          inq.serviceName?.toLowerCase().includes(q) ||
          inq.location?.toLowerCase().includes(q) ||
          inq.id?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (inquirySort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [inquiries, inquiryStatusFilter, inquirySearch, inquirySort]);

  const filteredGallery = useMemo(() => {
    return gallery.filter((m) => {
      if (galleryFilter === 'YOUTUBE') return m.type === 'YOUTUBE';
      if (galleryFilter === 'IMAGE') return m.type === 'IMAGE';
      if (galleryFilter === 'DRONE') return m.category === 'DRONE_AERIAL';
      return true;
    });
  }, [gallery, galleryFilter]);

  const paginatedInquiries = useMemo(() => {
    const startIndex = (inquiriesPage - 1) * inquiriesLimit;
    return filteredInquiries.slice(startIndex, startIndex + inquiriesLimit);
  }, [filteredInquiries, inquiriesPage, inquiriesLimit]);

  const totalInquiriesPages = Math.max(1, Math.ceil(filteredInquiries.length / inquiriesLimit));

  const paginatedPlots = useMemo(() => {
    const startIndex = (plotsPage - 1) * plotsLimit;
    return filteredPlots.slice(startIndex, startIndex + plotsLimit);
  }, [filteredPlots, plotsPage, plotsLimit]);

  const totalPlotsPages = Math.max(1, Math.ceil(filteredPlots.length / plotsLimit));

  const paginatedGallery = useMemo(() => {
    const startIndex = (galleryPage - 1) * galleryLimit;
    return filteredGallery.slice(startIndex, startIndex + galleryLimit);
  }, [filteredGallery, galleryPage, galleryLimit]);

  const totalGalleryPages = Math.max(1, Math.ceil(filteredGallery.length / galleryLimit));

  // Overall KPI counts
  const availablePlotsCount = plots.filter((p) => p.status === 'AVAILABLE').length;
  const bookedPlotsCount = plots.filter((p) => p.status === 'BOOKED').length;
  const soldPlotsCount = plots.filter((p) => p.status === 'SOLD').length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status?.toLowerCase() === 'pending').length;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1e293b', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* ── Top Header with Branding, Live Status & Quick Tabs ── */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trees size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', letterSpacing: '-0.02em' }}>
                Kashi Plotting & Real Estate Master
              </h1>
              <span style={{ fontSize: '11px', background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                VDA Approved 143
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Colony Masterplans, Land Inquiries, Plot Inventory & Media Gallery
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/plotting')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid #a7f3d0',
              background: '#ecfdf5',
              color: '#047857',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Globe size={14} />
            <span>View Public Storefront</span>
          </button>

          <button
            onClick={handleOpenAddPlot}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Plus size={15} />
            <span>+ Add New Plot</span>
          </button>
        </div>
      </header>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 99999,
            background: '#064e3b',
            color: '#a7f3d0',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 800,
            border: '1px solid #059669',
          }}
        >
          <Sparkles size={16} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Content View Switcher ── */}
      <main style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 1: OVERVIEW DASHBOARD
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 4 Top KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trees size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>TOTAL PLOTS MANAGED</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{plots.length}</div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>🟢 {availablePlotsCount} Available Now</div>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>INCOMING INQUIRIES</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{inquiries.length}</div>
                  <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 700 }}>⏳ {pendingInquiriesCount} Pending Site Visits</div>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Film size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>DRONE & VIDEO TOURS</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{gallery.length}</div>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>🎥 Interactive YouTube Embeds</div>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>TOTAL PLOT REVENUE</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>₹1.85 Cr</div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>🪙 {bookedPlotsCount + soldPlotsCount} Booked / Sold</div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div
                onClick={() => handleTabSwitch('requests')}
                style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#6ee7b7' }}>Customer Portal</div>
                  <h3 style={{ margin: '6px 0', fontSize: '1.25rem', fontWeight: 900 }}>Customer Inquiries & Site Visits</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#d1fae5', lineHeight: 1.4 }}>
                    Review customer applications for land plots, schedule site visits, call prospective buyers, and log discussion remarks.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', color: '#6ee7b7' }}>
                  <span>Open {pendingInquiriesCount} Pending Leads</span>
                  <ArrowRight size={15} />
                </div>
              </div>

              <div
                onClick={() => handleTabSwitch('inventory')}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#059669' }}>Land Inventory</div>
                  <h3 style={{ margin: '6px 0', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Plots Catalog & Rate Master</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
                    Manage Lakh per Biswa rates, 25-40ft road widths, front & depth dimensions, landmark tags, family amenities, and live automation pricing.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', color: '#059669' }}>
                  <span>Manage {plots.length} Plots</span>
                  <ArrowRight size={15} />
                </div>
              </div>

              <div
                onClick={() => handleTabSwitch('gallery')}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626' }}>Media & Video</div>
                  <h3 style={{ margin: '6px 0', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>YouTube Drone & Video Player</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
                    Embed full YouTube drone shoot walkthroughs, client review videos, entrance photos, and VDA approved master layout plans.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', color: '#dc2626' }}>
                  <span>Watch & Embed Videos</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>

            {/* Quick Preview Table: Recent Inquiries */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Latest Customer Inquiries for Plots</h3>
                <button
                  onClick={() => handleTabSwitch('requests')}
                  style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                >
                  View All ({inquiries.length}) →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 12px' }}>Customer</th>
                      <th style={{ padding: '10px 12px' }}>Plot Requested</th>
                      <th style={{ padding: '10px 12px' }}>Location</th>
                      <th style={{ padding: '10px 12px' }}>Budget</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                      <th style={{ padding: '10px 12px' }}>Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 4).map((inq) => (
                      <tr key={inq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{inq.customerName}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>📞 {inq.customerPhone}</div>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{inq.serviceName}</td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{inq.location || 'Varanasi Corridor'}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#059669' }}>{inq.budget || '₹20,00,000'}</td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: inq.status === 'Approved' ? '#dcfce7' : '#fef3c7',
                              color: inq.status === 'Approved' ? '#16a34a' : '#d97706',
                            }}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <a
                              href={`tel:${inq.customerPhone}`}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: '#ecfdf5',
                                color: '#059669',
                                textDecoration: 'none',
                                fontWeight: 800,
                                fontSize: '11.5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Phone size={12} />
                              <span>Call</span>
                            </a>
                            <button
                              onClick={() => handleOpenApproveModal(inq)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#fff',
                                color: '#0f172a',
                                fontWeight: 700,
                                fontSize: '11.5px',
                                cursor: 'pointer',
                              }}
                            >
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 2: INQUIRIES & CUSTOMER LEADS LIST (WITH APPROVE & CALL OPTIONS)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', margin: 0 }}>
                    Plot Inquiries & Booking Applications
                  </h2>
                  <span style={{ fontSize: '11px', background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    {inquiries.length} Inquiries
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                  Review prospective plot buyers, schedule site visits, dial directly, and record discussion notes.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    const name = window.prompt('Enter customer name:');
                    if (!name) return;
                    const phone = window.prompt('Enter customer phone:');
                    const plot = window.prompt('Enter plot/project name:', 'Kashi Green Valley City - Plot #A-108');
                    const budget = window.prompt('Enter budget (e.g. ₹20,00,000):', '₹20,00,000');
                    const newReq = {
                      id: `PLT-WALK-${Date.now().toString().slice(-4)}`,
                      customerName: name,
                      customerPhone: phone || '9876543210',
                      customerEmail: '',
                      serviceName: plot || 'Residential Land Plot',
                      location: 'Varanasi',
                      preferredDate: new Date().toISOString().slice(0, 10),
                      budget: budget || '₹20,00,000',
                      notes: 'Walk-in / Phone inquiry registered by Admin.',
                      status: 'Pending',
                      createdAt: new Date().toISOString(),
                    };
                    setInquiries((prev) => [newReq, ...prev]);
                    showToast(`Inquiry added for ${name}`);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#059669',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Plus size={14} />
                  <span>+ Add Walk-In Lead</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '260px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search by customer name, phone, plot or location..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600, color: '#334155' }}
                >
                  <option value="ALL">All Statuses ({inquiries.length})</option>
                  <option value="PENDING">Pending Approval ({pendingInquiriesCount})</option>
                  <option value="APPROVED">Approved / Visit Scheduled</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={inquirySort}
                  onChange={(e) => setInquirySort(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600, color: '#334155' }}
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>

            {/* Modern, Space-Saving Inquiries Table Format */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
              {filteredInquiries.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <FileText size={38} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>No Plot Inquiries Found</div>
                  <div style={{ fontSize: '13px' }}>Try clearing your search query or status filter.</div>
                </div>
              ) : (
                <>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '12px 14px' }}>Lead ID & Date</th>
                        <th style={{ padding: '12px 14px' }}>Buyer Name & Contact</th>
                        <th style={{ padding: '12px 14px' }}>Interested Plot / Township</th>
                        <th style={{ padding: '12px 14px' }}>Budget & Preferred Date</th>
                        <th style={{ padding: '12px 14px' }}>Status</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInquiries.map((inq) => {
                        const isApproved = inq.status === 'Approved';
                        const isPending = inq.status === 'Pending';
                        const isExpanded = expandedInquiryId === inq.id;

                        return (
                          <React.Fragment key={inq.id}>
                            <tr
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                background: isExpanded ? '#f8fafc' : '#ffffff',
                                transition: 'background 0.15s ease',
                              }}
                            >
                              {/* Lead ID & Date */}
                              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '12px' }}>
                                  {inq.id}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                  {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                              </td>

                              {/* Customer Contact */}
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>
                                  {inq.customerName}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                                  <Phone size={12} />
                                  <span>{inq.customerPhone}</span>
                                </div>
                                {inq.customerEmail && (
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                                    {inq.customerEmail}
                                  </div>
                                )}
                              </td>

                              {/* Interested Plot & Location */}
                              <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                                <div style={{ fontWeight: 700, color: '#1e293b' }}>
                                  {inq.serviceName}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                  📍 {inq.location || 'Varanasi Corridor'}
                                </div>
                              </td>

                              {/* Budget & Date */}
                              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 800, color: '#047857' }}>
                                  {inq.budget || '₹20,00,000'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                  Date: {inq.preferredDate || 'Flexible'}
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td style={{ padding: '12px 14px' }}>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    background: isApproved ? '#ecfdf5' : isPending ? '#fef3c7' : '#f1f5f9',
                                    color: isApproved ? '#047857' : isPending ? '#b45309' : '#475569',
                                    display: 'inline-block',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {inq.status}
                                </span>
                              </td>

                              {/* Quick Action Buttons */}
                              <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  {/* Call */}
                                  <a
                                    href={`tel:${inq.customerPhone}`}
                                    onClick={() => setCallModalInquiry(inq)}
                                    title="Call Buyer"
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      background: '#ecfdf5',
                                      color: '#047857',
                                      border: '1px solid #a7f3d0',
                                      textDecoration: 'none',
                                      fontWeight: 800,
                                      fontSize: '11.5px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                  >
                                    <PhoneCall size={13} />
                                    <span>Call</span>
                                  </a>

                                  {/* WhatsApp */}
                                  <a
                                    href={`https://wa.me/91${inq.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Namaste ${inq.customerName}, this is regarding your inquiry for ${inq.serviceName} at Kashi Plotting & Real Estate. We have prime VDA approved plots ready. Would you like to schedule a site visit?`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="WhatsApp Chat"
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      background: '#25D366',
                                      color: '#ffffff',
                                      textDecoration: 'none',
                                      fontWeight: 800,
                                      fontSize: '11.5px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                  >
                                    <MessageCircle size={13} />
                                    <span>WhatsApp</span>
                                  </a>

                                  {/* Approve / Schedule */}
                                  {!isApproved ? (
                                    <button
                                      onClick={() => handleOpenApproveModal(inq)}
                                      title="Approve & Schedule Site Visit"
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        background: '#047857',
                                        color: '#ffffff',
                                        border: 'none',
                                        fontWeight: 800,
                                        fontSize: '11.5px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                      }}
                                    >
                                      <Check size={13} />
                                      <span>Approve</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenApproveModal(inq)}
                                      title="Update Visit Schedule"
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        background: '#f1f5f9',
                                        color: '#334155',
                                        border: '1px solid #cbd5e1',
                                        fontWeight: 700,
                                        fontSize: '11.5px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                      }}
                                    >
                                      <Edit3 size={13} />
                                      <span>Edit Visit</span>
                                    </button>
                                  )}

                                  {/* Toggle Details */}
                                  <button
                                    onClick={() => setExpandedInquiryId(isExpanded ? null : inq.id)}
                                    style={{
                                      padding: '6px 8px',
                                      borderRadius: '6px',
                                      border: '1px solid #cbd5e1',
                                      background: isExpanded ? '#0f172a' : '#ffffff',
                                      color: isExpanded ? '#ffffff' : '#475569',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                    }}
                                  >
                                    {isExpanded ? 'Hide' : 'Details'}
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Expandable Details Row */}
                            {isExpanded && (
                              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <td colSpan={6} style={{ padding: '12px 18px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {inq.notes && (
                                      <div style={{ fontSize: '12px', color: '#475569', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <strong>Inquiry Remarks:</strong> "{inq.notes}"
                                      </div>
                                    )}

                                    {isApproved && (
                                      <div style={{ fontSize: '12px', color: '#065f46', background: '#ecfdf5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                        <span>✅ <strong>Site Visit:</strong> {inq.visitDate} ({inq.timeSlot || '11:00 AM'})</span>
                                        <span>👤 <strong>Consultant:</strong> {inq.assignedStaff || 'Senior Property Lead'}</span>
                                        {inq.approvalRemarks && <span>📝 <em>{inq.approvalRemarks}</em></span>}
                                      </div>
                                    )}

                                    {inq.callNotes && (
                                      <div style={{ fontSize: '12px', color: '#0369a1', background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                                        📞 <strong>Last Call Note:</strong> {inq.callNotes}
                                      </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                                      <button
                                        onClick={() => handleRejectInquiry(inq.id)}
                                        style={{
                                          background: 'transparent',
                                          border: 'none',
                                          color: '#ef4444',
                                          fontSize: '11.5px',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          padding: 0,
                                        }}
                                      >
                                        Cancel / Archive Inquiry
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Inquiries Pagination Bar */}
                <div
                  style={{
                    padding: '12px 18px',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#64748b',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    Showing {(inquiriesPage - 1) * inquiriesLimit + 1} to {Math.min(inquiriesPage * inquiriesLimit, filteredInquiries.length)} of {filteredInquiries.length} Inquiries
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      disabled={inquiriesPage <= 1}
                      onClick={() => setInquiriesPage((p) => Math.max(1, p - 1))}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: inquiriesPage <= 1 ? '#f1f5f9' : '#ffffff',
                        color: inquiriesPage <= 1 ? '#94a3b8' : '#0f172a',
                        fontWeight: 700,
                        cursor: inquiriesPage <= 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Previous
                    </button>
                    <div style={{ padding: '0 8px', fontWeight: 800, color: '#0f172a' }}>
                      Page {inquiriesPage} of {totalInquiriesPages}
                    </div>
                    <button
                      type="button"
                      disabled={inquiriesPage >= totalInquiriesPages}
                      onClick={() => setInquiriesPage((p) => Math.min(totalInquiriesPages, p + 1))}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: inquiriesPage >= totalInquiriesPages ? '#f1f5f9' : '#ffffff',
                        color: inquiriesPage >= totalInquiriesPages ? '#94a3b8' : '#0f172a',
                        fontWeight: 700,
                        cursor: inquiriesPage >= totalInquiriesPages ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 3: PLOTS & LAND INVENTORY (WITH AUTOMATION CALCULATOR & SPECS)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', margin: 0 }}>
                    Plots & Land Inventory Master
                  </h2>
                  <span style={{ fontSize: '11px', background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    {plots.length} Plots Total
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                  Rate per Biswa, Road Widths, Front & Height Dimensions, Landmarks, Family Gated Amenities, and Automation Pricing.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleOpenAddPlot}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(5, 150, 105, 0.25)',
                  }}
                >
                  <Plus size={16} />
                  <span>+ Add New Plot</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>TOTAL PLOTS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{plots.length}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669' }}>🟢 AVAILABLE FOR SALE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669' }}>{availablePlotsCount}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#d97706' }}>🟡 BOOKED / ADVANCE PAID</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706' }}>{bookedPlotsCount}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#dc2626' }}>🔴 SOLD & REGISTERED</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>{soldPlotsCount}</div>
              </div>
            </div>

            {/* Search & Filters */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="text"
                  value={plotSearch}
                  onChange={(e) => setPlotSearch(e.target.value)}
                  placeholder="Search by plot number, colony, landmark or road width..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={plotStatusFilter}
                  onChange={(e) => setPlotStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600, color: '#334155' }}
                >
                  <option value="ALL">All Status ({plots.length})</option>
                  <option value="AVAILABLE">Available Only ({availablePlotsCount})</option>
                  <option value="BOOKED">Booked ({bookedPlotsCount})</option>
                  <option value="SOLD">Sold ({soldPlotsCount})</option>
                </select>

                <select
                  value={plotRoadFilter}
                  onChange={(e) => setPlotRoadFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600, color: '#334155' }}
                >
                  <option value="ALL">All Road Widths</option>
                  <option value="25 Ft">25 Ft Road</option>
                  <option value="30 Ft">30 Ft Road</option>
                  <option value="40 Ft">40 Ft Main Boulevard</option>
                  <option value="60 Ft">60 Ft Commercial Highway</option>
                </select>

                <select
                  value={plotSort}
                  onChange={(e) => setPlotSort(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600, color: '#334155' }}
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="size_high">Area: Largest First</option>
                </select>
              </div>
            </div>

            {/* Plots Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {paginatedPlots.map((p) => {
                const isAvail = p.status === 'AVAILABLE';
                const isBooked = p.status === 'BOOKED';
                const isSold = p.status === 'SOLD';

                return (
                  <div
                    key={p.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* Plot Image Preview with Status Badge */}
                    <div style={{ position: 'relative', height: '170px', background: '#0f172a' }}>
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'}
                        alt={p.number}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 900,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        Plot #{p.number}
                      </div>

                      <div
                        onClick={() => handleTogglePlotStatus(p.id)}
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: isAvail ? '#16a34a' : isBooked ? '#d97706' : '#dc2626',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        }}
                        title="Click to toggle status"
                      >
                        {p.status}
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          bottom: 10,
                          left: 10,
                          background: 'rgba(0, 0, 0, 0.75)',
                          color: '#a7f3d0',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        🛣️ {p.roadWidth}
                      </div>
                    </div>

                    {/* Plot Details Content */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                          {p.colonyName}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                          📍 {p.location}
                        </div>

                        {/* Specs Grid: Biswa, Rate/Biswa, Dimensions, Facing */}
                        <div
                          style={{
                            background: '#f8fafc',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            fontSize: '12px',
                            border: '1px solid #f1f5f9',
                            marginBottom: '10px',
                          }}
                        >
                          <div>
                            <span style={{ color: '#64748b' }}>Plot Area:</span>
                            <div style={{ fontWeight: 800, color: '#065f46' }}>
                              {p.biswa} Biswa ({p.sizeSqFt || p.biswa * 900} sq.ft)
                            </div>
                          </div>

                          <div>
                            <span style={{ color: '#64748b' }}>Rate per Biswa:</span>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>
                              ₹{(p.ratePerBiswa / 100000).toFixed(1)} Lakh / Biswa
                            </div>
                          </div>

                          <div>
                            <span style={{ color: '#64748b' }}>Front × Depth:</span>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.dimensions}</div>
                          </div>

                          <div>
                            <span style={{ color: '#64748b' }}>Facing:</span>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.facing || 'East'}</div>
                          </div>
                        </div>

                        {/* Landmark and Family Selection */}
                        {p.landmark && (
                          <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '6px' }}>
                            🏛️ <strong>Landmark:</strong> {p.landmark}
                          </div>
                        )}
                        {p.familyZone && (
                          <div style={{ fontSize: '11.5px', color: '#047857', marginBottom: '8px' }}>
                            🏡 <strong>Society:</strong> {p.familyZone}
                          </div>
                        )}

                        {/* Price & Discount */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>
                            ₹{Number(p.price).toLocaleString('en-IN')}
                          </span>
                          {p.discount > 0 && (
                            <span style={{ fontSize: '11.5px', color: '#94a3b8', textDecoration: 'line-through' }}>
                              ₹{Number(p.grossPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                          {p.discount > 0 && (
                            <span style={{ fontSize: '10.5px', color: '#dc2626', fontWeight: 800, background: '#fee2e2', padding: '1px 6px', borderRadius: '4px' }}>
                              ₹{(p.discount / 1000).toFixed(0)}k Off
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <button
                          onClick={() => handleOpenEditPlot(p)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#fff',
                            color: '#334155',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleTogglePlotStatus(p.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isAvail ? '#ecfdf5' : '#f8fafc',
                            color: isAvail ? '#047857' : '#475569',
                            fontWeight: 800,
                            fontSize: '11.5px',
                            cursor: 'pointer',
                          }}
                        >
                          {isAvail ? 'Mark Booked' : isBooked ? 'Mark Sold' : 'Make Available'}
                        </button>

                        <button
                          onClick={() => handleDeletePlot(p.id)}
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            background: '#fff1f2',
                            color: '#dc2626',
                            cursor: 'pointer',
                          }}
                          title="Delete plot"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gallery Pagination Bar */}
            <div
              style={{
                padding: '12px 18px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '12.5px',
                color: '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontWeight: 600 }}>
                Showing {(galleryPage - 1) * galleryLimit + 1} to {Math.min(galleryPage * galleryLimit, filteredGallery.length)} of {filteredGallery.length} Media Items
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  disabled={galleryPage <= 1}
                  onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: galleryPage <= 1 ? '#f1f5f9' : '#ffffff',
                    color: galleryPage <= 1 ? '#94a3b8' : '#0f172a',
                    fontWeight: 700,
                    cursor: galleryPage <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <div style={{ padding: '0 8px', fontWeight: 800, color: '#0f172a' }}>
                  Page {galleryPage} of {totalGalleryPages}
                </div>
                <button
                  type="button"
                  disabled={galleryPage >= totalGalleryPages}
                  onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages, p + 1))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: galleryPage >= totalGalleryPages ? '#f1f5f9' : '#ffffff',
                    color: galleryPage >= totalGalleryPages ? '#94a3b8' : '#0f172a',
                    fontWeight: 700,
                    cursor: galleryPage >= totalGalleryPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 4: PROJECT MEDIA & VIDEO GALLERY (WITH YOUTUBE VIDEO PLAYER)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'gallery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                    Project Video & YouTube Drone Gallery
                  </h2>
                  <span style={{ fontSize: '11px', background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    {gallery.length} Media Items
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                  Embed and play YouTube drone site tour videos, client testimonials, 40ft road photos, and VDA layout blueprints.
                </div>
              </div>

              <button
                onClick={() => {
                  setMediaForm({
                    type: 'YOUTUBE',
                    title: '',
                    youtubeUrl: '',
                    imageUrl: '',
                    colonyName: 'Kashi Green Valley City (Phase 1)',
                    category: 'DRONE_AERIAL',
                    description: '',
                  });
                  setMediaModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(220, 38, 38, 0.25)',
                }}
              >
                <Plus size={16} />
                <span>+ Embed Video / Add Photo</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {[
                { id: 'ALL', label: 'All Media' },
                { id: 'YOUTUBE', label: '🎥 YouTube Drone & Tours' },
                { id: 'IMAGE', label: '📷 High-Res Site Photos' },
                { id: 'DRONE', label: '🚁 Aerial Shoots' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGalleryFilter(f.id)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '8px',
                    border: `1.5px solid ${galleryFilter === f.id ? '#dc2626' : '#cbd5e1'}`,
                    background: galleryFilter === f.id ? '#fef2f2' : '#ffffff',
                    color: galleryFilter === f.id ? '#991b1b' : '#475569',
                    fontSize: '12.5px',
                    fontWeight: galleryFilter === f.id ? 800 : 600,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Media Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {paginatedGallery.map((m) => {
                const isYouTube = m.type === 'YOUTUBE';

                return (
                  <div
                    key={m.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* Media Player / Image Area */}
                    <div style={{ position: 'relative', width: '100%', height: '220px', background: '#000000' }}>
                      {isYouTube && m.youtubeId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${m.youtubeId}`}
                          title={m.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                      ) : (
                        <img
                          src={m.imageUrl || m.thumbnail}
                          alt={m.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => setPreviewMedia(m)}
                        />
                      )}

                      {/* Tag Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: isYouTube ? '#dc2626' : 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          pointerEvents: 'none',
                        }}
                      >
                        {isYouTube ? <span>▶ YouTube Video</span> : <span>📷 Photo</span>}
                      </div>
                    </div>

                    {/* Media Information */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 800, textTransform: 'uppercase' }}>
                          {m.colonyName}
                        </div>
                        <h4 style={{ margin: '4px 0 6px', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3 }}>
                          {m.title}
                        </h4>
                        {m.description && (
                          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.4 }}>
                            {m.description}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        {isYouTube && m.youtubeUrl && (
                          <a
                            href={m.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#dc2626',
                              textDecoration: 'none',
                            }}
                          >
                            <span>Open on YouTube</span>
                            <ExternalLink size={12} />
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteMedia(m.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gallery Pagination Bar */}
            <div
              style={{
                padding: '12px 18px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '12.5px',
                color: '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontWeight: 600 }}>
                Showing {(galleryPage - 1) * galleryLimit + 1} to {Math.min(galleryPage * galleryLimit, filteredGallery.length)} of {filteredGallery.length} Media Items
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  disabled={galleryPage <= 1}
                  onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: galleryPage <= 1 ? '#f1f5f9' : '#ffffff',
                    color: galleryPage <= 1 ? '#94a3b8' : '#0f172a',
                    fontWeight: 700,
                    cursor: galleryPage <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>
                <div style={{ padding: '0 8px', fontWeight: 800, color: '#0f172a' }}>
                  Page {galleryPage} of {totalGalleryPages}
                </div>
                <button
                  type="button"
                  disabled={galleryPage >= totalGalleryPages}
                  onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages, p + 1))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: galleryPage >= totalGalleryPages ? '#f1f5f9' : '#ffffff',
                    color: galleryPage >= totalGalleryPages ? '#94a3b8' : '#0f172a',
                    fontWeight: 700,
                    cursor: galleryPage >= totalGalleryPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 1: ADD / EDIT PLOT WITH AUTOMATION MODE CALCULATOR
          ════════════════════════════════════════════════════════════════════════ */}
      {plotModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#064e3b' }}>
                  {editingPlot ? `Edit Plot #${editingPlot.number}` : '+ Add New Plot to Inventory'}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Real-time automation mode for rate per biswa, dimensions, road width and net pricing.
                </div>
              </div>
              <button
                onClick={() => setPlotModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlot} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Row 1: Plot Number & Colony Project */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Plot Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={plotForm.number}
                    onChange={(e) => setPlotForm({ ...plotForm, number: e.target.value })}
                    placeholder="e.g. A-101"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Colony / Township Project *
                  </label>
                  <select
                    value={plotForm.colonyName}
                    onChange={(e) => setPlotForm({ ...plotForm, colonyName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="Kashi Green Valley City (Phase 1)">Kashi Green Valley City (Phase 1)</option>
                    <option value="Ganga Enclave SCO Commercial Plaza">Ganga Enclave SCO Commercial Plaza</option>
                    <option value="Royal Orchid Township">Royal Orchid Township</option>
                    <option value="Kashi Vihar Smart City Corridor">Kashi Vihar Smart City Corridor</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Location ("kha ka hai") */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Location Address ("Zameen Kahan Ka Hai") *
                </label>
                <input
                  type="text"
                  required
                  value={plotForm.location}
                  onChange={(e) => setPlotForm({ ...plotForm, location: e.target.value })}
                  placeholder="e.g. Varanasi-Prayagraj 6-Lane Expressway Corridor, UP"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* AUTOMATION MODE BOX: Biswa, Rate/Biswa, Discount & Live Price */}
              <div
                style={{
                  background: '#f0fdf4',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1.5px solid #86efac',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#166534' }}>
                  <Sparkles size={15} color="#16a34a" />
                  <span>AUTOMATION PRICING CALCULATOR (Live Real-Time Calculations)</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Area in Biswa *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={plotForm.biswa}
                      onChange={(e) => setPlotForm({ ...plotForm, biswa: e.target.value })}
                      placeholder="e.g. 1.5"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                      ≈ {autoCalculations.sqft} Sq.Ft
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Rate per Biswa (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={plotForm.ratePerBiswa}
                      onChange={(e) => setPlotForm({ ...plotForm, ratePerBiswa: e.target.value })}
                      placeholder="e.g. 1500000"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                      ₹{(Number(plotForm.ratePerBiswa) / 100000).toFixed(1)} Lakh / Biswa
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Discount Offer (₹)
                    </label>
                    <input
                      type="number"
                      value={plotForm.discount}
                      onChange={(e) => setPlotForm({ ...plotForm, discount: e.target.value })}
                      placeholder="e.g. 50000"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#166534', display: 'block', marginBottom: '4px' }}>
                      Calculated Net Price
                    </label>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#047857', padding: '6px 0' }}>
                      ₹{autoCalculations.net.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Road Width & Dimensions (Front & Depth/Height) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Road Width ("Sadak Chaurai") *
                  </label>
                  <select
                    value={plotForm.roadWidth}
                    onChange={(e) => setPlotForm({ ...plotForm, roadWidth: e.target.value })}
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="20 Ft Wide Interlocking Road">20 Ft Road</option>
                    <option value="25 Ft Interlocking Road">25 Ft Road</option>
                    <option value="30 Ft Wide Blacktop Road">30 Ft Wide Blacktop Road</option>
                    <option value="40 Ft Main Boulevard Road">40 Ft Main Boulevard</option>
                    <option value="60 Ft Commercial Highway">60 Ft Commercial Corridor</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Front Width (Ft)
                  </label>
                  <input
                    type="number"
                    value={plotForm.frontFt}
                    onChange={(e) => setPlotForm({ ...plotForm, frontFt: e.target.value })}
                    placeholder="e.g. 30"
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Depth / Height (Ft)
                  </label>
                  <input
                    type="number"
                    value={plotForm.depthFt}
                    onChange={(e) => setPlotForm({ ...plotForm, depthFt: e.target.value })}
                    placeholder="e.g. 45"
                    style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 5: Facing & Landmark */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Facing / Vastu Orientation
                  </label>
                  <select
                    value={plotForm.facing}
                    onChange={(e) => setPlotForm({ ...plotForm, facing: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="East Facing (Vastu Compliant)">East Facing (Vastu Compliant)</option>
                    <option value="North Facing Corner">North Facing Corner</option>
                    <option value="North-East Facing (Ishan Kon)">North-East Facing (Ishan Kon)</option>
                    <option value="West Facing Park View">West Facing Park View</option>
                    <option value="Highway Frontage Commercial SCO">Highway Frontage Commercial SCO</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Landmark Nearby ("Landmark Details")
                  </label>
                  <input
                    type="text"
                    value={plotForm.landmark}
                    onChange={(e) => setPlotForm({ ...plotForm, landmark: e.target.value })}
                    placeholder="e.g. 500m from NH-19 Highway, Near DPS School"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Row 6: Family Selection & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Family / Society Selection
                  </label>
                  <input
                    type="text"
                    value={plotForm.familyZone}
                    onChange={(e) => setPlotForm({ ...plotForm, familyZone: e.target.value })}
                    placeholder="e.g. Gated Family Residential Township (Park Facing)"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Plot Availability Status
                  </label>
                  <select
                    value={plotForm.status}
                    onChange={(e) => setPlotForm({ ...plotForm, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="AVAILABLE">AVAILABLE (For Sale)</option>
                    <option value="BOOKED">BOOKED (Advance Token Received)</option>
                    <option value="SOLD">SOLD & REGISTERED</option>
                  </select>
                </div>
              </div>

              {/* Row 7: Plot Image / Blueprint Picker */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Plot Photo / Layout Blueprint (Upload File or Enter URL)
                </label>
                
                {/* Clean, Simple Image Picker Box */}
                <div
                  style={{
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => document.getElementById('plot-layout-file-input')?.click()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#16a34a';
                    e.currentTarget.style.background = '#f0fdf4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Upload size={18} color="#16a34a" />
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                      Click to choose plot photo / blueprint from device
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>
                    Auto-resizes & fits smoothly (PNG, JPG, WebP)
                  </div>
                  <input
                    id="plot-layout-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setPlotForm((prev) => ({ ...prev, imageUrl: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="url"
                    value={plotForm.imageUrl.startsWith('data:image') ? 'Uploaded from device (Image Ready)' : plotForm.imageUrl}
                    onChange={(e) => {
                      if (!e.target.value.startsWith('Uploaded')) {
                        setPlotForm({ ...plotForm, imageUrl: e.target.value });
                      }
                    }}
                    placeholder="Or enter image URL: https://images.unsplash.com/..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12.5px',
                      boxSizing: 'border-box',
                      color: plotForm.imageUrl.startsWith('data:image') ? '#16a34a' : '#0f172a',
                      fontWeight: plotForm.imageUrl.startsWith('data:image') ? 700 : 500,
                    }}
                  />
                  {plotForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setPlotForm({ ...plotForm, imageUrl: '' })}
                      style={{
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontWeight: 700,
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {plotForm.imageUrl && (
                  <div
                    style={{
                      marginTop: '10px',
                      borderRadius: '10px',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ maxHeight: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px' }}>
                      <img
                        src={plotForm.imageUrl}
                        alt="Plot Blueprint Preview"
                        style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                      />
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      Preview ready • Auto-scaled to natural proportions
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPlotModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                  }}
                >
                  {editingPlot ? 'Save Changes' : 'Add Plot to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 2: APPROVE INQUIRY & SCHEDULE SITE VISIT
          ════════════════════════════════════════════════════════════════════════ */}
      {approveModalInquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '520px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#064e3b' }}>
                  Approve Plot Inquiry & Schedule Visit
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Customer: <strong>{approveModalInquiry.customerName}</strong> ({approveModalInquiry.customerPhone})
                </div>
              </div>
              <button onClick={() => setApproveModalInquiry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Site Visit Date *
                </label>
                <input
                  type="date"
                  required
                  value={approveForm.visitDate}
                  onChange={(e) => setApproveForm({ ...approveForm, visitDate: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Time Slot *
                </label>
                <select
                  value={approveForm.timeSlot}
                  onChange={(e) => setApproveForm({ ...approveForm, timeSlot: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="10:00 AM">10:00 AM (Morning Shift)</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:30 PM">02:30 PM (Afternoon Shift)</option>
                  <option value="04:30 PM">04:30 PM (Evening Sunset Tour)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Assigned Field Consultant
                </label>
                <input
                  type="text"
                  value={approveForm.assignedStaff}
                  onChange={(e) => setApproveForm({ ...approveForm, assignedStaff: e.target.value })}
                  placeholder="e.g. Vinod Tiwari (Senior Consultant)"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Approval Remarks & Instructions
                </label>
                <textarea
                  rows={2}
                  value={approveForm.remarks}
                  onChange={(e) => setApproveForm({ ...approveForm, remarks: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setApproveModalInquiry(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 3: LOG CALL DISCUSSION
          ════════════════════════════════════════════════════════════════════════ */}
      {callModalInquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  Log Call with {callModalInquiry.customerName}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Dialed number: <strong>{callModalInquiry.customerPhone}</strong>
                </div>
              </div>
              <button onClick={() => setCallModalInquiry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCallLog} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Discussion Notes & Customer Remarks
                </label>
                <textarea
                  rows={4}
                  required
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  placeholder="e.g. Spoke with buyer. They are looking for 2 Biswa East-facing plot on 30ft road, budget 25L. Will visit with family Sunday."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCallModalInquiry(null)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700 }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 4: EMBED YOUTUBE VIDEO OR ADD PROJECT PHOTO
          ════════════════════════════════════════════════════════════════════════ */}
      {mediaModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '580px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#991b1b' }}>
                  + Embed YouTube Video or Add Site Photo
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Drone shoots, customer reviews, layout walkthroughs and colony entrance photos.
                </div>
              </div>
              <button onClick={() => setMediaModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Type Switcher */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setMediaForm({ ...mediaForm, type: 'YOUTUBE' })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: `2px solid ${mediaForm.type === 'YOUTUBE' ? '#dc2626' : '#cbd5e1'}`,
                    background: mediaForm.type === 'YOUTUBE' ? '#fef2f2' : '#fff',
                    color: mediaForm.type === 'YOUTUBE' ? '#991b1b' : '#475569',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  🎥 YouTube Video Link
                </button>
                <button
                  type="button"
                  onClick={() => setMediaForm({ ...mediaForm, type: 'IMAGE' })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: `2px solid ${mediaForm.type === 'IMAGE' ? '#059669' : '#cbd5e1'}`,
                    background: mediaForm.type === 'IMAGE' ? '#ecfdf5' : '#fff',
                    color: mediaForm.type === 'IMAGE' ? '#065f46' : '#475569',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  📷 High-Res Photo
                </button>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Media Title *
                </label>
                <input
                  type="text"
                  required
                  value={mediaForm.title}
                  onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                  placeholder="e.g. 4K Drone Shoot - Kashi Green Valley 40ft Entrance Road"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {mediaForm.type === 'YOUTUBE' ? (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626', display: 'block', marginBottom: '4px' }}>
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={mediaForm.youtubeUrl}
                    onChange={(e) => setMediaForm({ ...mediaForm, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #fca5a5', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                    Paste standard YouTube link. It will automatically play directly in the gallery!
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#047857', display: 'block', marginBottom: '4px' }}>
                    Photo Selection (Device File or Web URL) *
                  </label>

                  {/* Clean, Simple Image Picker Box */}
                  <div
                    style={{
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => document.getElementById('plotting-photo-file-input')?.click()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#16a34a';
                      e.currentTarget.style.background = '#f0fdf4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Upload size={18} color="#16a34a" />
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                        Click to choose image file from device
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>
                      Auto-resizes & fits smoothly (PNG, JPG, WebP)
                    </div>
                    <input
                      id="plotting-photo-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setMediaForm((prev) => ({ ...prev, imageUrl: event.target.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="url"
                      value={mediaForm.imageUrl.startsWith('data:image') ? 'Uploaded from device (Image Ready)' : mediaForm.imageUrl}
                      onChange={(e) => {
                        if (!e.target.value.startsWith('Uploaded')) {
                          setMediaForm({ ...mediaForm, imageUrl: e.target.value });
                        }
                      }}
                      placeholder="Or enter image URL: https://images.unsplash.com/..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        boxSizing: 'border-box',
                        color: mediaForm.imageUrl.startsWith('data:image') ? '#16a34a' : '#0f172a',
                        fontWeight: mediaForm.imageUrl.startsWith('data:image') ? 700 : 500,
                      }}
                    />
                    {mediaForm.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setMediaForm({ ...mediaForm, imageUrl: '' })}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontWeight: 700,
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {mediaForm.imageUrl && (
                    <div
                      style={{
                        marginTop: '10px',
                        borderRadius: '10px',
                        padding: '10px',
                        border: '1px solid #e2e8f0',
                        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ maxHeight: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px' }}>
                        <img
                          src={mediaForm.imageUrl}
                          alt="Preview"
                          style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                        />
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        Photo loaded • Fits proportionally
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Colony / Project
                  </label>
                  <select
                    value={mediaForm.colonyName}
                    onChange={(e) => setMediaForm({ ...mediaForm, colonyName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                  >
                    <option value="Kashi Green Valley City (Phase 1)">Kashi Green Valley City (Phase 1)</option>
                    <option value="Ganga Enclave SCO Commercial Plaza">Ganga Enclave SCO Commercial Plaza</option>
                    <option value="Royal Orchid Township">Royal Orchid Township</option>
                    <option value="Kashi Vihar Smart City Corridor">Kashi Vihar Smart City Corridor</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Media Category
                  </label>
                  <select
                    value={mediaForm.category}
                    onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                  >
                    <option value="DRONE_AERIAL">Drone Aerial Shoot</option>
                    <option value="SITE_TOUR">Site Walkthrough & Tour</option>
                    <option value="ROAD_CONSTRUCTION">Road & Drainage Work</option>
                    <option value="MASTERPLAN">Masterplan Layout Map</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Description / Caption
                </label>
                <textarea
                  rows={2}
                  value={mediaForm.description}
                  onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                  placeholder="e.g. 4K site review showing completed blacktop roads and transformer installation."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: mediaForm.type === 'YOUTUBE' ? '#dc2626' : '#059669',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {mediaForm.type === 'YOUTUBE' ? 'Embed YouTube Video' : 'Add Site Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 5: PHOTO LIGHTBOX PREVIEW
          ════════════════════════════════════════════════════════════════════════ */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={previewMedia.imageUrl || previewMedia.thumbnail}
              alt={previewMedia.title}
              style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            />
            <div style={{ marginTop: '1rem', color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>
              {previewMedia.title}
            </div>
            <div style={{ color: '#a7f3d0', fontSize: '13px' }}>
              📍 {previewMedia.colonyName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
