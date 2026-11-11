import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Scissors,
  PartyPopper,
  Compass,
  Key,
  Code2,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Activity,
  Calendar,
  Building2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const verticals = [
    {
      id: 'golden-beauty-parlour',
      name: 'Golden Beauty Parlour',
      type: 'Beauty & Wellness',
      path: '/admin/dashboard?tab=overview',
      icon: Scissors,
      color: '#ec4899',
      bgColor: '#fdf2f8',
      todayRevenue: '₹38,500',
      activeItems: '14 Appointments Today',
      secondaryMetric: '3 Home Specialists Live',
      status: 'Open & Running',
    },
    {
      id: 'event-decoration',
      name: 'Event & Decoration',
      type: 'Stage & Wedding Decor',
      path: '/admin/event-decoration',
      icon: PartyPopper,
      color: '#a855f7',
      bgColor: '#faf5ff',
      todayRevenue: '₹1,20,000',
      activeItems: '4 Confirmed Bookings',
      secondaryMetric: '14 Themes in Production',
      status: 'Wedding Season Surge',
    },
    {
      id: 'plotting',
      name: 'Real Estate Plotting',
      type: 'Residential Townships',
      path: '/admin/plotting',
      icon: Compass,
      color: '#059669',
      bgColor: '#ecfdf5',
      todayRevenue: '₹4,50,000',
      activeItems: '44 Available Plots',
      secondaryMetric: '12 Registries in Progress',
      status: 'RERA Clear',
    },
    {
      id: 'rent-office',
      name: 'Office & Rent Commercial',
      type: 'Commercial Leasing',
      path: '/admin/rent-office',
      icon: Key,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      todayRevenue: '₹85,000',
      activeItems: '24 Leased Units (80%)',
      secondaryMetric: '6 Vacant Cabins Ready',
      status: 'Active Leases',
    },
    {
      id: 'rb-software',
      name: 'RB Software Hub',
      type: 'Enterprise Solutions',
      path: '/admin/rb-software',
      icon: Code2,
      color: '#6366f1',
      bgColor: '#eef2ff',
      todayRevenue: '₹95,000',
      activeItems: '5 Core Enterprise Apps',
      secondaryMetric: '99.98% Cloud Uptime',
      status: 'All Systems Normal',
    },
  ];

  return (
    <div
      style={{
        background: 'var(--bg-surface, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#e0e7ff',
                color: '#4338ca',
                textTransform: 'uppercase',
              }}
            >
              Enterprise Cockpit
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>5 Multi-Business Verticals</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary, #0f172a)' }}>
            All Business Dashboards Summary
          </h2>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span>Real-time Live Sync</span>
        </div>
      </div>

      {/* Grid of 5 Verticals */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {verticals.map((v) => {
          const Icon = v.icon;
          return (
            <div
              key={v.id}
              style={{
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '14px',
                padding: '1.25rem',
                background: 'var(--bg-app, #f8fafc)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = v.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 16px ${v.color}20`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color, #e2e8f0)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: v.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: v.color,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: v.bgColor,
                      color: v.color,
                    }}
                  >
                    {v.status}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                  {v.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginBottom: '0.85rem' }}>
                  {v.type}
                </div>

                <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#ffffff', border: '1px solid #e2e8f0', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Operations / Revenue:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: v.color }}>
                    {v.todayRevenue}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#334155', fontWeight: 600, marginTop: '2px' }}>
                    {v.activeItems}
                  </div>
                </div>
              </div>

              <NavLink
                to={v.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: v.color,
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  boxShadow: `0 2px 8px ${v.color}35`,
                }}
              >
                <span>Open Dashboard</span>
                <ArrowRight size={14} />
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
