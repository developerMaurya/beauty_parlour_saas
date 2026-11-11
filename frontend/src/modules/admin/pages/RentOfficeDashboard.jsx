import React from 'react';
import { 
  Building2, 
  Key, 
  Users, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Phone,
  MessageSquare
} from 'lucide-react';

export default function RentOfficeDashboard() {
  const rentalUnits = [
    { unit: 'Office Space 402 (4th Floor)', building: 'Kashi Commercial Tower', type: 'Furnished IT Office (1800 sq ft)', tenant: 'TechnoSoft Solutions', rent: '₹65,000 / mo', status: 'Occupied', dueDate: '05th of Month' },
    { unit: 'Ground Floor Retail Shop #12', building: 'Heritage Arcade, Sigra', type: 'Showroom Space (850 sq ft)', tenant: 'Agarwal Diagnostics', rent: '₹48,000 / mo', status: 'Occupied', dueDate: '10th of Month' },
    { unit: 'Warehouse Unit B-3', building: 'Industrial Logistics Park, Ramnagar', type: 'Storage Facility (4500 sq ft)', tenant: 'Eastern Express Cargo', rent: '₹95,000 / mo', status: 'Occupied', dueDate: '01st of Month' },
    { unit: 'Executive Co-Working Cabin 7', building: 'Kashi Commercial Tower', type: 'Private 6-Seater Cabin', tenant: 'Available for Lease', rent: '₹22,000 / mo', status: 'Vacant', dueDate: '-' },
    { unit: 'Penthouse Office 701', building: 'Skyline Business Hub', type: 'Corner Executive Suite (2200 sq ft)', tenant: 'Available for Lease', rent: '₹85,000 / mo', status: 'Vacant', dueDate: '-' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%)',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
              LEASING & ASSETS
            </span>
            <span style={{ fontSize: '12px', color: '#bfdbfe' }}>Kashi Service Commercial Assets Wing</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
            Office & Commercial Rent Admin Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#dbeafe', maxWidth: '650px' }}>
            Central administration for commercial real estate leasing, corporate office spaces, retail showrooms, rental agreements, automated monthly GST invoices, and WhatsApp rent payment reminders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fef08a' }}>24</div>
            <div style={{ fontSize: '11px', color: '#dbeafe' }}>Leased Units</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#6ee7b7' }}>₹8.4L</div>
            <div style={{ fontSize: '11px', color: '#dbeafe' }}>Monthly Rent Collected</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Total Commercial Units', value: '30 Properties', sub: '80% Occupancy Rate', icon: Building2, color: '#3b82f6' },
          { title: 'Rent Collected This Month', value: '₹7,65,000', sub: '91% Collected on Schedule', icon: DollarSign, color: '#10b981' },
          { title: 'Active Tenant Leases', value: '24 Tenants', sub: 'Digital Rent Agreements', icon: Users, color: '#8b5cf6' },
          { title: 'Vacant Spaces Ready', value: '6 Units', sub: 'Immediate possession available', icon: Key, color: '#f59e0b' },
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

      {/* Rental Units Table */}
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
          Commercial Premises & Lease Ledger
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                <th style={{ padding: '10px 14px' }}>Premise / Unit</th>
                <th style={{ padding: '10px 14px' }}>Building / Complex</th>
                <th style={{ padding: '10px 14px' }}>Type & Area</th>
                <th style={{ padding: '10px 14px' }}>Current Lessee</th>
                <th style={{ padding: '10px 14px' }}>Monthly Rent</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentalUnits.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>{item.unit}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary, #475569)' }}>{item.building}</td>
                  <td style={{ padding: '12px 14px' }}>{item.type}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-secondary, #334155)' }}>{item.tenant}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2563eb' }}>{item.rent}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: item.status === 'Occupied' ? '#ecfdf5' : '#fef3c7',
                        color: item.status === 'Occupied' ? '#059669' : '#d97706',
                      }}
                    >
                      {item.status}
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
