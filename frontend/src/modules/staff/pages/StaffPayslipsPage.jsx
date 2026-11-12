/**
 * @file StaffPayslipsPage.jsx
 * @description Monthly Payslips and Salary Slips for Staff.
 * Conforms to Phase 05 Section 30.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import { useStaff } from '../../../context/StaffContext.jsx';
import * as finApi from '../../../services/api/staff/salaryFetcher.js';
import { getMasterPayroll } from '../../../services/hrSharedStorage.js';

export default function StaffPayslipsPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { staffUser, staffProfile } = useStaff();

  const [payslips, setPayslips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayslips() {
      try {
        setLoading(true);
        let list = [];
        try {
          const res = await finApi.getPayslips();
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            list = res.data;
          }
        } catch (e) {
          console.warn('API fallback to shared payroll');
        }

        if (list.length === 0) {
          const masterList = getMasterPayroll();
          const myId = staffUser?._id || staffProfile?.staffId;
          const myDept = (staffUser?.targetBusiness || 'PARLOUR').toUpperCase();
          const filtered = masterList.filter((p) => (myId ? p.staffId === myId : p.department === myDept));
          list = filtered.length > 0 ? filtered : masterList.slice(0, 3);
        }

        setPayslips(list);
      } catch (err) {
        console.warn('Payslips load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayslips();
  }, [staffUser, staffProfile]);

  const handleDownload = (slip) => {
    setSelectedSlip(slip);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <button onClick={() => navigate('/staff/earnings')} style={backLinkStyle}>
          ← Back to Earnings & Commission
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          <span style={{ fontSize: '24px' }}>🧾</span>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
            Official Monthly Salary Payslips
          </h1>
        </div>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
          Download verified monthly salary statements and tax deduction breakdown
        </p>
      </div>

      {/* Payslips List */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading payslips...</div>
        ) : payslips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧾</div>
            <p style={{ margin: 0, fontSize: '14.5px' }}>No payslips generated for your profile yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {payslips.map((p, idx) => (
              <div
                key={p.id || p._id || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }}>
                    Payslip — {p.month || 'November 2026'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                    Base: ₹{(p.baseSalary || p.grossSalary || 0).toLocaleString()} • Bonus: +₹{(p.bonus || 0).toLocaleString()} • Deductions: -₹{(p.deductions || 0).toLocaleString()}
                  </div>
                  {p.transactionRef && (
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '3px' }}>
                      Ref: {p.transactionRef} • Status: {p.paymentStatus || 'PAID'}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>NET PAYABLE</div>
                    <div style={{ color: '#10b981', fontWeight: '800', fontSize: '16px' }}>
                      ₹{(p.netSalary || p.netAmount || 0).toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSlip(p)}
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                    }}
                  >
                    🧾 View / Print Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payslip Modal */}
      {selectedSlip && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              color: '#0f172a',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#6366f1', letterSpacing: '1px' }}>
                  KASHI SERVICE MULTI-BUSINESS
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0 0', color: '#0f172a' }}>
                  Employee Salary Slip
                </h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Period: {selectedSlip.month || 'November 2026'}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', margin: '14px 0', fontSize: '12.5px' }}>
              <div>👤 <strong>Staff:</strong> {selectedSlip.staffName || staffUser?.name || 'Staff Member'} ({selectedSlip.designation || 'Specialist'})</div>
              <div>🏢 <strong>Department:</strong> {selectedSlip.department || (staffUser?.targetBusiness || 'PARLOUR')}</div>
              <div>⚡ <strong>Status:</strong> {selectedSlip.paymentStatus || 'PAID'} {selectedSlip.transactionRef ? `(${selectedSlip.transactionRef})` : ''}</div>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Basic Salary:</span>
                <strong>₹{(selectedSlip.baseSalary || selectedSlip.grossSalary || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Allowances & Tips:</span>
                <strong style={{ color: '#0284c7' }}>+ ₹{(selectedSlip.allowances || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bonus & Incentives:</span>
                <strong style={{ color: '#16a34a' }}>+ ₹{(selectedSlip.bonus || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Deductions / Advance / PF:</span>
                <strong style={{ color: '#dc2626' }}>- ₹{(selectedSlip.deductions || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #cbd5e1', paddingTop: '10px', fontSize: '16px' }}>
                <span style={{ fontWeight: '800' }}>Net Take-Home:</span>
                <strong style={{ color: '#16a34a', fontSize: '20px' }}>₹{(selectedSlip.netSalary || selectedSlip.netAmount || 0).toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                🖨️ Print Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Close
              </button>
            </div>
          </div>
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

const backLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0,
  fontSize: '13px',
};
