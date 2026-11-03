/**
 * @file CustomerLayout.jsx
 * @description State-of-the-art Customer Portal Layout.
 * Features glassmorphic design, active tracking ticker, branch selector,
 * dynamic sidebar with notification badges, and responsive drawer.
 * @module frontend/src/layouts/CustomerLayout
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext.jsx';

export default function CustomerLayout() {
  const { customer, activeBranch, activeAppointment, unreadCount, logout } = useCustomer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/customer/login');
  };

  const navSections = [
    {
      title: 'Appointments & Tracking',
      items: [
        { label: 'Dashboard', path: '/customer/dashboard', icon: '✨' },
        { label: 'Book Appointment', path: '/customer/book', icon: '📅' },
        { label: 'Appointments', path: '/customer/appointments', icon: '🕒' },
        { label: 'Live Service Tracking', path: '/customer/appointments/tracking', icon: '📍' },
        { label: 'Appointment History', path: '/customer/appointments/history', icon: '📜' },
      ],
    },
    {
      title: 'Catalog & Salon Packages',
      items: [
        { label: 'Beauty Services', path: '/customer/services', icon: '💇‍♀️' },
        { label: 'Salon Packages', path: '/customer/packages', icon: '🎁' },
        { label: 'My Packages & Sessions', path: '/customer/packages/my', icon: '🎟️' },
        { label: 'Exclusive Offers', path: '/customer/offers', icon: '🏷️' },
        { label: 'Favorites', path: '/customer/favorites', icon: '💖' },
      ],
    },
    {
      title: 'Billing & Ledger',
      items: [
        { label: 'Payments & Balance', path: '/customer/payments', icon: '💳' },
        { label: 'Tax Invoices', path: '/customer/payments/invoices', icon: '🧾' },
        { label: 'Refund Requests', path: '/customer/refund-requests', icon: '🔄' },
      ],
    },
    {
      title: 'History & Ratings',
      items: [
        { label: 'Service History', path: '/customer/services/history', icon: '📖' },
        { label: 'Salon Visits', path: '/customer/visits', icon: '🏢' },
        { label: 'Verified Reviews', path: '/customer/reviews', icon: '⭐' },
      ],
    },
    {
      title: 'Communication & Vault',
      items: [
        { label: 'Salon Chat', path: '/customer/chat', icon: '💬' },
        { label: 'Notifications', path: '/customer/notifications', icon: '🔔', badge: unreadCount },
        { label: 'Helpdesk Tickets', path: '/customer/requests', icon: '🎫' },
        { label: 'Saved Addresses', path: '/customer/addresses', icon: '🏡' },
        { label: 'Treatment Documents', path: '/customer/documents', icon: '📁' },
        { label: 'Calendar', path: '/customer/calendar', icon: '📆' },
        { label: 'Customer Dossier & Reports', path: '/customer/reports', icon: '📊' },
        { label: 'Journey Timeline', path: '/customer/timeline', icon: '🧭' },
        { label: 'Account & Security', path: '/customer/settings', icon: '⚙️' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0d14', color: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(10, 13, 20, 0.98) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(236, 72, 153, 0.3)',
                fontSize: '22px',
              }}
            >
              💄
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 30%, #e2e8f0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                LUXE SALON
              </div>
              <div style={{ fontSize: '11px', color: '#ec4899', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Customer Portal
              </div>
            </div>
          </div>

          {activeBranch && (
            <div style={{ marginTop: '14px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '14px' }}>📍</span>
              <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeBranch.name || 'Primary Branch'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {navSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.08em', padding: '0 10px 8px' }}>
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/customer/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      marginBottom: '4px',
                      textDecoration: 'none',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#ffffff' : '#94a3b8',
                      background: isActive ? 'linear-gradient(90deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)' : 'transparent',
                      borderLeft: isActive ? '3px solid #ec4899' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span style={{ background: '#ec4899', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px' }}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Profile Card / Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {customer?.name?.charAt(0) || 'C'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {customer?.name || 'Customer'}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {customer?.phone || customer?.email || 'Active VIP'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Header */}
        <header
          style={{
            height: '70px',
            background: 'rgba(10, 13, 20, 0.8)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Quick Active Service Tracker Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {activeAppointment ? (
              <div
                onClick={() => navigate(`/customer/appointments/${activeAppointment._id}/tracking`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                <span style={{ fontSize: '12.5px', color: '#10b981', fontWeight: 600 }}>
                  Active Appointment: {activeAppointment.scheduledStartTime} — {activeAppointment.status?.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'underline' }}>Track Service →</span>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Welcome back, <strong style={{ color: '#cbd5e1' }}>{customer?.name || 'Guest'}</strong>
              </div>
            )}
          </div>

          {/* Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <NavLink
              to="/customer/book"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>✨</span>
              <span>Book Appointment</span>
            </NavLink>

            <NavLink
              to="/customer/notifications"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                position: 'relative',
                color: '#cbd5e1',
              }}
            >
              <span>🔔</span>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', background: '#ec4899', color: '#ffffff', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
