/**
 * @file BillingView.jsx
 * @description Super Admin Financial Ledger, Invoices, Transactions, and Refunds
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { billingApi, tenantsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import StatCard from '../../../components/StatCard';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { DollarSign, Receipt, ArrowUpRight, ArrowDownLeft, Plus, Download } from 'lucide-react';

export const BillingView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'invoices';

  const [overview, setOverview] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [invoiceModal, setInvoiceModal] = useState({
    isOpen: false,
    tenantId: '',
    amount: 99,
    description: 'Custom Platform Services',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  const [refundModal, setRefundModal] = useState({
    isOpen: false,
    transactionId: '',
    amount: 49,
    reason: '',
  });

  const [viewInvoiceModal, setViewInvoiceModal] = useState({
    isOpen: false,
    invoice: null,
  });

  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overRes, invRes, txRes, refRes, tenRes] = await Promise.all([
        billingApi.getOverview().catch(() => ({ data: {} })),
        billingApi.getInvoices().catch(() => ({ data: { invoices: [] } })),
        billingApi.getTransactions().catch(() => ({ data: { transactions: [] } })),
        billingApi.getRefunds().catch(() => ({ data: { refunds: [] } })),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);

      setOverview(overRes.data || {});
      setInvoices(invRes.data?.invoices || invRes.data?.items || (Array.isArray(invRes.data) ? invRes.data : []));
      setTransactions(txRes.data?.transactions || txRes.data?.items || (Array.isArray(txRes.data) ? txRes.data : []));
      setRefunds(refRes.data?.refunds || refRes.data?.items || (Array.isArray(refRes.data) ? refRes.data : []));
      setTenants(Array.isArray(tenRes.data) ? tenRes.data : (tenRes.data?.tenants || tenRes.data?.items || []));
    } catch (err) {
      error(err.message || 'Failed to load billing records');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceModal.tenantId) return;
    setActionLoading(true);
    try {
      await billingApi.createInvoice({
        tenantId: invoiceModal.tenantId,
        amount: Number(invoiceModal.amount),
        description: invoiceModal.description,
        dueDate: invoiceModal.dueDate,
      });
      success('Invoice generated successfully');
      setInvoiceModal({ isOpen: false, tenantId: '', amount: 99, description: '', dueDate: '' });
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to generate invoice');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessRefund = async (e) => {
    e.preventDefault();
    if (!refundModal.transactionId) return;
    setActionLoading(true);
    try {
      await billingApi.createRefund({
        transactionId: refundModal.transactionId,
        amount: Number(refundModal.amount),
        reason: refundModal.reason,
      });
      success('Refund issued successfully');
      setRefundModal({ isOpen: false, transactionId: '', amount: 49, reason: '' });
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to issue refund');
    } finally {
      setActionLoading(false);
    }
  };

  const invoiceColumns = [
    {
      header: 'Invoice Number',
      accessor: 'invoiceNumber',
      render: (row) => (
        <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
          {row.invoiceNumber || `INV-${row._id?.substring(0, 8)}`}
        </span>
      ),
    },
    {
      header: 'Tenant Business',
      accessor: 'tenantId',
      render: (row) => {
        const tenant = row.tenantId;
        const name = tenant?.name || row.tenantName || 'Salon Tenant';
        const email = tenant?.email || '';
        return (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
            {email && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{email}</div>}
          </div>
        );
      },
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (row) => {
        const total = row.totalAmount || row.amount || 0;
        const tax = row.taxAmount || 0;
        return (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              ₹{total.toLocaleString('en-IN')}
            </div>
            {tax > 0 && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Incl. ₹{tax.toLocaleString('en-IN')} GST (18%)
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'PAID'} />,
    },
    {
      header: 'Due / Paid Date',
      accessor: 'dueDate',
      render: (row) => (
        <div style={{ fontSize: '0.8rem' }}>
          {row.paidAt ? (
            <span style={{ color: '#10B981', fontWeight: 500 }}>
              Paid: {new Date(row.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          ) : (
            <span style={{ color: '#F59E0B', fontWeight: 500 }}>
              Due: {new Date(row.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={() => setViewInvoiceModal({ isOpen: true, invoice: row })}
          className="btn btn-secondary btn-sm"
          title="View Tax Invoice Receipt"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Receipt</span>
        </button>
      ),
    },
  ];

  const transactionColumns = [
    {
      header: 'Gateway Tx ID',
      accessor: 'gatewayTransactionId',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {row.gatewayTransactionId || row.transactionId || row._id?.substring(0, 12)}
        </span>
      ),
    },
    {
      header: 'Tenant Business',
      accessor: 'tenantId',
      render: (row) => {
        const tenant = row.tenantId;
        return (
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {tenant?.name || row.tenantName || 'Salon Tenant'}
          </span>
        );
      },
    },
    {
      header: 'Settlement Amount',
      accessor: 'amount',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#10B981', fontSize: '0.9rem' }}>
          +₹{(row.amount || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      render: (row) => (
        <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
          {(row.paymentMethod || 'card').replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'SUCCEEDED'} />,
    },
    {
      header: 'Settled At',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ];

  const totalCalculatedRevenue = transactions
    .filter((tx) => tx.status === 'succeeded')
    .reduce((acc, tx) => acc + (tx.amount || 0), 0);

  const pendingReceivables = invoices
    .filter((inv) => inv.status === 'unpaid' || inv.status === 'overdue')
    .reduce((acc, inv) => acc + (inv.totalAmount || inv.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Billing & Financial Ledger</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Invoices, payment gateway transactions, tax summaries, and dispute resolution.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() =>
              setRefundModal({
                isOpen: true,
                transactionId: transactions[0]?._id || '',
                amount: 49,
                reason: '',
              })
            }
            className="btn btn-secondary"
          >
            Process Refund
          </button>
          <button
            onClick={() =>
              setInvoiceModal({
                isOpen: true,
                tenantId: tenants[0]?._id || tenants[0]?.id || '',
                amount: 99,
                description: 'Custom Platform Services',
                dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
              })
            }
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4">
        <StatCard
          title="Total Gross Revenue"
          value={`₹${(totalCalculatedRevenue || overview.totalRevenue || 0).toLocaleString('en-IN')}`}
          trend="up"
          change="+18.2%"
          icon={DollarSign}
        />
        <StatCard
          title="Invoices Paid"
          value={invoices.filter((i) => i.status === 'paid').length || overview.paidInvoices || 0}
          trend="up"
          icon={Receipt}
        />
        <StatCard
          title="Pending Receivables"
          value={`₹${(pendingReceivables || overview.pendingAmount || 0).toLocaleString('en-IN')}`}
          trend="down"
          icon={ArrowUpRight}
        />
        <StatCard
          title="Successful Transactions"
          value={transactions.filter((t) => t.status === 'succeeded').length || 0}
          trend="up"
          icon={ArrowDownLeft}
        />
      </div>


      {activeTab === 'invoices' && (
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          isLoading={isLoading}
          emptyMessage="No invoices generated yet."
        />
      )}

      {activeTab === 'transactions' && (
        <DataTable
          columns={transactionColumns}
          data={transactions}
          isLoading={isLoading}
          emptyMessage="No financial transactions recorded."
        />
      )}

      {activeTab === 'refunds' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Processed Refunds</h3>
          </div>
          <div style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
            {refunds.length === 0 ? 'No refund claims or settlements processed.' : `${refunds.length} refunds on record.`}
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      <Modal
        isOpen={invoiceModal.isOpen}
        onClose={() => setInvoiceModal((p) => ({ ...p, isOpen: false }))}
        title="Create Manual Invoice"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setInvoiceModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateInvoice} disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Issue Invoice'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateInvoice}>
          <div className="form-group">
            <label className="form-label">Target Tenant</label>
            <select
              className="form-select"
              value={invoiceModal.tenantId}
              onChange={(e) => setInvoiceModal((p) => ({ ...p, tenantId: e.target.value }))}
              required
            >
              <option value="">Select a tenant...</option>
              {tenants.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={invoiceModal.amount}
                onChange={(e) => setInvoiceModal((p) => ({ ...p, amount: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={invoiceModal.dueDate}
                onChange={(e) => setInvoiceModal((p) => ({ ...p, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Line Item Description</label>
            <input
              type="text"
              className="form-input"
              value={invoiceModal.description}
              onChange={(e) => setInvoiceModal((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Process Refund Modal */}
      <Modal
        isOpen={refundModal.isOpen}
        onClose={() => setRefundModal((p) => ({ ...p, isOpen: false }))}
        title="Issue Refund Settlement"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setRefundModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleProcessRefund} disabled={actionLoading}>
              {actionLoading ? 'Refunding...' : 'Confirm Refund'}
            </button>
          </>
        }
      >
        <form onSubmit={handleProcessRefund}>
          <div className="form-group">
            <label className="form-label">Transaction Reference</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. txn_1092839218"
              value={refundModal.transactionId}
              onChange={(e) => setRefundModal((p) => ({ ...p, transactionId: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Refund Amount ($)</label>
            <input
              type="number"
              className="form-input"
              min="1"
              value={refundModal.amount}
              onChange={(e) => setRefundModal((p) => ({ ...p, amount: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="Reason for refund..."
              value={refundModal.reason}
              onChange={(e) => setRefundModal((p) => ({ ...p, reason: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>

      {/* View & Print Invoice Modal */}
      <Modal
        isOpen={viewInvoiceModal.isOpen}
        onClose={() => setViewInvoiceModal({ isOpen: false, invoice: null })}
        title={`Tax Invoice: ${viewInvoiceModal.invoice?.invoiceNumber || 'Details'}`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" />
              <span>Print / Download Receipt</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setViewInvoiceModal({ isOpen: false, invoice: null })}
            >
              Done
            </button>
          </div>
        }
      >
        {viewInvoiceModal.invoice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {viewInvoiceModal.invoice.tenantId?.name || viewInvoiceModal.invoice.tenantName || 'Salon Enterprise'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {viewInvoiceModal.invoice.tenantId?.email}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                  {viewInvoiceModal.invoice.invoiceNumber}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <Badge status={viewInvoiceModal.invoice.status || 'PAID'} />
                </div>
              </div>
            </div>

            {/* Line items table */}
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Itemized Services & Subscription Term:
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.65rem 1rem' }}>Description</th>
                      <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Qty</th>
                      <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewInvoiceModal.invoice.lineItems || [
                      { description: 'Platform Services', amount: viewInvoiceModal.invoice.amount || 0, quantity: 1 }
                    ]).map((item, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>{item.description}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{item.quantity || 1}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>
                          ₹{(item.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{(viewInvoiceModal.invoice.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST (18% Central & State):</span>
                <span style={{ fontWeight: 600 }}>₹{(viewInvoiceModal.invoice.taxAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.25rem', fontSize: '1.05rem' }}>
                <span style={{ fontWeight: 700 }}>Total Settled:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{(viewInvoiceModal.invoice.totalAmount || viewInvoiceModal.invoice.amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BillingView;
