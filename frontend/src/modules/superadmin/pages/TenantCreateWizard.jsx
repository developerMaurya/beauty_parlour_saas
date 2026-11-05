/**
 * @file TenantCreateWizard.jsx
 * @description 7-Step Multi-Tenant Provisioning Wizard with Database Provisioning and Permissions Matrix
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tenantsApi, plansApi } from '../../../services/api/superadmin.api';
import { useToast } from '../../../context/ToastContext';
import {
  DEFAULT_PERMISSIONS,
  PERMISSION_DEFINITIONS,
} from '../tenants/constants/permissions.constants';
import {
  Building2,
  Layers,
  Database,
  Globe,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Server,
  Shield,
  ShieldCheck,
  Loader2,
  Check,
  Link2,
  Eye,
  EyeOff,
  Key,
  Copy,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Business Details', icon: Building2 },
  { id: 2, title: 'Plan Assignment', icon: Layers },
  { id: 3, title: 'Database Mode', icon: Database },
  { id: 4, title: 'Domain Setup', icon: Globe },
  { id: 5, title: 'Tenant Admin', icon: UserCheck },
  { id: 6, title: 'Permissions', icon: ShieldCheck },
  { id: 7, title: 'Review & Provision', icon: CheckCircle2 },
];

export const TenantCreateWizard = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provisionResult, setProvisionResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Business
    name: '',
    slug: '',
    businessType: 'SALON',
    ownerName: '',
    ownerDob: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',

    // Step 2: Plan
    planId: '',
    billingCycle: 'MONTHLY',
    trialDays: 14,

    // Step 3: Database
    databaseMode: 'SHARED', // 'SHARED' or 'SEPARATE'
    databaseName: '',
    customDatabaseUri: '',

    // Step 4: Domain
    domainMode: 'subdomain',
    subdomain: '',
    customDomain: '',
    isPrimaryCustom: false,

    // Step 5: Admin User
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: 'Password@123',
    confirmPassword: 'Password@123',
    initialStatus: 'ACTIVE',

    // Step 6: Permissions
    permissions: { ...DEFAULT_PERMISSIONS },
  });

  // Load available plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await plansApi.list({ status: 'ACTIVE' });
        const plans = res.data?.plans || [];
        setAvailablePlans(plans);
        if (plans.length > 0) {
          setFormData((prev) => ({ ...prev, planId: plans[0]._id || plans[0].id }));
        }
      } catch (err) {
        console.warn('Failed to load plans:', err);
      }
    };
    loadPlans();
  }, []);

  // Auto-slugify business name
  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug,
      subdomain: slug,
      databaseName:
        prev.databaseMode === 'SEPARATE'
          ? `beauty_tenant_${slug.replace(/-/g, '_')}`
          : 'beauty_saas_shared',
      adminName: prev.adminName || prev.ownerName,
      adminEmail: prev.adminEmail || prev.email,
    }));
  };

  const handleModeChange = (mode) => {
    const generatedDb =
      mode === 'SEPARATE'
        ? `beauty_tenant_${(formData.slug || 'custom').replace(/-/g, '_')}`
        : 'beauty_saas_shared';
    setFormData((prev) => ({
      ...prev,
      databaseMode: mode,
      databaseName: generatedDb,
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.name.trim()) {
        error('Business Name is required');
        return false;
      }
      if (!formData.email.trim()) {
        error('Business Email is required');
        return false;
      }
      if (!formData.adminPassword || !formData.adminPassword.trim()) {
        error('Administrator Password is required');
        return false;
      }
      if (formData.adminPassword.length < 6) {
        error('Password must be at least 6 characters');
        return false;
      }
      if (formData.confirmPassword && formData.adminPassword !== formData.confirmPassword) {
        error('Passwords do not match');
        return false;
      }
    }
    if (step === 4) {
      if (!formData.subdomain.trim()) {
        error('Subdomain is required');
        return false;
      }
    }
    if (step === 5) {
      if (!formData.adminEmail.trim()) {
        error('Admin Email is required');
        return false;
      }
      if (!formData.adminPassword || !formData.adminPassword.trim()) {
        error('Administrator Password is required');
        return false;
      }
      if (formData.adminPassword.length < 6) {
        error('Password must be at least 6 characters long');
        return false;
      }
      if (formData.adminPassword !== formData.confirmPassword) {
        error('Passwords do not match. Please verify both password fields.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleProvisionTenant = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        businessType: formData.businessType,
        ownerName: formData.ownerName || formData.name,
        ownerDob: formData.ownerDob || undefined,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        planId: formData.planId || undefined,
        billingCycle: formData.billingCycle,
        trialDays: Number(formData.trialDays) || 0,
        databaseMode: formData.databaseMode,
        databaseName: formData.databaseName,
        customDatabaseUri: formData.customDatabaseUri ? formData.customDatabaseUri.trim() : undefined,
        subdomain: formData.subdomain,
        customDomain: formData.customDomain || undefined,
        adminUser: {
          name: formData.adminName || formData.ownerName || 'Tenant Administrator',
          email: formData.adminEmail || formData.email,
          phone: formData.adminPhone || formData.phone,
          dob: formData.ownerDob || undefined,
          password: formData.adminPassword,
        },
        adminPassword: formData.adminPassword,
        status: formData.initialStatus,
        permissions: formData.permissions,
        allowCustomCloudflare: Boolean(formData.permissions?.customCloudflare),
        allowCustomDatabase: Boolean(formData.permissions?.customDatabase),
        customDomainAllowed: Boolean(formData.permissions?.customDomain),
        ipWhitelistEnabled: Boolean(formData.permissions?.ipWhitelist),
        whiteLabelEnabled: Boolean(formData.permissions?.whiteLabelBranding),
      };

      const res = await tenantsApi.create(payload);
      setProvisionResult(res.data);
      success('Tenant provisioned successfully with live database, permissions and administrator!');
    } catch (err) {
      error(err.message || 'Tenant provisioning failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyClientCredentials = () => {
    const text = `🏢 *${formData.name}* - SaaS Platform Credentials
🌐 Website: ${formData.customDomain ? `https://${formData.customDomain}` : `https://${formData.subdomain || formData.slug}.kashiservice.com`}
🏢 Salon Admin Login: ${formData.customDomain ? `https://${formData.customDomain}/admin/login` : `https://${formData.subdomain || formData.slug}.kashiservice.com/admin/login`}
📧 Admin Email: ${formData.adminEmail}
🔑 Password: ${formData.adminPassword}
🎂 Owner DOB: ${formData.ownerDob || 'N/A'}
🗄️ Database: ${formData.databaseName || 'beauty_saas_shared'}
Salon ID: ${formData.slug}
----------------------------------------
Please change your password after initial login.`;
    navigator.clipboard?.writeText(text);
    success('Formatted client onboarding message copied to clipboard!');
  };

  const enabledPermissionsCount = Object.values(formData.permissions || {}).filter(Boolean).length;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Wizard Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Link to="/superadmin/tenants" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ← Back to Tenants
          </Link>
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Tenant Provisioning Wizard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Configure multi-database architecture, domain routing, operational permissions, and tenant administration.
        </p>
      </div>

      {/* Step Indicator Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          overflowX: 'auto',
          gap: '0.5rem',
        }}
      >
        {STEPS.map((s) => {
          const isDone = currentStep > s.id;
          const isCurrent = currentStep === s.id;

          return (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isCurrent || isDone ? 1 : 0.45,
                cursor: isDone ? 'pointer' : 'default',
                flexShrink: 0,
              }}
              onClick={() => {
                if (isDone) setCurrentStep(s.id);
              }}
              title={isDone ? `Jump to Step ${s.id}` : ''}
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: isDone
                    ? 'var(--color-success)'
                    : isCurrent
                    ? 'var(--primary-gradient)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {isDone ? '✓' : s.id}
              </div>
              <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* Step Content Card */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Step 1: Business Details */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 1: Business Profile</h3>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Business Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Blossom Luxury Spa & Salon"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tenant Slug (Identifier)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="blossom-luxury-spa"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Category</label>
                <select
                  className="form-select"
                  value={formData.businessType}
                  onChange={(e) => setFormData((p) => ({ ...p, businessType: e.target.value }))}
                >
                  <option value="SALON">Hair & Beauty Salon</option>
                  <option value="SPA">Wellness & Luxury Spa</option>
                  <option value="BEAUTY_PARLOUR">Beauty Parlour</option>
                  <option value="TRAINING_ACADEMY">Beauty Training Academy</option>
                  <option value="CHAINS">Multi-Branch Chain</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Owner Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Priya Sharma"
                  value={formData.ownerName}
                  onChange={(e) => setFormData((p) => ({ ...p, ownerName: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Date of Birth (DOB)</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.ownerDob}
                  onChange={(e) => setFormData((p) => ({ ...p, ownerDob: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="owner@blossomspa.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address Street</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="104 MG Road, Indiranagar"
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City, State & Country</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                  />
                </div>
              </div>

              {/* Step 1 Tenant Admin Password Setup */}
              <div
                className="form-group"
                style={{
                  gridColumn: 'span 2',
                  marginTop: '0.5rem',
                  padding: '1.25rem',
                  background: 'rgba(99, 102, 241, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={15} style={{ color: 'var(--primary)' }} />
                    <span>Tenant Administrator Password Setup *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const gen = `Pass@${Math.random().toString(36).slice(-4)}!${Math.floor(100 + Math.random() * 900)}`;
                      setFormData((p) => ({ ...p, adminPassword: gen, confirmPassword: gen }));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={13} />
                    <span>🎲 Generate Secure Password</span>
                  </button>
                </div>

                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Administrator Password *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontFamily: 'var(--font-mono)' }}
                      placeholder="Password@123"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData((p) => ({ ...p, adminPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Confirm Password *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        borderColor:
                          formData.confirmPassword && formData.adminPassword !== formData.confirmPassword
                            ? '#EF4444'
                            : undefined,
                      }}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                    {formData.confirmPassword && formData.adminPassword !== formData.confirmPassword && (
                      <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px' }}>
                        Passwords do not match
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Plan Assignment */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 2: Subscription Plan</h3>
            <div className="form-group">
              <label className="form-label">Select Subscription Tier</label>
              {availablePlans.length === 0 ? (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  Standard Growth Plan ($49/mo) will be provisioned by default.
                </div>
              ) : (
                <div className="grid-cols-3">
                  {availablePlans.map((plan) => (
                    <div
                      key={plan._id}
                      onClick={() => setFormData((p) => ({ ...p, planId: plan._id }))}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background:
                          formData.planId === plan._id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${formData.planId === plan._id ? 'var(--primary)' : 'var(--border-card)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{plan.name}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ${plan.price}{' '}
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {plan.description || 'Full features for beauty operations'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid-cols-2" style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Billing Cycle</label>
                <select
                  className="form-select"
                  value={formData.billingCycle}
                  onChange={(e) => setFormData((p) => ({ ...p, billingCycle: e.target.value }))}
                >
                  <option value="MONTHLY">Monthly Billing</option>
                  <option value="YEARLY">Yearly Billing (20% Discount)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Free Trial Period (Days)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="90"
                  value={formData.trialDays}
                  onChange={(e) => setFormData((p) => ({ ...p, trialDays: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Database Mode */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 3: Database Architecture Mode</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Select tenant isolation strategy according to client tier and enterprise requirements.
            </p>

            <div className="grid-cols-2">
              {/* Option 1: Shared Database */}
              <div
                onClick={() => handleModeChange('SHARED')}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background:
                    formData.databaseMode === 'SHARED' ? 'rgba(14, 165, 233, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `2px solid ${formData.databaseMode === 'SHARED' ? '#38BDF8' : 'var(--border-card)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Server className="w-6 h-6 text-sky-400" />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Mode A: Shared Database</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Tenants share the central MongoDB cluster database (`beauty_saas_shared`). Enforces strict query isolation using authenticated tenantId.
                </p>
                <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>
                  ✓ Cost efficient • Fast provisioning • Instant migrations
                </div>
              </div>

              {/* Option 2: Separate Database */}
              <div
                onClick={() => handleModeChange('SEPARATE')}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background:
                    formData.databaseMode === 'SEPARATE' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `2px solid ${formData.databaseMode === 'SEPARATE' ? '#C084FC' : 'var(--border-card)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Shield className="w-6 h-6 text-purple-400" />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Mode B: Separate Database</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Dedicated isolated MongoDB database created specifically for this tenant. Managed with dynamic connection pooling.
                </p>
                <div style={{ fontSize: '0.75rem', color: '#C084FC', fontWeight: 600 }}>
                  ✓ Physical data isolation • Compliance ready • Custom backups
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                  Assigned Database Target Name:
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Custom DB Name</span>
              </div>
              <input
                type="text"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}
                value={formData.databaseName}
                onChange={(e) => setFormData((p) => ({ ...p, databaseName: e.target.value }))}
                placeholder="e.g. beauty_tenant_mybrand or beauty_saas_shared"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Super Admin can specify any custom MongoDB database identifier or use the automatically configured default.
              </div>
            </div>

            <div
              style={{
                marginTop: '1rem',
                padding: '1.25rem',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                  Custom MongoDB Cluster Connection URI (Optional):
                </label>
                <span style={{ fontSize: '0.75rem', color: '#10b981' }}>External Cluster Support</span>
              </div>
              <input
                type="password"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                value={formData.customDatabaseUri}
                onChange={(e) => setFormData((p) => ({ ...p, customDatabaseUri: e.target.value }))}
                placeholder="mongodb+srv://admin:secret@cluster0.mongodb.net/ or mongodb://127.0.0.1:27017"
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Leave empty to use the platform's standard MongoDB cluster. If client has their own dedicated MongoDB Atlas cluster, paste the full URI here.
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Domain Setup */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 4: White-Label Domain Routing</h3>

            {/* Mode Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                onClick={() => setFormData((p) => ({ ...p, domainMode: 'subdomain', isPrimaryCustom: false }))}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: formData.domainMode !== 'custom' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `2px solid ${formData.domainMode !== 'custom' ? 'var(--primary)' : 'var(--border-card)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Link2 className="w-5 h-5 text-indigo-400" />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Option A: Platform Subdomain</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
                  Fastest setup. Uses platform wildcard DNS with free automatic SSL certificate.
                </p>
              </div>

              <div
                onClick={() => setFormData((p) => ({ ...p, domainMode: 'custom', isPrimaryCustom: true }))}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: formData.domainMode === 'custom' ? 'rgba(14, 165, 233, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `2px solid ${formData.domainMode === 'custom' ? '#38BDF8' : 'var(--border-card)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Globe className="w-5 h-5 text-sky-400" />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Option B: Custom White-Label Domain</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
                  Full brand isolation. Tenant uses their own custom registered domain (e.g. yourbrand.com).
                </p>
              </div>
            </div>

            {formData.domainMode !== 'custom' ? (
              <div className="form-group">
                <label className="form-label">Kashi Service Subdomain Prefix *</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. glamour"
                    value={formData.subdomain || formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    required
                  />
                  <span style={{ padding: '0 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    .kashiservice.com
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38BDF8', marginTop: '6px' }}>
                  Live Resolved URL:{' '}
                  {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.endsWith('.localhost'))
                    ? `http://${formData.subdomain || formData.slug || 'glamour'}.localhost:${window.location.port || 3000}/ (Clean Localhost Subdomain)`
                    : `https://${formData.subdomain || formData.slug || 'glamour'}.kashiservice.com/ (Production SaaS)`}
                </div>
                <div style={{ marginTop: '8px', padding: '10px 14px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <strong>Auto-Configured Subdomain Portals:</strong><br />
                  🌐 Website / Store: <code>{(formData.subdomain || 'glamour')}.kashiservice.com/</code><br />
                  📅 Online Booking: <code>{(formData.subdomain || 'glamour')}.kashiservice.com/book</code><br />
                  🏢 Salon Admin: <code>{(formData.subdomain || 'glamour')}.kashiservice.com/admin</code><br />
                  👥 Customer Portal: <code>{(formData.subdomain || 'glamour')}.kashiservice.com/customer</code><br />
                  ✂️ Staff Member Portal: <code>{(formData.subdomain || 'glamour')}.kashiservice.com/staff</code>
                </div>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Custom White-Label Domain *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. www.glamourbeauty.com or glamourbeauty.com"
                    value={formData.customDomain}
                    onChange={(e) => setFormData((p) => ({ ...p, customDomain: e.target.value }))}
                    required
                  />
                  <div style={{ fontSize: '0.75rem', color: '#38BDF8', marginTop: '6px' }}>
                    Live Target URL: https://{formData.customDomain || 'www.glamourbeauty.com'}/
                  </div>
                </div>

                <div style={{ marginTop: '8px', marginBottom: '14px', padding: '10px 14px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '8px', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <strong>White-Label Multi-Portal Support on Same Domain:</strong><br />
                  🌐 Store: <code>https://{formData.customDomain || 'www.glamourbeauty.com'}/</code><br />
                  📅 Booking: <code>https://{formData.customDomain || 'www.glamourbeauty.com'}/book</code><br />
                  🏢 Admin: <code>https://{formData.customDomain || 'www.glamourbeauty.com'}/admin</code><br />
                  👥 Customer: <code>https://{formData.customDomain || 'www.glamourbeauty.com'}/customer</code><br />
                  ✂️ Staff: <code>https://{formData.customDomain || 'www.glamourbeauty.com'}/staff</code>
                </div>

                {formData.customDomain && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      DNS Verification Records for {formData.customDomain}:
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      1. CNAME Record: <code style={{ color: 'var(--primary)' }}>@ / www</code> pointing to{' '}
                      <code style={{ color: 'var(--primary)' }}>cname.kashiservice.com</code>
                      <br />
                      2. Fallback Subdomain: <code style={{ color: 'var(--primary)' }}>{formData.subdomain || formData.slug || 'glamour'}.kashiservice.com</code>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Tenant Administrator */}
        {currentStep === 5 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 5: Initial Administrator Account</h3>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Administrator Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Admin Name"
                  value={formData.adminName}
                  onChange={(e) => setFormData((p) => ({ ...p, adminName: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Administrator Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@tenantdomain.com"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData((p) => ({ ...p, adminEmail: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={formData.adminPhone}
                  onChange={(e) => setFormData((p) => ({ ...p, adminPhone: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Administrator Date of Birth (DOB)</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.ownerDob}
                  onChange={(e) => setFormData((p) => ({ ...p, ownerDob: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Tenant Account Status</label>
                <select
                  className="form-select"
                  value={formData.initialStatus}
                  onChange={(e) => setFormData((p) => ({ ...p, initialStatus: e.target.value }))}
                >
                  <option value="ACTIVE">Active (Ready for operations)</option>
                  <option value="TRIAL">Trial Period</option>
                  <option value="SUSPENDED">Suspended (Pending Onboarding)</option>
                </select>
              </div>

              {/* Password Fields with Eye toggle and Auto-generator */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Administrator Login Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const gen = `Admin@${Math.floor(1000 + Math.random() * 9000)}`;
                      setFormData((p) => ({ ...p, adminPassword: gen, confirmPassword: gen }));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0,
                    }}
                  >
                    <Key className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter secure password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData((p) => ({ ...p, adminPassword: e.target.value }))}
                    style={{ paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Confirm administrator password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                    style={{
                      borderColor:
                        formData.confirmPassword && formData.adminPassword !== formData.confirmPassword
                          ? '#ef4444'
                          : undefined,
                    }}
                    required
                  />
                  {formData.confirmPassword && formData.adminPassword !== formData.confirmPassword && (
                    <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>
                      Passwords do not match
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <Key className="w-5 h-5 text-sky-400 shrink-0" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#e0f2fe' }}>
                  Salon Owner Administrator Credentials
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                  This administrator email and password will be seeded directly into the tenant's database with <strong>ADMIN</strong> role.
                  The salon owner can instantly log into the Salon Admin Panel at <code>/admin/login</code> or their custom domain's <code>/admin</code> path.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Permissions */}
        {currentStep === 6 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Step 6: Module Access & System Permissions</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Configure operational modules and governance controls granted to this tenant upon provisioning.
                </p>
              </div>
            </div>

            {/* Summary Bar */}
            <div className="permission-summary-bar">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  Assigned Permissions Matrix
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {enabledPermissionsCount} of 17 permissions enabled by default.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const allOn = {};
                    Object.keys(DEFAULT_PERMISSIONS).forEach((k) => {
                      allOn[k] = true;
                    });
                    setFormData((p) => ({ ...p, permissions: allOn }));
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Enable All
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const allOff = {};
                    Object.keys(DEFAULT_PERMISSIONS).forEach((k) => {
                      allOff[k] = false;
                    });
                    setFormData((p) => ({ ...p, permissions: allOff }));
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Disable All
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {PERMISSION_DEFINITIONS.map((category) => (
                <div key={category.section}>
                  <div className="permission-section-title">
                    <span>{category.icon}</span>
                    <span>{category.section}</span>
                  </div>

                  <div className="permission-grid">
                    {category.items.map((item) => {
                      const isEnabled = Boolean(formData.permissions?.[item.key]);
                      return (
                        <div
                          key={item.key}
                          className={`permission-item ${isEnabled ? 'enabled' : ''}`}
                          onClick={() => {
                            setFormData((p) => ({
                              ...p,
                              permissions: {
                                ...p.permissions,
                                [item.key]: !p.permissions?.[item.key],
                              },
                            }));
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="permission-item-label">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                              onChange={() => {
                                setFormData((p) => ({
                                  ...p,
                                  permissions: {
                                    ...p.permissions,
                                    [item.key]: !p.permissions?.[item.key],
                                  },
                                }));
                              }}
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
          </div>
        )}

        {/* Step 7: Review & Provision */}
        {currentStep === 7 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Step 7: Review & Automatic Provisioning</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Confirm tenant specifications. Clicking Provision will initialize databases, configure collections, and create tenant credentials.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-card)',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Name:</span>
                <div style={{ fontWeight: 600 }}>{formData.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenant Slug:</span>
                <div style={{ fontWeight: 600 }}>{formData.slug}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category:</span>
                <div style={{ fontWeight: 600 }}>{formData.businessType}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Database Architecture:</span>
                <div style={{ fontWeight: 600, color: formData.databaseMode === 'SEPARATE' ? '#C084FC' : '#38BDF8' }}>
                  {formData.databaseMode === 'SEPARATE' ? 'Separate Database' : 'Shared Database'} ({formData.databaseName})
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Domain:</span>
                <div style={{ fontWeight: 600 }}>{formData.subdomain || formData.slug}.kashiservice.com</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenant Admin Email:</span>
                <div style={{ fontWeight: 600 }}>{formData.adminEmail}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator Password:</span>
                <div style={{ fontWeight: 600, color: '#38BDF8', fontFamily: 'monospace' }}>
                  {formData.adminPassword}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin Login URL:</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  /admin/login
                </div>
              </div>
            </div>

            {/* Permissions Summary Section */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Permissions & Entitlements Summary</span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--primary)',
                  }}
                >
                  {enabledPermissionsCount} of 17 Enabled
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {Object.entries(formData.permissions || {}).map(([key, val]) => {
                  if (!val) return null;
                  let itemName = key;
                  for (const sec of PERMISSION_DEFINITIONS) {
                    const found = sec.items.find((it) => it.key === key);
                    if (found) {
                      itemName = found.name;
                      break;
                    }
                  }
                  return (
                    <span
                      key={key}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10B981',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        fontWeight: 500,
                      }}
                    >
                      <Check className="w-3 h-3" />
                      <span>{itemName}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {provisionResult ? (
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-400" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1.15rem', color: '#34D399', marginBottom: '0.5rem' }}>
                  Tenant Provisioned Successfully!
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Database collections created, domain routing established, permissions configured, and admin user initialized.
                </p>

                {/* Ready Credentials Box with Full Details & 1-Click Copy */}
                <div
                  style={{
                    maxWidth: '520px',
                    margin: '0 auto 1.5rem auto',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34D399' }}>
                      Client Provisioning & Login Credentials
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyClientCredentials}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Copy size={12} />
                      <span>Copy Client Message</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div>Business: <strong style={{ color: '#fff' }}>{formData.name}</strong></div>
                    <div>Salon ID: <code style={{ color: '#38BDF8' }}>{formData.slug}</code></div>
                    <div>Owner Name: <strong style={{ color: '#fff' }}>{formData.ownerName || 'Admin'}</strong></div>
                    <div>Owner DOB: <strong style={{ color: '#f59e0b' }}>{formData.ownerDob || 'N/A'}</strong></div>
                    <div>Admin Email: <strong style={{ color: '#fff' }}>{formData.adminEmail}</strong></div>
                    <div>Admin Password: <code style={{ color: '#38BDF8' }}>{formData.adminPassword}</code></div>
                    <div style={{ gridColumn: 'span 2' }}>
                      Database: <code style={{ color: '#c084fc' }}>{formData.databaseName || 'beauty_saas_shared'}</code> ({formData.databaseMode})
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      Subdomain: <code style={{ color: 'var(--primary)' }}>{formData.subdomain || formData.slug}.kashiservice.com</code>
                    </div>
                    {formData.customDomain && (
                      <div style={{ gridColumn: 'span 2' }}>
                        Custom Domain: <code style={{ color: '#34d399' }}>{formData.customDomain}</code>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href={
                      typeof window !== 'undefined' && window.location.hostname.includes('localhost')
                        ? `http://${formData.subdomain || formData.slug}.localhost:${window.location.port || 3000}/admin/login`
                        : `/admin/login`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ background: 'var(--primary-gradient)', textDecoration: 'none' }}
                  >
                    Open Salon Admin Login ↗
                  </a>
                  <Link
                    to={`/superadmin/tenants?tenantId=${provisionResult.tenant?._id || provisionResult.tenant?.id || ''}`}
                    className="btn btn-secondary"
                  >
                    Open Tenant Control Panel
                  </Link>
                  <Link to="/superadmin/tenants" className="btn btn-secondary">
                    View All Tenants
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Wizard Controls */}
        {!provisionResult && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentStep < 7 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleProvisionTenant}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 spin" />
                    <span>Provisioning Database & Tenant...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Provision Tenant</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantCreateWizard;
