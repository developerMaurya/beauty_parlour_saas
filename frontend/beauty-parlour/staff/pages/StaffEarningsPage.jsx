/**
 * @file StaffEarningsPage.jsx
 * @description Monthly Earnings, Commission Breakdown & Financial Statements for Staff.
 * Conforms to Phase 05 Section 29, 30 & 31.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as finApi from '../../../services/api/staff/earningFetcher.js';
import * as commApi from '../../../services/api/staff/commissionFetcher.js';

export default function StaffEarningsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('earnings'); // 'earnings' | 'commission'
  const [earnings, setEarnings] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinances() {
      try {
        setLoading(true);
        const [eRes, cRes] = await Promise.allSettled([
          finApi.getEarningsOverview(),
          commApi.getCommissionHistory(),
        ]);
        if (eRes.status === 'fulfilled' && eRes.value?.data) setEarnings(eRes.value.data);
        if (cRes.status === 'fulfilled' && cRes.value?.data) {
          setCommissions(Array.isArray(cRes.value.data) ? cRes.value.data : []);
        }
      } catch (err) {
        console.warn('Finance load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFinances();
  }, []);

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>💰</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              My Earnings & Commissions
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#fde68a', fontSize: '13.5px' }}>
            Transparent calculation of base pay, service commissions, bonuses and deductions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'earnings', label: 'Earnings Summary' },
              { id: 'commission', label: 'Commission Ledger' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/staff/payslips')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🧾 View Payslips →
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading financial statement...</div>
      ) : activeTab === 'earnings' ? (
        <>
          {/* Earnings Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={kpiCardStyle}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Fixed Base Salary</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>
                ₹{earnings?.salary ? earnings.salary.toLocaleString() : 'Protected'}
              </div>
            </div>

            <div style={kpiCardStyle}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Service Commission</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ec4899' }}>
                ₹{earnings?.commission ? earnings.commission.toLocaleString() : '0'}
              </div>
            </div>

            <div style={kpiCardStyle}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tips & Bonuses</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>
                ₹{earnings?.bonus ? earnings.bonus.toLocaleString() : '0'}
              </div>
            </div>

            <div style={kpiCardStyle}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Net Take-Home Estimate</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8' }}>
                ₹{earnings?.netAmount ? earnings.netAmount.toLocaleString() : '—'}
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
              📊 Monthly Payout Breakdown
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Gross Base Salary:</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>₹{earnings?.salary || 0}</span>
              </div>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Total Services Commission:</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>+ ₹{earnings?.commission || 0}</span>
              </div>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Performance Bonus & Overtime:</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>+ ₹{earnings?.overtime || 0}</span>
              </div>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Statutory / Advance Deductions:</span>
                <span style={{ color: '#f87171', fontWeight: '600' }}>- ₹{earnings?.deductions || 0}</span>
              </div>
              <div style={{ ...rowStyle, borderBottom: 'none', paddingTop: '8px' }}>
                <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>Net Total Estimated:</span>
                <span style={{ color: '#38bdf8', fontWeight: '800', fontSize: '18px' }}>
                  ₹{earnings?.netAmount || 0}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            ✂️ Commission Earned Per Completed Treatment
          </h2>
          {commissions.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No commission entries logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {commissions.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                      {c.service?.name || c.serviceName || 'Beauty Treatment'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Client: {c.customer?.name || 'Client'} • Bill: ₹{c.appointmentAmount || c.serviceAmount || 0}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#10b981', fontWeight: '800', fontSize: '15px' }}>
                      + ₹{c.commissionAmount || 0}
                    </div>
                    <span style={{ fontSize: '11px', color: c.status === 'paid' ? '#34d399' : '#f59e0b' }}>
                      {c.status?.toUpperCase() || 'UNPAID'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const kpiCardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  padding: '18px 20px',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};
