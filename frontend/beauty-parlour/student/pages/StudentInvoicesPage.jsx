import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentFetcher } from '../../../api/student';

export default function StudentInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        const res = await paymentFetcher.getInvoices();
        if (res.success) {
          setInvoices(res.data || []);
        } else {
          setError(res.message || 'Failed to load invoices');
        }
      } catch (err) {
        setError(err.message || 'Error fetching invoice archives');
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link to="/student/payments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to Fee Ledger
          </Link>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '8px 0 4px', color: '#f8fafc' }}>
            Invoices & Tax Receipts
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Official GST tax invoices issued by the institution for tuition and services.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading tax invoices...</div>
        </div>
      ) : invoices.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧾</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Invoices Generated Yet</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Tax invoices are generated upon payment confirmation.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {invoices.map((inv, idx) => (
            <div
              key={inv._id || idx}
              style={{
                background: '#1e293b',
                borderRadius: '12px',
                border: '1px solid #334155',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
                    {inv.invoiceNumber || `INV-${inv._id?.slice(-6).toUpperCase()}`}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                    PAID
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Issued on: {new Date(inv.date || inv.createdAt || Date.now()).toLocaleDateString()} • {inv.courseName || 'Academy Master Course'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Amount</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>
                    ₹{(inv.amount || 15000).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedInvoice(inv)}
                  style={{
                    background: '#334155',
                    color: '#f8fafc',
                    fontWeight: 600,
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  View Receipt 📄
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal Preview */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px', maxWidth: '560px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Tax Invoice & Receipt</div>
                <h3 style={{ margin: '4px 0', color: '#f8fafc' }}>{selectedInvoice.invoiceNumber || 'INV-2026-981'}</h3>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Academy GSTIN: 07AAAAA0000A1Z5</div>
              </div>
              <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }}>
                CLEARED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Date:</span>
                <span style={{ color: '#f8fafc' }}>{new Date(selectedInvoice.date || Date.now()).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Item Description:</span>
                <span style={{ color: '#f8fafc' }}>{selectedInvoice.courseName || 'Cosmetology Professional Course'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal:</span>
                <span style={{ color: '#f8fafc' }}>₹{Math.round((selectedInvoice.amount || 15000) / 1.18).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>GST (18%):</span>
                <span style={{ color: '#f8fafc' }}>₹{(selectedInvoice.amount - Math.round((selectedInvoice.amount || 15000) / 1.18)).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '10px', fontWeight: 700, fontSize: '16px' }}>
                <span style={{ color: '#f8fafc' }}>Total Paid:</span>
                <span style={{ color: '#10b981' }}>₹{(selectedInvoice.amount || 15000).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ background: '#334155', color: '#f8fafc', padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Print / Save PDF 🖨️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
