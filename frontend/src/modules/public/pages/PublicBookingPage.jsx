/**
 * @file PublicBookingPage.jsx
 * @description Public & Guest Instant Booking Flow.
 * Allows non-logged-in visitors to reserve appointments with automated customer account linking.
 * @module frontend/src/modules/public/pages/PublicBookingPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as guestApi from '../../../services/api/guest/bookingFetcher.js';
import * as srvApi from '../../../services/api/public/serviceFetcher.js';
import * as brApi from '../../../services/api/public/branchFetcher.js';

export default function PublicBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    serviceId: searchParams.get('serviceId') || '',
    branchId: searchParams.get('branchId') || '',
    bookingType: 'IN_BRANCH', // 'IN_BRANCH' | 'HOME_SERVICE'
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '11:00',
    // Guest info
    name: '',
    phone: '',
    email: '',
    notes: '',
    // Home service address
    address: {
      house: '',
      street: '',
      area: '',
      city: 'Mumbai',
      pincode: ''
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        setLoadingInitial(true);
        const [sRes, bRes] = await Promise.allSettled([
          srvApi.getServices(),
          brApi.getBranches()
        ]);
        if (sRes.status === 'fulfilled' && sRes.value.data?.success) {
          const sList = sRes.value.data.data?.services || sRes.value.data.data || [];
          setServices(sList);
          if (!formData.serviceId && sList.length > 0) {
            setFormData(prev => ({ ...prev, serviceId: sList[0]._id || sList[0].id }));
          }
        }
        if (bRes.status === 'fulfilled' && bRes.value.data?.success) {
          const bList = bRes.value.data.data?.branches || bRes.value.data.data || [];
          setBranches(bList);
          if (!formData.branchId && bList.length > 0) {
            setFormData(prev => ({ ...prev, branchId: bList[0]._id || bList[0].id }));
          }
        }
      } catch (err) {
        console.error('Failed to initialize booking options', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    init();
  }, []);

  const selectedService = services.find(s => (s._id || s.id) === formData.serviceId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!formData.serviceId) {
      setMsg({ type: 'error', text: 'Please select a salon treatment.' });
      return;
    }
    if (!formData.branchId && formData.bookingType === 'IN_BRANCH') {
      setMsg({ type: 'error', text: 'Please choose a salon branch.' });
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim()) {
      setMsg({ type: 'error', text: 'Please provide your full name and phone number.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        serviceId: formData.serviceId,
        branchId: formData.branchId || (branches[0]?._id || branches[0]?.id),
        bookingType: formData.bookingType,
        date: formData.date,
        startTime: formData.startTime,
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        notes: formData.notes,
        address: formData.bookingType === 'HOME_SERVICE' ? formData.address : undefined
      };

      const res = await guestApi.createGuestBooking(payload);
      if (res.data?.success) {
        setBookingConfirmed(res.data.data);
      }
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to complete guest booking. Please check slot availability.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingConfirmed) {
    const apt = bookingConfirmed.appointment || bookingConfirmed;
    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '24px',
          padding: '2.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#10b981'
          }}>
            ✓
          </div>

          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Booking Confirmed!
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', margin: 0 }}>
            Your salon appointment has been reserved. A confirmation SMS has been dispatched.
          </p>

          <div style={{
            width: '100%',
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Appointment Reference:</span>
              <strong style={{ color: '#ec4899' }}>{apt.appointmentNumber || apt._id || 'CONFIRMED'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Treatment:</span>
              <strong style={{ color: '#f8fafc' }}>{selectedService?.name || 'Salon Treatment'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Date & Time:</span>
              <strong style={{ color: '#f8fafc' }}>{formData.date} at {formData.startTime}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Type:</span>
              <strong style={{ color: '#cbd5e1' }}>{formData.bookingType}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <span style={{ color: '#94a3b8' }}>Estimated Total:</span>
              <strong style={{ color: '#10b981', fontSize: '1.125rem' }}>₹{apt.finalAmount || selectedService?.price || 0}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
            <button
              onClick={() => navigate('/customer/login')}
              style={{
                flex: 1,
                padding: '0.875rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Access Customer Portal
            </button>
            <button
              onClick={() => navigate('/public')}
              style={{
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#cbd5e1',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
          Reserve Salon Appointment
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>
          Book as guest in seconds. We will create or link your client profile automatically.
        </p>
      </div>

      {msg.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${msg.type === 'error' ? '#ef4444' : '#10b981'}`,
          color: msg.type === 'error' ? '#ef4444' : '#10b981',
          fontSize: '0.875rem'
        }}>
          {msg.text}
        </div>
      )}

      {loadingInitial ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading salon menu...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}>
          {/* Step 1: Treatment & Location Type */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.125rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              1. Treatment & Experience
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Select Treatment</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                >
                  {services.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.name} (₹{s.price || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Service Mode</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, bookingType: 'IN_BRANCH' })}
                    style={{
                      flex: 1,
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: formData.bookingType === 'IN_BRANCH' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : '#0f172a',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    In Salon
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, bookingType: 'HOME_SERVICE' })}
                    style={{
                      flex: 1,
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: formData.bookingType === 'HOME_SERVICE' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : '#0f172a',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    Home Service
                  </button>
                </div>
              </div>
            </div>

            {formData.bookingType === 'IN_BRANCH' ? (
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Salon Branch</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                >
                  {branches.map(b => (
                    <option key={b._id || b.id} value={b._id || b.id}>
                      {b.name} — {b.address || 'Main Branch'}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#0f172a', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase' }}>Home Delivery Address</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat #"
                    value={formData.address.house}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, house: e.target.value } })}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', fontSize: '0.8125rem' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street / Road"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', fontSize: '0.8125rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Area / Locality"
                    value={formData.address.area}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, area: e.target.value } })}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', fontSize: '0.8125rem' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={formData.address.pincode}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Date & Slot */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.125rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              2. Appointment Schedule
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Preferred Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Time Slot</label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                >
                  {['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                    <option key={t} value={t}>{t} HRS</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Guest Contact Details */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.125rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              3. Guest Contact & Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Email Address (Optional for Invoice)</label>
              <input
                type="email"
                placeholder="priya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
              />
            </div>
          </div>

          {/* Pricing Summary & Submit */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Total Estimated Amount</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                ₹{selectedService?.price || 0}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)'
              }}
            >
              {submitting ? 'Confirming Reservation...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
