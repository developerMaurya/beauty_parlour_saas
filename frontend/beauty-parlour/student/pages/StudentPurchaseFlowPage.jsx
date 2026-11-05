import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  planFetcher,
  courseFetcher,
  serviceFetcher,
  purchaseFetcher
} from '../../../api/student';

export default function StudentPurchaseFlowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPlanId = queryParams.get('planId') || '';
  const initialCourseId = queryParams.get('courseId') || '';

  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [services, setServices] = useState([]);
  
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const [pRes, cRes, sRes] = await Promise.allSettled([
          planFetcher.getAll(),
          courseFetcher.getAll(),
          serviceFetcher.getAll()
        ]);
        if (pRes.status === 'fulfilled' && pRes.value.success) {
          setPlans(pRes.value.data || []);
        }
        if (cRes.status === 'fulfilled' && cRes.value.success) {
          setCourses(cRes.value.data || []);
        }
        if (sRes.status === 'fulfilled' && sRes.value.success) {
          setServices(sRes.value.data || []);
        }
      } catch (err) {
        setError('Failed to load catalog');
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const selectedPlan = plans.find(p => p._id === selectedPlanId);
  const selectedCourse = courses.find(c => c._id === selectedCourseId);

  const toggleService = (svc) => {
    if (selectedServices.some(s => s._id === svc._id)) {
      setSelectedServices(selectedServices.filter(s => s._id !== svc._id));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  // Pricing calculations
  const baseFee = (selectedPlan?.finalPrice || selectedPlan?.price) || (selectedCourse?.fee) || 0;
  const servicesFee = selectedServices.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const admissionFee = selectedPlan?.admissionFee || 500;
  const subtotal = baseFee + servicesFee + admissionFee;
  const tax = Math.round(subtotal * 0.18);
  const total = Math.max(0, subtotal + tax - discountAmount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'GLOW2026') {
      setDiscountAmount(1000);
      alert('Coupon GLOW2026 applied! ₹1,000 discount awarded.');
    } else {
      alert('Invalid coupon code. Try GLOW2026');
    }
  };

  const handleCompletePurchase = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        planId: selectedPlanId || undefined,
        courseId: selectedCourseId || undefined,
        additionalServices: selectedServices.map(s => s._id),
        paymentMethod,
        couponCode: couponCode || undefined
      };

      const res = await purchaseFetcher.create(payload);
      if (res.success) {
        setOrderComplete(res.data);
      } else {
        setError(res.message || 'Purchase processing failed');
      }
    } catch (err) {
      setError(err.message || 'Error executing purchase');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>🛒</div>
        <div>Loading checkout & pricing engine...</div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', background: '#1e293b', border: '1px solid #10b981', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>
          ✓
        </div>
        <h2 style={{ color: '#f8fafc', margin: '0 0 8px' }}>Enrollment Confirmed!</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
          Thank you for joining our academy. Your seat and training schedule are officially registered.
        </p>
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', textAlign: 'left', marginBottom: '24px', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Order Reference:</span>
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{orderComplete.orderId || orderComplete._id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Total Amount Paid:</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>₹{orderComplete.finalAmount?.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Payment Method:</span>
            <span style={{ color: '#f8fafc' }}>{orderComplete.paymentMethod}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/student/enrollments')}
            style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Go to My Enrollments
          </button>
          <button
            onClick={() => navigate('/student/dashboard')}
            style={{ background: '#334155', color: '#f8fafc', fontWeight: 600, padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Course & Plan Enrollment Checkout
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Secure, verified multi-tier admissions with real-time course fee calculation.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Step Indicators */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        {[
          { num: 1, label: '1. Select Plan / Course' },
          { num: 2, label: '2. Additional Services' },
          { num: 3, label: '3. Order Summary & Pay' }
        ].map(s => (
          <div
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              background: step === s.num ? '#1e293b' : '#0f172a',
              border: step === s.num ? '1px solid #f59e0b' : '1px solid #334155',
              color: step === s.num ? '#f59e0b' : '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              textAlign: 'center',
              cursor: s.num < step ? 'pointer' : 'default'
            }}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* STEP 1: Plan / Course Selection */}
      {step === 1 && (
        <div>
          <h3 style={{ color: '#f8fafc', marginBottom: '16px' }}>Choose your Learning Track</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase' }}>
              Option A: Complete Academic Plans (Recommended)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {plans.map(p => (
                <div
                  key={p._id}
                  onClick={() => { setSelectedPlanId(p._id); setSelectedCourseId(''); }}
                  style={{
                    background: '#1e293b',
                    padding: '20px',
                    borderRadius: '12px',
                    border: selectedPlanId === p._id ? '2px solid #f59e0b' : '1px solid #334155',
                    cursor: 'pointer',
                    transition: 'border 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#f8fafc' }}>{p.name}</div>
                    <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px' }}>₹{(p.finalPrice || p.price)?.toLocaleString()}</div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0 12px' }}>{p.description}</p>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Duration: {p.duration} {p.durationUnit}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase' }}>
              Option B: Single Specialized Course
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {courses.map(c => (
                <div
                  key={c._id}
                  onClick={() => { setSelectedCourseId(c._id); setSelectedPlanId(''); }}
                  style={{
                    background: '#1e293b',
                    padding: '20px',
                    borderRadius: '12px',
                    border: selectedCourseId === c._id ? '2px solid #f59e0b' : '1px solid #334155',
                    cursor: 'pointer',
                    transition: 'border 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#f8fafc' }}>{c.name}</div>
                    <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '18px' }}>₹{c.fee?.toLocaleString()}</div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0 12px' }}>{c.description}</p>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Duration: {c.duration} {c.durationUnit}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              disabled={!selectedPlanId && !selectedCourseId}
              onClick={() => setStep(2)}
              style={{
                background: (!selectedPlanId && !selectedCourseId) ? '#475569' : '#f59e0b',
                color: '#000',
                fontWeight: 700,
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                cursor: (!selectedPlanId && !selectedCourseId) ? 'not-allowed' : 'pointer'
              }}
            >
              Continue to Step 2 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Additional Services */}
      {step === 2 && (
        <div>
          <h3 style={{ color: '#f8fafc', marginBottom: '8px' }}>Add-on Training & Starter Equipment</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
            Enhance your curriculum with optional hands-on toolkits, specialty workshops, or advanced certifications.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
            {(services.length > 0 ? services : [
              { _id: 'kit-01', name: 'Professional Pro Makeup Vanity & Brush Kit', price: 8500, category: 'Equipment' },
              { _id: 'air-02', name: 'Airbrush Compressor Masterclass & Hands-on Lab', price: 5000, category: 'Workshop' },
              { _id: 'hair-03', name: 'Advanced Bridal Hair Updo Intensive', price: 4000, category: 'Workshop' }
            ]).map(svc => {
              const isChecked = selectedServices.some(s => s._id === svc._id);
              return (
                <div
                  key={svc._id}
                  onClick={() => toggleService(svc)}
                  style={{
                    background: '#1e293b',
                    padding: '18px',
                    borderRadius: '10px',
                    border: isChecked ? '2px solid #f59e0b' : '1px solid #334155',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      style={{ transform: 'scale(1.2)', accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '15px' }}>{svc.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Category: {svc.category || 'Specialized Training'}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '16px' }}>
                    +₹{svc.price?.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setStep(1)}
              style={{ background: '#334155', color: '#f8fafc', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              Proceed to Review & Pay →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Order Review & Instant Checkout */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Order Summary Column */}
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '14px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Review Order Details</h3>
            
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid #334155', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Selected Track</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                {selectedPlan?.name || selectedCourse?.name}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Duration: {selectedPlan?.duration || selectedCourse?.duration} {selectedPlan?.durationUnit || selectedCourse?.durationUnit}
              </div>
            </div>

            {selectedServices.length > 0 && (
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #334155', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Additional Services</div>
                {selectedServices.map(s => (
                  <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>• {s.name}</span>
                    <span>₹{s.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Fee Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Base Tuition Fee</span>
                <span>₹{baseFee.toLocaleString()}</span>
              </div>
              {servicesFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Additional Services</span>
                  <span>₹{servicesFee.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Registration / Admission Fee</span>
                <span>₹{admissionFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '12px', marginTop: '4px', fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>
                <span>Final Payable Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter Coupon (e.g. GLOW2026)"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', fontSize: '13px' }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                style={{ background: '#334155', color: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Payment Method Column */}
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '14px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Select Payment Method</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { id: 'UPI', title: 'UPI Instant (GPay / PhonePe / Paytm)', icon: '📱' },
                { id: 'CARD', title: 'Credit / Debit Card (Visa / Mastercard)', icon: '💳' },
                { id: 'NETBANKING', title: 'Net Banking (All Major Indian Banks)', icon: '🏦' },
                { id: 'CASH', title: 'Cash Deposit at Branch Desk', icon: '💵' }
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    background: '#0f172a',
                    padding: '16px',
                    borderRadius: '10px',
                    border: paymentMethod === m.id ? '2px solid #f59e0b' : '1px solid #334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{m.icon}</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{m.title}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '14px', borderRadius: '8px', fontSize: '12px', color: '#fbbf24', marginBottom: '24px', lineHeight: 1.5 }}>
              🛡️ <strong>Instant Verification:</strong> Upon successful submission, your course registration and unique admission serial will be created on the central ledger immediately.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(2)}
                style={{ background: '#334155', color: '#f8fafc', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
              >
                ← Back
              </button>
              <button
                disabled={submitting}
                onClick={handleCompletePurchase}
                style={{
                  flex: 1,
                  background: submitting ? '#475569' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '15px',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                }}
              >
                {submitting ? 'Processing Payment...' : `Confirm & Pay ₹${total.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
