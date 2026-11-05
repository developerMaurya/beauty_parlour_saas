/**
 * @file QuickParlourBuyModal.jsx
 * @description Interactive Modal for Instant Parlour Package Purchase, Trial Booking & Doorstep Reservation.
 * Supports UPI QR Code simulation, Card checkout, and Pay-on-Service.
 * @module frontend/src/modules/public/components/QuickParlourBuyModal
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  CreditCard,
  Banknote,
  Shield,
  ArrowRight,
  Phone,
  User,
  Check,
  Tag,
  Car,
  Home,
  Download,
} from 'lucide-react';
import { PARLOUR_PACKAGES } from '../constants/parlourPackages.js';

export function QuickParlourBuyModal({ isOpen, onClose, initialPackageId = null, isTrial = false }) {
  const [selectedPkgId, setSelectedPkgId] = useState(
    initialPackageId || (isTrial ? 'pkg-trial-voucher' : 'pkg-bridal')
  );
  const [serviceMode, setServiceMode] = useState('in_salon'); // 'in_salon' | 'doorstep'
  const [selectedBranch, setSelectedBranch] = useState('Bandra Flagship Sanctuary');
  const [doorstepAddress, setDoorstepAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'pay_at_salon'
  const [step, setStep] = useState(1); // 1 = Package & Schedule, 2 = Payment Checkout, 3 = Confirmed
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync initialPackageId if changed
  React.useEffect(() => {
    if (initialPackageId) {
      setSelectedPkgId(initialPackageId);
    } else if (isTrial) {
      setSelectedPkgId('pkg-trial-voucher');
    }
  }, [initialPackageId, isTrial]);

  if (!isOpen) return null;

  const currentPkg = PARLOUR_PACKAGES.find((p) => p.id === selectedPkgId) || PARLOUR_PACKAGES[0];
  const doorstepFee = serviceMode === 'doorstep' ? 199 : 0;
  const gstAmount = Math.round(currentPkg.price * 0.18);
  const totalAmount = currentPkg.price + doorstepFee + gstAmount;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and contact phone number.');
      return;
    }
    if (serviceMode === 'doorstep' && !doorstepAddress.trim()) {
      alert('Please provide your full address for doorstep home service.');
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const bookingRecord = {
        bookingId: 'BLS-' + Math.floor(100000 + Math.random() * 900000),
        packageName: currentPkg.name,
        price: currentPkg.price,
        total: totalAmount,
        customerName,
        customerPhone,
        serviceMode,
        branch: selectedBranch,
        doorstepAddress: serviceMode === 'doorstep' ? doorstepAddress : null,
        bookingDate,
        bookingTime,
        paymentMethod,
        paymentStatus: paymentMethod === 'pay_at_salon' ? 'Pending (Pay at Parlour)' : 'Paid Online (Verified)',
      };
      setConfirmedBooking(bookingRecord);
      setStep(3);
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
          maxWidth: '720px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #fce7f3',
          position: 'relative',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #fff1f2 0%, #fff 100%)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🌸</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#881337' }}>
                {step === 1 && 'Select Parlour Package & Schedule'}
                {step === 2 && 'Confirm & Instant Checkout'}
                {step === 3 && 'Booking Confirmed • Parlour Pass'}
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Blossom Luxury Beauty Parlour • 100% Genuine Care Guarantee
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f8fafc',
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

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* STEP 1: Package Selection & Details */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment}>
              {/* Package Carousel / Grid */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Choose Package or Trial Voucher:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {PARLOUR_PACKAGES.map((pkg) => {
                    const isSelected = selectedPkgId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkgId(pkg.id)}
                        style={{
                          border: isSelected ? '2px solid #be185d' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '12px',
                          background: isSelected ? '#fff1f2' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: isSelected ? '0 4px 12px rgba(190, 24, 93, 0.12)' : 'none',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px' }}>{pkg.icon}</span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '999px',
                                background: pkg.trial ? '#fef3c7' : '#ecfdf5',
                                color: pkg.trial ? '#92400e' : '#047857',
                              }}
                            >
                              {pkg.discount}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginTop: '6px' }}>
                            {pkg.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            ⏱️ {pkg.duration}
                          </div>
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#be185d' }}>
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94a3b8' }}>
                            ₹{pkg.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Delivery Mode */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Service Experience:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setServiceMode('in_salon')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: serviceMode === 'in_salon' ? '2px solid #be185d' : '1px solid #e2e8f0',
                      background: serviceMode === 'in_salon' ? '#fff1f2' : '#ffffff',
                      color: serviceMode === 'in_salon' ? '#be185d' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>🏢 Visit Parlour Sanctuary</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceMode('doorstep')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: serviceMode === 'doorstep' ? '2px solid #be185d' : '1px solid #e2e8f0',
                      background: serviceMode === 'doorstep' ? '#fff1f2' : '#ffffff',
                      color: serviceMode === 'doorstep' ? '#be185d' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>🚗 Doorstep Home Service (+₹199)</span>
                  </button>
                </div>
              </div>

              {/* Branch / Address */}
              {serviceMode === 'in_salon' ? (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Select Parlour Branch:
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  >
                    <option value="Bandra Flagship Sanctuary">Bandra Flagship Sanctuary, Linking Road, Mumbai</option>
                    <option value="Cyber City Lounge">Cyber City Executive Lounge, DLF Phase 2, Gurugram</option>
                    <option value="South Extension Spa">South Extension Part 2, New Delhi</option>
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Doorstep Delivery Address:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter flat, building, society and landmark..."
                    value={doorstepAddress}
                    onChange={(e) => setDoorstepAddress(e.target.value)}
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
              )}

              {/* Schedule Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Preferred Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
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
                    Preferred Time Slot:
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  >
                    <option value="10:00 AM">10:00 AM - 11:30 AM</option>
                    <option value="11:30 AM">11:30 AM - 01:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:30 PM</option>
                    <option value="04:00 PM">04:00 PM - 05:30 PM</option>
                    <option value="06:00 PM">06:00 PM - 07:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Customer Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    WhatsApp / Phone Number:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
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

              {/* Action Buttons */}
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
                    background: '#be185d',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(190, 24, 93, 0.25)',
                  }}
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment & Order Confirmation */}
          {step === 2 && (
            <div>
              {/* Order Summary Pill */}
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
                      {currentPkg.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {serviceMode === 'doorstep' ? '🚗 Doorstep Visit' : `🏢 In-Salon (${selectedBranch})`} • {bookingDate} at {bookingTime}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#be185d' }}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      (Incl. 18% GST ₹{gstAmount})
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Select Payment Method:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'upi', label: 'UPI / QR Code', icon: <QrCode size={18} /> },
                    { id: 'card', label: 'Card / NetBanking', icon: <CreditCard size={18} /> },
                    { id: 'pay_at_salon', label: 'Pay at Parlour', icon: <Banknote size={18} /> },
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
                          border: isSelected ? '2px solid #be185d' : '1px solid #cbd5e1',
                          background: isSelected ? '#fff1f2' : '#ffffff',
                          color: isSelected ? '#be185d' : '#475569',
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
                  {/* Mock UPI QR Graphic */}
                  <div
                    style={{
                      width: '140px',
                      height: '140px',
                      margin: '10px auto',
                      background: '#ffffff',
                      border: '2px dashed #be185d',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      color: '#be185d',
                    }}
                  >
                    <QrCode size={56} />
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>KASHI•UPI•VERIFIED</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    UPI ID: <strong>blossombeauty@icici</strong>
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
                    Secure 256-Bit SSL Card Checkout
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
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'pay_at_salon' && (
                <div
                  style={{
                    background: '#fffbeb',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #fde68a',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
                  <Banknote size={24} color="#b45309" />
                  <div style={{ fontSize: '0.82rem', color: '#92400e' }}>
                    <strong>Pay-on-Service Selected:</strong> You will pay ₹{totalAmount.toLocaleString('en-IN')} via Cash, Card or UPI directly to your beautician after your service is completed.
                  </div>
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
                  onClick={handleCompleteOrder}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#be185d',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(190, 24, 93, 0.25)',
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Confirm & Book Appointment (₹{totalAmount.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmed Parlour Pass */}
          {step === 3 && confirmedBooking && (
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
                Booking & Digital Pass Confirmed!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem' }}>
                We've sent an instant SMS & WhatsApp confirmation with your digital pass.
              </p>

              {/* Digital Pass Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fff1f2 0%, #fff 100%)',
                  border: '2px solid #fecdd3',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  maxWidth: '440px',
                  margin: '0 auto 1.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #fecdd3', paddingBottom: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#881337', textTransform: 'uppercase' }}>
                    BLOSSOM BEAUTY PASS
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#be185d' }}>
                    ID: {confirmedBooking.bookingId}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                  {confirmedBooking.packageName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  Guest: <strong>{confirmedBooking.customerName}</strong> • {confirmedBooking.customerPhone}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Slot: <strong>{confirmedBooking.bookingDate} at {confirmedBooking.bookingTime}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Mode: <strong>{confirmedBooking.serviceMode === 'doorstep' ? 'Doorstep Home Service' : confirmedBooking.branch}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #fecdd3' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#047857' }}>
                    Status: {confirmedBooking.paymentStatus}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#be185d' }}>
                    ₹{confirmedBooking.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Finished Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => alert('Digital Pass saved to downloads.')}
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
                  <span>Download Pass</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#be185d',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { PARLOUR_PACKAGES };
export default QuickParlourBuyModal;
