/**
 * @file StaffCustomersPage.jsx
 * @description Multi-Vertical Customer & Client Management for Staff Portals.
 * Features:
 *  - List / Table View with sorting, searching, category, status, and source filters.
 *  - Customer Password creation & copy button (so customers can log in to /customer/login).
 *  - Multi-Vertical Visibility:
 *      * If registered for 'ALL' or via 'GOOGLE_AUTH', appears across ALL dashboards & admin.
 *      * If registered for a single vertical (e.g. 'PARLOUR'), only appears in that vertical.
 *  - Clear Badges:
 *      * Source: '🌐 Google Login', '📝 Self Registered', '👤 Staff Created'
 *      * Target: '👑 All Portals', '💄 Parlour', '🔱 Events', '🏡 Plotting', '💻 Software'
 *  - Tailored vertical columns and full Add/Edit/View/Delete workflow.
 * @module frontend/src/modules/staff/pages/StaffCustomersPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Sparkles,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Search,
  CheckCircle,
  Building,
  Code2,
  Briefcase,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Clock,
  Key,
  Copy,
  Globe,
  FileText,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';

export default function StaffCustomersPage() {
  const { staffUser } = useStaff();
  const toast = useToast();

  const userVertical = (staffUser?.targetBusiness || 'PARLOUR').toUpperCase();
  const [activeVertical, setActiveVertical] = useState(userVertical);

  useEffect(() => {
    if (staffUser?.targetBusiness) {
      setActiveVertical(staffUser.targetBusiness.toUpperCase());
    }
  }, [staffUser]);

  // Initial Demo Customers with Passwords, Target Business & Registration Source
  const defaultCustomersList = [
    // PARLOUR SPECIFIC
    {
      id: 'CUST-P-101',
      name: 'Sunita Kapoor',
      phone: '+91 98765 43210',
      email: 'sunita.kapoor@gmail.com',
      password: 'Sunita@123',
      targetBusiness: 'PARLOUR',
      registrationMethod: 'STAFF_ENTRY',
      category: 'Bridal Special',
      skinHairType: 'Sensitive Skin / Dry Hair',
      serviceInterested: 'Bridal HD Makeup & Keratin Hair Spa',
      preferredStylist: 'Radhika Sharma',
      notes: 'Pre-wedding bridal package booked for 22nd Nov. Prefers organic products.',
      status: 'Active Client',
      createdAt: '2026-11-01',
    },
    {
      id: 'CUST-P-102',
      name: 'Kavita Patel',
      phone: '+91 98111 22334',
      email: 'kavita.patel@gmail.com',
      password: 'Kavita@123',
      targetBusiness: 'PARLOUR',
      registrationMethod: 'SELF_FORM',
      category: 'Regular VIP',
      skinHairType: 'Normal Skin / Oily Scalp',
      serviceInterested: 'O3+ Gold Glow Facial & Aroma Pedicure',
      preferredStylist: 'Priya Sharma',
      notes: 'Allergic to synthetic fragrance wax.',
      status: 'Active Client',
      createdAt: '2026-11-05',
    },

    // EVENTS SPECIFIC
    {
      id: 'CUST-E-201',
      name: 'Sunil Singhania',
      phone: '+91 98234 11223',
      email: 'sunil.singhania@gmail.com',
      password: 'Sunil@123',
      targetBusiness: 'EVENTS',
      registrationMethod: 'STAFF_ENTRY',
      category: 'Wedding Host',
      eventType: 'Royal Wedding Mandap & Hydraulic Stage',
      eventDate: '2026-12-18',
      venue: 'Shri Ram Lawn & Banquets, Varanasi',
      gatheringSize: '800+ Guests',
      budget: '₹18,50,000',
      notes: 'Cold pyro fountain needed for bride entry at 07:30 PM.',
      status: 'Booking Confirmed',
      createdAt: '2026-11-02',
    },
    {
      id: 'CUST-E-202',
      name: 'Ritu Saxena',
      phone: '+91 98765 44332',
      email: 'ritu.saxena@techcorp.com',
      password: 'Ritu@123',
      targetBusiness: 'EVENTS',
      registrationMethod: 'SELF_FORM',
      category: 'Corporate Organiser',
      eventType: 'Corporate Annual Tech Gala',
      eventDate: '2026-11-28',
      venue: 'Hotel Taj Ganges, Nadesar',
      gatheringSize: '350 Attendees',
      budget: '₹6,20,000',
      notes: 'P3 LED Video Wall and 6 wireless lapel mics required.',
      status: 'In Planning',
      createdAt: '2026-11-06',
    },

    // PLOTTING SPECIFIC
    {
      id: 'CUST-L-301',
      name: 'Dr. Ramesh Chandra Gupta',
      phone: '+91 94152 77889',
      email: 'dr.rcgupta@rediffmail.com',
      password: 'Ramesh@123',
      targetBusiness: 'PLOTTING',
      registrationMethod: 'STAFF_ENTRY',
      category: 'Residential Buyer',
      colony: 'Kashi Smart Enclave, Phase 2',
      plotInterested: 'Plot #B-14 (Corner, 1800 sq.ft)',
      budget: '₹42,00,000',
      siteVisitDate: '2026-11-14 (11:00 AM)',
      notes: 'Requires Cantt railway station pickup. Ready for 20% token advance.',
      status: 'Token Advance Held',
      createdAt: '2026-11-03',
    },
    {
      id: 'CUST-L-302',
      name: 'Ananya & Rohit Srivastava',
      phone: '+91 98390 12345',
      email: 'ananya.srivastava@gmail.com',
      password: 'Ananya@123',
      targetBusiness: 'PLOTTING',
      registrationMethod: 'SELF_FORM',
      category: 'First Time Buyer',
      colony: 'Ganga Vihar Residency, Chunar Rd',
      plotInterested: 'Plot #A-07 (East-facing, 1200 sq.ft)',
      budget: '₹26,50,000',
      siteVisitDate: '2026-11-15 (03:30 PM)',
      notes: 'Bank loan eligibility pre-approved from SBI.',
      status: 'Site Visit Scheduled',
      createdAt: '2026-11-07',
    },

    // SOFTWARE SPECIFIC
    {
      id: 'CUST-S-401',
      name: 'Amit Joshi',
      phone: '+91 98220 99881',
      email: 'amit@apexretail.io',
      password: 'Amit@123',
      targetBusiness: 'SOFTWARE',
      registrationMethod: 'STAFF_ENTRY',
      category: 'Enterprise Client',
      company: 'Apex Retail Pvt Ltd',
      projectType: 'E-Commerce Mobile App & POS Cloud Sync',
      techStack: 'React Native, Node.js, MongoDB Atlas',
      budget: '₹8,50,000',
      deadline: '2026-12-30',
      notes: 'Sprint 3 in progress. Razorpay payment webhook completed.',
      status: 'Active Project',
      createdAt: '2026-11-04',
    },
    {
      id: 'CUST-S-402',
      name: 'Meera Nair',
      phone: '+91 97990 11223',
      email: 'meera@kashitours.com',
      password: 'Meera@123',
      targetBusiness: 'SOFTWARE',
      registrationMethod: 'SELF_FORM',
      category: 'Travel & Media Client',
      company: 'Heritage Tourism & Media Hub',
      projectType: 'Online Booking Engine & Cinema Media Shoot',
      techStack: 'Next.js 14, Tailwind, Cloudinary CDN',
      budget: '₹4,80,000',
      deadline: '2026-11-30',
      notes: 'SEO metadata and multi-language support review pending.',
      status: 'Testing & QA',
      createdAt: '2026-11-08',
    },

    // GLOBAL GOOGLE AUTH CLIENT (Visible Across All Dashboards & Admin)
    {
      id: 'CUST-G-501',
      name: 'Pooja Verma (Google Verified)',
      phone: '+91 98888 77665',
      email: 'pooja.verma@gmail.com',
      password: 'Google SSO (OAuth 2.0)',
      targetBusiness: 'ALL',
      registrationMethod: 'GOOGLE_AUTH',
      authProvider: 'GOOGLE',
      category: 'VIP Global Client',
      serviceInterested: 'All Multi-Services (Google SSO)',
      notes: 'Signed in through Official Google OAuth popup. Full access to all verticals.',
      status: 'Active Client',
      createdAt: '2026-11-09',
    },
  ];

  // Storage helper: loads & normalizes list from localStorage
  const [allCustomers, setAllCustomers] = useState(() => {
    try {
      const stored = localStorage.getItem('staff_vertical_customers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
          // Flatten legacy object
          const flat = [];
          const seen = new Set();
          Object.entries(parsed).forEach(([k, arr]) => {
            if (Array.isArray(arr)) {
              arr.forEach((item) => {
                if (!seen.has(item.id)) {
                  seen.add(item.id);
                  flat.push({
                    ...item,
                    targetBusiness: item.targetBusiness || k,
                    registrationMethod: item.registrationMethod || (item.authProvider === 'GOOGLE' ? 'GOOGLE_AUTH' : 'STAFF_ENTRY'),
                    password: item.password || 'Client@123',
                  });
                }
              });
            }
          });
          if (flat.length > 0) return flat;
        }
      }
      return defaultCustomersList;
    } catch {
      return defaultCustomersList;
    }
  });

  const saveCustomers = (updatedList) => {
    setAllCustomers(updatedList);
    try {
      localStorage.setItem('staff_vertical_customers', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  };

  // State to toggle password visibility in the table
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const togglePasswordVisibility = (id) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyPasswordToClipboard = (password, customerName) => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success(`Password for ${customerName} copied to clipboard! Ready to share.`);
  };

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [showModalPassword, setShowModalPassword] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    phone: '',
    email: '',
    password: '',
    targetBusiness: activeVertical,
    registrationMethod: 'STAFF_ENTRY',
    category: '',
    notes: '',
    status: 'Active Client',
    // Parlour
    skinHairType: '',
    serviceInterested: '',
    preferredStylist: '',
    // Events
    eventType: '',
    eventDate: '',
    venue: '',
    gatheringSize: '',
    budget: '',
    // Plotting
    colony: '',
    plotInterested: '',
    siteVisitDate: '',
    // Software
    company: '',
    projectType: '',
    techStack: '',
    deadline: '',
  };

  const [formData, setFormData] = useState(initialForm);

  // Config by vertical
  const verticalConfig = {
    PARLOUR: {
      title: 'Salon Customer Directory',
      subtitle: 'Manage hair styling, beauty treatment, and bridal client profiles',
      emoji: '💄',
      accentColor: '#ec4899',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      addButtonText: '+ Add Salon Customer',
    },
    EVENTS: {
      title: 'Event Client & Host Directory',
      subtitle: 'Manage wedding hosts, corporate gala coordinators, and stage decor bookings',
      emoji: '🔱',
      accentColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      addButtonText: '+ Add Event Client',
    },
    PLOTTING: {
      title: 'Plot & Real Estate Buyer Directory',
      subtitle: 'Manage residential plot inquiries, site visit schedules, and property buyers',
      emoji: '🏡',
      accentColor: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      addButtonText: '+ Add Plotting Buyer',
    },
    SOFTWARE: {
      title: 'Software & Tech Client Directory',
      subtitle: 'Manage custom apps, enterprise IT contracts, and media production clients',
      emoji: '💻',
      accentColor: '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      addButtonText: '+ Add Tech Client',
    },
    RENT: {
      title: 'Commercial Rent & Tenant Directory',
      subtitle: 'Manage shop rentals, office tenants, and commercial leases',
      emoji: '🏢',
      accentColor: '#8b5cf6',
      badgeBg: 'rgba(139, 92, 246, 0.15)',
      addButtonText: '+ Add Rent Client',
    },
  }[activeVertical] || {
    title: 'Client Directory',
    subtitle: 'Manage customer accounts in list view',
    emoji: '👥',
    accentColor: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    addButtonText: '+ Add Client',
  };

  // MULTI-VERTICAL VISIBILITY FILTER RULE:
  // 1. If targetBusiness === 'ALL' OR registrationMethod === 'GOOGLE_AUTH' -> SHOW IN ALL VERTICALS!
  // 2. If targetBusiness === activeVertical -> SHOW!
  // 3. Otherwise -> DO NOT SHOW in this vertical.
  const rawList = useMemo(() => {
    return allCustomers.filter((item) => {
      const tBiz = (item.targetBusiness || 'ALL').toUpperCase();
      const isGoogle = item.registrationMethod === 'GOOGLE_AUTH' || item.authProvider === 'GOOGLE';
      if (tBiz === 'ALL' || isGoogle) return true;
      return tBiz === activeVertical;
    });
  }, [allCustomers, activeVertical]);

  // Extract distinct categories & statuses for filter dropdowns
  const availableCategories = useMemo(() => {
    const set = new Set();
    rawList.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [rawList]);

  const availableStatuses = useMemo(() => {
    const set = new Set();
    rawList.forEach((c) => {
      if (c.status) set.add(c.status);
    });
    return Array.from(set);
  }, [rawList]);

  // Filtered & Sorted List
  const filteredAndSortedList = useMemo(() => {
    let result = rawList.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.serviceInterested?.toLowerCase().includes(q) ||
        item.eventType?.toLowerCase().includes(q) ||
        item.colony?.toLowerCase().includes(q) ||
        item.company?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      
      const isGoogle = item.registrationMethod === 'GOOGLE_AUTH' || item.authProvider === 'GOOGLE';
      const matchesSource =
        selectedSource === 'ALL' ||
        (selectedSource === 'GOOGLE_AUTH' && isGoogle) ||
        (selectedSource === 'SELF_FORM' && item.registrationMethod === 'SELF_FORM' && !isGoogle) ||
        (selectedSource === 'STAFF_ENTRY' && (item.registrationMethod === 'STAFF_ENTRY' || !item.registrationMethod) && !isGoogle);

      return matchesSearch && matchesCat && matchesStatus && matchesSource;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'NAME_ASC') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'NAME_DESC') {
        return (b.name || '').localeCompare(a.name || '');
      } else if (sortBy === 'OLDEST') {
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      }
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    return result;
  }, [rawList, search, selectedCategory, selectedStatus, selectedSource, sortBy]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      ...initialForm,
      targetBusiness: activeVertical,
      password: `Client@${Math.floor(100 + Math.random() * 900)}`,
    });
    setShowModalPassword(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      ...initialForm,
      ...customer,
      password: customer.password || 'Client@123',
      targetBusiness: (customer.targetBusiness || activeVertical).toUpperCase(),
      registrationMethod: customer.registrationMethod || (customer.authProvider === 'GOOGLE' ? 'GOOGLE_AUTH' : 'STAFF_ENTRY'),
    });
    setShowModalPassword(false);
    setModalOpen(true);
  };

  const handleOpenView = (customer) => {
    setViewingCustomer(customer);
    setViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      const updated = allCustomers.filter((c) => c.id !== id);
      saveCustomers(updated);
      toast.success('Customer deleted successfully');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedSource('ALL');
    setSortBy('NEWEST');
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#';
    let res = 'Pass@';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: res }));
    setShowModalPassword(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please enter customer name and phone number');
      return;
    }

    const assignedPassword = formData.password?.trim() || `Client@${Math.floor(100 + Math.random() * 900)}`;

    if (editingCustomer) {
      // Update
      const updated = allCustomers.map((c) =>
        c.id === editingCustomer.id
          ? {
              ...c,
              ...formData,
              password: assignedPassword,
              targetBusiness: (formData.targetBusiness || activeVertical).toUpperCase(),
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : c
      );
      saveCustomers(updated);
      toast.success('Customer record & credentials updated successfully');
    } else {
      // Create new customer
      const targetBiz = (formData.targetBusiness || activeVertical).toUpperCase();
      const prefix = targetBiz === 'ALL' ? 'G' : targetBiz.substring(0, 1);
      const newCust = {
        ...formData,
        id: `CUST-${prefix}-${Date.now().toString().slice(-4)}`,
        password: assignedPassword,
        targetBusiness: targetBiz,
        registrationMethod: formData.registrationMethod || 'STAFF_ENTRY',
        status: formData.status || 'Active Client',
        createdAt: new Date().toISOString().split('T')[0],
      };
      saveCustomers([newCust, ...allCustomers]);
      toast.success(`New customer created with login password: ${assignedPassword}`);
    }

    setModalOpen(false);
  };

  // Helper badge renderers
  const renderSourceBadge = (cust) => {
    const isGoogle = cust.registrationMethod === 'GOOGLE_AUTH' || cust.authProvider === 'GOOGLE';
    if (isGoogle) {
      return (
        <span
          style={{
            background: 'rgba(66, 133, 244, 0.16)',
            border: '1px solid rgba(66, 133, 244, 0.45)',
            color: '#60a5fa',
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '10.5px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          <Globe size={11} />
          <span>Google Login</span>
        </span>
      );
    }
    if (cust.registrationMethod === 'SELF_FORM') {
      return (
        <span
          style={{
            background: 'rgba(16, 185, 129, 0.16)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            color: '#34d399',
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '10.5px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          <FileText size={11} />
          <span>Self Form</span>
        </span>
      );
    }
    return (
      <span
        style={{
          background: 'rgba(168, 85, 247, 0.16)',
          border: '1px solid rgba(168, 85, 247, 0.45)',
          color: '#c084fc',
          padding: '2px 7px',
          borderRadius: '6px',
          fontSize: '10.5px',
          fontWeight: '700',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        <Users size={11} />
        <span>Staff Added</span>
      </span>
    );
  };

  const renderTargetBadge = (cust) => {
    const t = (cust.targetBusiness || 'ALL').toUpperCase();
    const map = {
      ALL: { label: '👑 All Portals', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.35)' },
      PARLOUR: { label: '💄 Parlour', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', border: 'rgba(244, 114, 182, 0.35)' },
      EVENTS: { label: '🔱 Events', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', border: 'rgba(251, 146, 60, 0.35)' },
      PLOTTING: { label: '🏡 Plotting', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.35)' },
      SOFTWARE: { label: '💻 Software', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.35)' },
      RENT: { label: '🏢 Rent', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)', border: 'rgba(192, 132, 252, 0.35)' },
    };
    const c = map[t] || map.ALL;
    return (
      <span
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          color: c.color,
          padding: '2px 7px',
          borderRadius: '6px',
          fontSize: '10.5px',
          fontWeight: '700',
          whiteSpace: 'nowrap',
        }}
      >
        {c.label}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '1420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Top Header Card ── */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${verticalConfig.accentColor}33`,
          borderRadius: '16px',
          padding: '22px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: verticalConfig.badgeBg,
              border: `1px solid ${verticalConfig.accentColor}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
            }}
          >
            {verticalConfig.emoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.3px' }}>
                {verticalConfig.title}
              </h1>
              <span
                style={{
                  background: verticalConfig.badgeBg,
                  color: verticalConfig.accentColor,
                  border: `1px solid ${verticalConfig.accentColor}44`,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                }}
              >
                {activeVertical} PORTAL
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>
              {verticalConfig.subtitle} • Real-time password & multi-portal visibility
            </p>
          </div>
        </div>

        {/* Action Button & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '8px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              Visible Clients
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: verticalConfig.accentColor }}>
              {rawList.length}
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              background: `linear-gradient(135deg, ${verticalConfig.accentColor}, #8b5cf6)`,
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 20px',
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: `0 4px 14px ${verticalConfig.accentColor}44`,
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <UserPlus size={16} />
            <span>{verticalConfig.addButtonText}</span>
          </button>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 14px',
            minWidth: '280px',
            flex: '1 1 280px',
          }}
        >
          <Search size={16} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search by name, phone, email, ID, or service...`}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '13.5px',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {/* Source Filter (Google vs Self Form vs Staff) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={selectStyle}
            >
              <option value="ALL">All Sources (Google + Form + Staff)</option>
              <option value="GOOGLE_AUTH">🌐 Google Login Only</option>
              <option value="SELF_FORM">📝 Self Form Registration</option>
              <option value="STAFF_ENTRY">👤 Staff Created</option>
            </select>
          </div>

          {/* Category Filter */}
          {availableCategories.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          {availableStatuses.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={selectStyle}
              >
                <option value="ALL">All Statuses</option>
                {availableStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={selectStyle}
            >
              <option value="NEWEST">Newest Added</option>
              <option value="OLDEST">Oldest First</option>
              <option value="NAME_ASC">Name (A → Z)</option>
              <option value="NAME_DESC">Name (Z → A)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(search || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedSource !== 'ALL' || sortBy !== 'NEWEST') && (
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── LIST VIEW TABLE ── */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1060px' }}>
            <thead>
              <tr
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '11.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#94a3b8',
                }}
              >
                <th style={{ padding: '14px 16px', width: '40px' }}>#</th>
                <th style={{ padding: '14px 16px' }}>Client Info</th>
                <th style={{ padding: '14px 16px' }}>Source & Portal</th>
                <th style={{ padding: '14px 16px' }}>Contact</th>
                <th style={{ padding: '14px 16px' }}>Login Password</th>

                {/* Vertical Specific Headers */}
                {activeVertical === 'PARLOUR' && (
                  <>
                    <th style={{ padding: '14px 16px' }}>Service Interested</th>
                    <th style={{ padding: '14px 16px' }}>Skin / Hair</th>
                    <th style={{ padding: '14px 16px' }}>Assigned Stylist</th>
                  </>
                )}
                {activeVertical === 'EVENTS' && (
                  <>
                    <th style={{ padding: '14px 16px' }}>Event & Date</th>
                    <th style={{ padding: '14px 16px' }}>Venue Location</th>
                    <th style={{ padding: '14px 16px' }}>Gathering Size</th>
                  </>
                )}
                {activeVertical === 'PLOTTING' && (
                  <>
                    <th style={{ padding: '14px 16px' }}>Interested Colony</th>
                    <th style={{ padding: '14px 16px' }}>Plot Size / No</th>
                    <th style={{ padding: '14px 16px' }}>Scheduled Site Visit</th>
                  </>
                )}
                {activeVertical === 'SOFTWARE' && (
                  <>
                    <th style={{ padding: '14px 16px' }}>Company & Project</th>
                    <th style={{ padding: '14px 16px' }}>Tech Stack</th>
                    <th style={{ padding: '14px 16px' }}>Target Deadline</th>
                  </>
                )}
                {activeVertical === 'RENT' && (
                  <>
                    <th style={{ padding: '14px 16px' }}>Property / Shop</th>
                    <th style={{ padding: '14px 16px' }}>Monthly Rent</th>
                    <th style={{ padding: '14px 16px' }}>Lease Period</th>
                  </>
                )}

                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedList.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>{verticalConfig.emoji}</div>
                    <div style={{ fontSize: '15px', color: '#cbd5e1', fontWeight: '600' }}>No customer records match your filter criteria</div>
                    <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>Try resetting the search or source filter</div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedList.map((cust, idx) => {
                  const isPasswordRevealed = !!revealedPasswords[cust.id];
                  const isGoogleUser = cust.registrationMethod === 'GOOGLE_AUTH' || cust.authProvider === 'GOOGLE';

                  return (
                    <tr
                      key={cust.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.15s ease',
                        fontSize: '13px',
                        color: '#f8fafc',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {/* Index */}
                      <td style={{ padding: '14px 16px', color: '#64748b', fontWeight: '700' }}>
                        {idx + 1}
                      </td>

                      {/* Client Name + ID + Category badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: isGoogleUser
                                ? 'linear-gradient(135deg, #4285f4, #34a853)'
                                : `linear-gradient(135deg, ${verticalConfig.accentColor}, #6366f1)`,
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '800',
                              flexShrink: 0,
                            }}
                          >
                            {cust.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '13.5px' }}>
                              {cust.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>{cust.id}</span>
                              {cust.category && (
                                <span
                                  style={{
                                    fontSize: '9.5px',
                                    color: verticalConfig.accentColor,
                                    background: verticalConfig.badgeBg,
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    fontWeight: '700',
                                  }}
                                >
                                  {cust.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Source & Target Portal Badges */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          {renderSourceBadge(cust)}
                          {renderTargetBadge(cust)}
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <a
                            href={`tel:${cust.phone?.replace(/[^0-9]/g, '')}`}
                            style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px' }}
                          >
                            <Phone size={11} />
                            <span>{cust.phone}</span>
                          </a>
                          {cust.email && (
                            <span style={{ color: '#94a3b8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={10} />
                              <span>{cust.email}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Login Password Column */}
                      <td style={{ padding: '14px 16px' }}>
                        {isGoogleUser ? (
                          <span
                            style={{
                              background: 'rgba(66, 133, 244, 0.12)',
                              border: '1px solid rgba(66, 133, 244, 0.3)',
                              color: '#93c5fd',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <ShieldCheck size={12} />
                            <span>Google SSO</span>
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div
                              style={{
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '6px',
                                padding: '3px 8px',
                                fontSize: '12px',
                                fontFamily: isPasswordRevealed ? 'monospace' : 'inherit',
                                color: isPasswordRevealed ? '#fbbf24' : '#94a3b8',
                                letterSpacing: isPasswordRevealed ? '0.5px' : '2px',
                                minWidth: '78px',
                              }}
                            >
                              {isPasswordRevealed ? cust.password || 'Client@123' : '••••••••'}
                            </div>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(cust.id)}
                              title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {isPasswordRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyPasswordToClipboard(cust.password || 'Client@123', cust.name)}
                              title="Copy Password"
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: 'none',
                                color: '#cbd5e1',
                                borderRadius: '4px',
                                padding: '3px 5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Copy size={11} />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* ── PARLOUR COLUMNS ── */}
                      {activeVertical === 'PARLOUR' && (
                        <>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '12.5px' }}>
                              {cust.serviceInterested || 'General Salon Care'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '12px' }}>
                            {cust.skinHairType || 'Normal'}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '3px 7px', borderRadius: '6px', fontSize: '11.5px' }}>
                              ✂️ {cust.preferredStylist || 'Any Stylist'}
                            </span>
                          </td>
                        </>
                      )}

                      {/* ── EVENTS COLUMNS ── */}
                      {activeVertical === 'EVENTS' && (
                        <>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '12.5px' }}>{cust.eventType || 'Event Booking'}</div>
                            <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '2px' }}>📅 {cust.eventDate || 'Date TBD'}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ color: '#cbd5e1', fontSize: '12px' }}>{cust.venue || 'Varanasi'}</div>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#38bdf8', fontSize: '12px' }}>
                            👥 {cust.gatheringSize || 'General Gathering'}
                          </td>
                        </>
                      )}

                      {/* ── PLOTTING COLUMNS ── */}
                      {activeVertical === 'PLOTTING' && (
                        <>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '12.5px' }}>{cust.colony || 'Smart Enclave'}</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#38bdf8', fontWeight: '600', fontSize: '12.5px' }}>
                            {cust.plotInterested || 'Plot Query'}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#fbbf24', fontSize: '12px' }}>
                            🚗 {cust.siteVisitDate || 'Visit TBD'}
                          </td>
                        </>
                      )}

                      {/* ── SOFTWARE COLUMNS ── */}
                      {activeVertical === 'SOFTWARE' && (
                        <>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '700', color: '#e2e8f0', fontSize: '12.5px' }}>{cust.projectType || 'Software Dev'}</div>
                            {cust.company && <div style={{ fontSize: '11px', color: '#94a3b8' }}>🏢 {cust.company}</div>}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '11.5px' }}>
                            <code style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2px 5px', borderRadius: '4px' }}>
                              {cust.techStack || 'Full Stack'}
                            </code>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px' }}>
                            {cust.deadline ? `Target: ${cust.deadline}` : 'Standard Sprint'}
                          </td>
                        </>
                      )}

                      {/* ── RENT COLUMNS ── */}
                      {activeVertical === 'RENT' && (
                        <>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '12.5px' }}>{cust.company || 'Commercial Space'}</span>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: '#4ade80', fontSize: '12.5px' }}>
                            {cust.budget || '₹25,000/mo'}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#cbd5e1', fontSize: '12px' }}>
                            {cust.deadline || '11 Months'}
                          </td>
                        </>
                      )}

                      {/* Status Pill */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: 'rgba(74, 222, 128, 0.15)',
                            color: '#4ade80',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {cust.status || 'Active'}
                        </span>
                      </td>

                      {/* Actions Toolbar */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenView(cust)}
                            title="View Details"
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: 'none',
                              color: '#cbd5e1',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '11.5px',
                            }}
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cust)}
                            title="Edit Customer"
                            style={{
                              background: 'rgba(56, 189, 248, 0.15)',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              color: '#38bdf8',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '11.5px',
                            }}
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cust.id)}
                            title="Delete Customer"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171',
                              borderRadius: '6px',
                              padding: '5px 7px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          style={{
            padding: '12px 18px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#94a3b8',
          }}
        >
          <span>
            Showing <strong>{filteredAndSortedList.length}</strong> of <strong>{rawList.length}</strong> visible clients in {activeVertical} list
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            👑 Global customers and 🌐 Google Login users are automatically mirrored across all vertical dashboards
          </span>
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: '#1e293b',
              border: `1px solid ${verticalConfig.accentColor}44`,
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              color: '#ffffff',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{verticalConfig.emoji}</span>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                    {editingCustomer ? `Edit Client: ${editingCustomer.name}` : `Create New Customer`}
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
                    Generates customer login credentials for customer portal (/customer/login)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Universal: Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anjali Sharma"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                    Phone Number (Login ID) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Universal: Email & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                    Email Address <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@gmail.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                    Client Category / Tier <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. VIP / Regular / Corporate"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* ── CUSTOMER PASSWORD FIELD (With Reveal & Generate Buttons) ── */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Key size={13} />
                    <span>Customer Login Password *</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    style={{
                      background: 'rgba(251, 191, 36, 0.15)',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      color: '#fbbf24',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ Auto Generate
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="e.g. Client@123"
                    style={{
                      ...inputStyle,
                      paddingRight: '40px',
                      fontFamily: showModalPassword ? 'monospace' : 'inherit',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    {showModalPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                  Customer will use this password + phone/email to log into their customer booking dashboard.
                </span>
              </div>

              {/* ── TARGET BUSINESS & REGISTRATION SOURCE ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                    Target Department / Portal Visibility <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                  </label>
                  <select
                    value={formData.targetBusiness}
                    onChange={(e) => setFormData({ ...formData, targetBusiness: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="ALL">👑 All Portals (Global Multi-Service)</option>
                    <option value="PARLOUR">💄 Golden Beauty Parlour</option>
                    <option value="EVENTS">🔱 Jaygurudev Event & Management</option>
                    <option value="PLOTTING">🏡 Plotting & Real Estate</option>
                    <option value="RENT">🏢 Office & Commercial Rent</option>
                    <option value="SOFTWARE">💻 RB Software & Tech Hub</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                    Registration Origin / Method <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                  </label>
                  <select
                    value={formData.registrationMethod}
                    onChange={(e) => setFormData({ ...formData, registrationMethod: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="STAFF_ENTRY">👤 Staff Added</option>
                    <option value="SELF_FORM">📝 Self Form Registration</option>
                    <option value="GOOGLE_AUTH">🌐 Google Login (OAuth 2.0)</option>
                  </select>
                </div>
              </div>

              {/* ── PARLOUR SPECIFIC FIELDS (ALL OPTIONAL) ── */}
              {activeVertical === 'PARLOUR' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Skin & Hair Characteristics <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.skinHairType}
                        onChange={(e) => setFormData({ ...formData, skinHairType: e.target.value })}
                        placeholder="e.g. Sensitive Skin / Dry Hair"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Preferred Stylist <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.preferredStylist}
                        onChange={(e) => setFormData({ ...formData, preferredStylist: e.target.value })}
                        placeholder="e.g. Radhika Sharma"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                      Primary Service Interested In <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.serviceInterested}
                      onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                      placeholder="e.g. Bridal HD Makeup, Hydra Facial, Keratin Treatment"
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              {/* ── EVENTS SPECIFIC FIELDS (ALL OPTIONAL, NO BUDGET) ── */}
              {activeVertical === 'EVENTS' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Event Type <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        placeholder="e.g. Royal Wedding Mandap / Corporate Gala"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Event Date <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Venue Location <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        placeholder="e.g. Shri Ram Banquets, Varanasi"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Expected Gathering Size <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.gatheringSize}
                        onChange={(e) => setFormData({ ...formData, gatheringSize: e.target.value })}
                        placeholder="e.g. 500 Guests"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── PLOTTING SPECIFIC FIELDS (ALL OPTIONAL, NO BUDGET) ── */}
              {activeVertical === 'PLOTTING' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Interested Colony / Enclave <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.colony}
                        onChange={(e) => setFormData({ ...formData, colony: e.target.value })}
                        placeholder="e.g. Kashi Smart Enclave Ph-2"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Plot Size (Sq.ft / Plot No) <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.plotInterested}
                        onChange={(e) => setFormData({ ...formData, plotInterested: e.target.value })}
                        placeholder="e.g. Plot B-12 (1500 sq.ft)"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                      Scheduled Site Visit <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.siteVisitDate}
                      onChange={(e) => setFormData({ ...formData, siteVisitDate: e.target.value })}
                      placeholder="e.g. Saturday 11:30 AM"
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              {/* ── SOFTWARE SPECIFIC FIELDS (ALL OPTIONAL, NO BUDGET) ── */}
              {activeVertical === 'SOFTWARE' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Company / Business Name <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Tech Pvt Ltd"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Project Category <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        placeholder="e.g. Mobile App, SaaS API, Media Shoot"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Tech Stack / Frameworks <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.techStack}
                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                        placeholder="e.g. React Native, Node.js, Cloudinary"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                        Target Deadline <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        placeholder="e.g. 30 Dec 2026"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Notes (Optional) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '5px' }}>
                  Special Notes & Requirements <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any allergies, special stage requirements, token conditions, or SLA notes..."
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${verticalConfig.accentColor}, #8b5cf6)`,
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px ${verticalConfig.accentColor}44`,
                  }}
                >
                  {editingCustomer ? 'Update Client Record' : 'Save & Issue Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewModalOpen && viewingCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#1e293b',
              border: `1px solid ${verticalConfig.accentColor}44`,
              borderRadius: '16px',
              padding: '26px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {renderSourceBadge(viewingCustomer)}
                  {renderTargetBadge(viewingCustomer)}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0' }}>{viewingCustomer.name}</h2>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Customer ID: {viewingCustomer.id}</div>
              </div>
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* ── LOGIN CREDENTIALS HIGHLIGHT CARD ── */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Key size={13} />
                  <span>Portal Login Credentials</span>
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>URL: /customer/login</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>Login Phone / Email:</span>
                  <strong style={{ color: '#ffffff' }}>{viewingCustomer.phone || viewingCustomer.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>Password:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#fbbf24', fontWeight: '700' }}>
                      {viewingCustomer.password || 'Client@123'}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyPasswordToClipboard(viewingCustomer.password || 'Client@123', viewingCustomer.name)}
                      title="Copy Password"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#cbd5e1',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Copy size={11} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
              <div>📞 <strong>Phone:</strong> {viewingCustomer.phone}</div>
              <div>✉️ <strong>Email:</strong> {viewingCustomer.email || 'N/A'}</div>
              <div>🏷️ <strong>Category:</strong> {viewingCustomer.category || 'N/A'}</div>
              <div>⚡ <strong>Status:</strong> {viewingCustomer.status || 'Active'}</div>

              {activeVertical === 'PARLOUR' && (
                <>
                  <div>✨ <strong>Service:</strong> {viewingCustomer.serviceInterested || 'N/A'}</div>
                  <div>🌸 <strong>Skin/Hair:</strong> {viewingCustomer.skinHairType || 'N/A'}</div>
                  <div>✂️ <strong>Stylist:</strong> {viewingCustomer.preferredStylist || 'N/A'}</div>
                </>
              )}

              {activeVertical === 'EVENTS' && (
                <>
                  <div>🔱 <strong>Event:</strong> {viewingCustomer.eventType || 'N/A'}</div>
                  <div>📅 <strong>Date:</strong> {viewingCustomer.eventDate || 'N/A'}</div>
                  <div>📍 <strong>Venue:</strong> {viewingCustomer.venue || 'N/A'}</div>
                  {viewingCustomer.gatheringSize && <div>👥 <strong>Gathering:</strong> {viewingCustomer.gatheringSize}</div>}
                </>
              )}

              {activeVertical === 'PLOTTING' && (
                <>
                  <div>🏡 <strong>Colony:</strong> {viewingCustomer.colony || 'N/A'}</div>
                  <div>📐 <strong>Plot Size:</strong> {viewingCustomer.plotInterested || 'N/A'}</div>
                  <div>🚗 <strong>Site Visit:</strong> {viewingCustomer.siteVisitDate || 'N/A'}</div>
                </>
              )}

              {activeVertical === 'SOFTWARE' && (
                <>
                  <div>🏢 <strong>Company:</strong> {viewingCustomer.company || 'N/A'}</div>
                  <div>💻 <strong>Project:</strong> {viewingCustomer.projectType || 'N/A'}</div>
                  <div>⚙️ <strong>Tech Stack:</strong> {viewingCustomer.techStack || 'N/A'}</div>
                  {viewingCustomer.deadline && <div>🎯 <strong>Target Deadline:</strong> {viewingCustomer.deadline}</div>}
                </>
              )}

              {viewingCustomer.notes && (
                <div style={{ marginTop: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
                  <strong>Notes:</strong> {viewingCustomer.notes}
                </div>
              )}
            </div>

            <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenEdit(viewingCustomer);
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Edit2 size={13} />
                <span>Edit Client</span>
              </button>
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '12.5px',
  padding: '6px 10px',
  outline: 'none',
  cursor: 'pointer',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};
