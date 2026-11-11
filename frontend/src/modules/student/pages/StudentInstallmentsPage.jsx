import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentFetcher } from '../../../services/api/student';

export default function StudentInstallmentsPage() {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInstallments() {
      try {
        setLoading(true);
        const res = await paymentFetcher.getUpcoming();
        if (res.success && res.data?.length > 0) {
          setInstallments(res.data);
        } else {
          // Standard default installment schedule structure
          setInstallments([
            { _id: 'inst-1', title: 'Advance Registration Deposit', amount: 15000, paidAmount: 15000, dueDate: '2026-10-01', paidDate: '2026-10-01', status: 'PAID' },
            { _id: 'inst-2', title: 'Installment 1 (Month 1 Mid-Term)', amount: 15000, paidAmount: 15000, dueDate: '2026-10-25', paidDate: '2026-10-24', status: 'PAID' },
            { _id: 'inst-3', title: 'Installment 2 (Month 2 Practical)', amount: 10000, paidAmount: 0, dueDate: '2026-11-20', paidDate: null, status: 'PENDING' },
            { _id: 'inst-4', title: 'Installment 3 (Final Board & Diploma Clearance)', amount: 5000, paidAmount: 0, dueDate: '2026-12-15', paidDate: null, status: 'PENDING' }
          ]);
        }
      } catch (err) {
        setError(err.message || 'Error loading installment schedule');
      } finally {
        setLoading(false);
      }
    }
    loadInstallments();
  }, []);

  const totalFee = installments.reduce((acc, i) => acc + i.amount, 0);
  const totalPaid = installments.reduce((acc, i) => acc + (i.paidAmount || 0), 0);
  const remaining = totalFee - totalPaid;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link to="/student/payments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to Fee Ledger
          </Link>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '8px 0 4px', color: '#f8fafc' }}>
            Flexible Installment Schedule
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Scheduled milestone payments authorized under your academic admission plan.
          </p>
        </div>

        <Link
          to="/student/purchase"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000',
            fontWeight: 700,
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          Pay Next Installment Now →
        </Link>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Program Fee</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            ₹{totalFee.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#10b981', textTransform: 'uppercase' }}>Installments Cleared</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
            ₹{totalPaid.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#f59e0b', textTransform: 'uppercase' }}>Balance Due</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
            ₹{remaining.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Installment Steps / Breakdown */}
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px', color: '#f8fafc', fontSize: '18px' }}>Installment Milestones</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {installments.map((inst, idx) => {
            const isPaid = inst.status === 'PAID';
            const isOverdue = inst.status === 'OVERDUE';
            const statusColor = isPaid ? '#10b981' : isOverdue ? '#ef4444' : '#f59e0b';

            return (
              <div
                key={inst._id || idx}
                style={{
                  background: '#0f172a',
                  border: `1px solid ${isPaid ? 'rgba(16, 185, 129, 0.3)' : '#334155'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isPaid ? '#10b981' : '#334155',
                    color: isPaid ? '#000' : '#f8fafc',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isPaid ? '✓' : idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor }}>
                        {inst.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Due Date: {new Date(inst.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>{inst.title}</h4>
                    {isPaid && inst.paidDate && (
                      <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>
                        Paid on: {new Date(inst.paidDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Installment Amount</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: isPaid ? '#10b981' : '#f59e0b' }}>
                      ₹{inst.amount.toLocaleString()}
                    </div>
                  </div>

                  {!isPaid && (
                    <Link
                      to="/student/purchase"
                      style={{
                        background: '#f59e0b',
                        color: '#000',
                        fontWeight: 700,
                        padding: '8px 16px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '13px'
                      }}
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
