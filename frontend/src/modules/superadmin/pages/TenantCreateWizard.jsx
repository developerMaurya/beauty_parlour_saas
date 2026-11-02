/**
 * @file TenantCreateWizard.jsx
 * @description 6-Step Multi-Tenant Provisioning Wizard with Real Database Provisioning
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tenantsApi, plansApi } from '../../../services/api/superadmin.api';
import { useToast } from '../../../context/ToastContext';
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
  Loader2,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Business Details', icon: Building2 },
  { id: 2, title: 'Plan Assignment', icon: Layers },
  { id: 3, title: 'Database Mode', icon: Database },
  { id: 4, title: 'Domain Setup', icon: Globe },
  { id: 5, title: 'Tenant Admin', icon: UserCheck },
  { id: 6, title: 'Review & Provision', icon: CheckCircle2 },
];

export const TenantCreateWizard = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provisionResult, setProvisionResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Business
    name: '',
    slug: '',
    businessType: 'SALON',
    ownerName: '',
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

    // Step 4: Domain
    subdomain: '',
    customDomain: '',
    isPrimaryCustom: false,

    // Step 5: Admin User
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    initialStatus: 'ACTIVE',
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
      databaseName: prev.databaseMode === 'SEPARATE' ? `beauty_tenant_${slug.replace(/-/g, '_')}` : 'beauty_saas_shared',
      adminName: prev.adminName || prev.ownerName,
      adminEmail: prev.adminEmail || prev.email,
    }));
  };

  const handleModeChange = (mode) => {
    const generatedDb = mode === 'SEPARATE'
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
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
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
        subdomain: formData.subdomain,
        customDomain: formData.customDomain || undefined,
        adminUser: {
          name: formData.adminName || formData.ownerName || 'Tenant Administrator',
          email: formData.adminEmail || formData.email,
          phone: formData.adminPhone || formData.phone,
        },
        status: formData.initialStatus,
      };

      const res = await tenantsApi.create(payload);
      setProvisionResult(res.data);
      success('Tenant provisioned successfully with live database and administrator!');
    } catch (err) {
      error(err.message || 'Tenant provisioning failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Wizard Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Link to="/superadmin/tenants" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ← Back to Tenants
          </Link>
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Tenant Provisioning Wizard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Configure multi-database architecture, white-label domain routing, and tenant administration.
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
          padding: '1rem 1.5rem',
        }}
      >
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isDone = currentStep > s.id;
          const isCurrent = currentStep === s.id;

          return (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isCurrent || isDone ? 1 : 0.4,
              }}
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
                }}
              >
                {isDone ? '✓' : s.id}
              </div>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, display: 'none', lg: 'inline' }}>
                {s.title}
              </span>
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
                        background: formData.planId === plan._id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${formData.planId === plan._id ? 'var(--primary)' : 'var(--border-card)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{plan.name}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ${plan.price} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span>
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
                  background: formData.databaseMode === 'SHARED' ? 'rgba(14, 165, 233, 0.12)' : 'rgba(255, 255, 255, 0.02)',
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
                  background: formData.databaseMode === 'SEPARATE' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.02)',
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
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Assigned Database Target:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formData.databaseName || 'beauty_saas_shared'}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Domain Setup */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Step 4: White-Label Domain Routing</h3>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Platform Subdomain *</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="my-salon"
                    value={formData.subdomain}
                    onChange={(e) => setFormData((p) => ({ ...p, subdomain: e.target.value }))}
                    required
                  />
                  <span style={{ padding: '0 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    .beautysaas.local
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Custom White-Label Domain (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="www.mysalonbrand.com"
                  value={formData.customDomain}
                  onChange={(e) => setFormData((p) => ({ ...p, customDomain: e.target.value }))}
                />
              </div>
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
                  DNS Verification Instructions for {formData.customDomain}:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  1. CNAME Record: <code style={{ color: 'var(--primary)' }}>@</code> pointing to{' '}
                  <code style={{ color: 'var(--primary)' }}>cname.beautysaas.com</code>
                  <br />
                  2. TXT Record: <code style={{ color: 'var(--primary)' }}>_beauty-verification</code> pointing to{' '}
                  <code style={{ color: 'var(--primary)' }}>verify-tenant-{formData.slug}</code>
                </div>
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
            </div>
          </div>
        )}

        {/* Step 6: Review & Provision */}
        {currentStep === 6 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Step 6: Review & Automatic Provisioning</h3>
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
                <div style={{ fontWeight: 600 }}>{formData.subdomain}.beautysaas.local</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenant Admin:</span>
                <div style={{ fontWeight: 600 }}>{formData.adminEmail}</div>
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
                  Database collections created, domain routing established, and admin user initialized.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <Link
                    to={`/superadmin/tenants/${provisionResult.tenant?._id || provisionResult.tenant?.id || ''}`}
                    className="btn btn-primary"
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

            {currentStep < 6 ? (
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
