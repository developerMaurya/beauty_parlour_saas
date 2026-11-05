/**
 * @file CustomerPaymentsPage.jsx
 * @description Customer Financial Ledger, Online & Offline Payments, and Invoices.
 * Displays summary cards, detailed transaction table, and refund request submission modal.
 * @module frontend/src/modules/customer/pages/CustomerPaymentsPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as paymentApi from '../../../services/api/customer/paymentFetcher.js';
import * as refundApi from '../../../services/api/customer/refundFetcher.js';

export default function CustomerPaymentsPage() {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refund Modal State
  const [refundModal, setRefundModal] = useState(null);
  const [refundForm, setRefundForm] = useState({ amount: '', reason: '' });
  const [submittingRefund, setSubmittingRefund] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [sumRes, payRes] = await Promise.allSettled([
        paymentApi.getPaymentSummary(),
        paymentApi.getPaymentHistory(),
      ]);
      if (sumRes.status === 'fulfilled' && sumRes.value?.data) {
        setSummary(sumRes.value.data);
      }
      if (payRes.status === 'fulfilled' && payRes.value?.data) {
        const list = Array.isArray(payRes.value.data) ? payRes.value.data : (payRes.value.data?.payments || []);
        setPayments(list);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!refundModal) return;
    setSubmittingRefund(true);
    setMsg({ type: '', text: '' });

    try {
      await refundApi.createRefundRequest({
        paymentId: refundModal._id,
        appointmentId: refundModal.appointmentId?._id || refundModal.appointmentId || null,
        amount: Number(refundForm.amount || refundModal.amount || 0),
        reason: refundForm.reason,
      });
      setMsg({ type: 'success', text: 'Refund request filed successfully for administrative review!' });
      setRefundModal(null);
      await loadData();
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Failed to file refund request.' });
    } finally {
      setSubmittingRefund(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
            Payments & Invoices Ledger
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Full financial accounting of all online UPI payments, salon cash receipts, and tax invoices.
          </p>
        </div>
        <NavLink
          to="/customer/payments/invoices"
          style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#ec4899', textDecoration: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(236, 72, 153, 0.3)' }}
        >
          🧾 View All Tax Invoices →
        </NavLink>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 18px', borderRadius: '12px', fontSize: '13.5px', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: msg.type === 'success' ? '#34d399' : '#f87171' }}>
          {msg.text}
        </div>
      )}

      {/* Summary Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Services Paid', value: summary?.totalPaid ? `₹${summary.totalPaid.toLocaleString()}` : '₹0', icon: '💰', color: '#ec4899' },
          { label: 'Paid Online (UPI/Card)', value: summary?.onlinePaid ? `₹${summary.onlinePaid.toLocaleString()}` : '₹0', icon: '⚡', color: '#3b82f6' },
          { label: 'Paid Offline (Cash/POS)', value: summary?.offlinePaid ? `₹${summary.offlinePaid.toLocaleString()}` : '₹0', icon: '💵', color: '#10b981' },
          { label: 'Pending Balance', value: summary?.pending ? `₹${summary.pending.toLocaleString()}` : '₹0', icon: '⏳', color: summary?.pending > 0 ? '#ef4444' : '#64748b' },
          { label: 'Refunded Amount', value: summary?.refunded ? `₹${summary.refunded.toLocaleString()}` : '₹0', icon: '🔄', color: '#a78bfa' },
        ].map((c, i) => (
          <div key={i} style={{ background: 'rgba(17, 24, 39, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{c.label}</span>
              <span style={{ fontSize: '18px' }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Payment Transactions Table */}
      <div style={{ background: 'rgba(17, 24, 39, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
          Transaction History
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading financial ledger...</div>
        ) : payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No payment transactions recorded yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Invoice #</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Channel</th>
                <th style={{ padding: '12px' }}>Txn Ref</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const isPaid = ['completed', 'paid', 'success'].includes(p.status?.toLowerCase());
                return (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#f8fafc' }}>
                    <td style={{ padding: '14px 12px', color: '#cbd5e1' }}>
                      {new Date(p.createdAt || p.paidAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 600 }}>
                      {p.invoiceNumber || `INV-${p._id.slice(-6).toUpperCase()}`}
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 800, color: '#10b981' }}>
                      ₹{p.amount || p.totalAmount}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                        {p.paymentMethod || 'Online'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#94a3b8', fontSize: '12px' }}>
                      {p.transactionId || '—'}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', background: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isPaid ? '#10b981' : '#ef4444', padding: '2px 8px', borderRadius: '4px' }}>
                        {p.status?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setRefundModal(p);
                            setRefundForm({ amount: p.amount || p.totalAmount, reason: 'Service issue' });
                          }}
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '11.5px', cursor: 'pointer' }}
                        >
                          Request Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Refund Request Modal */}
      {refundModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '100%', maxWidth: '440px', background: '#111827', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: '0 0 10px' }}>
              File Refund Request
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 18px' }}>
              Requests are reviewed by salon accounts per cancellation and refund policies.
            </p>
            <form onSubmit={handleRefundSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Refund Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Reason for Dispute / Refund *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain why you are requesting a refund..."
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRefundModal(null)}
                  style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRefund}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {submittingRefund ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
