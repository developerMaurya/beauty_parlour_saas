/**
 * @file UnifiedAccessManagementCenter.jsx
 * @description Super Admin Unified Access & Management Center
 * Select Admin / Tenant to control:
 * - Overview & Logo Preview
 * - Domain & Subdomain Management (Custom domain edit/verify, platform subdomain allocation)
 * - Database Architecture & Live Diagnostics (Ping latency, Mode A vs Mode B switch, custom URI)
 * - Subscription, Renewal Expiry Alert & Payment Invoices
 * - Notifications & Multi-Channel Alerts (WhatsApp, SMS, Email, FCM Browser Push)
 * - Devices & FCM Tokens Management (Test push, sessions, revoke)
 * - Block & Security Center (Login, API, Device, IP, Domain, Notifications, Blacklist)
 * - Roles & Permissions (Allow/Deny matrix, module-wise toggles)
 * - Master Assignment (Hierarchy & Master Admin link)
 * - Live Activity & Telemetry Audit Trail
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  tenantsApi,
  plansApi,
  notificationsApi,
  databasesApi,
  domainsApi,
  billingApi,
  subscriptionsApi,
} from '../../../services/api/superadmin.api';
import { buildTenantUrl, PLATFORM_DOMAIN } from '../../../utils/tenantDomain';
import { useToast } from '../../../context/ToastContext';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import {
  Building2,
  User,
  Shield,
  Bell,
  MessageSquare,
  Smartphone,
  Ban,
  Lock,
  Layers,
  Database,
  Globe,
  Activity,
  CreditCard,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Send,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Users,
  Sliders,
  Check,
  X,
  Radio,
  FileText,
  Clock,
  Key,
  Edit2,
  ArrowRightLeft,
  Server,
  Receipt,
  Download,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Building2, desc: 'Profile, status, telemetry' },
  { id: 'branding', label: 'Domain & Subdomain', icon: Globe, desc: 'Custom domains & platform router' },
  { id: 'database', label: 'Database & Diagnostics', icon: Database, desc: 'Ping latency, Mode A/B & custom DB' },
  { id: 'subscription', label: 'Subscription & Invoices', icon: CreditCard, desc: 'Expiry alert, quotas & payments' },
  { id: 'notifications', label: 'Notifications Hub', icon: Bell, desc: 'Multi-channel dispatch & history' },
  { id: 'communication', label: 'WhatsApp / SMS / Email', icon: MessageSquare, desc: 'Direct message gateway' },
  { id: 'devices', label: 'Devices & FCM Tokens', icon: Smartphone, desc: 'Sessions, push tokens & revoke' },
  { id: 'security', label: 'Block & Security Center', icon: Ban, desc: 'Login, API, IP, Account lockout' },
  { id: 'permissions', label: 'Roles & Permissions', icon: Lock, desc: 'Fine-grained module access' },
  { id: 'master_assignment', label: 'Master Assignment', icon: Users, desc: 'Hierarchy & Master Admin link' },
  { id: 'logs', label: 'Live Activity & Telemetry', icon: Activity, desc: 'Audit log & API hit tracking' },
];

export const UnifiedAccessManagementCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTenantId = searchParams.get('tenantId') || '';
  const initialSection = searchParams.get('section') || 'overview';

  const { success, error, warning } = useToast();

  const [tenantsList, setTenantsList] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState(initialTenantId);
  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Selected Profile Data
  const [tenant, setTenant] = useState(null);
  const [devices, setDevices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [dbHealth, setDbHealth] = useState(null);
  const [tenantDomains, setTenantDomains] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Forms
  // 1. Notifications & Communication form
  const [msgForm, setMsgForm] = useState({
    channel: 'whatsapp',
    recipient: '',
    subject: '',
    message: '',
    isScheduled: false,
    scheduledAt: '',
  });

  // 2. Block & Security State
  const [securityForm, setSecurityForm] = useState({
    isBlocked: false,
    blockType: 'none',
    reason: '',
    isPermanent: true,
    autoUnblockDate: '',
  });

  // 3. Master Assignment State
  const [masterForm, setMasterForm] = useState({
    masterAdminName: '',
    masterAdminEmail: '',
    masterRole: 'Regional Master Director',
    notes: '',
  });

  // 4. Permissions Matrix
  const [permissions, setPermissions] = useState({
    appointments: true,
    customerManagement: true,
    staffManagement: true,
    inventory: false,
    financialReports: false,
    payroll: false,
    academyModule: false,
    marketing: false,
    customDomain: false,
    customCloudflare: false,
    customDatabase: false,
    ipWhitelist: false,
    multiBranch: false,
    apiAccess: false,
    webhooks: false,
    dataExport: true,
    whiteLabelBranding: true,
  });

  // 5. Domain / Subdomain State
  const [domainRoutingMode, setDomainRoutingMode] = useState('platform'); // 'platform' | 'custom'
  const [subdomainInput, setSubdomainInput] = useState('');
  const [basePlatformDomain, setBasePlatformDomain] = useState(PLATFORM_DOMAIN || 'kashiservice.com');
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [domainEditModal, setDomainEditModal] = useState({
    isOpen: false,
    domainId: '',
    domain: '',
    isPrimary: false,
    status: 'active',
    sslStatus: 'active',
    isCustom: false,
  });

  // 6. Database Custom Config State
  const [dbConfigForm, setDbConfigForm] = useState({
    databaseName: '',
    uri: '',
    allowCustomDatabase: false,
  });
  const [pingLoading, setPingLoading] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);

  // 7. Plan Assignment State
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlanToAssign, setSelectedPlanToAssign] = useState('');
  const [assignCycle, setAssignCycle] = useState('monthly');

  // 8. Admin Password Reset State
  const [adminResetPassword, setAdminResetPassword] = useState('Password@123');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Load all tenants & plans on mount
  useEffect(() => {
    const loadTenantsAndPlans = async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          tenantsApi.list({ limit: 100 }),
          plansApi.list({ limit: 50 }).catch(() => ({ data: { plans: [] } })),
        ]);
        const items = tRes.data?.tenants || tRes.data?.items || (Array.isArray(tRes.data) ? tRes.data : []);
        setTenantsList(items);
        if (items.length > 0 && !selectedTenantId) {
          setSelectedTenantId(items[0]._id || items[0].id);
        }

        const pItems = pRes.data?.plans || pRes.data?.items || (Array.isArray(pRes.data) ? pRes.data : []);
        setAvailablePlans(pItems);
        if (pItems.length > 0) {
          setSelectedPlanToAssign(pItems[0]._id || pItems[0].id);
        }
      } catch (err) {
        console.error('Failed to load tenants list', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTenantsAndPlans();
  }, []);

  // Fetch full details of selected tenant
  const loadTenantDetails = useCallback(async (tId) => {
    if (!tId) return;
    setIsLoading(true);
    try {
      const [tRes, devRes, notifRes, actRes, domRes, invRes] = await Promise.all([
        tenantsApi.get(tId).catch(() => ({ data: { tenant: null } })),
        tenantsApi.getDevices(tId).catch(() => ({ data: [] })),
        notificationsApi.getLogs({ limit: 20 }).catch(() => ({ data: { logs: [] } })),
        tenantsApi.getActivity(tId).catch(() => ({ data: [] })),
        domainsApi.getTenantDomains(tId).catch(() => ({ data: [] })),
        billingApi.getInvoices({ tenantId: tId, limit: 10 }).catch(() => ({ data: { items: [] } })),
      ]);

      const tData = tRes.data?.tenant || tRes.data;
      setTenant(tData);

      const devItems = Array.isArray(devRes.data) ? devRes.data : (devRes.data?.devices || []);
      setDevices(devItems);

      const notifItems = Array.isArray(notifRes.data) ? notifRes.data : (notifRes.data?.logs || notifRes.data?.items || []);
      setNotifications(notifItems);

      const acts = Array.isArray(actRes.data) ? actRes.data : (actRes.data?.activity || []);
      setActivityLogs(acts);

      const domItems = Array.isArray(domRes.data) ? domRes.data : (domRes.data?.domains || domRes.data?.items || []);
      setTenantDomains(domItems);

      const invItems = Array.isArray(invRes.data) ? invRes.data : (invRes.data?.invoices || invRes.data?.items || []);
      setInvoices(invItems);

      // Populate forms
      if (tData) {
        const hasCustom = Boolean(
          tData.primaryDomain &&
          !tData.primaryDomain.includes('kashiservice.com') &&
          !tData.primaryDomain.includes('yourplatform.com') &&
          !tData.primaryDomain.includes('localhost') &&
          !tData.primaryDomain.includes('127.0.0.1')
        );
        setDomainRoutingMode(hasCustom ? 'custom' : 'platform');
        setSubdomainInput(tData.subdomain || tData.slug || '');
        setCustomDomainInput(hasCustom ? tData.primaryDomain : '');

        setSecurityForm({
          isBlocked: Boolean(tData.blockSecurity?.isBlocked || tData.status === 'suspended'),
          blockType: tData.blockSecurity?.blockType || (tData.status === 'suspended' ? 'full_account' : 'none'),
          reason: tData.blockSecurity?.reason || tData.suspendedReason || '',
          isPermanent: tData.blockSecurity?.isPermanent !== undefined ? Boolean(tData.blockSecurity.isPermanent) : true,
          autoUnblockDate: tData.blockSecurity?.autoUnblockDate ? new Date(tData.blockSecurity.autoUnblockDate).toISOString().split('T')[0] : '',
        });

        setMasterForm({
          masterAdminName: tData.masterAdmin?.masterAdminName || '',
          masterAdminEmail: tData.masterAdmin?.masterAdminEmail || '',
          masterRole: tData.masterAdmin?.masterRole || 'Regional Master Director',
          notes: tData.masterAdmin?.notes || '',
        });

        if (tData.permissions) {
          setPermissions((prev) => ({ ...prev, ...tData.permissions }));
        }

        setMsgForm((prev) => ({
          ...prev,
          recipient: tData.phone || tData.email || '',
        }));

        setDbConfigForm({
          databaseName: tData.databaseConfig?.databaseName || (tData.databaseMode === 'separate' ? `beauty_tenant_${tData.slug}` : 'beauty_saas_shared'),
          uri: tData.databaseConfig?.uri || '',
          allowCustomDatabase: Boolean(tData.databaseConfig?.allowCustomDatabase),
        });
      }
    } catch (err) {
      error(err.message || 'Failed to load tenant profile');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (selectedTenantId) {
      loadTenantDetails(selectedTenantId);
      setSearchParams({ tenantId: selectedTenantId, section: selectedSection });
    }
  }, [selectedTenantId, selectedSection, loadTenantDetails, setSearchParams]);

  // Handlers
  const handleSelectSection = (secId) => {
    setSelectedSection(secId);
    setSearchParams({ tenantId: selectedTenantId, section: secId });
  };

  // 1. Dispatch Notification / Message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!msgForm.message.trim()) {
      error('Message text is required');
      return;
    }
    setIsSaving(true);
    try {
      await notificationsApi.send('custom', {
        channel: msgForm.channel,
        recipient: msgForm.recipient || tenant?.phone || tenant?.email,
        subject: msgForm.subject || `Message from Super Admin`,
        customMessage: msgForm.message,
        tenantId: tenant?._id,
      });
      success(`Direct message sent via ${msgForm.channel.toUpperCase()} successfully!`);
      setMsgForm((p) => ({ ...p, message: '', subject: '' }));
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to send message');
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Save Block & Security
  const handleSaveSecurity = async () => {
    setIsSaving(true);
    try {
      await tenantsApi.updateBlockSecurity(selectedTenantId, securityForm);
      success('Security policies, lockout rules, and block settings saved!');
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to save security settings');
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Save Master Assignment
  const handleSaveMasterAssignment = async () => {
    setIsSaving(true);
    try {
      await tenantsApi.updateMasterAssignment(selectedTenantId, masterForm);
      success('Master Admin / Manager assignment saved successfully!');
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to update master assignment');
    } finally {
      setIsSaving(false);
    }
  };

  // 3b. Reset Salon Admin Password
  const handleResetAdminPassword = async (e) => {
    e?.preventDefault();
    if (!adminResetPassword || adminResetPassword.length < 6) {
      error('Password must be at least 6 characters long');
      return;
    }
    setIsResettingPassword(true);
    try {
      const adminEmail = tenant?.email || '';
      await tenantsApi.resetAdminPassword(selectedTenantId, {
        newPassword: adminResetPassword,
        adminEmail,
      });
      success(`Admin login password updated successfully for ${adminEmail}!`);
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to update administrator password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  // 4. Save Permissions
  const handleSavePermissions = async () => {
    setIsSaving(true);
    try {
      await tenantsApi.updateGovernance(selectedTenantId, { permissions });
      success('Tenant roles and individual permissions updated successfully!');
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Test Push to Device
  const handleTestPush = async (deviceId) => {
    try {
      const res = await tenantsApi.sendTestPush(selectedTenantId, deviceId);
      success(res.message || 'Test push notification delivered to device!');
    } catch (err) {
      error(err.message || 'Failed to send test push');
    }
  };

  // 6. Revoke Device
  const handleRevokeDevice = async (deviceId) => {
    try {
      await tenantsApi.revokeDevice(selectedTenantId, deviceId);
      success('Device session terminated and FCM token revoked');
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to revoke device');
    }
  };

  // 7. Test DB Ping
  const handlePingDb = async () => {
    setPingLoading(true);
    try {
      const res = await databasesApi.checkTenantDbHealth(selectedTenantId);
      setDbHealth(res.data);
      success(`Database Ping OK: Status is ${res.data?.health?.status || 'HEALTHY'} (Latency: ${res.data?.health?.latencyMs !== undefined ? `${res.data.health.latencyMs}ms` : '< 5ms'})`);
    } catch (err) {
      error(err.message || 'Database ping test failed');
    } finally {
      setPingLoading(false);
    }
  };

  // 8. Switch Database Mode (Mode A <-> Mode B)
  const handleSwitchDbMode = async () => {
    const currentMode = tenant?.databaseMode || 'shared';
    const targetMode = currentMode === 'separate' ? 'shared' : 'separate';
    const targetDbName = targetMode === 'separate' ? `beauty_tenant_${tenant?.slug}` : 'beauty_saas_shared';

    setMigrationLoading(true);
    try {
      await databasesApi.migrateTenantDb(selectedTenantId, {
        targetMode,
        targetDatabaseName: targetDbName,
      });
      success(`Tenant database migrated to ${targetMode.toUpperCase()} mode successfully!`);
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Database migration failed');
    } finally {
      setMigrationLoading(false);
    }
  };

  // 9. Save Custom DB Config
  const handleSaveDbConfig = async () => {
    setIsSaving(true);
    try {
      await tenantsApi.update(selectedTenantId, {
        databaseConfig: {
          databaseName: dbConfigForm.databaseName,
          uri: dbConfigForm.uri,
          allowCustomDatabase: dbConfigForm.allowCustomDatabase,
        },
      });
      success('Database target connection parameters updated!');
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to update database config');
    } finally {
      setIsSaving(false);
    }
  };

  // 10. Reconnect Database
  const handleReconnectDb = async () => {
    try {
      await databasesApi.reconnectTenantDb(selectedTenantId);
      success('Tenant connection pool refreshed and reconnected!');
      handlePingDb();
    } catch (err) {
      error(err.message || 'Failed to reconnect database');
    }
  };

  // 11. Trigger Backup
  const handleBackupDb = async () => {
    try {
      const res = await databasesApi.backupTenantDb(selectedTenantId);
      success(res.message || 'Database backup snapshot generated successfully!');
    } catch (err) {
      error(err.message || 'Failed to backup database');
    }
  };

  // 11b. Quick Assign Plan from Center
  const handleQuickAssignPlan = async (e) => {
    e?.preventDefault();
    if (!selectedPlanToAssign) return;
    setIsSaving(true);
    const chosenPlan = availablePlans.find((p) => (p._id || p.id) === selectedPlanToAssign);
    try {
      await subscriptionsApi.create({
        tenantId: selectedTenantId,
        planId: selectedPlanToAssign,
        billingCycle: assignCycle,
        durationDays: assignCycle === 'yearly' ? 365 : assignCycle === 'lifetime' ? 3650 : 30,
      });
      // Instant optimistic state reflection
      setTenant((prev) => ({ ...prev, planId: chosenPlan, status: 'active' }));
      success(`Plan "${chosenPlan?.name || 'Selected Plan'}" assigned to ${tenant?.name}!`);
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to assign plan');
    } finally {
      setIsSaving(false);
    }
  };

  // 12. Save Platform Subdomain
  // 12. Save Platform Subdomain
  const handleSaveSubdomain = async () => {
    if (!subdomainInput.trim()) return;
    setIsSaving(true);
    try {
      const cleanSub = subdomainInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      const cleanBase = (basePlatformDomain || PLATFORM_DOMAIN || 'kashiservice.com').trim().toLowerCase().replace(/^\./, '');
      const fullDomain = `${cleanSub}.${cleanBase}`;

      await domainsApi.addTenantDomain(selectedTenantId, {
        domain: fullDomain,
        isPrimary: true,
        isCustom: false,
      });

      await tenantsApi.update(selectedTenantId, {
        subdomain: cleanSub,
        primaryDomain: fullDomain,
        'domainAccess.customDomainAllowed': false,
        'domainAccess.isDomainActive': true,
      });

      success(`Platform subdomain activated as active routing target: ${fullDomain}`);
      await loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to update subdomain');
    } finally {
      setIsSaving(false);
    }
  };

  // 13. Add Custom Domain
  const handleAddCustomDomain = async () => {
    if (!customDomainInput.trim()) return;
    setIsSaving(true);
    try {
      const cleanDom = customDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
      await domainsApi.addTenantDomain(selectedTenantId, {
        domain: cleanDom,
        isPrimary: true,
        isCustom: true,
      });

      await tenantsApi.update(selectedTenantId, {
        primaryDomain: cleanDom,
        'domainAccess.customDomainAllowed': true,
        'domainAccess.isDomainActive': true,
      });

      success(`Custom domain "${cleanDom}" registered & activated as active tenant website domain!`);
      await loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to register domain');
    } finally {
      setIsSaving(false);
    }
  };

  // 14. Verify Domain
  const handleVerifyDomain = async (domainId) => {
    try {
      const res = await domainsApi.verify(domainId);
      success('Domain ownership & DNS verified successfully!');
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Domain verification failed');
    }
  };

  // 15. Set Primary Domain
  const handleSetPrimaryDomain = async (domainId) => {
    try {
      await domainsApi.setPrimary(domainId);
      success('Domain set as primary portal routing target!');
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to set primary domain');
    }
  };

  // 16. Delete Domain
  const handleDeleteDomain = async (domainId, domainName) => {
    if (!window.confirm(`Are you sure you want to remove domain "${domainName || domainId}"? The tenant will revert to the default platform subdomain.`)) {
      return;
    }
    try {
      setIsSaving(true);
      await domainsApi.delete(domainId || domainName);
      success('Domain removed successfully. Reverted to platform default subdomain.');
      await loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to delete domain');
    } finally {
      setIsSaving(false);
    }
  };

  // 17. Save Domain Edit
  const handleSaveDomainEdit = async (e) => {
    e.preventDefault();
    if (!domainEditModal.domain.trim()) return;
    setIsSaving(true);
    try {
      await domainsApi.update(domainEditModal.domainId, {
        domain: domainEditModal.domain.trim().toLowerCase(),
        isPrimary: domainEditModal.isPrimary,
        status: domainEditModal.status,
        sslStatus: domainEditModal.sslStatus,
        isCustom: domainEditModal.isCustom,
      });
      success('Domain updated successfully!');
      setDomainEditModal((p) => ({ ...p, isOpen: false }));
      loadTenantDetails(selectedTenantId);
    } catch (err) {
      error(err.message || 'Failed to update domain');
    } finally {
      setIsSaving(false);
    }
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

  // Subscription Expiry Calculation
  const subExpiresAt = tenant?.subscriptionId?.currentPeriodEnd || tenant?.trialExpiresAt;
  const daysUntilExpiry = subExpiresAt
    ? Math.ceil((new Date(subExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ─────────────────────────────────────────────────────────────
          PAGE HEADER & TENANT SELECTOR
          ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield className="w-6 h-6 text-indigo-400" />
            <span>Unified Tenant Control Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            One single pane of glass: Multi-DB diagnostics, domains & subdomains, fine-grained access, security lockout, and billing.
          </p>
        </div>

        {/* Global Tenant Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Selected Tenant:</span>
          <select
            className="form-select"
            style={{ minWidth: '240px', fontWeight: 600 }}
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
          >
            {tenantsList.map((t) => (
              <option key={t._id || t.id} value={t._id || t.id}>
                {t.name} ({t.slug})
              </option>
            ))}
          </select>

          <Link
            to={`/superadmin/tenants/${selectedTenantId}`}
            className="btn btn-secondary btn-sm"
            title="Open Classical Tenant View"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Profile Page</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TWO-PANE LAYOUT: LEFT SIDEBAR + RIGHT DETAIL PANEL
          ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* ══════════════════════════════════════════════════════════════
            LEFT COLUMN: PROFILE TELEMETRY & SECTION NAVIGATION
            ══════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tenant Identity Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {/* Tenant Logo or Styled Initial Avatar */}
              {tenant?.branding?.logoUrl ? (
                <img
                  src={tenant.branding.logoUrl}
                  alt={tenant.name}
                  style={{
                    width: '3.75rem',
                    height: '3.75rem',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div
                  style={{
                    width: '3.75rem',
                    height: '3.75rem',
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
                  {tenant?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
              )}

              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {tenant?.name || 'Loading...'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  slug: {tenant?.slug}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <Badge status={tenant?.status || 'ACTIVE'} />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: tenant?.databaseMode === 'separate' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: tenant?.databaseMode === 'separate' ? '#C084FC' : '#34D399',
                      fontWeight: 700,
                    }}
                  >
                    {tenant?.databaseMode === 'separate' ? 'Separate DB' : 'Shared DB'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {Object.values(permissions).filter(Boolean).length}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Permissions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38BDF8' }}>
                  {devices.length}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Devices</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: tenantDomains.length > 0 ? '#34D399' : 'var(--text-muted)' }}>
                  {tenantDomains.length}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Domains</div>
              </div>
            </div>

            {/* Expiry Warning in Left Card if expiring within 30 days */}
            {daysUntilExpiry !== null && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: daysUntilExpiry <= 7 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${daysUntilExpiry <= 7 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: daysUntilExpiry <= 7 ? '#EF4444' : '#F59E0B',
                  fontWeight: 600,
                }}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {daysUntilExpiry <= 0
                    ? 'Subscription Expired'
                    : `Renews/Expires in ${daysUntilExpiry} days`}
                </span>
              </div>
            )}
          </div>

          {/* Section Navigation Tabs */}
          <div className="card" style={{ padding: '0.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem 0.75rem 0.25rem' }}>
              Management Controls
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = selectedSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      background: isActive ? 'var(--primary-gradient)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                      <div>
                        <div style={{ fontSize: '0.85rem' }}>{sec.label}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-muted'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT COLUMN: ACTIVE MANAGEMENT PANEL
            ══════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* ══════════════════════════════════════════════════════════════
              SECTION 1: OVERVIEW
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'overview' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Tenant Telemetry & Executive Profile</h3>
                  <p className="card-subtitle">Comprehensive cloud infrastructure, owner contact, and current lifecycle state</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Owner Name</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{tenant?.ownerName || 'Not configured'}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Email: {tenant?.email} • Phone: {tenant?.phone || 'N/A'}
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Industry Vertical & Plan</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px', textTransform: 'capitalize' }}>
                    {tenant?.businessType || 'Beauty Salon & Spa'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Plan: <strong>{tenant?.planId?.name || 'Growth Plan'}</strong> • DB: {tenant?.databaseMode?.toUpperCase() || 'SHARED'}
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary Routing Target</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px', color: 'var(--primary)' }}>
                    https://{tenant?.primaryDomain || `${tenant?.slug}.kashiservice.com`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Subdomain slug: <code>{tenant?.subdomain || tenant?.slug}</code>
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Master Admin Assignment</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>
                    {tenant?.masterAdmin?.masterAdminName || 'Direct Superadmin Care'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Role: {tenant?.masterAdmin?.masterRole || 'Unassigned'}
                  </div>
                </div>
              </div>

              {/* Resource Quotas */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Platform Quotas & Limits
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max Staff</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tenant?.limits?.maxStaff || 10}</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max Branches</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tenant?.limits?.maxBranches || 2}</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Monthly Appts</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tenant?.limits?.maxAppointmentsMonthly || 500}</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Storage Quota</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tenant?.limits?.storageMb || 2048} MB</div>
                  </div>
                </div>
              </div>

              {/* Salon Administrator Credentials & Direct Launch Control */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Key className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Salon Administrator Login & Security Control</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        Manage administrator password and launch direct salon workspace
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={
                        typeof window !== 'undefined' && window.location.hostname.includes('localhost')
                          ? `http://${tenant?.subdomain || tenant?.slug}.localhost:${window.location.port || 3000}/admin/login`
                          : `/admin/login`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch Salon Admin Portal (/admin/login) ↗</span>
                    </a>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Administrator Login Email
                    </label>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc', padding: '0.55rem 0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                      {tenant?.email || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Reset Admin Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setAdminResetPassword(`Admin@${Math.floor(1000 + Math.random() * 9000)}`)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                      >
                        Generate Random
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <input
                          type={showAdminPassword ? 'text' : 'password'}
                          className="form-input"
                          value={adminResetPassword}
                          onChange={(e) => setAdminResetPassword(e.target.value)}
                          placeholder="New admin password"
                          style={{ paddingRight: '2.5rem', height: '38px', fontSize: '0.85rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetAdminPassword}
                        disabled={isResettingPassword}
                        className="btn btn-sm btn-primary"
                        style={{ height: '38px', whiteSpace: 'nowrap' }}
                      >
                        {isResettingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2: DOMAIN & SUBDOMAIN MANAGEMENT
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'branding' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <span>Domain & Platform Routing Center</span>
                  </h3>
                  <p className="card-subtitle">
                    Select domain strategy: Deploy on instant Platform Subdomain or connect Salon's Custom Branded Domain.
                  </p>
                </div>
              </div>

              {/* ── Domain Strategy Toggle Switcher (Option A vs Option B) ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                {/* Option A Toggle Button */}
                <button
                  type="button"
                  onClick={() => setDomainRoutingMode('platform')}
                  style={{
                    padding: '1.15rem 1.25rem',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: domainRoutingMode === 'platform' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                    background: domainRoutingMode === 'platform' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: domainRoutingMode === 'platform' ? '#10b981' : 'rgba(255,255,255,0.06)',
                          color: domainRoutingMode === 'platform' ? '#fff' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                        }}
                      >
                        A
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: domainRoutingMode === 'platform' ? '#34d399' : 'var(--text-main)' }}>
                          Platform Subdomain
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wildcard Host (.kashiservice.com)</div>
                      </div>
                    </div>
                    {domainRoutingMode === 'platform' ? (
                      <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: '#10b981', color: '#fff', fontWeight: 800, letterSpacing: '0.04em' }}>
                        SELECTED
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        SWITCH
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.65rem', lineHeight: '1.4' }}>
                    Instant zero-config routing. Ideal for rapid onboarding, trial testing, or platform-hosted salons.
                  </div>
                </button>

                {/* Option B Toggle Button */}
                <button
                  type="button"
                  onClick={() => setDomainRoutingMode('custom')}
                  style={{
                    padding: '1.15rem 1.25rem',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: domainRoutingMode === 'custom' ? '2px solid #6366f1' : '1px solid var(--border-subtle)',
                    background: domainRoutingMode === 'custom' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: domainRoutingMode === 'custom' ? '#6366f1' : 'rgba(255,255,255,0.06)',
                          color: domainRoutingMode === 'custom' ? '#fff' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                        }}
                      >
                        B
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: domainRoutingMode === 'custom' ? '#818cf8' : 'var(--text-main)' }}>
                          Custom Salon Domain
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Own White-Label (.com / .in)</div>
                      </div>
                    </div>
                    {domainRoutingMode === 'custom' ? (
                      <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: '#6366f1', color: '#fff', fontWeight: 800, letterSpacing: '0.04em' }}>
                        SELECTED
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        SWITCH
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.65rem', lineHeight: '1.4' }}>
                    Connect parlour's own private web domain (e.g. <code>www.glamourbeauty.com</code>) with automated TLS/SSL.
                  </div>
                </button>
              </div>

              {/* ── PANEL 1: PLATFORM SUBDOMAIN CONFIGURATION (When Mode === 'platform') ── */}
              {domainRoutingMode === 'platform' && (
                <div style={{ padding: '1.35rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)', marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles className="w-4 h-4" />
                        <span>Platform Subdomain (Option A - Zero-Config)</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        Enter the parlour subdomain prefix. Super Admin can also modify the base platform domain if required.
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                      ⚡ Wildcard Ready
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {/* Subdomain Input */}
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Tenant Subdomain Slug
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={subdomainInput}
                        onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="e.g. glamour-academy"
                      />
                    </div>

                    {/* Base Domain Input (Editable by Super Admin) */}
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Platform Base Domain (Editable)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ padding: '0.5rem 0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRight: 'none', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', color: 'var(--text-muted)', fontWeight: 700 }}>
                          .
                        </span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                          value={basePlatformDomain}
                          onChange={(e) => setBasePlatformDomain(e.target.value.toLowerCase().replace(/^\./, ''))}
                          placeholder="kashiservice.com"
                        />
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div style={{ alignSelf: 'flex-end' }}>
                      <button
                        onClick={handleSaveSubdomain}
                        disabled={isSaving || !subdomainInput.trim()}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', height: '42px', padding: '0 1.25rem' }}
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Applying...' : 'Apply Subdomain'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Resolved URL Banner */}
                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>
                        Resolved Target Endpoint (Click to Open)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#f8fafc', fontWeight: 600 }}>
                          {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.localhost'))
                            ? `http://${subdomainInput || tenant?.slug || 'glamour-academy'}.localhost:${window.location.port || '3002'}/`
                            : `https://${subdomainInput || tenant?.slug || 'glamour-academy'}.${(basePlatformDomain || 'kashiservice.com').replace(/^\./, '')}/`}
                        </span>
                        <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                          Direct Clean Root (No /public)
                        </span>
                      </div>
                    </div>

                    <a
                      href={buildTenantUrl({ ...tenant, slug: subdomainInput || tenant?.slug, subdomain: subdomainInput || tenant?.slug }, 'public')}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm"
                      style={{ background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Visit Live Website</span>
                    </a>
                  </div>
                </div>
              )}

              {/* ── PANEL 2: CUSTOM WHITE-LABEL DOMAIN CONFIGURATION (When Mode === 'custom') ── */}
              {domainRoutingMode === 'custom' && (
                <div style={{ padding: '1.35rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.25)', marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe className="w-4 h-4" />
                        <span>Custom White-Label Domain (Option B - Branded Domain)</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        Enter parlour's official domain. All client portals and the public storefront will serve directly on this host.
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700 }}>
                      👑 100% White-Label
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Custom Domain Hostname (e.g. www.glamourbeauty.com)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. www.glamourbeauty.com or glamourbeauty.com"
                        value={customDomainInput}
                        onChange={(e) => setCustomDomainInput(e.target.value.toLowerCase().trim())}
                      />
                    </div>
                    <button
                      onClick={handleAddCustomDomain}
                      disabled={isSaving || !customDomainInput.trim()}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', height: '42px', padding: '0 1.25rem' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSaving ? 'Registering...' : 'Save & Activate Domain'}</span>
                    </button>
                  </div>

                  {/* DNS Instructions Card */}
                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.04)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                      Required DNS Configuration for Tenant Domain Registrar
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.7)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CNAME Record</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary, #0f172a)', fontWeight: 700, marginTop: '2px' }}>
                          www ➔ cname.kashiservice.com
                        </div>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.7)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>A Record (Apex Host)</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary, #0f172a)', fontWeight: 700, marginTop: '2px' }}>
                          @ ➔ 76.76.21.21
                        </div>
                      </div>
                      <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.7)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SSL / TLS Encryption</div>
                        <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                          ● Automated Let's Encrypt TLS 1.3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Active Domains Table (Single Active Domain per Tenant) ── */}
              <div style={{ marginTop: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                    Active Portal Routing Target ({tenantDomains.length})
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Only 1 active domain strategy allowed per tenant
                  </span>
                </div>

                {tenantDomains.length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-surface, #ffffff)', borderRadius: '10px', border: '1px dashed var(--border-subtle)' }}>
                    No custom domains added yet. Use the toggle above to configure a Platform Subdomain or connect a Custom White-Label Domain.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {tenantDomains.map((dom) => {
                      const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.localhost'));
                      const visitUrl = isLocalDev
                        ? buildTenantUrl({ ...tenant, slug: tenant?.slug || dom.domain.split('.')[0] }, 'public')
                        : `https://${dom.domain}/`;

                      return (
                        <div
                          key={dom._id || dom.domain}
                          style={{
                            padding: '1.15rem 1.25rem',
                            background: 'var(--bg-surface, #ffffff)',
                            borderRadius: '10px',
                            border: '1px solid var(--border-subtle, #e2e8f0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                background: dom.isCustom ? 'rgba(99, 102, 241, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Globe className={`w-5 h-5 ${dom.isCustom ? 'text-indigo-600' : 'text-emerald-600'}`} />
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary, #0f172a)', fontFamily: 'monospace' }}>
                                  {dom.domain}
                                </span>
                                {dom.isPrimary && (
                                  <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(99,102,241,0.15)', color: '#4f46e5', fontWeight: 800 }}>
                                    ★ ACTIVE PRIMARY
                                  </span>
                                )}
                                <Badge status={dom.status === 'verified' || dom.status === 'active' ? 'ACTIVE' : 'WARNING'} text={dom.status?.toUpperCase() || 'ACTIVE'} />
                                <Badge status={dom.sslStatus === 'active' ? 'ACTIVE' : 'WARNING'} text={dom.sslStatus === 'active' ? 'TLS 1.3 Active' : 'SSL Provisioning'} />
                              </div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Strategy: <strong style={{ color: dom.isCustom ? '#4f46e5' : '#059669' }}>{dom.isCustom ? 'Custom White-Label' : 'Platform Subdomain'}</strong>
                                {isLocalDev && <span> &bull; Local route: <code style={{ color: 'var(--text-main, #334155)', fontWeight: 600 }}>{tenant?.slug}.localhost:3002</code></span>}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {dom.status !== 'verified' && dom.status !== 'active' && (
                              <button
                                onClick={() => handleVerifyDomain(dom._id || dom.id)}
                                className="btn btn-primary btn-sm"
                                title="Verify DNS ownership"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verify DNS</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setDomainEditModal({
                                  isOpen: true,
                                  domainId: dom._id || dom.id,
                                  domain: dom.domain,
                                  isPrimary: Boolean(dom.isPrimary),
                                  status: dom.status || 'active',
                                  sslStatus: dom.sslStatus || 'active',
                                  isCustom: Boolean(dom.isCustom),
                                });
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Edit Domain Hostname & Status"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {dom.isCustom && isLocalDev && (
                              <a
                                href={`http://${tenant?.slug || 'salon'}.localhost:${window.location.port || '3002'}/`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-secondary btn-sm"
                                title="Test portal locally on localhost loopback"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4f46e5', fontWeight: 600 }}
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Local Dev Preview</span>
                              </a>
                            )}

                            <a
                              href={dom.isCustom ? (dom.domain.startsWith('http') ? dom.domain : `https://${dom.domain}/`) : visitUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              title="Visit live website on this domain"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Visit Domain</span>
                            </a>

                            <button
                              onClick={() => handleDeleteDomain(dom._id || dom.id, dom.domain)}
                              className="btn btn-outline-danger btn-sm"
                              title="Delete and reset to default platform subdomain"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 3: DATABASE ARCHITECTURE & LIVE DIAGNOSTICS
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'database' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span>Database Architecture & Live Diagnostics</span>
                  </h3>
                  <p className="card-subtitle">Cluster isolation mode, connection string targets, and ping latency</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handlePingDb} disabled={pingLoading} className="btn btn-secondary btn-sm">
                    <Activity className={`w-3.5 h-3.5 ${pingLoading ? 'animate-spin' : 'text-emerald-400'}`} />
                    <span>{pingLoading ? 'Pinging...' : 'Test Ping Connection'}</span>
                  </button>
                  <button onClick={handleReconnectDb} className="btn btn-secondary btn-sm" title="Reconnect database pool">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reconnect</span>
                  </button>
                  <button onClick={handleBackupDb} className="btn btn-secondary btn-sm" title="Trigger manual backup snapshot">
                    <Download className="w-3.5 h-3.5" />
                    <span>Backup DB</span>
                  </button>
                </div>
              </div>

              {/* Live Status Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Deployment Strategy</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginTop: '2px', color: tenant?.databaseMode === 'separate' ? '#C084FC' : '#34D399' }}>
                    {tenant?.databaseMode === 'separate' ? 'Dedicated Isolated DB (Mode B)' : 'Shared Partition (Mode A)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {tenant?.databaseMode === 'separate'
                      ? 'Tenant records isolated in dedicated MongoDB database'
                      : 'Tenant partition filtered by tenantId index'}
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Database Identifier</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--primary)', marginTop: '2px' }}>
                    {tenant?.databaseConfig?.databaseName || (tenant?.databaseMode === 'separate' ? `beauty_tenant_${tenant?.slug}` : 'beauty_saas_shared')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Cluster: Atlas Production (Port 27017)
                  </div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live Health & Latency</div>
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge status={dbHealth?.status === 'error' ? 'DANGER' : 'HEALTHY'} text="Cluster Live" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34D399' }}>
                      {dbHealth?.health?.latencyMs !== undefined ? `${dbHealth.health.latencyMs}ms latency` : '< 5ms latency'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    ReadyState: 1 (Connected)
                  </div>
                </div>
              </div>

              {/* Mode Switcher Banner */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.06)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    Switch Multi-DB Architecture Mode
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Current Mode: <strong>{tenant?.databaseMode?.toUpperCase() || 'SHARED'}</strong>. You can migrate this tenant between Shared and Dedicated databases without data loss.
                  </div>
                </div>

                <button
                  onClick={handleSwitchDbMode}
                  disabled={migrationLoading}
                  className="btn btn-primary"
                >
                  <ArrowRightLeft className={`w-4 h-4 ${migrationLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {migrationLoading
                      ? 'Migrating Data...'
                      : tenant?.databaseMode === 'separate'
                      ? 'Switch to Shared Partition (Mode A)'
                      : 'Switch to Dedicated DB (Mode B)'}
                  </span>
                </button>
              </div>

              {/* Custom Connection String Settings */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Target Database Parameters
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Database Target Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={dbConfigForm.databaseName}
                      onChange={(e) => setDbConfigForm((p) => ({ ...p, databaseName: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Custom Connection URI (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="mongodb+srv://user:pass@tenant-cluster.mongodb.net/..."
                      value={dbConfigForm.uri}
                      onChange={(e) => setDbConfigForm((p) => ({ ...p, uri: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={handleSaveDbConfig} disabled={isSaving} className="btn btn-secondary btn-sm">
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Connection Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 4: SUBSCRIPTION & INVOICES
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'subscription' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <span>Subscription, Renewal Expiry & Invoices</span>
                  </h3>
                  <p className="card-subtitle">Monitor tenant subscription validity, expiring dates, and past payment receipts</p>
                </div>
              </div>

              {/* Expiry Banner */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  background: daysUntilExpiry <= 7 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.08)',
                  border: `1px solid ${daysUntilExpiry <= 7 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.25)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: daysUntilExpiry <= 7 ? '#EF4444' : 'var(--text-primary)' }}>
                    Plan Validity Status: {daysUntilExpiry <= 0 ? 'EXPIRED' : `${daysUntilExpiry} Days Remaining`}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Active Plan: <strong>{tenant?.planId?.name || 'Enterprise Salon Plan'}</strong> • Renewal Date: {subExpiresAt ? new Date(subExpiresAt).toLocaleDateString() : 'Active Ongoing'}
                  </div>
                </div>

                <Link to="/superadmin/plans" className="btn btn-secondary btn-sm">
                  <span>View All Plans</span>
                </Link>
              </div>

              {/* Instant Plan Assignment Form */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Assign / Change Tenant Subscription Plan</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: '0.75rem', alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Target Plan</label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedPlanToAssign}
                      onChange={(e) => setSelectedPlanToAssign(e.target.value)}
                    >
                      {availablePlans.map((p) => (
                        <option key={p._id || p.id} value={p._id || p.id}>
                          {p.name} — ₹{p.priceMonthly}/mo (Max Staff: {p.limits?.maxStaff || 10}, Branches: {p.limits?.maxBranches || 2})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Billing Interval</label>
                    <select
                      className="form-select form-select-sm"
                      value={assignCycle}
                      onChange={(e) => setAssignCycle(e.target.value)}
                    >
                      <option value="monthly">Monthly Cycle (30 days)</option>
                      <option value="yearly">Annual Cycle (365 days)</option>
                      <option value="lifetime">Lifetime Access</option>
                    </select>
                  </div>

                  <button
                    onClick={handleQuickAssignPlan}
                    disabled={isSaving || !selectedPlanToAssign}
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap', height: '36px' }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Assigning...' : 'Assign & Activate Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Invoices List for this Tenant */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Tenant Payment & Invoices History ({invoices.length})
                </h4>

                {invoices.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
                    No payment invoices recorded for this tenant yet.
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Date</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv) => (
                          <tr key={inv._id || inv.invoiceNumber}>
                            <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                            <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td style={{ fontWeight: 700 }}>₹{(inv.totalAmount || inv.amount || 0).toLocaleString()}</td>
                            <td>
                              <Badge status={inv.status === 'paid' ? 'ACTIVE' : 'WARNING'} text={inv.status?.toUpperCase() || 'PAID'} />
                            </td>
                            <td>
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}>
                                Download Receipt
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 5: NOTIFICATIONS & COMMUNICATION
              ══════════════════════════════════════════════════════════════ */}
          {(selectedSection === 'notifications' || selectedSection === 'communication') && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                    <span>Direct Communication & Alerts Dispatch</span>
                  </h3>
                  <p className="card-subtitle">Send WhatsApp messages, SMS, emails, or in-app notifications directly to this salon administrator</p>
                </div>
              </div>

              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                    { id: 'sms', label: 'SMS Gateway', icon: Smartphone },
                    { id: 'email', label: 'Official Email', icon: FileText },
                    { id: 'in_app', label: 'In-App Alert', icon: Bell },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setMsgForm((p) => ({ ...p, channel: ch.id }))}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: `1px solid ${msgForm.channel === ch.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: msgForm.channel === ch.id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                        color: msgForm.channel === ch.id ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: msgForm.channel === ch.id ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <ch.icon className="w-4 h-4" />
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Recipient Phone / Email</label>
                  <input
                    type="text"
                    className="form-input"
                    value={msgForm.recipient}
                    onChange={(e) => setMsgForm((p) => ({ ...p, recipient: e.target.value }))}
                    placeholder="Tenant contact"
                  />
                </div>

                {msgForm.channel === 'email' && (
                  <div className="form-group">
                    <label className="form-label">Email Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      value={msgForm.subject}
                      onChange={(e) => setMsgForm((p) => ({ ...p, subject: e.target.value }))}
                      placeholder="e.g. Important notice regarding your subscription"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Message Content</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    value={msgForm.message}
                    onChange={(e) => setMsgForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Type the message to dispatch..."
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" disabled={isSaving} className="btn btn-primary">
                    <Send className="w-4 h-4" />
                    <span>{isSaving ? 'Sending...' : 'Dispatch Message'}</span>
                  </button>
                </div>
              </form>

              {/* Notification History */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Recent Notifications Dispatched
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {notifications.slice(0, 5).map((n, i) => (
                    <div
                      key={n._id || i}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{n.subject || n.title || 'Platform Notification'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.message || n.body}</div>
                      </div>
                      <Badge status="ACTIVE" text={n.channel?.toUpperCase() || 'SMS'} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 6: DEVICES & FCM TOKENS
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'devices' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    <span>Registered Devices & Push Token Management</span>
                  </h3>
                  <p className="card-subtitle">Active app/browser sessions with Firebase Cloud Messaging (FCM) credentials</p>
                </div>
                <span className="brand-badge" style={{ fontSize: '0.72rem' }}>{devices.length} Active Devices</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {devices.map((dev) => (
                  <div
                    key={dev.deviceId}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          borderRadius: '10px',
                          background: 'rgba(99,102,241,0.12)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{dev.deviceName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          OS: <strong>{dev.os}</strong> • Browser: {dev.browser} • Version: {dev.appVersion}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#38BDF8', marginTop: '2px' }}>
                          FCM Token: {dev.fcmToken?.slice(0, 28)}...
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleTestPush(dev.deviceId)}
                        className="btn btn-secondary btn-sm"
                        title="Dispatch test push notification"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>Send Test Push</span>
                      </button>
                      <button
                        onClick={() => handleRevokeDevice(dev.deviceId)}
                        className="btn btn-outline-danger btn-sm"
                        title="Logout device and revoke token"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 7: BLOCK & SECURITY CENTER
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'security' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Ban className="w-5 h-5 text-rose-500" />
                    <span>Block & Security Control Center</span>
                  </h3>
                  <p className="card-subtitle">Granular restriction matrix: Block login, disable API access, or apply suspension</p>
                </div>
                <button onClick={handleSaveSecurity} disabled={isSaving} className="btn btn-primary btn-sm">
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Security Rules'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    background: securityForm.isBlocked ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.08)',
                    border: `1px solid ${securityForm.isBlocked ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: securityForm.isBlocked ? '#EF4444' : '#10B981' }}>
                      {securityForm.isBlocked ? 'ACCESS STRICTLY BLOCKED' : 'ACCESS UNRESTRICTED & ACTIVE'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {securityForm.isBlocked
                        ? 'Enforcing security block policy across platform gateways'
                        : 'Business has full normal operational privileges'}
                    </div>
                  </div>

                  <label className="permission-toggle">
                    <input
                      type="checkbox"
                      checked={securityForm.isBlocked}
                      onChange={(e) => setSecurityForm((p) => ({ ...p, isBlocked: e.target.checked }))}
                    />
                    <span className="toggle-track" />
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Restriction Scope / Block Mode</label>
                  <select
                    className="form-select"
                    value={securityForm.blockType}
                    onChange={(e) => setSecurityForm((p) => ({ ...p, blockType: e.target.value }))}
                  >
                    <option value="none">None (Standard Operation)</option>
                    <option value="login_only">Block Login (Portal Disallowed)</option>
                    <option value="api_only">Block API Access (Keys Disabled)</option>
                    <option value="notifications_only">Block Notifications (SMS/WhatsApp Muted)</option>
                    <option value="full_account">Suspend Account (Complete Operational Halt)</option>
                    <option value="blacklist">Blacklist (Permanent Violation Hold)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Block Reason / Administrative Memo</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    placeholder="Enter reason e.g. Overdue invoice, suspicious IP activity, or terms violation"
                    value={securityForm.reason}
                    onChange={(e) => setSecurityForm((p) => ({ ...p, reason: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 8: ROLES & PERMISSIONS
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'permissions' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <span>Roles & Fine-Grained Module Permissions</span>
                  </h3>
                  <p className="card-subtitle">Allow or deny individual features and business operational tools</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleToggleAllPermissions(true)} className="btn btn-secondary btn-sm">Allow All</button>
                  <button onClick={() => handleToggleAllPermissions(false)} className="btn btn-secondary btn-sm">Deny All</button>
                  <button onClick={handleSavePermissions} disabled={isSaving} className="btn btn-primary btn-sm">
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Permissions'}</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                {Object.entries(permissions).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: val ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${val ? 'rgba(99,102,241,0.25)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {val ? 'Access Permitted' : 'Disabled'}
                      </div>
                    </div>

                    <label className="permission-toggle">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => setPermissions((p) => ({ ...p, [key]: e.target.checked }))}
                      />
                      <span className="toggle-track" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 9: MASTER ASSIGNMENT
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'master_assignment' && (
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>Master Admin & Regional Manager Hierarchy</span>
                  </h3>
                  <p className="card-subtitle">Assign a designated Master Admin to govern and audit this tenant business</p>
                </div>
                <button onClick={handleSaveMasterAssignment} disabled={isSaving} className="btn btn-primary btn-sm">
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Assignment'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Master Admin Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Vikram Malhotra (Regional VP)"
                      value={masterForm.masterAdminName}
                      onChange={(e) => setMasterForm((p) => ({ ...p, masterAdminName: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Master Admin Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="vikram.vp@beautysaas.local"
                      value={masterForm.masterAdminEmail}
                      onChange={(e) => setMasterForm((p) => ({ ...p, masterAdminEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Executive Role</label>
                  <select
                    className="form-select"
                    value={masterForm.masterRole}
                    onChange={(e) => setMasterForm((p) => ({ ...p, masterRole: e.target.value }))}
                  >
                    <option value="Senior Master Director">Senior Master Director (Full Regional Control)</option>
                    <option value="Regional Operations Manager">Regional Operations Manager</option>
                    <option value="Franchise General Auditor">Franchise General Auditor</option>
                    <option value="Account Executive">Account Executive (Billing / Support Only)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assignment Notes & Scope Guidelines</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    placeholder="Authorized to oversee revenue auditing, staff rosters, and multi-location branch transfers"
                    value={masterForm.notes}
                    onChange={(e) => setMasterForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 10: ACTIVITY & TELEMETRY LOGS
              ══════════════════════════════════════════════════════════════ */}
          {selectedSection === 'logs' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <span>Live Activity & API Hit Telemetry</span>
                  </h3>
                  <p className="card-subtitle">Real-time log of administrative interactions, database clicks, and API invocations</p>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                {activityLogs.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent activity recorded for this tenant.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activityLogs.map((act, i) => (
                      <div
                        key={act._id || i}
                        style={{
                          padding: '0.75rem 1rem',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {act.action || act.description || 'API Event'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Actor: {act.performedBy || 'System Admin'} • Resource: {act.resourceType || 'Tenant'}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(act.createdAt || act.timestamp || Date.now()).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: EDIT DOMAIN NAME & VERIFY
          ══════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={domainEditModal.isOpen}
        onClose={() => setDomainEditModal((p) => ({ ...p, isOpen: false }))}
        title={`Edit Domain Settings: ${domainEditModal.domain}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDomainEditModal((p) => ({ ...p, isOpen: false }))}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveDomainEdit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Update Domain'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveDomainEdit}>
          <div className="form-group">
            <label className="form-label">Domain Hostname</label>
            <input
              type="text"
              className="form-input"
              value={domainEditModal.domain}
              onChange={(e) => setDomainEditModal((p) => ({ ...p, domain: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">DNS Status</label>
              <select
                className="form-select"
                value={domainEditModal.status}
                onChange={(e) => setDomainEditModal((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="active">Active (Verified)</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Verification</option>
                <option value="failed">Failed / Misconfigured</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SSL Certificate Status</label>
              <select
                className="form-select"
                value={domainEditModal.sslStatus}
                onChange={(e) => setDomainEditModal((p) => ({ ...p, sslStatus: e.target.value }))}
              >
                <option value="active">TLS 1.3 Active (Auto-Renew)</option>
                <option value="pending">Pending Certificate Issuance</option>
                <option value="failed">SSL Failed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="editIsPrimaryModal"
                checked={domainEditModal.isPrimary}
                onChange={(e) => setDomainEditModal((p) => ({ ...p, isPrimary: e.target.checked }))}
              />
              <label htmlFor="editIsPrimaryModal" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Set as Primary Production Domain
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="editIsCustomModal"
                checked={domainEditModal.isCustom}
                onChange={(e) => setDomainEditModal((p) => ({ ...p, isCustom: e.target.checked }))}
              />
              <label htmlFor="editIsCustomModal" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Custom Domain (Uncheck for Platform Subdomain)
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UnifiedAccessManagementCenter;
