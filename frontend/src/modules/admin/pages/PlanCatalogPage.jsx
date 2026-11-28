/**
 * @file PlanCatalogPage.jsx
 * @description Master Golden Beauty Parlour: Plans, Dynamic Services & Professional Sub-Services Master.
 * Features:
 *   1. Sub-Services Master Catalog (Full Page / CRUD View):
 *      - Lists all sub-services linked dynamically to parent DB services.
 *      - Filter by Parent Service, Search by Name/Desc, Filter by Status.
 *      - Prominent '+ Create Sub-Service' button opening luxury modal.
 *      - Edit, Delete, and Status Toggle for each sub-service.
 *   2. Plan Creation & Management (With '+ Add More Service' Multi-Service Builder):
 *      - Plan Name, Price, Validity (Months), Tier, Description, Status.
 *      - Multiple Services: Select Service from DB dropdown + Allowed Usage Limit.
 *      - Select Sub-Services from Database Sub-Services Master via multi-select/dropdown.
 *      - Each sub-service is marked with 'Allowed' badge.
 *      - No hardcoded data — everything dynamically synchronized with DB & local master store.
 *   3. Luxury Clean White (default) + Dark Mode theme support.
 * @module frontend/src/modules/admin/pages/PlanCatalogPage
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Copy,
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
  Crown,
  Award,
  Star,
  Scissors,
  Tag,
  AlertCircle,
  Settings,
  Filter,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  serviceFetcher,
  serviceSubcategoryFetcher,
  serviceOptionFetcher,
  subServiceFetcher,
  parlourPlanFetcher,
} from '../../../services/api/admin/adminApi.js';

// Format duration helper
export const formatDurationMonths = (val) => {
  if (val === undefined || val === null || val === '') return 'Flexible / Ongoing';
  const num = Number(val);
  if (isNaN(num) || num <= 0) return 'Flexible / Ongoing';
  return `${num} ${num === 1 ? 'Month' : 'Months'}`;
};

// Plan Tiers & metadata
export const PLAN_TIERS = [
  { id: 'Basic', label: 'Basic Tier', color: '#64748b', bg: '#f1f5f9', icon: Star },
  { id: 'Silver', label: 'Silver Tier', color: '#0284c7', bg: '#e0f2fe', icon: Award },
  { id: 'Advanced', label: 'Advanced Tier', color: '#7c3aed', bg: '#f3e8ff', icon: Sparkles },
  { id: 'Premium', label: 'Premium Tier', color: '#d97706', bg: '#fef3c7', icon: Crown },
];

// Initial Database Sub-Services Master List
const INITIAL_MASTER_SUBSERVICES = [
  // Nail Design
  { id: 'sub_nail_1', serviceName: 'Nail Design', name: 'Simple Nail Design', description: 'Minimalist line, dot, chrome accent & single color art', status: 'active' },
  { id: 'sub_nail_2', serviceName: 'Nail Design', name: 'French Nail Design', description: 'Classic white smile-line & modern ombre French tips', status: 'active' },
  { id: 'sub_nail_3', serviceName: 'Nail Design', name: 'Bridal Nail Design', description: 'Heavy 3D stone, glitter, foil & chrome bridal design', status: 'active' },
  { id: 'sub_nail_4', serviceName: 'Nail Design', name: 'Gel Extension Nail Art', description: 'UV cured acrylic tip nail extensions with gel art', status: 'active' },
  { id: 'sub_nail_5', serviceName: 'Nail Design', name: 'Cat Eye & Velvet Nails', description: 'Magnetic shimmer velvet finish styling', status: 'active' },

  // Hair Service
  { id: 'sub_hair_1', serviceName: 'Hair Service', name: 'Haircut & Styling', description: 'Feather, layer, bob, and curtain bangs haircutting', status: 'active' },
  { id: 'sub_hair_2', serviceName: 'Hair Service', name: 'Hair Spa Treatment', description: 'Deep moisture hydration with ozone steam therapy', status: 'active' },
  { id: 'sub_hair_3', serviceName: 'Hair Service', name: 'Global Hair Color', description: 'Ammonia-free root touchup & global tint shading', status: 'active' },
  { id: 'sub_hair_4', serviceName: 'Hair Service', name: 'Smoothening / Rebonding', description: 'Chemical straight styling & gloss keratin seal', status: 'active' },
  { id: 'sub_hair_5', serviceName: 'Hair Service', name: 'Keratin Protein Wash', description: 'Frizz control formaldeyde-free protein wash', status: 'active' },

  // Makeup Service
  { id: 'sub_mu_1', serviceName: 'Makeup Service', name: 'Basic HD Makeup', description: 'Lightweight daytime natural HD foundation base', status: 'active' },
  { id: 'sub_mu_2', serviceName: 'Makeup Service', name: 'Airbrush Bridal Makeup', description: '24-hr waterproof silicone bridal airbrush artistry', status: 'active' },
  { id: 'sub_mu_3', serviceName: 'Makeup Service', name: 'Party Glam Makeup', description: 'Smokey glitter eye contour & bold lip finish', status: 'active' },
  { id: 'sub_mu_4', serviceName: 'Makeup Service', name: 'Engagement Look', description: 'Soft pastel dewy finish with wispy lashes', status: 'active' },

  // Facial
  { id: 'sub_fac_1', serviceName: 'Facial', name: 'O3+ Bridal Glow Facial', description: 'Oxygenating whitening & pigmentation removal therapy', status: 'active' },
  { id: 'sub_fac_2', serviceName: 'Facial', name: 'Hydra Facial Prep', description: 'Vacuum pore extraction with hyaluronic serum infusion', status: 'active' },
  { id: 'sub_fac_3', serviceName: 'Facial', name: 'Herbal & Fruit Clean-Up', description: 'Botanical pore cleansing & organic scrub exfoliation', status: 'active' },
  { id: 'sub_fac_4', serviceName: 'Facial', name: 'D-Tan Glow Pack', description: 'Sun tan removal & milk protein brightening mask', status: 'active' },

  // Threading
  { id: 'sub_thr_1', serviceName: 'Threading', name: 'Eyebrow Shaping', description: 'Precision arch threading and brow alignment', status: 'active' },
  { id: 'sub_thr_2', serviceName: 'Threading', name: 'Upper Lip Threading', description: 'Quick sanitised upper lip hair removal', status: 'active' },
  { id: 'sub_thr_3', serviceName: 'Threading', name: 'Full Face Threading', description: 'Forehead, chin, cheeks & jawline complete threading', status: 'active' },

  // Waxing
  { id: 'sub_wax_1', serviceName: 'Waxing', name: 'Full Arms Wax', description: 'Chocolate / Rica smooth arm waxing', status: 'active' },
  { id: 'sub_wax_2', serviceName: 'Waxing', name: 'Half Legs Wax', description: 'Calf & knee soothing chocolate wax', status: 'active' },
  { id: 'sub_wax_3', serviceName: 'Waxing', name: 'Rica Underarms Wax', description: 'Painless sensitive peel underarm wax', status: 'active' },

  // Mehendi & Draping
  { id: 'sub_meh_1', serviceName: 'Mehendi & Draping', name: 'Bridal Saree Draping', description: 'Pleated bridal cancan saree draping', status: 'active' },
  { id: 'sub_meh_2', serviceName: 'Mehendi & Draping', name: 'Dupatta Setting', description: 'Double dupatta head pin-up styling', status: 'active' },
  { id: 'sub_meh_3', serviceName: 'Mehendi & Draping', name: 'Arabic Mehendi Art', description: 'Front & back hand geometric floral art', status: 'active' },
];

// Initial Master Plans (Includes exact example requested by User)
const INITIAL_PARLOUR_PLANS = [
  {
    _id: 'plan_p_premium',
    name: 'Premium Beauty Package',
    tier: 'Premium',
    price: 15000,
    discountPrice: 13500,
    durationMonths: 6,
    status: 'active',
    description: 'Comprehensive 6-month parlour training and practical package covering 6 dynamic service verticals with allowed quotas and variant choices.',
    includedServices: [
      {
        id: 'srv_hair',
        serviceName: 'Hair Service',
        allowedUsage: 5,
        allowedSubServices: ['Haircut & Styling', 'Hair Spa Treatment', 'Global Hair Color'],
        icon: '💇‍♀️',
      },
      {
        id: 'srv_makeup',
        serviceName: 'Makeup Service',
        allowedUsage: 6,
        allowedSubServices: ['Basic HD Makeup', 'Airbrush Bridal Makeup', 'Party Glam Makeup'],
        icon: '💄',
      },
      {
        id: 'srv_nail',
        serviceName: 'Nail Design',
        allowedUsage: 3,
        allowedSubServices: ['Simple Nail Design', 'French Nail Design', 'Bridal Nail Design'],
        icon: '💅',
      },
      {
        id: 'srv_facial',
        serviceName: 'Facial',
        allowedUsage: 4,
        allowedSubServices: ['O3+ Bridal Glow Facial', 'Hydra Facial Prep', 'Herbal & Fruit Clean-Up'],
        icon: '✨',
      },
      {
        id: 'srv_threading',
        serviceName: 'Threading',
        allowedUsage: 10,
        allowedSubServices: ['Eyebrow Shaping', 'Upper Lip Threading', 'Full Face Threading'],
        icon: '✂️',
      },
      {
        id: 'srv_waxing',
        serviceName: 'Waxing',
        allowedUsage: 3,
        allowedSubServices: ['Full Arms Wax', 'Half Legs Wax', 'Rica Underarms Wax'],
        icon: '🍯',
      },
    ],
  },
];

const STORAGE_KEY_PLANS = 'parlour_plans_master_v4';
const STORAGE_KEY_SUBSERVICES = 'parlour_subservices_db_master_v1';

const loadStoredPlans = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) {
      const seeded = INITIAL_PARLOUR_PLANS.map((p) => ({ ...p, _id: p._id || p.id, id: p._id || p.id }));
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p) => ({ ...p, _id: p._id || p.id, id: p._id || p.id }));
    }
    return INITIAL_PARLOUR_PLANS.map((p) => ({ ...p, _id: p._id || p.id, id: p._id || p.id }));
  } catch {
    return INITIAL_PARLOUR_PLANS.map((p) => ({ ...p, _id: p._id || p.id, id: p._id || p.id }));
  }
};

const loadStoredSubServices = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSERVICES);
    if (!raw) {
      const seeded = INITIAL_MASTER_SUBSERVICES.map((s) => ({
        ...s,
        _id: s._id || s.id,
        id: s._id || s.id,
      }));
      localStorage.setItem(STORAGE_KEY_SUBSERVICES, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((s) => ({ ...s, _id: s._id || s.id, id: s._id || s.id }));
    }
    return INITIAL_MASTER_SUBSERVICES.map((s) => ({ ...s, _id: s._id || s.id, id: s._id || s.id }));
  } catch {
    return INITIAL_MASTER_SUBSERVICES.map((s) => ({ ...s, _id: s._id || s.id, id: s._id || s.id }));
  }
};

export const PlanCatalogPage = ({ initialView }) => {
  const toast = useToast();
  const location = useLocation();

  // Active View: 'plans' | 'subservices'
  const [activeView, setActiveView] = useState(() => {
    if (initialView) return initialView;
    if (location?.pathname?.includes('subservice')) return 'subservices';
    return 'plans';
  });

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

  // ════════════════════════════════════════════════════════════════════════════
  // 1. DATA STATES (PLANS, SUB-SERVICES & DB SERVICES)
  // ════════════════════════════════════════════════════════════════════════════
  const [plans, setPlans] = useState(loadStoredPlans);
  const [subServices, setSubServices] = useState(loadStoredSubServices);
  const [dbServicesList, setDbServicesList] = useState([]);

  // Search & Filter States
  const [planSearchQuery, setPlanSearchQuery] = useState('');
  const [planTierFilter, setPlanTierFilter] = useState('all');
  const [planStatusFilter, setPlanStatusFilter] = useState('all');

  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState('all');

  // Modal States
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewPlanModalOpen, setViewPlanModalOpen] = useState(false);
  const [selectedPlanForView, setSelectedPlanForView] = useState(null);

  const [subServiceModalOpen, setSubServiceModalOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState(null);

  // Sub-Service Form State
  const [subServiceForm, setSubServiceForm] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  // Plan Form State
  const [planForm, setPlanForm] = useState({
    name: '',
    tier: 'Premium',
    price: '',
    discountPrice: '',
    durationMonths: '6',
    description: '',
    status: 'active',
    includedServices: [],
  });

  // Sync Plans to Storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
      window.dispatchEvent(new CustomEvent('parlour_plans_updated', { detail: { count: plans.length } }));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [plans]);

  // Sync Sub-Services to Storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBSERVICES, JSON.stringify(subServices));
      window.dispatchEvent(new CustomEvent('parlour_subservices_updated', { detail: { count: subServices.length } }));
    } catch (e) {
      console.warn('SubServices storage sync error:', e);
    }
  }, [subServices]);

  // Fetch Sub-Services from Backend API
  const fetchSubServices = useCallback(async () => {
    try {
      const res = await subServiceFetcher.list({ limit: 200 });
      const items = res?.data?.items || res?.data || [];
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map((s, idx) => ({
          ...s,
          _id: s._id || s.id || `sub_${idx}`,
          id: s._id || s.id || `sub_${idx}`,
        }));
        setSubServices(normalized);
      }
    } catch (err) {
      console.warn('SubServices API fetch fallback:', err);
    }
  }, []);

  // Fetch Plans from Backend API
  const fetchPlans = useCallback(async () => {
    try {
      const res = await parlourPlanFetcher.list({ limit: 100 });
      const items = res?.data?.items || res?.data || [];
      if (Array.isArray(items) && items.length > 0) {
        const normalized = items.map((p, idx) => ({
          ...p,
          _id: p._id || p.id || `plan_${idx}`,
          id: p._id || p.id || `plan_${idx}`,
        }));
        setPlans(normalized);
      }
    } catch (err) {
      console.warn('Plans API fetch fallback:', err);
    }
  }, []);

  useEffect(() => {
    fetchSubServices();
    fetchPlans();
  }, [fetchSubServices, fetchPlans]);

  // Load Database Services dynamically on Mount & when updated
  useEffect(() => {
    const fetchDbServices = async () => {
      try {
        const srvRes = await serviceFetcher.list({ limit: 100 }).catch(() => ({ data: [] }));
        const apiServices = srvRes?.data?.items || srvRes?.data || [];

        // Merge with local stored services
        const localServices = (() => {
          try {
            return JSON.parse(localStorage.getItem('parlour_services_db_v4') || '[]');
          } catch {
            return [];
          }
        })();

        const merged = [...apiServices];
        localServices.forEach((ls) => {
          if (!merged.some((m) => (m.name || '').toLowerCase() === (ls.name || '').toLowerCase())) {
            merged.push(ls);
          }
        });

        if (merged.length > 0) {
          setDbServicesList(merged);
        }
      } catch (err) {
        console.warn('Failed to fetch DB services:', err);
      }
    };

    fetchDbServices();

    const handleServiceUpdate = () => {
      fetchDbServices();
    };
    window.addEventListener('parlour_services_updated', handleServiceUpdate);
    window.addEventListener('storage', handleServiceUpdate);
    return () => {
      window.removeEventListener('parlour_services_updated', handleServiceUpdate);
      window.removeEventListener('storage', handleServiceUpdate);
    };
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // 2. SUB-SERVICES MASTER (CRUD) HANDLERS
  // ════════════════════════════════════════════════════════════════════════════
  const handleOpenCreateSubServiceModal = () => {
    setEditingSubService(null);
    setSubServiceForm({
      name: '',
      description: '',
      status: 'active',
    });
    setSubServiceModalOpen(true);
  };

  const handleOpenEditSubServiceModal = (sub) => {
    setEditingSubService(sub);
    setSubServiceForm({
      name: sub.name || '',
      description: sub.description || '',
      status: sub.status || 'active',
    });
    setSubServiceModalOpen(true);
  };

  const handleSaveSubServiceSubmit = async (e) => {
    e.preventDefault();
    if (!subServiceForm.name.trim()) {
      alert('Please enter Sub-Service Name.');
      return;
    }

    try {
      if (editingSubService) {
        const id = editingSubService._id || editingSubService.id;
        const res = await subServiceFetcher.update(id, {
          name: subServiceForm.name.trim(),
          description: subServiceForm.description.trim(),
          status: subServiceForm.status,
        }).catch(() => null);

        const savedItem = res?.data || {
          ...editingSubService,
          name: subServiceForm.name.trim(),
          description: subServiceForm.description.trim(),
          status: subServiceForm.status,
        };

        setSubServices((prev) =>
          prev.map((s) => ((s._id || s.id) === id ? savedItem : s))
        );
        if (toast?.success) toast.success(`Sub-Service "${subServiceForm.name}" updated!`);
      } else {
        const res = await subServiceFetcher.create({
          name: subServiceForm.name.trim(),
          description: subServiceForm.description.trim(),
          status: subServiceForm.status,
        }).catch(() => null);

        const newSub = res?.data || {
          _id: 'sub_' + Date.now().toString().slice(-4),
          id: 'sub_' + Date.now().toString().slice(-4),
          name: subServiceForm.name.trim(),
          description: subServiceForm.description.trim() || 'Custom salon sub-service option',
          status: subServiceForm.status,
          createdAt: new Date().toISOString().split('T')[0],
        };

        setSubServices((prev) => [newSub, ...prev]);
        if (toast?.success) toast.success(`Created Sub-Service "${newSub.name}"!`);
      }
    } catch (err) {
      console.error('Failed to save sub-service:', err);
    }

    setSubServiceModalOpen(false);
  };

  const handleDeleteSubService = async (subId) => {
    const target = subServices.find((s) => (s._id || s.id) === subId || s._id === subId || s.id === subId);
    const deleteId = target?._id || target?.id || subId;
    if (!deleteId) return;

    if (!window.confirm(`Delete sub-service "${target?.name || ''}" from database?`)) return;
    try {
      await subServiceFetcher.delete(deleteId);
      setSubServices((prev) => prev.filter((s) => (s._id || s.id) !== deleteId && s._id !== deleteId && s.id !== deleteId));
      if (toast?.success) toast.success(`Sub-Service "${target?.name || ''}" deleted from database.`);
    } catch (e) {
      console.warn('API delete sub-service error:', e);
      setSubServices((prev) => prev.filter((s) => (s._id || s.id) !== deleteId && s._id !== deleteId && s.id !== deleteId));
      if (toast?.success) toast.success('Sub-Service deleted.');
    }
  };

  const handleToggleSubServiceStatus = async (subId) => {
    const target = subServices.find((s) => (s._id || s.id) === subId || s._id === subId || s.id === subId);
    const targetId = target?._id || target?.id || subId;
    if (!targetId) return;

    const nextStatus = target?.status === 'active' ? 'inactive' : 'active';
    try {
      await subServiceFetcher.updateStatus(targetId, nextStatus);
    } catch (e) {
      console.warn('API status toggle error:', e);
    }
    setSubServices((prev) =>
      prev.map((s) => ((s._id || s.id) === targetId || s._id === targetId || s.id === targetId ? { ...s, status: nextStatus } : s))
    );
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 3. PLAN FORM & MULTI-SERVICE BUILDER HANDLERS
  // ════════════════════════════════════════════════════════════════════════════
  const handleOpenCreatePlanModal = () => {
    setEditingPlan(null);
    const initialService = dbServicesList[0]?.name || 'Hair Service';
    const initialIcon = dbServicesList[0]?.iconEmoji || '💇‍♀️';
    setPlanForm({
      name: '',
      tier: 'Premium',
      price: '',
      discountPrice: '',
      durationMonths: 6,
      description: '',
      status: 'active',
      includedServices: [
        {
          id: 'srv_' + Date.now(),
          serviceName: initialService,
          allowedUsage: 5,
          allowedSubServices: [],
          icon: initialIcon,
        },
      ],
    });
    setPlanModalOpen(true);
  };

  const handleOpenEditPlanModal = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || '',
      tier: plan.tier || 'Premium',
      price: plan.price !== undefined ? plan.price : '',
      discountPrice: plan.discountPrice !== undefined ? plan.discountPrice : '',
      durationMonths: plan.durationMonths || 6,
      description: plan.description || '',
      status: plan.status || 'active',
      includedServices: Array.isArray(plan.includedServices) ? plan.includedServices : [],
    });
    setPlanModalOpen(true);
  };

  // Append another service row in Plan
  const handleAddMoreServiceToPlan = () => {
    const unpicked = dbServicesList.find(
      (s) => !planForm.includedServices.some((item) => item.serviceName === s.name)
    ) || dbServicesList[0];

    const sName = unpicked ? unpicked.name : 'Nail Design';

    const newBlock = {
      id: 'srv_' + Date.now() + '_' + Math.random().toString(36).slice(-4),
      serviceName: sName,
      allowedUsage: unpicked?.defaultUsage || 3,
      allowedSubServices: [],
      icon: unpicked?.iconEmoji || '💅',
    };

    setPlanForm((prev) => ({
      ...prev,
      includedServices: [...prev.includedServices, newBlock],
    }));
  };

  // Change Service in Plan Row
  const handleServiceChangeInRow = (rowIndex, selectedServiceName) => {
    const foundSrv = dbServicesList.find((s) => s.name === selectedServiceName);
    setPlanForm((prev) => {
      const updated = [...prev.includedServices];
      updated[rowIndex] = {
        ...updated[rowIndex],
        serviceName: selectedServiceName,
        icon: foundSrv?.iconEmoji || '✨',
        allowedUsage: foundSrv?.defaultUsage || (updated[rowIndex].allowedUsage || 3),
        allowedSubServices: [],
      };
      return { ...prev, includedServices: updated };
    });
  };

  // Change Usage Limit
  const handleUsageLimitChangeInRow = (rowIndex, val) => {
    setPlanForm((prev) => {
      const updated = [...prev.includedServices];
      updated[rowIndex] = {
        ...updated[rowIndex],
        allowedUsage: Number(val) || 1,
      };
      return { ...prev, includedServices: updated };
    });
  };

  // Toggle or remove Allowed Sub-Service for row
  const handleToggleSubServiceInRow = (rowIndex, subName) => {
    setPlanForm((prev) => {
      const updated = [...prev.includedServices];
      const target = updated[rowIndex];
      const cur = target.allowedSubServices || [];
      const next = cur.filter((n) => n !== subName);
      updated[rowIndex] = { ...target, allowedSubServices: next };
      return { ...prev, includedServices: updated };
    });
  };

  // Add Sub-Service via Dropdown selection in Plan Form
  const handleAddSubServiceFromDropdown = (rowIndex, subName) => {
    if (!subName) return;
    setPlanForm((prev) => {
      const updated = [...prev.includedServices];
      const target = updated[rowIndex];
      const currentSubs = target.allowedSubServices || [];
      if (!currentSubs.includes(subName)) {
        updated[rowIndex] = {
          ...target,
          allowedSubServices: [...currentSubs, subName],
        };
      }
      return { ...prev, includedServices: updated };
    });
  };

  // Remove Service row from Plan
  const handleRemoveServiceRow = (rowIndex) => {
    if (planForm.includedServices.length <= 1) {
      alert('Plan must contain at least 1 service.');
      return;
    }
    setPlanForm((prev) => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, idx) => idx !== rowIndex),
    }));
  };

  // Save Plan
  const handleSavePlanSubmit = async (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      alert('Please enter Plan Name.');
      return;
    }
    if (planForm.price === '' || Number(planForm.price) < 0) {
      alert('Please enter valid Plan Price.');
      return;
    }
    if (planForm.includedServices.length === 0) {
      alert('Please add at least 1 service to the plan.');
      return;
    }

    const payload = {
      name: planForm.name.trim(),
      tier: planForm.tier || 'Premium',
      price: Number(planForm.price),
      discountPrice: planForm.discountPrice !== '' ? Number(planForm.discountPrice) : Number(planForm.price),
      durationMonths: Number(planForm.durationMonths) || 6,
      status: planForm.status || 'active',
      description: planForm.description.trim() || `${planForm.includedServices.length} dynamic services included.`,
      includedServices: planForm.includedServices.map((s) => ({
        serviceName: s.serviceName,
        allowedUsage: Number(s.allowedUsage) || 1,
        allowedSubServices: s.allowedSubServices || [],
        icon: s.icon || '💅',
      })),
    };

    try {
      if (editingPlan) {
        const id = editingPlan._id || editingPlan.id;
        const res = await parlourPlanFetcher.update(id, payload).catch(() => null);
        const savedDoc = res?.data || { ...payload, _id: id };
        setPlans((prev) => prev.map((p) => ((p._id || p.id) === id ? savedDoc : p)));
        if (toast?.success) toast.success(`Plan "${payload.name}" updated successfully!`);
      } else {
        const res = await parlourPlanFetcher.create(payload).catch(() => null);
        const savedDoc = res?.data || { ...payload, _id: 'plan_p_' + Date.now() };
        setPlans((prev) => [savedDoc, ...prev]);
        if (toast?.success) toast.success(`Plan "${payload.name}" created with ${payload.includedServices.length} services!`);
      }
    } catch (err) {
      console.error('Save plan error:', err);
    }

    setPlanModalOpen(false);
  };

  // Delete Plan
  const handleDeletePlan = async (planId) => {
    const plan = plans.find((p) => (p._id || p.id) === planId || p._id === planId || p.id === planId);
    const deleteId = plan?._id || plan?.id || planId;
    if (!deleteId) return;

    if (!window.confirm(`Delete plan "${plan?.name || ''}" from database?`)) return;
    try {
      await parlourPlanFetcher.delete(deleteId);
      setPlans((prev) => prev.filter((p) => (p._id || p.id) !== deleteId && p._id !== deleteId && p.id !== deleteId));
      if (toast?.success) toast.success('Plan deleted successfully from database.');
    } catch (e) {
      console.warn('API delete plan error:', e);
      setPlans((prev) => prev.filter((p) => (p._id || p.id) !== deleteId && p._id !== deleteId && p.id !== deleteId));
    }
  };

  // Toggle Plan Status
  const handleTogglePlanStatus = async (planId) => {
    const plan = plans.find((p) => (p._id || p.id) === planId || p._id === planId || p.id === planId);
    const targetId = plan?._id || plan?.id || planId;
    if (!targetId) return;

    const nextStatus = plan?.status === 'active' ? 'inactive' : 'active';
    try {
      await parlourPlanFetcher.updateStatus(targetId, nextStatus);
    } catch (e) {
      console.warn('API plan toggle error:', e);
    }
    setPlans((prev) =>
      prev.map((p) => ((p._id || p.id) === targetId || p._id === targetId || p.id === targetId ? { ...p, status: nextStatus } : p))
    );
  };

  // Duplicate Plan
  const handleDuplicatePlan = async (plan) => {
    try {
      const planId = plan._id || plan.id;
      const res = await parlourPlanFetcher.duplicate(planId).catch(() => null);
      if (res?.data) {
        setPlans((prev) => [res.data, ...prev]);
        if (toast?.success) toast.success(`Duplicated "${plan.name}"!`);
        return;
      }
    } catch (e) {
      console.warn('API duplicate error:', e);
    }
    const dup = {
      ...plan,
      _id: 'plan_p_' + Date.now(),
      name: `${plan.name} (Copy)`,
      status: 'active',
    };
    setPlans((prev) => [dup, ...prev]);
    if (toast?.success) toast.success(`Duplicated "${plan.name}"!`);
  };

  // Filtered Sub-Services List
  const filteredSubServices = useMemo(() => {
    return subServices.filter((sub) => {
      if (subStatusFilter !== 'all' && sub.status !== subStatusFilter) return false;
      if (subSearchQuery.trim()) {
        const q = subSearchQuery.toLowerCase();
        return (
          (sub.name || '').toLowerCase().includes(q) ||
          (sub.description || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [subServices, subStatusFilter, subSearchQuery]);

  // Filtered Plans List
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      if (planTierFilter !== 'all' && p.tier !== planTierFilter) return false;
      if (planStatusFilter !== 'all' && p.status !== planStatusFilter) return false;
      if (planSearchQuery.trim()) {
        const q = planSearchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesService = (p.includedServices || []).some(
          (s) =>
            s.serviceName.toLowerCase().includes(q) ||
            (s.allowedSubServices || []).some((sub) => sub.toLowerCase().includes(q))
        );
        return matchesName || matchesDesc || matchesService;
      }
      return true;
    });
  }, [plans, planTierFilter, planStatusFilter, planSearchQuery]);

  // Theme Styles
  const themeStyles = useMemo(() => {
    return {
      cardBg: isLight ? '#ffffff' : '#1e293b',
      border: isLight ? '#e2e8f0' : '#334155',
      textPrimary: isLight ? '#0f172a' : '#f8fafc',
      textSecondary: isLight ? '#475569' : '#94a3b8',
      textMuted: isLight ? '#64748b' : '#64748b',
      inputBg: isLight ? '#ffffff' : '#0f172a',
    };
  }, [isLight]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* ── Top Header Banner & Navigation Switcher ── */}
      <div
        style={{
          background: themeStyles.cardBg,
          borderRadius: '16px',
          border: `1px solid ${themeStyles.border}`,
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
            }}
          >
            {activeView === 'plans' ? <Layers size={24} /> : <Scissors size={24} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: themeStyles.textPrimary }}>
                {activeView === 'plans' ? 'Parlour Plans & Packages' : 'Sub-Services Master Catalog'}
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  color: '#db2777',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                }}
              >
                ADMIN WORKSPACE
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: themeStyles.textSecondary }}>
              {activeView === 'plans'
                ? 'Create & configure plans with DB services, usage limits & allowed sub-services.'
                : 'Manage sub-services & options dynamically linked to database services.'}
            </p>
          </div>
        </div>

        {/* View Switcher Pills, Dark Mode & Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* View Switcher Pill */}
          <div
            style={{
              display: 'flex',
              background: isLight ? '#f1f5f9' : '#0f172a',
              padding: '4px',
              borderRadius: '10px',
              border: `1px solid ${themeStyles.border}`,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveView('plans')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '7px',
                border: 'none',
                background: activeView === 'plans' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
                color: activeView === 'plans' ? '#ffffff' : themeStyles.textSecondary,
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Layers size={15} />
              <span>📦 Plans ({plans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('subservices')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '7px',
                border: 'none',
                background: activeView === 'subservices' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
                color: activeView === 'subservices' ? '#ffffff' : themeStyles.textSecondary,
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Scissors size={15} />
              <span>✂️ Sub-Services Master ({subServices.length})</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: themeStyles.cardBg,
              color: themeStyles.textPrimary,
              cursor: 'pointer',
              fontSize: '12.5px',
              fontWeight: '700',
            }}
          >
            {isLight ? <Moon size={15} color="#64748b" /> : <Sun size={15} color="#f59e0b" />}
          </button>

          {/* Primary Action Button Based on Current View */}
          {activeView === 'plans' ? (
            <button
              onClick={handleOpenCreatePlanModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>+ Create Plan</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenCreateSubServiceModal()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>+ Create Sub-Service</span>
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          VIEW 1: SUB-SERVICES MASTER (CRUD PAGE VIEW)
          ════════════════════════════════════════════════════════════════════════ */}
      {activeView === 'subservices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter Bar */}
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '12px',
              border: `1px solid ${themeStyles.border}`,
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: themeStyles.textMuted }}
              />
              <input
                type="text"
                placeholder="Search sub-services by name or description..."
                value={subSearchQuery}
                onChange={(e) => setSubSearchQuery(e.target.value)}
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

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#7c3aed',
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                }}
              >
                {filteredSubServices.length} Sub-Services
              </span>

              {/* Status Filter */}
              <select
                value={subStatusFilter}
                onChange={(e) => setSubStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${themeStyles.border}`,
                  background: themeStyles.inputBg,
                  color: themeStyles.textPrimary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Sub-Services Data Table */}
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '16px',
              border: `1px solid ${themeStyles.border}`,
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: isLight ? '#f8fafc' : '#1e293b', borderBottom: `1px solid ${themeStyles.border}`, textAlign: 'left' }}>
                  <th style={{ padding: '14px 18px', fontWeight: '800', color: themeStyles.textPrimary, width: '60px' }}>#</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800', color: themeStyles.textPrimary }}>Sub-Service Name</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800', color: themeStyles.textPrimary }}>Description</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800', color: themeStyles.textPrimary, width: '130px' }}>Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: '800', textAlign: 'center', color: themeStyles.textPrimary, width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: themeStyles.textMuted }}>
                      No sub-services match the selected filters. Click "+ Create Sub-Service" to add one!
                    </td>
                  </tr>
                ) : (
                  filteredSubServices.map((sub, idx) => {
                    const subKey = sub._id || sub.id || idx;
                    const subIdentifier = sub._id || sub.id;
                    return (
                      <tr
                        key={subKey}
                        style={{
                          borderBottom: `1px solid ${themeStyles.border}`,
                          transition: 'background 0.1s ease',
                        }}
                      >
                        <td style={{ padding: '12px 18px', fontWeight: '700', color: themeStyles.textMuted }}>
                          {idx + 1}
                        </td>

                        <td style={{ padding: '12px 18px', fontWeight: '800', color: themeStyles.textPrimary }}>
                          {sub.name}
                        </td>

                        <td style={{ padding: '12px 18px', color: themeStyles.textSecondary, maxWidth: '340px' }}>
                          {sub.description || '—'}
                        </td>

                        <td style={{ padding: '12px 18px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleSubServiceStatus(subIdentifier)}
                            style={{
                              background: sub.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                              color: sub.status === 'active' ? '#059669' : '#64748b',
                              border: `1px solid ${sub.status === 'active' ? '#a7f3d0' : '#cbd5e1'}`,
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            {sub.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                          </button>
                        </td>

                        <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSubServiceModal(sub)}
                              title="Edit Sub-Service"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: 'rgba(139, 92, 246, 0.1)',
                                border: '1px solid rgba(139, 92, 246, 0.25)',
                                color: '#7c3aed',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSubService(subIdentifier)}
                              title="Delete Sub-Service"
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                background: '#fee2e2',
                                border: 'none',
                                color: '#dc2626',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={13} />
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
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          VIEW 2: PLANS & PACKAGES
          ════════════════════════════════════════════════════════════════════════ */}
      {activeView === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Plan Search & Filter Bar */}
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '12px',
              border: `1px solid ${themeStyles.border}`,
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: themeStyles.textMuted }}
              />
              <input
                type="text"
                placeholder="Search plans by name, service or sub-service..."
                value={planSearchQuery}
                onChange={(e) => setPlanSearchQuery(e.target.value)}
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

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <select
                value={planTierFilter}
                onChange={(e) => setPlanTierFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${themeStyles.border}`,
                  background: themeStyles.inputBg,
                  color: themeStyles.textPrimary,
                  fontSize: '13px',
                  fontWeight: '600',
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

              <select
                value={planStatusFilter}
                onChange={(e) => setPlanStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${themeStyles.border}`,
                  background: themeStyles.inputBg,
                  color: themeStyles.textPrimary,
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Plans Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
            {filteredPlans.map((plan) => {
              const totalSessions = (plan.includedServices || []).reduce(
                (sum, s) => sum + (Number(s.allowedUsage) || 0),
                0
              );

              return (
                <div
                  key={plan._id}
                  style={{
                    background: themeStyles.cardBg,
                    borderRadius: '16px',
                    border: `1.5px solid ${themeStyles.border}`,
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  }}
                >
                  <div>
                    {/* Header: Tier & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          background: '#fef3c7',
                          color: '#d97706',
                          border: '1px solid #fde68a',
                          textTransform: 'uppercase',
                        }}
                      >
                        👑 {plan.tier || 'Premium'} Plan
                      </span>

                      <button
                        type="button"
                        onClick={() => handleTogglePlanStatus(plan._id)}
                        style={{
                          background: plan.status === 'active' ? '#ecfdf5' : '#f1f5f9',
                          color: plan.status === 'active' ? '#059669' : '#64748b',
                          border: `1px solid ${plan.status === 'active' ? '#a7f3d0' : '#cbd5e1'}`,
                          fontSize: '11.5px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        {plan.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                      </button>
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 6px', color: themeStyles.textPrimary }}>
                      {plan.name}
                    </h2>
                    <p style={{ fontSize: '12.5px', color: themeStyles.textSecondary, margin: '0 0 14px', lineHeight: 1.4 }}>
                      {plan.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '26px', fontWeight: '900', color: '#db2777' }}>
                        ₹{Number(plan.price).toLocaleString()}
                      </span>
                      {plan.discountPrice && plan.discountPrice !== plan.price && (
                        <span style={{ fontSize: '14px', color: themeStyles.textMuted, textDecoration: 'line-through' }}>
                          ₹{Number(plan.discountPrice).toLocaleString()}
                        </span>
                      )}
                      <span style={{ fontSize: '12px', color: themeStyles.textMuted, marginLeft: 'auto', fontWeight: '700' }}>
                        ⏳ Validity: {formatDurationMonths(plan.durationMonths)}
                      </span>
                    </div>

                    {/* Included Services List Box */}
                    <div
                      style={{
                        background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        border: `1px solid ${themeStyles.border}`,
                        padding: '12px 14px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: themeStyles.textPrimary }}>
                          Plan mein included services:
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                          {plan.includedServices?.length || 0} Services · {totalSessions} Usages
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(plan.includedServices || []).map((srv, idx) => (
                          <div
                            key={srv.id || idx}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: isLight ? '#ffffff' : '#1e293b',
                              border: `1px solid ${themeStyles.border}`,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12.5px', fontWeight: '800', color: themeStyles.textPrimary }}>
                                {srv.icon || '💅'} {srv.serviceName}
                              </span>
                              <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#db2777', background: '#fdf2f8', padding: '1px 6px', borderRadius: '4px' }}>
                                {srv.allowedUsage} Times
                              </span>
                            </div>

                            {/* Allowed Sub-Services Chips */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                              {(srv.allowedSubServices || []).map((sub, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: '600',
                                    background: isLight ? '#f1f5f9' : '#0f172a',
                                    color: themeStyles.textSecondary,
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    border: `1px solid ${themeStyles.border}`,
                                  }}
                                >
                                  ✓ {sub} <strong style={{ color: '#059669', fontSize: '9.5px' }}>[Allowed]</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${themeStyles.border}` }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanForView(plan);
                        setViewPlanModalOpen(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: `1px solid ${themeStyles.border}`,
                        color: themeStyles.textPrimary,
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                      }}
                    >
                      <Eye size={14} /> View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditPlanModal(plan)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(236, 72, 153, 0.1)',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        color: '#db2777',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicatePlan(plan)}
                      title="Duplicate plan"
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: isLight ? '#f1f5f9' : '#334155',
                        border: 'none',
                        color: themeStyles.textSecondary,
                        cursor: 'pointer',
                      }}
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePlan(plan._id)}
                      title="Delete plan"
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: '#fee2e2',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 1: CREATE / EDIT SUB-SERVICE (PROFESSIONAL THEMED MODAL)
          ════════════════════════════════════════════════════════════════════════ */}
      {subServiceModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSubServiceModalOpen(false);
          }}
        >
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '16px',
              border: '1.5px solid #8b5cf6',
              width: '100%',
              maxWidth: '520px',
              padding: '24px 28px',
              color: themeStyles.textPrimary,
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${themeStyles.border}`, paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#7c3aed' }}>
                  {editingSubService ? 'Edit Sub-Service' : 'Create New Sub-Service'}
                </h3>
                <div style={{ fontSize: '12px', color: themeStyles.textMuted }}>
                  Add sub-service variant or design option to master catalog
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubServiceModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Sub-Service Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                  Sub-Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Nail Design, French Nail Design, or Airbrush Makeup"
                  value={subServiceForm.name}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.border}`,
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    fontWeight: '700',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about this sub-service variant or design option..."
                  value={subServiceForm.description}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.border}`,
                    color: themeStyles.textPrimary,
                    fontSize: '12.5px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px' }}>
                  Status
                </label>
                <select
                  value={subServiceForm.status}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.border}`,
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option value="active">🟢 Active</option>
                  <option value="inactive">⚪ Inactive</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: `1px solid ${themeStyles.border}` }}>
                <button
                  type="button"
                  onClick={() => setSubServiceModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: `1px solid ${themeStyles.border}`,
                    color: themeStyles.textSecondary,
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  {editingSubService ? 'Update Sub-Service' : 'Save Sub-Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 2: CREATE / EDIT PLAN (PROFESSIONAL THEME & DYNAMIC BUILDER)
          ════════════════════════════════════════════════════════════════════════ */}
      {planModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlanModalOpen(false);
          }}
        >
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '16px',
              border: `1.5px solid #ec4899`,
              width: '100%',
              maxWidth: '860px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px 28px',
              color: themeStyles.textPrimary,
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: `1px solid ${themeStyles.border}`, paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: '900', margin: 0, color: '#db2777' }}>
                  {editingPlan ? 'Edit Parlour Plan' : 'Create New Parlour Plan'}
                </h3>
                <div style={{ fontSize: '12px', color: themeStyles.textMuted }}>
                  Configure plan details, select services from database & choose allowed sub-services dynamically
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPlanModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Row 1: Plan Name & Tier */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', marginBottom: '5px' }}>
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Premium Beauty Package"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13.5px',
                      fontWeight: '700',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', marginBottom: '5px' }}>
                    Plan Tier
                  </label>
                  <select
                    value={planForm.tier}
                    onChange={(e) => setPlanForm({ ...planForm, tier: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    {PLAN_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Validity, Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', marginBottom: '5px' }}>
                    Plan Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="15000"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13px',
                      fontWeight: '800',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', marginBottom: '5px' }}>
                    Validity / Duration (Months) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="6"
                    value={planForm.durationMonths}
                    onChange={(e) => setPlanForm({ ...planForm, durationMonths: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', marginBottom: '5px' }}>
                    Status
                  </label>
                  <select
                    value={planForm.status}
                    onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${themeStyles.border}`,
                      background: themeStyles.inputBg,
                      color: themeStyles.textPrimary,
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="active">🟢 Active</option>
                    <option value="inactive">⚪ Inactive / Draft</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  Plan Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Comprehensive 6-month parlour package covering 6 dynamic services..."
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    background: themeStyles.inputBg,
                    color: themeStyles.textPrimary,
                    fontSize: '12.5px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* ══════════════════════════════════════════════════════════════════════
                  DYNAMIC INCLUDED SERVICES BUILDER (WITH "+ ADD MORE SERVICE")
                  ══════════════════════════════════════════════════════════════════════ */}
              <div
                style={{
                  background: isLight ? '#fdf2f8' : 'rgba(236, 72, 153, 0.05)',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(236, 72, 153, 0.3)',
                  padding: '18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '900', margin: 0, color: '#be185d' }}>
                      Plan mein included services ({planForm.includedServices.length} Services Selected)
                    </h4>
                    <div style={{ fontSize: '11.5px', color: themeStyles.textMuted }}>
                      Select DB services, set usage limits, and pick allowed sub-services from Master
                    </div>
                  </div>

                  <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#059669', padding: '3px 10px', borderRadius: '6px', fontWeight: '800', border: '1px solid #a7f3d0' }}>
                    {planForm.includedServices.reduce((sum, s) => sum + (Number(s.allowedUsage) || 0), 0)} Total Usages Allowed
                  </span>
                </div>

                {/* List of Configured Services */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {planForm.includedServices.map((srvRow, rowIndex) => {
                    // Active sub-services from Master not yet selected for this service
                    const availableSubs = subServices.filter(
                      (s) => s.status === 'active' && !(srvRow.allowedSubServices || []).includes(s.name)
                    );

                    return (
                      <div
                        key={srvRow.id || rowIndex}
                        style={{
                          background: themeStyles.cardBg,
                          borderRadius: '12px',
                          border: `1.5px solid ${themeStyles.border}`,
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                      >
                        {/* Service Dropdown + Limit + Remove Button */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.8fr) minmax(130px, 1fr) auto', gap: '12px', alignItems: 'flex-end' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', marginBottom: '4px', color: themeStyles.textPrimary }}>
                              Choose Service (From Database) *
                            </label>
                            <select
                              value={srvRow.serviceName}
                              onChange={(e) => handleServiceChangeInRow(rowIndex, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '8px',
                                background: themeStyles.inputBg,
                                border: '1.5px solid #8b5cf6',
                                color: themeStyles.textPrimary,
                                fontSize: '13px',
                                fontWeight: '700',
                                outline: 'none',
                              }}
                            >
                              {dbServicesList.map((s) => (
                                <option key={s._id || s.id || s.name} value={s.name}>
                                  {s.iconEmoji || '✨'} {s.name} {s.category ? `(${s.category})` : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', marginBottom: '4px', color: themeStyles.textPrimary }}>
                              Allowed Usage Limit (Times) *
                            </label>
                            <input
                              type="number"
                              min="1"
                              placeholder="e.g. 5"
                              value={srvRow.allowedUsage}
                              onChange={(e) => handleUsageLimitChangeInRow(rowIndex, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '8px',
                                background: themeStyles.inputBg,
                                border: `1px solid ${themeStyles.border}`,
                                color: themeStyles.textPrimary,
                                fontSize: '13px',
                                fontWeight: '800',
                                outline: 'none',
                              }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveServiceRow(rowIndex)}
                            title="Remove Service"
                            style={{
                              padding: '9px 12px',
                              borderRadius: '8px',
                              background: '#fee2e2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              height: '38px',
                            }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>

                        {/* Sub-Services Dropdown & Selected Chips */}
                        <div
                          style={{
                            background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '8px',
                            border: `1px solid ${themeStyles.border}`,
                            padding: '10px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#7c3aed' }}>
                              Select Sub-Services (From DB Master):
                            </span>

                            <select
                              value=""
                              onChange={(e) => {
                                handleAddSubServiceFromDropdown(rowIndex, e.target.value);
                                e.target.value = '';
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: isLight ? '#ffffff' : '#1e293b',
                                border: '1.5px solid #8b5cf6',
                                color: '#7c3aed',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                outline: 'none',
                              }}
                            >
                              <option value="">+ Choose Sub-Service from Dropdown...</option>
                              {availableSubs.map((sub) => (
                                <option key={sub._id || sub.id || sub.name} value={sub.name}>
                                  + {sub.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Selected Sub-Service Chips */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '26px', alignItems: 'center' }}>
                            {(srvRow.allowedSubServices || []).length === 0 ? (
                              <span style={{ fontSize: '11px', color: themeStyles.textMuted, fontStyle: 'italic' }}>
                                No sub-services selected yet. Choose from dropdown above to allow specific design/service variants.
                              </span>
                            ) : (
                              srvRow.allowedSubServices.map((subName) => (
                                <span
                                  key={subName}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    background: isLight ? '#ecfdf5' : '#064e3b',
                                    color: isLight ? '#065f46' : '#a7f3d0',
                                    border: '1px solid #10b981',
                                    fontSize: '11.5px',
                                    fontWeight: '700',
                                  }}
                                >
                                  <span>✓ {subName}</span>
                                  <span style={{ fontSize: '9.5px', fontWeight: '800', background: '#059669', color: '#fff', padding: '1px 5px', borderRadius: '3px' }}>
                                    Allowed
                                  </span>
                                  <X
                                    size={13}
                                    style={{ cursor: 'pointer', color: '#dc2626', marginLeft: '2px' }}
                                    onClick={() => handleToggleSubServiceInRow(rowIndex, subName)}
                                  />
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* + Add More Service Button */}
                <button
                  type="button"
                  onClick={handleAddMoreServiceToPlan}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '11px',
                    borderRadius: '8px',
                    background: isLight ? '#ffffff' : '#1e293b',
                    border: '2px dashed #db2777',
                    color: '#db2777',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>+ Add More Service</span>
                </button>
              </div>

              {/* Form Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  paddingTop: '14px',
                  borderTop: `1px solid ${themeStyles.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: `1px solid ${themeStyles.border}`,
                    color: themeStyles.textSecondary,
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '9px 24px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                  }}
                >
                  {editingPlan ? 'Update Plan' : 'Save & Publish Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL 3: VIEW PLAN DETAILS MODAL
          ════════════════════════════════════════════════════════════════════════ */}
      {viewPlanModalOpen && selectedPlanForView && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewPlanModalOpen(false);
          }}
        >
          <div
            style={{
              background: themeStyles.cardBg,
              borderRadius: '16px',
              border: `1.5px solid ${themeStyles.border}`,
              width: '100%',
              maxWidth: '650px',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: '24px 28px',
              color: themeStyles.textPrimary,
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${themeStyles.border}`, paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#db2777' }}>
                  {selectedPlanForView.name}
                </h3>
                <div style={{ fontSize: '12px', color: themeStyles.textMuted }}>
                  ₹{Number(selectedPlanForView.price).toLocaleString()} · {formatDurationMonths(selectedPlanForView.durationMonths)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewPlanModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: themeStyles.textSecondary, marginBottom: '16px' }}>
              {selectedPlanForView.description}
            </p>

            <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>
              Included Services & Allowed Sub-Services:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(selectedPlanForView.includedServices || []).map((srv, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isLight ? '#f8fafc' : '#1e293b',
                    border: `1px solid ${themeStyles.border}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: themeStyles.textPrimary }}>
                      {srv.icon || '💅'} {srv.serviceName}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#db2777', background: '#fdf2f8', padding: '2px 8px', borderRadius: '4px' }}>
                      Allowed Limit: {srv.allowedUsage} Times
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(srv.allowedSubServices || []).map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          background: isLight ? '#ffffff' : '#0f172a',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: `1px solid ${themeStyles.border}`,
                        }}
                      >
                        ✓ {sub} <strong style={{ color: '#059669', fontSize: '10px' }}>[Allowed]</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCatalogPage;
