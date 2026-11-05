/**
 * @file CustomerReportsPage.jsx
 * @description Customer Unified Dossier & Analytical Reports.
 * Displays multi-dimensional customer reporting: spend analytics, appointments, services, and receipts.
 * @module frontend/src/modules/customer/pages/CustomerReportsPage
 */

import React, { useState, useEffect } from 'react';
import * as repApi from '../../../services/api/customer/reportFetcher.js';

export default function CustomerReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await repApi.getCompleteReport();
      if (res.data?.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customer complete dossier', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
        Synthesizing complete customer report...
      </div>
    );
  }

  const p = report?.customer || {};
  const stats = report?.overview || {};
  const appointments = report?.appointments || [];
  const payments = report?.payments || [];
  const packages = report?.packages || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Comprehensive Account Dossier
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Consolidated history of salon visits, expenditure, active subscriptions, and service records.
          </p>
        </div>
        <button
          onClick={handlePrint}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(30, 41, 59, 0.8)',
            color: '#f8fafc',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          🖨 Print / Export Dossier
        </button>
      </div>

      {/* Profile Overview Card */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Client Name</span>
          <div style={{ fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700, marginTop: '0.25rem' }}>{p.name || 'Valued Guest'}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Client Number / ID</span>
          <div style={{ fontSize: '1rem', color: '#cbd5e1', fontWeight: 600, marginTop: '0.25rem' }}>{p.customerNumber || p._id || 'N/A'}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Contact Info</span>
          <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '0.25rem' }}>{p.phone || ''} {p.email ? `• ${p.email}` : ''}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Membership Tier</span>
          <div style={{ fontSize: '0.9375rem', color: '#ec4899', fontWeight: 700, marginTop: '0.25rem' }}>Signature Platinum Client</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Appointments', value: stats.totalAppointments || appointments.length, color: '#ec4899' },
          { label: 'Completed Visits', value: stats.totalVisits || stats.completedAppointments || 0, color: '#10b981' },
          { label: 'Lifetime Expenditure', value: `₹${stats.totalSpent || 0}`, color: '#3b82f6' },
          { label: 'Total Paid Online', value: `₹${stats.onlinePaid || 0}`, color: '#8b5cf6' },
          { label: 'Total Paid Offline', value: `₹${stats.offlinePaid || 0}`, color: '#f59e0b' },
          { label: 'Active Packages', value: packages.length, color: '#06b6d4' }
        ].map((c, i) => (
          <div key={i} style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c.color, marginTop: '0.375rem' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Appointment History Summary Table */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.125rem' }}>Appointment History</h3>
        {appointments.length === 0 ? (
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>No appointment records found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Service</th>
                  <th style={{ padding: '0.75rem' }}>Branch</th>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 10).map((a, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#cbd5e1' }}>
                    <td style={{ padding: '0.75rem' }}>{a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '0.75rem', color: '#f8fafc', fontWeight: 600 }}>{a.serviceName || 'Salon Service'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.branchName || 'Main Salon'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.bookingType || 'IN_BRANCH'}</td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{a.finalAmount || 0}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.06)',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Financial Transactions Ledger */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.125rem' }}>Financial Transactions & Receipts</h3>
        {payments.length === 0 ? (
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>No payment receipts recorded.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Method</th>
                  <th style={{ padding: '0.75rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((py, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#cbd5e1' }}>
                    <td style={{ padding: '0.75rem' }}>{py.createdAt ? new Date(py.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{py.method || 'CASH'}</td>
                    <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>₹{py.amount || 0}</td>
                    <td style={{ padding: '0.75rem' }}>{py.isOnline ? 'ONLINE GATEWAY' : 'OFFLINE IN-SALON'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: py.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)',
                        color: py.status === 'PAID' ? '#10b981' : '#cbd5e1',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {py.status || 'PAID'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
