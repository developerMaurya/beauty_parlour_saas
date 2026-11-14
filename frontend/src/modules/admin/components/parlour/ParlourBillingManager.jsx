/**
 * @file ParlourBillingManager.jsx
 * @description Master POS Billing & Tax Invoices for Golden Beauty Parlour.
 * Features:
 *   - New Bill Generator with Line Items (Products & Services)
 *   - Real-time stock decrement when products are billed
 *   - Auto-syncs payments into the central Payment Ledger
 *   - Printable & Downloadable Thermal/Standard Tax Invoices
 * @module frontend/src/modules/admin/components/parlour/ParlourBillingManager
 */

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Printer,
  Trash2,
  Eye,
  X,
  FileText,
  DollarSign,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function ParlourBillingManager({ products = [], setProducts, showToast }) {
  // Invoices State
  const [invoices, setInvoices] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_pos_invoices');
      if (stored) return JSON.parse(stored);
      const seed = [
        {
          id: 'INV-GBP-2026-001',
          date: new Date().toISOString().split('T')[0],
          time: '11:30 AM',
          customerName: 'Pooja Maurya',
          customerPhone: '9876543210',
          items: [
            { name: 'Royale Airbrush Bridal HD Makeover', qty: 1, price: 14999, type: 'service' },
            { name: 'O3+ Bridal Glow Facial Kit', qty: 1, price: 3450, type: 'product' },
          ],
          subtotal: 18449,
          discount: 1000,
          tax: 922,
          grandTotal: 18371,
          paymentMode: 'UPI (GPay / PhonePe)',
          status: 'PAID',
        },
        {
          id: 'INV-GBP-2026-002',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          time: '03:15 PM',
          customerName: 'Ananya Sharma',
          customerPhone: '9876543212',
          items: [
            { name: 'Keratin Hair Spa & Deep Therapy', qty: 1, price: 2800, type: 'service' },
            { name: "L'Oréal Professionnel Serie Expert Serum", qty: 1, price: 1250, type: 'product' },
          ],
          subtotal: 4050,
          discount: 250,
          tax: 202,
          grandTotal: 4002,
          paymentMode: 'Cash',
          status: 'PAID',
        },
      ];
      localStorage.setItem('parlour_pos_invoices', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  const [billModalOpen, setBillModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New Bill Form State
  const [newBill, setNewBill] = useState({
    customerName: '',
    customerPhone: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI (GPay / PhonePe)',
    discount: 0,
    taxPercent: 5,
    items: [{ name: '', qty: 1, price: 0, type: 'service' }],
  });

  // Calculate live totals for the new bill
  const subtotal = newBill.items.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
  const discountVal = Number(newBill.discount) || 0;
  const taxable = Math.max(0, subtotal - discountVal);
  const taxVal = Math.round((taxable * (Number(newBill.taxPercent) || 0)) / 100);
  const grandTotal = taxable + taxVal;

  const handleAddItemRow = () => {
    setNewBill((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', qty: 1, price: 0, type: 'service' }],
    }));
  };

  const handleRemoveItemRow = (idx) => {
    setNewBill((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleItemChange = (idx, field, val) => {
    setNewBill((prev) => {
      const updated = [...prev.items];
      updated[idx] = { ...updated[idx], [field]: val };

      // If user picks an inventory product, auto-fill price
      if (field === 'name') {
        const prod = products.find((p) => p.name === val);
        if (prod) {
          updated[idx].price = prod.price;
          updated[idx].type = 'product';
        }
      }
      return { ...prev, items: updated };
    });
  };

  const handleSaveBill = (e) => {
    e.preventDefault();
    if (!newBill.customerName.trim() || newBill.items.length === 0) {
      alert('Please enter customer name and at least one item.');
      return;
    }

    const invId = `INV-GBP-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const invoiceRecord = {
      id: invId,
      date: newBill.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: newBill.customerName.trim(),
      customerPhone: newBill.customerPhone.trim(),
      items: newBill.items.filter((item) => item.name.trim()),
      subtotal,
      discount: discountVal,
      tax: taxVal,
      grandTotal,
      paymentMode: newBill.paymentMode,
      status: 'PAID',
    };

    // 1. Deduct Product Stock for any inventory items billed
    if (setProducts && Array.isArray(products)) {
      let updatedProducts = [...products];
      let stockDecremented = false;

      invoiceRecord.items.forEach((item) => {
        const prodIdx = updatedProducts.findIndex((p) => p.name.toLowerCase() === item.name.trim().toLowerCase());
        if (prodIdx !== -1) {
          const curStock = updatedProducts[prodIdx].stock || 0;
          const newStock = Math.max(0, curStock - Number(item.qty || 1));
          updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], stock: newStock };
          stockDecremented = true;
        }
      });

      if (stockDecremented) {
        setProducts(updatedProducts);
        localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProducts));
      }
    }

    // 2. Log Payment into Central Ledger (parlour_payment_history)
    try {
      const storedPayments = JSON.parse(localStorage.getItem('parlour_payment_history') || '[]');
      const newPayment = {
        id: `PAY-${Date.now().toString().slice(-6)}`,
        refId: invId,
        date: newBill.date,
        time: invoiceRecord.time,
        customerName: invoiceRecord.customerName,
        category: invoiceRecord.items.some((i) => i.type === 'product') ? 'Retail Products & Services' : 'Salon Services',
        amount: grandTotal,
        paymentMode: invoiceRecord.paymentMode,
        status: 'PAID',
      };
      const updatedPayments = [newPayment, ...storedPayments];
      localStorage.setItem('parlour_payment_history', JSON.stringify(updatedPayments));
    } catch (payErr) {
      console.warn('Payment logging note:', payErr);
    }

    // 3. Save Invoice
    const updatedInvoices = [invoiceRecord, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem('parlour_pos_invoices', JSON.stringify(updatedInvoices));

    showToast?.(`Invoice ${invId} generated! ₹${grandTotal.toLocaleString('en-IN')} received via ${newBill.paymentMode}`);
    setBillModalOpen(false);
    setViewInvoice(invoiceRecord);

    // Reset bill form
    setNewBill({
      customerName: '',
      customerPhone: '',
      date: new Date().toISOString().split('T')[0],
      paymentMode: 'UPI (GPay / PhonePe)',
      discount: 0,
      taxPercent: 5,
      items: [{ name: '', qty: 1, price: 0, type: 'service' }],
    });
  };

  const handleDeleteInvoice = (id) => {
    if (window.confirm(`Are you sure you want to delete Invoice ${id}?`)) {
      const filtered = invoices.filter((i) => i.id !== id);
      setInvoices(filtered);
      localStorage.setItem('parlour_pos_invoices', JSON.stringify(filtered));
      showToast?.(`Invoice ${id} deleted.`);
      if (viewInvoice?.id === id) setViewInvoice(null);
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerPhone.includes(searchTerm)
  );

  const totalBilledRevenue = invoices.reduce((acc, i) => acc + (i.grandTotal || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Top Metric Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Receipt size={24} color="#7e22ce" />
            <span>POS Billing & Tax Invoices</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Generate instant salon service & product bills, manage receipts, and auto-sync stock & revenue.
          </p>
        </div>
        <button
          onClick={() => setBillModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
          }}
        >
          <Plus size={16} />
          <span>+ Create New Bill (POS)</span>
        </button>
      </div>

      {/* ── Metric Highlights ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 700 }}>Total Invoices Billed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{invoices.length}</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>100% Tax Compliant</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 700 }}>Total Billed Revenue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>₹{totalBilledRevenue.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: 700, marginTop: 4 }}>Synced to Payment Ledger</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 700 }}>Inventory Linked</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>Auto-Stock</div>
            <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 700, marginTop: 4 }}>Real-time Deduction on Sale</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search by client name, mobile number, or invoice ID (#INV-...)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13.5px', background: 'transparent' }}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Invoices Master Table ── */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Invoice ID</th>
                <th style={{ padding: '12px 16px' }}>Date & Time</th>
                <th style={{ padding: '12px 16px' }}>Customer Name</th>
                <th style={{ padding: '12px 16px' }}>Billed Items</th>
                <th style={{ padding: '12px 16px' }}>Total Amount</th>
                <th style={{ padding: '12px 16px' }}>Payment Mode</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Receipt size={40} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 700 }}>No invoices found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#7e22ce' }}>{inv.id}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{inv.date}</div>
                      <div style={{ fontSize: '11px' }}>{inv.time}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{inv.customerName}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{inv.customerPhone}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      {inv.items?.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '12px' }}>
                          • {it.name} <span style={{ color: '#94a3b8' }}>x{it.qty}</span>
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 900, fontSize: '14.5px', color: '#0f172a' }}>
                      ₹{inv.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f5f3ff', color: '#7e22ce', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800 }}>
                        {inv.paymentMode}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setViewInvoice(inv)}
                          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="View / Print Tax Invoice"
                        >
                          <Eye size={13} />
                          <span>View / Print</span>
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid #fecaca', background: '#fff1f2', color: '#dc2626', cursor: 'pointer' }}
                          title="Delete Invoice"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create New Bill Modal ── */}
      {billModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setBillModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf5ff' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Receipt size={20} color="#7e22ce" />
                  <span>Generate Salon POS Invoice</span>
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Billed items automatically decrement stock & log revenue</p>
              </div>
              <button onClick={() => setBillModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBill} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Maurya"
                    value={newBill.customerName}
                    onChange={(e) => setNewBill({ ...newBill, customerName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Mobile (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={newBill.customerPhone}
                    onChange={(e) => setNewBill({ ...newBill, customerPhone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Invoice Date</label>
                  <input
                    type="date"
                    required
                    value={newBill.date}
                    onChange={(e) => setNewBill({ ...newBill, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>Billed Items & Services</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    style={{ background: '#f5f3ff', border: '1px solid #d8b4fe', color: '#7e22ce', borderRadius: '6px', padding: '4px 8px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Row
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {newBill.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '8px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      {/* Product or Service Name with Inventory Suggestions */}
                      <div>
                        <input
                          type="text"
                          required
                          list="salon-inventory-suggestions"
                          placeholder="Service / Product name"
                          value={item.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                        />
                      </div>
                      {/* Quantity */}
                      <div>
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                        />
                      </div>
                      {/* Unit Price */}
                      <div>
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="₹ Price"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, 'price', Math.max(0, parseFloat(e.target.value) || 0))}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                        />
                      </div>
                      {/* Remove */}
                      <div>
                        {newBill.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggestions Datalist for Inventory Products */}
                <datalist id="salon-inventory-suggestions">
                  <option value="Royale Airbrush Bridal HD Makeover" />
                  <option value="Keratin Hair Spa & Deep Therapy" />
                  <option value="Advanced Hydra-Glow Facial" />
                  <option value="Nail Art & Gel Extensions" />
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      In Stock: {p.stock} | Price: ₹{p.price}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Discount, Tax & Payment Mode */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#faf5ff', padding: '12px', borderRadius: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newBill.discount}
                    onChange={(e) => setNewBill({ ...newBill, discount: Math.max(0, parseFloat(e.target.value) || 0) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>GST / Tax (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="28"
                    value={newBill.taxPercent}
                    onChange={(e) => setNewBill({ ...newBill, taxPercent: Math.max(0, parseFloat(e.target.value) || 0) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Payment Mode</label>
                  <select
                    value={newBill.paymentMode}
                    onChange={(e) => setNewBill({ ...newBill, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Card (POS Machine)">Debit / Credit Card (POS)</option>
                    <option value="Bank Transfer">Bank IMPS / NEFT</option>
                  </select>
                </div>
              </div>

              {/* Total Summary */}
              <div style={{ textAlign: 'right', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Subtotal: ₹{subtotal.toLocaleString('en-IN')} | Discount: -₹{discountVal} | GST: +₹{taxVal}</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#7e22ce', marginTop: 4 }}>
                  Grand Total: ₹{grandTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setBillModalOpen(false)}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#7e22ce',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
                  }}
                >
                  Confirm & Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View / Print Formal Invoice Modal ── */}
      {viewInvoice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewInvoice(null);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              padding: '2rem',
            }}
          >
            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ background: '#ecfdf5', color: '#15803d', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                ● TAX INVOICE PAID
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => window.print()}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>
                <button onClick={() => setViewInvoice(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div style={{ border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '1.5rem', background: '#fdfbf7' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7e22ce', margin: 0 }}>GOLDEN BEAUTY PARLOUR</h2>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>Luxury Salon & Bridal Academy • Varanasi</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>GSTIN: 09AABCU9603R1ZM • Ph: +91 98765 43210</div>
              </div>

              {/* Invoice Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '1rem' }}>
                <div>
                  <div style={{ color: '#64748b' }}>Billed To:</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>{viewInvoice.customerName}</div>
                  <div style={{ color: '#64748b' }}>{viewInvoice.customerPhone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#7e22ce' }}>{viewInvoice.id}</div>
                  <div style={{ color: '#64748b' }}>{viewInvoice.date} • {viewInvoice.time}</div>
                  <div style={{ color: '#16a34a', fontWeight: 700 }}>Mode: {viewInvoice.paymentMode}</div>
                </div>
              </div>

              {/* Itemized List */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 800 }}>
                    <th style={{ padding: '6px 0', textAlign: 'left' }}>Item / Service</th>
                    <th style={{ padding: '6px 0', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '6px 0', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '6px 0', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewInvoice.items?.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 0', fontWeight: 700, color: '#0f172a' }}>{it.name}</td>
                      <td style={{ padding: '8px 0', textAlign: 'center', color: '#64748b' }}>{it.qty}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', color: '#64748b' }}>₹{Number(it.price).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>₹{(it.qty * it.price).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span>₹{viewInvoice.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {viewInvoice.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700 }}>
                    <span>Discount</span>
                    <span>-₹{viewInvoice.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {viewInvoice.tax > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>GST / Taxes</span>
                    <span>+₹{viewInvoice.tax?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '15px', color: '#7e22ce', borderTop: '1px dashed #cbd5e1', paddingTop: 6, marginTop: 4 }}>
                  <span>Grand Total</span>
                  <span>₹{viewInvoice.grandTotal?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Thank you footer */}
              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '11px', color: '#94a3b8' }}>
                ✨ Thank you for choosing Golden Beauty Parlour! Please visit again. ✨
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
