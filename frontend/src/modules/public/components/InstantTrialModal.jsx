/**
 * @file InstantTrialModal.jsx
 * @description 14-Day Free Trial Application & Callback Request Modal.
 * Collects client business details and phone number so the sales / support team can call them
 * to configure their customized 14-day trial environment.
 * @module frontend/src/modules/public/components/InstantTrialModal
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  User,
  Phone,
  FileText,
  Send,
  Zap,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext.jsx';

export default function InstantTrialModal({ isOpen, onClose, service = null, onOpenCustomWizard }) {
  const toast = useToast();

  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vertical, setVertical] = useState(service?.id || 'beauty-parlour');
  const [callbackTime, setCallbackTime] = useState('asap');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerName.trim() || !phone.trim() || !email.trim()) {
      toast.error('Please fill in your name, phone number, and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ownerName: ownerName.trim(),
        businessName: businessName.trim() || `${ownerName.trim()}'s Business`,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        serviceCategory: vertical,
        requirements: `Preferred Callback: ${callbackTime.toUpperCase()}${notes.trim() ? ` | Notes: ${notes.trim()}` : ''}`,
      };

      const res = await fetch('/api/v1/platform/onboarding/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        setSubmittedReceipt(data.data || { requestId: `REQ-${Date.now().toString().slice(-6)}` });
        toast.success('14-Day Trial & Callback Request Submitted! Expect a call soon.');
      } else {
        toast.error(data?.message || 'Could not submit request. Please try again.');
      }
    } catch (err) {
      console.error('Trial callback request error:', err);
      toast.error('Network error while submitting request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedReceipt(null);
    onClose();
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
      onClick={handleResetAndClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <PhoneCall size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Apply for 14-Day Free Trial
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                Request your custom sandbox & get an onboarding callback
              </div>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto' }}>
          {submittedReceipt ? (
            /* Success Receipt View */
            <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                  Trial Application Received!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '440px', margin: '0 auto', lineHeight: 1.5 }}>
                  Thank you, <strong>{ownerName}</strong>. Our Kashi Service onboarding team has received your 14-day trial application.
                </p>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Tracking ID:</span>
                  <code style={{ fontSize: '12.5px', fontWeight: 800, color: '#4f46e5' }}>
                    #{String(submittedReceipt.requestId || '').slice(-8).toUpperCase() || 'REQ-REGISTERED'}
                  </code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Callback Number:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>+91 {phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Preferred Window:</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', textTransform: 'capitalize' }}>
                    {callbackTime === 'asap' ? '⚡ Within 15-30 Mins (ASAP)' : `${callbackTime} Window`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Status:</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', background: '#fef3c7', color: '#b45309' }}>
                    ● QUEUED FOR CALL
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleResetAndClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  Close & Explore Platform
                </button>
                <button
                  onClick={() => {
                    handleResetAndClose();
                    if (onOpenCustomWizard) onOpenCustomWizard();
                  }}
                  style={{
                    flex: 1.2,
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 800,
                    border: 'none',
                    background: '#4f46e5',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  💳 Buy SaaS Directly →
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: '#166534',
                }}
              >
                <Sparkles size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                <span>
                  Our onboarding specialist will call you, explain features, and setup your personalized 14-day trial instance!
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Riya Sharma"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Business / Salon Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Royal Beauty Parlour"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Phone Number (for Call) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. riya@gmail.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Interested Software Vertical *
                </label>
                <select
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="beauty-parlour">💅 Beauty Parlour & Luxury Salon ERP</option>
                  <option value="software-saas">🛍️ Software SaaS Suite (Grocery POS, LMS, Retail)</option>
                  <option value="event-services">🎪 Event Services & Stage Operations</option>
                  <option value="plotting-services">🏡 Real Estate & Colony Plotting</option>
                  <option value="rent-services">🔑 Rental Properties & Asset Leasing</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  When should we call you?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'asap', label: '⚡ ASAP (Within 15-30 Mins)' },
                    { id: 'morning', label: '🌅 Morning (10 AM - 1 PM)' },
                    { id: 'afternoon', label: '☀️ Afternoon (2 PM - 5 PM)' },
                    { id: 'evening', label: '🌆 Evening (6 PM - 9 PM)' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setCallbackTime(opt.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: callbackTime === opt.id ? 800 : 500,
                        border: callbackTime === opt.id ? '1.5px solid #4f46e5' : '1px solid #cbd5e1',
                        background: callbackTime === opt.id ? '#eef2ff' : '#ffffff',
                        color: callbackTime === opt.id ? '#3730a3' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Notes / Specific Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. We have 2 branches and need live GPS staff radar..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                }}
              >
                <PhoneCall size={16} />
                <span>{isSubmitting ? 'Submitting Application...' : '📞 Submit Application & Request Call'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
