/**
 * @file TenantOnboardingWizardModal.jsx
 * @description Master Onboarding & 14-Day Free Trial Wizard for Kashi Service (Clean White Theme).
 * Allows business owners to:
 *   1. Enter Business Profile (Salon, Grocery, Institute, Event, Plotting, Rent)
 *   2. Select Domain Strategy (Platform Subdomain .kashiservice.com vs Custom Branded Domain .com)
 *   3. Set their Admin Dashboard Login Credentials (Email & Password)
 *   4. Select 14-Day Free Trial or Subscription Plan
 *   5. Automatically provisions database, admin user, and gives direct access links
 * @module frontend/src/modules/public/components/TenantOnboardingWizardModal
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
import { registerKashiTenant } from '@/services/api/kashi/kashiPlatformApi.js';
import { useToast } from '@/context/ToastContext.jsx';

export default function TenantOnboardingWizardModal({
  service,
  initialPlan,
  onClose,
  onSuccess,
}) {
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    businessCategory: service?.category || 'BEAUTY_PARLOUR',
    serviceId: service?.id || 'beauty-parlour',
    domainType: 'SUBDOMAIN', // 'SUBDOMAIN' | 'CUSTOM_DOMAIN'
    desiredSubdomain: '',
    customDomain: '',
    planTier: initialPlan?.id || 'STANDARD_TRIAL',
    databaseMode: 'shared', // 'shared' | 'separate'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate subdomain from business name if step 1
      if (name === 'businessName' && !prev.desiredSubdomain) {
        updated.desiredSubdomain = value
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 24);
      }
      return updated;
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.businessName.trim()) {
        toast.error('Please enter your business or salon name');
        return;
      }
      if (!formData.ownerName.trim()) {
        toast.error('Please enter the owner or manager name');
        return;
      }
      if (!formData.phone.trim()) {
        toast.error('Please enter your mobile contact number');
        return;
      }
    }
    if (step === 2) {
      if (formData.domainType === 'SUBDOMAIN' && !formData.desiredSubdomain.trim()) {
        toast.error('Please specify your desired subdomain');
        return;
      }
      if (formData.domainType === 'CUSTOM_DOMAIN' && !formData.customDomain.trim()) {
        toast.error('Please enter your custom domain (e.g. yoursalon.com)');
        return;
      }
    }
    if (step === 3) {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        toast.error('Please enter a valid admin email address');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitOnboarding = async () => {
    try {
      setIsSubmitting(true);
      const res = await registerKashiTenant(formData);
      const data = res?.data || res;
      toast.success('Tenant registered & provisioned successfully!');
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error('Onboarding failed:', err);
      toast.error(err?.response?.data?.message || err.message || 'Onboarding failed');
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
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '16px',
              }}
            >
              🚀
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Business Onboarding & 14-Day Free Trial
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Step {step} of 4 • {step === 1 ? 'Business Profile' : step === 2 ? 'Domain & Website URL' : step === 3 ? 'Admin Credentials' : 'Confirmation & Launch'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Tracker */}
        <div style={{ display: 'flex', padding: '0.75rem 1.75rem', background: '#ffffff', borderBottom: '1px solid #f1f5f9', gap: '8px' }}>
          {[
            { n: 1, label: '1. Business' },
            { n: 2, label: '2. Domain' },
            { n: 3, label: '3. Admin Account' },
            { n: 4, label: '4. Provision' },
          ].map((s) => (
            <div
              key={s.n}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '8px',
                background: step === s.n ? '#e0e7ff' : step > s.n ? '#ecfdf5' : '#f1f5f9',
                color: step === s.n ? '#4338ca' : step > s.n ? '#059669' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {step === 1 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Blossom Luxury Salon & Spa"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Owner / Manager Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Pooja Verma"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Business Vertical Category
                </label>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                  }}
                >
                  <option value="BEAUTY_PARLOUR">💄 Beauty Parlour & Luxury Salon</option>
                  <option value="GROCERY_SHOP">🛒 Grocery & Supermarket Cloud POS</option>
                  <option value="COMPUTER_INSTITUTE">🎓 Computer Institute & Academy LMS</option>
                  <option value="ELECTRONIC_SHOP">📱 Electronics & Mobile Repair ERP</option>
                  <option value="BOUTIQUE">👗 Designer Boutique & Custom Tailoring</option>
                  <option value="EVENT_SERVICES">🎉 Event Planning & Stage Management</option>
                  <option value="PLOTTING_SERVICES">🏗️ Real Estate & Colony Plotting</option>
                  <option value="RENT_SERVICES">🔑 Rental Properties & Asset Leasing</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Website Domain Choice
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div
                    onClick={() => setFormData((p) => ({ ...p, domainType: 'SUBDOMAIN' }))}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: formData.domainType === 'SUBDOMAIN' ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      background: formData.domainType === 'SUBDOMAIN' ? '#e0e7ff' : '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '4px' }}>
                      ⚡ Instant Free Subdomain
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      yourname.kashiservice.com • Zero DNS setup required
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData((p) => ({ ...p, domainType: 'CUSTOM_DOMAIN' }))}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: formData.domainType === 'CUSTOM_DOMAIN' ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: formData.domainType === 'CUSTOM_DOMAIN' ? '#ecfdf5' : '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '4px' }}>
                      🌐 Custom White-Label Domain
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      yourbrand.com • CNAME automatic mapping
                    </div>
                  </div>
                </div>

                {formData.domainType === 'SUBDOMAIN' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Subdomain Prefix
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        name="desiredSubdomain"
                        value={formData.desiredSubdomain}
                        onChange={handleChange}
                        placeholder="e.g. blossom"
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '8px 0 0 8px',
                          border: '1px solid #cbd5e1',
                          borderRight: 'none',
                          fontSize: '14px',
                          color: '#0f172a',
                        }}
                      />
                      <span
                        style={{
                          padding: '10px 14px',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '13px',
                          color: '#475569',
                          fontWeight: 600,
                        }}
                      >
                        .kashiservice.com
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Full Custom Domain
                    </label>
                    <input
                      type="text"
                      name="customDomain"
                      value={formData.customDomain}
                      onChange={handleChange}
                      placeholder="e.g. www.blossomluxurysalon.com"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        color: '#0f172a',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Admin Login Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. admin@yourbusiness.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Admin Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Set your secure admin password (min 6 characters)"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      background: '#ffffff',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Database Storage Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div
                    onClick={() => setFormData((p) => ({ ...p, databaseMode: 'shared' }))}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: formData.databaseMode === 'shared' ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      background: formData.databaseMode === 'shared' ? '#e0e7ff' : '#f8fafc',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>Multi-Tenant Shared DB</div>
                    <div style={{ color: '#64748b' }}>Fast & economical with tenant isolation</div>
                  </div>
                  <div
                    onClick={() => setFormData((p) => ({ ...p, databaseMode: 'separate' }))}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: formData.databaseMode === 'separate' ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: formData.databaseMode === 'separate' ? '#ecfdf5' : '#f8fafc',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>Dedicated Separate DB</div>
                    <div style={{ color: '#64748b' }}>Complete physical database isolation</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                Ready to Provision {formData.businessName || 'Your Business'}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Click below to initialize your autonomous tenant. We will provision your schemas, setup sample records, and configure your Admin credentials.
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#334155',
                  maxWidth: '440px',
                  margin: '0 auto',
                  lineHeight: 1.8,
                }}
              >
                <div><strong>Business:</strong> {formData.businessName}</div>
                <div><strong>Domain:</strong> {formData.domainType === 'SUBDOMAIN' ? `${formData.desiredSubdomain}.kashiservice.com` : formData.customDomain}</div>
                <div><strong>Admin Email:</strong> {formData.email}</div>
                <div><strong>Trial Plan:</strong> 14 Days Free ($0.00 today)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmitOnboarding}
              disabled={isSubmitting}
              style={{
                padding: '12px 28px',
                borderRadius: '8px',
                border: 'none',
                background: '#059669',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
              }}
            >
              {isSubmitting ? (
                <span>Provisioning Database...</span>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Launch Business Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
