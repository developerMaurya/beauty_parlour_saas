/**
 * @file StaffPayslipsPage.jsx
 * @description Monthly Payslips and Salary Slips for Staff.
 * Conforms to Phase 05 Section 30.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as finApi from '../../../services/api/staff/salaryFetcher.js';

export default function StaffPayslipsPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayslips() {
      try {
        setLoading(true);
        const res = await finApi.getPayslips();
        if (res?.data) {
          setPayslips(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.warn('Payslips load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayslips();
  }, []);

  const handleDownload = async (slipId) => {
    try {
      await finApi.downloadPayslip(slipId);
      success('Payslip download started!');
    } catch (err) {
      toastError(err?.response?.data?.message || 'Download failed');
    }
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
            {payslips.map((p) => (
              <div
                key={p._id}
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
                    Payslip — {p.month ? `${p.month} ${p.year}` : 'Recent Month'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                    Gross: ₹{p.grossSalary || 0} • Deductions: ₹{p.deductions || 0}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>NET PAID</div>
                    <div style={{ color: '#10b981', fontWeight: '800', fontSize: '16px' }}>
                      ₹{p.netSalary || p.netAmount || 0}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(p._id)}
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
                    ⬇️ Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
