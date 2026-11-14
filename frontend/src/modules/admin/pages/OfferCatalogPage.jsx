/**
 * @file OfferCatalogPage.jsx
 * @description Master Golden Beauty Parlour Offers & Deals Management.
 * Features:
 *   1. Date Pickers for validity range (Valid From & Valid Until).
 *   2. NO coupons, promo codes, or coupon copy buttons - strictly promotional offers/deals.
 *   3. Prominent Top-Right Tag / Flag Badge (e.g. '🔥 NEW OFFER', '⚡ SPECIAL DEAL', '🎉 FESTIVE SPECIAL').
 *   4. Offer Name, Overview/Description, Features (entered line-by-line as text).
 *   5. Optional Rate / Offer Price.
 *   6. Rich View Details modal on Eye icon click showing full offer breakdown.
 *   7. Full CRUD (Add, Edit, View, Delete, Toggle Status).
 *   8. Exactly 1 single pre-seeded initial offer in DB/localStorage.
 *   9. Clean White Luxury Theme (default) + Dark Mode Theme Switcher.
 *   10. Pagination & custom smooth scrollbars.
 * @module frontend/src/modules/admin/pages/OfferCatalogPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  X,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Gift,
  Flame,
  Zap,
  PartyPopper,
  Crown,
  ShieldCheck,
  Percent,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { offerFetcher } from '../../../services/api/admin/adminApi.js';
import { uploadImageToCloudflare } from '../../../services/uploadService.js';

// Pre-seeded Master Parlour Offers (Strictly Only 1 Single Initial Offer)
const INITIAL_PARLOUR_OFFERS = [
  {
    _id: 'off_p_101',
    name: 'Festive Royal Bridal Glow Package Offer',
    tag: '🔥 NEW OFFER',
    rate: 9999, // Optional offer rate
    regularRate: 14999,
    validFrom: '2026-11-01',
    validUntil: '2026-12-31',
    overview: 'Exclusive limited-time royal festive makeover bundle curated for brides and bridesmaids with premium airbrush and gold hydration therapy.',
    features: [
      'Bridal HD Airbrush Makeup with 3D Mink Lashes',
      'Royal Velvet Hair Spa & Designer Bun Styling',
      '24K Gold Radiance Facial & Deep Pore Cleansing',
      'Complimentary Bridal Consultation & Skin Tone Mapping',
      'Free Touch-Up Vanity Kit & Dupatta Draping',
    ],
    status: 'active',
    category: 'Bridal & Festive',
    createdAt: '2026-11-01',
  },
];

const STORAGE_KEY = 'parlour_offers_master_v2';

const loadStoredOffers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARLOUR_OFFERS));
      return INITIAL_PARLOUR_OFFERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PARLOUR_OFFERS;
  } catch {
    return INITIAL_PARLOUR_OFFERS;
  }
};

const saveStoredOffers = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('parlour_offers_updated', { detail: { count: list.length } }));
  } catch (e) {
    console.warn('Offers storage save warning:', e);
  }
};

// Popular preset tags for quick 1-click selection in form
const PRESET_TAGS = [
  '🔥 NEW OFFER',
  '⚡ SPECIAL DEAL',
  '🎉 FESTIVE SPECIAL',
  '👑 ROYAL VIP',
  '🌸 BRIDAL SPECIAL',
  '✨ LIMITED TIME',
];

export const OfferCatalogPage = () => {
  const toast = useToast();
  const { selectedBranchId } = useTenantAdmin();

  // Theme Mode: Light (Luxury Clean White) default
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('parlour_offers_theme') || 'light';
  });

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    localStorage.setItem('parlour_offers_theme', next);
  };

  const isLight = themeMode === 'light';

  // Master Offers State
  const [offers, setOffers] = useState(loadStoredOffers);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive' | 'expired'
  const [tagFilter, setTagFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOfferForView, setSelectedOfferForView] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tag: '🔥 NEW OFFER',
    image: '',
    rate: '', // Optional
    regularRate: '', // Optional
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    overview: '',
    featuresText: '', // Multi-line text for features
    status: 'active',
    category: 'General',
  });

  // Sync to localStorage
  useEffect(() => {
    saveStoredOffers(offers);
  }, [offers]);

  // Try fetching from backend on mount (graceful fallback to localStorage)
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteOffers = async () => {
      try {
        setLoading(true);
        const res = await offerFetcher.getAll({ limit: 50 });
        if (res?.data && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          // Normalize remote items
          const mapped = res.data.map((item, idx) => ({
            _id: item._id || `off_${idx + 1}`,
            name: item.title || item.name || 'Special Parlour Offer',
            tag: item.bannerBadge || item.tag || '🔥 NEW OFFER',
            rate: item.offerPrice || item.rate || '',
            regularRate: item.regularRate || '',
            validFrom: item.validFrom ? item.validFrom.split('T')[0] : '2026-11-01',
            validUntil: item.validUntil ? item.validUntil.split('T')[0] : '2026-12-31',
            overview: item.description || item.overview || '',
            features: Array.isArray(item.features)
              ? item.features
              : item.applicableTo
              ? [item.applicableTo]
              : ['Premium Golden Beauty Parlour Service'],
            status: item.status || 'active',
            category: item.offerCategory || item.category || 'General',
            createdAt: item.createdAt || '2026-11-01',
          }));
          setOffers(mapped);
        }
      } catch (err) {
        // Fallback silently to localStorage
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRemoteOffers();
    return () => {
      isMounted = false;
    };
  }, [selectedBranchId]);

  // Check if an offer is currently expired
  const isOfferExpired = (validUntil) => {
    if (!validUntil) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return validUntil < todayStr;
  };

  // Filtered & Searched Offers
  const filteredOffers = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return offers.filter((off) => {
      // Search Match
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (off.name || '').toLowerCase().includes(q);
      const overviewMatch = (off.overview || '').toLowerCase().includes(q);
      const tagMatch = (off.tag || '').toLowerCase().includes(q);
      const featuresMatch = Array.isArray(off.features) && off.features.some((f) => (f || '').toLowerCase().includes(q));
      if (q && !nameMatch && !overviewMatch && !tagMatch && !featuresMatch) return false;

      // Status Match
      if (statusFilter === 'active') {
        if (off.status !== 'active' || isOfferExpired(off.validUntil)) return false;
      } else if (statusFilter === 'inactive') {
        if (off.status !== 'inactive') return false;
      } else if (statusFilter === 'expired') {
        if (!isOfferExpired(off.validUntil)) return false;
      }

      // Tag Match
      if (tagFilter !== 'all') {
        if (off.tag !== tagFilter) return false;
      }

      return true;
    });
  }, [offers, searchQuery, statusFilter, tagFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage) || 1;
  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOffers.slice(start, start + itemsPerPage);
  }, [filteredOffers, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // Open Create Form Modal
  const handleOpenCreateModal = () => {
    setEditingOffer(null);
    setImageUploadError('');
    const todayStr = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setFormData({
      name: '',
      tag: '🔥 NEW OFFER',
      image: '',
      rate: '',
      regularRate: '',
      validFrom: todayStr,
      validUntil: nextMonth,
      overview: '',
      featuresText: '',
      status: 'active',
      category: 'Bridal & Festive',
    });
    setFormModalOpen(true);
  };

  // Open Edit Form Modal
  const handleOpenEditModal = (offer) => {
    setEditingOffer(offer);
    setImageUploadError('');
    setFormData({
      name: offer.name || '',
      tag: offer.tag || '🔥 NEW OFFER',
      image: offer.image || offer.photo || offer.banner || '',
      rate: offer.rate !== undefined && offer.rate !== null ? offer.rate : '',
      regularRate: offer.regularRate !== undefined && offer.regularRate !== null ? offer.regularRate : '',
      validFrom: offer.validFrom || new Date().toISOString().split('T')[0],
      validUntil: offer.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      overview: offer.overview || '',
      featuresText: Array.isArray(offer.features) ? offer.features.join('\n') : '',
      status: offer.status || 'active',
      category: offer.category || 'General',
    });
    setFormModalOpen(true);
  };

  // Open View Details Modal
  const handleOpenViewModal = (offer) => {
    setSelectedOfferForView(offer);
    setViewModalOpen(true);
  };

  // Save Form (Create or Update)
  const handleSaveOffer = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter the Offer Name');
      return;
    }

    if (!formData.validFrom || !formData.validUntil) {
      toast.error('Please select both Valid From and Valid Until dates');
      return;
    }

    if (formData.validUntil < formData.validFrom) {
      toast.error('Valid Until date cannot be before Valid From date');
      return;
    }

    // Parse features from text (line by line)
    const parsedFeatures = formData.featuresText
      .split('\n')
      .map((line) => line.trim().replace(/^[-*•]\s*/, ''))
      .filter((line) => line.length > 0);

    const offerPayload = {
      name: formData.name.trim(),
      tag: formData.tag.trim() || '🔥 NEW OFFER',
      image: formData.image || undefined,
      rate: formData.rate !== '' ? Number(formData.rate) : null,
      regularRate: formData.regularRate !== '' ? Number(formData.regularRate) : null,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      overview: formData.overview.trim(),
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Exclusive Golden Beauty Parlour Service & Care'],
      status: formData.status,
      category: formData.category.trim() || 'General',
    };

    if (editingOffer) {
      // Update existing offer
      setOffers((prev) =>
        prev.map((o) => (o._id === editingOffer._id ? { ...o, ...offerPayload, updatedAt: new Date().toISOString() } : o))
      );
      toast.success(`Offer "${offerPayload.name}" updated successfully!`);
    } else {
      // Create new offer
      const newOffer = {
        _id: `off_p_${Date.now()}`,
        ...offerPayload,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setOffers((prev) => [newOffer, ...prev]);
      toast.success(`New Offer "${offerPayload.name}" created successfully!`);
    }

    setFormModalOpen(false);
  };

  // Delete Offer
  const handleDeleteOffer = (id) => {
    const target = offers.find((o) => o._id === id);
    setOffers((prev) => prev.filter((o) => o._id !== id));
    setDeleteConfirmId(null);
    toast.success(`Offer "${target?.name || ''}" deleted successfully`);
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (offer) => {
    const nextStatus = offer.status === 'active' ? 'inactive' : 'active';
    setOffers((prev) => prev.map((o) => (o._id === offer._id ? { ...o, status: nextStatus } : o)));
    toast.success(`Offer "${offer.name}" marked as ${nextStatus.toUpperCase()}`);
  };

  // Luxury Dynamic Theme Colors
  const themeStyles = {
    pageBg: isLight ? '#f8fafc' : '#0a0f1d',
    cardBg: isLight ? '#ffffff' : '#111827',
    headerBg: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 24, 39, 0.95)',
    border: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
    textPrimary: isLight ? '#0f172a' : '#f8fafc',
    textSecondary: isLight ? '#475569' : '#cbd5e1',
    textMuted: isLight ? '#64748b' : '#94a3b8',
    tableHeaderBg: isLight ? '#f1f5f9' : 'rgba(30, 41, 59, 0.7)',
    tableRowHover: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
    inputBg: isLight ? '#ffffff' : '#1e293b',
    goldAccent: '#d97706',
    goldBorder: 'rgba(217, 119, 6, 0.3)',
  };

  // Date formatter helper
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: themeStyles.pageBg,
        color: themeStyles.textPrimary,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: '24px 32px',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      <style>{`
        /* Smooth luxury scrollbars */
        ::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }
        ::-webkit-scrollbar-track {
          background: ${isLight ? '#f1f5f9' : '#0f172a'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${isLight ? '#cbd5e1' : '#334155'};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isLight ? '#94a3b8' : '#475569'};
        }
        .offer-card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .offer-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -6px rgba(0, 0, 0, ${isLight ? '0.08' : '0.4'});
          border-color: #d97706 !important;
        }
      `}</style>

      {/* TOP HEADER SECTION */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: `1px solid ${themeStyles.border}`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              }}
            >
              <Tag size={20} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
              Parlour Offers & Promotions
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '999px',
                background: isLight ? '#fef3c7' : 'rgba(217, 119, 6, 0.2)',
                color: '#b45309',
                border: `1px solid ${isLight ? '#fde68a' : 'rgba(217, 119, 6, 0.4)'}`,
              }}
            >
              Golden Beauty Parlour
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: themeStyles.textSecondary }}>
            Create promotional seasonal offers with date range pickers, optional rates, features, and custom flag tags.
          </p>
        </div>

        {/* Action Buttons & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.cardBg,
              color: themeStyles.textPrimary,
              cursor: 'pointer',
              fontSize: '12.5px',
              fontWeight: '600',
            }}
          >
            {isLight ? <Moon size={15} color="#64748b" /> : <Sun size={15} color="#f59e0b" />}
            <span>{isLight ? 'Dark' : 'Light'}</span>
          </button>

          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: isLight ? '#f1f5f9' : '#1e293b',
              padding: '3px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              title="Card View"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'grid' ? (isLight ? '#ffffff' : '#334155') : 'transparent',
                color: viewMode === 'grid' ? '#d97706' : themeStyles.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'table' ? (isLight ? '#ffffff' : '#334155') : 'transparent',
                color: viewMode === 'table' ? '#d97706' : themeStyles.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <List size={16} />
            </button>
          </div>

          {/* '+ Create Offer' Prominent Button */}
          <button
            onClick={handleOpenCreateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Plus size={17} strokeWidth={2.5} />
            <span>+ Create Offer</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div
        style={{
          background: themeStyles.cardBg,
          borderRadius: '12px',
          border: `1px solid ${themeStyles.border}`,
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '420px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: themeStyles.textMuted }}
          />
          <input
            type="text"
            placeholder="Search by offer name, tag, overview, or feature..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.inputBg,
              color: themeStyles.textPrimary,
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.inputBg,
              color: themeStyles.textPrimary,
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Statuses ({offers.length})</option>
            <option value="active">🟢 Active Offers</option>
            <option value="inactive">⚪ Inactive</option>
            <option value="expired">⌛ Expired Deals</option>
          </select>

          {/* Tag Filter */}
          <select
            value={tagFilter}
            onChange={(e) => {
              setTagFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.inputBg,
              color: themeStyles.textPrimary,
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Tags & Flags</option>
            {PRESET_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Items Per Page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.inputBg,
              color: themeStyles.textPrimary,
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
          </select>
        </div>
      </div>

      {/* OFFERS PRESENTATION (GRID VIEW OR TABLE VIEW) */}
      {filteredOffers.length === 0 ? (
        <div
          style={{
            background: themeStyles.cardBg,
            borderRadius: '12px',
            border: `1px solid ${themeStyles.border}`,
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isLight ? '#fef3c7' : 'rgba(217, 119, 6, 0.2)',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Tag size={26} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>No Offers Found</h3>
          <p style={{ fontSize: '13.5px', color: themeStyles.textMuted, maxWidth: '400px', margin: '0 auto 20px' }}>
            No offers match your search criteria. You can create a new offer or reset filters.
          </p>
          <button
            onClick={handleOpenCreateModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#d97706',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>Create First Offer</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: LUXURY OFFER CARDS WITH TOP-RIGHT TAG/FLAG */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '22px',
            marginBottom: '28px',
          }}
        >
          {paginatedOffers.map((offer) => {
            const expired = isOfferExpired(offer.validUntil);
            return (
              <div
                key={offer._id}
                className="offer-card-hover"
                style={{
                  background: themeStyles.cardBg,
                  borderRadius: '14px',
                  border: `1px solid ${themeStyles.border}`,
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* TOP HEADER: TITLE & TOP-RIGHT TAG/FLAG BADGE */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: isLight ? '#f1f5f9' : '#1e293b',
                          color: themeStyles.textMuted,
                          border: `1px solid ${themeStyles.border}`,
                        }}
                      >
                        {offer.category || 'Special Offer'}
                      </span>
                      {expired && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '800',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                          }}
                        >
                          EXPIRED
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: '17px',
                        fontWeight: '800',
                        color: themeStyles.textPrimary,
                        margin: 0,
                        lineHeight: 1.35,
                      }}
                    >
                      {offer.name}
                    </h3>
                  </div>

                  {/* PROMINENT TOP-RIGHT TAG / FLAG BADGE */}
                  <div
                    style={{
                      padding: '5px 11px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      border: '1.5px solid #f59e0b',
                      color: '#92400e',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      letterSpacing: '0.02em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
                      flexShrink: 0,
                    }}
                  >
                    <span>{offer.tag || '🔥 NEW OFFER'}</span>
                  </div>
                </div>

                {/* OFFER PROMO IMAGE BANNER */}
                {offer.image && (
                  <div
                    style={{
                      width: '100%',
                      height: '130px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      marginBottom: '12px',
                      border: `1px solid ${themeStyles.border}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <img
                      src={offer.image}
                      alt={offer.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* RATE & PRICING DISPLAY (OPTIONAL) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '10px',
                    marginBottom: '14px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isLight ? '#fafafa' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px dashed ${themeStyles.border}`,
                  }}
                >
                  <span style={{ fontSize: '11.5px', fontWeight: '600', color: themeStyles.textMuted }}>
                    Offer Rate:
                  </span>
                  {offer.rate !== undefined && offer.rate !== null && offer.rate !== '' ? (
                    <>
                      <span style={{ fontSize: '20px', fontWeight: '900', color: '#15803d' }}>
                        ₹{Number(offer.rate).toLocaleString('en-IN')}
                      </span>
                      {offer.regularRate && Number(offer.regularRate) > Number(offer.rate) && (
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: themeStyles.textMuted,
                            textDecoration: 'line-through',
                          }}
                        >
                          ₹{Number(offer.regularRate).toLocaleString('en-IN')}
                        </span>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: themeStyles.textSecondary }}>
                      Custom Consultation / Free Perk
                    </span>
                  )}
                </div>

                {/* VALIDITY DATES RANGE */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: expired ? '#b91c1c' : themeStyles.textSecondary,
                    marginBottom: '12px',
                    fontWeight: '600',
                  }}
                >
                  <Calendar size={14} color={expired ? '#b91c1c' : '#d97706'} />
                  <span>Valid:</span>
                  <span style={{ color: themeStyles.textPrimary, fontWeight: '700' }}>
                    {formatDateDisplay(offer.validFrom)}
                  </span>
                  <span>→</span>
                  <span style={{ color: themeStyles.textPrimary, fontWeight: '700' }}>
                    {formatDateDisplay(offer.validUntil)}
                  </span>
                </div>

                {/* OVERVIEW / SUMMARY */}
                {offer.overview && (
                  <p
                    style={{
                      fontSize: '12.5px',
                      lineHeight: 1.5,
                      color: themeStyles.textSecondary,
                      marginBottom: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {offer.overview}
                  </p>
                )}

                {/* FEATURES LIST (BULLETS) */}
                {Array.isArray(offer.features) && offer.features.length > 0 && (
                  <div style={{ marginBottom: '18px', flex: 1 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: themeStyles.textMuted, marginBottom: '6px' }}>
                      Included Features ({offer.features.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {offer.features.slice(0, 3).map((feat, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '7px',
                            fontSize: '12px',
                            color: themeStyles.textPrimary,
                          }}
                        >
                          <CheckCircle size={13} color="#15803d" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ lineHeight: 1.35 }}>{feat}</span>
                        </div>
                      ))}
                      {offer.features.length > 3 && (
                        <span
                          onClick={() => handleOpenViewModal(offer)}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '700',
                            color: '#d97706',
                            cursor: 'pointer',
                            marginTop: '2px',
                          }}
                        >
                          +{offer.features.length - 3} more features (Click to view)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* FOOTER ACTIONS BAR */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: `1px solid ${themeStyles.border}`,
                    marginTop: 'auto',
                  }}
                >
                  {/* Status Toggle Badge */}
                  <button
                    onClick={() => handleToggleStatus(offer)}
                    title={`Click to mark as ${offer.status === 'active' ? 'Inactive' : 'Active'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background:
                        offer.status === 'active'
                          ? isLight
                            ? '#dcfce7'
                            : 'rgba(34, 197, 94, 0.2)'
                          : isLight
                          ? '#f1f5f9'
                          : 'rgba(255, 255, 255, 0.05)',
                      color: offer.status === 'active' ? '#15803d' : themeStyles.textMuted,
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: offer.status === 'active' ? '#22c55e' : '#94a3b8',
                      }}
                    />
                    <span>{offer.status === 'active' ? 'ACTIVE' : 'INACTIVE'}</span>
                  </button>

                  {/* Actions: View (Eye), Edit, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenViewModal(offer)}
                      title="View Full Offer Details"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${themeStyles.border}`,
                        background: themeStyles.cardBg,
                        color: themeStyles.textPrimary,
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <Eye size={14} color="#d97706" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(offer)}
                      title="Edit Offer"
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${themeStyles.border}`,
                        background: themeStyles.cardBg,
                        color: themeStyles.textPrimary,
                        cursor: 'pointer',
                      }}
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(offer._id)}
                      title="Delete Offer"
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        background: isLight ? '#fff1f2' : 'rgba(239, 68, 68, 0.1)',
                        color: '#b91c1c',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW WITH PROPER SCROLLBAR AND PAGINATION */
        <div
          style={{
            background: themeStyles.cardBg,
            borderRadius: '12px',
            border: `1px solid ${themeStyles.border}`,
            overflowX: 'auto',
            marginBottom: '28px',
            boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ background: themeStyles.tableHeaderBg, borderBottom: `1px solid ${themeStyles.border}` }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>#</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Offer Name</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Tag / Flag</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Validity Window</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Offer Rate</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Features</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOffers.map((offer, idx) => {
                const expired = isOfferExpired(offer.validUntil);
                const rowNum = (currentPage - 1) * itemsPerPage + idx + 1;
                return (
                  <tr
                    key={offer._id}
                    style={{
                      borderBottom: `1px solid ${themeStyles.border}`,
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = themeStyles.tableRowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '12.5px', color: themeStyles.textMuted }}>{rowNum}</td>

                    {/* Offer Name with Image Thumbnail */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {offer.image ? (
                          <img
                            src={offer.image}
                            alt={offer.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              flexShrink: 0,
                              border: `1px solid ${themeStyles.border}`,
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: 'rgba(236, 72, 153, 0.1)',
                              color: '#ec4899',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '14px',
                              flexShrink: 0,
                              border: '1px solid rgba(236, 72, 153, 0.25)',
                            }}
                          >
                            <Tag size={16} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '13.5px', color: themeStyles.textPrimary }}>
                            {offer.name}
                          </div>
                          <div style={{ fontSize: '11px', color: themeStyles.textMuted }}>{offer.category || 'Special Offer'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Tag / Flag Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.2)',
                          border: '1px solid #f59e0b',
                          color: '#92400e',
                          fontSize: '11px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {offer.tag || '🔥 NEW OFFER'}
                      </span>
                    </td>

                    {/* Validity Window */}
                    <td style={{ padding: '14px 16px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      <div style={{ color: expired ? '#b91c1c' : themeStyles.textPrimary, fontWeight: '700' }}>
                        {formatDateDisplay(offer.validFrom)} → {formatDateDisplay(offer.validUntil)}
                      </div>
                      {expired ? (
                        <span style={{ fontSize: '10.5px', color: '#b91c1c', fontWeight: '800' }}>Expired</span>
                      ) : (
                        <span style={{ fontSize: '10.5px', color: '#15803d', fontWeight: '700' }}>Active Period</span>
                      )}
                    </td>

                    {/* Rate */}
                    <td style={{ padding: '14px 16px' }}>
                      {offer.rate !== undefined && offer.rate !== null && offer.rate !== '' ? (
                        <div>
                          <span style={{ fontWeight: '800', fontSize: '13.5px', color: '#15803d' }}>
                            ₹{Number(offer.rate).toLocaleString('en-IN')}
                          </span>
                          {offer.regularRate && (
                            <span style={{ fontSize: '11px', color: themeStyles.textMuted, textDecoration: 'line-through', marginLeft: '6px' }}>
                              ₹{Number(offer.regularRate).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: themeStyles.textMuted, fontStyle: 'italic' }}>
                          Optional / Consult
                        </span>
                      )}
                    </td>

                    {/* Features count */}
                    <td style={{ padding: '14px 16px', fontSize: '12.5px' }}>
                      <span
                        onClick={() => handleOpenViewModal(offer)}
                        style={{
                          color: '#d97706',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        {Array.isArray(offer.features) ? `${offer.features.length} Features` : '1 Feature'}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleToggleStatus(offer)}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: 'none',
                          background:
                            offer.status === 'active'
                              ? isLight
                                ? '#dcfce7'
                                : 'rgba(34, 197, 94, 0.2)'
                              : isLight
                              ? '#f1f5f9'
                              : 'rgba(255, 255, 255, 0.05)',
                          color: offer.status === 'active' ? '#15803d' : themeStyles.textMuted,
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        {offer.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => handleOpenViewModal(offer)}
                        title="View Full Offer Details"
                        style={{
                          marginRight: '6px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${themeStyles.border}`,
                          background: themeStyles.cardBg,
                          color: '#d97706',
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(offer)}
                        title="Edit Offer"
                        style={{
                          marginRight: '6px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${themeStyles.border}`,
                          background: themeStyles.cardBg,
                          color: themeStyles.textPrimary,
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(offer._id)}
                        title="Delete Offer"
                        style={{
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          background: isLight ? '#fff1f2' : 'rgba(239, 68, 68, 0.1)',
                          color: '#b91c1c',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION BAR */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 18px',
          background: themeStyles.cardBg,
          borderRadius: '10px',
          border: `1px solid ${themeStyles.border}`,
          fontSize: '12.5px',
          color: themeStyles.textMuted,
        }}
      >
        <div>
          Showing <b style={{ color: themeStyles.textPrimary }}>{paginatedOffers.length}</b> of{' '}
          <b style={{ color: themeStyles.textPrimary }}>{filteredOffers.length}</b> offers (Total in DB: {offers.length})
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.cardBg,
              color: themeStyles.textPrimary,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            <ChevronsLeft size={15} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.cardBg,
              color: themeStyles.textPrimary,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={15} />
          </button>

          <span style={{ padding: '0 8px', fontWeight: '700', color: themeStyles.textPrimary }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.cardBg,
              color: themeStyles.textPrimary,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
          >
            <ChevronRight size={15} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.cardBg,
              color: themeStyles.textPrimary,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
          >
            <ChevronsRight size={15} />
          </button>
        </div>
      </div>

      {/* CREATE / EDIT OFFER MODAL */}
      {formModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setFormModalOpen(false);
          }}
        >
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '16px',
              border: `1px solid ${themeStyles.border}`,
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${themeStyles.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: themeStyles.textPrimary }}>
                  {editingOffer ? 'Edit Parlour Offer' : 'Create New Parlour Offer'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: themeStyles.textMuted }}>
                  Define offer name, validity window, top-right tag, optional rate, and included features.
                </p>
              </div>
              <button
                onClick={() => setFormModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: themeStyles.textMuted,
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveOffer} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Offer Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Offer Name / Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festive Royal Bridal Glow Package Offer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textPrimary,
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Offer Image / Promo Banner (Cloudflare Upload) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Offer Banner / Promo Image (Cloudflare Upload - Optional)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {formData.image ? (
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '2px solid #ec4899',
                          boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
                          flexShrink: 0,
                          background: '#f8fafc',
                        }}
                      >
                        <img
                          src={formData.image}
                          alt="Offer Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150';
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '10px',
                          background: isLight ? '#fdf2f8' : 'rgba(236, 72, 153, 0.1)',
                          border: '2px dashed rgba(236, 72, 153, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ec4899',
                          fontSize: '24px',
                          flexShrink: 0,
                        }}
                      >
                        {isUploadingImage ? '⏳' : '📷'}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="offer-image-upload-input"
                        style={{ display: 'none' }}
                        disabled={isUploadingImage}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploadingImage(true);
                            setImageUploadError('');
                            try {
                              const cfUrl = await uploadImageToCloudflare(file, {
                                folder: 'offers',
                                entityType: 'offer',
                              });
                              setFormData((prev) => ({ ...prev, image: cfUrl }));
                              toast.success('Offer promo image uploaded to Cloudflare successfully!');
                            } catch (err) {
                              console.error('Offer image upload failed:', err);
                              setImageUploadError(err.message || 'Image upload failed. You can paste image link below.');
                              toast.error(err.message || 'Failed to upload offer image');
                            } finally {
                              setIsUploadingImage(false);
                              e.target.value = '';
                            }
                          }
                        }}
                      />

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => document.getElementById('offer-image-upload-input')?.click()}
                          style={{
                            fontSize: '12px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: isUploadingImage ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.12)',
                            border: '1px solid rgba(236, 72, 153, 0.35)',
                            color: '#ec4899',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: isUploadingImage ? 'wait' : 'pointer',
                          }}
                        >
                          <UploadCloud size={14} />
                          {isUploadingImage ? '⏳ Uploading to Cloudflare...' : '📁 Choose Offer Image'}
                        </button>

                        {formData.image && (
                          <button
                            type="button"
                            disabled={isUploadingImage}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, image: '' }));
                              setImageUploadError('');
                            }}
                            style={{
                              fontSize: '11px',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              background: 'rgba(239, 68, 68, 0.08)',
                              color: '#ef4444',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <span style={{ fontSize: '11px', color: isUploadingImage ? '#ec4899' : themeStyles.textMuted }}>
                        {isUploadingImage
                          ? '⚡ Uploading directly to Cloudflare Images API... please wait'
                          : 'Uploads directly to Cloudflare live URL. Or paste image URL below:'}
                      </span>
                      {imageUploadError && (
                        <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
                          ⚠️ {imageUploadError}
                        </span>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="https://imagedelivery.net/... or paste image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Tag / Flag (Top-Right Badge on Card) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Top-Right Tag / Flag Label <span style={{ color: '#d97706' }}>(Displayed prominently on card)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🔥 NEW OFFER or ⚡ SPECIAL DEAL"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textPrimary,
                    fontSize: '13.5px',
                    outline: 'none',
                    marginBottom: '8px',
                  }}
                />
                {/* Preset Tag Quick Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {PRESET_TAGS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFormData({ ...formData, tag: t })}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        border: `1px solid ${formData.tag === t ? '#d97706' : themeStyles.border}`,
                        background: formData.tag === t ? (isLight ? '#fef3c7' : 'rgba(217, 119, 6, 0.25)') : themeStyles.cardBg,
                        color: formData.tag === t ? '#b45309' : themeStyles.textMuted,
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* DATE PICKERS: VALID FROM & VALID UNTIL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    <Calendar size={14} color="#d97706" />
                    <span>Valid From (Start Date)</span> <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    <Calendar size={14} color="#d97706" />
                    <span>Valid Until (End Date)</span> <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* OPTIONAL RATE / PRICE & REGULAR RATE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    Offer Rate / Price (₹) <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 9999"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    Regular / Original Rate (₹) <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 14999"
                    value={formData.regularRate}
                    onChange={(e) => setFormData({ ...formData, regularRate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* OVERVIEW / SUMMARY */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Offer Overview / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary highlighting the benefits of this offer..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* FEATURES (ENTERED AS TEXT / LINE-BY-LINE) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: themeStyles.textPrimary, margin: 0 }}>
                    Included Features & Perks <span style={{ fontSize: '11px', color: '#d97706' }}>(Enter 1 feature per line)</span>
                  </label>
                  <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>Press Enter for new item</span>
                </div>
                <textarea
                  rows={4}
                  placeholder={`Bridal HD Airbrush Makeup with 3D Mink Lashes\nRoyal Velvet Hair Spa & Designer Bun Styling\n24K Gold Radiance Facial & Deep Pore Cleansing\nComplimentary Bridal Consultation & Skin Tone Mapping\nFree Touch-Up Vanity Kit & Dupatta Draping`}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    lineHeight: 1.5,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* STATUS & CATEGORY */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13px',
                    }}
                  >
                    <option value="active">🟢 Active</option>
                    <option value="inactive">⚪ Inactive / Draft</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bridal & Festive, Skin, Hair"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: `1px solid ${themeStyles.border}`,
                  marginTop: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    background: themeStyles.cardBg,
                    color: themeStyles.textSecondary,
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
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
                  }}
                >
                  {editingOffer ? 'Update Offer' : 'Publish Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL (RICH BREAKDOWN ON EYE ICON CLICK) */}
      {viewModalOpen && selectedOfferForView && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewModalOpen(false);
          }}
        >
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '16px',
              border: `1px solid ${themeStyles.border}`,
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            {/* View Header with Top-Right Tag/Flag Badge */}
            <div
              style={{
                padding: '24px',
                borderBottom: `1px solid ${themeStyles.border}`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '5px',
                    background: isLight ? '#f1f5f9' : '#1e293b',
                    color: themeStyles.textMuted,
                    marginBottom: '6px',
                    display: 'inline-block',
                  }}
                >
                  {selectedOfferForView.category || 'Special Offer'}
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: themeStyles.textPrimary }}>
                  {selectedOfferForView.name}
                </h2>
              </div>

              {/* Tag / Flag badge on top right */}
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '1.5px solid #f59e0b',
                  color: '#92400e',
                  fontSize: '12px',
                  fontWeight: '900',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
                  flexShrink: 0,
                }}
              >
                {selectedOfferForView.tag || '🔥 NEW OFFER'}
              </div>
            </div>

            {/* View Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Offer Promo Banner if available */}
              {selectedOfferForView.image && (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${themeStyles.border}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <img
                    src={selectedOfferForView.image}
                    alt={selectedOfferForView.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              {/* Rate & Pricing Box (If defined) */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${themeStyles.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: themeStyles.textMuted, textTransform: 'uppercase' }}>
                    Offer Rate / Pricing
                  </div>
                  {selectedOfferForView.rate !== undefined && selectedOfferForView.rate !== null && selectedOfferForView.rate !== '' ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '24px', fontWeight: '900', color: '#15803d' }}>
                        ₹{Number(selectedOfferForView.rate).toLocaleString('en-IN')}
                      </span>
                      {selectedOfferForView.regularRate && (
                        <span style={{ fontSize: '14px', color: themeStyles.textMuted, textDecoration: 'line-through' }}>
                          ₹{Number(selectedOfferForView.regularRate).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', fontWeight: '700', color: themeStyles.textPrimary, marginTop: '4px' }}>
                      Consultation / Complimentary Add-on
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: selectedOfferForView.status === 'active' ? '#dcfce7' : '#f1f5f9',
                    color: selectedOfferForView.status === 'active' ? '#15803d' : '#64748b',
                    fontWeight: '800',
                    fontSize: '11px',
                  }}
                >
                  {selectedOfferForView.status === 'active' ? '🟢 ACTIVE' : '⚪ INACTIVE'}
                </div>
              </div>

              {/* Validity Window */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: isLight ? '#fef3c7' : 'rgba(217, 119, 6, 0.1)',
                  border: '1px solid rgba(217, 119, 6, 0.25)',
                }}
              >
                <Calendar size={18} color="#d97706" />
                <div style={{ fontSize: '13px' }}>
                  <span style={{ fontWeight: '700', color: themeStyles.textPrimary }}>Valid Period: </span>
                  <span style={{ fontWeight: '800', color: '#b45309' }}>
                    {formatDateDisplay(selectedOfferForView.validFrom)}
                  </span>
                  {' to '}
                  <span style={{ fontWeight: '800', color: '#b45309' }}>
                    {formatDateDisplay(selectedOfferForView.validUntil)}
                  </span>
                </div>
              </div>

              {/* Overview */}
              {selectedOfferForView.overview && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: themeStyles.textSecondary, marginBottom: '6px' }}>
                    Overview
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: themeStyles.textPrimary, margin: 0 }}>
                    {selectedOfferForView.overview}
                  </p>
                </div>
              )}

              {/* Features List */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: themeStyles.textSecondary, marginBottom: '10px' }}>
                  Included Features & Services ({selectedOfferForView.features?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Array.isArray(selectedOfferForView.features) &&
                    selectedOfferForView.features.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: isLight ? '#fafafa' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${themeStyles.border}`,
                          fontSize: '13px',
                          color: themeStyles.textPrimary,
                        }}
                      >
                        <CheckCircle size={16} color="#15803d" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ lineHeight: 1.4, fontWeight: '500' }}>{feat}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: `1px solid ${themeStyles.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenEditModal(selectedOfferForView);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${themeStyles.border}`,
                  background: themeStyles.cardBg,
                  color: themeStyles.textPrimary,
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Edit2 size={14} />
                <span>Edit This Offer</span>
              </button>

              <button
                onClick={() => setViewModalOpen(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#d97706',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '14px',
              border: `1px solid ${themeStyles.border}`,
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.2)',
                color: '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Trash2 size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 8px', color: themeStyles.textPrimary }}>
              Delete Offer?
            </h3>
            <p style={{ fontSize: '13px', color: themeStyles.textMuted, margin: '0 0 20px' }}>
              Are you sure you want to delete this offer? This action will remove it from the DB.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: `1px solid ${themeStyles.border}`,
                  background: themeStyles.cardBg,
                  color: themeStyles.textSecondary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOffer(deleteConfirmId)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferCatalogPage;
