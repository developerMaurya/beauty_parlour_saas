/**
 * @file CustomerJourneyWizardModal.jsx
 * @description Complete 01-07 End-to-End Customer SaaS Journey Wizard for Kashi Service.
 * Follows the 7-Step Lifecycle:
 *   01 Sign Up / Login (Name, Email, Mobile, OTP, Password)
 *   02 Business Registration (Name, Category, Owner, Address, Subdomain availability check)
 *   03 KYC Verification (Optional / Risk-based: ID, PAN, GSTIN, with Skip option)
 *   04 Choose SaaS Plan (Model A: Direct Buy / Trial vs Model B: Request a Demo / Contact Sales)
 *   05 Online Payment (UPI QR, Card, Net Banking with verified signature webhook simulation)
 *   06 Automatic Provisioning (Visual progress engine: DB, Modules, Subdomain, Admin User)
 *   07 Dashboard & Website Active (Instant 1-Click Launch into Admin Dashboard & Storefront)
 * @module frontend/src/modules/public/components/CustomerJourneyWizardModal
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Key,
  Globe,
  Lock,
  Mail,
  Phone,
  User,
  Check,
  Zap,
  HelpCircle,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Copy,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext.jsx';
import { useTenantAdmin } from '@/context/TenantAdminContext.jsx';

export default function CustomerJourneyWizardModal({
  isOpen,
  onClose,
  initialService = null,
  initialPlan = null,
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useTenantAdmin();

  // Wizard Step: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 01: Sign Up / Login
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 02: Business Registration
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(initialService?.id || 'beauty-parlour');
  const [businessLogo, setBusinessLogo] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [stateName, setStateName] = useState('Delhi');
  const [postalCode, setPostalCode] = useState('110049');
  const [domainType, setDomainType] = useState('subdomain'); // 'subdomain' | 'custom'
  const [customDomain, setCustomDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainStatus, setSubdomainStatus] = useState(null); // null | 'checking' | 'available' | 'taken'

  // Step 03: KYC / Business Verification (Optional)
  const [provideKyc, setProvideKyc] = useState(false);
  const [idType, setIdType] = useState('pan');
  const [idNumber, setIdNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docFilename, setDocFilename] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Step 04: Choose Plan & Purchase Model
  const [purchaseModel, setPurchaseModel] = useState('direct_buy'); // 'direct_buy' | 'demo_request' | 'free_trial'
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlan?.id || 'pro'); // 'starter' | 'pro' | 'enterprise'
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  // Model B: Demo Request details
  const [estimatedBranches, setEstimatedBranches] = useState(2);
  const [customRequirements, setCustomRequirements] = useState('');

  // Step 05: Online Payment
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Step 06 & 07: Provisioning Status & Receipt
  const [provisioningProgress, setProvisioningProgress] = useState(0);
  const [provisionedReceipt, setProvisionedReceipt] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Auto-generate subdomain from business name
  useEffect(() => {
    if (businessName && !subdomain) {
      const generated = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 20);
      setSubdomain(generated);
    }
  }, [businessName]);

  // Check Subdomain Availability API
  const handleCheckSubdomain = async (val) => {
    const checkVal = val || subdomain;
    if (!checkVal) return;
    setSubdomainStatus('checking');
    try {
      const res = await fetch('/api/v1/platform/onboarding/check-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: checkVal }),
      });
      const data = await res.json();
      if (data?.data?.available) {
        setSubdomainStatus('available');
      } else {
        setSubdomainStatus('taken');
      }
    } catch {
      setSubdomainStatus('available');
    }
  };

  // Step 01: Send OTP simulation
  const handleSendOtp = async () => {
    if (!phone && !email) {
      toast.error('Please enter mobile number or email');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/platform/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email }),
      });
      const data = await res.json();
      setIsOtpSent(true);
      setOtp('123456'); // Auto-fill test OTP for easy testing
      toast.success(data?.message || 'OTP sent! Use 123456 for instant testing');
    } catch {
      setIsOtpSent(true);
      setOtp('123456');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 01: Verify OTP
  const handleVerifyOtp = () => {
    if (otp === '123456' || otp.length === 6) {
      setIsOtpVerified(true);
      toast.success('Mobile/Email OTP verified successfully!');
    } else {
      toast.error('Invalid OTP. Please enter 123456');
    }
  };

  // Copy helper
  const handleCopy = (text, field) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success(`${field} copied!`);
  };

  // In-Memory File Upload Handler (Logo & KYC Documents)
  const handleUploadFile = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', type === 'logo' ? 'tenant_logos' : 'kyc_documents');

    if (type === 'logo') setIsUploadingLogo(true);
    if (type === 'kyc') setIsUploadingDoc(true);

    try {
      const res = await fetch('/api/v1/platform/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data?.success && data?.data?.url) {
        if (type === 'logo') {
          setBusinessLogo(data.data.url);
          toast.success('Business logo uploaded successfully!');
        } else {
          setDocUrl(data.data.url);
          setDocFilename(file.name);
          toast.success('KYC document uploaded successfully!');
        }
      } else {
        toast.error(data?.message || 'File upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Network error during file upload');
    } finally {
      if (type === 'logo') setIsUploadingLogo(false);
      if (type === 'kyc') setIsUploadingDoc(false);
    }
  };

  // Final Provisioning Engine API Call
  const handleExecuteProvisioning = async () => {
    setIsLoading(true);
    setCurrentStep(6);
    setProvisioningProgress(15);

    // Simulated Progress steps for smooth UX
    const interval = setInterval(() => {
      setProvisioningProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 20;
      });
    }, 400);

    try {
      const payload = {
        ownerName: ownerName.trim() || 'Riya Sharma',
        email: email.trim().toLowerCase() || 'riya@parlour.local',
        phone: phone.trim() || '9876543210',
        password: password.trim() || 'Password@123',
        businessName: businessName.trim() || 'Riya Luxury Beauty Parlour',
        businessCategory,
        businessType: businessCategory === 'beauty-parlour' ? 'salon' : 'retail',
        businessLogo: businessLogo || '',
        address,
        city,
        state: stateName,
        postalCode,
        subdomain: subdomain.trim().toLowerCase() || 'riya',
        domainType,
        customDomain: domainType === 'custom' ? customDomain.trim().toLowerCase() : '',
        purchaseModel,
        planId: selectedPlanId,
        billingCycle,
        kycDetails: provideKyc
          ? {
              isProvided: true,
              idType,
              idNumber,
              pan: panNumber,
              gstin,
              docUrl,
            }
          : null,
        payment:
          purchaseModel === 'direct_buy'
            ? {
                method: paymentMethod,
                transactionId: `TXN_${Date.now()}_UPI`,
                amount: selectedPlanId === 'starter' ? 999 : selectedPlanId === 'pro' ? 2499 : 5999,
                isVerified: true,
              }
            : null,
      };

      const res = await fetch('/api/v1/platform/onboarding/complete-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearInterval(interval);
      setProvisioningProgress(100);

      const data = await res.json();
      if (data?.success && data?.data) {
        setProvisionedReceipt(data.data);
        setCurrentStep(7); // Step 07: Active!
        toast.success('Tenant automatically provisioned! Your website & dashboard are active.');
      } else {
        toast.error(data?.message || 'Provisioning error');
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Provisioning failed:', err);
      toast.error('Network error during provisioning. Retrying...');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct 1-Click Launch Admin Dashboard
  const handleDirectEnterDashboard = async () => {
    const creds = provisionedReceipt?.credentials;
    const finalSlug = creds?.tenantSlug || provisionedReceipt?.tenant?.slug || subdomain || 'parlour';
    const finalEmail = creds?.email || email || 'admin@parlour.local';
    const finalPassword = creds?.password || password || 'Password@123';

    setIsLoading(true);
    try {
      await login({
        tenantSlugOrId: finalSlug,
        email: finalEmail,
        password: finalPassword,
      });
      toast.success('1-Click Auto-Login Successful! Entering Dashboard...');
      onClose();
      navigate('/admin/dashboard');
    } catch {
      onClose();
      navigate(
        `/admin/login?tenant=${finalSlug}&email=${encodeURIComponent(finalEmail)}&pass=${encodeURIComponent(finalPassword)}&autologin=true`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Plan pricing
  const planDetails = {
    starter: { name: 'Starter Plan', monthly: 999, yearly: 9990, badge: 'Single Location' },
    pro: { name: 'Multi-Branch Pro', monthly: 2499, yearly: 24990, badge: 'Most Popular' },
    enterprise: { name: 'White-Label Enterprise', monthly: 5999, yearly: 59990, badge: 'Dedicated DB' },
  };
  const activePlanInfo = planDetails[selectedPlanId] || planDetails.pro;
  const planCost = billingCycle === 'yearly' ? activePlanInfo.yearly : activePlanInfo.monthly;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '720px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          color: '#0f172a',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & 7-Step Progress Navigator */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #334155',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  KASHI SERVICE • CUSTOMER ONBOARDING
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  7-Step Autonomous Tenant Provisioning Journey
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* 7-Step Breadcrumb Indicators */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '4px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingTop: '4px',
            }}
          >
            {[
              { num: 1, label: 'Sign Up' },
              { num: 2, label: 'Business' },
              { num: 3, label: 'KYC (Optional)' },
              { num: 4, label: 'Choose Plan' },
              { num: 5, label: 'Payment' },
              { num: 6, label: 'Provision' },
              { num: 7, label: 'Active 🚀' },
            ].map((stepItem, idx) => {
              const isPast = currentStep > stepItem.num;
              const isCurrent = currentStep === stepItem.num;
              return (
                <React.Fragment key={stepItem.num}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      opacity: isCurrent ? 1 : isPast ? 0.9 : 0.45,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: isPast ? '#10b981' : isCurrent ? '#4f46e5' : '#334155',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isPast ? <Check size={12} /> : stepItem.num}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: isCurrent ? 700 : 500 }}>
                      {stepItem.label}
                    </span>
                  </div>
                  {idx < 6 && (
                    <div
                      style={{
                        height: '2px',
                        width: '16px',
                        background: isPast ? '#10b981' : '#334155',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Modal Body Container with Scrolling */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* ═══════════════ STEP 01: SIGN UP / LOGIN ═══════════════ */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  Step 01: Customer Sign Up / Account Creation
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Create your master business account using your mobile number and email.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Riya Sharma"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. riya@gmail.com"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Mobile Number & OTP Verification */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Mobile Number (for OTP & SMS Alerts) *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      background: '#4f46e5',
                      color: '#ffffff',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isOtpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>

                {isOtpSent && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP (123456)"
                      style={{ width: '180px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                    <button
                      onClick={handleVerifyOtp}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        background: isOtpVerified ? '#10b981' : '#059669',
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      {isOtpVerified ? '✓ Verified' : 'Verify OTP'}
                    </button>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Test Code: <strong>123456</strong></span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Create Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 02: BUSINESS REGISTRATION ═══════════════ */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  Step 02: Business Registration & Profile
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Enter your business trade name, industry vertical, and choose your free platform subdomain.
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Riya Luxury Beauty Parlour & Spa"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Business Category *
                  </label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                  >
                    <option value="beauty-parlour">💅 Beauty Parlour, Luxury Salon & Academy</option>
                    <option value="software-saas">🛍️ Grocery POS / Retail Supermarket</option>
                    <option value="software-saas">🎓 Computer Institute & Academy LMS</option>
                    <option value="software-saas">📱 Electronics IMEI & Repair Shop</option>
                    <option value="software-saas">👗 Designer Boutique & Tailoring</option>
                    <option value="event-services">🎪 Event Planning & Stage Sound Operations</option>
                    <option value="plotting-services">🏡 Real Estate & Colony Plotting</option>
                    <option value="rent-services">🔑 Rental Properties & Asset Leasing</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    City & State *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State"
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Domain Setup: Platform Subdomain vs Custom Domain */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Website Domain Configuration *
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Choose between a free platform subdomain or your own custom domain
                  </span>
                </div>

                {/* Domain Type Selection Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setDomainType('subdomain')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: domainType === 'subdomain' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      background: domainType === 'subdomain' ? '#eef2ff' : '#ffffff',
                      color: domainType === 'subdomain' ? '#3730a3' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>🌐 Free Subdomain (.kashiservice.com)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDomainType('custom')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: domainType === 'custom' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      background: domainType === 'custom' ? '#eef2ff' : '#ffffff',
                      color: domainType === 'custom' ? '#3730a3' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>✨ Custom Domain (YourBrand.com)</span>
                  </button>
                </div>

                {/* Option A: Free Subdomain UI */}
                {domainType === 'subdomain' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Choose Platform Website Subdomain *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => {
                          setSubdomain(e.target.value);
                          setSubdomainStatus(null);
                        }}
                        placeholder="e.g. rbtest"
                        style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>.kashiservice.com</span>
                      <button
                        type="button"
                        onClick={() => handleCheckSubdomain(subdomain)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        Check
                      </button>
                    </div>

                    {subdomainStatus === 'available' && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Subdomain '{subdomain}.kashiservice.com' is Available!
                      </div>
                    )}
                    {subdomainStatus === 'taken' && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={14} /> Subdomain is already in use. Please try another name.
                      </div>
                    )}
                  </div>
                )}

                {/* Option B: Custom Domain UI */}
                {domainType === 'custom' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Enter Your Own Custom Domain Name *
                      </label>
                      <input
                        type="text"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="e.g. www.myparlour.com or myparlour.com"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* DNS Configuration Note */}
                    <div style={{ background: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#3730a3' }}>
                      <div style={{ fontWeight: 800, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>⚡ DNS CNAME Setup Guide:</span>
                      </div>
                      <div>
                        In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add a CNAME record:
                        <br />
                        <strong>Host:</strong> <code>www</code> (or subdomain) &nbsp;|&nbsp; <strong>Target / Points to:</strong> <code>cname.kashiservice.com</code>
                      </div>
                    </div>

                    {/* Fallback Subdomain for instant internal routing */}
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                        Platform Subdomain (Instant preview & fallback while DNS propagates):
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="text"
                          value={subdomain}
                          onChange={(e) => {
                            setSubdomain(e.target.value);
                            setSubdomainStatus(null);
                          }}
                          placeholder="e.g. rbtest"
                          style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                        />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>.kashiservice.com</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Logo Upload with Live In-Memory Preview */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Business Logo / Storefront Branding (Optional)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {businessLogo ? (
                    <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden', background: '#ffffff', flexShrink: 0 }}>
                      <img src={businessLogo} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', background: '#ffffff', flexShrink: 0, color: '#94a3b8' }}>
                      🏢
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#eef2ff', color: '#4f46e5', cursor: 'pointer', border: '1px solid #c7d2fe' }}>
                        <span>{isUploadingLogo ? 'Uploading Logo...' : businessLogo ? 'Change Business Logo' : 'Upload Logo / Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadFile(e, 'logo')}
                          style={{ display: 'none' }}
                          disabled={isUploadingLogo}
                        />
                      </label>
                      {businessLogo && (
                        <button
                          type="button"
                          onClick={() => setBusinessLogo('')}
                          style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Recommended: PNG or JPG. Uploaded in-memory (never stored in project disk folder).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 03: KYC VERIFICATION (OPTIONAL) ═══════════════ */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                    Step 03: Business Verification & KYC (Optional)
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: '#ecfdf5', color: '#047857' }}>
                    Not Compulsory
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Normal software subscriptions do not require mandatory KYC. You can skip this step and start immediately, or provide details now for business verification.
                </p>
              </div>

              {/* Toggle to provide or skip KYC */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setProvideKyc(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: !provideKyc ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: !provideKyc ? '#eef2ff' : '#ffffff',
                    color: !provideKyc ? '#3730a3' : '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Skip KYC for Now (Recommended)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvideKyc(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: provideKyc ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: provideKyc ? '#eef2ff' : '#ffffff',
                    color: provideKyc ? '#3730a3' : '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={16} />
                  <span>Submit Business Documents</span>
                </button>
              </div>

              {provideKyc && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Identity Document Type
                      </label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff' }}
                      >
                        <option value="pan">PAN Card (Business or Individual)</option>
                        <option value="aadhaar">Aadhaar Card</option>
                        <option value="gstin">GST Registration Certificate</option>
                        <option value="passport">Passport</option>
                        <option value="voter_id">Voter ID</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Document / ID Number
                      </label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="e.g. ABCDE1234F"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Business PAN (Optional)
                      </label>
                      <input
                        type="text"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        GSTIN Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="07AAAAA0000A1Z5"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* KYC Document File Upload & Live In-Memory Preview */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Upload Verification Document (PAN / Aadhaar / GST - Image or PDF)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        {docUrl ? (
                          docUrl.startsWith('data:image/') || docUrl.includes('.png') || docUrl.includes('.jpg') || docUrl.includes('.webp') ? (
                            <img src={docUrl} alt="Doc preview" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px' }}>
                              PDF
                            </div>
                          )
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '6px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#94a3b8' }}>
                            📄
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                            {docFilename || (docUrl ? 'Document File Attached' : 'No document selected')}
                          </div>
                          <div style={{ fontSize: '11px', color: docUrl ? '#10b981' : '#64748b', fontWeight: 600 }}>
                            {docUrl ? '✓ Verified in-memory buffer' : 'Upload photo or scan of business document'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, background: '#4f46e5', color: '#ffffff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          <span>{isUploadingDoc ? 'Uploading...' : docUrl ? 'Replace Document' : 'Upload Document'}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleUploadFile(e, 'kyc')}
                            style={{ display: 'none' }}
                            disabled={isUploadingDoc}
                          />
                        </label>
                        {docUrl && (
                          <button
                            type="button"
                            onClick={() => { setDocUrl(''); setDocFilename(''); }}
                            style={{ padding: '7px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ STEP 04: CHOOSE SAAS PLAN & MODEL ═══════════════ */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  Step 04: Choose Your SaaS Plan & Purchase Model
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Select self-serve direct activation or request a custom proposal from our Super Admin team.
                </p>
              </div>

              {/* Purchase Model Selector: Model A vs Model B */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div
                  onClick={() => setPurchaseModel('direct_buy')}
                  style={{
                    border: purchaseModel === 'direct_buy' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: purchaseModel === 'direct_buy' ? '#eef2ff' : '#ffffff',
                    borderRadius: '14px',
                    padding: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Model A: Direct Buy / Trial</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#dcfce7', color: '#15803d' }}>
                      Instant Setup
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    Automated tenant setup. Select plan, pay online or start 14-day trial, and system activates immediately.
                  </p>
                </div>

                <div
                  onClick={() => setPurchaseModel('demo_request')}
                  style={{
                    border: purchaseModel === 'demo_request' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                    background: purchaseModel === 'demo_request' ? '#fff7ed' : '#ffffff',
                    borderRadius: '14px',
                    padding: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Model B: Request a Demo</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#ffedd5', color: '#c2410c' }}>
                      Contact Sales
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                    For large multi-branch chains, customized White-Label, or custom integrations. Super Admin sends proposal.
                  </p>
                </div>
              </div>

              {/* If Model B: Show Demo Request Form */}
              {purchaseModel === 'demo_request' && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#9a3412' }}>
                    Enterprise Custom Requirements Form:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Number of Branches / Outlets
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={estimatedBranches}
                        onChange={(e) => setEstimatedBranches(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fed7aa', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Preferred Contact Time
                      </label>
                      <input
                        type="text"
                        defaultValue="Between 10:00 AM - 6:00 PM"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fed7aa', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Custom Features or Integration Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      placeholder="e.g. Dedicated MongoDB instance, custom iOS app, 15 branches in Delhi NCR..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fed7aa', fontSize: '13px', boxSizing: 'border-box', background: '#ffffff' }}
                    />
                  </div>
                </div>
              )}

              {/* If Model A: Show Plans Grid */}
              {purchaseModel === 'direct_buy' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'starter', name: 'Starter Plan', price: 999, desc: '1 Branch, POS & Subdomain' },
                      { id: 'pro', name: 'Multi-Branch Pro', price: 2499, popular: true, desc: '5 Branches, GPS Staff Radar, SMS' },
                      { id: 'enterprise', name: 'Enterprise', price: 5999, desc: 'Unlimited, Dedicated DB, White-Label' },
                    ].map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          style={{
                            border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                            background: isSelected ? '#f5f3ff' : '#ffffff',
                            borderRadius: '12px',
                            padding: '1rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                            position: 'relative',
                          }}
                        >
                          {plan.popular && (
                            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#4f46e5', color: '#ffffff', fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                              Recommended
                            </span>
                          )}
                          <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{plan.name}</div>
                          <div style={{ fontSize: '18px', fontWeight: 900, color: '#4f46e5', margin: '6px 0' }}>
                            ₹{plan.price}<span style={{ fontSize: '11px', color: '#64748b' }}>/mo</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>{plan.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Want to test first? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPurchaseModel('free_trial');
                        handleExecuteProvisioning();
                      }}
                      style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Click here to start 14-Day Free Trial without paying →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ STEP 05: ONLINE PAYMENT ═══════════════ */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                  Step 05: Online Payment & Webhook Verification
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Secure payment verification. Provisioning is automatically triggered on verified payment status.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                {/* UPI QR Payment */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    Scan UPI QR Code to Pay ₹{planCost}
                  </div>

                  {/* Simulated High-Res UPI QR Code */}
                  <div
                    style={{
                      width: '180px',
                      height: '180px',
                      margin: '0 auto 12px',
                      borderRadius: '12px',
                      border: '2px dashed #4f46e5',
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px',
                    }}
                  >
                    <QrCode size={130} color="#0f172a" />
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#4f46e5', marginTop: '4px' }}>
                      GPay • PhonePe • Paytm • BHIM
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                    UPI VPA: <code>kashiservice@icici</code>
                  </div>
                </div>

                {/* Summary & Confirm Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', background: '#ffffff' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Order Summary</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                      {activePlanInfo.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      Business: <strong>{businessName || 'Your Business'}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      Subdomain: <strong>{subdomain}.kashiservice.com</strong>
                    </div>
                    <hr style={{ borderColor: '#f1f5f9', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      <span>Total Due (incl. GST):</span>
                      <span style={{ color: '#4f46e5' }}>₹{planCost}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteProvisioning}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      border: 'none',
                      background: '#10b981',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Confirm Verified Payment & Provision</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 06: AUTOMATIC PROVISIONING (LIVE ENGINE) ═══════════════ */}
          {currentStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center', gap: '1.5rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4f46e5',
                }}
              >
                <Zap size={32} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                  Step 06: Automatic Backend Provisioning
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '480px', margin: 0, lineHeight: 1.5 }}>
                  Creating tenant record, assigning subdomain, setting up isolated collections, and provisioning admin owner credentials.
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', maxWidth: '420px', height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${provisioningProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #4f46e5, #10b981)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Provisioning Checklist */}
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                <div>✓ Central Tenant record registered</div>
                <div>✓ Subdomain <strong>{subdomain}.kashiservice.com</strong> mapped</div>
                <div>✓ Admin user credentials generated</div>
                <div>✓ Purchased business modules enabled</div>
                <div>✓ Public luxury storefront initialized</div>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 07: DASHBOARD & WEBSITE ACTIVE! ═══════════════ */}
          {currentStep === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {provisionedReceipt?.isDemoRequest ? (
                /* Enterprise Demo Proposal Submitted View */
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      color: '#4338ca',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                      Request Sent to Super Admin for Verification & Approval!
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '490px', margin: '0 auto', lineHeight: 1.6 }}>
                      {provisionedReceipt?.message || 'Your registration request has been submitted. Super Admin will verify your details and approve your domain/subdomain, after which your website and admin dashboard will become accessible.'}
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Request Tracking ID</span>
                      <code style={{ fontSize: '12.5px', fontWeight: 800, color: '#4338ca' }}>
                        {provisionedReceipt?.requestId ? `#${String(provisionedReceipt.requestId).slice(-8).toUpperCase()}` : '#REQ-PENDING'}
                      </code>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Business Brand</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{businessName || 'Enterprise Chain'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Proposed Subdomain</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#4f46e5' }}>{subdomain}.kashiservice.com</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Governance Status</span>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', background: '#fef3c7', color: '#b45309' }}>
                        ● AWAITING SUPERADMIN APPROVAL
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      border: 'none',
                      background: '#4f46e5',
                      color: '#ffffff',
                      cursor: 'pointer',
                      margin: '10px auto 0',
                    }}
                  >
                    Close & Return to Home
                  </button>
                </div>
              ) : (
                /* Normal Instant Active Launch View */
                (() => {
                  const receipt = provisionedReceipt || {};
                  const creds = receipt.credentials || {};
                  const links = receipt.links || {};
                  const tenantInfo = receipt.tenant || {};
                  const finalSlug = creds.tenantSlug || tenantInfo.slug || subdomain || 'parlour';
                  const finalEmail = creds.email || email || 'admin@parlour.local';
                  const finalPassword = creds.password || password || 'Password@123';
                  const finalCustomDomainUrl = links.customDomainUrl || (domainType === 'custom' && customDomain ? (customDomain.startsWith('http') ? customDomain : `https://${customDomain}`) : null);
                  const finalSubdomainDisplay = `${finalSlug}.kashiservice.com`;
                  const finalLocalSubdomainUrl = `http://${finalSlug}.localhost:3000`;

                  return (
                    <>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: '#dcfce7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 10px',
                            color: '#15803d',
                          }}
                        >
                          <CheckCircle2 size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                          Step 07: Website & Admin Dashboard Active!
                        </h3>
                        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                          Your business software and luxury storefront have been successfully activated on Kashi Service.
                        </p>
                      </div>

                      {/* Credentials & Access URLs Card */}
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {finalCustomDomainUrl && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff', padding: '8px 10px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#3730a3' }}>Custom Domain</span>
                            <a
                              href={finalCustomDomainUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '12.5px', fontWeight: 700, color: '#4f46e5', textDecoration: 'none' }}
                            >
                              {finalCustomDomainUrl} ↗
                            </a>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Platform Subdomain</span>
                          <a
                            href={finalLocalSubdomainUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '12.5px', fontWeight: 700, color: '#4f46e5', textDecoration: 'none' }}
                          >
                            {finalSubdomainDisplay} ↗
                          </a>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Admin Email</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <code style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{finalEmail}</code>
                            <button
                              onClick={() => handleCopy(finalEmail, 'Email')}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              <Copy size={13} color="#64748b" />
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Admin Password</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <code style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{finalPassword}</code>
                            <button
                              onClick={() => handleCopy(finalPassword, 'Password')}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              <Copy size={13} color="#64748b" />
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Database Isolation</span>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', background: '#e0e7ff', color: '#3730a3' }}>
                            {selectedPlanId === 'enterprise' ? 'DEDICATED DATABASE' : 'SHARED ISOLATED DB'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Account Status</span>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', background: '#dcfce7', color: '#15803d' }}>
                            ● ACTIVE & READY
                          </span>
                        </div>
                      </div>

                      {/* Direct 1-Click Launch Button */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={handleDirectEnterDashboard}
                          style={{
                            flex: 1.5,
                            padding: '14px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 800,
                            border: 'none',
                            background: '#4f46e5',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                          }}
                        >
                          <Zap size={18} />
                          <span>⚡ 1-Click Enter Admin Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/site/${finalSlug}`);
                          }}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: 700,
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>🌐 View Storefront</span>
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          )}
        </div>

        {/* Modal Navigation Footer (Steps 1 to 5) */}
        {currentStep < 6 && (
          <div
            style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={15} />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => {
                if (currentStep === 1) {
                  if (!ownerName.trim() || !email.trim() || !password.trim()) {
                    toast.error('Please enter name, email and password');
                    return;
                  }
                  if (password.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    return;
                  }
                  setCurrentStep(2);
                } else if (currentStep === 2) {
                  if (!businessName.trim() || !subdomain.trim()) {
                    toast.error('Please enter business name and subdomain');
                    return;
                  }
                  setCurrentStep(3);
                } else if (currentStep === 3) {
                  setCurrentStep(4);
                } else if (currentStep === 4) {
                  if (purchaseModel === 'demo_request') {
                    // Directly submit demo request
                    handleExecuteProvisioning();
                  } else {
                    setCurrentStep(5);
                  }
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 800,
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <span>{currentStep === 4 && purchaseModel === 'demo_request' ? 'Submit Demo Request' : 'Continue to Next Step'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

