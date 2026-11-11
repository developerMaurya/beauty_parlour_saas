/**
 * @file GlobalCustomerProfileModal.jsx
 * @description Comprehensive In-Page Customer Portal & Service Hub (Amazon/Flipkart Style).
 * Delivers full suite of customer capabilities:
 *   - 👤 Personal Profile Management & Real-time Update
 *   - 📅 Appointments & Bookings (Beauty Parlour, 4K Cinema Studio)
 *   - 📋 Inquiries & Business Requests (Plotting, Office Rent, Events, Software Hub)
 *   - 📍 Live Service & Delivery Tracker (Step-by-step progress)
 *   - 💳 Financial Ledger, Payment History & Invoices
 *   - ❤️ Saved Services & Wishlist with 1-click booking
 *   - 🔒 Security, Password Change & Google OAuth Status
 * @module frontend/src/components/common/GlobalCustomerProfileModal
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCustomer } from '../../context/CustomerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  MessageSquare,
  LogOut,
  Edit2,
  Save,
  Sparkles,
  AlertCircle,
  Heart,
  CreditCard,
  Compass,
  FileText,
  ShieldCheck,
  MapPin,
  Trash2,
  ArrowRight,
  Printer,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export default function GlobalCustomerProfileModal() {
  const {
    customer,
    profileModalOpen,
    closeProfileModal,
    profileModalTab,
    setProfileModalTab,
    updateProfile,
    logout,
    myBookings = [],
    cancelBooking,
    wishlist = [],
    toggleWishlist,
    payments = [],
    changePassword,
    submitServiceBooking,
  } = useCustomer();

  const { addToast } = useToast() || { addToast: () => {} };

  // Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  // Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  // Filter for bookings
  const [bookingFilter, setBookingFilter] = useState('ALL');

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setCity(customer.city || 'Varanasi, UP');
    }
  }, [customer]);

  if (!profileModalOpen || !customer) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
      });
      setIsEditing(false);
      addToast?.('Profile updated successfully!', 'success');
    } catch (err) {
      addToast?.(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast?.('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast?.('Passwords do not match', 'error');
      return;
    }
    setUpdatingPass(true);
    try {
      await changePassword({ oldPassword, newPassword });
      addToast?.('Password updated successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast?.(err.message || 'Password update failed', 'error');
    } finally {
      setUpdatingPass(false);
    }
  };

  const getServiceBadge = (type) => {
    switch (type) {
      case 'parlour':
        return { label: '💄 Golden Beauty Parlour', bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' };
      case 'plotting':
        return { label: '🏡 Kashi Plotting & Land', bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'rent':
        return { label: '🏢 Office & Commercial Rent', bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'events':
        return { label: '🔱 Jay Gurudev Event Decor', bg: '#fefce8', text: '#ca8a04', border: '#fef08a' };
      case 'software':
        return { label: '💻 RB Software Hub', bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' };
      case 'photography':
        return { label: '📸 RB 4K Cinema Studio', bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
      default:
        return { label: '✨ Kashi Service', bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' };
      case 'in progress':
      case 'in-progress':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'completed':
        return { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(250, 204, 21, 0.15)', text: '#facc15', border: 'rgba(250, 204, 21, 0.3)' };
    }
  };

  // Split bookings vs inquiries
  const appointmentList = myBookings.filter((b) => b.serviceType === 'parlour' || b.serviceType === 'photography');
  const inquiryList = myBookings.filter((b) => b.serviceType !== 'parlour' && b.serviceType !== 'photography');

  // Filtered list for tab 'bookings'
  const displayBookings = myBookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    if (bookingFilter === 'PENDING') return b.status === 'Pending' || !b.status;
    if (bookingFilter === 'CONFIRMED') return b.status === 'Confirmed';
    if (bookingFilter === 'COMPLETED') return b.status === 'Completed';
    return true;
  });

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '1.5rem 1rem',
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
          maxWidth: '720px',
          margin: 'auto',
          maxHeight: '94vh',
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {customer?.profilePhoto ? (
              <img
                src={customer.profilePhoto}
                alt={customer?.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #38bdf8',
                  boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 900,
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                }}
              >
                {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                  {customer?.name || 'Customer Profile'}
                </h2>
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  ✓ Verified
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                {customer?.email || customer?.phone} · Account ID: {customer.id || customer.customerNumber || 'CUST-ACTIVE'}
              </div>
            </div>
          </div>

          <button
            onClick={closeProfileModal}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Horizontal Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 1.25rem',
            gap: '0.5rem',
            overflowX: 'auto',
            background: 'rgba(15, 23, 42, 0.6)',
            scrollbarWidth: 'none',
          }}
        >
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'bookings', label: 'Bookings & Orders', icon: Calendar, count: myBookings.length },
            { id: 'inquiries', label: 'Inquiries', icon: FileText, count: inquiryList.length },
            { id: 'tracking', label: 'Live Tracker', icon: Compass },
            { id: 'payments', label: 'Payments & Ledger', icon: CreditCard, count: payments.length },
            { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: wishlist.length },
            { id: 'security', label: 'Security', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = profileModalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProfileModalTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2.5px solid #38bdf8' : '2.5px solid transparent',
                  color: active ? '#38bdf8' : '#94a3b8',
                  padding: '12px 10px',
                  fontSize: '12.5px',
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    style={{
                      background: active ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)',
                      color: active ? '#0f172a' : '#cbd5e1',
                      fontSize: '10px',
                      fontWeight: 900,
                      padding: '1px 6px',
                      borderRadius: '8px',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, maxHeight: 'calc(94vh - 150px)' }}>
          {/* TAB 1: PERSONAL INFO */}
          {profileModalTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                    CUSTOMER IDENTITY & CONTACT DETAILS
                  </span>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Unified profile valid across Beauty Parlour, Event Decor, Plotting, Rent & Software
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Edit2 size={13} /> Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      color: '#94a3b8',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>FULL NAME</div>
                    <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, marginTop: '3px' }}>
                      {customer.name || 'Not provided'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</div>
                    <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, marginTop: '3px' }}>
                      {customer.email || 'Not provided'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>MOBILE / WHATSAPP NUMBER</div>
                    <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, marginTop: '3px' }}>
                      {customer.phone || 'Not provided'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>SERVICE CITY & ADDRESS</div>
                    <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, marginTop: '3px' }}>
                      {customer.address ? `${customer.address}, ${customer.city || 'Varanasi'}` : customer.city || 'Varanasi, UP'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>AUTHENTICATION TYPE</div>
                      <div style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 700, marginTop: '2px' }}>
                        {customer.authProvider === 'GOOGLE' ? '🌐 Google OAuth 2.0 (Single Sign-On)' : '🔑 Email & Password Account'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>ACCOUNT STATUS</div>
                      <div style={{ fontSize: '13px', color: '#4ade80', fontWeight: 700, marginTop: '2px' }}>
                        Active Global Customer
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
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
                          boxSizing: 'border-box',
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
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                        Mobile / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                        City / Region
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Varanasi, UP"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                        Address / Landmark (For Home Services & Deliveries)
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Near Shivpur Ring Road, Varanasi"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                      color: '#0f172a',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '8px',
                      boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)',
                    }}
                  >
                    <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: MY BOOKINGS & APPOINTMENTS */}
          {profileModalTab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                    ALL BOOKINGS & SERVICE ORDERS
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Live status and instant WhatsApp coordination
                  </div>
                </div>

                {/* Filter pills */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setBookingFilter(f)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: 'none',
                        background: bookingFilter === f ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                        color: bookingFilter === f ? '#0f172a' : '#94a3b8',
                        cursor: 'pointer',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {displayBookings.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📅✨</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff' }}>No bookings matching criteria</div>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', maxWidth: '360px', margin: '6px auto 0' }}>
                    Browse our services (Beauty treatments, 4K Studio, Event Decor, Plotting, Office rentals) to place your first booking!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {displayBookings.map((b) => {
                    const badge = getServiceBadge(b.serviceType);
                    const statusStyle = getStatusColor(b.status);
                    return (
                      <div
                        key={b.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '14px 18px',
                          transition: 'all 0.2s ease',
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
                              background: statusStyle.bg,
                              color: statusStyle.text,
                              border: `1px solid ${statusStyle.border}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {b.status || 'Pending'}
                          </span>
                        </div>

                        <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                          {b.serviceName || 'Custom Service Order'}
                        </div>

                        {(b.eventDate || b.timeSlot || b.budget) && (
                          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            {b.eventDate && <span>📅 Date: {b.eventDate}</span>}
                            {b.timeSlot && <span>⏰ Slot: {b.timeSlot}</span>}
                            {b.budget && <span>💰 Estimate: {b.budget}</span>}
                          </div>
                        )}

                        {b.notes && (
                          <div style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '6px', marginBottom: '8px' }}>
                            "{b.notes}"
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', marginTop: '6px', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            Booking ID: <strong style={{ color: '#94a3b8' }}>{b.id}</strong>
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {b.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to cancel this booking?')) {
                                    cancelBooking(b.id);
                                    addToast?.('Booking cancelled', 'info');
                                  }
                                }}
                                style={{
                                  background: 'none',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#f87171',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                }}
                              >
                                Cancel
                              </button>
                            )}

                            <a
                              href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello Kashi Services, regarding my booking ID ' + b.id + ' (' + b.serviceName + '): ')}`}
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
                                background: 'rgba(34, 197, 94, 0.1)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(34, 197, 94, 0.25)',
                              }}
                            >
                              <MessageSquare size={12} /> WhatsApp Desk
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INQUIRIES & PROJECT REQUESTS */}
          {profileModalTab === 'inquiries' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '4px' }}>
                SPECIALIZED BUSINESS INQUIRIES & LEAD TRACKER
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '1rem' }}>
                Plotting land bookings, commercial space rentals, wedding event decor & custom software projects
              </div>

              {inquiryList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋✨</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>No custom inquiries submitted yet</div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                    When you inquire about plots in Varanasi, office spaces, wedding setups, or web apps, they will be tracked here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {inquiryList.map((inq) => {
                    const badge = getServiceBadge(inq.serviceType);
                    return (
                      <div
                        key={inq.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          padding: '12px 16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, background: badge.bg, color: badge.text, padding: '2px 8px', borderRadius: '6px' }}>
                            {badge.label}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                            {inq.status || 'In Review'}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>{inq.serviceName}</div>
                        {inq.notes && <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>"{inq.notes}"</div>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>ID: {inq.id}</span>
                          <a
                            href={`https://wa.me/917651972973?text=${encodeURIComponent('Inquiry details for ' + inq.id + ': ' + inq.serviceName)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '11px', color: '#22c55e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                          >
                            <MessageSquare size={11} /> Chat with Executive
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LIVE SERVICE TRACKER */}
          {profileModalTab === 'tracking' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '4px' }}>
                LIVE SERVICE LIFECYCLE & EXECUTION TRACKER
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '1.25rem' }}>
                End-to-end transparent progress for all active customer orders
              </div>

              {myBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📍🗺️</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>No active services to track</div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                    Active bookings show step-by-step progress, assigned staff, and timing right here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myBookings.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '16px 18px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>{item.serviceName}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Tracking ID: {item.id}</div>
                        </div>
                        <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                          {item.status || 'Active Order'}
                        </span>
                      </div>

                      {/* 4-Step Progress Stepper */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '14px', position: 'relative' }}>
                        {[
                          { title: '1. Received', desc: 'Logged & Verified', done: true },
                          { title: '2. Assigned', desc: 'Team Allocated', done: true },
                          { title: '3. In Action', desc: 'Service / Visit', done: item.status === 'Confirmed' || item.status === 'Completed' },
                          { title: '4. Delivered', desc: 'Sign-Off & Review', done: item.status === 'Completed' },
                        ].map((step, idx) => (
                          <div key={idx} style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: step.done ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                                color: step.done ? '#0f172a' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 6px',
                                fontWeight: 900,
                                fontSize: '12px',
                              }}
                            >
                              {step.done ? '✓' : idx + 1}
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: step.done ? '#ffffff' : '#64748b' }}>{step.title}</div>
                            <div style={{ fontSize: '9.5px', color: step.done ? '#94a3b8' : '#475569' }}>{step.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FINANCIAL LEDGER & PAYMENTS */}
          {profileModalTab === 'payments' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '4px' }}>
                PAYMENT HISTORY & INVOICE LEDGER
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '1.25rem' }}>
                Official receipts, advance records & downloadable billing vouchers
              </div>

              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>💳🧾</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>No transaction records yet</div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                    When you book a service or pay an advance, your invoices and receipts will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff' }}>{p.serviceName}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Invoice #{p.id} · Date: {p.date} · Mode: {p.paymentMethod}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 900, color: '#22c55e' }}>{p.amount}</div>
                          <div style={{ fontSize: '10px', color: '#a5b4fc', fontWeight: 700 }}>{p.status}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            window.print();
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title="Print / Save Receipt"
                        >
                          <Printer size={12} /> Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: WISHLIST & SAVED SERVICES */}
          {profileModalTab === 'wishlist' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '4px' }}>
                MY SAVED SERVICES & WISHLIST
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '1.25rem' }}>
                Services you saved for future bookings across beauty, events, real estate and media
              </div>

              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>❤️✨</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Your wishlist is empty</div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                    Browse our services and click the heart icon to save services for quick booking.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span style={{ fontSize: '10.5px', fontWeight: 800, background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '2px 8px', borderRadius: '6px' }}>
                            {item.category || 'Service'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item)}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}
                            title="Remove from saved"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#38bdf8', marginBottom: '10px' }}>{item.price}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          submitServiceBooking({
                            serviceName: item.name,
                            serviceType: item.serviceType || 'general',
                            budget: item.price,
                          });
                          addToast?.(`Booking placed for ${item.name}!`, 'success');
                          setProfileModalTab('bookings');
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Sparkles size={13} /> Book This Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SECURITY & PASSWORD */}
          {profileModalTab === 'security' && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '4px' }}>
                SECURITY CREDENTIALS & ACCOUNT PROTECTION
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '1.25rem' }}>
                Manage authentication, access tokens and sign-in protection
              </div>

              {customer.authProvider === 'GOOGLE' ? (
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌐🔒</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                    Authenticated via Google OAuth 2.0
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', maxWidth: '440px', margin: '8px auto 0', lineHeight: 1.5 }}>
                    Your customer account is securely linked with your official Google Account (<strong>{customer.email}</strong>).
                    You do not need a password, and your login is protected by Google 2-Step Verification!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPass}
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '11px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: updatingPass ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '6px',
                    }}
                  >
                    <KeyRound size={15} /> {updatingPass ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
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
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Signed in as <strong>{customer.email || customer.name}</strong>
          </span>

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
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
