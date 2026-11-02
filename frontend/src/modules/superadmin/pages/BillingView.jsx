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
      setInvoices(invRes.data?.invoices || []);
      setTransactions(txRes.data?.transactions || []);
      setRefunds(refRes.data?.refunds || []);
      setTenants(tenRes.data?.tenants || []);
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
        <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          {row.invoiceNumber || `INV-${row._id?.substring(0, 8)}`}
        </span>
      ),
    },
    {
      header: 'Tenant Name',
      accessor: 'tenantName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.tenantName || 'Tenant'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ID: {row.tenantId || row._id}
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
          ${row.amount?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'PAID'} />,
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  const transactionColumns = [
    {
      header: 'Transaction ID',
      accessor: '_id',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          {row.transactionId || row._id?.substring(0, 10)}
        </span>
      ),
    },
    {
      header: 'Tenant Name',
      accessor: 'tenantName',
      render: (row) => (
        <span style={{ fontWeight: 500 }}>{row.tenantName || 'Tenant'}</span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#10B981' }}>
          +${row.amount?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      header: 'Gateway',
      accessor: 'gateway',
      render: (row) => <span>{row.gateway || 'Stripe'}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'SUCCESS'} />,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

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
          value={`$${(overview.totalRevenue || 0).toLocaleString()}`}
          trend="up"
          change="+18.2%"
          icon={DollarSign}
        />
        <StatCard
          title="Invoices Paid"
          value={overview.paidInvoices || invoices.length || 0}
          trend="up"
          icon={Receipt}
        />
        <StatCard
          title="Pending Receivables"
          value={`$${(overview.pendingAmount || 0).toLocaleString()}`}
          trend="down"
          icon={ArrowUpRight}
        />
        <StatCard
          title="Refunds Issued"
          value={`$${(overview.refundedAmount || 0).toLocaleString()}`}
          trend="down"
          icon={ArrowDownLeft}
        />
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        {[
          { id: 'invoices', label: 'Invoices' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'refunds', label: 'Refunds' },
          { id: 'reports', label: 'Revenue Reports' },
          { id: 'tax', label: 'Tax Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
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
    </div>
  );
};

export default BillingView;
