/**
 * @file TenantAdminLayout.jsx
 * @description Tenant Admin Master Layout with Dynamic Branch Switcher, Sidebar Navigation, and User Session Management.
 * Conforms to Phase 04 Sections 6, 7, 65 requirements.
 * @module frontend/src/layouts/TenantAdminLayout
 */

import React, { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Layers,
  ShieldCheck,
  Users,
  UserCheck,
  Clock,
  GraduationCap,
  HeartHandshake,
  Scissors,
  Calendar,
  Navigation,
  CreditCard,
  Package,
  Building,
  BarChart3,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useTenantAdmin } from '../context/TenantAdminContext.jsx';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Branches', path: '/admin/branches', icon: Store },
  { label: 'Structure', path: '/admin/structure', icon: Layers },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Staff Management', path: '/admin/staff', icon: UserCheck },
  { label: 'Attendance & Leaves', path: '/admin/attendance', icon: Clock },
  { label: 'Academy & Students', path: '/admin/students', icon: GraduationCap },
  { label: 'Customers', path: '/admin/customers', icon: HeartHandshake },
  { label: 'Services & Packages', path: '/admin/services', icon: Scissors },
  { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { label: 'Home Services', path: '/admin/home-services', icon: Navigation },
  { label: 'Billing & POS', path: '/admin/billing', icon: CreditCard },
  { label: 'Products & Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Facilities & Ops', path: '/admin/facilities', icon: Building },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Website CMS', path: '/admin/website', icon: Globe },
  { label: 'Settings & Audit', path: '/admin/settings', icon: Settings },
];

export const TenantAdminLayout = () => {
  const { user, tenant, branches, selectedBranchId, switchBranch, logout, isAuthenticated, isLoading } =
    useTenantAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-app)',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            border: '3px solid rgba(236, 72, 153, 0.2)',
            borderTopColor: 'var(--primary-color, #ec4899)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Loading Tenant Workspace...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Sidebar */}
      <aside
        className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '1.25rem 1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {tenant?.name || 'Beauty Salon SaaS'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenant Admin</div>
            </div>
          </div>
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="btn-icon"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '0.75rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-color, #ec4899)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(236, 72, 153, 0.2)',
                color: 'var(--primary-color, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role || user?.userType}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace Content */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: '60px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="btn-icon mobile-menu-btn"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Branch Switcher Dropdown (Phase 04 Section 6 & 7) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <select
                value={selectedBranchId}
                onChange={(e) => switchBranch(e.target.value)}
                className="form-input"
                style={{
                  height: '36px',
                  fontSize: '0.85rem',
                  padding: '0 2rem 0 0.75rem',
                  minWidth: '180px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="">All Branches</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} {b.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(236, 72, 153, 0.15)',
                color: 'var(--primary-color, #ec4899)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
              }}
            >
              {user?.role || user?.userType}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ padding: '1.5rem', flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TenantAdminLayout;
