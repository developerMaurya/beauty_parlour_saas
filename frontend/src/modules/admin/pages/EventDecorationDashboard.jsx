/**
 * @file EventDecorationDashboard.jsx
 * @description Master Luxury Admin Panel for "Jay Gurudev Event & Management"
 * Specializing in:
 *   - Aadiyogi Theme Wedding Stage (Mahadev Bust + Sun Rays Aura + Nandi + Trishul + Damru)
 *   - Royal Bridal Entry (15ft Illuminated Flower Arch Tunnel + Carpet)
 *   - Cold Pyro Fireworks & Dry Ice Heavy Cloud Fog Machines
 *   - Real-time Proposal & Quotations Management
 *   - Inventory Tracker for Sculptures, Stage Platforms, Hardware & Lighting
 *   - Client & Couple Directory with Advance Payment Ledgers
 * @module frontend/src/modules/admin/pages/EventDecorationDashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  PartyPopper, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Music, 
  Camera, 
  Utensils, 
  QrCode,
  Flame,
  CloudRain,
  Phone,
  ExternalLink,
  Plus,
  Eye,
  Layers,
  Crown,
  Search,
  Filter,
  ChevronDown,
  X,
  FileText,
  Share2,
  Check,
  TrendingUp,
  Box,
  Truck,
  Wrench,
  AlertCircle,
  MessageCircle,
  Maximize2,
  Edit3,
  Trash2,
  Tag,
  Upload,
  AlertTriangle,
  ArrowUpDown,
  Image as ImageIcon
} from 'lucide-react';
import { eventCatalogFetcher } from '../../../services/api/admin/adminApi.js';

export const EVENT_CATEGORIES = [
  { id: 'STAGE_DECORATION', label: 'Stage Decoration & Setup', icon: '🏛️', short: 'Stage' },
  { id: 'BRIDAL_ENTRY', label: 'Royal Bridal Entry & Walkways', icon: '👑', short: 'Bridal Entry' },
  { id: 'VARMALA_STAGE', label: 'Hydraulic & Revolving Varmala Stage', icon: '💍', short: 'Varmala Stage' },
  { id: 'SPECIAL_EFFECTS', label: 'Cold Pyro, Fog & Fireworks', icon: '🎆', short: 'Special Effects' },
  { id: 'HALDI_MEHENDI', label: 'Haldi, Mehendi & Sangeet', icon: '🌸', short: 'Haldi/Mehendi' },
  { id: 'COMPLETE_THEME', label: 'Complete Grand Theme Package', icon: '🏰', short: 'Complete Theme' },
  { id: 'OTHER', label: 'Custom Event Service', icon: '✨', short: 'Other' },
];

const PRESET_EVENT_IMAGES = [
  { label: '🔱 Aadiyogi Mahadev Stage', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80' },
  { label: '👑 15ft Flower Arch Entry', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80' },
  { label: '🎆 Cold Pyro & Cloud Fog', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80' },
  { label: '💍 Hydraulic Varmala Stage', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80' },
  { label: '🌸 Marigold Haldi Decor', url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1000&q=80' },
  { label: '🏰 Royal Palace Theme', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80' },
];

export function EventDecorationDashboard({ defaultTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Tab evaluation from query param (?tab=events) or prop or route
  const tabParam = searchParams.get('tab');
  const getInitialTab = () => {
    if (tabParam) return tabParam.toUpperCase();
    if (location.pathname.includes('event-packages')) {
      return 'PACKAGES';
    }
    if (
      location.pathname.includes('event-services') ||
      location.pathname.includes('event-catalog')
    ) {
      return 'EVENTS';
    }
    if (defaultTab) return defaultTab.toUpperCase();
    return 'DASHBOARD';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam.toUpperCase());
    } else if (defaultTab) {
      setActiveTab(defaultTab.toUpperCase());
    }
  }, [tabParam, defaultTab, location.pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [venueFilter, setVenueFilter] = useState('ALL');
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [rangeFilter, setRangeFilter] = useState('Wedding Season 2026');
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);

  // Modals state
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [newProposalModalOpen, setNewProposalModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT CATALOG STATE & CRUD DATA (Synced with backend + localStorage)
  // ══════════════════════════════════════════════════════════════════════════
  const [eventCatalogList, setEventCatalogList] = useState(() => {
    try {
      const stored = localStorage.getItem('jaygurudev_event_catalog');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'evt_srv_101',
        _id: 'evt_srv_101',
        itemType: 'EVENT',
        name: 'Aadiyogi Theme Grand Wedding Stage (20ft)',
        category: 'STAGE_DECORATION',
        categoryName: 'Stage Decoration & Setup',
        description: 'Spectacular 20ft Mahadev Bust sculpture with golden sun rays aura, Nandi statue, Trishul & Damru centerpiece with programmed warm lighting.',
        features: [
          '20ft High-density Fiberglass Mahadev Bust',
          '360° Circular Sun Rays LED Warm Amber Backlight',
          'Sacred Trishul & Damru Brass Artifacts',
          'Sculpted Nandi Bull Floral Enclosure',
          '40x24ft Heavy Duty Iron Rigging Platform',
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
          'Matching Entry Gate Welcome Signage',
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
          'Dedicated Trained Pyro Technician on site',
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
      },
      {
        id: 'evt_srv_104',
        _id: 'evt_srv_104',
        itemType: 'EVENT',
        name: 'Royal Hydraulic Revolving Varmala Stage',
        category: 'VARMALA_STAGE',
        categoryName: 'Hydraulic & Revolving Varmala Stage',
        description: 'Automated hydraulic rotating round stage with floral railing, golden pillars and remote elevation for the grand garland exchange ceremony.',
        features: [
          '12ft Diameter Rotating Platform with speed regulator',
          '6ft Hydraulic Vertical Elevation System',
          'Embedded LED Ring Lights & Brass Urli Accents',
          'Safety Railing wrapped in White Carnations',
          'Synchronized Pyro Trigger upon garland exchange',
        ],
        includedServices: [],
        rate: 120000,
        discount: 15000,
        finalPrice: 105000,
        showPrice: true,
        imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
        status: 'ACTIVE',
        setupTime: '4-5 Hours',
        crewSize: '4 Hydraulic Techs',
        advanceRequired: '40% Advance',
      },
      {
        id: 'evt_srv_105',
        _id: 'evt_srv_105',
        itemType: 'EVENT',
        name: 'Traditional Marigold Haldi & Mehendi Cabana Decor',
        category: 'HALDI_MEHENDI',
        categoryName: 'Haldi, Mehendi & Sangeet',
        description: 'Vibrant yellow and orange fresh marigold floral canopies with traditional brass urlis, colorful kites, floral swings, and Rajasthani cushions.',
        features: [
          '10x10ft Fresh Marigold Canopy with Tassels',
          '5ft Handcrafted Floral Jhoola (Swing)',
          'Brass Urli for Flower Petal Bathing Ceremony',
          '8 Floor Gaddi Mattresses with Bandhani Cushions',
          'Photo Booth with Antique Rickshaw / Cycle Prop',
        ],
        includedServices: [],
        rate: 65000,
        discount: 5000,
        finalPrice: 60000,
        showPrice: true,
        imageUrl: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1000&q=80',
        status: 'ACTIVE',
        setupTime: '3 Hours',
        crewSize: '4 Decorators',
        advanceRequired: '30% Advance',
      },
      {
        id: 'evt_pkg_201',
        _id: 'evt_pkg_201',
        itemType: 'PACKAGE',
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
          { id: 'evt_srv_103', name: 'Cold Pyro Fireworks & Heavy Dry Ice Cloud Fog Machine', price: 45000, category: 'SPECIAL_EFFECTS' },
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
          'Bundle: Hydraulic & Revolving Varmala Stage (Worth ₹1,20,000)',
          'Bundle: Royal Bridal Entry: 15ft Illuminated Flower Arch Tunnel (Worth ₹95,000)',
          'Bundle: Cold Pyro Sparkle Blasts & Dry Ice Cloud Fog (Worth ₹45,000)',
          'Combined Spectacular Experience with ₹40,000 Package Discount',
        ],
        includedServices: [
          { id: 'evt_srv_104', name: 'Royal Hydraulic Revolving Varmala Stage', price: 120000, category: 'VARMALA_STAGE' },
          { id: 'evt_srv_102', name: 'Royal Bridal Entry: 15ft Illuminated Flower Arch Tunnel', price: 95000, category: 'BRIDAL_ENTRY' },
          { id: 'evt_srv_103', name: 'Cold Pyro Fireworks & Heavy Dry Ice Cloud Fog Machine', price: 45000, category: 'SPECIAL_EFFECTS' },
        ],
        rate: 260000,
        discount: 40000,
        finalPrice: 220000,
        showPrice: true,
        imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
        status: 'ACTIVE',
        setupTime: '6-7 Hours',
        crewSize: '10 Technicians & Operators',
        advanceRequired: '35% Advance',
      },
    ];
  });

  // DB Sync for Event Catalog
  useEffect(() => {
    let isMounted = true;
    eventCatalogFetcher.list({})
      .then((res) => {
        const items = res?.data?.data?.items || res?.data?.items || res?.data?.data;
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setEventCatalogList(items);
          localStorage.setItem('jaygurudev_event_catalog', JSON.stringify(items));
        }
      })
      .catch((err) => console.warn('Event catalog sync err:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search state for Event Catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('ALL');
  const [catalogStatusFilter, setCatalogStatusFilter] = useState('ALL');
  const [catalogSort, setCatalogSort] = useState('newest');

  // Add / Edit Modal state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    name: '',
    itemType: 'EVENT',
    category: 'STAGE_DECORATION',
    description: '',
    features: [''],
    includedServices: [],
    rate: '',
    discount: '',
    showPrice: true,
    imageUrl: '',
    status: 'ACTIVE',
    setupTime: '',
    crewSize: '',
    advanceRequired: '',
  });
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState(null);
  const [previewEventModal, setPreviewEventModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Open modal to add an individual Event Service
  const handleOpenAddEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      name: '',
      itemType: 'EVENT',
      category: 'STAGE_DECORATION',
      description: '',
      features: [
        'High-grade Premium Materials & Rigging',
        'Warm Tone Atmospheric LED Lighting',
        'Experienced On-site Technical Operator',
      ],
      includedServices: [],
      rate: '',
      discount: '',
      showPrice: true,
      imageUrl: PRESET_EVENT_IMAGES[0].url,
      status: 'ACTIVE',
      setupTime: '4-6 Hours',
      crewSize: '6 Master Crew',
      advanceRequired: '40% Advance',
    });
    setNewFeatureInput('');
    setEventModalOpen(true);
  };

  // Open modal to add a combo Package bundling multiple Event Services
  const handleOpenAddPackageModal = () => {
    setEditingEvent(null);
    setEventForm({
      name: '',
      itemType: 'PACKAGE',
      category: 'COMPLETE_THEME',
      description: '',
      features: [
        'Complete Theme Staging with Multiple Services Bundled',
        'Dedicated On-site Production Director',
        'Combined Discount Savings on Package Booking',
      ],
      includedServices: [],
      rate: '',
      discount: '',
      showPrice: true,
      imageUrl: PRESET_EVENT_IMAGES[0].url,
      status: 'ACTIVE',
      setupTime: '8-10 Hours',
      crewSize: '12-15 Master Crew',
      advanceRequired: '40% Advance',
    });
    setNewFeatureInput('');
    setEventModalOpen(true);
  };

  // Legacy fallback for general add button
  const handleOpenAddModal = () => {
    if (activeTab === 'PACKAGES') {
      handleOpenAddPackageModal();
    } else {
      handleOpenAddEventModal();
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingEvent(item);
    setEventForm({
      name: item.name || '',
      itemType: (item.itemType || (item.includedServices && item.includedServices.length > 0 ? 'PACKAGE' : 'EVENT')).toUpperCase(),
      category: item.category || 'STAGE_DECORATION',
      description: item.description || '',
      features: Array.isArray(item.features) && item.features.length > 0 ? [...item.features] : [''],
      includedServices: Array.isArray(item.includedServices) ? [...item.includedServices] : [],
      rate: item.rate !== undefined && item.rate !== null ? item.rate : '',
      discount: item.discount !== undefined && item.discount !== null ? item.discount : '',
      showPrice: item.showPrice !== undefined ? Boolean(item.showPrice) : true,
      imageUrl: item.imageUrl || '',
      status: item.status || 'ACTIVE',
      setupTime: item.setupTime || '',
      crewSize: item.crewSize || '',
      advanceRequired: item.advanceRequired || '',
    });
    setNewFeatureInput('');
    setEventModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setEventForm((prev) => ({
      ...prev,
      features: [...prev.features.filter(Boolean), newFeatureInput.trim()],
    }));
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setEventForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  // Toggle selection of an individual event service inside a package
  const handleToggleServiceInPackage = (service) => {
    const sId = service.id || service._id;
    setEventForm((prev) => {
      const exists = prev.includedServices.some((s) => (s.id || s._id) === sId);
      let updatedServices;
      if (exists) {
        updatedServices = prev.includedServices.filter((s) => (s.id || s._id) !== sId);
      } else {
        updatedServices = [
          ...prev.includedServices,
          {
            id: sId,
            _id: sId,
            name: service.name,
            price: Number(service.finalPrice || service.rate) || 0,
            category: service.category,
          },
        ];
      }

      // Auto-calculate suggested package price if rate not customized yet or empty
      const totalSuggestedRate = updatedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
      return {
        ...prev,
        includedServices: updatedServices,
        rate: prev.rate === '' || prev.rate === 0 ? totalSuggestedRate : prev.rate,
      };
    });
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEventForm((prev) => ({ ...prev, imageUrl: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.name.trim()) return;

    const numRate = Number(eventForm.rate) || 0;
    const numDiscount = Number(eventForm.discount) || 0;
    const finalPrice = Math.max(0, numRate - numDiscount);

    const categoryObj = EVENT_CATEGORIES.find((c) => c.id === eventForm.category) || EVENT_CATEGORIES[0];

    const payload = {
      name: eventForm.name.trim(),
      itemType: (eventForm.itemType || 'EVENT').toUpperCase(),
      category: eventForm.category,
      categoryName: categoryObj.label,
      description: eventForm.description.trim(),
      features: eventForm.features.filter(Boolean),
      includedServices: eventForm.itemType === 'PACKAGE' ? eventForm.includedServices : [],
      rate: numRate,
      discount: numDiscount,
      finalPrice,
      showPrice: Boolean(eventForm.showPrice),
      imageUrl: eventForm.imageUrl.trim() || PRESET_EVENT_IMAGES[0].url,
      status: eventForm.status || 'ACTIVE',
      setupTime: eventForm.setupTime.trim() || '3-5 Hours',
      crewSize: eventForm.crewSize.trim() || '4-6 Crew',
      advanceRequired: eventForm.advanceRequired.trim() || '30% Advance',
    };

    if (editingEvent) {
      const targetId = editingEvent.id || editingEvent._id;
      const updated = eventCatalogList.map((item) =>
        item.id === targetId || item._id === targetId
          ? { ...item, ...payload, updatedAt: new Date().toISOString() }
          : item
      );
      setEventCatalogList(updated);
      localStorage.setItem('jaygurudev_event_catalog', JSON.stringify(updated));
      triggerToast(`✓ ${payload.itemType === 'PACKAGE' ? 'Event package' : 'Event service'} "${payload.name}" updated successfully!`);
      setEventModalOpen(false);
      setEditingEvent(null);

      try {
        await eventCatalogFetcher.update(targetId, payload);
      } catch (err) {
        console.warn('API update event catalog error:', err);
      }
    } else {
      const newItem = {
        id: payload.itemType === 'PACKAGE' ? `evt_pkg_${Date.now()}` : `evt_srv_${Date.now()}`,
        _id: payload.itemType === 'PACKAGE' ? `evt_pkg_${Date.now()}` : `evt_srv_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...eventCatalogList];
      setEventCatalogList(updated);
      localStorage.setItem('jaygurudev_event_catalog', JSON.stringify(updated));
      triggerToast(`✓ New ${newItem.itemType === 'PACKAGE' ? 'Event Package' : 'Event Service'} "${newItem.name}" added to catalog!`);
      setEventModalOpen(false);

      try {
        await eventCatalogFetcher.create(payload);
      } catch (err) {
        console.warn('API create event catalog error:', err);
      }
    }
  };

  const handleToggleStatus = async (item) => {
    const targetId = item.id || item._id;
    const newStatus = (item.status || 'ACTIVE') === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = eventCatalogList.map((i) =>
      i.id === targetId || i._id === targetId ? { ...i, status: newStatus } : i
    );
    setEventCatalogList(updated);
    localStorage.setItem('jaygurudev_event_catalog', JSON.stringify(updated));
    triggerToast(`Status changed to ${newStatus} for "${item.name}"`);

    try {
      await eventCatalogFetcher.toggleStatus(targetId, { status: newStatus });
    } catch (err) {
      console.warn('API status toggle error:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmEvent) return;
    const targetId = deleteConfirmEvent.id || deleteConfirmEvent._id;
    const updated = eventCatalogList.filter((i) => i.id !== targetId && i._id !== targetId);
    setEventCatalogList(updated);
    localStorage.setItem('jaygurudev_event_catalog', JSON.stringify(updated));
    triggerToast(`Event package "${deleteConfirmEvent.name}" deleted.`);
    setDeleteConfirmEvent(null);

    try {
      await eventCatalogFetcher.delete(targetId);
    } catch (err) {
      console.warn('API delete event error:', err);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 1. EVENT CONTRACTS & BOOKINGS DATA
  // ══════════════════════════════════════════════════════════════════════════
  const [eventContracts, setEventContracts] = useState([
    {
      id: 'JGD-2026-01',
      client: 'Rahul Sharma & Sneha',
      phone: '+91 98765 43210',
      type: 'Aadiyogi Theme Stage (20ft) + Royal Bridal Entry Arch',
      date: '18 Nov 2026',
      venue: 'Sarnath Heritage Lawn, Varanasi',
      status: 'In Production',
      totalAmount: 275000,
      advancePaid: 150000,
      balance: 125000,
      crewLead: 'Vikram Singh (Stage Master)',
      effects: 'Cold Pyro (8 Guns) + Dry Ice Cloud Fog',
    },
    {
      id: 'JGD-2026-02',
      client: 'Priya & Amit Wedding Gala',
      phone: '+91 94152 88910',
      type: 'Aadiyogi Grand Theme + 15ft Flower Tunnel + Jaimala Platform',
      date: '22 Nov 2026',
      venue: 'Taj Nadesar Convention Grounds',
      status: 'Confirmed',
      totalAmount: 340000,
      advancePaid: 200000,
      balance: 140000,
      crewLead: 'Sunil Verma (Florist Chief)',
      effects: 'Imported Orchids + LED Sun Rays Aura',
    },
    {
      id: 'JGD-2026-03',
      client: 'Verma Sangeet & Cocktail',
      phone: '+91 91200 44556',
      type: '30ft Curved LED Stage + Dynamic Lighting Truss',
      date: '25 Nov 2026',
      venue: 'Riviera Riverfront Lawns, Sigra',
      status: 'Confirmed',
      totalAmount: 220000,
      advancePaid: 100000,
      balance: 120000,
      crewLead: 'Rakesh Yadav (Lighting Tech)',
      effects: 'Sound Line-Array + 4 Pyro Guns',
    },
    {
      id: 'JGD-2026-04',
      client: 'Mishra 25th Silver Jubilee',
      phone: '+91 98390 11223',
      type: 'Golden Royale Floral Arch Mandap & Banquet Theme',
      date: '30 Nov 2026',
      venue: 'Grand Regal Palace, Cantt',
      status: 'Planning',
      totalAmount: 150000,
      advancePaid: 50000,
      balance: 100000,
      crewLead: 'Manoj Kumar (Fabricator)',
      effects: 'Fresh Roses + Velvet Draping',
    },
    {
      id: 'JGD-2026-05',
      client: 'Gupta Destination Wedding',
      phone: '+91 94500 77889',
      type: 'Aadiyogi Full Production + 30ft Glowing Floral Tunnel',
      date: '05 Dec 2026',
      venue: 'Ganga View Palace Grounds, Babatpur',
      status: 'Confirmed',
      totalAmount: 420000,
      advancePaid: 250000,
      balance: 170000,
      crewLead: 'Vikram Singh (Stage Master)',
      effects: '12 Pyro Guns + Dual Fog Machines',
    },
  ]);

  // ══════════════════════════════════════════════════════════════════════════
  // 2. PROPOSALS & QUOTATIONS DATA (Syncs with website)
  // ══════════════════════════════════════════════════════════════════════════
  const [proposals, setProposals] = useState([
    {
      id: 'PROP-101',
      clientName: 'Deepak Agrawal',
      phone: '+91 99351 22334',
      eventType: 'Wedding & Jaimala',
      date: '12 Dec 2026',
      venue: 'Kashi Vishwanath Corridor Lawn',
      stageSize: '20ft x 15ft Standard Grand',
      includeAadiyogi: true,
      bridalEntry: '15ft Glowing Flower Arch Tunnel',
      effects: 'Stage + 1st Entry (Fog + 8 Pyro)',
      flowerType: 'Fresh Orchids + Silk Florals',
      amount: 285000,
      status: 'Pending Review',
      createdDate: '10 Nov 2026',
    },
    {
      id: 'PROP-102',
      clientName: 'Sanjay Maurya',
      phone: '+91 98890 55667',
      eventType: 'Grand Sangeet & Reception',
      date: '15 Dec 2026',
      venue: 'Sarnath Luxury Resort',
      stageSize: '30ft x 20ft Mega Lawn',
      includeAadiyogi: true,
      bridalEntry: '30ft Grand Canopy Tunnel',
      effects: 'Dual Cloud Fog + 12 Pyro Guns',
      flowerType: 'Imported Dutch Exotic',
      amount: 375000,
      status: 'Accepted',
      createdDate: '09 Nov 2026',
    },
    {
      id: 'PROP-103',
      clientName: 'Ananya Pandey',
      phone: '+91 97920 12345',
      eventType: 'Haldi & Mehendi Celebration',
      date: '20 Dec 2026',
      venue: 'Cantt Officers Club Grounds',
      stageSize: '20ft Stage Platform',
      includeAadiyogi: false,
      bridalEntry: 'Simple Flower Pedestal Path',
      effects: 'No Pyro / Mild Fog',
      flowerType: 'Marigold & Sunflowers',
      amount: 110000,
      status: 'Proposal Sent',
      createdDate: '08 Nov 2026',
    },
  ]);

  // Read live proposals generated from public website from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jay_gurudev_proposals');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProposals((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const newItems = parsed.filter((p) => !ids.has(p.id));
            return [...newItems, ...prev];
          });
        }
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // 3. HARDWARE & STAGE INVENTORY LEDGER
  // ══════════════════════════════════════════════════════════════════════════
  const [inventory, setInventory] = useState([
    {
      id: 'INV-01',
      name: 'Aadiyogi Lord Shiva Bust Sculptures (High-Detail Black Finish)',
      category: 'Backdrop Sculpture',
      total: 2,
      inUse: 1,
      available: 1,
      location: 'Workshop Warehouse / Sarnath Heritage Lawn',
      condition: 'Excellent (Protective Wrapped)',
      img: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
    },
    {
      id: 'INV-02',
      name: 'Nandi Idols with Golden Jewelry Ornaments',
      category: 'Divine Sculpture',
      total: 2,
      inUse: 1,
      available: 1,
      location: 'Workshop Bay 2',
      condition: 'Pristine Gold Coating',
      img: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
    },
    {
      id: 'INV-03',
      name: 'Golden Damru Sets & Golden Trishul Steel Pillars',
      category: 'Stage Emblems',
      total: 8,
      inUse: 4,
      available: 4,
      location: 'Central Rigging Rack',
      condition: 'High Gloss Metallic Finish',
      img: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
    },
    {
      id: 'INV-04',
      name: 'Circular Glowing Flower Arches (Bridal Entry Rings)',
      category: 'Bridal Walkway',
      total: 12,
      inUse: 6,
      available: 6,
      location: 'Transit Trolleys (Bhaisodi)',
      condition: 'LED Strip Tested OK',
      img: '/images/events/flower_arch_tunnel.jpg',
    },
    {
      id: 'INV-05',
      name: 'Cold Pyro Sparkular Machines (Indoor/Outdoor Safe Non-Flammable)',
      category: 'Special Effects',
      total: 16,
      inUse: 8,
      available: 8,
      location: 'AV Tech Room',
      condition: 'Safety Certified Zero-Smoke',
      img: '/images/events/bridal_entry_fireworks.jpg',
    },
    {
      id: 'INV-06',
      name: 'Heavy Dry Ice Fog Machines (Dual Ground Cloud Nozzles)',
      category: 'Special Effects',
      total: 6,
      inUse: 2,
      available: 4,
      location: 'Cryo Storage Bay',
      condition: 'Tested Ready to Dispatch',
      img: '/images/events/jay_gurudev_banner.jpg',
    },
    {
      id: 'INV-07',
      name: 'Heavy Duty Caster-Wheeled Iron Transport Trolleys',
      category: 'Logistics',
      total: 4,
      inUse: 2,
      available: 2,
      location: 'Logistics Fleet',
      condition: 'High Bearing Load 2 Ton',
      img: '/images/events/aadiyogi_safe_transport.jpg',
    },
  ]);

  // Filtered contracts
  const filteredContracts = eventContracts.filter((c) => {
    const matchesSearch = c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVenue = venueFilter === 'ALL' || c.venue.includes(venueFilter);
    return matchesSearch && matchesVenue;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '3rem' }}>
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BAR (Matching Reference Standard)
         ══════════════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Left: Venue Filter & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              <span>{venueFilter === 'ALL' ? 'All Wedding Venues ▾' : venueFilter}</span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {venueDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  width: '280px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {['ALL', 'Sarnath', 'Taj Nadesar', 'Riviera', 'Regal Palace', 'Babatpur'].map((ven, vIdx) => (
                  <div
                    key={vIdx}
                    onClick={() => {
                      setVenueFilter(ven);
                      setVenueDropdownOpen(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: venueFilter === ven ? 700 : 500,
                      color: venueFilter === ven ? '#7e22ce' : '#334155',
                      background: venueFilter === ven ? '#faf5ff' : '#ffffff',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    {ven === 'ALL' ? 'All Venues & Lawns' : `${ven} Ground`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '260px',
            }}
          >
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search wedding, client or stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.82rem',
                width: '100%',
                color: '#1e293b',
              }}
            />
          </div>
        </div>

        {/* Right: Actions, Public Website link & Admin profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => window.open('/events', '_blank')}
            style={{
              background: '#fef08a',
              color: '#854d0e',
              border: '1px solid #fde047',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔱 Live Website</span>
            <ExternalLink size={13} />
          </button>

          <button
            onClick={() => setNewBookingModalOpen(true)}
            style={{
              background: '#7e22ce',
              color: '#ffffff',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 10px rgba(126, 34, 206, 0.3)',
            }}
          >
            <Plus size={15} />
            <span>+ New Contract</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Super Admin"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7e22ce' }}
            />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                Jay Gurudev Admin
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Master Production Lead
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. PAGE SUBHEADER & SECONDARY NAVIGATION TABS
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '1.5rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>🔱</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Jay Gurudev Event & Management Dashboard
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
            Managing <strong>Aadiyogi Mahadev Stage</strong>, Royal Bridal Flower Arches, Cold Pyro, and Dry Ice Fog contracts in Varanasi.
          </p>
        </div>

        {/* Subheader Right Actions: Add Event & Season Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleOpenAddModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #7e22ce 0%, #ca8a04 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Plus size={16} />
            <span>+ Add Event Package</span>
          </button>

          {/* Date / Season Filter */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <span>{rangeFilter}</span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {rangeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  width: '180px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {['Wedding Season 2026', 'This Month', 'Upcoming 90 Days', 'Full Year 2026'].map((r, rIdx) => (
                  <div
                    key={rIdx}
                    onClick={() => {
                      setRangeFilter(r);
                      setRangeDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: rangeFilter === r ? 700 : 500,
                      color: rangeFilter === r ? '#7e22ce' : '#334155',
                      background: rangeFilter === r ? '#faf5ff' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 99999,
            background: '#0f172a',
            color: '#facc15',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 800,
            border: '1px solid #ca8a04',
          }}
        >
          <Sparkles size={16} color="#facc15" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Sub Tabs Bar (Dashboard | Events | Event Packages | Aadiyogi Inventory | Proposals | Clients) ── */}
      <div style={{ padding: '0 2rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', overflowX: 'auto' }}>
          {[
            { id: 'DASHBOARD', label: '📊 Dashboard Overview' },
            { id: 'EVENTS', label: '🎪 Events & Services', count: eventCatalogList.filter((i) => (i.itemType || 'EVENT').toUpperCase() !== 'PACKAGE').length },
            { id: 'PACKAGES', label: '📦 Event Packages', count: eventCatalogList.filter((i) => (i.itemType || 'EVENT').toUpperCase() === 'PACKAGE').length },
            { id: 'STAGES', label: '🔱 Aadiyogi & Stage Inventory' },
            { id: 'PROPOSALS', label: '📑 Customer Proposals & Quotes', count: proposals.length },
            { id: 'CLIENTS', label: '👥 Wedding Couples & Ledger', count: eventContracts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#7e22ce' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#7e22ce' : '#cbd5e1',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                    fontSize: '10.5px',
                    fontWeight: 900,
                    padding: '1px 6px',
                    borderRadius: '999px',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. TAB 1: DASHBOARD OVERVIEW
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'DASHBOARD' && (
        <>
          {/* 4 KPI Metric Cards */}
          <div style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
            
            {/* KPI 1 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>+22% ↑</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Wedding Contracts</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>14 Bookings</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>8 Aadiyogi Grand Setups</div>
            </div>

            {/* KPI 2 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>100% Ready</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Aadiyogi Sculptures & Stages</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>2 Master Units</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>1 On Ground • 1 Ready in Transit</div>
            </div>

            {/* KPI 3 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>+18% ↑</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Cold Pyro & Fog Machines</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>22 Hardware Units</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>16 Sparkulars • 6 Cryo Foggers</div>
            </div>

            {/* KPI 4 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>+28% ↑</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Booking Volume</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>₹14.85 Lakh</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>₹7.50L Advance Received</div>
            </div>

          </div>

          {/* Middle Row: Season Curve Chart & Theme Donut */}
          <div style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.25rem' }}>
            
            {/* Wave Chart: Season Booking Trend */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Wedding Season Production & Bookings
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ color: '#7e22ce' }}>● Aadiyogi Stages</span>
                  <span style={{ color: '#f59e0b' }}>● Bridal Entries</span>
                </div>
              </div>

              {/* SVG Wave Chart */}
              <div style={{ width: '100%', height: '200px' }}>
                <svg viewBox="0 0 600 180" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="30" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="75" x2="570" y2="75" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="120" x2="570" y2="120" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="150" x2="570" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Curve Area */}
                  <path
                    d="M 50 130 C 130 110, 200 90, 270 60 C 340 40, 420 50, 490 30 C 530 20, 560 15, 570 10 L 570 150 L 50 150 Z"
                    fill="url(#purpleGrad)"
                  />
                  {/* Curve Line */}
                  <path
                    d="M 50 130 C 130 110, 200 90, 270 60 C 340 40, 420 50, 490 30 C 530 20, 560 15, 570 10"
                    fill="none"
                    stroke="#7e22ce"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Points */}
                  {[[50, 130], [150, 105], [270, 60], [380, 45], [490, 30], [570, 10]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="5" fill="#ffffff" stroke="#7e22ce" strokeWidth="3" />
                  ))}

                  <text x="45" y="168" fontSize="11" fill="#64748b" fontWeight="600">Sep</text>
                  <text x="145" y="168" fontSize="11" fill="#64748b" fontWeight="600">Oct</text>
                  <text x="260" y="168" fontSize="11" fill="#64748b" fontWeight="600">Nov (Peak)</text>
                  <text x="375" y="168" fontSize="11" fill="#64748b" fontWeight="600">Dec (Peak)</text>
                  <text x="480" y="168" fontSize="11" fill="#64748b" fontWeight="600">Jan</text>
                  <text x="560" y="168" fontSize="11" fill="#64748b" fontWeight="600">Feb</text>
                </svg>
              </div>
            </div>

            {/* Donut Chart: Theme Distribution */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Stage Theme Share
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {/* Aadiyogi Theme 55% (Purple) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#7e22ce" strokeWidth="18" strokeDasharray="131 239" strokeDashoffset="0" />
                    {/* Bridal Arches 25% (Gold) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#facc15" strokeWidth="18" strokeDasharray="60 239" strokeDashoffset="-131" />
                    {/* Classic Sangeet 20% (Rose) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f43f5e" strokeWidth="18" strokeDasharray="48 239" strokeDashoffset="-191" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>14</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>Total</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7e22ce' }}></span>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Aadiyogi (55%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#facc15' }}></span>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Bridal Arch (25%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }}></span>
                    <span style={{ color: '#475569', fontWeight: 600 }}>LED & Sangeet (20%)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Table: Active Wedding Contracts */}
          <div style={{ padding: '0 2rem' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Active Wedding Contracts & Schedules
                </h3>
                <button
                  onClick={() => setActiveTab('CLIENTS')}
                  style={{ background: 'transparent', border: 'none', color: '#7e22ce', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  View All Clients →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                      <th style={{ padding: '10px 12px' }}>ID & Client</th>
                      <th style={{ padding: '10px 12px' }}>Setup Theme</th>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                      <th style={{ padding: '10px 12px' }}>Venue Location</th>
                      <th style={{ padding: '10px 12px' }}>Budget</th>
                      <th style={{ padding: '10px 12px' }}>Advance Paid</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((c, i) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{c.client}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.id} • {c.phone}</div>
                        </td>
                        <td style={{ padding: '12px', color: '#334155' }}>
                          <div style={{ fontWeight: 600 }}>{c.type}</div>
                          <div style={{ fontSize: '0.72rem', color: '#7e22ce', fontWeight: 700 }}>{c.effects}</div>
                        </td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{c.date}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{c.venue}</td>
                        <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>
                          ₹{c.totalAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#16a34a' }}>
                          ₹{c.advancePaid.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: c.status === 'Confirmed' ? '#dcfce7' : c.status === 'In Production' ? '#fef3c7' : '#f3e8ff',
                              color: c.status === 'Confirmed' ? '#15803d' : c.status === 'In Production' ? '#b45309' : '#7e22ce',
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. TAB 2: AADIYOGI & STAGE INVENTORY
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'STAGES' && (
        <div style={{ padding: '0 2rem' }}>
          
          {/* Blueprint Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #180527 0%, #2b0b42 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(250, 204, 21, 0.4)',
              padding: '1.75rem',
              color: '#ffffff',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#facc15', color: '#0f172a', fontSize: '10.5px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>
                  20ft × 15ft MASTER BLUEPRINT
                </span>
                <span style={{ fontSize: '12px', color: '#facc15' }}>Official Architectural Specifications</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 4px', color: '#ffffff' }}>
                Aadiyogi Theme Stage & Bridal Ramp Blueprint
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '600px' }}>
                20ft Total Width • 15ft Total Depth • 8ft Jaimala Ramp • 6ft Nandi Back Area • 15ft Bridal Arch Tunnel.
              </p>
            </div>

            <button
              onClick={() => setBlueprintModalOpen(true)}
              style={{
                background: '#facc15',
                color: '#0f172a',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Maximize2 size={16} />
              <span>Open Blueprint Modal</span>
            </button>
          </div>

          {/* Hardware & Sculpture Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {inventory.map((inv) => (
              <div
                key={inv.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={inv.img}
                      alt={inv.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#facc15',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {inv.category}
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      {inv.name}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                      📍 <strong>Location:</strong> {inv.location}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
                      ✓ {inv.condition}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 1.25rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  <span>Total: <strong>{inv.total}</strong></span>
                  <span style={{ color: '#ea580c' }}>In Use: <strong>{inv.inUse}</strong></span>
                  <span style={{ color: '#16a34a' }}>Available: <strong>{inv.available}</strong></span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. TAB 3: PROPOSALS & QUOTATIONS MANAGER
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'PROPOSALS' && (
        <div style={{ padding: '0 2rem' }}>
          
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  Client Wedding Proposals & Estimates
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                  Review custom quotations submitted from the public website or generated by admin.
                </p>
              </div>

              <button
                onClick={() => setNewProposalModalOpen(true)}
                style={{
                  background: '#7e22ce',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={16} />
                <span>+ Create Custom Proposal</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>Proposal ID</th>
                    <th style={{ padding: '10px 12px' }}>Client & Contact</th>
                    <th style={{ padding: '10px 12px' }}>Occasion & Date</th>
                    <th style={{ padding: '10px 12px' }}>Configured Package</th>
                    <th style={{ padding: '10px 12px' }}>Estimated Price</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((prop) => (
                    <tr key={prop.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#64748b' }}>{prop.id}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{prop.clientName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{prop.phone}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{prop.eventType}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{prop.date} • {prop.venue}</div>
                      </td>
                      <td style={{ padding: '12px', color: '#334155' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7e22ce' }}>
                          {prop.stageSize}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {prop.bridalEntry} • {prop.effects}
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 900, color: '#16a34a', fontSize: '0.95rem' }}>
                        ₹{prop.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: prop.status === 'Accepted' ? '#dcfce7' : prop.status === 'Pending Review' ? '#fef3c7' : '#f3e8ff',
                            color: prop.status === 'Accepted' ? '#15803d' : prop.status === 'Pending Review' ? '#b45309' : '#7e22ce',
                          }}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => {
                              const text = `*JAY GURUDEV EVENT & MANAGEMENT PROPOSAL*
Dear ${prop.clientName},
Your quotation for ${prop.eventType} on ${prop.date} at ${prop.venue} is approved!
Total Package: ₹${prop.amount.toLocaleString()}
Please call 76519 72973 to finalize contract.`;
                              window.open(`https://wa.me/${prop.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            style={{
                              background: '#22c55e',
                              color: '#ffffff',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
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

      {/* ══════════════════════════════════════════════════════════════════════════
          6. TAB 4: CLIENT & COUPLE DIRECTORY
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CLIENTS' && (
        <div style={{ padding: '0 2rem' }}>
          
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
              Wedding Clients & Payment Ledger
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {eventContracts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ background: '#7e22ce', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                        {c.id}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>
                        {c.status}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {c.client}
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      📞 {c.phone}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                      📍 {c.venue}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7e22ce', fontWeight: 600, marginTop: '4px' }}>
                      {c.type}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Contract Value</div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>₹{c.totalAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Advance Paid</div>
                      <div style={{ fontWeight: 800, color: '#16a34a' }}>₹{c.advancePaid.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Balance Due</div>
                      <div style={{ fontWeight: 800, color: '#dc2626' }}>₹{c.balance.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 5: EVENTS & SERVICES MASTER LIST (INDIVIDUAL EVENT SERVICES)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'EVENTS' && (() => {
        const filteredEvents = eventCatalogList.filter((item) => {
          // Exclude Packages here
          if ((item.itemType || 'EVENT').toUpperCase() === 'PACKAGE') return false;

          // Category filter
          if (catalogCategoryFilter !== 'ALL' && (item.category || '').toUpperCase() !== catalogCategoryFilter.toUpperCase()) {
            return false;
          }
          // Status filter
          if (catalogStatusFilter !== 'ALL' && (item.status || 'ACTIVE').toUpperCase() !== catalogStatusFilter.toUpperCase()) {
            return false;
          }
          // Search query
          if (!catalogSearch.trim()) return true;
          const q = catalogSearch.toLowerCase().trim();
          return (
            (item.name || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            (item.categoryName || '').toLowerCase().includes(q) ||
            (item.features || []).some((f) => f.toLowerCase().includes(q))
          );
        }).sort((a, b) => {
          if (catalogSort === 'rate_desc') return (b.finalPrice || b.rate || 0) - (a.finalPrice || a.rate || 0);
          if (catalogSort === 'rate_asc') return (a.finalPrice || a.rate || 0) - (b.finalPrice || b.rate || 0);
          if (catalogSort === 'name_asc') return (a.name || '').localeCompare(b.name || '');
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        const stageCount = eventCatalogList.filter((i) => (i.itemType || 'EVENT') !== 'PACKAGE' && i.category === 'STAGE_DECORATION').length;
        const entryCount = eventCatalogList.filter((i) => (i.itemType || 'EVENT') !== 'PACKAGE' && i.category === 'BRIDAL_ENTRY').length;
        const effectsCount = eventCatalogList.filter((i) => (i.itemType || 'EVENT') !== 'PACKAGE' && i.category === 'SPECIAL_EFFECTS').length;
        const activeCount = eventCatalogList.filter((i) => (i.itemType || 'EVENT') !== 'PACKAGE' && (i.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length;

        return (
          <div style={{ padding: '0 2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Events Banner & Stats */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 60%, #451a03 100%)',
                borderRadius: '20px',
                padding: '1.75rem 2rem',
                color: '#ffffff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                border: '1px solid rgba(250, 204, 21, 0.3)',
              }}
            >
              <div style={{ maxWidth: '620px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '18px' }}>🔱</span>
                  <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', background: '#facc15', color: '#1e1b4b', padding: '2px 8px', borderRadius: '6px' }}>
                    Jay Gurudev Event Services
                  </span>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Event Services & Productions Catalog
                </h2>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  Manage individual event services: 20ft Aadiyogi Mahadev Stage, Royal Bridal Walkway Arches, Revolving Varmala Stages, and Cold Pyro machines.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleOpenAddEventModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                    color: '#1e1b4b',
                    border: 'none',
                    padding: '12px 22px',
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(250, 204, 21, 0.4)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Plus size={18} />
                  <span>+ Add New Event Service</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Total Event Services', count: eventCatalogList.filter((i) => (i.itemType || 'EVENT') !== 'PACKAGE').length, icon: '🎪', color: '#7e22ce', bg: '#faf5ff' },
                { label: 'Stage Setups', count: stageCount, icon: '🏛️', color: '#ca8a04', bg: '#fefce8' },
                { label: 'Bridal Entries', count: entryCount, icon: '👑', color: '#be123c', bg: '#fff1f2' },
                { label: 'Special Effects', count: effectsCount, icon: '🎆', color: '#0284c7', bg: '#f0f9ff' },
                { label: 'Active on Website', count: activeCount, icon: '🟢', color: '#15803d', bg: '#f0fdf4' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {m.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: m.color }}>
                      {m.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter & Search Bar */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                {/* Search Box */}
                <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search events by name, stage, bridal entry, features..."
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {catalogSearch && (
                    <button
                      onClick={() => setCatalogSearch('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
                  <select
                    value={catalogStatusFilter}
                    onChange={(e) => setCatalogStatusFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: '#fff',
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">🟢 Active Only</option>
                    <option value="INACTIVE">⚪ Inactive Only</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Sort:</span>
                  <select
                    value={catalogSort}
                    onChange={(e) => setCatalogSort(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: '#fff',
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="newest">Latest Added</option>
                    <option value="rate_desc">Price: High to Low</option>
                    <option value="rate_asc">Price: Low to High</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                <button
                  onClick={() => setCatalogCategoryFilter('ALL')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid',
                    cursor: 'pointer',
                    background: catalogCategoryFilter === 'ALL' ? '#1e1b4b' : '#ffffff',
                    color: catalogCategoryFilter === 'ALL' ? '#ffffff' : '#475569',
                    borderColor: catalogCategoryFilter === 'ALL' ? '#1e1b4b' : '#cbd5e1',
                    whiteSpace: 'nowrap',
                  }}
                >
                  All Categories ({eventCatalogList.filter((i) => (i.itemType || 'EVENT') !== 'PACKAGE').length})
                </button>
                {EVENT_CATEGORIES.map((cat) => {
                  const count = eventCatalogList.filter((i) => (i.itemType || 'EVENT') !== 'PACKAGE' && i.category === cat.id).length;
                  const isSel = catalogCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCatalogCategoryFilter(cat.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: '1px solid',
                        cursor: 'pointer',
                        background: isSel ? '#7e22ce' : '#ffffff',
                        color: isSel ? '#ffffff' : '#475569',
                        borderColor: isSel ? '#7e22ce' : '#cbd5e1',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.short}</span>
                      <span style={{ fontSize: '10px', opacity: 0.8 }}>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎪</div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#0f172a' }}>No Event Services Found</h3>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem' }}>
                  No individual event service matches the selected category or search filter.
                </p>
                <button
                  onClick={handleOpenAddEventModal}
                  style={{
                    background: '#7e22ce',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  + Add New Event Service
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {filteredEvents.map((pkg) => {
                  const targetId = pkg.id || pkg._id;
                  const isActive = (pkg.status || 'ACTIVE').toUpperCase() === 'ACTIVE';

                  return (
                    <div
                      key={targetId}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      <div>
                        {/* Event Card Image & Badges */}
                        <div style={{ position: 'relative', height: '190px', background: '#0f172a', overflow: 'hidden' }}>
                          <img
                            src={pkg.imageUrl || PRESET_EVENT_IMAGES[0].url}
                            alt={pkg.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = PRESET_EVENT_IMAGES[0].url;
                            }}
                          />

                          {/* Category Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              background: 'rgba(15, 23, 42, 0.85)',
                              backdropFilter: 'blur(4px)',
                              color: '#facc15',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              border: '1px solid rgba(250, 204, 21, 0.3)',
                            }}
                          >
                            {pkg.categoryName || pkg.category}
                          </div>

                          {/* Status Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: isActive ? '#15803d' : '#64748b',
                              color: '#ffffff',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {isActive ? '● Active' : '○ Inactive'}
                          </div>
                        </div>

                        {/* Event Content */}
                        <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#7e22ce', background: '#f3e8ff', padding: '2px 6px', borderRadius: '4px' }}>
                              EVENT SERVICE
                            </span>
                          </div>

                          <h3
                            style={{
                              margin: '0 0 6px',
                              fontSize: '1.1rem',
                              fontWeight: 900,
                              color: '#0f172a',
                              lineHeight: 1.35,
                              minHeight: '44px',
                            }}
                          >
                            {pkg.name}
                          </h3>

                          <p
                            style={{
                              margin: '0 0 10px',
                              fontSize: '0.82rem',
                              color: '#64748b',
                              lineHeight: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {pkg.description}
                          </p>

                          {/* Features List */}
                          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Sparkles size={13} color="#ca8a04" />
                              <span>Service Inclusions:</span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>
                              {(pkg.features || []).slice(0, 4).map((f, fIdx) => (
                                <li key={fIdx} style={{ marginBottom: '2px' }}>
                                  {f}
                                </li>
                              ))}
                              {(pkg.features || []).length > 4 && (
                                <li style={{ color: '#7e22ce', fontWeight: 700, listStyleType: 'none', marginTop: '2px' }}>
                                  + {(pkg.features.length - 4)} more features
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Operational Specs: Setup, Crew, Advance */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
                            {pkg.setupTime && (
                              <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                                ⏱️ {pkg.setupTime}
                              </span>
                            )}
                            {pkg.crewSize && (
                              <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                                👥 {pkg.crewSize}
                              </span>
                            )}
                            {pkg.advanceRequired && (
                              <span style={{ background: '#fefce8', color: '#854d0e', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                💳 {pkg.advanceRequired}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Pricing & Actions Toolbar */}
                      <div style={{ padding: '0.75rem 1.25rem 1.25rem', borderTop: '1px solid #f1f5f9' }}>
                        {/* Pricing Block */}
                        <div style={{ marginBottom: '12px' }}>
                          {pkg.showPrice ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                              <div>
                                {pkg.discount > 0 && (
                                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through', marginRight: '6px' }}>
                                    ₹{Number(pkg.rate || 0).toLocaleString('en-IN')}
                                  </span>
                                )}
                                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7e22ce' }}>
                                  ₹{Number(pkg.finalPrice || pkg.rate || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                              {pkg.discount > 0 && (
                                <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                                  Save ₹{Number(pkg.discount).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                              <MessageCircle size={14} />
                              <span>Price on Request / Custom Quotation</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditModal(pkg)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(pkg)}
                            title={isActive ? 'Deactivate Service' : 'Activate Service'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isActive ? '#f0fdf4' : '#f8fafc',
                              border: isActive ? '1px solid #86efac' : '1px solid #cbd5e1',
                              color: isActive ? '#15803d' : '#64748b',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            {isActive ? 'Live' : 'Draft'}
                          </button>

                          <button
                            onClick={() => setPreviewEventModal(pkg)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#475569',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            title="Preview Event Card"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmEvent(pkg)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              color: '#e11d48',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            title="Delete Event Service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 6: EVENT PACKAGES (COMBOS OF MULTIPLE EVENTS)
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'PACKAGES' && (() => {
        const packageItems = eventCatalogList.filter((item) => {
          // Only Packages
          if ((item.itemType || 'EVENT').toUpperCase() !== 'PACKAGE') return false;

          // Status filter
          if (catalogStatusFilter !== 'ALL' && (item.status || 'ACTIVE').toUpperCase() !== catalogStatusFilter.toUpperCase()) {
            return false;
          }
          // Search query
          if (!catalogSearch.trim()) return true;
          const q = catalogSearch.toLowerCase().trim();
          return (
            (item.name || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            (item.categoryName || '').toLowerCase().includes(q) ||
            (item.features || []).some((f) => f.toLowerCase().includes(q)) ||
            (item.includedServices || []).some((s) => (s.name || '').toLowerCase().includes(q))
          );
        }).sort((a, b) => {
          if (catalogSort === 'rate_desc') return (b.finalPrice || b.rate || 0) - (a.finalPrice || a.rate || 0);
          if (catalogSort === 'rate_asc') return (a.finalPrice || a.rate || 0) - (b.finalPrice || b.rate || 0);
          if (catalogSort === 'name_asc') return (a.name || '').localeCompare(b.name || '');
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        const allEventServices = eventCatalogList.filter((i) => (i.itemType || 'EVENT').toUpperCase() !== 'PACKAGE');
        const activePackages = packageItems.filter((i) => (i.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length;

        return (
          <div style={{ padding: '0 2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Packages Luxury Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #3b0764 0%, #1e112a 50%, #831843 100%)',
                borderRadius: '20px',
                padding: '1.75rem 2rem',
                color: '#ffffff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                border: '1px solid rgba(244, 114, 182, 0.35)',
              }}
            >
              <div style={{ maxWidth: '640px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '18px' }}>📦</span>
                  <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', background: '#ec4899', color: '#ffffff', padding: '2px 8px', borderRadius: '6px' }}>
                    Multi-Event Bundled Combos
                  </span>
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Event Packages Management
                </h2>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  Combine multiple event services (e.g. 20ft Aadiyogi Stage + Royal Bridal Entry Arch + Cold Pyro) into complete discounted package offerings with custom pricing & deliverables.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleOpenAddPackageModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 22px',
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Plus size={18} />
                  <span>+ Create New Event Package</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  📦
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Packages</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#db2777' }}>{packageItems.length} Combos</div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🎪
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Available Event Services</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7e22ce' }}>{allEventServices.length} Services</div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🟢
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Live On Storefront</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d' }}>{activePackages} Active</div>
                </div>
              </div>
            </div>

            {/* Search & Actions Bar */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search packages by package name, bundled events, or inclusions..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {catalogSearch && (
                  <button
                    onClick={() => setCatalogSearch('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={catalogStatusFilter}
                  onChange={(e) => setCatalogStatusFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: '#fff',
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">🟢 Active Packages</option>
                  <option value="INACTIVE">⚪ Inactive Drafts</option>
                </select>

                <select
                  value={catalogSort}
                  onChange={(e) => setCatalogSort(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: '#fff',
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  <option value="newest">Latest Added</option>
                  <option value="rate_desc">Price: High to Low</option>
                  <option value="rate_asc">Price: Low to High</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Packages Cards Grid */}
            {packageItems.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#0f172a' }}>No Event Packages Found</h3>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem' }}>
                  Create combo packages by selecting multiple individual event services together.
                </p>
                <button
                  onClick={handleOpenAddPackageModal}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  + Create First Event Package
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {packageItems.map((pkg) => {
                  const targetId = pkg.id || pkg._id;
                  const isActive = (pkg.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
                  const services = Array.isArray(pkg.includedServices) ? pkg.includedServices : [];

                  return (
                    <div
                      key={targetId}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #fbcfe8',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        boxShadow: '0 6px 20px rgba(236, 72, 153, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Package Header Banner Image */}
                        <div style={{ position: 'relative', height: '200px', background: '#0f172a', overflow: 'hidden' }}>
                          <img
                            src={pkg.imageUrl || PRESET_EVENT_IMAGES[0].url}
                            alt={pkg.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = PRESET_EVENT_IMAGES[0].url;
                            }}
                          />

                          {/* Package Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              background: 'linear-gradient(135deg, #ec4899, #db2777)',
                              color: '#ffffff',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '0.74rem',
                              fontWeight: 900,
                              letterSpacing: '0.04em',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Box size={13} />
                            COMBO PACKAGE
                          </div>

                          {/* Status Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: isActive ? '#15803d' : '#64748b',
                              color: '#ffffff',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {isActive ? '● Active' : '○ Inactive'}
                          </div>

                          {/* Bundled Count Pill */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '10px',
                              left: '12px',
                              background: 'rgba(15, 23, 42, 0.85)',
                              backdropFilter: 'blur(4px)',
                              color: '#facc15',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            🔱 {services.length} Event Services Bundled
                          </div>
                        </div>

                        {/* Package Info Content */}
                        <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
                          <h3
                            style={{
                              margin: '0 0 6px',
                              fontSize: '1.15rem',
                              fontWeight: 900,
                              color: '#0f172a',
                              lineHeight: 1.35,
                            }}
                          >
                            {pkg.name}
                          </h3>

                          <p
                            style={{
                              margin: '0 0 12px',
                              fontSize: '0.82rem',
                              color: '#64748b',
                              lineHeight: 1.5,
                            }}
                          >
                            {pkg.description}
                          </p>

                          {/* Bundled Services Breakdown Section */}
                          <div style={{ background: '#fff1f2', borderRadius: '12px', padding: '10px 12px', marginBottom: '10px', border: '1px solid #fecdd3' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#9f1239', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span>🎪 Bundled Events in this Package:</span>
                            </div>
                            {services.length === 0 ? (
                              <div style={{ fontSize: '0.76rem', color: '#881337', fontStyle: 'italic' }}>
                                No specific individual events mapped. Add events in package edit.
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {services.map((srv, sIdx) => (
                                  <div
                                    key={sIdx}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      background: '#ffffff',
                                      padding: '5px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.78rem',
                                      border: '1px solid #ffe4e6',
                                    }}
                                  >
                                    <span style={{ fontWeight: 700, color: '#1e293b' }}>
                                      • {srv.name}
                                    </span>
                                    {srv.price > 0 && (
                                      <span style={{ fontWeight: 800, color: '#7e22ce', fontSize: '0.75rem' }}>
                                        ₹{Number(srv.price).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Inclusions & Highlights */}
                          <div style={{ background: '#fdf2f8', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px', border: '1px solid #fbcfe8' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#831843', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Sparkles size={13} color="#db2777" />
                              <span>Package Deliverables & Specs:</span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>
                              {(pkg.features || []).slice(0, 4).map((f, fIdx) => (
                                <li key={fIdx}>{f}</li>
                              ))}
                              {(pkg.features || []).length > 4 && (
                                <li style={{ color: '#db2777', fontWeight: 700, listStyleType: 'none', marginTop: '2px' }}>
                                  + {(pkg.features.length - 4)} more specifications
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Operational Specs */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
                            {pkg.setupTime && (
                              <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                                ⏱️ {pkg.setupTime}
                              </span>
                            )}
                            {pkg.crewSize && (
                              <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                                👥 {pkg.crewSize}
                              </span>
                            )}
                            {pkg.advanceRequired && (
                              <span style={{ background: '#fefce8', color: '#854d0e', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                💳 {pkg.advanceRequired}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Package Bottom Pricing & Actions */}
                      <div style={{ padding: '0.75rem 1.25rem 1.25rem', borderTop: '1px solid #fbcfe8', background: '#fffafc' }}>
                        <div style={{ marginBottom: '12px' }}>
                          {pkg.showPrice ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                              <div>
                                {pkg.discount > 0 && (
                                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through', marginRight: '6px' }}>
                                    ₹{Number(pkg.rate || 0).toLocaleString('en-IN')}
                                  </span>
                                )}
                                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#be123c' }}>
                                  ₹{Number(pkg.finalPrice || pkg.rate || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                              {pkg.discount > 0 && (
                                <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                                  Package Savings: ₹{Number(pkg.discount).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                              <MessageCircle size={14} />
                              <span>Package Price on Custom Quotation</span>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditModal(pkg)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            <Edit3 size={14} />
                            <span>Edit Package</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(pkg)}
                            title={isActive ? 'Deactivate Package' : 'Activate Package'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isActive ? '#f0fdf4' : '#f8fafc',
                              border: isActive ? '1px solid #86efac' : '1px solid #cbd5e1',
                              color: isActive ? '#15803d' : '#64748b',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            {isActive ? 'Live' : 'Draft'}
                          </button>

                          <button
                            onClick={() => setPreviewEventModal(pkg)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#475569',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            title="Preview Package"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmEvent(pkg)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              color: '#e11d48',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            title="Delete Package"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════════
          7. MODAL: 20ft BLUEPRINT & TECHNICAL SPECIFICATIONS
         ══════════════════════════════════════════════════════════════════════════ */}
      {blueprintModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 1, 10, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setBlueprintModalOpen(false)}
        >
          <div
            style={{
              maxWidth: '920px',
              width: '100%',
              background: '#150921',
              borderRadius: '20px',
              border: '2px solid #facc15',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#facc15' }}>
                  Aadiyogi Theme Stage: 20ft × 15ft Architectural Dimensions
                </h3>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  Width 20ft • Depth 15ft • Ramp 15ft • Sarnath Workshop Technical Specs
                </div>
              </div>
              <button
                onClick={() => setBlueprintModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <img
              src="/images/events/aadiyogi_stage_dimensions.jpg"
              alt="Blueprint Dimensions"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          8. MODAL: + NEW BOOKING CONTRACT
         ══════════════════════════════════════════════════════════════════════════ */}
      {newBookingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
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
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setNewBookingModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce' }}>
                <PartyPopper size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  Create Wedding Decor Contract
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Jay Gurudev Event & Management • Sarnath, Varanasi
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Wedding contract created and stage hardware locked!');
                setNewBookingModalOpen(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Couple / Client Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh & Pooja Wedding"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Contact Phone
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Event Date
                  </label>
                  <input
                    required
                    type="date"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Stage Theme Selection
                </label>
                <select
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                >
                  <option>🔱 Aadiyogi Grand Theme Stage (20ft) + Royal Bridal Entry Arch</option>
                  <option>🔱 Aadiyogi Mega Theme Stage (30ft) + 30ft Flower Arch Tunnel</option>
                  <option>🌸 Royale Heritage Floral Mandap & Floating Aisle</option>
                  <option>✨ Cinematic Concert LED Stage & 3D Lighting Truss</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Venue Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarnath Heritage Lawn / Taj Nadesar"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Total Amount (₹)
                  </label>
                  <input
                    type="text"
                    defaultValue="₹2,75,000"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Advance Token (₹)
                  </label>
                  <input
                    type="text"
                    defaultValue="₹1,00,000"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNewBookingModalOpen(false)}
                  style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Book & Lock Hardware
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          9. MODAL: + CREATE CUSTOM PROPOSAL
         ══════════════════════════════════════════════════════════════════════════ */}
      {newProposalModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
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
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setNewProposalModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
              Create Custom Wedding Proposal
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.84rem', color: '#64748b' }}>
              Generate an official quotation for client with automatic package discounts.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Proposal generated and ready to share via WhatsApp!');
                setNewProposalModalOpen(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Client Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Vikas Maurya"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Client WhatsApp Phone
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. 76519 72973"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Aadiyogi Theme Package Options
                </label>
                <select
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                >
                  <option>Full Combo: Aadiyogi Stage + Bridal Arch + Cold Pyro + Dry Ice Fog (₹2,75,000)</option>
                  <option>Grand Stage Only: 20ft Aadiyogi Mahadev (₹1,50,000)</option>
                  <option>Bridal Walkway Only: 15ft Flower Arch Tunnel + Pyro (₹75,000)</option>
                  <option>Mega 30ft Stage + Dual Fog Machine (₹3,50,000)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  background: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              >
                Save & Dispatch to WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          8. MODAL: ADD / EDIT EVENT PACKAGE
         ══════════════════════════════════════════════════════════════════════════ */}
      {eventModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setEventModalOpen(false)}
        >
          <div
            style={{
              maxWidth: '680px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #faf5ff 0%, #fefce8 100%)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{editingEvent ? '✏️ Edit Event Package' : '✨ Add New Event Package'}</span>
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Configure stage decor, royal bridal entry, cold pyro, or custom event package details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEventModalOpen(false)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSaveEventSubmit} style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Type Switcher: Event Service vs Event Package */}
              <div style={{ display: 'flex', gap: '10px', background: '#f1f5f9', padding: '6px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEventForm({ ...eventForm, itemType: 'EVENT' })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    background: (eventForm.itemType || 'EVENT') !== 'PACKAGE' ? 'linear-gradient(135deg, #7e22ce, #a855f7)' : 'transparent',
                    color: (eventForm.itemType || 'EVENT') !== 'PACKAGE' ? '#ffffff' : '#64748b',
                    boxShadow: (eventForm.itemType || 'EVENT') !== 'PACKAGE' ? '0 2px 8px rgba(126, 34, 206, 0.3)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🎪 Individual Event Service</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEventForm({ ...eventForm, itemType: 'PACKAGE', category: 'COMPLETE_THEME' })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    background: (eventForm.itemType || 'EVENT') === 'PACKAGE' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
                    color: (eventForm.itemType || 'EVENT') === 'PACKAGE' ? '#ffffff' : '#64748b',
                    boxShadow: (eventForm.itemType || 'EVENT') === 'PACKAGE' ? '0 2px 8px rgba(236, 72, 153, 0.3)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📦 Combo Event Package</span>
                </button>
              </div>

              {/* Event / Package Name & Category Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                    {eventForm.itemType === 'PACKAGE' ? 'Event Package Name *' : 'Event Service Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.name}
                    onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                    placeholder={eventForm.itemType === 'PACKAGE' ? 'e.g. Royal Grand Shiva Mahadev Combo Package' : 'e.g. 20ft Aadiyogi Mahadev Stage / Royal Bridal Entry Arch'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.86rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.86rem',
                      boxSizing: 'border-box',
                      background: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label} ({cat.short})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* IF PACKAGE: MULTI-EVENT SERVICES SELECTOR FROM DB */}
              {eventForm.itemType === 'PACKAGE' && (
                <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#9f1239', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🎪 Select Event Services to Bundle in this Package:</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#881337', marginTop: '2px' }}>
                        Check all individual services (e.g. Stage + Bridal Entry + Pyro) included in this package.
                      </div>
                    </div>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#e11d48', background: '#ffe4e6', padding: '2px 8px', borderRadius: '6px' }}>
                      {eventForm.includedServices.length} Selected
                    </span>
                  </div>

                  {/* Checklist of all available individual event services from DB / State */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
                    {eventCatalogList
                      .filter((item) => (item.itemType || 'EVENT').toUpperCase() !== 'PACKAGE' && (item.id || item._id) !== (editingEvent?.id || editingEvent?._id))
                      .map((srv) => {
                        const sId = srv.id || srv._id;
                        const isChecked = eventForm.includedServices.some((s) => (s.id || s._id) === sId);
                        return (
                          <div
                            key={sId}
                            onClick={() => handleToggleServiceInPackage(srv)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: isChecked ? '#ffe4e6' : '#ffffff',
                              border: isChecked ? '1.5px solid #e11d48' : '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '8px 10px',
                              cursor: 'pointer',
                              transition: 'all 0.1s ease',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent onClick
                              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#e11d48' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {srv.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#7e22ce', fontWeight: 700 }}>
                                ₹{(Number(srv.finalPrice || srv.rate) || 0).toLocaleString()} · {srv.categoryName || srv.category}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Sum Calculation Info */}
                  {eventForm.includedServices.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ color: '#9f1239', fontWeight: 700 }}>
                        Total Individual Services Worth:
                      </span>
                      <strong style={{ color: '#9f1239', fontSize: '0.92rem' }}>
                        ₹{eventForm.includedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0).toLocaleString()}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                  Package Description & Venue Overview
                </label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Describe dimensions, floral styling, lighting, technical rigs, and suitability for lawns or banquet halls..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.86rem',
                    boxSizing: 'border-box',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Multiple Features (List wise input as requested by user) */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="#7e22ce" />
                    <span>Included Package Features (Bullet List)</span>
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {eventForm.features.filter(Boolean).length} features added
                  </span>
                </div>

                {/* Feature Add Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add a feature (e.g. 8 Cold Pyro Guns, 20ft Mahadev Bust, Red Carpet)..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      background: '#fff',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    style={{
                      background: '#7e22ce',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {/* List of current features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                  {eventForm.features.filter(Boolean).map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.82rem',
                        color: '#334155',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#16a34a', fontWeight: 900 }}>✓</span>
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(fIdx)}
                        style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        title="Remove feature"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {eventForm.features.filter(Boolean).length === 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', padding: '4px 0' }}>
                      No features added yet. Type above and click "+ Add" to list key inclusions.
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Section (With Toggle for Show/Hide Price as user requested) */}
              <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '14px', background: '#faf5ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#1e1b4b' }}>
                      Pricing Configuration
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      Base rate, discount, and whether to display price or request custom quote.
                    </div>
                  </div>

                  {/* Toggle: Show / Hide Price to customers */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#fff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #d8b4fe' }}>
                    <input
                      type="checkbox"
                      checked={eventForm.showPrice}
                      onChange={(e) => setEventForm({ ...eventForm, showPrice: e.target.checked })}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: eventForm.showPrice ? '#7e22ce' : '#64748b' }}>
                      {eventForm.showPrice ? 'Show Price on Website' : 'Hide Price (Quote on Request)'}
                    </span>
                  </label>
                </div>

                {eventForm.showPrice ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                        Base Rate / Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={eventForm.rate}
                        onChange={(e) => setEventForm({ ...eventForm, rate: e.target.value })}
                        placeholder="e.g. 250000"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                        Discount Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={eventForm.discount}
                        onChange={(e) => setEventForm({ ...eventForm, discount: e.target.value })}
                        placeholder="e.g. 25000"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #86efac', borderRadius: '8px', padding: '9px 12px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>Final Client Offer Price:</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a' }}>
                        ₹{Math.max(0, (Number(eventForm.rate) || 0) - (Number(eventForm.discount) || 0)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Price Hidden:</strong> Customers will see <em>"Price on Request / Custom Quotation"</em> and submit venue dimensions for a customized quote.
                    </span>
                  </div>
                )}
              </div>

              {/* Image Upload & Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                  Event Picture / Banner (Upload File or Enter Image URL)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '8px' }}>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      style={{ fontSize: '0.8rem', padding: '6px 0', width: '100%' }}
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      value={eventForm.imageUrl}
                      onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                      placeholder="Or paste direct image URL (https://...)"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Preset Image Quick Selector */}
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '6px', fontWeight: 700 }}>
                  Or select a quick themed preset:
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {PRESET_EVENT_IMAGES.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setEventForm({ ...eventForm, imageUrl: preset.url })}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: eventForm.imageUrl === preset.url ? '1.5px solid #7e22ce' : '1px solid #cbd5e1',
                        background: eventForm.imageUrl === preset.url ? '#f3e8ff' : '#ffffff',
                        color: eventForm.imageUrl === preset.url ? '#7e22ce' : '#334155',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Preview Box */}
                {eventForm.imageUrl && (
                  <div style={{ marginTop: '10px', height: '120px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#0f172a' }}>
                    <img
                      src={eventForm.imageUrl}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = PRESET_EVENT_IMAGES[0].url;
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Status & Operational Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    Status *
                  </label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 800, background: '#fff' }}
                  >
                    <option value="ACTIVE">🟢 Active (Live)</option>
                    <option value="INACTIVE">⚪ Inactive (Draft)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    Setup Time Required
                  </label>
                  <input
                    type="text"
                    value={eventForm.setupTime}
                    onChange={(e) => setEventForm({ ...eventForm, setupTime: e.target.value })}
                    placeholder="e.g. 4-6 Hours"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    Crew Size
                  </label>
                  <input
                    type="text"
                    value={eventForm.crewSize}
                    onChange={(e) => setEventForm({ ...eventForm, crewSize: e.target.value })}
                    placeholder="e.g. 6 Riggers"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    Advance Required
                  </label>
                  <input
                    type="text"
                    value={eventForm.advanceRequired}
                    onChange={(e) => setEventForm({ ...eventForm, advanceRequired: e.target.value })}
                    placeholder="e.g. 40% Advance"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #7e22ce 0%, #ca8a04 100%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(126, 34, 206, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{editingEvent ? 'Save Changes' : 'Create Event Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Delete Confirmation ── */}
      {deleteConfirmEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setDeleteConfirmEvent(null)}
        >
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
              Delete Event Package?
            </h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>"{deleteConfirmEvent.name}"</strong>? This will remove the package from client storefront and quote generator.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmEvent(null)}
                style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
              >
                Yes, Delete Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Event Package Preview ── */}
      {previewEventModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setPreviewEventModal(null)}
        >
          <div
            style={{
              maxWidth: '640px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', height: '220px', background: '#0f172a' }}>
              <img
                src={previewEventModal.imageUrl}
                alt={previewEventModal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = PRESET_EVENT_IMAGES[0].url;
                }}
              />
              <button
                type="button"
                onClick={() => setPreviewEventModal(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                  {previewEventModal.name}
                </h3>
                <span
                  style={{
                    background: previewEventModal.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                    color: previewEventModal.status === 'ACTIVE' ? '#15803d' : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {previewEventModal.status || 'ACTIVE'}
                </span>
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
                {previewEventModal.description}
              </p>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Specifications & Inclusions:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: '#334155', lineHeight: 1.7 }}>
                  {(previewEventModal.features || []).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <div>
                  {previewEventModal.showPrice ? (
                    <div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Package Price</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7e22ce' }}>
                        ₹{Number(previewEventModal.finalPrice || previewEventModal.rate).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#b45309' }}>
                      💬 Price on Request / Custom Quote
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewEventModal(null);
                      handleOpenEditModal(previewEventModal);
                    }}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    Edit Package
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewEventModal(null)}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#fff', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EventDecorationDashboard;
