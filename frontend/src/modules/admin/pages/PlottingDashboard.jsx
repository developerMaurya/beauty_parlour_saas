import React from 'react';
import { 
  Building, 
  MapPin, 
  Layers, 
  Compass, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  Calculator,
  UserCheck
} from 'lucide-react';

export default function PlottingDashboard() {
  const plots = [
    { plotNo: 'Plot A-101', colony: 'Kashi Green Valley City', size: '1200 Sq Ft', dimension: '30 x 40', price: '₹18,50,000', status: 'Available', facing: 'East' },
    { plotNo: 'Plot A-102', colony: 'Kashi Green Valley City', size: '1500 Sq Ft', dimension: '30 x 50', price: '₹23,20,000', status: 'Booked', facing: 'North' },
    { plotNo: 'Plot B-205', colony: 'Ganga View Enclave', size: '1800 Sq Ft', dimension: '36 x 50', price: '₹31,00,000', status: 'Registered', facing: 'Corner' },
    { plotNo: 'Plot B-206', colony: 'Ganga View Enclave', size: '1200 Sq Ft', dimension: '30 x 40', price: '₹20,50,000', status: 'Available', facing: 'East' },
    { plotNo: 'Plot C-310', colony: 'Royal Orchid Township', size: '2400 Sq Ft', dimension: '40 x 60', price: '₹42,00,000', status: 'Hold', facing: 'North-East' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(4, 120, 87, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
              REAL ESTATE GIS
            </span>
            <span style={{ fontSize: '12px', color: '#a7f3d0' }}>Kashi Service Real Estate & Plotting Wing</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
            Real Estate Plotting & Colony Admin Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#d1fae5', maxWidth: '650px' }}>
            Interactive residential colony masterplans, plot booking status (Available, Booked, Registered), registry tracking, customer EMI calculations, and land development ledgers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fef08a' }}>128</div>
            <div style={{ fontSize: '11px', color: '#d1fae5' }}>Total Plots</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#6ee7b7' }}>84</div>
            <div style={{ fontSize: '11px', color: '#d1fae5' }}>Sold / Registered</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Available Plots', value: '44 Plots', sub: 'Ready for Immediate Booking', icon: Compass, color: '#10b981' },
          { title: 'Registry in Progress', value: '12 Plots', sub: 'Sub-registrar office verification', icon: FileText, color: '#3b82f6' },
          { title: 'Active EMI Accounts', value: '38 Customers', sub: 'Monthly instalment collections', icon: Calculator, color: '#f59e0b' },
          { title: 'RERA Approved Colonies', value: '3 Projects', sub: '100% legal title clear', icon: ShieldCheck, color: '#06b6d4' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: `${card.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  flexShrink: 0
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>{card.title}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>{card.value}</div>
                <div style={{ fontSize: '0.75rem', color: card.color, fontWeight: 600 }}>{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plots Inventory Table */}
      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
          Colony Layout Plot Master Inventory
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                <th style={{ padding: '10px 14px' }}>Plot Number</th>
                <th style={{ padding: '10px 14px' }}>Township Colony</th>
                <th style={{ padding: '10px 14px' }}>Size & Dimension</th>
                <th style={{ padding: '10px 14px' }}>Road Facing</th>
                <th style={{ padding: '10px 14px' }}>Price</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {plots.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>{p.plotNo}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary, #475569)' }}>{p.colony}</td>
                  <td style={{ padding: '12px 14px' }}>{p.size} ({p.dimension})</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary, #475569)' }}>{p.facing}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#047857' }}>{p.price}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: p.status === 'Available' ? '#ecfdf5' : p.status === 'Booked' ? '#fef3c7' : '#e0e7ff',
                        color: p.status === 'Available' ? '#059669' : p.status === 'Booked' ? '#d97706' : '#4338ca',
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
