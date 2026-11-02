/**
 * @file CustomerBookingPage.jsx
 * @description Comprehensive Salon Treatment & Home Service Booking Engine.
 * Features branch selection, stylist preference, server-side coupon validation,
 * double-booking prevention, 18% GST preview, and instant appointment creation.
 * @module frontend/src/modules/customer/pages/CustomerBookingPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as serviceApi from '../../../services/api/customer/serviceFetcher.js';
import * as branchApi from '../../../services/api/public/branchFetcher.js';
import * as staffApi from '../../../services/api/public/staffFetcher.js';
import * as couponApi from '../../../services/api/customer/couponFetcher.js';
import * as aptApi from '../../../services/api/customer/appointmentFetcher.js';
import { useCustomer } from '../../../context/CustomerContext.jsx';

export default function CustomerBookingPage() {
  const { customer, activeBranch } = useCustomer();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [serviceMode, setServiceMode] = useState('IN_BRANCH');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('11:00');
  const [homeAddress, setHomeAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [svcRes, brRes, staffRes] = await Promise.allSettled([
          serviceApi.getServices(),
          branchApi.getBranches(),
          staffApi.getStaff(),
        ]);

        if (svcRes.status === 'fulfilled' && svcRes.value?.data) {
          const list = Array.isArray(svcRes.value.data) ? svcRes.value.data : (svcRes.value.data?.services || []);
          setServices(list);

          const preselectedSvcId = searchParams.get('serviceId');
          if (preselectedSvcId) {
            setSelectedServices([preselectedSvcId]);
          } else if (list.length > 0) {
            setSelectedServices([list[0]._id]);
          }
        }

        if (brRes.status === 'fulfilled' && brRes.value?.data) {
          const brList = Array.isArray(brRes.value.data) ? brRes.value.data : (brRes.value.data?.branches || []);
          setBranches(brList);
          if (activeBranch?._id) {
            setSelectedBranch(activeBranch._id);
          } else if (brList.length > 0) {
            setSelectedBranch(brList[0]._id);
          }
        }

        if (staffRes.status === 'fulfilled' && staffRes.value?.data) {
          const stList = Array.isArray(staffRes.value.data) ? staffRes.value.data : (staffRes.value.data?.staff || []);
          setStaffList(stList);
        }
      } catch (err) {
        console.warn('Booking data load error:', err.message);
      }
    }
    loadData();
  }, [searchParams, activeBranch]);

  // Price calculations
  const rawSubtotal = selectedServices.reduce((sum, sId) => {
    const s = services.find((x) => x._id === sId);
    return sum + (s?.price || 0);
  }, 0);

  const taxableAmount = Math.max(0, rawSubtotal - couponDiscount);
  const taxAmount = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + taxAmount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponMsg('');
    try {
      const res = await couponApi.validateCoupon({ code: couponCode, orderAmount: rawSubtotal });
      setCouponDiscount(res.data?.discountAmount || 0);
      setCouponMsg(`Coupon applied: ₹${res.data?.discountAmount} off!`);
    } catch (err) {
      setCouponDiscount(0);
      setCouponMsg(err?.message || 'Invalid or expired coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleToggleService = (sId) => {
    if (selectedServices.includes(sId)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((id) => id !== sId));
      }
    } else {
      setSelectedServices([...selectedServices, sId]);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBranch) {
      setError('Please select a salon branch.');
      return;
    }
    if (selectedServices.length === 0) {
      setError('Please select at least one treatment service.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        branchId: selectedBranch,
        staffId: selectedStaff || null,
        serviceMode: serviceMode === 'HOME_SERVICE' ? 'HOME_SERVICE' : 'IN_BRANCH',
        serviceIds: selectedServices,
        date,
        scheduledStartTime: startTime,
        durationMinutes: 60,
        customerAddress: serviceMode === 'HOME_SERVICE' ? { street: homeAddress } : {},
        couponCode: couponDiscount > 0 ? couponCode : '',
        notes,
      };

      const res = await aptApi.createAppointment(payload);
      const newAptId = res?.data?._id;
      navigate(`/customer/appointments/${newAptId}`);
    } catch (err) {
      setError(err?.message || 'Appointment booking failed. Please choose another slot or staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
          Book Salon & Home Services
        </h1>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
          Select your treatments, schedule a time slot with our master stylists, and review server-verified pricing.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '14px 18px', borderRadius: '12px', fontSize: '13.5px', marginBottom: '24px' }}>
          ✕ {error}
        </div>
      )}

      <form onSubmit={handleSubmitBooking} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Form Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Branch & Mode Selection */}
          <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px' }}>
              1. Location & Service Mode
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Salon Branch *</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13.5px' }}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.city || 'Central'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Service Mode</label>
                <select
                  value={serviceMode}
                  onChange={(e) => setServiceMode(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13.5px' }}
                >
                  <option value="IN_BRANCH">🏢 In-Salon Appointment</option>
                  <option value="HOME_SERVICE">🏡 Home Service (Doorstep Care)</option>
                </select>
              </div>
            </div>

            {serviceMode === 'HOME_SERVICE' && (
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Doorstep Delivery Address *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Flat/House No., Building, Street, Landmark"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>
            )}
          </div>

          {/* Service Selection */}
          <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px' }}>
              2. Select Treatments
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {services.map((s) => {
                const isSelected = selectedServices.includes(s._id);
                return (
                  <div
                    key={s._id}
                    onClick={() => handleToggleService(s._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'rgba(236, 72, 153, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#f8fafc' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>⏱️ {s.durationMinutes || 45} mins</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>₹{s.price}</div>
                      <input type="checkbox" checked={isSelected} readOnly />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date, Time & Staff Preference */}
          <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px' }}>
              3. Date, Time & Stylist
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13.5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Start Time Slot *</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13.5px' }}
                >
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Preferred Stylist (Optional)</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13.5px' }}
              >
                <option value="">Any Available Senior Stylist</option>
                {staffList.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.name} ({st.designation || 'Stylist'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Special Instructions / Customer Notes</label>
              <input
                type="text"
                placeholder="e.g. Skin sensitivity, allergy alert, preferred music"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Summary Checkout Card */}
        <div style={{ background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '24px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
            Appointment Summary
          </h3>

          {/* Coupon Code Section */}
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12.5px', textTransform: 'uppercase' }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={validatingCoupon}
                style={{ background: 'rgba(236, 72, 153, 0.2)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#ec4899', borderRadius: '8px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <div style={{ fontSize: '12px', color: couponDiscount > 0 ? '#34d399' : '#f87171', marginTop: '6px' }}>
                {couponMsg}
              </div>
            )}
          </div>

          {/* Calculated Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span>Services Subtotal:</span>
              <span>₹{rawSubtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                <span>Coupon Discount:</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Applicable GST (18%):</span>
              <span>₹{taxAmount}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 800, color: '#f8fafc' }}>
              <span>Final Total:</span>
              <span style={{ color: '#10b981' }}>₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)',
            }}
          >
            {submitting ? 'Confirming Appointment...' : 'Confirm & Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
