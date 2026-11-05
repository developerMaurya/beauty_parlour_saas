/**
 * @file SaaSPurchaseModal.jsx
 * @description Multi-Tenant SaaS Purchase & Commercial Licensing Modal.
 * Supports Plan selection, UPI QR payment simulation, Card checkout, and Instant License Provisioning.
 * @module frontend/src/modules/public/components/SaaSPurchaseModal
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Shield,
  Sparkles,
  ArrowRight,
  Download,
  Building,
  Key,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext.jsx';

export default function SaaSPurchaseModal({ isOpen, onClose, service = null }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedPlanId, setSelectedPlanId] = useState('pro'); // 'starter' | 'pro' | 'enterprise'
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'invoice'
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [step, setStep] = useState(1); // 1: Plan & Buyer Info, 2: Payment, 3: License Generated
  const [isProcessing, setIsProcessing] = useState(false);
  const [licenseData, setLicenseData] = useState(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter Business',
      monthlyPrice: 1999,
      annualPrice: 19990,
      badge: 'Single Location',
      features: ['1 Branch / Studio', 'Up to 5 Staff Users', 'Cloud POS & Billing', 'Free Subdomain + SSL'],
    },
    {
      id: 'pro',
      name: 'Multi-Branch Pro Chain',
      monthlyPrice: 4999,
      annualPrice: 49990,
      badge: 'Most Popular',
      popular: true,
      features: ['Up to 5 Branches', 'Live GPS Staff Tracking Radar', 'Custom Domain (YourBrand.com)', 'WhatsApp & SMS Alerts'],
    },
    {
      id: 'enterprise',
      name: 'Full White-Label Enterprise',
      monthlyPrice: 9999,
      annualPrice: 99990,
      badge: 'Dedicated DB & Unlimited',
      features: ['Unlimited Branches & Staff', 'Isolated Dedicated Database Option', 'Full Cosmetology Academy LMS', '24/7 Priority Support'],
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];
  const basePrice = billingCycle === 'annual' ? currentPlan.annualPrice : currentPlan.monthlyPrice;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gstAmount;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim() || !businessName.trim()) {
      alert('Please fill in your name, email, phone and business name.');
      return;
    }
    setStep(2);
  };

  const handleCompletePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedLicense = {
        licenseKey: 'KASHI-' + (service?.id?.toUpperCase().substring(0, 3) || 'SaaS') + '-2026-' + Math.floor(100000 + Math.random() * 900000),
        planName: currentPlan.name,
        serviceName: service?.name || 'Beauty Parlour & Salon ERP',
        businessName,
        buyerName,
        buyerEmail,
        totalPaid: totalPrice,
        billingCycle,
        activatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
      setLicenseData(generatedLicense);
      setStep(3);
      toast.success('SaaS License activated successfully!');
    }, 1200);
  };

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '740px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #eef2ff 0%, #fff 100%)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>💳</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Purchase {service?.name || 'SaaS Business Platform'} License
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Instant activation • Free custom domain setup • Zero lock-in
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* STEP 1: Plan Selection & Buyer Info */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment}>
              {/* Billing Cycle Toggle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: billingCycle === 'monthly' ? 800 : 600,
                      border: 'none',
                      background: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                      color: billingCycle === 'monthly' ? '#0f172a' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: billingCycle === 'annual' ? 800 : 600,
                      border: 'none',
                      background: billingCycle === 'annual' ? '#ffffff' : 'transparent',
                      color: billingCycle === 'annual' ? '#0f172a' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    Annual Billing (Get 2 Months Free)
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
                {plans.map((p) => {
                  const isSelected = selectedPlanId === p.id;
                  const price = billingCycle === 'annual' ? p.annualPrice : p.monthlyPrice;
                  const cycleText = billingCycle === 'annual' ? '/year' : '/mo';

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      style={{
                        border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '14px',
                        background: isSelected ? '#eef2ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: isSelected ? '#4338ca' : '#64748b', textTransform: 'uppercase' }}>
                          {p.badge}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '4px 0' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4f46e5', margin: '6px 0 10px' }}>
                          ₹{price.toLocaleString('en-IN')}{' '}
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{cycleText}</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {p.features.map((f, fi) => (
                            <li key={fi} style={{ fontSize: '11px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle2 size={13} color={isSelected ? '#4f46e5' : '#059669'} style={{ flexShrink: 0 }} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Buyer & Business Registration Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Business / Brand Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Elegance Beauty Parlour"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Owner / Administrator Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunita Verma"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Business Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@yourbrand.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    WhatsApp / Phone:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                  }}
                >
                  <span>Continue to Payment (₹{totalPrice.toLocaleString('en-IN')})</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Checkout Method */}
          {step === 2 && (
            <div>
              {/* Order Summary */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                      {businessName} • {currentPlan.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {service?.name || 'SaaS Platform'} ({billingCycle === 'annual' ? 'Annual Subscription' : 'Monthly Subscription'})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4f46e5' }}>
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      (Includes 18% GST ₹{gstAmount.toLocaleString('en-IN')})
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Choose Payment Gateway:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'upi', label: 'Instant UPI / QR Code', icon: <QrCode size={18} /> },
                    { id: 'card', label: 'Cards / NetBanking', icon: <CreditCard size={18} /> },
                    { id: 'invoice', label: 'Corporate GST Invoice', icon: <Banknote size={18} /> },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                          background: isSelected ? '#eef2ff' : '#ffffff',
                          color: isSelected ? '#4338ca' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Method Detail View */}
              {paymentMethod === 'upi' && (
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Scan QR to Pay via GPay, PhonePe, Paytm or BHIM
                  </div>
                  <div
                    style={{
                      width: '140px',
                      height: '140px',
                      margin: '10px auto',
                      background: '#ffffff',
                      border: '2px dashed #4f46e5',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      color: '#4f46e5',
                    }}
                  >
                    <QrCode size={56} />
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>KASHI•MERCHANT•PAY</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Merchant UPI ID: <strong>billing@kashiservice</strong>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Secure 256-Bit SSL Business Card Checkout
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      marginBottom: '8px',
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'invoice' && (
                <div
                  style={{
                    background: '#ecfdf5',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #a7f3d0',
                    marginBottom: '1.5rem',
                    fontSize: '0.82rem',
                    color: '#065f46',
                  }}
                >
                  <strong>Corporate GST Invoice Option:</strong> Pro-forma invoice will be auto-generated and dispatched to <strong>{buyerEmail}</strong> with RTGS/NEFT bank details. Instant license credentials will be issued upon payment confirmation.
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleCompletePurchase}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                >
                  {isProcessing ? (
                    <span>Provisioning SaaS License...</span>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Confirm & Purchase License (₹{totalPrice.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: License Confirmed */}
          {step === 3 && licenseData && (
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
                  margin: '0 auto 1rem',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                SaaS License Provisioned Successfully!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem' }}>
                Your business tenant has been activated with enterprise credentials.
              </p>

              {/* License Certificate Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #eef2ff 0%, #fff 100%)',
                  border: '2px solid #c7d2fe',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  maxWidth: '480px',
                  margin: '0 auto 1.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #c7d2fe', paddingBottom: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3730a3', textTransform: 'uppercase' }}>
                    KASHI SERVICE COMMERCIAL LICENSE
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
                    ● ACTIVE
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  {licenseData.businessName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  Product: <strong>{licenseData.serviceName}</strong> ({licenseData.planName})
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  License Key: <code style={{ color: '#4f46e5', fontWeight: 800 }}>{licenseData.licenseKey}</code>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Licensed To: <strong>{licenseData.buyerName}</strong> ({licenseData.buyerEmail})
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #c7d2fe' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                    Total Paid: ₹{licenseData.totalPaid.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Activated: {licenseData.activatedAt}
                  </span>
                </div>
              </div>

              {/* Finished Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => alert('License Certificate and Tax Invoice downloaded.')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Download size={16} />
                  <span>Download License</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/admin/login?tenant=blossom-salon&autologin=true');
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Open Admin Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

