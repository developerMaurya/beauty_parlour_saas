/**
 * @file TenantAdminLayout.jsx
 * @description Master Luxury Admin Layout with dedicated business vertical sidebars:
 *   1. 💄 Golden Beauty Parlour (Purple Theme #241434 with Crown logo & user screenshot menu)
 *   2. 🏡 Kashi Plotting Services (Forest Green Theme #0a2618 with House/Tree logo & user screenshot menu)
 *   3. Multi-business quick switcher to seamlessly jump between Parlour, Plotting, Events, Rent & Software
 * @module frontend/src/layouts/TenantAdminLayout
 */

import React, { useState, useEffect } from 'react';
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
  Trees,
  Home,
  Building,
  HelpCircle,
  Image,
  MessageSquareQuote,
} from 'lucide-react';
import { useTenantAdmin } from '../context/TenantAdminContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const TenantAdminLayout = () => {
  const { user, logout, isLoading } = useTenantAdmin();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current active business vertical: 'PARLOUR' | 'PLOTTING' | 'EVENTS' | 'RENT' | 'SOFTWARE'
  const isPlottingRoute =
    location.pathname.includes('plotting') ||
    location.pathname.includes('plot') ||
    location.pathname.includes('kashiplot');

  const [activeVertical, setActiveVertical] = useState(isPlottingRoute ? 'PLOTTING' : 'PARLOUR');

  useEffect(() => {
    if (isPlottingRoute) {
      setActiveVertical('PLOTTING');
    } else if (
      location.pathname.includes('parlour') ||
      location.pathname.includes('beauty') ||
      location.pathname === '/admin/dashboard' ||
      location.pathname === '/admin'
    ) {
      setActiveVertical('PARLOUR');
    }
  }, [location.pathname, isPlottingRoute]);

  // Multi-vertical dropdown state
  const [verticalsDropdownOpen, setVerticalsDropdownOpen] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // 1. GOLDEN BEAUTY PARLOUR MENU (Purple Theme)
  // ══════════════════════════════════════════════════════════════════════════
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

  // ══════════════════════════════════════════════════════════════════════════
  // 2. KASHI PLOTTING SERVICES MENU (Forest Green Theme Matching Image)
  // ══════════════════════════════════════════════════════════════════════════
  const plottingMenuItems = [
    { label: 'Dashboard', path: '/admin/plotting', icon: LayoutDashboard },
    { label: 'Plots Management', path: '/admin/plotting', icon: Trees },
    { label: 'Bookings', path: '/admin/plotting', icon: Calendar },
    { label: 'Customers', path: '/admin/plotting-users', icon: Users },
    { label: 'Agents', path: '/admin/plotting-agents', icon: UserCheck },
    { label: 'Inquiries', path: '/admin/plotting-users', icon: HelpCircle },
    { label: 'Payments', path: '/admin/parlour-billing', icon: CreditCard },
    { label: 'Offers & Discounts', path: '/admin/packages', icon: Tag },
    { label: 'Gallery', path: '/plotting', icon: Image, isExternal: true },
    { label: 'Testimonials', path: '/plotting', icon: MessageSquareQuote, isExternal: true },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Notification', path: '/admin/notifications', icon: Bell, badge: '3', badgeColor: '#ef4444' },
    { label: 'Support', path: '/admin/support', icon: Headphones },
  ];

  // Colors & Configuration for Active Vertical
  const isParlour = activeVertical === 'PARLOUR';
  const sidebarBg = isParlour ? '#241434' : '#0a2618';
  const activePillBg = isParlour ? '#7e22ce' : '#16a34a';
  const accentColor = isParlour ? '#c084fc' : '#4ade80';

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '3.5px solid #16a34a', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* ── Left Branded Sidebar ── */}
      <aside
        style={{
          width: '260px',
          background: sidebarBg,
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
          transition: 'background 0.25s ease',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.2rem 1.1rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isParlour ? (
            /* Golden Beauty Parlour Header */
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/golden-beauty-parlour')}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #db2777 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Crown size={22} />
              </div>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.05 }}>
                  Golden
                </div>
                <div style={{ fontSize: '9.5px', color: '#d8b4fe', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  BEAUTY PARLOUR
                </div>
              </div>
            </div>
          ) : (
            /* Kashi Plotting Services Header Matching Screenshot */
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/plotting')}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 50%, #15803d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Trees size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.1 }}>
                  Ploting
                </div>
                <div style={{ fontSize: '9.5px', color: '#86efac', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  SERVICES • KASHIPLOT
                </div>
              </div>
            </div>
          )}

          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── Vertical Switcher Buttons (Beauty Parlour ⟷ Plotting) ── */}
        <div style={{ padding: '0.75rem 0.85rem 0.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => {
                setActiveVertical('PARLOUR');
                navigate('/admin/golden-beauty-parlour');
              }}
              style={{
                padding: '6px 4px',
                borderRadius: '8px',
                border: 'none',
                background: isParlour ? '#7e22ce' : 'transparent',
                color: isParlour ? '#ffffff' : '#94a3b8',
                fontWeight: isParlour ? 800 : 600,
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              💄 Parlour
            </button>
            <button
              onClick={() => {
                setActiveVertical('PLOTTING');
                navigate('/admin/plotting');
              }}
              style={{
                padding: '6px 4px',
                borderRadius: '8px',
                border: 'none',
                background: !isParlour ? '#16a34a' : 'transparent',
                color: !isParlour ? '#ffffff' : '#94a3b8',
                fontWeight: !isParlour ? 800 : 600,
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🏡 Plotting
            </button>
          </div>
        </div>

        {/* ── Main Navigation Menu Items ── */}
        <div style={{ padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
          {(isParlour ? parlourMenuItems : plottingMenuItems).map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.label === 'Dashboard' &&
                (isParlour
                  ? location.pathname === '/admin/dashboard' || location.pathname === '/admin/golden-beauty-parlour'
                  : location.pathname === '/admin/plotting'));

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
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={17} color={accentColor} />
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: accentColor }}>↗</span>
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
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  background: isActive ? activePillBg : 'transparent',
                  textDecoration: 'none',
                  boxShadow: isActive ? `0 4px 14px ${activePillBg}55` : 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
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
                  <Icon size={17} color={isActive ? '#ffffff' : accentColor} />
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

          {/* Logout Menu Item */}
          <div
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#ef4444',
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </div>

          {/* ── Other Business Verticals Switcher ── */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              onClick={() => setVerticalsDropdownOpen(!verticalsDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: accentColor,
                background: verticalsDropdownOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              }}
            >
              <span>ALL 5 KASHI VERTICALS</span>
              {verticalsDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>

            {verticalsDropdownOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', paddingLeft: '4px' }}>
                {[
                  { label: '💄 Golden Beauty Parlour', path: '/admin/golden-beauty-parlour' },
                  { label: '🏡 Kashi Plotting Services', path: '/admin/plotting' },
                  { label: '🎉 Event & Decoration', path: '/admin/event-decoration' },
                  { label: '🔑 Office & Rent Commercial', path: '/admin/rent-office' },
                  { label: '💻 RB Software Hub', path: '/admin/rb-software' },
                  { label: '📊 Master Business Overview', path: '/admin/business-folders' },
                ].map((ov, oIdx) => (
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

        {/* ── Bottom Upgrade Plan Button ── */}
        <div style={{ padding: '0.85rem 1rem 1.25rem' }}>
          <button
            onClick={() => navigate('/admin/billing')}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: isParlour
                ? 'linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #a855f7 100%)'
                : 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: isParlour ? '0 6px 18px rgba(126, 34, 206, 0.45)' : '0 6px 18px rgba(22, 163, 74, 0.45)',
            }}
          >
            <Trees size={17} />
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
