/**
 * @file TenantsList.jsx
 * @description All Tenants Management Screen with Search, Filters, Quick View, Quick Edit, Lifecycle Actions, and Permissions Management
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { tenantsApi, plansApi, subscriptionsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import ConfirmModal from '../../../components/ConfirmModal';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import {
  DEFAULT_PERMISSIONS,
  PERMISSION_DEFINITIONS,
} from '../tenants/constants/permissions.constants';
import {
  Building2,
  Plus,
  Eye,
  Edit2,
  CheckCircle,
  Slash,
  Trash2,
  Database,
  ExternalLink,
  Phone,
  Mail,
  User,
  Calendar,
  Globe,
  Layers,
  Sparkles,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  Clock,
  Timer,
  AlertTriangle,
  Link2,
} from 'lucide-react';

import { buildTenantUrl, PLATFORM_DOMAIN } from '../../../utils/tenantDomain';

/**
 * Resolve tenant portal URL dynamically (auto-detects localhost vs production)
 */
export const getTenantVisitUrl = (tenant, portal = 'public') => {
  return buildTenantUrl(tenant, portal);
};

/**
 * Dropdown Menu for Tenant Actions
 */
const TenantActionsDropdown = ({
  tenant,
  onEdit,
  onActivate,
  onSuspend,
  onDelete,
  onAssignPlan,
  onManagePermissions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isSuspended = (tenant.status || '').toUpperCase() === 'SUSPENDED';

  return (
    <div className="action-dropdown-wrap" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
        title="More Actions"
      >
        <span>More</span>
        <span style={{ fontSize: '0.65rem' }}>▾</span>
      </button>

      {isOpen && (
        <div className="action-dropdown-menu">
          <button
            type="button"
            className="action-dropdown-item"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
          >
            <Edit2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Edit Tenant</span>
          </button>

          {isSuspended ? (
            <button
              type="button"
              className="action-dropdown-item"
              onClick={() => {
                setIsOpen(false);
                onActivate();
              }}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Activate</span>
            </button>
          ) : (
            <button
              type="button"
              className="action-dropdown-item"
              onClick={() => {
                setIsOpen(false);
                onSuspend();
              }}
            >
              <Slash className="w-3.5 h-3.5 text-amber-400" />
              <span>Suspend</span>
            </button>
          )}

          <button
            type="button"
            className="action-dropdown-item danger"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive / Delete</span>
          </button>

          <div className="action-dropdown-divider" />
          <div className="action-dropdown-section-label">Portal Launchers</div>

          <a
            href={getTenantVisitUrl(tenant, 'public')}
            target="_blank"
            rel="noreferrer"
            className="action-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Store / Website (/)</span>
          </a>

          <a
            href={getTenantVisitUrl(tenant, 'booking')}
            target="_blank"
            rel="noreferrer"
            className="action-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>Online Booking (/book)</span>
          </a>

          <a
            href={getTenantVisitUrl(tenant, 'admin')}
            target="_blank"
            rel="noreferrer"
            className="action-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Salon Admin (/admin)</span>
          </a>

          <a
            href={getTenantVisitUrl(tenant, 'customer')}
            target="_blank"
            rel="noreferrer"
            className="action-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-3.5 h-3.5 text-pink-400" />
            <span>Customer Portal (/customer)</span>
          </a>

          <a
            href={getTenantVisitUrl(tenant, 'staff')}
            target="_blank"
            rel="noreferrer"
            className="action-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Staff Portal (/staff)</span>
          </a>

          <a
            href={getTenantVisitUrl(tenant, 'student')}
            target="_blank"
            rel="noreferrer"
            className="action-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student Academy (/student)</span>
          </a>

          <div className="action-dropdown-divider" />
          <div className="action-dropdown-section-label">Permissions</div>

          <button
            type="button"
            className="action-dropdown-item"
            onClick={() => {
              setIsOpen(false);
              onAssignPlan();
            }}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Assign Plan</span>
          </button>

          <button
            type="button"
            className="action-dropdown-item permission-item-btn"
            onClick={() => {
              setIsOpen(false);
              onManagePermissions();
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Manage Permissions</span>
          </button>

          <Link
            to={`/superadmin/access-control?tenantId=${tenant._id || tenant.id}`}
            className="action-dropdown-item"
            style={{ textDecoration: 'none', color: 'var(--primary)' }}
            onClick={() => setIsOpen(false)}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Unified Control Center</span>
          </Link>
        </div>
      )}
    </div>
  );
};

/**
 * Tenant Permissions Modal Component
 */
export const TenantPermissionsModal = ({ isOpen, onClose, tenant, onSaved }) => {
  const [permissions, setPermissions] = useState({ ...DEFAULT_PERMISSIONS });
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (tenant) {
      const initial = { ...DEFAULT_PERMISSIONS };
      if (tenant.permissions && typeof tenant.permissions === 'object') {
        Object.assign(initial, tenant.permissions);
      }
      if (tenant.storageConfig?.allowCustomCloudflare !== undefined) {
        initial.customCloudflare = Boolean(tenant.storageConfig.allowCustomCloudflare);
      }
      if (tenant.databaseConfig?.allowCustomDatabase !== undefined) {
        initial.customDatabase = Boolean(tenant.databaseConfig.allowCustomDatabase);
      }
      if (tenant.domainAccess?.customDomainAllowed !== undefined) {
        initial.customDomain = Boolean(tenant.domainAccess.customDomainAllowed);
      }
      if (tenant.securityConfig?.ipWhitelistEnabled !== undefined) {
        initial.ipWhitelist = Boolean(tenant.securityConfig.ipWhitelistEnabled);
      }
      if (tenant.securityConfig?.whiteLabelEnabled !== undefined) {
        initial.whiteLabelBranding = Boolean(tenant.securityConfig.whiteLabelEnabled);
      }
      setPermissions(initial);
    }
  }, [tenant, isOpen]);

  if (!isOpen || !tenant) return null;

  const tenantId = tenant._id || tenant.id;
  const totalPermissions = 17;
  const enabledCount = Object.values(permissions).filter(Boolean).length;

  const handleToggle = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAll = (val) => {
    setPermissions((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = val;
      });
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...permissions,
        allowCustomCloudflare: Boolean(permissions.customCloudflare),
        allowCustomDatabase: Boolean(permissions.customDatabase),
        customDomainAllowed: Boolean(permissions.customDomain),
        ipWhitelistEnabled: Boolean(permissions.ipWhitelist),
        whiteLabelEnabled: Boolean(permissions.whiteLabelBranding),
        permissions,
      };
      await tenantsApi.updateGovernance(tenantId, payload);
      success(`Permissions for "${tenant.name}" updated successfully!`);
      if (onSaved) onSaved({ ...tenant, permissions });
      onClose();
    } catch (err) {
      error(err.message || 'Failed to update tenant permissions');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSections =
    activeCategory === 'ALL'
      ? PERMISSION_DEFINITIONS
      : PERMISSION_DEFINITIONS.filter((sec) => sec.section === activeCategory);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Permissions: ${tenant.name}`}
      size="large"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {enabledCount} of {totalPermissions} permissions enabled
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving Permissions...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '68vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {/* Permission Summary Bar */}
        <div className="permission-summary-bar">
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Tenant Access & Governance Matrix
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Configure operational modules, enterprise cloud infrastructure, and business controls.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                fontSize: '0.8rem',
              }}
            >
              {enabledCount} / {totalPermissions} Enabled
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleToggleAll(true)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Enable All
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleToggleAll(false)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Disable All
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'Module Access', label: '📦 Module Access' },
            { id: 'Infrastructure', label: '☁️ Infrastructure' },
            { id: 'Business Controls', label: '💼 Business Controls' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Permission Sections */}
        {filteredSections.map((sec) => (
          <div key={sec.section}>
            <div className="permission-section-title">
              <span>{sec.icon}</span>
              <span>{sec.section}</span>
            </div>
            <div className="permission-grid">
              {sec.items.map((item) => {
                const isEnabled = Boolean(permissions[item.key]);
                return (
                  <div
                    key={item.key}
                    className={`permission-item ${isEnabled ? 'enabled' : ''}`}
                    onClick={() => handleToggle(item.key)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="permission-item-label">
                      <div className="permission-item-name">{item.name}</div>
                      <div className="permission-item-desc">{item.desc}</div>
                    </div>
                    <label className="permission-toggle" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggle(item.key)}
                      />
                      <span className="toggle-track" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export const TenantsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [selectedDbMode, setSelectedDbMode] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [plans, setPlans] = useState([]);

  // Action Modals State
  const [viewModal, setViewModal] = useState({ isOpen: false, tenant: null });
  const [permissionsModal, setPermissionsModal] = useState({ isOpen: false, tenant: null });
  const [assignPlanModal, setAssignPlanModal] = useState({
    isOpen: false,
    tenant: null,
    planId: '',
    billingCycle: 'monthly',
    durationDays: 30,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    tenant: null,
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: 'salon',
    databaseMode: 'shared',
    status: 'active',
    planId: '',
    subscriptionEndDate: '',
    whitelistedIps: '',
    subdomain: '',
    primaryDomain: '',
  });
  const [suspendModal, setSuspendModal] = useState({ isOpen: false, tenant: null, reason: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tenant: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  // Sync selectedStatus whenever statusParam changes in URL
  useEffect(() => {
    setSelectedStatus(statusParam);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [statusParam]);

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await tenantsApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: selectedStatus || undefined,
        databaseMode: selectedDbMode || undefined,
      });
      const items = res.data?.items || res.data?.tenants || (Array.isArray(res.data) ? res.data : []);
      setTenants(items);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || items.length,
      }));
    } catch (err) {
      error(err.message || 'Failed to fetch tenants');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, selectedStatus, selectedDbMode, error]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // Load plans for the Assign Plan selector
  useEffect(() => {
    plansApi.list({ limit: 50 }).then((res) => {
      const pItems = res.data?.plans || res.data?.items || (Array.isArray(res.data) ? res.data : []);
      setPlans(pItems);
    }).catch(() => {});
  }, []);

  const handleOpenEdit = (tenant) => {
    const rawIps = tenant.securityConfig?.whitelistedIps;
    const ipsStr = Array.isArray(rawIps) ? rawIps.join(', ') : '';
    const expiryDate = tenant.subscriptionId?.endDate || tenant.trialExpiresAt;
    const dateFormatted = expiryDate ? new Date(expiryDate).toISOString().split('T')[0] : '';
    const currentPlanId = tenant.planId?._id || tenant.planId || tenant.subscriptionId?.planId?._id || tenant.subscriptionId?.planId || '';
    const hasCustom = tenant.primaryDomain &&
      !tenant.primaryDomain.includes(PLATFORM_DOMAIN) &&
      !tenant.primaryDomain.includes('yourplatform.com') &&
      !tenant.primaryDomain.includes('beautysaas.local') &&
      !tenant.primaryDomain.includes('localhost');

    setEditModal({
      isOpen: true,
      tenant,
      name: tenant.name || '',
      ownerName: tenant.ownerName || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      businessType: tenant.businessType || 'salon',
      databaseMode: tenant.databaseMode || 'shared',
      status: tenant.status || 'active',
      planId: currentPlanId,
      subscriptionEndDate: dateFormatted,
      whitelistedIps: ipsStr,
      domainMode: hasCustom ? 'custom' : 'subdomain',
      subdomain: tenant.subdomain || tenant.slug || '',
      primaryDomain: hasCustom ? tenant.primaryDomain : '',
    });
  };

  const handleSaveEdit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editModal.tenant) return;
    const tId = editModal.tenant._id || editModal.tenant.id;
    const ipsArray = editModal.whitelistedIps
      ? editModal.whitelistedIps.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const chosenPlan = plans.find((p) => (p._id || p.id) === editModal.planId);

    const cleanSub = (editModal.subdomain || editModal.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();
    const finalPrimaryDomain = editModal.domainMode === 'custom' && editModal.primaryDomain?.trim()
      ? editModal.primaryDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
      : `${cleanSub}.${PLATFORM_DOMAIN}`;

    const updatedData = {
      name: editModal.name,
      ownerName: editModal.ownerName,
      email: editModal.email,
      phone: editModal.phone,
      businessType: editModal.businessType,
      databaseMode: editModal.databaseMode,
      status: editModal.status,
      planId: editModal.planId || undefined,
      subscriptionEndDate: editModal.subscriptionEndDate || undefined,
      whitelistedIps: ipsArray,
      subdomain: cleanSub,
      primaryDomain: finalPrimaryDomain,
    };

    // Instant optimistic update
    setTenants((prev) =>
      prev.map((item) => {
        if (item._id === tId || item.id === tId) {
          return {
            ...item,
            ...updatedData,
            planId: chosenPlan || item.planId,
            trialExpiresAt: editModal.subscriptionEndDate ? new Date(editModal.subscriptionEndDate) : item.trialExpiresAt,
            subscriptionId: item.subscriptionId
              ? {
                  ...item.subscriptionId,
                  planId: chosenPlan || item.subscriptionId.planId,
                  endDate: editModal.subscriptionEndDate ? new Date(editModal.subscriptionEndDate) : item.subscriptionId.endDate,
                }
              : item.subscriptionId,
            securityConfig: {
              ...item.securityConfig,
              whitelistedIps: ipsArray,
              ipWhitelistEnabled: ipsArray.length > 0,
            },
          };
        }
        return item;
      })
    );

    setEditModal((prev) => ({ ...prev, isOpen: false, tenant: null }));

    try {
      await tenantsApi.update(tId, updatedData);
      success(`Tenant "${editModal.name}" updated successfully!`);
    } catch (err) {
      error(err.message || 'Failed to update tenant');
      fetchTenants();
    }
  };

  const handleActivate = async (tenant) => {
    const tId = tenant._id || tenant.id;
    // Instant optimistic update
    setTenants((prev) => prev.map((item) => (item._id === tId || item.id === tId ? { ...item, status: 'active' } : item)));
    try {
      await tenantsApi.activate(tId);
      success(`Tenant "${tenant.name}" activated (unblocked) successfully`);
    } catch (err) {
      error(err.message || 'Failed to activate tenant');
      fetchTenants();
    }
  };

  const handleToggleBlock = async (tenant) => {
    const tId = tenant._id || tenant.id;
    const isCurrentlySuspended = (tenant.status || '').toLowerCase() === 'suspended';
    const nextStatus = isCurrentlySuspended ? 'active' : 'suspended';

    // Instant optimistic update
    setTenants((prev) =>
      prev.map((item) =>
        item._id === tId || item.id === tId ? { ...item, status: nextStatus } : item
      )
    );

    try {
      if (isCurrentlySuspended) {
        await tenantsApi.activate(tId);
        success(`Tenant "${tenant.name}" has been Unblocked (Active)`);
      } else {
        await tenantsApi.suspend(tId, 'Quick block by Super Admin');
        success(`Tenant "${tenant.name}" has been Blocked (Suspended)`);
      }
    } catch (err) {
      error(err.message || 'Failed to update tenant status');
      fetchTenants();
    }
  };

  const handleSuspendConfirm = async () => {
    if (!suspendModal.tenant) return;
    const tId = suspendModal.tenant._id || suspendModal.tenant.id;
    // Instant optimistic update
    setTenants((prev) => prev.map((item) => (item._id === tId || item.id === tId ? { ...item, status: 'suspended' } : item)));
    setSuspendModal({ isOpen: false, tenant: null, reason: '' });
    try {
      await tenantsApi.suspend(tId, suspendModal.reason);
      success(`Tenant suspended`);
    } catch (err) {
      error(err.message || 'Failed to suspend tenant');
      fetchTenants();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.tenant) return;
    const tId = deleteModal.tenant._id || deleteModal.tenant.id;
    setTenants((prev) => prev.filter((item) => item._id !== tId && item.id !== tId));
    setDeleteModal({ isOpen: false, tenant: null });
    try {
      await tenantsApi.delete(tId);
      success(`Tenant archived successfully`);
    } catch (err) {
      error(err.message || 'Failed to delete tenant');
      fetchTenants();
    }
  };

  const handleAssignPlan = async (e) => {
    e.preventDefault();
    if (!assignPlanModal.tenant || !assignPlanModal.planId) return;
    setActionLoading(true);
    const tId = assignPlanModal.tenant._id || assignPlanModal.tenant.id;
    const chosenPlan = plans.find((p) => (p._id || p.id) === assignPlanModal.planId);
    try {
      await subscriptionsApi.create({
        tenantId: tId,
        planId: assignPlanModal.planId,
        billingCycle: assignPlanModal.billingCycle,
        durationDays: Number(assignPlanModal.durationDays) || 30,
      });
      // Instant optimistic state reflection
      setTenants((prev) => prev.map((item) => (item._id === tId || item.id === tId ? { ...item, planId: chosenPlan || item.planId, status: 'active' } : item)));
      success(`Plan "${chosenPlan?.name || 'Selected Plan'}" assigned to ${assignPlanModal.tenant.name} successfully!`);
      setAssignPlanModal({ isOpen: false, tenant: null, planId: '', billingCycle: 'monthly', durationDays: 30 });
      fetchTenants();
    } catch (err) {
      error(err.message || 'Failed to assign plan');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Business & Created',
      accessor: 'name',
      render: (row) => {
        const createdDate = row.createdAt ? new Date(row.createdAt) : new Date();
        const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        const createdFormatted = createdDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        const relativeText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                flexShrink: 0,
              }}
            >
              {row.name ? row.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{row.name}</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    textTransform: 'capitalize',
                  }}
                >
                  {row.businessType || 'Salon'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {row.ownerName || row.name} • {row.email}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                <Clock className="w-3 h-3 opacity-60" />
                <span>Created {createdFormatted} ({relativeText})</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Domain Routing',
      accessor: 'primaryDomain',
      render: (row) => {
        const isCustom = row.primaryDomain && !row.primaryDomain.includes(PLATFORM_DOMAIN) && !row.primaryDomain.includes('yourplatform.com') && !row.primaryDomain.includes('beautysaas.local') && !row.primaryDomain.includes('localhost');
        const displayHost = isCustom ? row.primaryDomain : `${row.subdomain || row.slug}.${PLATFORM_DOMAIN}`;
        const liveUrl = getTenantVisitUrl(row, 'public');

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              {isCustom ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38BDF8',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                  }}
                  title="White-label custom domain"
                >
                  <Globe className="w-3 h-3" />
                  <span>Custom: {row.primaryDomain}</span>
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(168, 85, 247, 0.1)',
                    color: '#C084FC',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                  }}
                  title="Platform subdomain routing"
                >
                  <Link2 className="w-3 h-3" />
                  <span>Subdomain: {row.subdomain || row.slug}</span>
                </span>
              )}
            </div>
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.725rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              className="hover:text-sky-400"
              title={`Visit Portal: ${liveUrl}`}
            >
              <span>{displayHost}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        );
      },
    },
    {
      header: 'Plan & Subscription',
      accessor: 'planId',
      render: (row) => {
        const planName = row.planId?.name || row.subscriptionId?.planId?.name || (row.status === 'trial' ? 'Trial Plan' : 'Standard Plan');
        const price = row.planId?.priceMonthly !== undefined
          ? `₹${row.planId.priceMonthly.toLocaleString()}/mo`
          : row.subscriptionId?.amount
          ? `₹${row.subscriptionId.amount.toLocaleString()}/mo`
          : 'Free';

        return (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                {planName}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {price} • {row.subscriptionId?.billingCycle || 'monthly'}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Validity & Expiry Countdown',
      accessor: 'subscriptionId',
      render: (row) => {
        const expiryDate = row.subscriptionId?.endDate || row.trialExpiresAt;
        if (!expiryDate) {
          return <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Active Term</span>;
        }

        const dateObj = new Date(expiryDate);
        const diffMs = dateObj.getTime() - Date.now();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div>
              {daysLeft < 0 ? (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#F87171',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Expired ({Math.abs(daysLeft)}d ago)</span>
                </span>
              ) : daysLeft === 0 ? (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#EF4444',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Timer className="w-3 h-3" />
                  <span>Expires Today ⚠️</span>
                </span>
              ) : daysLeft <= 3 ? (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#EF4444',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Timer className="w-3 h-3" />
                  <span>⚠️ {daysLeft} days left</span>
                </span>
              ) : daysLeft <= 15 ? (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#F59E0B',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Timer className="w-3 h-3" />
                  <span>⏳ {daysLeft} days left</span>
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>✓ {daysLeft} days left</span>
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Valid till: <strong>{formattedDate}</strong>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Security & IP Lock',
      accessor: 'securityConfig',
      render: (row) => {
        const ips = row.securityConfig?.whitelistedIps || [];
        const isEnabled = row.securityConfig?.ipWhitelistEnabled && ips.length > 0;
        return (
          <div>
            {isEnabled ? (
              <span
                title={`Whitelisted IPs: ${ips.join(', ')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  cursor: 'help',
                }}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>🛡️ {ips.length} IPs Locked</span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Shield className="w-3 h-3 opacity-50" />
                <span>Open IP (All)</span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'DB & Status',
      accessor: 'status',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div>
            <Badge status={row.status || 'ACTIVE'} />
          </div>
          <div>
            <Badge
              status={row.databaseMode || 'SHARED'}
              variant={row.databaseMode === 'SEPARATE' || row.databaseMode === 'separate' ? 'separate' : 'shared'}
              text={row.databaseMode === 'SEPARATE' || row.databaseMode === 'separate' ? 'Separate DB' : 'Shared DB'}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const id = row._id || row.id;
        const liveUrl = getTenantVisitUrl(row, 'public');
        const isSuspended = (row.status || '').toLowerCase() === 'suspended';

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
            {/* Quick Edit Button */}
            <button
              type="button"
              onClick={() => handleOpenEdit(row)}
              className="btn btn-secondary btn-sm"
              title="Quick Edit Tenant Directly"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Edit2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Edit</span>
            </button>

            {/* Quick 1-Click Block / Unblock Toggle */}
            <button
              type="button"
              onClick={() => handleToggleBlock(row)}
              className="btn btn-secondary btn-sm"
              title={isSuspended ? 'Unblock Tenant (Restore Access)' : 'Block Tenant (Suspend Access)'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: isSuspended ? '#10B981' : '#F87171',
                borderColor: isSuspended ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
                background: isSuspended ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              }}
            >
              {isSuspended ? <CheckCircle className="w-3.5 h-3.5" /> : <Slash className="w-3.5 h-3.5" />}
              <span>{isSuspended ? 'Unblock' : 'Block'}</span>
            </button>

            {/* Visit Live Website */}
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title={`Visit Live Website: ${liveUrl}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#38BDF8', padding: '0.25rem 0.5rem' }}
            >
              <Globe className="w-3.5 h-3.5" />
              <span style={{ fontSize: '0.75rem' }}>Visit</span>
            </a>

            {/* Open Control Center */}
            <Link
              to={`/superadmin/tenants/${id}`}
              className="btn btn-secondary btn-sm"
              title="Open Full Tenant Control Center"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Control</span>
            </Link>

            {/* Actions Dropdown */}
            <TenantActionsDropdown
              tenant={row}
              onEdit={() => handleOpenEdit(row)}
              onActivate={() => handleActivate(row)}
              onSuspend={() => setSuspendModal({ isOpen: true, tenant: row, reason: '' })}
              onDelete={() => setDeleteModal({ isOpen: true, tenant: row })}
              onAssignPlan={() =>
                setAssignPlanModal({
                  isOpen: true,
                  tenant: row,
                  planId: row.planId?._id || row.planId || (plans[0]?._id || plans[0]?.id || ''),
                  billingCycle: 'monthly',
                  durationDays: 30,
                })
              }
              onManagePermissions={() => setPermissionsModal({ isOpen: true, tenant: row })}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Tenant Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            White-label beauty parlours, salon chains, spas and training academies.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/superadmin/access-control" className="btn btn-secondary">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Unified Access Center</span>
          </Link>
          <Link to="/superadmin/tenants/create" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            <span>Provision Tenant</span>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: 0 }}>
        <DataTable
          columns={columns}
          data={tenants}
          isLoading={isLoading}
          searchPlaceholder="Search by name, owner, email or slug..."
          searchValue={search}
          onSearchChange={setSearch}
          onRowClick={handleOpenEdit}
          filters={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="form-select form-select-sm"
                value={selectedDbMode}
                onChange={(e) => setSelectedDbMode(e.target.value)}
              >
                <option value="">All Architectures</option>
                <option value="SHARED">Mode A: Shared DB</option>
                <option value="SEPARATE">Mode B: Separate DB</option>
              </select>
            </div>
          }
          pagination={{
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            onPageChange: (newPage) => setPagination((prev) => ({ ...prev, page: newPage })),
            onLimitChange: (limit) => setPagination((prev) => ({ ...prev, limit, page: 1 })),
          }}
          emptyMessage="No tenants registered in the control plane."
        />
      </div>

      {/* QUICK VIEW MODAL */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, tenant: null })}
        title={`Tenant Profile: ${viewModal.tenant?.name || 'Details'}`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Link
              to={`/superadmin/tenants/${viewModal.tenant?._id || viewModal.tenant?.id}`}
              className="btn btn-primary btn-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Full Control Center</span>
            </Link>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setViewModal({ isOpen: false, tenant: null })}
            >
              Close
            </button>
          </div>
        }
      >
        {viewModal.tenant && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                }}
              >
                {viewModal.tenant.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{viewModal.tenant.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>
                    Slug: <strong>{viewModal.tenant.slug}</strong>
                  </span>
                  <span>•</span>
                  <Badge status={viewModal.tenant.status || 'ACTIVE'} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Owner / Administrator</div>
                <div style={{ fontWeight: 600 }}>{viewModal.tenant.ownerName || 'Not Assigned'}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>{viewModal.tenant.email}</div>
                {viewModal.tenant.phone && <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{viewModal.tenant.phone}</div>}
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Architecture & Vertical</div>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{viewModal.tenant.businessType || 'Salon & Spa'}</div>
                <div style={{ marginTop: '0.35rem' }}>
                  <Badge
                    status={viewModal.tenant.databaseMode || 'SHARED'}
                    variant={viewModal.tenant.databaseMode === 'SEPARATE' ? 'separate' : 'shared'}
                    text={viewModal.tenant.databaseMode === 'SEPARATE' ? 'Dedicated DB' : 'Shared Multi-Tenant DB'}
                  />
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Domain Address</div>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38BDF8' }}>
                  {viewModal.tenant.primaryDomain || `${viewModal.tenant.slug}.beautysaas.local`}
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Registered Date</div>
                <div style={{ fontWeight: 600 }}>{new Date(viewModal.tenant.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* QUICK EDIT MODAL */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, tenant: null })}
        title={`Edit Tenant: ${editModal.tenant?.name || ''}`}
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditModal({ isOpen: false, tenant: null })}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveEdit}
              disabled={actionLoading}
            >
              {actionLoading ? 'Saving to Database...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-input"
                value={editModal.name}
                onChange={(e) => setEditModal((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editModal.ownerName}
                  onChange={(e) => setEditModal((p) => ({ ...p, ownerName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={editModal.phone}
                  onChange={(e) => setEditModal((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-input"
                value={editModal.email}
                onChange={(e) => setEditModal((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Business Vertical</label>
                <select
                  className="form-select"
                  value={editModal.businessType}
                  onChange={(e) => setEditModal((p) => ({ ...p, businessType: e.target.value }))}
                >
                  <option value="salon">Salon & Parlour</option>
                  <option value="spa">Spa & Wellness</option>
                  <option value="bridal">Bridal Studio</option>
                  <option value="academy">Academy / Training</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DB Mode</label>
                <select
                  className="form-select"
                  value={editModal.databaseMode}
                  onChange={(e) => setEditModal((p) => ({ ...p, databaseMode: e.target.value }))}
                >
                  <option value="shared">Mode A: Shared Database</option>
                  <option value="separate">Mode B: Separate Dedicated DB</option>
                </select>
              </div>
            </div>

            {/* Access State / Block Control */}
            <div className="form-group">
              <label className="form-label">Access State (Block / Unblock)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditModal((p) => ({ ...p, status: 'active' }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    border: editModal.status === 'active' ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                    background: editModal.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: editModal.status === 'active' ? '#34D399' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Active (Unblocked)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal((p) => ({ ...p, status: 'suspended' }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    border: editModal.status === 'suspended' ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
                    background: editModal.status === 'suspended' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: editModal.status === 'suspended' ? '#F87171' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Slash className="w-4 h-4" />
                  <span>Suspended (Blocked)</span>
                </button>
              </div>
            </div>

            {/* Plan & Subscription Expiration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SaaS Subscription Plan</span>
                </label>
                <select
                  className="form-select"
                  value={editModal.planId}
                  onChange={(e) => setEditModal((p) => ({ ...p, planId: e.target.value }))}
                >
                  <option value="">Select Plan...</option>
                  {plans.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.name} (₹{p.priceMonthly}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subscription Expiry Date</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={editModal.subscriptionEndDate}
                  onChange={(e) => setEditModal((p) => ({ ...p, subscriptionEndDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Domain Architecture & Routing Mode */}
            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Domain & Website Routing Mode</span>
                </label>
                <div style={{ display: 'inline-flex', padding: '2px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => setEditModal((p) => ({ ...p, domainMode: 'subdomain' }))}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: editModal.domainMode !== 'custom' ? 'var(--primary)' : 'transparent',
                      color: editModal.domainMode !== 'custom' ? '#FFF' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    🔗 Platform Subdomain
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModal((p) => ({ ...p, domainMode: 'custom' }))}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: editModal.domainMode === 'custom' ? '#0EA5E9' : 'transparent',
                      color: editModal.domainMode === 'custom' ? '#FFF' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    🌐 Custom Domain
                  </button>
                </div>
              </div>

              {editModal.domainMode !== 'custom' ? (
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Platform Subdomain Slug
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. blossom-salon"
                      value={editModal.subdomain}
                      onChange={(e) => setEditModal((p) => ({ ...p, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      required
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px', whiteSpace: 'nowrap' }}>
                      .{PLATFORM_DOMAIN}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#38BDF8', marginTop: '4px' }}>
                    Live Resolution:{' '}
                    {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.endsWith('.localhost'))
                      ? `http://${editModal.subdomain || 'tenant'}.localhost:${window.location.port || 3000}/ (Clean Localhost Subdomain)`
                      : `https://${editModal.subdomain || 'tenant'}.${PLATFORM_DOMAIN}/`}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Custom Registered Domain (White-Label)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. www.glamourbeauty.com or blossomsalon.com"
                    value={editModal.primaryDomain}
                    onChange={(e) => setEditModal((p) => ({ ...p, primaryDomain: e.target.value }))}
                    required
                  />
                  <div style={{ fontSize: '0.72rem', color: '#38BDF8', marginTop: '4px' }}>
                    Live Target: https://{editModal.primaryDomain || 'www.glamourbeauty.com'}/
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Whitelisted IPs (Comma Separated)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 192.168.1.1, 103.21.244.0/24 (Leave blank for Open IP)"
                value={editModal.whitelistedIps}
                onChange={(e) => setEditModal((p) => ({ ...p, whitelistedIps: e.target.value }))}
              />
              <div className="form-helper" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Only the specified IP addresses will be granted access when IP whitelist security is active.
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Suspend Reason Modal */}
      <Modal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, tenant: null, reason: '' })}
        title={`Suspend Tenant: ${suspendModal.tenant?.name || ''}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setSuspendModal({ isOpen: false, tenant: null, reason: '' })}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleSuspendConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Suspending...' : 'Confirm Suspension'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Suspension Reason</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="e.g. Terms violation, overdue payment, or administrative hold"
            value={suspendModal.reason}
            onChange={(e) => setSuspendModal((prev) => ({ ...prev, reason: e.target.value }))}
          />
          <div className="form-helper">
            Suspending will immediately disable customer and staff portal access for this tenant.
          </div>
        </div>
      </Modal>

      {/* Assign Plan & Subscription Modal */}
      <Modal
        isOpen={assignPlanModal.isOpen}
        onClose={() => setAssignPlanModal({ isOpen: false, tenant: null, planId: '', billingCycle: 'monthly', durationDays: 30 })}
        title={`Assign Subscription Plan: ${assignPlanModal.tenant?.name || ''}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setAssignPlanModal({ isOpen: false, tenant: null, planId: '', billingCycle: 'monthly', durationDays: 30 })}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAssignPlan}
              disabled={actionLoading || !assignPlanModal.planId}
            >
              {actionLoading ? 'Assigning Plan...' : 'Assign & Activate Plan'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAssignPlan}>
          <div className="form-group">
            <label className="form-label">Select SaaS Subscription Plan</label>
            <select
              className="form-select"
              value={assignPlanModal.planId}
              onChange={(e) => setAssignPlanModal((p) => ({ ...p, planId: e.target.value }))}
              required
            >
              <option value="">Select a plan...</option>
              {plans.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name} — ₹{p.priceMonthly}/mo (Max Staff: {p.limits?.maxStaff || 10}, Branches: {p.limits?.maxBranches || 2})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Billing Cycle</label>
              <select
                className="form-select"
                value={assignPlanModal.billingCycle}
                onChange={(e) => setAssignPlanModal((p) => ({ ...p, billingCycle: e.target.value }))}
              >
                <option value="monthly">Monthly Cycle</option>
                <option value="yearly">Yearly Cycle (Annual)</option>
                <option value="lifetime">Lifetime Access</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max="3650"
                value={assignPlanModal.durationDays}
                onChange={(e) => setAssignPlanModal((p) => ({ ...p, durationDays: e.target.value }))}
                required
              />
            </div>
          </div>

          <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Assigning this plan will immediately activate the tenant, grant all features defined in this plan, and update resource limits accordingly.
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, tenant: null })}
        onConfirm={handleDeleteConfirm}
        title={`Archive Tenant: ${deleteModal.tenant?.name || ''}`}
        message="Are you sure you want to archive this tenant? Their subscription will be terminated and data safely archived."
        confirmText="Archive Tenant"
        isLoading={actionLoading}
      />

      {/* TENANT PERMISSIONS MODAL */}
      <TenantPermissionsModal
        isOpen={permissionsModal.isOpen}
        onClose={() => setPermissionsModal({ isOpen: false, tenant: null })}
        tenant={permissionsModal.tenant}
        onSaved={() => fetchTenants()}
      />
    </div>
  );
};

export default TenantsList;
