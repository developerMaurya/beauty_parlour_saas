/**
 * @file TenantOnboardingWizardModal.jsx
 * @description Master Onboarding & 14-Day Free Trial Wizard for Kashi Service.
 * Allows business owners to:
 *   1. Enter Business Profile (Salon, Grocery, Institute, Event, Plotting, Rent)
 *   2. Select Domain Strategy (Platform Subdomain .kashiservice.com vs Custom Branded Domain .com)
 *   3. Set their Admin Dashboard Login Credentials (Email & Password)
 *   4. Select 14-Day Free Trial or Subscription Plan
 *   5. Automatically provisions database, admin user, and gives direct access links
 * @module frontend/src/modules/kashi-service/components/TenantOnboardingWizardModal
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Building,
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { registerKashiTenant } from '../../../services/api/kashi/kashiPlatformApi.js';
import { useToast } from '../../../context/ToastContext.jsx';

export default function TenantOnboardingWizardModal({
  service,
  selectedPlan,
  onClose,
  onProvisionSuccess,
}) {
  const toast = useToast();

  const [step, setStep] = useState(1); // 1: Business Profile, 2: Domain, 3: Admin Auth, 4: Plan & Launch
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: 'Password@123',
    businessType: 'salon',
    domainType: 'subdomain', // 'subdomain' | 'custom'
    subdomain: '',
    customDomain: '',
    planId: selectedPlan?.id || 'plan_starter',
    serviceCategory: service?.id || 'software-saas',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-suggest subdomain from business name
      if (field === 'businessName' && !prev.subdomain) {
        updated.subdomain = value
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 20);
      }
      return updated;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.businessName.trim() || !formData.ownerName.trim()) {
        toast.error('Please enter business name and owner name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.domainType === 'subdomain' && !formData.subdomain.trim()) {
        toast.error('Please choose your platform subdomain');
        return;
      }
      if (formData.domainType === 'custom' && !formData.customDomain.trim()) {
        toast.error('Please enter your custom domain (e.g. www.mybusiness.com)');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.email.trim() || !formData.password.trim()) {
        toast.error('Please enter admin login email and password');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await registerKashiTenant(formData);
      if (res?.success && res?.data) {
        toast.success('Tenant provisioned successfully!');
        onProvisionSuccess(res.data);
      } else {
        toast.error(res?.message || 'Provisioning failed');
      }
    } catch (err) {
      console.error('Onboarding submission error:', err);
      toast.error(err.response?.data?.message || err.message || 'Onboarding failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🚀</span>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                Kashi Service • Business Onboarding Wizard
              </h2>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Launch your 14-day free trial with public website, private admin dashboard & custom domain
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div
          style={{
            display: 'flex',
            padding: '1rem 2rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          {[
            { num: 1, title: 'Business Profile' },
            { num: 2, title: 'Domain Strategy' },
            { num: 3, title: 'Admin Account' },
            { num: 4, title: 'Confirm & Launch' },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: step >= s.num ? 1 : 0.45,
                transition: 'opacity 0.2s',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: step >= s.num ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Content Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          {/* STEP 1: BUSINESS PROFILE */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  Tell us about your business
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  This information will be displayed on your public customer website and invoices.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Business / Salon / Store Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <Building className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="e.g. Riya Beauty Parlour & Luxury Spa"
                    className="input"
                    style={{ paddingLeft: '38px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Owner / Administrator Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => handleChange('ownerName', e.target.value)}
                      placeholder="e.g. Riya Sen"
                      className="input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Mobile / Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Business Category / Software Vertical
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleChange('businessType', e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                >
                  <option value="salon">💄 Beauty Parlour & Salon Concierge (Active)</option>
                  <option value="grocery">🛒 Grocery & Supermarket POS</option>
                  <option value="institute">🎓 Computer & Training Institute Academy</option>
                  <option value="electronics">📱 Electronic & Mobile Repair Shop</option>
                  <option value="events">🎉 Event Planning & Production Services</option>
                  <option value="realestate">🏗️ Real Estate & Colony Plotting</option>
                  <option value="rentals">🔑 Rent Services & Asset Leasing</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: DOMAIN STRATEGY */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  Choose Your Website & Dashboard Domain
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Your website and admin dashboard will run on this address.
                </p>
              </div>

              {/* Option Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div
                  onClick={() => handleChange('domainType', 'subdomain')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: formData.domainType === 'subdomain' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: formData.domainType === 'subdomain' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8' }}>OPTION A</span>
                    <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      RECOMMENDED
                    </span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                    Platform Subdomain
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Free zero-config domain with automated TLS/SSL.
                  </div>
                </div>

                <div
                  onClick={() => handleChange('domainType', 'custom')}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: formData.domainType === 'custom' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: formData.domainType === 'custom' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b' }}>OPTION B</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                    Custom Branded Domain
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    100% White-Label on your own .com or .in domain.
                  </div>
                </div>
              </div>

              {formData.domainType === 'subdomain' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Desired Platform Subdomain *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      required
                      value={formData.subdomain}
                      onChange={(e) => handleChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="e.g. riya"
                      className="input"
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>
                      .kashiservice.com
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px' }}>
                    ✓ Preview URL: <strong>https://{formData.subdomain || 'yourname'}.kashiservice.com</strong>
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Enter Your Custom Domain (e.g. www.riyabeauty.com) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customDomain}
                    onChange={(e) => handleChange('customDomain', e.target.value)}
                    placeholder="www.yourbrand.com"
                    className="input"
                    style={{ width: '100%' }}
                  />
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      fontSize: '11px',
                      color: '#fde68a',
                    }}
                  >
                    💡 Add a <strong>CNAME</strong> record pointing to <code>cname.kashiservice.com</code> in your GoDaddy, Namecheap, or Cloudflare DNS.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: ADMIN ACCOUNT CREDENTIALS */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  Create Your Admin Dashboard Login Credentials
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  You will use this email and password to log in to your private admin portal at <code>/admin/login</code>.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Administrator Login Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. riya@gmail.com"
                    className="input"
                    style={{ paddingLeft: '38px', width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Administrator Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create secure admin password"
                    className="input"
                    style={{ paddingLeft: '38px', paddingRight: '40px', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                  Minimum 6 characters. You will need this password immediately after onboarding.
                </div>
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div style={{ fontSize: '11px', color: '#a7f3d0' }}>
                  Your password is encrypted with <strong>bcrypt 12-round hashing</strong> and isolated inside your private tenant database.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM & LAUNCH */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  Confirm Details & Launch 14-Day Free Trial
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Review your business profile and domain setup before automated provisioning.
                </p>
              </div>

              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Business Name:</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{formData.businessName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Owner:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{formData.ownerName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Domain Host:</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                    {formData.domainType === 'custom' ? formData.customDomain : `${formData.subdomain}.kashiservice.com`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Admin Login Email:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{formData.email}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Trial Terms:</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>
                    14 Days Full Access (₹0 Free Trial)
                  </span>
                </div>
              </div>

              {isSubmitting && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid #6366f1',
                    textAlign: 'center',
                    animation: 'pulse 1.5s infinite',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                    ⚡ Provisioning Tenant Database & Seed Collections...
                  </div>
                  <div style={{ fontSize: '11px', color: '#a5b4fc', marginTop: '4px' }}>
                    Creating DNS routing records and generating admin credentials
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            padding: '1.25rem 2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Back
            </button>
          ) : (
            <button onClick={onClose} disabled={isSubmitting} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Provisioning...' : 'Launch My Business Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

