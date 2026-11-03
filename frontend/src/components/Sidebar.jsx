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
    title: 'Dashboard',
    icon: LayoutDashboard,
    basePath: '/superadmin/dashboard',
    items: [
      { name: 'Overview', path: '/superadmin/dashboard' },
      { name: 'Analytics', path: '/superadmin/dashboard?tab=analytics' },
      { name: 'Revenue Reports', path: '/superadmin/dashboard?tab=revenue' },
    ],
  },
  {
    title: 'Tenant Management',
    icon: Building2,
    basePath: '/superadmin/tenants',
    items: [
      { name: 'All Tenants', path: '/superadmin/tenants' },
      { name: 'Add Tenant', path: '/superadmin/tenants/create' },
      { name: 'Active Tenants', path: '/superadmin/tenants?status=ACTIVE' },
      { name: 'Trial Tenants', path: '/superadmin/tenants?status=TRIAL' },
      { name: 'Suspended Tenants', path: '/superadmin/tenants?status=SUSPENDED' },
    ],
  },
  {
    title: 'Industry Verticals',
    icon: Sparkles,
    basePath: '/superadmin/verticals',
    items: [
      { name: 'All Verticals (Salon/Spa)', path: '/superadmin/verticals' },
      { name: 'Pre-Seeded Catalogues', path: '/superadmin/verticals?tab=templates' },
      { name: 'White-Label Theme Kits', path: '/superadmin/themes' },
    ],
  },
  {
    title: 'Database Management',
    icon: Database,
    basePath: '/superadmin/databases',

    items: [
      { name: 'Database Overview', path: '/superadmin/databases' },
      { name: 'Shared Database', path: '/superadmin/databases?tab=shared' },
      { name: 'Separate Databases', path: '/superadmin/databases?tab=separate' },
      { name: 'Database Assignments', path: '/superadmin/databases?tab=assignments' },
      { name: 'Database Health', path: '/superadmin/databases?tab=health' },
      { name: 'Backup Management', path: '/superadmin/databases?tab=backups' },
      { name: 'Restore Management', path: '/superadmin/databases?tab=restores' },
      { name: 'Migration Management', path: '/superadmin/databases?tab=migrations' },
    ],
  },
  {
    title: 'Plan Management',
    icon: Layers,
    basePath: '/superadmin/plans',
    items: [
      { name: 'All Plans', path: '/superadmin/plans' },
      { name: 'Create Plan', path: '/superadmin/plans?action=create' },
      { name: 'Plan Features', path: '/superadmin/plans?tab=features' },
      { name: 'Plan Limits', path: '/superadmin/plans?tab=limits' },
      { name: 'Plan Comparison', path: '/superadmin/plans?tab=comparison' },
    ],
  },
  {
    title: 'Subscription',
    icon: CreditCard,
    basePath: '/superadmin/subscriptions',
    items: [
      { name: 'All Subscriptions', path: '/superadmin/subscriptions' },
      { name: 'Active Subscriptions', path: '/superadmin/subscriptions?status=active' },
      { name: 'Trial Subscriptions', path: '/superadmin/subscriptions?status=trialing' },
      { name: 'Expired Subscriptions', path: '/superadmin/subscriptions?status=past_due' },
      { name: 'Renewals', path: '/superadmin/subscriptions?tab=renewals' },
      { name: 'Upgrades', path: '/superadmin/subscriptions?tab=upgrades' },
      { name: 'Downgrades', path: '/superadmin/subscriptions?tab=downgrades' },
      { name: 'Cancellations', path: '/superadmin/subscriptions?status=canceled' },
    ],
  },
  {
    title: 'Feature Management',
    icon: Sliders,
    basePath: '/superadmin/features',
    items: [
      { name: 'All Features', path: '/superadmin/features' },
      { name: 'Create Feature', path: '/superadmin/features?action=create' },
      { name: 'Feature Categories', path: '/superadmin/features?tab=categories' },
      { name: 'Plan Feature Assignment', path: '/superadmin/features?tab=assignment' },
    ],
  },
  {
    title: 'Add-on Management',
    icon: Puzzle,
    basePath: '/superadmin/addons',
    items: [
      { name: 'All Add-ons', path: '/superadmin/addons' },
      { name: 'Create Add-on', path: '/superadmin/addons?action=create' },
      { name: 'Tenant Add-on Assignment', path: '/superadmin/addons?tab=assignments' },
    ],
  },
  {
    title: 'Domain Management',
    icon: Globe,
    basePath: '/superadmin/domains',
    items: [
      { name: 'All Domains', path: '/superadmin/domains' },
      { name: 'Add Domain', path: '/superadmin/domains?action=create' },
      { name: 'Verified Domains', path: '/superadmin/domains?status=active' },
      { name: 'Pending Verification', path: '/superadmin/domains?status=pending_verification' },
      { name: 'SSL Status', path: '/superadmin/domains?tab=ssl' },
    ],
  },
  {
    title: 'Billing and Payments',
    icon: Receipt,
    basePath: '/superadmin/billing',
    items: [
      { name: 'Transactions', path: '/superadmin/billing?tab=transactions' },
      { name: 'Invoices', path: '/superadmin/billing?tab=invoices' },
      { name: 'Refunds', path: '/superadmin/billing?tab=refunds' },
      { name: 'Payment Reports', path: '/superadmin/billing?tab=reports' },
      { name: 'Tax Settings', path: '/superadmin/billing?tab=tax' },
    ],
  },
  {
    title: 'Coupons / Discounts',
    icon: Tag,
    basePath: '/superadmin/coupons',
    items: [
      { name: 'Coupons', path: '/superadmin/coupons' },
      { name: 'Create Coupon', path: '/superadmin/coupons?action=create' },
      { name: 'Discount History', path: '/superadmin/coupons?tab=history' },
    ],
  },
  {
    title: 'Usage and Limits',
    icon: Activity,
    basePath: '/superadmin/usage',
    items: [
      { name: 'Platform Usage', path: '/superadmin/usage' },
      { name: 'Tenant Usage', path: '/superadmin/usage?tab=tenants' },
      { name: 'Resource Limits', path: '/superadmin/usage?tab=limits' },
      { name: 'Usage Reports', path: '/superadmin/usage?tab=reports' },
    ],
  },
  {
    title: 'White-Label Settings',
    icon: Palette,
    basePath: '/superadmin/settings',
    items: [
      { name: 'Platform Branding', path: '/superadmin/settings?tab=branding' },
      { name: 'Logos', path: '/superadmin/settings?tab=branding&sub=logos' },
      { name: 'Colors', path: '/superadmin/settings?tab=branding&sub=colors' },
      { name: 'Default Website', path: '/superadmin/settings?tab=website' },
      { name: 'Email Branding', path: '/superadmin/settings?tab=email_branding' },
      { name: 'Tenant Branding', path: '/superadmin/settings?tab=tenant_branding' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    basePath: '/superadmin/notifications',
    items: [
      { name: 'Notification Templates', path: '/superadmin/notifications' },
      { name: 'Send Notification', path: '/superadmin/notifications?action=send' },
      { name: 'Email Logs', path: '/superadmin/notifications?tab=email_logs' },
      { name: 'SMS Logs', path: '/superadmin/notifications?tab=sms_logs' },
      { name: 'WhatsApp Logs', path: '/superadmin/notifications?tab=whatsapp_logs' },
    ],
  },
  {
    title: 'Support',
    icon: LifeBuoy,
    basePath: '/superadmin/support',
    items: [
      { name: 'All Tickets', path: '/superadmin/support' },
      { name: 'Open Tickets', path: '/superadmin/support?status=open' },
      { name: 'Closed Tickets', path: '/superadmin/support?status=closed' },
      { name: 'Ticket Details', path: '/superadmin/support?tab=details' },
    ],
  },
  {
    title: 'Security and Logs',
    icon: ShieldCheck,
    basePath: '/superadmin/audit-logs',
    items: [
      { name: 'Audit Logs', path: '/superadmin/audit-logs' },
      { name: 'Login History', path: '/superadmin/audit-logs?tab=login_history' },
      { name: 'Security Events', path: '/superadmin/audit-logs?tab=security_events' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    basePath: '/superadmin/settings',
    items: [
      { name: 'General Settings', path: '/superadmin/settings?tab=general' },
      { name: 'Email Settings', path: '/superadmin/settings?tab=email' },
      { name: 'Payment Gateways', path: '/superadmin/settings?tab=payment' },
      { name: 'Notification Settings', path: '/superadmin/settings?tab=notifications' },
      { name: 'Domain Settings', path: '/superadmin/settings?tab=domain' },
      { name: 'Database Settings', path: '/superadmin/settings?tab=database' },
      { name: 'Security Settings', path: '/superadmin/settings?tab=security' },
    ],
  },
  {
    title: 'Profile',
    icon: User,
    basePath: '/superadmin/profile',
    items: [
      { name: 'My Profile', path: '/superadmin/profile' },
      { name: 'Change Password', path: '/superadmin/profile?tab=password' },
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
