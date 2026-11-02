/**
 * @file StudentLayout.jsx
 * @description Premium Responsive Student Portal Layout with dynamic sidebar,
 * top header, attendance badge, unread notifications, and profile dropdown.
 * Conforms to Phase 06 Section 42.
 * @module frontend/src/layouts/StudentLayout
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStudent } from '../context/StudentContext.jsx';

export default function StudentLayout() {
  const { studentUser, studentProfile, branch, unreadCount, logout } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/student/login');
  };

  const navSections = [
    {
      title: 'Academics & Schedule',
      items: [
        { label: 'Dashboard', path: '/student/dashboard', icon: '⚡' },
        { label: 'Class Schedule', path: '/student/schedule', icon: '🗓️' },
        { label: 'Calendar', path: '/student/calendar', icon: '📅' },
        { label: 'Attendance', path: '/student/attendance', icon: '⏱️' },
        { label: 'Course Material', path: '/student/materials', icon: '📚' },
        { label: 'Assignments', path: '/student/assignments', icon: '📝' },
        { label: 'Tests & Exams', path: '/student/tests', icon: '✍️' },
        { label: 'Academic Progress', path: '/student/progress', icon: '📈' },
      ],
    },
    {
      title: 'Plans & Enrollments',
      items: [
        { label: 'Academy Plans', path: '/student/plans', icon: '🎓' },
        { label: 'Courses Catalog', path: '/student/courses', icon: '📖' },
        { label: 'My Enrollments', path: '/student/enrollments', icon: '📋' },
      ],
    },
    {
      title: 'Finance & Payments',
      items: [
        { label: 'Payments Ledger', path: '/student/payments', icon: '💰' },
        { label: 'Installments', path: '/student/installments', icon: '💳' },
        { label: 'Invoices', path: '/student/payments/invoices', icon: '🧾' },
      ],
    },
    {
      title: 'Credentials & Vault',
      items: [
        { label: 'Certificates', path: '/student/certificates', icon: '📜' },
        { label: 'Documents Vault', path: '/student/documents', icon: '📁' },
      ],
    },
    {
      title: 'Campus & Support',
      items: [
        { label: 'Faculty Trainers', path: '/student/trainers', icon: '👩‍🏫' },
        { label: 'Leave Applications', path: '/student/leaves', icon: '🏖️' },
        { label: 'Student Requests', path: '/student/requests', icon: '📬' },
        { label: 'Academy Chat', path: '/student/chat', icon: '💬' },
        { label: 'Notifications', path: '/student/notifications', icon: '🔔', badge: unreadCount },
        { label: 'Announcements', path: '/student/announcements', icon: '📢' },
        { label: 'Student Report', path: '/student/reports', icon: '📊' },
        { label: 'Academic Timeline', path: '/student/timeline', icon: '⏳' },
        { label: 'Settings', path: '/student/settings', icon: '⚙️' },
        { label: 'Security & Devices', path: '/student/security', icon: '🛡️' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1d', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
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
        {/* Brand Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            🎓
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '-0.3px', color: '#fff' }}>
              Student Portal
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {studentProfile?.course || 'Beauty Academy'}
            </div>
          </div>
        </div>

        {/* Scrollable Nav Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {navSections.map((section, idx) => (
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
              {section.items.map((item) => {
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
                        ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))'
                        : 'transparent',
                      borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
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
          ))}
        </div>

        {/* Student User Footer */}
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
                background: studentProfile?.photo ? `url(${studentProfile.photo}) center/cover` : 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {!studentProfile?.photo && (studentProfile?.name?.[0] || studentUser?.username?.[0] || 'S')}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {studentProfile?.name || studentUser?.username}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                ID: {studentProfile?.studentId || 'STUDENT'}
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
          {/* Left: Mobile Hamburger & Campus Branch */}
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

            {branch && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' }}>
                <span>🏫</span>
                <span style={{ fontWeight: '600', color: '#f8fafc' }}>{branch.name} Campus</span>
              </div>
            )}
          </div>

          {/* Right: Quick Actions & Profile Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Quick Explore Plans */}
            <NavLink
              to="/student/plans"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '5px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#a855f7',
                fontSize: '12.5px',
                fontWeight: '600',
              }}
            >
              <span>🎓</span>
              <span className="hide-on-mobile">Explore Plans</span>
            </NavLink>

            {/* Chat Icon */}
            <NavLink
              to="/student/chat"
              title="Academy Chat"
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
              to="/student/notifications"
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
                    border: '2px solid #0a0f1d',
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
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '12px',
                  }}
                >
                  {studentProfile?.name?.[0] || 'S'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>
                  {studentProfile?.name?.split(' ')?.[0] || 'Student'}
                </span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>▼</span>
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '220px',
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
                      {studentProfile?.name || studentUser?.username}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {studentProfile?.admissionNumber || 'Student Portal'}
                    </div>
                  </div>
                  <NavLink
                    to="/student/profile"
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
                    to="/student/certificates"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    📜 My Certificates
                  </NavLink>
                  <NavLink
                    to="/student/settings"
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
                    to="/student/security"
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
