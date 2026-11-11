/**
 * @file TenantAdminLayout.jsx
 * @description Master Admin Layout with Collapsible Vertical Menus & Submenus:
 *   1. 💄 Golden Beauty Parlour: Dashboard, Users, Staff, Students, Appointments, Services, POS Billing, Inventory
 *   2. 🎉 Jay Gurudev Event Decoration: Stage Decor Dashboard, Event Bookings, Clients & Crew
 *   3. 🏗️ Real Estate Plotting: Colony Layout Dashboard, Available/Sold Plots, Buyers & Agents Commission
 *   4. 🔑 Office & Commercial Rent: Leasing Dashboard, Commercial Units, Tenants & Monthly Rent
 *   5. 💻 RB Software Hub: Cloud Microservices, APIs, Software Portfolio & Tech Clients
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
  Folder,
  FolderOpen,
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
  CheckCircle2,
  DollarSign,
  Layers,
} from 'lucide-react';
import { useTenantAdmin } from '../context/TenantAdminContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const TenantAdminLayout = () => {
  const { user, logout, isLoading } = useTenantAdmin();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Track expanded business vertical sections
  const [expandedVerticals, setExpandedVerticals] = useState({
    parlour: true,
    events: false,
    plotting: false,
    rent: false,
    software: false,
  });

  const toggleVertical = (vKey) => {
    setExpandedVerticals((prev) => ({
      ...prev,
      [vKey]: !prev[vKey],
    }));
  };

  const businessMenus = [
    {
      key: 'parlour',
      label: 'Golden Beauty Parlour',
      icon: Scissors,
      color: '#ec4899',
      bgColor: '#fdf2f8',
      mainPath: '/admin/golden-beauty-parlour',
      websiteUrl: '/golden-beauty-parlour',
      subItems: [
        { label: 'Parlour Dashboard', path: '/admin/golden-beauty-parlour', icon: LayoutDashboard },
        { label: 'Registered Customers', path: '/admin/parlour-users', icon: Users },
        { label: 'Staff & Specialists', path: '/admin/parlour-staff', icon: UserCheck },
        { label: 'Academy Students', path: '/admin/parlour-students', icon: GraduationCap },
        { label: 'Appointments Calendar', path: '/admin/parlour-appointments', icon: Calendar },
        { label: 'Services & Packages', path: '/admin/parlour-services', icon: Scissors },
        { label: 'POS Billing & GST', path: '/admin/parlour-billing', icon: CreditCard },
        { label: 'Products & Inventory', path: '/admin/parlour-inventory', icon: Package },
      ],
    },
    {
      key: 'events',
      label: 'Event & Decoration',
      icon: PartyPopper,
      color: '#a855f7',
      bgColor: '#faf5ff',
      mainPath: '/admin/event-decoration',
      websiteUrl: '/events',
      subItems: [
        { label: 'Stage Decor Dashboard', path: '/admin/event-decoration', icon: LayoutDashboard },
        { label: 'Event Clients & Crew', path: '/admin/event-users', icon: Users },
      ],
    },
    {
      key: 'plotting',
      label: 'Real Estate Plotting',
      icon: Compass,
      color: '#059669',
      bgColor: '#ecfdf5',
      mainPath: '/admin/plotting',
      websiteUrl: '/plotting',
      subItems: [
        { label: 'Colony Layout Dashboard', path: '/admin/plotting', icon: LayoutDashboard },
        { label: 'Buyers & Commission', path: '/admin/plotting-users', icon: Users },
      ],
    },
    {
      key: 'rent',
      label: 'Office & Rent Commercial',
      icon: Key,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      mainPath: '/admin/rent-office',
      websiteUrl: '/rent',
      subItems: [
        { label: 'Leasing Dashboard', path: '/admin/rent-office', icon: LayoutDashboard },
        { label: 'Commercial Tenants', path: '/admin/rent-tenants', icon: Users },
      ],
    },
    {
      key: 'software',
      label: 'RB Software Hub',
      icon: Code2,
      color: '#6366f1',
      bgColor: '#eef2ff',
      mainPath: '/admin/rb-software',
      websiteUrl: '/software',
      subItems: [
        { label: 'Tech & API Dashboard', path: '/admin/rb-software', icon: LayoutDashboard },
        { label: 'Software Clients', path: '/admin/software-clients', icon: Users },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #ec4899', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app, #f8fafc)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: '275px',
          background: 'var(--bg-surface, #ffffff)',
          borderRight: '1px solid var(--border-color, #e2e8f0)',
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
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border-color, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.98rem', color: 'var(--text-primary, #0f172a)' }}>Kashi Admin Hub</div>
              <div style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 700 }}>Master Business Manager</div>
            </div>
          </div>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Overview Executive Direct Button */}
        <div style={{ padding: '0.75rem 0.65rem 0.35rem' }}>
          <NavLink
            to="/admin/business-folders"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: 800,
              color: isActive ? '#ffffff' : '#1e293b',
              background: isActive ? '#0f172a' : '#f1f5f9',
              transition: 'all 0.15s ease',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LayoutDashboard size={18} color="#6366f1" />
              <span>📊 Overview</span>
            </div>
            <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', padding: '2px 7px', borderRadius: '4px', fontWeight: 800 }}>
              5 In 1
            </span>
          </NavLink>
        </div>

        <div style={{ height: '1px', background: 'var(--border-color, #e2e8f0)', margin: '0.5rem 0.65rem' }} />

        {/* ── 5 Multi-Business Vertical Menus with Sub-Menus ── */}
        <div style={{ padding: '0.25rem 0.65rem 1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.25rem' }}>
            Business Verticals & Modules
          </div>

          {businessMenus.map((v) => {
            const VIcon = v.icon;
            const isExpanded = Boolean(expandedVerticals[v.key]);
            const isAnySubActive = v.subItems.some((s) => location.pathname === s.path);

            return (
              <div key={v.key} style={{ display: 'flex', flexDirection: 'column', borderRadius: '10px', border: isExpanded ? `1.5px solid ${v.color}35` : '1px solid transparent', background: isExpanded ? '#ffffff' : 'transparent', overflow: 'hidden' }}>
                {/* Vertical Header Row */}
                <div
                  onClick={() => toggleVertical(v.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isExpanded ? v.bgColor : 'transparent',
                    color: isExpanded ? v.color : 'var(--text-primary, #1e293b)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <VIcon size={17} color={v.color} />
                    <span>{v.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isExpanded ? <ChevronDown size={16} color={v.color} /> : <ChevronRight size={16} color="#94a3b8" />}
                  </div>
                </div>

                {/* Submenu Items */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 0.5rem 8px 1.5rem', background: '#ffffff', borderTop: `1px solid ${v.color}15` }}>
                    {v.subItems.map((sub, sIdx) => {
                      const SubIcon = sub.icon;
                      const isSubActive = location.pathname === sub.path;

                      return (
                        <NavLink
                          key={sIdx}
                          to={sub.path}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.45rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: isSubActive ? 800 : 500,
                            color: isSubActive ? '#ffffff' : 'var(--text-secondary, #475569)',
                            backgroundColor: isSubActive ? v.color : 'transparent',
                            textDecoration: 'none',
                            boxShadow: isSubActive ? `0 2px 8px ${v.color}35` : 'none',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <SubIcon size={14} />
                          <span>{sub.label}</span>
                        </NavLink>
                      );
                    })}

                    {/* View Live Website shortcut inside submenu */}
                    <NavLink
                      to={v.websiteUrl}
                      target="_blank"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: v.color,
                        textDecoration: 'none',
                        marginTop: '4px',
                        borderTop: '1px dashed #e2e8f0',
                        paddingTop: '6px',
                      }}
                    >
                      <Globe size={13} />
                      <span>🌐 View {v.label} Website ↗</span>
                    </NavLink>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer with Logout */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', background: 'var(--bg-surface, #ffffff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ec4899', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary, #0f172a)' }}>{user?.name || 'Admin User'}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Master Admin</div>
            </div>
          </div>
          <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }} title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div style={{ marginLeft: '275px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{ height: '60px', background: 'var(--bg-surface, #ffffff)', borderBottom: '1px solid var(--border-color, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: '#475569', display: 'none' }}>
              <Menu size={20} />
            </button>
            <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none', padding: '4px 10px', borderRadius: '6px', background: '#eff6ff' }}>
              <Globe size={14} />
              <span>Customer Portal Website</span>
            </NavLink>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={toggleTheme} style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <NavLink to="/admin/profile" style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserCog size={14} />
              <span>Admin Profile</span>
            </NavLink>
          </div>
        </header>

        <main style={{ padding: '1.5rem', flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TenantAdminLayout;
