/**
 * @file GlobalCustomerProfileModal.jsx
 * @description In-page Customer Profile & Bookings Modal (Amazon/Flipkart Style).
 * Allows the customer to view/edit their basic info (Name, Email, Mobile) and inspect all their service requests.
 * @module frontend/src/components/common/GlobalCustomerProfileModal
 */

import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { X, User, Mail, Phone, Calendar, Clock, CheckCircle2, MessageSquare, LogOut, Edit2, Save, Sparkles, AlertCircle } from 'lucide-react';

export default function GlobalCustomerProfileModal() {
  const {
    customer,
    profileModalOpen,
    closeProfileModal,
    profileModalTab,
    setProfileModalTab,
    updateProfile,
    logout,
    myBookings,
  } = useCustomer();

  const { addToast } = useToast() || { addToast: () => {} };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
    }
  }, [customer]);

  if (!profileModalOpen || !customer) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      setIsEditing(false);
      addToast?.('Profile updated successfully!', 'success');
    } catch (err) {
      addToast?.(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getServiceBadge = (type) => {
    switch (type) {
      case 'parlour':
        return { label: '💄 Beauty Parlour', bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' };
      case 'plotting':
        return { label: '🏡 Kashi Plotting', bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'rent':
        return { label: '🏢 Office & Godam Rent', bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'events':
        return { label: '🔱 Jay Gurudev Events', bg: '#fefce8', text: '#ca8a04', border: '#fef08a' };
      case 'software':
        return { label: '💻 RB Software Hub', bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' };
      case 'photography':
        return { label: '📸 RB 4K Studio', bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
      default:
        return { label: '✨ Service Request', bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfileModal();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          margin: 'auto',
          maxHeight: '92vh',
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
              }}
            >
              {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                {customer?.name || 'Customer Profile'}
              </h2>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{customer?.email || customer?.phone || 'Global Account'}</div>
            </div>
          </div>

          <button
            onClick={closeProfileModal}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 1.75rem',
            gap: '1.25rem',
          }}
        >
          <button
            onClick={() => setProfileModalTab('profile')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: profileModalTab === 'profile' ? '2px solid #38bdf8' : '2px solid transparent',
              color: profileModalTab === 'profile' ? '#ffffff' : '#94a3b8',
              padding: '10px 4px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Personal Info
          </button>
          <button
            onClick={() => setProfileModalTab('bookings')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: profileModalTab === 'bookings' ? '2px solid #38bdf8' : '2px solid transparent',
              color: profileModalTab === 'bookings' ? '#ffffff' : '#94a3b8',
              padding: '10px 4px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>My Bookings & Inquiries</span>
            {myBookings.length > 0 && (
              <span style={{ background: '#38bdf8', color: '#0f172a', fontSize: '10.5px', fontWeight: 900, padding: '1px 6px', borderRadius: '10px' }}>
                {myBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: PERSONAL INFO */}
          {profileModalTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                  BASIC CUSTOMER INFORMATION
                </span>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Edit2 size={13} /> Edit Info
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>FULL NAME</div>
                    <div style={{ fontSize: '14.5px', color: '#ffffff', fontWeight: 700, marginTop: '2px' }}>{customer.name || 'Not provided'}</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</div>
                    <div style={{ fontSize: '14.5px', color: '#ffffff', fontWeight: 700, marginTop: '2px' }}>{customer.email || 'Not provided'}</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>MOBILE NUMBER (WHATSAPP)</div>
                    <div style={{ fontSize: '14.5px', color: '#ffffff', fontWeight: 700, marginTop: '2px' }}>{customer.phone || 'Not provided'}</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>ACCOUNT ID</div>
                      <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: 700 }}>{customer.id || customer.customerNumber || 'CUST-ACTIVE'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>STATUS</div>
                      <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700 }}>Active Global Member</div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                      color: '#0f172a',
                      border: 'none',
                      padding: '11px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '6px',
                    }}
                  >
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: MY BOOKINGS & INQUIRIES */}
          {profileModalTab === 'bookings' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                ALL SERVICE REQUESTS ACROSS THE ECOSYSTEM
              </div>

              {myBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋✨</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>No service requests yet</div>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', maxWidth: '320px', margin: '4px auto 0' }}>
                    When you book a salon treatment, reserve a plot, rent an office space, book wedding decor, or request software, your requests will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {myBookings.map((b) => {
                    const badge = getServiceBadge(b.serviceType);
                    return (
                      <div
                        key={b.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          padding: '14px 16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              background: badge.bg,
                              color: badge.text,
                              border: `1px solid ${badge.border}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {badge.label}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              background: b.status === 'Confirmed' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(250, 204, 21, 0.2)',
                              color: b.status === 'Confirmed' ? '#4ade80' : '#facc15',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {b.status || 'Pending'}
                          </span>
                        </div>

                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                          {b.serviceName || 'Custom Service Request'}
                        </div>

                        {(b.eventDate || b.timeSlot) && (
                          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            {b.eventDate && <span>📅 Date: {b.eventDate}</span>}
                            {b.timeSlot && <span>⏰ Time: {b.timeSlot}</span>}
                          </div>
                        )}

                        {b.notes && (
                          <div style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '6px', marginBottom: '8px' }}>
                            "{b.notes}"
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '8px', marginTop: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            ID: {b.id}
                          </span>
                          <a
                            href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello, I want to inquire about my booking ID: ' + b.id + ' (' + b.serviceName + ')')}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: '11.5px',
                              color: '#22c55e',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <MessageSquare size={13} /> WhatsApp Support
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar with Logout */}
        <div
          style={{
            padding: '12px 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b' }}>Signed in as {customer.email || customer.name}</span>
          <button
            onClick={() => {
              logout();
              addToast?.('Logged out successfully', 'info');
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
