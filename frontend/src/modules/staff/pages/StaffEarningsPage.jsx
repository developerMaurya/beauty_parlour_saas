/**
 * @file StaffEarningsPage.jsx
 * @description Monthly Earnings, Commission Breakdown & Financial Statements for Staff.
 * Conforms to Phase 05 Section 29, 30 & 31.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';
import * as finApi from '../../../services/api/staff/earningFetcher.js';
import * as commApi from '../../../services/api/staff/commissionFetcher.js';
import { getMasterPayroll } from '../../../services/hrSharedStorage.js';

export default function StaffEarningsPage() {
  const navigate = useNavigate();
  const { staffUser, staffProfile } = useStaff();

  const [activeTab, setActiveTab] = useState('earnings'); // 'earnings' | 'commission'
  const [earnings, setEarnings] = useState(null);
  const [payrollItem, setPayrollItem] = useState(null);
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

        // Real-time Master Payroll sync
        const masterList = getMasterPayroll();
        const myId = staffUser?._id || staffProfile?.staffId;
        const myDept = (staffUser?.targetBusiness || 'PARLOUR').toUpperCase();
        const myRecord = masterList.find((p) => (myId ? p.staffId === myId : p.department === myDept)) || masterList[0];

        if (myRecord) {
          setPayrollItem(myRecord);
          setEarnings((prev) => ({
            ...prev,
            salary: myRecord.baseSalary,
            allowances: myRecord.allowances,
            commission: myRecord.allowances || prev?.commission || 0,
            bonus: myRecord.bonus,
            deductions: myRecord.deductions,
            netAmount: myRecord.netSalary,
            paymentStatus: myRecord.paymentStatus,
            transactionRef: myRecord.transactionRef,
            paidAt: myRecord.paidAt,
            month: myRecord.month,
          }));
        }
      } catch (err) {
        console.warn('Finance load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFinances();
  }, [staffUser, staffProfile]);

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
                📊 Monthly Salary & Payout Statement ({earnings?.month || 'November 2026'})
              </h2>
              {earnings?.paymentStatus === 'PAID' ? (
                <span style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>
                  ✅ Paid ({earnings.transactionRef || 'Bank Transfer'})
                </span>
              ) : (
                <span style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>
                  ⏳ Payout Processing
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Gross Base Salary:</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>₹{earnings?.salary?.toLocaleString() || 0}</span>
              </div>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Allowances (HRA / Conveyance):</span>
                <span style={{ color: '#38bdf8', fontWeight: '600' }}>+ ₹{earnings?.allowances?.toLocaleString() || earnings?.commission?.toLocaleString() || 0}</span>
              </div>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Performance & Festival Bonus:</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>+ ₹{earnings?.bonus?.toLocaleString() || 0}</span>
              </div>
              <div style={rowStyle}>
                <span style={{ color: '#cbd5e1' }}>Statutory / Advance / Unpaid Leaves:</span>
                <span style={{ color: '#f87171', fontWeight: '600' }}>- ₹{earnings?.deductions?.toLocaleString() || 0}</span>
              </div>
              <div style={{ ...rowStyle, borderBottom: 'none', paddingTop: '10px' }}>
                <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>Net Take-Home Salary:</span>
                <span style={{ color: '#38bdf8', fontWeight: '800', fontSize: '20px' }}>
                  ₹{earnings?.netAmount?.toLocaleString() || 0}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => navigate('/staff/payslips')}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                🧾 Download Official Payslip Slip
              </button>
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
