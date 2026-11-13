/**
 * @file StaffLayout.jsx
 * @description Premium Responsive Staff Portal Layout with dynamic permission-based sidebar,
 * branch switcher, attendance status, notifications, and mobile navigation.
 * @module frontend/src/layouts/StaffLayout
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStaff } from '../context/StaffContext.jsx';

export default function StaffLayout() {
  const {
    staffUser,
    staffProfile,
    branches,
    currentBranchId,
    switchBranch,
    unreadCount,
    logout,
    hasPermission,
  } = useStaff();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/staff/login');
  };

  const currentBranch = branches.find((b) => b._id === currentBranchId) || branches[0];

  const vertical = (staffUser?.targetBusiness || 'PARLOUR').toUpperCase();

  const verticalMeta = {
    EVENTS: {
      name: 'Jaygurudev Events',
      subtitle: staffProfile?.designation || 'Event Crew & Ops',
      emoji: '🔱',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      accentColor: '#f59e0b',
      activeBg: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))',
      dashboardPath: '/staff/event-dashboard',
      dashboardLabel: 'Event Crew Desk',
      customerLabel: 'Event Clients',
      customerIcon: '🔱',
    },
    PLOTTING: {
      name: 'Plotting & Realty',
      subtitle: staffProfile?.designation || 'Sales Officer',
      emoji: '🏡',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      accentColor: '#10b981',
      activeBg: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
      dashboardPath: '/staff/plotting-dashboard',
      dashboardLabel: 'Plotting Field Desk',
      customerLabel: 'Property Buyers',
      customerIcon: '🏡',
    },
    SOFTWARE: {
      name: 'RB Software Hub',
      subtitle: staffProfile?.designation || 'Software Engineer',
      emoji: '💻',
      gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
      accentColor: '#38bdf8',
      activeBg: 'linear-gradient(90deg, rgba(56, 189, 248, 0.15), rgba(2, 132, 199, 0.15))',
      dashboardPath: '/staff/software-dashboard',
      dashboardLabel: 'Engineer Workspace',
      customerLabel: 'Software Clients',
      customerIcon: '💻',
    },
    PARLOUR: {
      name: 'Golden Beauty Parlour',
      subtitle: staffProfile?.designation || 'Salon Specialist',
      emoji: '💄',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      accentColor: '#ec4899',
      activeBg: 'linear-gradient(90deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))',
      dashboardPath: '/staff/dashboard',
      dashboardLabel: 'Salon Dashboard',
      customerLabel: 'Salon Customers',
      customerIcon: '💄',
    },
  }[vertical] || {
    name: 'Staff Portal',
    subtitle: staffProfile?.designation || 'Specialist',
    emoji: '✂️',
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    accentColor: '#ec4899',
    activeBg: 'linear-gradient(90deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))',
    dashboardPath: '/staff/dashboard',
    dashboardLabel: 'Dashboard',
    customerLabel: 'Customers',
    customerIcon: '👥',
  };

  // Clean, Step-by-Step Navigation (Only Dashboard and Customers per request)
  const navSections = [
    {
      title: 'Operations & Clients',
      items: [
        { label: verticalMeta.dashboardLabel, path: verticalMeta.dashboardPath, icon: verticalMeta.emoji },
        { label: verticalMeta.customerLabel, path: '/staff/customers', icon: verticalMeta.customerIcon },
      ],
    },
    {
      title: 'Attendance & HR',
      items: [
        { label: 'Staff Attendance', path: '/staff/attendance', icon: '⏱️' },
        { label: 'Leave Requests', path: '/staff/leaves', icon: '🏖️' },
        { label: 'Salary & Payslips', path: '/staff/salary', icon: '💰' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          boxShadow: '2px 0 12px rgba(0, 0, 0, 0.03)',
          transform: mobileMenuOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
        }}
        className={mobileMenuOpen ? 'sidebar-open' : 'sidebar-desktop'}
      >
        {/* Master Corporate Brand Logo & Vertical Header */}
        <div
          style={{
            padding: '16px 18px 14px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/kashi-logo.png"
              alt="Kashi Service Logo"
              style={{
                maxHeight: '48px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              background: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: verticalMeta.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: `0 3px 8px ${verticalMeta.accentColor}33`,
                flexShrink: 0,
              }}
            >
              {verticalMeta.emoji}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {verticalMeta.name}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                {verticalMeta.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {navSections.map((section, idx) => {
            const filteredItems = section.items.filter((item) => {
              if (item.permission && !hasPermission(item.permission) && staffUser?.role !== 'ADMIN') {
                return false;
              }
              return true;
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: '#64748b',
                    fontWeight: '800',
                    letterSpacing: '0.8px',
                    padding: '0 12px 6px',
                  }}
                >
                  {section.title}
                </div>
                {filteredItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/staff/dashboard' && location.pathname.startsWith(`${item.path}/`));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: isActive ? '#6b21a8' : '#334155',
                        background: isActive ? '#faf5ff' : 'transparent',
                        borderLeft: isActive ? `3px solid #7e22ce` : '3px solid transparent',
                        border: isActive ? '1px solid #d8b4fe' : '1px solid transparent',
                        fontWeight: isActive ? '750' : '500',
                        fontSize: '13.5px',
                        marginBottom: '4px',
                        transition: 'all 0.15s ease',
                        boxShadow: isActive ? '0 2px 6px rgba(126, 34, 206, 0.08)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span
                          style={{
                            background: '#7e22ce',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '10px',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Staff User Footer */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: staffProfile?.photo ? `url(${staffProfile.photo}) center/cover` : 'linear-gradient(135deg, #7e22ce, #9333ea)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {!staffProfile?.photo && (staffProfile?.name?.[0] || staffUser?.username?.[0] || 'S')}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {staffProfile?.name || staffUser?.username}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                ID: {staffProfile?.employeeId || 'STAFF'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '6px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '15px',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0, background: '#f8fafc' }} className="main-content-layout">
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Left: Mobile hamburger & Active Branch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#0f172a',
                fontSize: '18px',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
              className="mobile-hamburger-btn"
            >
              ☰
            </button>

            {/* Branch Switcher Dropdown */}
            {branches.length > 1 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '5px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px' }}>🏢</span>
                <select
                  value={currentBranchId}
                  onChange={(e) => switchBranch(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {branches.map((b) => (
                    <option key={b._id} value={b._id} style={{ background: '#ffffff', color: '#0f172a' }}>
                      {b.name} {b.isDefault ? '(Main)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : currentBranch ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                <span>🏢</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{currentBranch.name}</span>
              </div>
            ) : null}
          </div>

          {/* Right: Quick Actions & Profile Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Quick Home Service Status Shortcut */}
            <NavLink
              to="/staff/home-services"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                padding: '5px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#7e22ce',
                fontSize: '12.5px',
                fontWeight: '700',
              }}
            >
              <span>🚗</span>
              <span className="hide-on-mobile">Home Visit</span>
            </NavLink>

            {/* Chat Icon */}
            <NavLink
              to="/staff/chat"
              title="Salon Chat"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: '#475569',
                fontSize: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              💬
            </NavLink>

            {/* Notification Bell */}
            <NavLink
              to="/staff/notifications"
              title="Notifications"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: '#475569',
                fontSize: '16px',
                border: '1px solid #e2e8f0',
                position: 'relative',
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>

            {/* Profile Dropdown Toggle */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '4px 10px 4px 4px',
                  cursor: 'pointer',
                  color: '#0f172a',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7e22ce, #9333ea)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '12px',
                  }}
                >
                  {staffProfile?.name?.[0] || 'S'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  {staffProfile?.name?.split(' ')?.[0] || 'Staff'}
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '210px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                    padding: '8px 0',
                    zIndex: 50,
                  }}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                      {staffProfile?.name || staffUser?.username}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {staffProfile?.department || 'Salon Specialist'}
                    </div>
                  </div>
                  <NavLink
                    to="/staff/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    👤 My Profile
                  </NavLink>
                  <NavLink
                    to="/staff/attendance"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    ⏱️ Attendance Punch
                  </NavLink>
                  <NavLink
                    to="/staff/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    ⚙️ Settings
                  </NavLink>
                  <NavLink
                    to="/staff/security"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    🛡️ Active Devices & Sessions
                  </NavLink>
                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      color: '#ef4444',
                      background: 'transparent',
                      border: 'none',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Child Routes Outlet */}
        <main style={{ flex: 1, padding: '24px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-desktop {
            transform: translateX(-100%) !important;
          }
          .sidebar-open {
            transform: translateX(0) !important;
          }
          .main-content-layout {
            margin-left: 0 !important;
          }
          .mobile-hamburger-btn {
            display: block !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
