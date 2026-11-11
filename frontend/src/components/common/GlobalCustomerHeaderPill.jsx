/**
 * @file GlobalCustomerHeaderPill.jsx
 * @description Ultra-Luxury Unified Header Profile Component & Dropdown Menu.
 * Replaces disconnected raw buttons with an Apple/Google/Airbnb-level cohesive customer profile chip.
 * Displays user photo/monogram, live status, and a full-featured dropdown portal.
 * @module frontend/src/components/common/GlobalCustomerHeaderPill
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext.jsx';
import GlobalCustomerAuthModal from './GlobalCustomerAuthModal.jsx';
import GlobalCustomerProfileModal from './GlobalCustomerProfileModal.jsx';
import {
  LogIn,
  User,
  Calendar,
  LogOut,
  ChevronDown,
  Sparkles,
  Heart,
  CreditCard,
  Compass,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function GlobalCustomerHeaderPill({ theme = 'dark' }) {
  const {
    customer,
    isAuthenticated,
    openAuthModal,
    openProfileModal,
    logout,
    myBookings = [],
    wishlist = [],
    payments = [],
  } = useCustomer();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLight = theme === 'light';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleOpenTab = (tab) => {
    setDropdownOpen(false);
    openProfileModal(tab);
  };

  const activeCount = myBookings.filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled').length;

  return (
    <>
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        {isAuthenticated && customer ? (
          <div>
            {/* Unified Professional Profile Chip */}
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '5px 12px 5px 6px',
                borderRadius: '999px',
                background: dropdownOpen
                  ? isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.12)'
                  : isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.75)',
                border: dropdownOpen
                  ? '1.5px solid #38bdf8'
                  : isLight ? '1.5px solid #e2e8f0' : '1.5px solid rgba(255, 255, 255, 0.15)',
                boxShadow: dropdownOpen
                  ? '0 0 0 3px rgba(56, 189, 248, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(12px)',
                userSelect: 'none',
              }}
              title="Click to open Customer Menu & Services"
            >
              {/* Avatar with Verified Status Indicator */}
              <div style={{ position: 'relative' }}>
                {customer?.profilePhoto ? (
                  <img
                    src={customer.profilePhoto}
                    alt={customer?.name || 'Customer'}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid #38bdf8',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '13px',
                      letterSpacing: '0.02em',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                {/* Active Green Dot */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '9px',
                    height: '9px',
                    background: '#22c55e',
                    border: '2px solid #0f172a',
                    borderRadius: '50%',
                  }}
                />
              </div>

              {/* Customer Name & Dynamic Badge */}
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: isLight ? '#0f172a' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Hi, {customer?.name ? customer.name.split(' ')[0] : 'Customer'}</span>
                </div>
                <div
                  style={{
                    fontSize: '10.5px',
                    color: activeCount > 0 ? '#38bdf8' : isLight ? '#64748b' : '#94a3b8',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {activeCount > 0 ? (
                    <span>● {activeCount} Active {activeCount === 1 ? 'Service' : 'Services'}</span>
                  ) : (
                    <span>Customer Portal</span>
                  )}
                </div>
              </div>

              {/* Chevron Down Arrow */}
              <ChevronDown
                size={14}
                style={{
                  color: isLight ? '#64748b' : '#94a3b8',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  marginLeft: '2px',
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '320px',
                  background: isLight ? '#ffffff' : '#0f172a',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  boxShadow: isLight
                    ? '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.1)',
                  padding: '12px',
                  zIndex: 100000,
                  color: isLight ? '#0f172a' : '#f8fafc',
                  backdropFilter: 'blur(20px)',
                  animation: 'dropdownFadeIn 0.15s ease-out',
                }}
              >
                {/* Header Profile Identity Card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '14px',
                    border: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '10px',
                  }}
                >
                  {customer?.profilePhoto ? (
                    <img
                      src={customer.profilePhoto}
                      alt={customer?.name || 'Customer'}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #38bdf8',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '17px',
                        boxShadow: '0 4px 10px rgba(239, 68, 68, 0.35)',
                      }}
                    >
                      {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: isLight ? '#0f172a' : '#ffffff',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {customer?.name || 'Customer'}
                    </div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: isLight ? '#64748b' : '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {customer?.email || customer?.phone || 'Customer Account'}
                    </div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '3px',
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: '#22c55e',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 800,
                      }}
                    >
                      <CheckCircle2 size={10} /> Verified Customer
                    </div>
                  </div>
                </div>

                {/* Quick Stats Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenTab('bookings')}
                    style={{
                      background: isLight ? '#eff6ff' : 'rgba(56, 189, 248, 0.08)',
                      border: isLight ? '1px solid #dbeafe' : '1px solid rgba(56, 189, 248, 0.2)',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#38bdf8' }}>{myBookings.length}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isLight ? '#1e40af' : '#94a3b8' }}>Bookings</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('wishlist')}
                    style={{
                      background: isLight ? '#fdf2f8' : 'rgba(244, 63, 94, 0.08)',
                      border: isLight ? '1px solid #fce7f3' : '1px solid rgba(244, 63, 94, 0.2)',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#f43f5e' }}>{wishlist.length}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isLight ? '#9d174d' : '#94a3b8' }}>Saved</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('payments')}
                    style={{
                      background: isLight ? '#f0fdf4' : 'rgba(34, 197, 94, 0.08)',
                      border: isLight ? '1px solid #dcfce7' : '1px solid rgba(34, 197, 94, 0.2)',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#22c55e' }}>{payments.length}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isLight ? '#166534' : '#94a3b8' }}>Invoices</div>
                  </button>
                </div>

                {/* Primary Menu Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenTab('profile')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: isLight ? '#334155' : '#e2e8f0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <User size={15} color="#38bdf8" />
                      <span>My Profile & Settings</span>
                    </div>
                    <ArrowRight size={13} color="#64748b" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('bookings')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: isLight ? '#334155' : '#e2e8f0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Calendar size={15} color="#ec4899" />
                      <span>Appointments & Bookings</span>
                    </div>
                    {myBookings.length > 0 && (
                      <span
                        style={{
                          background: '#ec4899',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '1px 6px',
                          borderRadius: '8px',
                        }}
                      >
                        {myBookings.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('inquiries')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: isLight ? '#334155' : '#e2e8f0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={15} color="#8b5cf6" />
                      <span>Inquiries & Requests</span>
                    </div>
                    <ArrowRight size={13} color="#64748b" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('tracking')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: isLight ? '#334155' : '#e2e8f0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Compass size={15} color="#10b981" />
                      <span>Live Service Tracker</span>
                    </div>
                    <ArrowRight size={13} color="#64748b" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('payments')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: isLight ? '#334155' : '#e2e8f0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CreditCard size={15} color="#f59e0b" />
                      <span>Payment History & Invoices</span>
                    </div>
                    <ArrowRight size={13} color="#64748b" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('wishlist')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: isLight ? '#334155' : '#e2e8f0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Heart size={15} color="#f43f5e" />
                      <span>Saved / Wishlist</span>
                    </div>
                    <ArrowRight size={13} color="#64748b" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTab('security')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: isLight ? '#334155' : '#e2e8f0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={15} color="#06b6d4" />
                      <span>Security & Password</span>
                    </div>
                    <ArrowRight size={13} color="#64748b" />
                  </button>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
                    margin: '8px 0',
                  }}
                />

                {/* Logout Action */}
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isLight ? '#fff1f2' : 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isLight ? '#fff1f2' : 'rgba(239, 68, 68, 0.12)';
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal(null, 'Sign in or create an account to book and manage services')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <LogIn size={15} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>

      {/* Global Modals Mounted Automatically */}
      <GlobalCustomerAuthModal />
      <GlobalCustomerProfileModal />
    </>
  );
}
