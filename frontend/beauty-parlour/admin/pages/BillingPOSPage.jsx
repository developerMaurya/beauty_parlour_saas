/**
 * @file BillingPOSPage.jsx
 * @description Point of Sale (POS), Invoicing, Payment Collection, and Printable Receipt Generator.
 * Conforms to Sections 39, 40, 41.
 * @module frontend/src/modules/admin/pages/BillingPOSPage
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  CreditCard,
  DollarSign,
  Printer,
  RotateCcw,
  CheckCircle,
  FileText,
  Trash2,
  XCircle,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  billingFetcher,
  customerFetcher,
  serviceFetcher,
  productFetcher,
  paymentFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const BillingPOSPage = () => {
  const { selectedBranchId, tenant } = useTenantAdmin();
  const toast = useToast();

  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [createBillModalOpen, setCreateBillModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBillForPay, setSelectedBillForPay] = useState(null);

  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedBillForRefund, setSelectedBillForRefund] = useState(null);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bRes, cRes, sRes, pRes, pmRes, brRes] = await Promise.all([
        billingFetcher.list({ branchId: selectedBranchId || undefined }),
        customerFetcher.list({ limit: 100 }),
        serviceFetcher.list({ limit: 100 }),
        productFetcher.list({ limit: 100 }),
        paymentFetcher.getMethods(),
        branchFetcher.list(),
      ]);
      setBills(bRes.data || []);
      setCustomers(cRes.data || []);
      setServices(sRes.data || []);
      setProducts(pRes.data || []);
      setPaymentMethods(pmRes.data || []);
      setBranches(brRes.data || []);
    } catch (err) {
      toast.error('Failed to load billing records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  const handleCreateBill = async (data) => {
    try {
      const items = [];
      if (data.serviceId) {
        const s = services.find((srv) => srv._id === data.serviceId);
        items.push({ itemType: 'Service', item: data.serviceId, name: s?.name || 'Service', price: s?.price || 0, quantity: 1, total: s?.price || 0 });
      }
      if (data.productId) {
        const p = products.find((prd) => prd._id === data.productId);
        const qty = Number(data.productQty) || 1;
        items.push({ itemType: 'Product', item: data.productId, name: p?.name || 'Product', price: p?.price || 0, quantity: qty, total: (p?.price || 0) * qty });
      }

      const subtotal = items.reduce((acc, it) => acc + it.total, 0);
      const discount = Number(data.discount) || 0;
      const tax = Number(data.tax) || 0;
      const finalTotal = Math.max(0, subtotal - discount + tax);

      await billingFetcher.create({
        customerId: data.customerId,
        branchId: data.branchId || selectedBranchId || branches[0]?._id,
        items,
        subtotal,
        discount,
        tax,
        totalAmount: finalTotal,
      });

      toast.success('Bill invoice created');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bill creation failed');
    }
  };

  const handleCollectPayment = async (data) => {
    try {
      await billingFetcher.pay(selectedBillForPay._id, {
        amount: Number(data.amount),
        method: data.method,
        transactionRef: data.transactionRef,
      });
      toast.success('Payment recorded');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment recording failed');
    }
  };

  const handleProcessRefund = async (data) => {
    try {
      await billingFetcher.refund(selectedBillForRefund._id, {
        amount: Number(data.amount),
        reason: data.reason,
      });
      toast.success('Refund processed');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund processing failed');
    }
  };

  const handleViewReceipt = async (billId) => {
    try {
      const res = await billingFetcher.getReceipt(billId);
      setActiveReceipt(res.data);
      setReceiptModalOpen(true);
    } catch (err) {
      toast.error('Failed to generate receipt preview');
    }
  };

  const billFields = [
    {
      name: 'customerId',
      label: 'Select Customer',
      type: 'select',
      required: true,
      options: customers.map((c) => ({ label: `${c.name} (${c.phone})`, value: c._id })),
    },
    {
      name: 'branchId',
      label: 'Salon Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
    {
      name: 'serviceId',
      label: 'Add Service Item',
      type: 'select',
      options: services.map((s) => ({ label: `${s.name} - ₹${s.price}`, value: s._id })),
    },
    {
      name: 'productId',
      label: 'Add Retail Product',
      type: 'select',
      options: products.map((p) => ({ label: `${p.name} - ₹${p.price} (${p.stockQuantity} in stock)`, value: p._id })),
    },
    { name: 'productQty', label: 'Product Quantity', type: 'number', defaultValue: 1 },
    { name: 'discount', label: 'Special Discount (₹)', type: 'currency' },
    { name: 'tax', label: 'Taxes / GST (₹)', type: 'currency' },
  ];

  const payFields = [
    { name: 'amount', label: 'Payment Amount (₹)', type: 'currency', required: true },
    {
      name: 'method',
      label: 'Payment Method',
      type: 'select',
      required: true,
      options: [
        { label: 'Cash', value: 'Cash' },
        { label: 'UPI / QR Code', value: 'UPI' },
        { label: 'Credit / Debit Card', value: 'Card' },
        { label: 'Bank Transfer', value: 'Bank Transfer' },
        { label: 'Salon Loyalty Wallet', value: 'Wallet' },
      ],
    },
    { name: 'transactionRef', label: 'Txn / UPI Reference ID', placeholder: 'e.g. UPI-98432483' },
  ];

  const refundFields = [
    { name: 'amount', label: 'Refund Amount (₹)', type: 'currency', required: true },
    { name: 'reason', label: 'Reason for Refund', required: true, placeholder: 'Client requested cancellation' },
  ];

  const columns = [
    {
      header: 'Invoice #',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            #{row.billNumber || row._id.slice(-6).toUpperCase()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {new Date(row.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Customer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customer?.name || 'Walk-in Guest'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.customer?.phone}</div>
        </div>
      ),
    },
    {
      header: 'Amount',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: '#10b981' }}>
            ₹{(row.totalAmount || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Paid: ₹{(row.paidAmount || 0).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Payment Status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor:
              row.paymentStatus === 'paid'
                ? 'rgba(16, 185, 129, 0.15)'
                : row.paymentStatus === 'partial'
                ? 'rgba(245, 158, 11, 0.15)'
                : row.paymentStatus === 'refunded'
                ? 'rgba(139, 92, 246, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            color:
              row.paymentStatus === 'paid'
                ? '#10b981'
                : row.paymentStatus === 'partial'
                ? '#f59e0b'
                : row.paymentStatus === 'refunded'
                ? '#8b5cf6'
                : '#ef4444',
          }}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {row.paymentStatus !== 'paid' && (
            <button
              onClick={() => {
                setSelectedBillForPay(row);
                setPayModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ background: '#10b981', borderColor: '#10b981' }}
              title="Collect Payment"
            >
              <CreditCard className="w-3.5 h-3.5" /> Pay
            </button>
          )}
          <button
            onClick={() => handleViewReceipt(row._id)}
            className="btn btn-secondary btn-sm"
            title="Print Receipt"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          {row.paidAmount > 0 && row.paymentStatus !== 'refunded' && (
            <button
              onClick={() => {
                setSelectedBillForRefund(row);
                setRefundModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              title="Process Refund"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Point of Sale (POS) & Billing
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Generate customer invoices, auto-deduct inventory, process split payments, and print receipts
          </p>
        </div>
        <button
          onClick={() => setCreateBillModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> New Bill / Sale
        </button>
      </div>

      <DataTable
        columns={columns}
        data={bills}
        isLoading={isLoading}
        searchPlaceholder="Search invoices by number, client..."
      />

      <FormModal
        isOpen={createBillModalOpen}
        onClose={() => setCreateBillModalOpen(false)}
        title="Create New POS Invoice"
        fields={billFields}
        onSubmit={handleCreateBill}
        submitText="Generate Bill"
        size="large"
      />

      <FormModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title={`Record Payment for Bill #${selectedBillForPay?.billNumber || ''}`}
        fields={payFields}
        initialData={{
          amount: (selectedBillForPay?.totalAmount || 0) - (selectedBillForPay?.paidAmount || 0),
        }}
        onSubmit={handleCollectPayment}
        submitText="Confirm Payment"
      />

      <FormModal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title={`Process Refund for Bill #${selectedBillForRefund?.billNumber || ''}`}
        fields={refundFields}
        initialData={{
          amount: selectedBillForRefund?.paidAmount || 0,
        }}
        onSubmit={handleProcessRefund}
        submitText="Issue Refund"
      />

      {/* Printable Receipt Modal */}
      {receiptModalOpen && activeReceipt && (
        <div className="modal-backdrop" onClick={() => setReceiptModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {tenant?.name || 'Beauty Salon & Spa'}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tax Invoice / Receipt #{activeReceipt.billNumber || activeReceipt._id?.slice(-6).toUpperCase()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Date: {new Date(activeReceipt.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Client: {activeReceipt.customer?.name} ({activeReceipt.customer?.phone})
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', margin: '4px 0' }} />
              {activeReceipt.items?.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>{it.name} (x{it.quantity || 1})</span>
                  <span style={{ fontWeight: 600 }}>₹{it.total || it.price}</span>
                </div>
              ))}
              <div style={{ borderBottom: '1px dashed var(--border-color)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Subtotal:</span>
                <span>₹{activeReceipt.subtotal || activeReceipt.totalAmount}</span>
              </div>
              {activeReceipt.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ec4899' }}>
                  <span>Discount:</span>
                  <span>-₹{activeReceipt.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#10b981', paddingTop: '4px' }}>
                <span>Total Due:</span>
                <span>₹{activeReceipt.totalAmount}</span>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                className="btn btn-secondary"
                onClick={() => window.print()}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="btn btn-primary" onClick={() => setReceiptModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPOSPage;
