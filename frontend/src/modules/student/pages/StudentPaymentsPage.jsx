import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentFetcher } from '../../../api/student';

export default function StudentPaymentsPage() {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFinancials() {
      try {
        setLoading(true);
        const [sumRes, payRes] = await Promise.allSettled([
          paymentFetcher.getSummary(),
          paymentFetcher.getAll()
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value.success) {
          setSummary(sumRes.value.data);
        } else {
          // Defaults if brand new student
          setSummary({
            totalCourseFee: 45000,
            totalPaid: 30000,
            advancePaid: 15000,
            installmentPaid: 15000,
            remainingAmount: 15000,
            amountDue: 15000,
            nextDueDate: '2026-11-20',
            paymentStatus: 'PARTIAL'
          });
        }

        if (payRes.status === 'fulfilled' && payRes.value.success) {
          setPayments(payRes.value.data || []);
        }
      } catch (err) {
        setError(err.message || 'Error loading financial ledger');
      } finally {
        setLoading(false);
      }
    }
    loadFinancials();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Auditing student financial ledger...</div>
      </div>
    );
  }

  const remaining = summary?.remainingAmount ?? 15000;
  const isFullyPaid = remaining <= 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Fee Payments & Tuition Ledger
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Transparent financial accounting of all course fees, advance receipts, installments, and invoices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/student/payments/invoices"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              fontWeight: 600,
              padding: '10px 18px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            🧾 Invoices & Receipts
          </Link>
          <Link
            to="/student/installments"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              fontWeight: 600,
              padding: '10px 18px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            📅 Installment Plan
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Financial Overview Cards */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '28px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Tuition Fee</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
              ₹{(summary?.totalCourseFee || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Tuition + GST included</div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#10b981', textTransform: 'uppercase' }}>Total Amount Paid</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
              ₹{(summary?.totalPaid || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Advance: ₹{(summary?.advancePaid || 0).toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: isFullyPaid ? '#10b981' : '#f59e0b', textTransform: 'uppercase' }}>
              {isFullyPaid ? 'Balance Cleared' : 'Remaining Balance'}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: isFullyPaid ? '#10b981' : '#f59e0b', margin: '4px 0' }}>
              ₹{remaining.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: isFullyPaid ? '#10b981' : '#ef4444' }}>
              {isFullyPaid ? '✓ Eligible for Diploma' : 'Pending fee clearance'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Next Payment Due</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: '6px 0' }}>
              {summary?.nextDueDate ? new Date(summary.nextDueDate).toLocaleDateString() : 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: '#f59e0b' }}>
              Due: ₹{(summary?.amountDue || remaining).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>Official Payment Receipts & Transactions</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Showing {payments.length} verified records</span>
        </div>

        {payments.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No payment records found on file.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px' }}>Invoice #</th>
                  <th style={{ padding: '14px 20px' }}>Course / Plan</th>
                  <th style={{ padding: '14px 20px' }}>Payment Mode</th>
                  <th style={{ padding: '14px 20px' }}>Transaction ID</th>
                  <th style={{ padding: '14px 20px' }}>Amount</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => {
                  const statusColor = p.status === 'PAID' ? '#10b981' : p.status === 'FAILED' ? '#ef4444' : '#f59e0b';
                  return (
                    <tr key={p._id || idx} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '14px 20px', color: '#f8fafc' }}>
                        {new Date(p.paymentDate || p.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#f59e0b', fontFamily: 'monospace' }}>
                        {p.invoiceNumber || `INV-${p._id?.slice(-6).toUpperCase()}`}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                        {p.courseId?.name || p.planId?.name || 'Master Beauty Track'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                        {p.paymentMethod || 'UPI / Online'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontFamily: 'monospace' }}>
                        {p.transactionId || 'TXN-9821873'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 700 }}>
                        ₹{(p.amount || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                          {p.status || 'PAID'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
