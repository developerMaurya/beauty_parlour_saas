/**
 * @file Sidebar.jsx
 * @description Super Admin Navigation Sidebar with Collapsible Groups and Search
 */

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Database,
  Layers,
  CreditCard,
  Sliders,
  Puzzle,
  Globe,
  Receipt,
  Tag,
  Activity,
  Palette,
  Bell,
  LifeBuoy,
  ShieldCheck,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    title: 'Platform Overview',
    icon: LayoutDashboard,
    basePath: '/superadmin/dashboard',
    items: [
      { name: 'Dashboard & Analytics', path: '/superadmin/dashboard' },
    ],
  },
  {
    title: 'Master Management',
    icon: Layers,
    basePath: '/superadmin/masters',
    items: [
      { name: 'Central Master Registry', path: '/superadmin/masters' },
      { name: 'Industry Verticals', path: '/superadmin/masters?category=VERTICAL' },
      { name: 'Service Catalogues', path: '/superadmin/masters?category=SERVICE_CATEGORY' },
      { name: 'Executive Roles', path: '/superadmin/masters?category=EXECUTIVE_ROLE' },
      { name: 'SaaS Subscription Plans', path: '/superadmin/masters?category=PLAN' },
      { name: 'Taxes & Currencies', path: '/superadmin/masters?category=TAX_SLAB' },
    ],
  },
  {
    title: 'Tenant Management',
    icon: Building2,
    basePath: '/superadmin/tenants',
    items: [
      { name: 'All Tenants', path: '/superadmin/tenants' },
      { name: 'Provision Tenant Wizard', path: '/superadmin/tenants/create' },
      { name: 'Unified Control Center', path: '/superadmin/access-control' },
    ],
  },
  {
    title: 'Database Architecture',
    icon: Database,
    basePath: '/superadmin/databases',
    items: [
      { name: 'Clusters & Health Diagnostics', path: '/superadmin/databases' },
      { name: 'Shared Partition (Mode A)', path: '/superadmin/databases?tab=shared' },
      { name: 'Dedicated DB (Mode B)', path: '/superadmin/databases?tab=separate' },
    ],
  },
  {
    title: 'Domains & Routing',
    icon: Globe,
    basePath: '/superadmin/domains',
    items: [
      { name: 'Custom Domains & SSL', path: '/superadmin/domains' },
      { name: 'Subdomain Router', path: '/superadmin/domains?tab=subdomains' },
    ],
  },
  {
    title: 'Plans & Subscriptions',
    icon: Layers,
    basePath: '/superadmin/plans',
    items: [
      { name: 'Subscription Plans', path: '/superadmin/plans' },
      { name: 'Active Subscriptions', path: '/superadmin/subscriptions' },
      { name: 'Feature Add-ons', path: '/superadmin/addons' },
    ],
  },
  {
    title: 'Billing & Invoices',
    icon: Receipt,
    basePath: '/superadmin/billing',
    items: [
      { name: 'Invoices & Receipts', path: '/superadmin/billing?tab=invoices' },
      { name: 'Transactions & Gateways', path: '/superadmin/billing?tab=transactions' },
    ],
  },
  {
    title: 'Industry Verticals',
    icon: Sparkles,
    basePath: '/superadmin/verticals',
    items: [
      { name: 'Salon, Spa & Academy Verticals', path: '/superadmin/verticals' },
      { name: 'White-Label Theme Kits', path: '/superadmin/themes' },
    ],
  },
  {
    title: 'Communications & Logs',
    icon: Bell,
    basePath: '/superadmin/notifications',
    items: [
      { name: 'Multi-Channel Notifications', path: '/superadmin/notifications' },
      { name: 'Security Audit Logs', path: '/superadmin/audit-logs' },
      { name: 'Support Helpdesk', path: '/superadmin/support' },
      { name: 'System Settings', path: '/superadmin/settings' },
    ],
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentPathWithSearch = `${location.pathname}${location.search}`;

  // Keep groups expanded if the current path falls under it, with full toggle capability
  const [expanded, setExpanded] = useState(() => {
    const initial = {};
    NAV_GROUPS.forEach((group) => {
      if (location.pathname.startsWith(group.basePath)) {
        initial[group.title] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (title) => {
    setExpanded((prev) => {
      const isCurrentlyExpanded = prev[title] !== undefined
        ? prev[title]
        : location.pathname.startsWith(NAV_GROUPS.find((g) => g.title === title)?.basePath || '');
      return { ...prev, [title]: !isCurrentlyExpanded };
    });
  };

  const handleGroupClick = (group, e) => {
    const isAlreadyOnBase = location.pathname === group.basePath && !location.search;
    if (isAlreadyOnBase) {
      toggleGroup(group.title);
    } else {
      navigate(group.basePath);
      setExpanded((prev) => ({ ...prev, [group.title]: true }));
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '8px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Beauty SaaS</span>
          <span className="brand-badge">Super</span>
        </div>
      </div>

      <div className="sidebar-scroll">
        {NAV_GROUPS.map((group) => {
          const isGroupActive = location.pathname.startsWith(group.basePath);
          const isExpanded = expanded[group.title] !== undefined
            ? !!expanded[group.title]
            : isGroupActive;
          const GroupIcon = group.icon;

          return (
            <div key={group.title} style={{ marginBottom: '0.4rem' }}>
              <div
                onClick={(e) => handleGroupClick(group, e)}
                className={`sidebar-link ${isGroupActive ? 'active' : ''}`}
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isGroupActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  color: isGroupActive ? 'var(--primary)' : 'var(--text-secondary)',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <GroupIcon className="link-icon" />
                  <span style={{ fontWeight: 600 }}>{group.title}</span>
                </div>
                <button
                  type="button"
                  className="chevron-toggle-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(group.title);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <ChevronDown
                    className="w-4 h-4"
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      opacity: 0.6,
                    }}
                  />
                </button>
              </div>

              {isExpanded && (
                <div style={{ paddingLeft: '2.1rem', marginTop: '0.2rem', display: 'flex', flexDirection: 'column' }}>
                  {group.items.map((item) => {
                    const isItemActive = currentPathWithSearch === item.path || (location.pathname === item.path && !location.search);
                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        style={{
                          padding: '0.4rem 0.65rem',
                          fontSize: '0.815rem',
                          color: isItemActive ? 'var(--primary)' : 'var(--text-muted)',
                          fontWeight: isItemActive ? 600 : 500,
                          borderRadius: '6px',
                          marginBottom: '2px',
                          background: isItemActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="sidebar-link"
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#EF4444',
          }}
        >
          <LogOut className="link-icon" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
