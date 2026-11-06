/**
 * @file TenantAdminLayout.jsx
 * @description Tenant Admin Master Layout with Dynamic Branch Switcher, Sidebar Navigation, and User Session Management.
 * Conforms to Phase 04 Sections 6, 7, 65 requirements.
 * @module frontend/src/layouts/TenantAdminLayout
 */

import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Building2,
  Sparkles,
  Sun,
  Moon,
  ExternalLink,
  Bell,
  LifeBuoy,
  UserCog,
  MapPin,
  Megaphone,
  PhoneCall,
  MessageSquare,
  Star,
  Search,
  Terminal,
  Activity,
  Truck,
  Box,
  Radio,
} from 'lucide-react';
import { useTenantAdmin } from '../context/TenantAdminContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { buildTenantUrl } from '../utils/tenantDomain.js';

const navItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    subItems: [
      { label: 'Overview & KPIs', path: '/admin/dashboard?tab=overview', tabId: 'overview', icon: Activity },
      { label: 'Live Queue & Token Board', path: '/admin/dashboard?tab=live_queue', tabId: 'live_queue', icon: Radio },
      { label: 'Google Maps Live Radar', path: '/admin/dashboard?tab=gps_map', tabId: 'gps_map', icon: MapPin },
      { label: 'Home Service Dispatch', path: '/admin/dashboard?tab=home_services', tabId: 'home_services', icon: Truck },
      { label: 'Staff Product Allocation', path: '/admin/dashboard?tab=material_assignment', tabId: 'material_assignment', icon: Box },
      { label: 'Tenant API Logs', path: '/admin/dashboard?tab=telemetry_logs', tabId: 'telemetry_logs', icon: Terminal },
      { label: 'Beauty Services Matrix', path: '/admin/dashboard?tab=services_matrix', tabId: 'services_matrix', icon: Scissors },
    ],
  },
  { label: 'Front Desk & Reception', path: '/admin/receptionist', icon: Radio, badge: 'Live Queue' },
  { label: 'Branches', path: '/admin/branches', icon: Store },
  { label: 'Structure', path: '/admin/structure', icon: Layers },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'CRM & Operations', path: '/admin/crm', icon: HeartHandshake },
  { label: 'Staff Management', path: '/admin/staff', icon: UserCheck },
  { label: 'Attendance & Leaves', path: '/admin/attendance', icon: Clock },
  { label: 'Academy & Students', path: '/admin/students', icon: GraduationCap },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Services & Packages', path: '/admin/services', icon: Scissors },
  { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { label: 'Home Services', path: '/admin/home-services', icon: Navigation },
  { label: 'Live Staff Tracking', path: '/admin/tracking', icon: MapPin },
  { label: 'Billing & POS', path: '/admin/billing', icon: CreditCard },
  { label: 'Products & Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Notifications Hub', path: '/admin/notifications', icon: Bell },
  { label: 'Support & Helpdesk', path: '/admin/support', icon: LifeBuoy },
  { label: 'Profile & Security', path: '/admin/profile', icon: UserCog },
  { label: 'Facilities & Ops', path: '/admin/facilities', icon: Building },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  {
    label: 'Website CMS / Builder',
    path: '/admin/website',
    icon: Globe,
    subItems: [
      { label: 'Brand Logo & Theme', path: '/admin/website?tab=branding', tabId: 'branding', icon: Sparkles },
      { label: 'Multi-Banner Hero Slider', path: '/admin/website?tab=hero', tabId: 'hero', icon: Layers },
      { label: 'Dynamic Navigation Menu', path: '/admin/website?tab=menu', tabId: 'menu', icon: Menu },
      { label: 'About Us & Founder', path: '/admin/website?tab=about', tabId: 'about', icon: Building2 },
      { label: 'Contact, Map & Hours', path: '/admin/website?tab=contact', tabId: 'contact', icon: PhoneCall },
      { label: 'Festive Announcement Bar', path: '/admin/website?tab=announcement', tabId: 'announcement', icon: Megaphone },
      { label: 'WhatsApp & Call CTA Widget', path: '/admin/website?tab=floating_cta', tabId: 'floating_cta', icon: PhoneCall },
      { label: 'Customer Reviews & Stars', path: '/admin/website?tab=testimonials', tabId: 'testimonials', icon: Star },
      { label: 'SEO, Meta Tags & Analytics', path: '/admin/website?tab=seo', tabId: 'seo', icon: Search },
      { label: 'Services Showcase', path: '/admin/website?tab=services', tabId: 'services', icon: Scissors },
      { label: 'Inquiries Inbox', path: '/admin/website?tab=inquiries', tabId: 'inquiries', icon: MessageSquare },
    ],
  },
  { label: 'Settings & Audit', path: '/admin/settings', icon: Settings },
];

export const TenantAdminLayout = () => {
  const { user, tenant, branches, selectedBranchId, switchBranch, logout, isAuthenticated, isLoading } =
    useTenantAdmin();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Track expanded parent items
  const [expandedMenus, setExpandedMenus] = useState({
    '/admin/dashboard': true,
    '/admin/website': true,
  });

  const toggleSubMenu = (itemPath, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [itemPath]: !prev[itemPath],
    }));
  };

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

        {/* Navigation Links with Collapsible Sub-Menus */}
        <nav style={{ padding: '0.75rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
            const isParentActive = location.pathname.startsWith(item.path);
            const isExpanded = Boolean(expandedMenus[item.path]);
            const currentTab = new URLSearchParams(location.search).get('tab');

            if (hasSubItems) {
              return (
                <div key={item.path} style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Parent Row */}
                  <div
                    onClick={() => {
                      if (!isExpanded) {
                        setExpandedMenus((prev) => ({ ...prev, [item.path]: true }));
                      }
                      navigate(item.subItems[0].path);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '6px',
                      color: isParentActive ? '#fff' : 'var(--text-secondary)',
                      backgroundColor: isParentActive ? 'rgba(236, 72, 153, 0.22)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: isParentActive ? 700 : 500,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Icon className="w-4 h-4" style={{ color: isParentActive ? '#ec4899' : 'inherit' }} />
                      <span>{item.label}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleSubMenu(item.path, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ transition: 'transform 0.2s' }} />
                      ) : (
                        <ChevronRight className="w-4 h-4" style={{ transition: 'transform 0.2s' }} />
                      )}
                    </button>
                  </div>

                  {/* Sub-Items Collapsible Container */}
                  {isExpanded && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        paddingLeft: '1.25rem',
                        marginTop: '3px',
                        marginBottom: '4px',
                        borderLeft: '1.5px solid rgba(236, 72, 153, 0.25)',
                        marginLeft: '1rem',
                      }}
                    >
                      {item.subItems.map((sub, sIdx) => {
                        const SubIcon = sub.icon || Sparkles;
                        const isSubActive =
                          isParentActive &&
                          (currentTab === sub.tabId || (!currentTab && sIdx === 0));

                        return (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.55rem',
                              padding: '0.45rem 0.65rem',
                              borderRadius: '6px',
                              color: isSubActive ? '#ec4899' : 'var(--text-muted)',
                              backgroundColor: isSubActive ? 'rgba(236, 72, 153, 0.14)' : 'transparent',
                              textDecoration: 'none',
                              fontSize: '0.78rem',
                              fontWeight: isSubActive ? 700 : 500,
                              borderLeft: isSubActive ? '3px solid #ec4899' : '3px solid transparent',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <SubIcon className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {sub.label}
                            </span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal Flat Item
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Kashi Service Platform Hub */}
            <a
              href="/platform"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', textDecoration: 'none' }}
              title="Kashi Service Platform Hub"
            >
              <span>⚡ Kashi Platform</span>
            </a>

            {/* Live Website Preview Link */}
            <a
              href={buildTenantUrl(tenant, 'public')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', textDecoration: 'none' }}
              title="Visit Customer-Facing Website"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Visit Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Bright Light / Dark Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: theme === 'dark' ? '#f59e0b' : '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={theme === 'dark' ? 'Switch to Bright Light Mode' : 'Switch to Dark Luxury Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Hub Button */}
            <NavLink
              to="/admin/notifications"
              className="btn-icon"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                textDecoration: 'none',
              }}
              title="Notifications Hub"
            >
              <Bell className="w-4 h-4" />
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ec4899',
                }}
              />
            </NavLink>

            {/* Support Center Link */}
            <NavLink
              to="/admin/support"
              className="btn-icon"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
              title="Super Admin Helpdesk"
            >
              <LifeBuoy className="w-4 h-4" />
            </NavLink>

            {/* User Profile Pill */}
            <NavLink
              to="/admin/profile"
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(236, 72, 153, 0.15)',
                color: 'var(--primary-color, #ec4899)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Edit Admin Profile & Salon Branding"
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>{user?.role || user?.userType || 'ADMIN'}</span>
            </NavLink>
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
