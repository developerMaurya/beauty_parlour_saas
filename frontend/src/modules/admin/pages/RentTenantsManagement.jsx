/**
 * @file RentTenantsManagement.jsx
 * @description Office & Commercial Rent - Leased Tenants, Rent Invoices & Available Commercial Units Management.
 * @module frontend/src/modules/admin/pages/RentTenantsManagement
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Key,
  Building,
  Users,
  DollarSign,
  Plus,
  Search,
  Trash2,
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Send,
} from 'lucide-react';

const INITIAL_TENANTS = [
  {
    id: 'rnt_tnt_01',
    businessName: 'Varanasi Tech Solutions Pvt Ltd',
    contactPerson: 'Aditya Srivastava',
    unit: 'Suite 401 (Furnished Executive Cabin)',
    tower: 'Kashi Commercial Tower A',
    monthlyRent: 45000,
    deposit: 135000,
    phone: '+91 98222 11001',
    leaseStart: '2026-01-01',
    leaseEnd: '2027-12-31',
    rentStatus: 'PAID', // 'PAID' | 'PENDING' | 'OVERDUE'
  },
  {
    id: 'rnt_tnt_02',
    businessName: 'Kashi Diagnostic & Pathology Lab',
    contactPerson: 'Dr. Vivek Mishra',
    unit: 'Shop GF-02 (Ground Floor Retail Showroom)',
    tower: 'Heritage Trade Center',
    monthlyRent: 85000,
    deposit: 250000,
    phone: '+91 98333 44112',
    leaseStart: '2025-06-01',
    leaseEnd: '2028-05-31',
    rentStatus: 'PAID',
  },
  {
    id: 'rnt_tnt_03',
    businessName: 'Tiwari & Associates Legal Chamber',
    contactPerson: 'Adv. Suresh Tiwari',
    unit: 'Office 203 (Private Practice Suite)',
    tower: 'Kashi Commercial Tower B',
    monthlyRent: 32000,
    deposit: 96000,
    phone: '+91 98444 88991',
    leaseStart: '2026-03-01',
    leaseEnd: '2027-02-28',
    rentStatus: 'PENDING',
  },
  {
    id: 'rnt_tnt_04',
    businessName: 'Chai & Co. Cafe Lounge',
    contactPerson: 'Pooja Agarwal',
    unit: 'Terrace Kiosk TK-01 (High-Footfall Retail)',
    tower: 'Heritage Trade Center',
    monthlyRent: 28000,
    deposit: 84000,
    phone: '+91 98777 33441',
    leaseStart: '2026-02-01',
    leaseEnd: '2027-01-31',
    rentStatus: 'PAID',
  },
];

export default function RentTenantsManagement() {
  const [tenants, setTenants] = useState(() => {
    try {
      const stored = localStorage.getItem('kashi_rent_tenants');
      return stored ? JSON.parse(stored) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('kashi_rent_tenants', JSON.stringify(tenants));
  }, [tenants]);

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    unit: '',
    tower: 'Kashi Commercial Tower A',
    monthlyRent: '',
    deposit: '',
    phone: '',
    rentStatus: 'PAID',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.businessName || !form.unit || !form.monthlyRent || !form.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    const newTenant = {
      id: `rnt_tnt_${Date.now()}`,
      businessName: form.businessName,
      contactPerson: form.contactPerson || form.businessName,
      unit: form.unit,
      tower: form.tower,
      monthlyRent: Number(form.monthlyRent) || 35000,
      deposit: Number(form.deposit) || Number(form.monthlyRent) * 3,
      phone: form.phone,
      leaseStart: new Date().toISOString().split('T')[0],
      leaseEnd: '2027-12-31',
      rentStatus: form.rentStatus,
    };
    setTenants([newTenant, ...tenants]);
    setModalOpen(false);
    setForm({
      businessName: '',
      contactPerson: '',
      unit: '',
      tower: 'Kashi Commercial Tower A',
      monthlyRent: '',
      deposit: '',
      phone: '',
      rentStatus: 'PAID',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this leased tenant record?')) {
      setTenants(tenants.filter((t) => t.id !== id));
    }
  };

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      return (
        t.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.phone.includes(searchQuery)
      );
    });
  }, [tenants, searchQuery]);

  const totalMonthlyCollection = tenants.reduce((s, t) => s + (t.monthlyRent || 0), 0);
  const totalDepositHeld = tenants.reduce((s, t) => s + (t.deposit || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #075985 0%, #0284c7 50%, #0369a1 100%)',
          color: '#ffffff',
          padding: '2rem 2.25rem',
          borderRadius: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.25)',
        }}
      >
        <div>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: '#e0f2fe', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Key size={13} color="#7dd3fc" />
            COMMERCIAL LEASING & CORPORATE SUITES
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '6px 0', color: '#ffffff' }}>
            🏢 Leased Tenants, Rent Invoices & WhatsApp Alerts
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#bae6fd', maxWidth: '720px' }}>
            Track office leases, retail showrooms, monthly rent payments, and digital WhatsApp rent receipt generation.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: '#ffffff',
            color: '#0369a1',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} />
          <span>+ Add Leased Tenant</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Monthly Rent Roll</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0284c7', marginTop: 4 }}>
            ₹{(totalMonthlyCollection / 100000).toFixed(2)} Lakh/mo
          </div>
          <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>
            {tenants.length} Active Leased Units
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Security Deposit Pool</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
            ₹{(totalDepositHeld / 100000).toFixed(2)} Lakh
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
            Protected in Escrow
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Occupancy Rate</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
            88% Occupied
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
            4 Units Available for Lease
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>WhatsApp Rent Receipts</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#047857', marginTop: 4 }}>
            100% Automated
          </div>
          <div style={{ fontSize: '11px', color: '#047857', fontWeight: 700, marginTop: 4 }}>
            Instant PDF dispatched on rent pay
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
          Commercial Tenants Directory ({filtered.length})
        </h3>
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant, unit or phone..."
            style={{ padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Business & Contact</th>
                <th style={{ padding: '12px 16px' }}>Commercial Unit</th>
                <th style={{ padding: '12px 16px' }}>Tower & Location</th>
                <th style={{ padding: '12px 16px' }}>Monthly Rent</th>
                <th style={{ padding: '12px 16px' }}>Security Deposit</th>
                <th style={{ padding: '12px 16px' }}>Rent Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.businessName}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{t.contactPerson} • {t.phone}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0284c7' }}>{t.unit}</td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{t.tower}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#047857' }}>
                    ₹{t.monthlyRent.toLocaleString('en-IN')}/mo
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    ₹{t.deposit.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: t.rentStatus === 'PAID' ? '#ecfdf5' : '#fef3c7',
                        color: t.rentStatus === 'PAID' ? '#047857' : '#b45309',
                      }}
                    >
                      ● {t.rentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(t.id)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>🏢 Add Leased Commercial Tenant</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" required placeholder="Company / Brand Name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Contact Person Name" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" required placeholder="Unit Details (e.g. Suite 501 / Retail GF-04)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="number" required placeholder="Monthly Rent (₹)" value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="tel" required placeholder="WhatsApp Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

