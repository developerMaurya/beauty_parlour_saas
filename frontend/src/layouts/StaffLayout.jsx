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

  // Define navigation items with permission and role rules
  const navSections = [
    {
      title: 'Work & Schedule',
      items: [
        { label: 'Dashboard', path: '/staff/dashboard', icon: '⚡' },
        { label: 'Calendar', path: '/staff/calendar', icon: '📅' },
        { label: 'Appointments', path: '/staff/appointments', icon: '✂️' },
        {
          label: 'Home Services',
          path: '/staff/home-services',
          icon: '🚗',
          highlight: true,
          permission: 'home_service',
        },
        { label: 'Tasks', path: '/staff/tasks', icon: '📋' },
      ],
    },
    {
      title: 'Clients & Catalog',
      items: [
        { label: 'Customers (CRM)', path: '/staff/customers', icon: '👥', permission: 'customers_read' },
        { label: 'Services & Skills', path: '/staff/services', icon: '✨' },
        { label: 'Packages & Offers', path: '/staff/packages', icon: '🎁' },
      ],
    },
    {
      title: 'Time & Attendance',
      items: [
        { label: 'Attendance & Clock-In', path: '/staff/attendance', icon: '⏱️' },
        { label: 'Leaves & Holidays', path: '/staff/leaves', icon: '🏖️' },
        { label: 'Work Shifts', path: '/staff/schedule', icon: '🗓️' },
      ],
    },
    {
      title: 'Finance & Career',
      items: [
        { label: 'Earnings & Commission', path: '/staff/earnings', icon: '💰' },
        { label: 'Payslips', path: '/staff/payslips', icon: '🧾' },
        { label: 'Documents & Certs', path: '/staff/documents', icon: '📜' },
        { label: 'Inventory & Stock', path: '/staff/inventory', icon: '📦', permission: 'inventory_read' },
      ],
    },
    {
      title: 'Communication & Reports',
      items: [
        { label: 'My Requests', path: '/staff/requests', icon: '📬' },
        { label: 'Salon Chat', path: '/staff/chat', icon: '💬' },
        { label: 'Notifications', path: '/staff/notifications', icon: '🔔', badge: unreadCount },
        { label: 'Performance & KPI', path: '/staff/performance', icon: '📈' },
        { label: 'My Reports', path: '/staff/reports', icon: '📊' },
        { label: 'Account Settings', path: '/staff/settings', icon: '⚙️' },
        { label: 'Security & Devices', path: '/staff/security', icon: '🛡️' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          transform: mobileMenuOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
        }}
        className={mobileMenuOpen ? 'sidebar-open' : 'sidebar-desktop'}
      >
        {/* Brand Logo & Title */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
            }}
          >
            ✂️
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '-0.3px', color: '#fff' }}>
              Staff Portal
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {staffProfile?.designation || 'Specialist'}
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
                    fontWeight: '700',
                    letterSpacing: '0.8px',
                    padding: '0 12px 6px',
                  }}
                >
                  {section.title}
                </div>
                {filteredItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
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
                        color: isActive ? '#fff' : '#94a3b8',
                        background: isActive
                          ? 'linear-gradient(90deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))'
                          : 'transparent',
                        borderLeft: isActive ? '3px solid #ec4899' : '3px solid transparent',
                        fontWeight: isActive ? '600' : '500',
                        fontSize: '13.5px',
                        marginBottom: '2px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span
                          style={{
                            background: '#ec4899',
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
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(30, 41, 59, 0.5)',
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
                background: staffProfile?.photo ? `url(${staffProfile.photo}) center/cover` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
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
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {staffProfile?.name || staffUser?.username}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                ID: {staffProfile?.employeeId || 'STAFF'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '6px',
            }}
          >
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="main-content-layout">
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30, 41, 59, 0.8)', padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '13px' }}>🏢</span>
                <select
                  value={currentBranchId}
                  onChange={(e) => switchBranch(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {branches.map((b) => (
                    <option key={b._id} value={b._id} style={{ background: '#1e293b', color: '#fff' }}>
                      {b.name} {b.isDefault ? '(Main)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : currentBranch ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' }}>
                <span>🏢</span>
                <span style={{ fontWeight: '600', color: '#f8fafc' }}>{currentBranch.name}</span>
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
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '5px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ec4899',
                fontSize: '12.5px',
                fontWeight: '600',
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
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: '#cbd5e1',
                fontSize: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: '#cbd5e1',
                fontSize: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
                    background: '#ec4899',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #0f172a',
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
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '4px 10px 4px 4px',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '12px',
                  }}
                >
                  {staffProfile?.name?.[0] || 'S'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>
                  {staffProfile?.name?.split(' ')?.[0] || 'Staff'}
                </span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>▼</span>
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '210px',
                    background: '#1e293b',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                    padding: '8px 0',
                    zIndex: 50,
                  }}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                      {staffProfile?.name || staffUser?.username}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {staffProfile?.department || 'Salon Specialist'}
                    </div>
                  </div>
                  <NavLink
                    to="/staff/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#cbd5e1',
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
                      color: '#cbd5e1',
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
                      color: '#cbd5e1',
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
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    🛡️ Active Devices & Sessions
                  </NavLink>
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />
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
                      fontWeight: '500',
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
