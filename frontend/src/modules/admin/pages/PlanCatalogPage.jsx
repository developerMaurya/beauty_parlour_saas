/**
 * @file PlanCatalogPage.jsx
 * @description Master Golden Beauty Parlour Plans & Packages Management.
 * Features:
 *   1. Simple Plan Creation: Plan Name, Tier (Basic, Silver, Advanced, Premium), Price, Discount Price, Duration (Hours).
 *   2. Features entered as text ("text ke roop me enter karna", 1 per line) with automatic bullet rendering.
 *   3. Prominent View Details Modal on Eye icon click showing full breakdown of all features and pricing.
 *   4. Exactly 1 single pre-seeded initial plan in DB/localStorage.
 *   5. Full CRUD: Add, Edit, View, Delete, Toggle Status.
 *   6. Clean White Luxury Theme (default) + Dark Mode Theme Switcher.
 *   7. Grid Cards View & Table List View.
 *   8. Pagination & smooth custom scrollbar.
 * @module frontend/src/modules/admin/pages/PlanCatalogPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
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
  Crown,
  Award,
  Star,
  ShieldCheck,
  Car,
  Building,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { packageFetcher } from '../../../services/api/admin/adminApi.js';
import { uploadImageToCloudflare } from '../../../services/uploadService.js';

// Self-contained duration & validity formatter helper (Months)
export const formatDurationMonths = (val) => {
  if (val === undefined || val === null || val === '') {
    return 'Flexible / Ongoing';
  }
  const num = Number(val);
  if (isNaN(num) || num <= 0) return 'Flexible / Ongoing';
  return `${num} ${num === 1 ? 'Month' : 'Months'}`;
};

// Backward-compat export for any legacy references
export const formatDurationHours = formatDurationMonths;

// Plan Tiers & metadata
export const PLAN_TIERS = [
  { id: 'Basic', label: 'Basic Tier', color: '#64748b', bg: '#f1f5f9', icon: Star },
  { id: 'Silver', label: 'Silver Tier', color: '#0284c7', bg: '#e0f2fe', icon: Award },
  { id: 'Advanced', label: 'Advanced Tier', color: '#7c3aed', bg: '#f3e8ff', icon: Sparkles },
  { id: 'Premium', label: 'Premium Tier', color: '#d97706', bg: '#fef3c7', icon: Crown },
];

// Pre-seeded Master Parlour Plans (Strictly Only 1 Single Initial Plan)
const INITIAL_PARLOUR_PLANS = [
  {
    _id: 'plan_p_101',
    name: 'Silver Luxury Bridal Glam Combo Plan',
    tier: 'Silver', // 'Basic' | 'Silver' | 'Advanced' | 'Premium'
    price: 18999,
    discountPrice: 15999,
    durationMonths: 3, // Validity: 3 Months
    features: [
      'Bridal HD Airbrush Makeup with 3D Lashes',
      'Precision Hair Cut & Velvet Blowout Styling',
      'Hydra-Glow Facial & Skin Deep Prep',
      'Free Bridal Consultation & Skin Tone Mapping',
      'Complimentary Touch-up Vanity Kit & Dupatta Draping',
    ],
    homeServiceAllowed: true,
    status: 'active',
    description: 'Comprehensive 3-month bridal transformation bundle covering airbrush bridal makeup, designer hair styling, and deep skin hydra prep.',
    createdAt: '2026-11-01',
  },
];

const STORAGE_KEY = 'parlour_plans_master_v2';

const loadStoredPlans = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARLOUR_PLANS));
      return INITIAL_PARLOUR_PLANS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PARLOUR_PLANS;
  } catch {
    return INITIAL_PARLOUR_PLANS;
  }
};

const saveStoredPlans = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('parlour_plans_updated', { detail: { count: list.length } }));
  } catch (e) {
    console.warn('Plans storage save warning:', e);
  }
};

export const PlanCatalogPage = () => {
  const toast = useToast();
  const { selectedBranchId } = useTenantAdmin();

  // Theme Mode: Light (Luxury Clean White) default
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('parlour_plans_theme') || 'light';
  });

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    localStorage.setItem('parlour_plans_theme', next);
  };

  const isLight = themeMode === 'light';

  // Master Plans State
  const [plans, setPlans] = useState(loadStoredPlans);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'Basic' | 'Silver' | 'Advanced' | 'Premium'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPlanForView, setSelectedPlanForView] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tier: 'Silver',
    image: '',
    price: '',
    discountPrice: '',
    durationMonths: '', // Validity in Months (kitne month tak plan chalega)
    featuresText: '', // Multi-line text for features
    description: '',
    homeServiceAllowed: true,
    status: 'active',
  });

  // Sync to localStorage
  useEffect(() => {
    saveStoredPlans(plans);
  }, [plans]);

  // Try fetching from backend on mount (graceful fallback)
  useEffect(() => {
    let isMounted = true;
    const fetchRemotePlans = async () => {
      try {
        setLoading(true);
        const res = await packageFetcher.getAll({ limit: 50 });
        if (res?.data && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          const mapped = res.data.map((item, idx) => ({
            _id: item._id || `plan_${idx + 1}`,
            name: item.name || item.title || 'Golden Parlour Plan',
            tier: item.tier || 'Silver',
            price: item.price || 15000,
            discountPrice: item.discountPrice || item.finalPrice || '',
            durationMonths: item.durationMonths || item.validityMonths || (item.durationHours ? Math.ceil(item.durationHours / 30) : 3),
            features: Array.isArray(item.features)
              ? item.features
              : Array.isArray(item.services)
              ? item.services.map((s) => (typeof s === 'string' ? s : s.name))
              : ['Bridal HD Airbrush Makeup', 'Hydra-Glow Facial'],
            homeServiceAllowed: item.homeServiceAllowed !== undefined ? item.homeServiceAllowed : true,
            status: item.status || 'active',
            description: item.description || '',
            createdAt: item.createdAt || '2026-11-01',
          }));
          setPlans(mapped);
        }
      } catch (err) {
        // Fallback silently
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRemotePlans();
    return () => {
      isMounted = false;
    };
  }, [selectedBranchId]);

  // Filtered & Searched Plans
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Search Match
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (plan.name || '').toLowerCase().includes(q);
      const descMatch = (plan.description || '').toLowerCase().includes(q);
      const tierMatch = (plan.tier || '').toLowerCase().includes(q);
      const featMatch = Array.isArray(plan.features) && plan.features.some((f) => (f || '').toLowerCase().includes(q));
      if (q && !nameMatch && !descMatch && !tierMatch && !featMatch) return false;

      // Tier Filter
      if (tierFilter !== 'all' && plan.tier !== tierFilter) return false;

      // Status Filter
      if (statusFilter !== 'all' && plan.status !== statusFilter) return false;

      return true;
    });
  }, [plans, searchQuery, tierFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage) || 1;
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlans.slice(start, start + itemsPerPage);
  }, [filteredPlans, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setImageUploadError('');
    setFormData({
      name: '',
      tier: 'Silver',
      image: '',
      price: '',
      discountPrice: '',
      durationMonths: '',
      featuresText: '',
      description: '',
      homeServiceAllowed: true,
      status: 'active',
    });
    setFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setImageUploadError('');
    setFormData({
      name: plan.name || '',
      tier: plan.tier || 'Silver',
      image: plan.image || plan.photo || plan.banner || '',
      price: plan.price !== undefined && plan.price !== null ? plan.price : '',
      discountPrice: plan.discountPrice !== undefined && plan.discountPrice !== null ? plan.discountPrice : '',
      durationMonths: plan.durationMonths !== undefined && plan.durationMonths !== null ? plan.durationMonths : (plan.durationHours || ''),
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      description: plan.description || '',
      homeServiceAllowed: plan.homeServiceAllowed !== undefined ? plan.homeServiceAllowed : true,
      status: plan.status || 'active',
    });
    setFormModalOpen(true);
  };

  // Open View Details Modal
  const handleOpenViewModal = (plan) => {
    setSelectedPlanForView(plan);
    setViewModalOpen(true);
  };

  // Save Form (Create or Update)
  const handleSavePlan = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter the Plan Name');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Please enter a valid regular price for the plan');
      return;
    }

    // Parse features line-by-line from text
    const parsedFeatures = formData.featuresText
      .split('\n')
      .map((line) => line.trim().replace(/^[-*•]\s*/, ''))
      .filter((line) => line.length > 0);

    const planPayload = {
      name: formData.name.trim(),
      tier: formData.tier,
      image: formData.image || undefined,
      price: Number(formData.price),
      discountPrice: formData.discountPrice !== '' ? Number(formData.discountPrice) : null,
      durationMonths: formData.durationMonths !== '' ? Number(formData.durationMonths) : null,
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Complete Golden Beauty Parlour Service Care'],
      description: formData.description.trim(),
      homeServiceAllowed: !!formData.homeServiceAllowed,
      status: formData.status,
    };

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) => (p._id === editingPlan._id ? { ...p, ...planPayload, updatedAt: new Date().toISOString() } : p))
      );
      toast.success(`Plan "${planPayload.name}" updated successfully!`);
    } else {
      const newPlan = {
        _id: `plan_p_${Date.now()}`,
        ...planPayload,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPlans((prev) => [newPlan, ...prev]);
      toast.success(`New Plan "${planPayload.name}" created successfully!`);
    }

    setFormModalOpen(false);
  };

  // Delete Plan
  const handleDeletePlan = (id) => {
    const target = plans.find((p) => p._id === id);
    setPlans((prev) => prev.filter((p) => p._id !== id));
    setDeleteConfirmId(null);
    toast.success(`Plan "${target?.name || ''}" deleted successfully`);
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (plan) => {
    const nextStatus = plan.status === 'active' ? 'inactive' : 'active';
    setPlans((prev) => prev.map((p) => (p._id === plan._id ? { ...p, status: nextStatus } : p)));
    toast.success(`Plan "${plan.name}" marked as ${nextStatus.toUpperCase()}`);
  };

  // Luxury Dynamic Theme Colors
  const themeStyles = {
    pageBg: isLight ? '#f8fafc' : '#0a0f1d',
    cardBg: isLight ? '#ffffff' : '#111827',
    border: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
    textPrimary: isLight ? '#0f172a' : '#f8fafc',
    textSecondary: isLight ? '#475569' : '#cbd5e1',
    textMuted: isLight ? '#64748b' : '#94a3b8',
    tableHeaderBg: isLight ? '#f1f5f9' : 'rgba(30, 41, 59, 0.7)',
    tableRowHover: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
    inputBg: isLight ? '#ffffff' : '#1e293b',
    goldAccent: '#d97706',
  };

  // Helper for tier color & badge
  const getTierInfo = (tierName) => {
    return PLAN_TIERS.find((t) => t.id.toLowerCase() === (tierName || '').toLowerCase()) || PLAN_TIERS[1];
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
        .plan-card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .plan-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -6px rgba(0, 0, 0, ${isLight ? '0.08' : '0.4'});
          border-color: #0284c7 !important;
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
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
              }}
            >
              <Layers size={20} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
              Parlour Plans & Packages
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '999px',
                background: isLight ? '#e0f2fe' : 'rgba(2, 132, 199, 0.2)',
                color: '#0369a1',
                border: `1px solid ${isLight ? '#bae6fd' : 'rgba(2, 132, 199, 0.4)'}`,
              }}
            >
              Golden Beauty Parlour
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: themeStyles.textSecondary }}>
            Configure simple beauty plans by tier (Basic, Silver, Advanced, Premium) with line-by-line feature lists.
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
                color: viewMode === 'grid' ? '#0284c7' : themeStyles.textMuted,
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
                color: viewMode === 'table' ? '#0284c7' : themeStyles.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <List size={16} />
            </button>
          </div>

          {/* '+ Create Plan' Prominent Button */}
          <button
            onClick={handleOpenCreateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Plus size={17} strokeWidth={2.5} />
            <span>+ Create Plan</span>
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
            placeholder="Search by plan name, tier, features, or description..."
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
          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value);
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
            <option value="all">All Tiers ({plans.length})</option>
            {PLAN_TIERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

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
            <option value="all">All Statuses</option>
            <option value="active">🟢 Active Plans</option>
            <option value="inactive">⚪ Inactive / Draft</option>
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

      {/* PLANS PRESENTATION (GRID VIEW OR TABLE VIEW) */}
      {filteredPlans.length === 0 ? (
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
              background: isLight ? '#e0f2fe' : 'rgba(2, 132, 199, 0.2)',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Layers size={26} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>No Plans Found</h3>
          <p style={{ fontSize: '13.5px', color: themeStyles.textMuted, maxWidth: '400px', margin: '0 auto 20px' }}>
            No plans match your search or filter. You can create a new plan or reset filters.
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
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>Create First Plan</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: LUXURY TIER CARDS */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '22px',
            marginBottom: '28px',
          }}
        >
          {paginatedPlans.map((plan) => {
            const tierInfo = getTierInfo(plan.tier);
            const TierIcon = tierInfo.icon;
            const hasDiscount = plan.discountPrice && Number(plan.discountPrice) < Number(plan.price);
            const finalPrice = hasDiscount ? Number(plan.discountPrice) : Number(plan.price);

            return (
              <div
                key={plan._id}
                className="plan-card-hover"
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
                {/* TOP HEADER: TIER BADGE & HOME SERVICE TAG */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: isLight ? tierInfo.bg : 'rgba(255, 255, 255, 0.05)',
                      color: tierInfo.color,
                      fontSize: '11.5px',
                      fontWeight: '800',
                      border: `1px solid ${tierInfo.color}33`,
                    }}
                  >
                    <TierIcon size={14} />
                    <span>{plan.tier.toUpperCase()} TIER</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {plan.homeServiceAllowed ? (
                      <span
                        title="Home Service Available"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.15)',
                          color: '#15803d',
                        }}
                      >
                        <Car size={12} />
                        <span>Home Service</span>
                      </span>
                    ) : (
                      <span
                        title="In-Salon Only"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                          color: themeStyles.textMuted,
                        }}
                      >
                        <Building size={12} />
                        <span>In-Salon</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* PLAN IMAGE / BANNER */}
                {plan.image && (
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
                      src={plan.image}
                      alt={plan.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* PLAN NAME */}
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: '800',
                    color: themeStyles.textPrimary,
                    margin: '0 0 10px',
                    lineHeight: 1.35,
                  }}
                >
                  {plan.name}
                </h3>

                {/* PRICING & DURATION ROW */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isLight ? '#fafafa' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px dashed ${themeStyles.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#15803d' }}>
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: themeStyles.textMuted,
                          textDecoration: 'line-through',
                        }}
                      >
                        ₹{Number(plan.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Duration / Validity in Months */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: themeStyles.textMuted, fontWeight: '600' }}>
                    <Clock size={13} color="#0284c7" />
                    <span>Validity: {formatDurationMonths(plan.durationMonths)}</span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                {plan.description && (
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
                    {plan.description}
                  </p>
                )}

                {/* FEATURES LIST (BULLETS) */}
                {Array.isArray(plan.features) && plan.features.length > 0 && (
                  <div style={{ marginBottom: '18px', flex: 1 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: themeStyles.textMuted, marginBottom: '6px' }}>
                      Included Features ({plan.features.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {plan.features.slice(0, 3).map((feat, idx) => (
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
                          <CheckCircle size={13} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ lineHeight: 1.35 }}>{feat}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <span
                          onClick={() => handleOpenViewModal(plan)}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '700',
                            color: '#0284c7',
                            cursor: 'pointer',
                            marginTop: '2px',
                          }}
                        >
                          +{plan.features.length - 3} more features (Click to view full plan)
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
                    onClick={() => handleToggleStatus(plan)}
                    title={`Click to mark as ${plan.status === 'active' ? 'Inactive' : 'Active'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background:
                        plan.status === 'active'
                          ? isLight
                            ? '#dcfce7'
                            : 'rgba(34, 197, 94, 0.2)'
                          : isLight
                          ? '#f1f5f9'
                          : 'rgba(255, 255, 255, 0.05)',
                      color: plan.status === 'active' ? '#15803d' : themeStyles.textMuted,
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
                        background: plan.status === 'active' ? '#22c55e' : '#94a3b8',
                      }}
                    />
                    <span>{plan.status === 'active' ? 'ACTIVE' : 'INACTIVE'}</span>
                  </button>

                  {/* Actions: View (Eye), Edit, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenViewModal(plan)}
                      title="View Full Plan Details"
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
                      <Eye size={14} color="#0284c7" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(plan)}
                      title="Edit Plan"
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
                      onClick={() => setDeleteConfirmId(plan._id)}
                      title="Delete Plan"
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
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Plan Name</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Tier</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Duration</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Price (₹)</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Home Service</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Features</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: themeStyles.textSecondary, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.map((plan, idx) => {
                const tierInfo = getTierInfo(plan.tier);
                const hasDiscount = plan.discountPrice && Number(plan.discountPrice) < Number(plan.price);
                const finalPrice = hasDiscount ? Number(plan.discountPrice) : Number(plan.price);
                const rowNum = (currentPage - 1) * itemsPerPage + idx + 1;

                return (
                  <tr
                    key={plan._id}
                    style={{
                      borderBottom: `1px solid ${themeStyles.border}`,
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = themeStyles.tableRowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '12.5px', color: themeStyles.textMuted }}>{rowNum}</td>

                    {/* Plan Name with Image Thumbnail */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {plan.image ? (
                          <img
                            src={plan.image}
                            alt={plan.name}
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
                              background: isLight ? tierInfo.bg : 'rgba(255, 255, 255, 0.05)',
                              color: tierInfo.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '14px',
                              flexShrink: 0,
                              border: `1px solid ${tierInfo.color}33`,
                            }}
                          >
                            {plan.name?.charAt(0) || 'P'}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '13.5px', color: themeStyles.textPrimary }}>
                            {plan.name}
                          </div>
                          <div style={{ fontSize: '11px', color: themeStyles.textMuted }}>{plan.description?.slice(0, 45) || 'Golden Parlour Plan'}...</div>
                        </div>
                      </div>
                    </td>

                    {/* Tier Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isLight ? tierInfo.bg : 'rgba(255, 255, 255, 0.05)',
                          color: tierInfo.color,
                          fontSize: '11px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {plan.tier}
                      </span>
                    </td>

                    {/* Validity in Months */}
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: themeStyles.textSecondary, whiteSpace: 'nowrap' }}>
                      {formatDurationMonths(plan.durationMonths)}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13.5px', color: '#15803d' }}>
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <span style={{ fontSize: '11px', color: themeStyles.textMuted, textDecoration: 'line-through', marginLeft: '6px' }}>
                          ₹{Number(plan.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>

                    {/* Home Service */}
                    <td style={{ padding: '14px 16px' }}>
                      {plan.homeServiceAllowed ? (
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#15803d' }}>🚗 Allowed</span>
                      ) : (
                        <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>🏢 In-Salon</span>
                      )}
                    </td>

                    {/* Features count */}
                    <td style={{ padding: '14px 16px', fontSize: '12.5px' }}>
                      <span
                        onClick={() => handleOpenViewModal(plan)}
                        style={{
                          color: '#0284c7',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        {Array.isArray(plan.features) ? `${plan.features.length} Features` : '1 Feature'}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: 'none',
                          background:
                            plan.status === 'active'
                              ? isLight
                                ? '#dcfce7'
                                : 'rgba(34, 197, 94, 0.2)'
                              : isLight
                              ? '#f1f5f9'
                              : 'rgba(255, 255, 255, 0.05)',
                          color: plan.status === 'active' ? '#15803d' : themeStyles.textMuted,
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        {plan.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => handleOpenViewModal(plan)}
                        title="View Full Plan Details"
                        style={{
                          marginRight: '6px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${themeStyles.border}`,
                          background: themeStyles.cardBg,
                          color: '#0284c7',
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(plan)}
                        title="Edit Plan"
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
                        onClick={() => setDeleteConfirmId(plan._id)}
                        title="Delete Plan"
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
          Showing <b style={{ color: themeStyles.textPrimary }}>{paginatedPlans.length}</b> of{' '}
          <b style={{ color: themeStyles.textPrimary }}>{filteredPlans.length}</b> plans (Total in DB: {plans.length})
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

      {/* CREATE / EDIT PLAN MODAL */}
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
              maxWidth: '660px',
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
                  {editingPlan ? 'Edit Parlour Plan' : 'Create New Parlour Plan'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: themeStyles.textMuted }}>
                  Enter plan name, select tier, set pricing & duration, and list features line by line.
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
            <form onSubmit={handleSavePlan} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Plan Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Plan Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silver Luxury Bridal Glam Combo Plan"
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

              {/* Plan Image / Banner (Cloudflare Upload) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Plan Banner / Image (Cloudflare Upload - Optional)
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
                          border: '2px solid #0284c7',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                          flexShrink: 0,
                          background: '#f8fafc',
                        }}
                      >
                        <img
                          src={formData.image}
                          alt="Plan Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150';
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '10px',
                          background: isLight ? '#f0f9ff' : 'rgba(2, 132, 199, 0.1)',
                          border: '2px dashed rgba(2, 132, 199, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0284c7',
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
                        id="plan-image-upload-input"
                        style={{ display: 'none' }}
                        disabled={isUploadingImage}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploadingImage(true);
                            setImageUploadError('');
                            try {
                              const cfUrl = await uploadImageToCloudflare(file, {
                                folder: 'plans',
                                entityType: 'plan',
                              });
                              setFormData((prev) => ({ ...prev, image: cfUrl }));
                              toast.success('Plan image uploaded to Cloudflare successfully!');
                            } catch (err) {
                              console.error('Plan image upload failed:', err);
                              setImageUploadError(err.message || 'Image upload failed. You can paste image link below.');
                              toast.error(err.message || 'Failed to upload plan image');
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
                          onClick={() => document.getElementById('plan-image-upload-input')?.click()}
                          style={{
                            fontSize: '12px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: isUploadingImage ? 'rgba(2, 132, 199, 0.25)' : 'rgba(2, 132, 199, 0.12)',
                            border: '1px solid rgba(2, 132, 199, 0.35)',
                            color: '#0284c7',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: isUploadingImage ? 'wait' : 'pointer',
                          }}
                        >
                          <UploadCloud size={14} />
                          {isUploadingImage ? '⏳ Uploading to Cloudflare...' : '📁 Choose Plan Image'}
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

                      <span style={{ fontSize: '11px', color: isUploadingImage ? '#0284c7' : themeStyles.textMuted }}>
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

              {/* Tier Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Plan Tier
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {PLAN_TIERS.map((t) => {
                    const isSelected = formData.tier === t.id;
                    const TIcon = t.icon;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setFormData({ ...formData, tier: t.id })}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? t.color : themeStyles.border}`,
                          background: isSelected ? (isLight ? t.bg : 'rgba(255, 255, 255, 0.08)') : themeStyles.cardBg,
                          color: isSelected ? t.color : themeStyles.textSecondary,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          fontWeight: '800',
                          fontSize: '12px',
                        }}
                      >
                        <TIcon size={16} />
                        <span>{t.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    Regular Price (₹) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="18999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
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
                    Discount Price (₹) <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>(Opt)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="15999"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
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
                    Validity (Months) <span style={{ fontSize: '11px', color: '#0284c7' }}>(Kitne Month chalega)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    placeholder="e.g. 1, 3, 6, 12 Months"
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                  {/* Quick Preset Buttons */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    {[1, 3, 6, 12].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setFormData({ ...formData, durationMonths: m })}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${Number(formData.durationMonths) === m ? '#0284c7' : themeStyles.border}`,
                          background: Number(formData.durationMonths) === m ? (isLight ? '#e0f2fe' : 'rgba(2, 132, 199, 0.25)') : 'transparent',
                          color: Number(formData.durationMonths) === m ? '#0369a1' : themeStyles.textMuted,
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {m}M
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FEATURES ENTERED AS TEXT (LINE BY LINE) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: themeStyles.textPrimary, margin: 0 }}>
                    Included Features & Services <span style={{ fontSize: '11px', color: '#0284c7' }}>(Enter 1 feature per line)</span>
                  </label>
                  <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>Press Enter for new item</span>
                </div>
                <textarea
                  rows={4}
                  placeholder={`Bridal HD Airbrush Makeup with 3D Lashes\nPrecision Hair Cut & Velvet Blowout Styling\nHydra-Glow Facial & Skin Deep Prep\nFree Bridal Consultation & Skin Tone Mapping\nComplimentary Touch-up Vanity Kit & Dupatta Draping`}
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

              {/* Plan Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                  Plan Overview / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of what this plan delivers to the client..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

              {/* Home Service & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: themeStyles.textPrimary,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.homeServiceAllowed}
                    onChange={(e) => setFormData({ ...formData, homeServiceAllowed: e.target.checked })}
                    style={{ width: '17px', height: '17px', accentColor: '#0284c7', cursor: 'pointer' }}
                  />
                  <span>🚗 Home Service Available</span>
                </label>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: themeStyles.textPrimary }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
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
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  {editingPlan ? 'Update Plan' : 'Publish Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL (RICH BREAKDOWN ON EYE ICON CLICK) */}
      {viewModalOpen && selectedPlanForView && (
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
            {/* View Header with Tier Badge */}
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
                    fontWeight: '800',
                    padding: '3px 9px',
                    borderRadius: '5px',
                    background: isLight ? getTierInfo(selectedPlanForView.tier).bg : 'rgba(255, 255, 255, 0.05)',
                    color: getTierInfo(selectedPlanForView.tier).color,
                    marginBottom: '6px',
                    display: 'inline-block',
                    border: `1px solid ${getTierInfo(selectedPlanForView.tier).color}33`,
                  }}
                >
                  {selectedPlanForView.tier.toUpperCase()} TIER PLAN
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: themeStyles.textPrimary }}>
                  {selectedPlanForView.name}
                </h2>
              </div>

              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: selectedPlanForView.status === 'active' ? '#dcfce7' : '#f1f5f9',
                  color: selectedPlanForView.status === 'active' ? '#15803d' : '#64748b',
                  fontWeight: '800',
                  fontSize: '11px',
                  flexShrink: 0,
                }}
              >
                {selectedPlanForView.status === 'active' ? '🟢 ACTIVE' : '⚪ INACTIVE'}
              </div>
            </div>

            {/* View Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Plan Banner Photo if available */}
              {selectedPlanForView.image && (
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
                    src={selectedPlanForView.image}
                    alt={selectedPlanForView.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              {/* Pricing Box */}
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
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: themeStyles.textMuted, textTransform: 'uppercase' }}>
                    Package Price
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#15803d' }}>
                      ₹{Number(selectedPlanForView.discountPrice || selectedPlanForView.price).toLocaleString('en-IN')}
                    </span>
                    {selectedPlanForView.discountPrice &&
                      Number(selectedPlanForView.discountPrice) < Number(selectedPlanForView.price) && (
                        <span style={{ fontSize: '14px', color: themeStyles.textMuted, textDecoration: 'line-through' }}>
                          ₹{Number(selectedPlanForView.price).toLocaleString('en-IN')}
                        </span>
                      )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: themeStyles.textMuted, textTransform: 'uppercase' }}>
                    Validity & Dispatch
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: themeStyles.textPrimary, marginTop: '4px' }}>
                    🗓️ Validity: {formatDurationMonths(selectedPlanForView.durationMonths)}
                  </div>
                  <div style={{ fontSize: '11px', color: selectedPlanForView.homeServiceAllowed ? '#15803d' : themeStyles.textMuted, marginTop: '2px', fontWeight: '600' }}>
                    {selectedPlanForView.homeServiceAllowed ? '🚗 Home Service Available' : '🏢 In-Salon Only'}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedPlanForView.description && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: themeStyles.textSecondary, marginBottom: '6px' }}>
                    Plan Overview
                  </h4>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: themeStyles.textPrimary, margin: 0 }}>
                    {selectedPlanForView.description}
                  </p>
                </div>
              )}

              {/* Features List */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: themeStyles.textSecondary, marginBottom: '10px' }}>
                  Included Features & Services ({selectedPlanForView.features?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Array.isArray(selectedPlanForView.features) &&
                    selectedPlanForView.features.map((feat, idx) => (
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
                        <CheckCircle size={16} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
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
                  handleOpenEditModal(selectedPlanForView);
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
                <span>Edit This Plan</span>
              </button>

              <button
                onClick={() => setViewModalOpen(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0284c7',
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
              Delete Plan?
            </h3>
            <p style={{ fontSize: '13px', color: themeStyles.textMuted, margin: '0 0 20px' }}>
              Are you sure you want to delete this plan? This action will remove it from the DB.
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
                onClick={() => handleDeletePlan(deleteConfirmId)}
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

export default PlanCatalogPage;
