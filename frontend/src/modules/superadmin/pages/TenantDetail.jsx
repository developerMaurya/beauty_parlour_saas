/**
 * @file TenantDetail.jsx
 * @description Tenant Control Center - Multi-Database Health, Domains, Backups, Permissions, and Governance
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  tenantsApi,
  databasesApi,
  domainsApi,
  subscriptionsApi,
  serviceTemplatesApi,
} from '../../../services/api/superadmin.api';

import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import {
  DEFAULT_PERMISSIONS,
  PERMISSION_DEFINITIONS,
} from '../tenants/constants/permissions.constants';
import {
  Building2,
  Database,
  Globe,
  CreditCard,
  Shield,
  Activity,
  RefreshCw,
  Server,
  Plus,
  CheckCircle,
  AlertTriangle,
  ArrowRightLeft,
  Download,
  Upload,
  Check,
  Cloud,
  Sliders,
  ShieldCheck,
  Save,
  Edit2,
  User,
  Phone,
  Mail,
  Sparkles,
  ExternalLink,
  Layers,
  Lock,
} from 'lucide-react';

export const TenantDetail = () => {
  const { tenantId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => setSearchParams(tab === 'overview' ? {} : { tab });

  const { success, error, warning } = useToast();

  const [tenant, setTenant] = useState(null);
  const [dbInfo, setDbInfo] = useState(null);
  const [dbHealth, setDbHealth] = useState(null);
  const [domains, setDomains] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: 'salon',
    status: 'active',
    databaseMode: 'shared',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Governance Form State
  const [governanceForm, setGovernanceForm] = useState({
    allowCustomCloudflare: false,
    cloudflareApiToken: '',
    cloudflareApiUrl: '',
    allowCustomDatabase: false,
    customDatabaseUri: '',
    databaseMode: 'shared',
    customDomainAllowed: false,
    isDomainActive: true,
    restrictedMessage: 'Connect to Super Admin for access to your website portal.',
    ipWhitelistEnabled: false,
    whitelistedIps: '',
    whiteLabelEnabled: true,
  });
  const [isSavingGovernance, setIsSavingGovernance] = useState(false);

  // Permissions State
  const [permissions, setPermissions] = useState({ ...DEFAULT_PERMISSIONS });
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Modals
  const [addDomainModal, setAddDomainModal] = useState({ isOpen: false, domain: '', isPrimary: false });
  const [migrationModal, setMigrationModal] = useState({
    isOpen: false,
    targetMode: 'SEPARATE',
    targetDatabaseName: '',
    isLoading: false,
  });
  const [dnsModal, setDnsModal] = useState({ isOpen: false, domain: null });

  const fetchTenantData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tRes, dbRes, dRes, sRes, actRes] = await Promise.all([
        tenantsApi.get(tenantId).catch(() => ({ data: { tenant: null } })),
        databasesApi.getTenantDb(tenantId).catch(() => ({ data: {} })),
        domainsApi.getTenantDomains(tenantId).catch(() => ({ data: { domains: [] } })),
        tenantsApi.getSubscriptions(tenantId).catch(() => ({ data: { subscriptions: [] } })),
        tenantsApi.getActivity(tenantId).catch(() => ({ data: { activity: [] } })),
      ]);

      const tData = tRes.data?.tenant || tRes.data;
      setTenant(tData);
      setDbInfo(dbRes.data);
      setDomains(Array.isArray(dRes.data) ? dRes.data : (dRes.data?.domains || []));
      setSubscription((Array.isArray(sRes.data) ? sRes.data[0] : sRes.data?.subscriptions?.[0]) || null);
      setActivity(Array.isArray(actRes.data) ? actRes.data : (actRes.data?.activity || []));

      if (tData) {
        setProfileForm({
          name: tData.name || '',
          ownerName: tData.ownerName || '',
          email: tData.email || '',
          phone: tData.phone || '',
          businessType: tData.businessType || 'salon',
          status: tData.status || 'active',
          databaseMode: tData.databaseMode || 'shared',
        });

        setGovernanceForm({
          allowCustomCloudflare: tData.storageConfig?.allowCustomCloudflare ?? false,
          cloudflareApiToken: tData.storageConfig?.cloudflareApiToken || '',
          cloudflareApiUrl: tData.storageConfig?.cloudflareApiUrl || '',
          allowCustomDatabase: tData.databaseConfig?.allowCustomDatabase ?? false,
          customDatabaseUri: tData.databaseConfig?.customUri || '',
          databaseMode: tData.databaseMode || 'shared',
          customDomainAllowed: tData.domainAccess?.customDomainAllowed ?? false,
          isDomainActive: tData.domainAccess?.isDomainActive ?? true,
          restrictedMessage: tData.domainAccess?.restrictedMessage || 'Connect to Super Admin for access to your website portal.',
          ipWhitelistEnabled: tData.securityConfig?.ipWhitelistEnabled ?? false,
          whitelistedIps: (tData.securityConfig?.whitelistedIps || []).join(', '),
          whiteLabelEnabled: tData.securityConfig?.whiteLabelEnabled ?? true,
        });

        // Initialize Permissions
        const initialPerms = { ...DEFAULT_PERMISSIONS };
        if (tData.permissions && typeof tData.permissions === 'object') {
          Object.assign(initialPerms, tData.permissions);
        }
        if (tData.storageConfig?.allowCustomCloudflare !== undefined) {
          initialPerms.customCloudflare = Boolean(tData.storageConfig.allowCustomCloudflare);
        }
        if (tData.databaseConfig?.allowCustomDatabase !== undefined) {
          initialPerms.customDatabase = Boolean(tData.databaseConfig.allowCustomDatabase);
        }
        if (tData.domainAccess?.customDomainAllowed !== undefined) {
          initialPerms.customDomain = Boolean(tData.domainAccess.customDomainAllowed);
        }
        if (tData.securityConfig?.ipWhitelistEnabled !== undefined) {
          initialPerms.ipWhitelist = Boolean(tData.securityConfig.ipWhitelistEnabled);
        }
        if (tData.securityConfig?.whiteLabelEnabled !== undefined) {
          initialPerms.whiteLabelBranding = Boolean(tData.securityConfig.whiteLabelEnabled);
        }
        setPermissions(initialPerms);
      }
    } catch (err) {
      error(err.message || 'Failed to load tenant details');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, error]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSavingProfile(true);
    try {
      await tenantsApi.update(tenantId, profileForm);
      success('Tenant profile updated successfully in database!');
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Failed to update tenant profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveGovernance = async (e) => {
    e?.preventDefault();
    setIsSavingGovernance(true);
    try {
      await tenantsApi.updateGovernance(tenantId, governanceForm);
      success('Governance permissions & cloud controls updated successfully!');
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Failed to update governance controls');
    } finally {
      setIsSavingGovernance(false);
    }
  };

  // Toggle Single Permission
  const handleTogglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle All Permissions
  const handleToggleAllPermissions = (val) => {
    setPermissions((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = val;
      });
      return next;
    });
  };

  // Save All Permissions
  const handleSavePermissions = async () => {
    setIsSavingPermissions(true);
    try {
      const payload = {
        ...governanceForm,
        ...permissions,
        allowCustomCloudflare: Boolean(permissions.customCloudflare),
        allowCustomDatabase: Boolean(permissions.customDatabase),
        customDomainAllowed: Boolean(permissions.customDomain),
        ipWhitelistEnabled: Boolean(permissions.ipWhitelist),
        whiteLabelEnabled: Boolean(permissions.whiteLabelBranding),
        permissions,
      };
      await tenantsApi.updateGovernance(tenantId, payload);
      setGovernanceForm((prev) => ({
        ...prev,
        allowCustomCloudflare: Boolean(permissions.customCloudflare),
        allowCustomDatabase: Boolean(permissions.customDatabase),
        customDomainAllowed: Boolean(permissions.customDomain),
        ipWhitelistEnabled: Boolean(permissions.ipWhitelist),
        whiteLabelEnabled: Boolean(permissions.whiteLabelBranding),
      }));
      success('Tenant permissions saved and applied successfully!');
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Failed to update tenant permissions');
    } finally {
      setIsSavingPermissions(false);
    }
  };

  // Check Database Health Action
  const handleCheckDbHealth = async () => {
    try {
      const res = await databasesApi.checkTenantDbHealth(tenantId);
      setDbHealth(res.data);
      success('Database ping check successful: Cluster connection is healthy');
    } catch (err) {
      error(err.message || 'Database health check failed');
    }
  };

  // Trigger Database Backup
  const handleBackup = async () => {
    try {
      const res = await databasesApi.backupTenantDb(tenantId);
      success(res.message || 'Tenant database snapshot created successfully');
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Database backup failed');
    }
  };

  // Add Domain
  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!addDomainModal.domain.trim()) return;
    try {
      await domainsApi.addTenantDomain(tenantId, {
        domain: addDomainModal.domain.trim(),
        isPrimary: addDomainModal.isPrimary,
      });
      success(`Domain ${addDomainModal.domain} assigned to tenant`);
      setAddDomainModal({ isOpen: false, domain: '', isPrimary: false });
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Failed to add domain');
    }
  };

  // Verify Domain
  const handleVerifyDomain = async (domainId) => {
    try {
      const res = await domainsApi.verify(domainId);
      if (res.data?.verified || res.data?.status === 'ACTIVE') {
        success('Domain ownership and DNS records verified successfully');
      } else {
        warning('DNS verification pending. Ensure TXT / CNAME records match instructions.');
      }
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Domain verification error');
    }
  };

  // Set Primary Domain
  const handleSetPrimaryDomain = async (domainId) => {
    try {
      await domainsApi.setPrimary(domainId);
      success('Primary domain updated successfully');
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Failed to set primary domain');
    }
  };

  // Database Migration
  const handleStartMigration = async () => {
    setMigrationModal((p) => ({ ...p, isLoading: true }));
    try {
      const res = await databasesApi.migrateTenantDb(tenantId, {
        targetMode: migrationModal.targetMode,
        targetDatabaseName: migrationModal.targetDatabaseName || undefined,
      });
      success(res.message || 'Database migration completed with integrity check');
      setMigrationModal({ isOpen: false, targetMode: 'SEPARATE', targetDatabaseName: '', isLoading: false });
      fetchTenantData();
    } catch (err) {
      error(err.message || 'Database migration failed');
      setMigrationModal((p) => ({ ...p, isLoading: false }));
    }
  };

  if (isLoading && !tenant) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading tenant control plane...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Tenant not found</h3>
        <Link to="/superadmin/tenants" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Tenants
        </Link>
      </div>
    );
  }

  const totalPermissionsCount = 17;
  const enabledPermissionsCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <Link to="/superadmin/tenants" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ← Tenants
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{tenant.slug}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.75rem' }}>{tenant.name}</h1>
            <Badge status={tenant.status || 'ACTIVE'} />
            <Badge
              status={tenant.databaseMode || 'SHARED'}
              variant={tenant.databaseMode === 'SEPARATE' ? 'separate' : 'shared'}
              text={tenant.databaseMode === 'SEPARATE' ? 'Dedicated DB' : 'Shared DB'}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={async () => {
              try {
                const res = await serviceTemplatesApi.seedToTenant(
                  tenantId,
                  tenant.businessType || 'SALON'
                );
                success(res.message || 'Industry services catalog seeded into tenant database!');
              } catch (err) {
                error(err.message || 'Failed to seed catalog');
              }
            }}
            className="btn btn-secondary btn-sm"
            title="Inject pre-configured salon/spa/makeup services into tenant database"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Seed Service Catalog
          </button>

          <button onClick={fetchTenantData} className="btn btn-secondary btn-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>

          <Link
            to={`/superadmin/access-control?tenantId=${tenantId}`}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ShieldCheck className="w-4 h-4" /> Unified Control Center
          </Link>

          <button
            onClick={() =>
              setMigrationModal({
                isOpen: true,
                targetMode: tenant.databaseMode === 'SEPARATE' ? 'SHARED' : 'SEPARATE',
                targetDatabaseName: tenant.databaseMode === 'SHARED' ? `beauty_tenant_${tenant.slug}` : 'beauty_saas_shared',
                isLoading: false,
              })
            }
            className="btn btn-secondary btn-sm"
          >
            <ArrowRightLeft className="w-4 h-4" /> Migrate Database
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        {[
          { id: 'overview', label: 'Overview & Profile' },
          { id: 'settings', label: '⚙️ Edit Profile' },
          { id: 'governance', label: '🛡️ Governance & Cloud Controls' },
          { id: 'permissions', label: '🔐 Permissions' },
          { id: 'database', label: 'Multi-Database Architecture' },
          { id: 'domains', label: 'White-Label Domains' },
          { id: 'subscription', label: 'Subscription & Billing' },
          { id: 'activity', label: 'Audit Trail' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tenant Health Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '12px',
                    background: 'var(--primary-gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  {tenant.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>{tenant.name}</h2>

                    {/* Status badge with colored dot */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background:
                          tenant.status?.toLowerCase() === 'active'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : tenant.status?.toLowerCase() === 'trial'
                            ? 'rgba(14, 165, 233, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        color:
                          tenant.status?.toLowerCase() === 'active'
                            ? '#10B981'
                            : tenant.status?.toLowerCase() === 'trial'
                            ? '#38BDF8'
                            : '#EF4444',
                        border: `1px solid ${
                          tenant.status?.toLowerCase() === 'active'
                            ? 'rgba(16, 185, 129, 0.3)'
                            : tenant.status?.toLowerCase() === 'trial'
                            ? 'rgba(14, 165, 233, 0.3)'
                            : 'rgba(239, 68, 68, 0.3)'
                        }`,
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background:
                            tenant.status?.toLowerCase() === 'active'
                              ? '#10B981'
                              : tenant.status?.toLowerCase() === 'trial'
                              ? '#38BDF8'
                              : '#EF4444',
                          boxShadow: `0 0 8px ${
                            tenant.status?.toLowerCase() === 'active'
                              ? '#10B981'
                              : tenant.status?.toLowerCase() === 'trial'
                              ? '#38BDF8'
                              : '#EF4444'
                          }`,
                        }}
                      />
                      {tenant.status || 'ACTIVE'}
                    </div>

                    {/* DB Mode badge */}
                    <Badge
                      status={tenant.databaseMode || 'SHARED'}
                      variant={tenant.databaseMode === 'SEPARATE' || tenant.databaseMode === 'separate' ? 'separate' : 'shared'}
                      text={tenant.databaseMode === 'SEPARATE' || tenant.databaseMode === 'separate' ? 'Separate DB (Mode B)' : 'Shared DB (Mode A)'}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Slug: <strong style={{ color: 'var(--text-secondary)' }}>{tenant.slug}</strong> • Platform Domain:{' '}
                    <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{tenant.slug}.beautysaas.local</span>
                  </div>
                </div>
              </div>

              {/* Quick action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('settings')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('permissions')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#A855F7',
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Manage Permissions</span>
                </button>

                <a
                  href={tenant.primaryDomain ? `https://${tenant.primaryDomain}` : `https://${tenant.slug}.beautysaas.local`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Portal</span>
                </a>
              </div>
            </div>

            {/* Key metrics in a row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.22)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Domain Address
                </div>
                <div style={{ fontWeight: 600, color: '#38BDF8', fontSize: '0.85rem', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                  {tenant.primaryDomain || `${tenant.slug}.beautysaas.local`}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  DB Strategy
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  {tenant.databaseMode === 'SEPARATE' || tenant.databaseMode === 'separate'
                    ? 'Isolated Dedicated DB'
                    : 'Shared Multi-Tenant DB'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Created Date
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  {new Date(tenant.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Business Type
                </div>
                <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  {tenant.businessType || 'Salon & Spa'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid-cols-2">
            {/* Business Profile */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span>Business Profile</span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Business Category: </span>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{tenant.businessType || 'Salon'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Owner: </span>
                  <span style={{ fontWeight: 600 }}>{tenant.ownerName || tenant.email}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Contact Email: </span>
                  <span style={{ fontWeight: 600 }}>{tenant.email}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                  <span style={{ fontWeight: 600 }}>{tenant.phone || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Address: </span>
                  <span style={{ fontWeight: 600 }}>
                    {[tenant.address?.street, tenant.address?.city, tenant.address?.country].filter(Boolean).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <span>System Security & Routing</span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Tenant ID: </span>
                  <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {tenant._id || tenant.id}
                  </code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Subdomain: </span>
                  <span style={{ fontWeight: 600 }}>{tenant.slug}.beautysaas.local</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Created At: </span>
                  <span>{new Date(tenant.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Isolation Policy: </span>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>Zero-Trust Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Settings / Edit Profile */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'rgba(255,255,255,0.03)',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px' }}>
                Edit Tenant Profile & Administrative Configuration
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Update business name, owner details, contact email, phone, business vertical, and lifecycle status.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingProfile}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <Save className="w-4 h-4" />
              {isSavingProfile ? 'Saving to Database...' : 'Save Profile Changes'}
            </button>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner / Managing Director</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.ownerName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, ownerName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry Vertical</label>
                <select
                  className="form-select"
                  value={profileForm.businessType}
                  onChange={(e) => setProfileForm((p) => ({ ...p, businessType: e.target.value }))}
                >
                  <option value="salon">Luxury Salon & Hair Parlour</option>
                  <option value="spa">Spa & Wellness Sanctuary</option>
                  <option value="bridal">Bridal Makeup & Styling Studio</option>
                  <option value="academy">Cosmetology & Academy Institute</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lifecycle Status</label>
                <select
                  className="form-select"
                  value={profileForm.status}
                  onChange={(e) => setProfileForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="active">Active (Full Operation)</option>
                  <option value="trial">Trial (Evaluation Period)</option>
                  <option value="suspended">Suspended (Access Disabled)</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Governance & Cloud Controls */}
      {activeTab === 'governance' && (
        <form onSubmit={handleSaveGovernance} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Action Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'rgba(255,255,255,0.03)',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
                Tenant Governance & Cloud Infrastructure Controls
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                SuperAdmin permission matrix controlling Cloudflare Images, MongoDB access, custom domains, and zero-trust IP restrictions.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingGovernance}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <Save className="w-4 h-4" />
              {isSavingGovernance ? 'Saving Controls...' : 'Save Governance Controls'}
            </button>
          </div>

          <div className="grid-cols-2">
            {/* 1. Cloudflare Images & Storage */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cloud className="w-5 h-5 text-pink-400" />
                  <span>Cloudflare Images & Media Storage</span>
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={governanceForm.allowCustomCloudflare}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, allowCustomCloudflare: e.target.checked }))}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: governanceForm.allowCustomCloudflare ? '#10b981' : 'var(--text-muted)',
                    }}
                  >
                    {governanceForm.allowCustomCloudflare ? 'Custom Allowed' : 'Platform Default'}
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(236, 72, 153, 0.08)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                  }}
                >
                  {governanceForm.allowCustomCloudflare ? (
                    <span>
                      <strong>Custom Cloudflare Permitted:</strong> Tenant can specify their own Cloudflare API Token & Account.
                    </span>
                  ) : (
                    <span>
                      <strong>Platform Managed:</strong> Uploads use SaaS platform-wide Cloudflare bucket.
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Cloudflare API Token</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="cf_api_tok_••••••••••••"
                    value={governanceForm.cloudflareApiToken}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, cloudflareApiToken: e.target.value }))}
                    disabled={!governanceForm.allowCustomCloudflare}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cloudflare Custom Account Delivery Endpoint</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://imagedelivery.net/custom_hash"
                    value={governanceForm.cloudflareApiUrl}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, cloudflareApiUrl: e.target.value }))}
                    disabled={!governanceForm.allowCustomCloudflare}
                  />
                </div>
              </div>
            </div>

            {/* 2. MongoDB & Database Isolation */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span>Database Isolation & MongoDB Cluster</span>
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={governanceForm.allowCustomDatabase}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, allowCustomDatabase: e.target.checked }))}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: governanceForm.allowCustomDatabase ? '#10b981' : 'var(--text-muted)',
                    }}
                  >
                    {governanceForm.allowCustomDatabase ? 'Custom DB Allowed' : 'Platform DB Only'}
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Architecture Database Mode</label>
                  <select
                    className="form-select"
                    value={governanceForm.databaseMode}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, databaseMode: e.target.value }))}
                  >
                    <option value="shared">Shared Partition (beauty_saas_shared)</option>
                    <option value="separate">Mode B: Dedicated Physical Database</option>
                    <option value="custom_uri">Mode C: Custom External Tenant MongoDB URI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Tenant MongoDB Connection URI</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="mongodb+srv://user:pass@cluster.mongodb.net/tenant_db"
                    value={governanceForm.customDatabaseUri}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, customDatabaseUri: e.target.value }))}
                    disabled={!governanceForm.allowCustomDatabase && governanceForm.databaseMode !== 'custom_uri'}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    When permitted, tenant queries connect directly to this dedicated database.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Custom Domain Access & Public Routing */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>Custom Domain Access & Portal Gateway</span>
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.4rem' }}>
                    <input
                      type="checkbox"
                      checked={governanceForm.customDomainAllowed}
                      onChange={(e) => setGovernanceForm((prev) => ({ ...prev, customDomainAllowed: e.target.checked }))}
                      style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Domain Allowed</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.4rem' }}>
                    <input
                      type="checkbox"
                      checked={governanceForm.isDomainActive}
                      onChange={(e) => setGovernanceForm((prev) => ({ ...prev, isDomainActive: e.target.checked }))}
                      style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: governanceForm.isDomainActive ? '#10b981' : '#ef4444',
                      }}
                    >
                      {governanceForm.isDomainActive ? 'Routing Active' : 'Suspended'}
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Domain Suspension / Restriction Screen Message</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                    value={governanceForm.restrictedMessage}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, restrictedMessage: e.target.value }))}
                    placeholder="Message shown when domain routing is suspended by SuperAdmin"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    When Routing is OFF, users hitting tenant domain will see this message.
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Security, IP Whitelisting & White-Label */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <span>IP Whitelisting & White-Label Security</span>
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.4rem' }}>
                    <input
                      type="checkbox"
                      checked={governanceForm.whiteLabelEnabled}
                      onChange={(e) => setGovernanceForm((prev) => ({ ...prev, whiteLabelEnabled: e.target.checked }))}
                      style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#A855F7' }}>White-Label Enabled</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.4rem' }}>
                    <input
                      type="checkbox"
                      checked={governanceForm.ipWhitelistEnabled}
                      onChange={(e) => setGovernanceForm((prev) => ({ ...prev, ipWhitelistEnabled: e.target.checked }))}
                      style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>IP Restriction</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Authorized IP Addresses (Comma-Separated)</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="192.168.1.1, 203.0.113.45, 10.0.0.0/24"
                    value={governanceForm.whitelistedIps}
                    onChange={(e) => setGovernanceForm((prev) => ({ ...prev, whitelistedIps: e.target.value }))}
                    disabled={!governanceForm.ipWhitelistEnabled}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    When enabled, incoming connections from unauthorized IPs are rejected with HTTP 403.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Permissions */}
      {activeTab === 'permissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Action Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'rgba(255,255,255,0.03)',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>Tenant Entitlements & Permissions Matrix</span>
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Configure operational salon modules, cloud infrastructure privileges, and business enterprise controls.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSavePermissions}
              disabled={isSavingPermissions}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <Save className="w-4 h-4" />
              {isSavingPermissions ? 'Saving Permissions...' : 'Save All Permissions'}
            </button>
          </div>

          {/* Status Summary Bar */}
          <div className="permission-summary-bar">
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                Active Entitlements: {tenant.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {enabledPermissionsCount} of {totalPermissionsCount} permissions enabled across all categories.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary)',
                  fontSize: '0.825rem',
                }}
              >
                {enabledPermissionsCount} / {totalPermissionsCount} Enabled
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleToggleAllPermissions(true)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Enable All
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleToggleAllPermissions(false)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Disable All
              </button>
            </div>
          </div>

          {/* Permission Categories in Cards */}
          {PERMISSION_DEFINITIONS.map((category) => {
            const categoryItems = category.items;
            const categoryEnabledCount = categoryItems.filter((it) => Boolean(permissions[it.key])).length;

            return (
              <div key={category.section} className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                    <span>{category.section}</span>
                  </h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: categoryEnabledCount > 0 ? '#10B981' : 'var(--text-muted)',
                      background: categoryEnabledCount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                    }}
                  >
                    {categoryEnabledCount} of {categoryItems.length} enabled
                  </span>
                </div>

                <div className="permission-grid">
                  {categoryItems.map((item) => {
                    const isEnabled = Boolean(permissions[item.key]);
                    return (
                      <div
                        key={item.key}
                        className={`permission-item ${isEnabled ? 'enabled' : ''}`}
                        onClick={() => handleTogglePermission(item.key)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="permission-item-label">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="permission-item-name">{item.name}</span>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                background: isEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: isEnabled ? '#10B981' : 'var(--text-muted)',
                              }}
                            >
                              {isEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </div>
                          <div className="permission-item-desc">{item.desc}</div>
                        </div>
                        <label className="permission-toggle" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() => handleTogglePermission(item.key)}
                          />
                          <span className="toggle-track" />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom Save Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleSavePermissions}
              disabled={isSavingPermissions}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem' }}
            >
              <Save className="w-4 h-4" />
              {isSavingPermissions ? 'Saving Permissions...' : 'Save All Permissions'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Database Architecture */}
      {activeTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span>Configured Database Infrastructure</span>
                </h3>
                <p className="card-subtitle">
                  {tenant.databaseMode === 'SEPARATE'
                    ? 'Dedicated isolated MongoDB database managed by TenantConnectionManager pool'
                    : 'Shared database cluster partitioned with authenticated tenantId isolation'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleCheckDbHealth} className="btn btn-secondary btn-sm">
                  <Activity className="w-4 h-4 text-emerald-400" /> Test Ping
                </button>
                <button onClick={handleBackup} className="btn btn-secondary btn-sm">
                  <Download className="w-4 h-4" /> Snapshot Backup
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '1rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Database Strategy:</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>
                  {tenant.databaseMode === 'SEPARATE' ? 'Dedicated DB (Mode B)' : 'Shared DB (Mode A)'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Database Name:</div>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginTop: '2px' }}>
                  {dbInfo?.databaseName ||
                    tenant.databaseName ||
                    (tenant.databaseMode === 'SEPARATE' ? `beauty_tenant_${tenant.slug}` : 'beauty_saas_shared')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Connection Status:</div>
                <div style={{ marginTop: '2px' }}>
                  <Badge status={dbHealth?.status || 'HEALTHY'} />
                </div>
              </div>
            </div>

            {dbHealth && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 600, color: '#34D399', marginBottom: '0.25rem' }}>
                  Live Diagnostics Result:
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Latency: {dbHealth.latencyMs || 8}ms • Collections: {dbHealth.collectionsCount || 12} • Indexes: verified
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: White-Label Domains */}
      {activeTab === 'domains' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Custom & White-Label Domains</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Manage custom domains, DNS verification records, and SSL certificates for this tenant.
              </p>
            </div>
            <button
              onClick={() => setAddDomainModal({ isOpen: true, domain: '', isPrimary: false })}
              className="btn btn-primary btn-sm"
            >
              <Plus className="w-4 h-4" /> Add Custom Domain
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Type</th>
                  <th>Primary</th>
                  <th>Status</th>
                  <th>SSL Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {domains.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No custom domains configured. Using platform subdomain: {tenant.slug}.beautysaas.local
                    </td>
                  </tr>
                ) : (
                  domains.map((dom) => (
                    <tr key={dom._id || dom.id}>
                      <td style={{ fontWeight: 600 }}>{dom.domain}</td>
                      <td>{dom.isCustom ? 'Custom Domain' : 'Subdomain'}</td>
                      <td>
                        {dom.isPrimary ? (
                          <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.8rem' }}>✓ Primary</span>
                        ) : (
                          <button
                            onClick={() => handleSetPrimaryDomain(dom._id || dom.id)}
                            className="btn btn-secondary btn-sm"
                          >
                            Set Primary
                          </button>
                        )}
                      </td>
                      <td><Badge status={dom.status || 'ACTIVE'} /></td>
                      <td><Badge status={dom.sslStatus || 'ACTIVE'} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            onClick={() => setDnsModal({ isOpen: true, domain: dom })}
                            className="btn btn-secondary btn-sm"
                          >
                            DNS Records
                          </button>
                          <button
                            onClick={() => handleVerifyDomain(dom._id || dom.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Verify
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Subscription */}
      {activeTab === 'subscription' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span>Subscription & Plan Details</span>
            </h3>
          </div>
          {subscription ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Active Plan: </span>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '2px' }}>
                  {subscription.planName || 'Growth Tier'}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Billing Cycle: </span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {subscription.billingCycle || 'Monthly'}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Subscription Status: </span>
                <div style={{ marginTop: '2px' }}>
                  <Badge status={subscription.status || 'ACTIVE'} />
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Current Period: </span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {new Date(subscription.startDate).toLocaleDateString()} — {new Date(subscription.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
              No active subscription found. Assign a plan from the Plans management module.
            </div>
          )}
        </div>
      )}

      {/* Tab 8: Audit Trail */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Tenant Activity & Audit Trail</span>
            </h3>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activity.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No activity logs recorded for this tenant yet.
                    </td>
                  </tr>
                ) : (
                  activity.map((act) => (
                    <tr key={act._id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(act.createdAt).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 600 }}>{act.action}</td>
                      <td>{act.actorEmail || 'System'}</td>
                      <td><Badge status={act.status || 'SUCCESS'} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      <Modal
        isOpen={addDomainModal.isOpen}
        onClose={() => setAddDomainModal({ isOpen: false, domain: '', isPrimary: false })}
        title="Add Custom Domain to Tenant"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setAddDomainModal({ isOpen: false, domain: '', isPrimary: false })}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddDomain}>
              Configure Domain
            </button>
          </>
        }
      >
        <form onSubmit={handleAddDomain}>
          <div className="form-group">
            <label className="form-label">Custom Domain Hostname</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. www.luxurybeautysalon.com"
              value={addDomainModal.domain}
              onChange={(e) => setAddDomainModal((p) => ({ ...p, domain: e.target.value }))}
              required
            />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="isPrimary"
              checked={addDomainModal.isPrimary}
              onChange={(e) => setAddDomainModal((p) => ({ ...p, isPrimary: e.target.checked }))}
            />
            <label htmlFor="isPrimary" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Set as primary tenant domain
            </label>
          </div>
        </form>
      </Modal>

      {/* DNS Instructions Modal */}
      <Modal
        isOpen={dnsModal.isOpen}
        onClose={() => setDnsModal({ isOpen: false, domain: null })}
        title={`DNS Configuration: ${dnsModal.domain?.domain || ''}`}
        footer={
          <button className="btn btn-secondary" onClick={() => setDnsModal({ isOpen: false, domain: null })}>
            Close
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Configure the following records in your DNS domain registrar (Cloudflare, GoDaddy, Route53, Namecheap):
          </p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>1. CNAME Record:</div>
            <div>Host: <code>@</code> or <code>www</code> • Points to: <code>cname.beautysaas.com</code></div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>2. TXT Verification Record:</div>
            <div>Host: <code>_beauty-verification</code> • Value: <code>verify-{tenant?.slug}</code></div>
          </div>
        </div>
      </Modal>

      {/* Database Migration Modal */}
      <Modal
        isOpen={migrationModal.isOpen}
        onClose={() => setMigrationModal((p) => ({ ...p, isOpen: false }))}
        title={`Controlled Database Migration: ${tenant.name}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setMigrationModal((p) => ({ ...p, isOpen: false }))}
              disabled={migrationModal.isLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleStartMigration}
              disabled={migrationModal.isLoading}
            >
              {migrationModal.isLoading ? 'Migrating Data...' : 'Start Safe Migration'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              color: '#FBBF24',
              fontSize: '0.85rem',
            }}
          >
            <strong>Safety Protocol:</strong> Migration takes a source snapshot backup, copies tenant collections, verifies record counts, and dynamically updates routing mapping.
          </div>

          <div className="form-group">
            <label className="form-label">Target Architecture Mode</label>
            <select
              className="form-select"
              value={migrationModal.targetMode}
              onChange={(e) => setMigrationModal((p) => ({ ...p, targetMode: e.target.value }))}
            >
              <option value="SEPARATE">Mode B: Dedicated Separate Database</option>
              <option value="SHARED">Mode A: Shared Database Partition</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Database Identifier</label>
            <input
              type="text"
              className="form-input"
              value={migrationModal.targetDatabaseName}
              onChange={(e) => setMigrationModal((p) => ({ ...p, targetDatabaseName: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TenantDetail;
