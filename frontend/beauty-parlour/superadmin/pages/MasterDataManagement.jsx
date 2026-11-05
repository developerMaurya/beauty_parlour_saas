/**
 * @file MasterDataManagement.jsx
 * @description Central Super Admin Master Data Registry with Category-Specific Forms and Views
 * Configures:
 * 1. Industry Verticals (Salon, Spa, Makeup, Academy)
 * 2. Master Service Catalogues & Default Packages
 * 3. Executive Roles & Organizational Titles
 * 4. SaaS Subscription Plans (Pricing, Quotas, Features)
 * 5. Feature Flags Catalog
 * 6. Tax Slabs (GST, VAT, State Taxes)
 * 7. Currencies (INR, USD, EUR, AED)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  mastersApi,
  plansApi,
  featuresApi,
  verticalsApi,
} from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Sparkles,
  Scissors,
  Users,
  Percent,
  Coins,
  CheckCircle2,
  Sliders,
  Check,
  Search,
  CreditCard,
  Building2,
  Clock,
  Shield,
  Tag,
  DollarSign,
  Activity,
} from 'lucide-react';

const MASTER_CATEGORIES = [
  { id: 'VERTICAL', label: 'Industry Verticals', icon: Scissors, btnLabel: 'New Industry Vertical', desc: 'Salon, Spa, Makeup, Academy types' },
  { id: 'SERVICE_CATEGORY', label: 'Service Catalogues', icon: Sparkles, btnLabel: 'New Service Catalogue', desc: 'Hair, Skin, Bridal, Massage' },
  { id: 'EXECUTIVE_ROLE', label: 'Executive Roles', icon: Users, btnLabel: 'New Executive Role', desc: 'Regional VP, Master Director, Auditor' },
  { id: 'PLAN', label: 'SaaS Plans', icon: CreditCard, btnLabel: 'Create SaaS Plan', desc: 'Subscription pricing, quotas & limits' },
  { id: 'PLAN_FEATURE', label: 'Feature Catalog', icon: Sliders, btnLabel: 'New Plan Feature', desc: 'Platform module toggles' },
  { id: 'TAX_SLAB', label: 'Tax Slabs', icon: Percent, btnLabel: 'New Tax Slab', desc: 'GST 18%, VAT 5%, State taxes' },
  { id: 'CURRENCY', label: 'Currencies', icon: Coins, btnLabel: 'New Currency', desc: 'INR (₹), USD ($), EUR, AED' },
  { id: 'ALL', label: 'All Masters Registry', icon: Layers, btnLabel: 'New Master Record', desc: 'Complete platform registry' },
];

export const MasterDataManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get('category') || 'VERTICAL';

  const [activeCategory, setActiveCategory] = useState(activeCategoryParam);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Dedicated Form State depending on Category
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    id: null,
    category: 'VERTICAL',

    // Generic
    name: '',
    code: '',
    description: '',
    status: 'ACTIVE',
    isDefault: false,

    // Vertical specific
    bookingMode: 'APPOINTMENT_SLOT',
    defaultTheme: 'rose_gold_glamour',
    intakeFormRequired: false,

    // Service specific
    targetVertical: 'SALON',
    durationMinutes: 60,
    basePrice: 1500,
    genderSuitability: 'UNISEX',

    // Role specific
    department: 'Regional Multi-Branch Governance',
    accessLevel: 'Full Executive Authority',

    // Tax specific
    taxRate: 18,
    country: 'India',

    // Currency specific
    currencySymbol: '₹',
    exchangeRate: 1.0,

    // Plan specific
    planSlug: '',
    priceMonthly: 1999,
    priceYearly: 19990,
    trialDays: 14,
    currency: 'INR',
    isPopular: false,
    limits: {
      maxStaff: 10,
      maxBranches: 2,
      maxAppointmentsMonthly: 1000,
      storageMb: 2048,
      customDomainAllowed: false,
      whiteLabelAllowed: false,
    },
    planFeatures: ['appointments', 'customer_management', 'billing_pos'],

    // Feature specific
    featureKey: '',
    featureCategory: 'Operations',
  });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error, warning } = useToast();

  const currentCategoryMeta = MASTER_CATEGORIES.find((c) => c.id === activeCategory) || MASTER_CATEGORIES[0];

  // Fetch data according to category
  const fetchMasters = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeCategory === 'PLAN') {
        const res = await plansApi.list({
          search,
          status: statusFilter !== 'ALL' ? statusFilter.toLowerCase() : undefined,
          page: pagination.page,
          limit: pagination.limit,
        });
        const records = res.data?.items || res.data?.plans || (Array.isArray(res.data) ? res.data : []);
        setItems(records);
        setPagination((p) => ({ ...p, total: res.data?.pagination?.total || records.length }));
      } else if (activeCategory === 'PLAN_FEATURE') {
        const res = await featuresApi.list({
          search,
          page: pagination.page,
          limit: pagination.limit,
        });
        const records = res.data?.items || res.data?.features || (Array.isArray(res.data) ? res.data : []);
        setItems(records);
        setPagination((p) => ({ ...p, total: res.data?.pagination?.total || records.length }));
      } else {
        const res = await mastersApi.list({
          category: activeCategory !== 'ALL' ? activeCategory : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          search,
          page: pagination.page,
          limit: pagination.limit,
        });
        const records = res.data?.items || res.data?.masters || (Array.isArray(res.data) ? res.data : []);
        setItems(records);
        setPagination((p) => ({ ...p, total: res.data?.pagination?.total || records.length }));
      }
    } catch (err) {
      error(err.message || 'Failed to load master entries');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, statusFilter, search, pagination.page, pagination.limit, error]);

  useEffect(() => {
    fetchMasters();
  }, [fetchMasters]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setPagination((p) => ({ ...p, page: 1 }));
    setSearchParams({ category: catId });
  };

  // Seed Defaults
  const handleSeedDefaults = async () => {
    setActionLoading(true);
    try {
      const res = await mastersApi.seedDefaults();
      success(res.message || 'Industry master default entries seeded successfully!');
      fetchMasters();
    } catch (err) {
      error(err.message || 'Failed to seed master defaults');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Context-Aware Create Modal
  const handleOpenCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      id: null,
      category: activeCategory !== 'ALL' ? activeCategory : 'VERTICAL',

      name: '',
      code: '',
      description: '',
      status: 'ACTIVE',
      isDefault: false,

      bookingMode: 'APPOINTMENT_SLOT',
      defaultTheme: 'rose_gold_glamour',
      intakeFormRequired: false,

      targetVertical: 'SALON',
      durationMinutes: 60,
      basePrice: 1500,
      genderSuitability: 'UNISEX',

      department: 'Regional Multi-Branch Governance',
      accessLevel: 'Full Executive Authority',

      taxRate: 18,
      country: 'India',

      currencySymbol: '₹',
      exchangeRate: 1.0,

      planSlug: '',
      priceMonthly: 1999,
      priceYearly: 19990,
      trialDays: 14,
      currency: 'INR',
      isPopular: false,
      limits: {
        maxStaff: 10,
        maxBranches: 2,
        maxAppointmentsMonthly: 1000,
        storageMb: 2048,
        customDomainAllowed: false,
        whiteLabelAllowed: false,
      },
      planFeatures: ['appointments', 'customer_management', 'billing_pos'],

      featureKey: '',
      featureCategory: 'Operations',
    });
  };

  // Open Context-Aware Edit Modal
  const handleOpenEditModal = (row) => {
    const isPlan = activeCategory === 'PLAN' || row.priceMonthly !== undefined;
    const isFeature = activeCategory === 'PLAN_FEATURE' || row.isAddon !== undefined;

    setModalState({
      isOpen: true,
      mode: 'edit',
      id: row._id || row.id,
      category: row.category || activeCategory,

      name: row.name || '',
      code: row.code || row.slug || '',
      description: row.description || '',
      status: (row.status || 'ACTIVE').toUpperCase(),
      isDefault: Boolean(row.isDefault),

      bookingMode: row.metadata?.bookingMode || 'APPOINTMENT_SLOT',
      defaultTheme: row.metadata?.defaultTheme || 'rose_gold_glamour',
      intakeFormRequired: Boolean(row.metadata?.intakeFormRequired),

      targetVertical: row.metadata?.targetVertical || 'SALON',
      durationMinutes: row.metadata?.durationMinutes || 60,
      basePrice: row.metadata?.basePrice || row.value || 1500,
      genderSuitability: row.metadata?.genderSuitability || 'UNISEX',

      department: row.metadata?.department || 'Regional Multi-Branch Governance',
      accessLevel: row.metadata?.accessLevel || 'Full Executive Authority',

      taxRate: row.value || row.metadata?.taxRate || 18,
      country: row.metadata?.country || 'India',

      currencySymbol: row.value || row.metadata?.currencySymbol || '₹',
      exchangeRate: row.metadata?.exchangeRate || 1.0,

      planSlug: row.slug || '',
      priceMonthly: row.priceMonthly || 1999,
      priceYearly: row.priceYearly || 19990,
      trialDays: row.trialDays || 14,
      currency: row.currency || 'INR',
      isPopular: Boolean(row.isPopular),
      limits: row.limits || {
        maxStaff: 10,
        maxBranches: 2,
        maxAppointmentsMonthly: 1000,
        storageMb: 2048,
        customDomainAllowed: false,
        whiteLabelAllowed: false,
      },
      planFeatures: row.features || ['appointments', 'customer_management', 'billing_pos'],

      featureKey: row.slug || '',
      featureCategory: row.category || 'Operations',
    });
  };

  // Save Record (Dynamic payload per category)
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!modalState.name.trim()) {
      error('Name is required');
      return;
    }

    setActionLoading(true);
    try {
      const cat = modalState.category;

      if (cat === 'PLAN') {
        const payload = {
          name: modalState.name.trim(),
          slug: modalState.planSlug.trim().toLowerCase() || modalState.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          description: modalState.description,
          priceMonthly: Number(modalState.priceMonthly) || 0,
          priceYearly: Number(modalState.priceYearly) || 0,
          currency: modalState.currency,
          trialDays: Number(modalState.trialDays) || 14,
          isPopular: modalState.isPopular,
          status: modalState.status.toLowerCase(),
          limits: modalState.limits,
          features: modalState.planFeatures,
        };

        if (modalState.mode === 'create') {
          await plansApi.create(payload);
          success(`SaaS Plan "${payload.name}" created successfully!`);
        } else {
          await plansApi.update(modalState.id, payload);
          success(`SaaS Plan "${payload.name}" updated successfully!`);
        }
      } else if (cat === 'PLAN_FEATURE') {
        const payload = {
          name: modalState.name.trim(),
          slug: modalState.featureKey.trim().toLowerCase() || modalState.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          category: modalState.featureCategory,
          description: modalState.description,
          status: modalState.status.toLowerCase(),
        };

        if (modalState.mode === 'create') {
          await featuresApi.create(payload);
          success(`Feature "${payload.name}" created successfully!`);
        } else {
          await featuresApi.update(modalState.id, payload);
          success(`Feature "${payload.name}" updated successfully!`);
        }
      } else {
        // Masters categories (VERTICAL, SERVICE_CATEGORY, EXECUTIVE_ROLE, TAX_SLAB, CURRENCY)
        let metadata = {};
        let value = null;

        if (cat === 'VERTICAL') {
          metadata = {
            bookingMode: modalState.bookingMode,
            defaultTheme: modalState.defaultTheme,
            intakeFormRequired: modalState.intakeFormRequired,
          };
        } else if (cat === 'SERVICE_CATEGORY') {
          metadata = {
            targetVertical: modalState.targetVertical,
            durationMinutes: Number(modalState.durationMinutes),
            basePrice: Number(modalState.basePrice),
            genderSuitability: modalState.genderSuitability,
          };
          value = Number(modalState.basePrice);
        } else if (cat === 'EXECUTIVE_ROLE') {
          metadata = {
            department: modalState.department,
            accessLevel: modalState.accessLevel,
          };
        } else if (cat === 'TAX_SLAB') {
          value = Number(modalState.taxRate);
          metadata = { country: modalState.country, taxRate: Number(modalState.taxRate) };
        } else if (cat === 'CURRENCY') {
          value = modalState.currencySymbol;
          metadata = { currencySymbol: modalState.currencySymbol, exchangeRate: Number(modalState.exchangeRate) };
        }

        const payload = {
          category: cat,
          name: modalState.name.trim(),
          code: modalState.code.trim().toUpperCase() || modalState.name.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
          description: modalState.description,
          value,
          isDefault: modalState.isDefault,
          status: modalState.status,
          metadata,
        };

        if (modalState.mode === 'create') {
          await mastersApi.create(payload);
          success(`Master entry "${payload.name}" created successfully!`);
        } else {
          await mastersApi.update(modalState.id, payload);
          success(`Master entry "${payload.name}" updated successfully!`);
        }
      }

      setModalState((p) => ({ ...p, isOpen: false }));
      fetchMasters();
    } catch (err) {
      error(err.message || 'Failed to save record');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Record
  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    setActionLoading(true);
    const id = deleteModal.item._id || deleteModal.item.id;
    try {
      if (activeCategory === 'PLAN') {
        await plansApi.delete(id);
      } else if (activeCategory === 'PLAN_FEATURE') {
        await featuresApi.delete(id);
      } else {
        await mastersApi.delete(id);
      }
      success('Record deleted successfully');
      setDeleteModal({ isOpen: false, item: null });
      fetchMasters();
    } catch (err) {
      error(err.message || 'Failed to delete record');
    } finally {
      setActionLoading(false);
    }
  };

  // Dynamic Columns depending on Category
  const getColumns = () => {
    if (activeCategory === 'PLAN') {
      return [
        {
          header: 'Plan Name',
          accessor: 'name',
          render: (row) => (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>{row.name}</span>
                {row.isPopular && <Badge status="ACTIVE" text="POPULAR" />}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                slug: {row.slug}
              </div>
            </div>
          ),
        },
        {
          header: 'Monthly Price',
          accessor: 'priceMonthly',
          render: (row) => (
            <span style={{ fontWeight: 800, color: '#34D399', fontSize: '0.95rem' }}>
              ₹{Number(row.priceMonthly).toLocaleString()}
            </span>
          ),
        },
        {
          header: 'Annual Price',
          accessor: 'priceYearly',
          render: (row) => (
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              ₹{Number(row.priceYearly).toLocaleString()}
            </span>
          ),
        },
        {
          header: 'Quotas (Staff / Branches)',
          accessor: 'limits',
          render: (row) => (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Staff: <strong>{row.limits?.maxStaff || 5}</strong> • Branches: <strong>{row.limits?.maxBranches || 1}</strong>
            </div>
          ),
        },
        {
          header: 'Trial',
          accessor: 'trialDays',
          render: (row) => <span>{row.trialDays || 14} days</span>,
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (row) => <Badge status={row.status || 'ACTIVE'} />,
        },
        {
          header: 'Actions',
          align: 'right',
          render: (row) => renderActionButtons(row),
        },
      ];
    }

    if (activeCategory === 'VERTICAL') {
      return [
        {
          header: 'Vertical Name & Code',
          accessor: 'name',
          render: (row) => (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Scissors className="w-4 h-4 text-indigo-400" />
                <span>{row.name}</span>
                {row.isDefault && <Badge status="ACTIVE" text="DEFAULT" />}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CODE: {row.code}
              </div>
            </div>
          ),
        },
        {
          header: 'Booking Architecture',
          accessor: 'metadata',
          render: (row) => (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
              {row.metadata?.bookingMode || 'APPOINTMENT_SLOT'}
            </span>
          ),
        },
        {
          header: 'Default Theme Kit',
          accessor: 'defaultTheme',
          render: (row) => (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {(row.metadata?.defaultTheme || 'rose_gold_glamour').replace(/_/g, ' ')}
            </span>
          ),
        },
        {
          header: 'Client Intake Form',
          accessor: 'intakeFormRequired',
          render: (row) => (
            <span style={{ fontSize: '0.78rem', color: row.metadata?.intakeFormRequired ? '#34D399' : 'var(--text-muted)' }}>
              {row.metadata?.intakeFormRequired ? 'Mandatory' : 'Optional'}
            </span>
          ),
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (row) => <Badge status={row.status || 'ACTIVE'} />,
        },
        {
          header: 'Actions',
          align: 'right',
          render: (row) => renderActionButtons(row),
        },
      ];
    }

    if (activeCategory === 'SERVICE_CATEGORY') {
      return [
        {
          header: 'Service Category',
          accessor: 'name',
          render: (row) => (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{row.name}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CODE: {row.code}
              </div>
            </div>
          ),
        },
        {
          header: 'Target Industry Vertical',
          accessor: 'targetVertical',
          render: (row) => (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {row.metadata?.targetVertical || 'SALON'}
            </span>
          ),
        },
        {
          header: 'Base Price',
          accessor: 'basePrice',
          render: (row) => (
            <span style={{ fontWeight: 700, color: '#34D399', fontSize: '0.9rem' }}>
              ₹{Number(row.metadata?.basePrice || row.value || 0).toLocaleString()}
            </span>
          ),
        },
        {
          header: 'Duration',
          accessor: 'durationMinutes',
          render: (row) => <span>{row.metadata?.durationMinutes || 60} mins</span>,
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (row) => <Badge status={row.status || 'ACTIVE'} />,
        },
        {
          header: 'Actions',
          align: 'right',
          render: (row) => renderActionButtons(row),
        },
      ];
    }

    if (activeCategory === 'EXECUTIVE_ROLE') {
      return [
        {
          header: 'Executive Role Title',
          accessor: 'name',
          render: (row) => (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{row.name}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CODE: {row.code}
              </div>
            </div>
          ),
        },
        {
          header: 'Operational Department',
          accessor: 'department',
          render: (row) => (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {row.metadata?.department || 'Regional Multi-Branch Governance'}
            </span>
          ),
        },
        {
          header: 'Authority Level',
          accessor: 'accessLevel',
          render: (row) => (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38BDF8' }}>
              {row.metadata?.accessLevel || 'Full Executive Authority'}
            </span>
          ),
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (row) => <Badge status={row.status || 'ACTIVE'} />,
        },
        {
          header: 'Actions',
          align: 'right',
          render: (row) => renderActionButtons(row),
        },
      ];
    }

    if (activeCategory === 'TAX_SLAB') {
      return [
        {
          header: 'Tax Slab Name',
          accessor: 'name',
          render: (row) => (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{row.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CODE: {row.code}
              </div>
            </div>
          ),
        },
        {
          header: 'Tax Rate (%)',
          accessor: 'value',
          render: (row) => (
            <span style={{ fontWeight: 800, color: '#F59E0B', fontSize: '1rem' }}>
              {row.value || row.metadata?.taxRate || 18}%
            </span>
          ),
        },
        {
          header: 'Jurisdiction',
          accessor: 'country',
          render: (row) => <span>{row.metadata?.country || 'India'}</span>,
        },
        {
          header: 'Default Tax',
          accessor: 'isDefault',
          render: (row) => (row.isDefault ? <Badge status="ACTIVE" text="DEFAULT" /> : <span style={{ color: 'var(--text-muted)' }}>No</span>),
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (row) => <Badge status={row.status || 'ACTIVE'} />,
        },
        {
          header: 'Actions',
          align: 'right',
          render: (row) => renderActionButtons(row),
        },
      ];
    }

    if (activeCategory === 'CURRENCY') {
      return [
        {
          header: 'Currency Name',
          accessor: 'name',
          render: (row) => (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{row.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ISO: {row.code}
              </div>
            </div>
          ),
        },
        {
          header: 'Currency Symbol',
          accessor: 'value',
          render: (row) => (
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>
              {row.value || row.metadata?.currencySymbol || '₹'}
            </span>
          ),
        },
        {
          header: 'Exchange Rate',
          accessor: 'exchangeRate',
          render: (row) => <span>{row.metadata?.exchangeRate || 1.0}</span>,
        },
        {
          header: 'Default Currency',
          accessor: 'isDefault',
          render: (row) => (row.isDefault ? <Badge status="ACTIVE" text="PLATFORM DEFAULT" /> : <span style={{ color: 'var(--text-muted)' }}>No</span>),
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (row) => <Badge status={row.status || 'ACTIVE'} />,
        },
        {
          header: 'Actions',
          align: 'right',
          render: (row) => renderActionButtons(row),
        },
      ];
    }

    // Default Fallback
    return [
      {
        header: 'Entry Name & Code',
        accessor: 'name',
        render: (row) => (
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              CODE: {row.code || row.slug}
            </div>
          </div>
        ),
      },
      {
        header: 'Category',
        accessor: 'category',
        render: (row) => <Badge status="ACTIVE" text={row.category || activeCategory} />,
      },
      {
        header: 'Description',
        accessor: 'description',
        render: (row) => <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.description || '—'}</span>,
      },
      {
        header: 'Status',
        accessor: 'status',
        render: (row) => <Badge status={row.status || 'ACTIVE'} />,
      },
      {
        header: 'Actions',
        align: 'right',
        render: (row) => renderActionButtons(row),
      },
    ];
  };

  const renderActionButtons = (row) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
      <button
        onClick={() => handleOpenEditModal(row)}
        className="btn btn-secondary btn-sm"
        title="Edit Record"
        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Edit</span>
      </button>

      <button
        onClick={() => setDeleteModal({ isOpen: true, item: row })}
        className="btn btn-outline-danger btn-sm"
        title="Delete Record"
        style={{ padding: '0.25rem 0.5rem' }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Central Master Data Management</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Contextual master registries: Industry verticals, service packages, executive roles, SaaS plans, taxes, and currencies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSeedDefaults}
            disabled={actionLoading}
            className="btn btn-secondary"
            title="Pre-populate industry standard salon/spa master entries"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Seed Standard Defaults</span>
          </button>

          {/* Dynamic Button Text per Selected Category */}
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            <span>{currentCategoryMeta.btnLabel}</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="tabs-nav" style={{ margin: 0 }}>
          {MASTER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Master Data Table */}
      <DataTable
        columns={getColumns()}
        data={items}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        searchPlaceholder={`Search ${currentCategoryMeta.label.toLowerCase()}...`}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((prev) => ({ ...prev, page: newPage })),
          onLimitChange: (newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 })),
        }}
        emptyMessage={`No records found in ${currentCategoryMeta.label}. Click "${currentCategoryMeta.btnLabel}" to add one.`}
      />

      {/* ══════════════════════════════════════════════════════════════════
          DYNAMIC CONTEXT-AWARE MODAL FORM PER CATEGORY
          ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((p) => ({ ...p, isOpen: false }))}
        title={
          modalState.mode === 'create'
            ? `${currentCategoryMeta.btnLabel}`
            : `Edit ${currentCategoryMeta.label}: ${modalState.name}`
        }
        size={modalState.category === 'PLAN' ? 'large' : 'medium'}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setModalState((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveModal} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : modalState.mode === 'create' ? 'Create Record' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {/* ───────────────────────────────────────────────────────────
              FORM VARIANT 1: SAAS SUBSCRIPTION PLAN FORM
              ─────────────────────────────────────────────────────────── */}
          {modalState.category === 'PLAN' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Plan Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Enterprise Salon Chain"
                    value={modalState.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalState((p) => ({
                        ...p,
                        name: val,
                        planSlug: p.mode === 'create' && !p.planSlug ? val.toLowerCase().replace(/[^a-z0-9]/g, '_') : p.planSlug,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Plan Slug / Identifier</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. enterprise_chain"
                    value={modalState.planSlug}
                    onChange={(e) => setModalState((p) => ({ ...p, planSlug: e.target.value.toLowerCase() }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Monthly Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    value={modalState.priceMonthly}
                    onChange={(e) => setModalState((p) => ({ ...p, priceMonthly: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Annual Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    value={modalState.priceYearly}
                    onChange={(e) => setModalState((p) => ({ ...p, priceYearly: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Free Trial (Days)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    value={modalState.trialDays}
                    onChange={(e) => setModalState((p) => ({ ...p, trialDays: e.target.value }))}
                  />
                </div>
              </div>

              {/* Resource Quota Limits */}
              <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  Resource Quotas & Hard Limits
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Max Staff</label>
                    <input
                      type="number"
                      className="form-input form-input-sm"
                      value={modalState.limits.maxStaff}
                      onChange={(e) => setModalState((p) => ({ ...p, limits: { ...p.limits, maxStaff: Number(e.target.value) } }))}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Max Branches</label>
                    <input
                      type="number"
                      className="form-input form-input-sm"
                      value={modalState.limits.maxBranches}
                      onChange={(e) => setModalState((p) => ({ ...p, limits: { ...p.limits, maxBranches: Number(e.target.value) } }))}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Monthly Appts</label>
                    <input
                      type="number"
                      className="form-input form-input-sm"
                      value={modalState.limits.maxAppointmentsMonthly}
                      onChange={(e) => setModalState((p) => ({ ...p, limits: { ...p.limits, maxAppointmentsMonthly: Number(e.target.value) } }))}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Storage (MB)</label>
                    <input
                      type="number"
                      className="form-input form-input-sm"
                      value={modalState.limits.storageMb}
                      onChange={(e) => setModalState((p) => ({ ...p, limits: { ...p.limits, storageMb: Number(e.target.value) } }))}
                    />
                  </div>
                </div>
              </div>

              {/* Plan Feature Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={modalState.limits.customDomainAllowed}
                    onChange={(e) => setModalState((p) => ({ ...p, limits: { ...p.limits, customDomainAllowed: e.target.checked } }))}
                  />
                  <span>Allow Custom White-Label Domain</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={modalState.limits.whiteLabelAllowed}
                    onChange={(e) => setModalState((p) => ({ ...p, limits: { ...p.limits, whiteLabelAllowed: e.target.checked } }))}
                  />
                  <span>Allow Full White-Label Re-Branding</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Plan Description</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Target salon size, recommended business model, etc."
                  value={modalState.description}
                  onChange={(e) => setModalState((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </>
          )}

          {/* ───────────────────────────────────────────────────────────
              FORM VARIANT 2: INDUSTRY VERTICAL FORM
              ─────────────────────────────────────────────────────────── */}
          {modalState.category === 'VERTICAL' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vertical Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Nail & Lash Studio"
                    value={modalState.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalState((p) => ({
                        ...p,
                        name: val,
                        code: p.mode === 'create' && !p.code ? val.toUpperCase().replace(/[^A-Z0-9]/g, '_') : p.code,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vertical Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. NAILS"
                    value={modalState.code}
                    onChange={(e) => setModalState((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Booking Mode Architecture</label>
                  <select
                    className="form-select"
                    value={modalState.bookingMode}
                    onChange={(e) => setModalState((p) => ({ ...p, bookingMode: e.target.value }))}
                  >
                    <option value="APPOINTMENT_SLOT">Appointment Slot (Individual Time Slot)</option>
                    <option value="CHAIR_BASED">Chair-Based (Stylist Station Allotment)</option>
                    <option value="ROOM_BASED">Room-Based (Private Spa Cabin / Suite)</option>
                    <option value="COURSE_BATCH">Course Batch (Student Academy Cohort)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Default White-Label Theme</label>
                  <select
                    className="form-select"
                    value={modalState.defaultTheme}
                    onChange={(e) => setModalState((p) => ({ ...p, defaultTheme: e.target.value }))}
                  >
                    <option value="rose_gold_glamour">Rose Gold Glamour (Salon Standard)</option>
                    <option value="emerald_spa_haven">Emerald Spa Haven (Ayurveda & Spa)</option>
                    <option value="midnight_luxe">Midnight Luxe (High-End Unisex Salon)</option>
                    <option value="classic_beauty">Classic Beauty Pastel</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="intakeReq"
                  checked={modalState.intakeFormRequired}
                  onChange={(e) => setModalState((p) => ({ ...p, intakeFormRequired: e.target.checked }))}
                />
                <label htmlFor="intakeReq" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Require Client Medical / Patch-Test Intake Form prior to service
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Scope Description</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Define the primary operational workflow for this vertical..."
                  value={modalState.description}
                  onChange={(e) => setModalState((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </>
          )}

          {/* ───────────────────────────────────────────────────────────
              FORM VARIANT 3: SERVICE CATALOGUE FORM
              ─────────────────────────────────────────────────────────── */}
          {modalState.category === 'SERVICE_CATEGORY' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Service Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Keratin & Hair Botox Therapies"
                    value={modalState.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalState((p) => ({
                        ...p,
                        name: val,
                        code: p.mode === 'create' && !p.code ? val.toUpperCase().replace(/[^A-Z0-9]/g, '_') : p.code,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. KERATIN_BOTOX"
                    value={modalState.code}
                    onChange={(e) => setModalState((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Vertical</label>
                  <select
                    className="form-select"
                    value={modalState.targetVertical}
                    onChange={(e) => setModalState((p) => ({ ...p, targetVertical: e.target.value }))}
                  >
                    <option value="SALON">Beauty Salon & Parlour</option>
                    <option value="SPA">Luxury Spa & Wellness</option>
                    <option value="NAILS">Nail & Lash Studio</option>
                    <option value="BRIDAL">Bridal & Makeup Studio</option>
                    <option value="ACADEMY">Hair & Beauty Academy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Avg Duration (Mins)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="5"
                    step="5"
                    value={modalState.durationMinutes}
                    onChange={(e) => setModalState((p) => ({ ...p, durationMinutes: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Base Suggested Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    value={modalState.basePrice}
                    onChange={(e) => setModalState((p) => ({ ...p, basePrice: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Gender Suitability</label>
                <select
                  className="form-select"
                  value={modalState.genderSuitability}
                  onChange={(e) => setModalState((p) => ({ ...p, genderSuitability: e.target.value }))}
                >
                  <option value="UNISEX">Unisex (Both Women & Men)</option>
                  <option value="FEMALE_ONLY">Women Only</option>
                  <option value="MALE_ONLY">Men Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Inclusions</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Standard treatment steps, pre-service consultation, and benefits..."
                  value={modalState.description}
                  onChange={(e) => setModalState((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </>
          )}

          {/* ───────────────────────────────────────────────────────────
              FORM VARIANT 4: EXECUTIVE ROLE FORM
              ─────────────────────────────────────────────────────────── */}
          {modalState.category === 'EXECUTIVE_ROLE' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Regional Operations Vice President"
                    value={modalState.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalState((p) => ({
                        ...p,
                        name: val,
                        code: p.mode === 'create' && !p.code ? val.toUpperCase().replace(/[^A-Z0-9]/g, '_') : p.code,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. REGIONAL_VP"
                    value={modalState.code}
                    onChange={(e) => setModalState((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department / Governance Domain</label>
                  <select
                    className="form-select"
                    value={modalState.department}
                    onChange={(e) => setModalState((p) => ({ ...p, department: e.target.value }))}
                  >
                    <option value="Regional Multi-Branch Governance">Regional Multi-Branch Governance</option>
                    <option value="Operational Management & Rosters">Operational Management & Rosters</option>
                    <option value="Financial & Revenue Audit">Financial & Revenue Audit</option>
                    <option value="Franchise General Oversight">Franchise General Oversight</option>
                    <option value="Technical Support & Compliance">Technical Support & Compliance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Authority Level</label>
                  <select
                    className="form-select"
                    value={modalState.accessLevel}
                    onChange={(e) => setModalState((p) => ({ ...p, accessLevel: e.target.value }))}
                  >
                    <option value="Full Executive Authority">Full Executive Authority (All Controls)</option>
                    <option value="Auditing & Reports Authority">Auditing & Reports Authority</option>
                    <option value="Operational Rosters Only">Operational Rosters Only</option>
                    <option value="Support & SLA Escalations Only">Support & SLA Escalations Only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role Responsibilities & SLA Scope</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Outline the responsibilities assigned to this executive profile..."
                  value={modalState.description}
                  onChange={(e) => setModalState((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </>
          )}

          {/* ───────────────────────────────────────────────────────────
              FORM VARIANT 5: TAX SLAB FORM
              ─────────────────────────────────────────────────────────── */}
          {modalState.category === 'TAX_SLAB' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tax Slab Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. GST Standard (India)"
                    value={modalState.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalState((p) => ({
                        ...p,
                        name: val,
                        code: p.mode === 'create' && !p.code ? val.toUpperCase().replace(/[^A-Z0-9]/g, '_') : p.code,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tax Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. GST_18"
                    value={modalState.code}
                    onChange={(e) => setModalState((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tax Rate Percentage (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="18"
                    value={modalState.taxRate}
                    onChange={(e) => setModalState((p) => ({ ...p, taxRate: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Applicable Country / Region</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. India or UAE"
                    value={modalState.country}
                    onChange={(e) => setModalState((p) => ({ ...p, country: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="taxDefault"
                  checked={modalState.isDefault}
                  onChange={(e) => setModalState((p) => ({ ...p, isDefault: e.target.checked }))}
                />
                <label htmlFor="taxDefault" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Set as default tax applied automatically to salon invoices
                </label>
              </div>
            </>
          )}

          {/* ───────────────────────────────────────────────────────────
              FORM VARIANT 6: CURRENCY FORM
              ─────────────────────────────────────────────────────────── */}
          {modalState.category === 'CURRENCY' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Currency Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Indian Rupee"
                    value={modalState.name}
                    onChange={(e) => setModalState((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ISO Currency Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. INR"
                    maxLength={3}
                    value={modalState.code}
                    onChange={(e) => setModalState((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Symbol</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹ or $ or €"
                    value={modalState.currencySymbol}
                    onChange={(e) => setModalState((p) => ({ ...p, currencySymbol: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Exchange Rate (vs USD Base)</label>
                  <input
                    type="number"
                    className="form-input"
                    step="0.001"
                    value={modalState.exchangeRate}
                    onChange={(e) => setModalState((p) => ({ ...p, exchangeRate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="curDefault"
                  checked={modalState.isDefault}
                  onChange={(e) => setModalState((p) => ({ ...p, isDefault: e.target.checked }))}
                />
                <label htmlFor="curDefault" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Set as platform default currency for subscription billing
                </label>
              </div>
            </>
          )}

          {/* ───────────────────────────────────────────────────────────
              FORM VARIANT 7: PLAN FEATURE FORM
              ─────────────────────────────────────────────────────────── */}
          {modalState.category === 'PLAN_FEATURE' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Feature Display Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. WhatsApp Marketing Automation"
                    value={modalState.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalState((p) => ({
                        ...p,
                        name: val,
                        featureKey: p.mode === 'create' && !p.featureKey ? val.toLowerCase().replace(/[^a-z0-9]/g, '_') : p.featureKey,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Feature Key / Identifier</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. whatsapp_marketing"
                    value={modalState.featureKey}
                    onChange={(e) => setModalState((p) => ({ ...p, featureKey: e.target.value.toLowerCase() }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Feature Category</label>
                <select
                  className="form-select"
                  value={modalState.featureCategory}
                  onChange={(e) => setModalState((p) => ({ ...p, featureCategory: e.target.value }))}
                >
                  <option value="Operations">Operations (Appointments, Rosters)</option>
                  <option value="Billing & POS">Billing & POS (Invoices, Taxes)</option>
                  <option value="Marketing">Marketing (WhatsApp, SMS, Promotions)</option>
                  <option value="Multi-Branch">Multi-Branch & Cloud Infrastructure</option>
                  <option value="White-Label">White-Label & Branding</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Feature Description</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Explain what this feature unlocks for the salon..."
                  value={modalState.description}
                  onChange={(e) => setModalState((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </>
          )}

          {/* Lifecycle Status - Available across all categories */}
          <div className="form-group" style={{ marginTop: '0.25rem' }}>
            <label className="form-label">Lifecycle Status</label>
            <select
              className="form-select"
              value={modalState.status}
              onChange={(e) => setModalState((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="ACTIVE">ACTIVE (Available in platform dropdowns)</option>
              <option value="INACTIVE">INACTIVE (Hidden from selection)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title={`Delete Record: ${deleteModal.item?.name || ''}`}
        message="Are you sure you want to delete this master record? Dropdowns referring to this entry will no longer display it."
        confirmText="Delete Record"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default MasterDataManagement;
