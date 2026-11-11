/**
 * @file TenantAdminLayout.jsx
 * @description Master Luxury Admin Layout matching the exact "Golden Beauty Parlour" SaaS design.
 * Features:
 *   - Branded dark luxury purple sidebar (#241434) with Crown + Woman logo
 *   - Exact menu items: Dashboard, Website, Appointments, Customers, Staff, Students, Services,
 *     Packages, Inventory, Billing, CRM, Offers & Discounts, Reports, Import/Export, Notification,
 *     Support, Settings & Upgrade Plan button
 *   - Multi-vertical switchable drawers (Events, Plotting, Commercial Rent, Software Hub & Overview)
 *   - Responsive mobile drawer support
 * @module frontend/src/layouts/TenantAdminLayout
 */

import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Scissors,
  PartyPopper,
  Compass,
  Key,
  Code2,
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  Calendar,
  CreditCard,
  Package,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Bell,
  UserCog,
  Crown,
  HeartHandshake,
  Tag,
  BarChart3,
  Download,
  Headphones,
  Search,
  MessageSquare,
  Layers,
  Box,
} from 'lucide-react';
import { useTenantAdmin } from '../context/TenantAdminContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const TenantAdminLayout = () => {
  const { user, logout, isLoading } = useTenantAdmin();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Multi-vertical toggle state
  const [otherVerticalsOpen, setOtherVerticalsOpen] = useState(false);

  // Exact beauty parlour menu items from user screenshot
  const parlourMenuItems = [
    { label: 'Dashboard', path: '/admin/golden-beauty-parlour', icon: LayoutDashboard },
    { label: 'Website', path: '/storefront', icon: Globe, isExternal: true },
    { label: 'Appointments', path: '/admin/parlour-appointments', icon: Calendar, badge: '12' },
    { label: 'Customers', path: '/admin/parlour-users', icon: Users },
    { label: 'Staff', path: '/admin/parlour-staff', icon: UserCheck },
    { label: 'Students', path: '/admin/parlour-students', icon: GraduationCap },
    { label: 'Services', path: '/admin/parlour-services', icon: Scissors },
    { label: 'Packages', path: '/admin/packages', icon: Package },
    { label: 'Inventory', path: '/admin/parlour-inventory', icon: Box },
    { label: 'Billing', path: '/admin/parlour-billing', icon: CreditCard },
    { label: 'CRM', path: '/admin/crm', icon: HeartHandshake },
    { label: 'Offers & Discounts', path: '/admin/offers', icon: Tag },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Import / Export', path: '/admin/import-export', icon: Download },
    { label: 'Notification', path: '/admin/notifications', icon: Bell, badge: '3', badgeColor: '#ef4444' },
    { label: 'Support', path: '/admin/support', icon: Headphones },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Other Kashi Service Verticals
  const otherVerticals = [
    { label: '🎉 Event & Decoration', path: '/admin/event-decoration', icon: PartyPopper, color: '#a855f7' },
    { label: '🏗️ Real Estate Plotting', path: '/admin/plotting', icon: Compass, color: '#059669' },
    { label: '🔑 Office & Rent Commercial', path: '/admin/rent-office', icon: Key, color: '#0284c7' },
    { label: '💻 RB Software Hub', path: '/admin/rb-software', icon: Code2, color: '#6366f1' },
    { label: '📊 Master Business Overview', path: '/admin/business-folders', icon: Layers, color: '#f59e0b' },
  ];

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#241434' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '3.5px solid #a855f7', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* ── Left Branded Dark Purple Sidebar (Matching User Screenshot) ── */}
      <aside
        style={{
          width: '260px',
          background: '#241434',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Brand Header: Crown + Woman Face & "Golden Beauty Parlour" */}
        <div
          style={{
            padding: '1.4rem 1.25rem 1.2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => navigate('/admin/golden-beauty-parlour')}
          >
            {/* Crown with Woman Portrait Icon */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #db2777 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <Crown size={22} />
            </div>

            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '1.25rem', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.05 }}>
                Golden
              </div>
              <div style={{ fontSize: '10px', color: '#d8b4fe', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                BEAUTY PARLOUR
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── Main Beauty Parlour Navigation Menu ── */}
        <div style={{ padding: '0.85rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
          {parlourMenuItems.map((item, idx) => {
            const Icon = item.icon;
            // Active if route matches or if at /admin/dashboard and item is Dashboard
            const isActive =
              location.pathname === item.path ||
              (item.label === 'Dashboard' && (location.pathname === '/admin/dashboard' || location.pathname === '/admin'));

            if (item.isExternal) {
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.62rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={17} color="#a855f7" />
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#c084fc' }}>↗</span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={idx}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.62rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  background: isActive ? '#7e22ce' : 'transparent',
                  textDecoration: 'none',
                  boxShadow: isActive ? '0 4px 14px rgba(126, 34, 206, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={17} color={isActive ? '#ffffff' : '#a855f7'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      background: item.badgeColor || '#ec4899',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: 900,
                      padding: '1px 7px',
                      borderRadius: '999px',
                      lineHeight: '16px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* ── Multi-Business Verticals Collapsible Drawer ── */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              onClick={() => setOtherVerticalsOpen(!otherVerticalsOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#d8b4fe',
                background: otherVerticalsOpen ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
              }}
            >
              <span>OTHER BUSINESS VERTICALS</span>
              {otherVerticalsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>

            {otherVerticalsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', paddingLeft: '4px' }}>
                {otherVerticals.map((ov, oIdx) => (
                  <NavLink
                    key={oIdx}
                    to={ov.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      textDecoration: 'none',
                    })}
                  >
                    <span>{ov.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom Upgrade Plan Button matching screenshot ── */}
        <div style={{ padding: '0.85rem 1rem 1.25rem' }}>
          <button
            onClick={() => navigate('/admin/billing')}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #a855f7 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 6px 18px rgba(126, 34, 206, 0.45)',
            }}
          >
            <Crown size={17} />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </aside>

      {/* ── Main Right Content Area (With 260px Margin) ── */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default TenantAdminLayout;
