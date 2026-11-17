/**
 * @file ParlourPaymentHistory.jsx
 * @description Central Financial Payment History, Revenue Ledger & POS Billing for Golden Beauty Parlour.
 * Features:
 *   - Category Filtering: All Transactions, Customer Services, Product Sales, Student Academy Fees, Staff Salary
 *   - Date Range Filtering: Today, This Month, This Year, All-Time
 *   - Live POS Billing & Tax Invoice Generation with multiple line-items (+ Add More Products)
 *   - View / Print Formal Tax Invoice / Bill popup for any transaction
 *   - Export to CSV / Excel sheet & Print Summary
 * @module frontend/src/modules/admin/components/parlour/ParlourPaymentHistory
 */

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
  X,
  CreditCard,
  Download,
  Printer,
  ShoppingBag,
  Scissors,
  GraduationCap,
  Users,
  Trash2,
  FileText,
  Sparkles,
  Layers,
} from 'lucide-react';

export function ParlourPaymentHistory({ showToast }) {
  const [filterPeriod, setFilterPeriod] = useState('ALL'); // 'ALL' | 'TODAY' | 'THIS_MONTH' | 'THIS_YEAR'
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL' | 'SERVICES' | 'PRODUCTS' | 'STUDENT_FEES' | 'SALARY'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals State
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Available Products for POS Multi-product selection
  const [salonProducts, setSalonProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_products_inventory');
      if (stored) return JSON.parse(stored);
      return [
        { id: 'PROD-01', name: 'O3+ Bridal Glow Facial Kit', price: 4200, stock: 15 },
        { id: 'PROD-02', name: 'Streax Canvoline Hair Straightening Kit', price: 2850, stock: 8 },
        { id: 'PROD-03', name: 'Kryolan HD Micro Foundation Palette', price: 6500, stock: 12 },
        { id: 'PROD-04', name: 'L’Oréal Professionnel Mythic Oil Serum', price: 1250, stock: 24 },
        { id: 'PROD-05', name: 'Lotus Herbal WhiteGlow Night Cream', price: 495, stock: 30 },
      ];
    } catch {
      return [];
    }
  });

  // Central Payment & Billing Ledger State
  const [payments, setPayments] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_payment_history');
      if (stored) return JSON.parse(stored);

      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const lastMonthStr = new Date(Date.now() - 86400000 * 25).toISOString().split('T')[0];

      const seed = [
        {
          id: 'PAY-892101',
          refId: 'INV-GBP-2026-001',
          date: todayStr,
          time: '11:30 AM',
          customerName: 'Pooja Maurya',
          customerPhone: '9876543210',
          recipientType: 'CUSTOMER',
          categoryType: 'SERVICES',
          category: 'Bridal HD Airbrush Makeup & Glow Facial',
          amount: 18371,
          paymentMode: 'UPI (GPay / PhonePe)',
          status: 'PAID',
          items: [
            { name: 'Bridal HD Airbrush Makeup', qty: 1, price: 15000 },
            { name: 'O3+ Bridal D-Tan Facial', qty: 1, price: 3371 },
          ],
        },
        {
          id: 'PAY-892102',
          refId: 'POS-BILL-102',
          date: todayStr,
          time: '02:45 PM',
          customerName: 'Simran Singh',
          customerPhone: '9876543214',
          recipientType: 'CUSTOMER',
          categoryType: 'PRODUCTS',
          category: 'Product Sale (Hair Serum & Night Cream)',
          amount: 2240,
          paymentMode: 'Cash',
          status: 'PAID',
          items: [
            { name: 'L’Oréal Professionnel Mythic Oil Serum', qty: 1, price: 1250 },
            { name: 'Lotus Herbal WhiteGlow Night Cream', qty: 2, price: 495 },
          ],
        },
        {
          id: 'PAY-892095',
          refId: 'INV-GBP-2026-002',
          date: yesterdayStr,
          time: '03:15 PM',
          customerName: 'Ananya Sharma',
          customerPhone: '9876543212',
          recipientType: 'CUSTOMER',
          categoryType: 'SERVICES',
          category: 'Keratin Hair Spa & Smoothening',
          amount: 4000,
          paymentMode: 'Cash',
          status: 'PAID',
          items: [{ name: 'Keratin Hair Treatment & Styling', qty: 1, price: 4000 }],
        },
        {
          id: 'PAY-891950',
          refId: 'ACAD-FEE-401',
          date: lastMonthStr,
          time: '10:00 AM',
          customerName: 'Neha Verma',
          customerPhone: '9876543218',
          recipientType: 'STUDENT',
          categoryType: 'STUDENT_FEES',
          category: 'Academy Course Tuition Fee (Advance Bridal)',
          amount: 25000,
          paymentMode: 'Bank Transfer (IMPS)',
          status: 'PAID',
          items: [{ name: 'Advance Bridal Glam & Cosmetology Diploma (Installment #1)', qty: 1, price: 25000 }],
        },
        {
          id: 'PAY-891820',
          refId: 'SAL-DISB-301',
          date: lastMonthStr,
          time: '04:00 PM',
          customerName: 'Suman Sharma (Stylist)',
          customerPhone: '9876543211',
          recipientType: 'STAFF',
          categoryType: 'SALARY',
          category: 'Staff Monthly Salary Disbursement',
          amount: 31000,
          paymentMode: 'Bank Transfer (NEFT)',
          status: 'PAID',
          items: [{ name: 'Monthly Staff Salary: October 2026', qty: 1, price: 31000 }],
        },
      ];
      localStorage.setItem('parlour_payment_history', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // POS BILL / INVOICE CREATION FORM STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [billForm, setBillForm] = useState({
    recipientType: 'CUSTOMER', // 'CUSTOMER' | 'STUDENT' | 'STAFF' | 'WALKIN'
    customerName: '',
    customerPhone: '',
    categoryType: 'PRODUCTS', // 'PRODUCTS' | 'SERVICES' | 'STUDENT_FEES'
    paymentMode: 'UPI (GPay / PhonePe)',
    notes: '',
    items: [{ productId: '', name: 'O3+ Bridal Glow Facial Kit', qty: 1, price: 4200 }],
    discount: 0,
    taxPercent: 5,
  });

  // Helper to add item row in POS modal
  const handleAddBillItem = () => {
    const firstProd = salonProducts[0];
    setBillForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: firstProd?.id || '',
          name: firstProd?.name || 'Salon Treatment / Product',
          qty: 1,
          price: firstProd?.price || 1000,
        },
      ],
    }));
  };

  // Helper to remove item row in POS modal
  const handleRemoveBillItem = (index) => {
    if (billForm.items.length <= 1) return;
    setBillForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Helper to change product in item row
  const handleItemProductChange = (index, prodId) => {
    const found = salonProducts.find((p) => p.id === prodId);
    if (!found) return;
    setBillForm((prev) => {
      const updated = [...prev.items];
      updated[index] = {
        productId: found.id,
        name: found.name,
        qty: updated[index].qty || 1,
        price: found.price || 0,
      };
      return { ...prev, items: updated };
    });
  };

  // Helper to change custom item values
  const handleItemFieldChange = (index, field, value) => {
    setBillForm((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  // Calculate Subtotal, Tax, Discount, Grand Total
  const billSubtotal = useMemo(() => {
    return billForm.items.reduce((sum, item) => sum + (Number(item.qty) || 1) * (Number(item.price) || 0), 0);
  }, [billForm.items]);

  const billTaxAmount = useMemo(() => {
    return Math.round((billSubtotal * (Number(billForm.taxPercent) || 0)) / 100);
  }, [billSubtotal, billForm.taxPercent]);

  const billGrandTotal = useMemo(() => {
    return Math.max(0, billSubtotal + billTaxAmount - (Number(billForm.discount) || 0));
  }, [billSubtotal, billTaxAmount, billForm.discount]);

  // Submit and Create New Bill
  const handleCreateBillSubmit = (e) => {
    e.preventDefault();
    if (!billForm.customerName.trim()) {
      alert('Please enter recipient name.');
      return;
    }
    if (billGrandTotal <= 0) {
      alert('Grand total must be greater than zero.');
      return;
    }

    const invNum = `INV-GBP-${new Date().getFullYear()}-${String(payments.length + 101).padStart(4, '0')}`;
    const newRecord = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      refId: invNum,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: billForm.customerName.trim(),
      customerPhone: billForm.customerPhone.trim() || 'Walk-In Client',
      recipientType: billForm.recipientType,
      categoryType: billForm.categoryType,
      category:
        billForm.categoryType === 'PRODUCTS'
          ? `Product Sale: ${billForm.items.map((i) => i.name).slice(0, 2).join(', ')}`
          : billForm.categoryType === 'STUDENT_FEES'
          ? `Academy Course Tuition Fee`
          : `Salon Service Treatment`,
      amount: billGrandTotal,
      paymentMode: billForm.paymentMode,
      status: 'PAID',
      notes: billForm.notes,
      items: billForm.items.map((i) => ({
        name: i.name,
        qty: Number(i.qty) || 1,
        price: Number(i.price) || 0,
      })),
      subtotal: billSubtotal,
      tax: billTaxAmount,
      discount: Number(billForm.discount) || 0,
    };

    // Deduct stock if products were sold
    if (billForm.categoryType === 'PRODUCTS') {
      try {
        const stored = localStorage.getItem('parlour_products_inventory');
        if (stored) {
          const prods = JSON.parse(stored);
          const updated = prods.map((p) => {
            const soldItem = billForm.items.find((item) => item.productId === p.id || item.name === p.name);
            if (soldItem) {
              return { ...p, stock: Math.max(0, p.stock - (Number(soldItem.qty) || 1)) };
            }
            return p;
          });
          localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
          setSalonProducts(updated);
        }
      } catch (err) {
        console.warn('Stock update notice:', err);
      }
    }

    const updated = [newRecord, ...payments];
    setPayments(updated);
    localStorage.setItem('parlour_payment_history', JSON.stringify(updated));

    if (showToast) showToast(`Bill #${invNum} generated! ₹${billGrandTotal.toLocaleString('en-IN')} recorded.`);
    setBillModalOpen(false);

    // Auto-open invoice view for instant printing
    setSelectedInvoice(newRecord);
  };

  // Date Calculations for KPI cards
  const todayStr = new Date().toISOString().split('T')[0];
  const curMonthStr = todayStr.slice(0, 7);
  const curYearStr = todayStr.slice(0, 4);

  const totalToday = payments.filter((p) => p.date === todayStr).reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalMonth = payments.filter((p) => p.date && p.date.startsWith(curMonthStr)).reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalYear = payments.filter((p) => p.date && p.date.startsWith(curYearStr)).reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalAllTime = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // 1. Period
      if (filterPeriod === 'TODAY' && p.date !== todayStr) return false;
      if (filterPeriod === 'THIS_MONTH' && (!p.date || !p.date.startsWith(curMonthStr))) return false;
      if (filterPeriod === 'THIS_YEAR' && (!p.date || !p.date.startsWith(curYearStr))) return false;

      // 2. Category
      if (filterCategory !== 'ALL' && p.categoryType !== filterCategory) return false;

      // 3. Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.customerName?.toLowerCase().includes(q);
        const matchId = p.id?.toLowerCase().includes(q) || p.refId?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        const matchMode = p.paymentMode?.toLowerCase().includes(q);
        return matchName || matchId || matchCat || matchMode;
      }
      return true;
    });
  }, [payments, filterPeriod, filterCategory, searchTerm, todayStr, curMonthStr, curYearStr]);

  // Export to Excel / CSV
  const handleExportCSV = () => {
    if (filteredPayments.length === 0) return;
    const headers = ['Payment ID', 'Invoice Ref', 'Date', 'Time', 'Recipient Name', 'Phone', 'Category', 'Amount (INR)', 'Payment Mode', 'Status'];
    const rows = filteredPayments.map((p) => [
      p.id,
      p.refId || '',
      p.date,
      p.time || '',
      `"${p.customerName || ''}"`,
      `"${p.customerPhone || ''}"`,
      `"${p.category || ''}"`,
      p.amount,
      `"${p.paymentMode || ''}"`,
      p.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Golden_Beauty_Revenue_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Header Bar ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #172554 100%)',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            }}
          >
            <DollarSign size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Payment History & Billing Ledger
              </h1>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
              >
                POS Invoices Included
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '3px 0 0' }}>
              Central audit trail for customer service bookings, product sales, student academy fees & printable tax invoices.
            </p>
          </div>
        </div>

        {/* Action Buttons: Export & New POS Bill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              padding: '9px 14px',
              borderRadius: '9px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            type="button"
            onClick={() => setBillModalOpen(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Plus size={16} /> + Create POS Bill & Record Payment
          </button>
        </div>
      </div>

      {/* ── 4 Financial KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        <div
          onClick={() => setFilterPeriod('TODAY')}
          style={{
            background: filterPeriod === 'TODAY' ? '#ecfdf5' : '#ffffff',
            borderRadius: '12px',
            padding: '14px 18px',
            border: filterPeriod === 'TODAY' ? '2px solid #10b981' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>● TODAY'S REVENUE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            ₹{totalToday.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            {payments.filter((p) => p.date === todayStr).length} transactions today
          </div>
        </div>

        <div
          onClick={() => setFilterPeriod('THIS_MONTH')}
          style={{
            background: filterPeriod === 'THIS_MONTH' ? '#f0fdf4' : '#ffffff',
            borderRadius: '12px',
            padding: '14px 18px',
            border: filterPeriod === 'THIS_MONTH' ? '2px solid #10b981' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>THIS MONTH</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            ₹{totalMonth.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Monthly intake</div>
        </div>

        <div
          onClick={() => setFilterPeriod('THIS_YEAR')}
          style={{
            background: filterPeriod === 'THIS_YEAR' ? '#f0fdf4' : '#ffffff',
            borderRadius: '12px',
            padding: '14px 18px',
            border: filterPeriod === 'THIS_YEAR' ? '2px solid #10b981' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>YEARLY COLLECTION</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            ₹{totalYear.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Year {curYearStr} cumulative</div>
        </div>

        <div
          onClick={() => setFilterPeriod('ALL')}
          style={{
            background: filterPeriod === 'ALL' ? '#f0fdf4' : '#ffffff',
            borderRadius: '12px',
            padding: '14px 18px',
            border: filterPeriod === 'ALL' ? '2px solid #10b981' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>ALL-TIME REVENUE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            ₹{totalAllTime.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Total {payments.length} ledger logs</div>
        </div>
      </div>

      {/* ── Category Filters & Search Controls Bar ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'SERVICES', label: '💄 Salon Services' },
            { id: 'PRODUCTS', label: '🛍️ Product Sales' },
            { id: 'STUDENT_FEES', label: '🎓 Student Academy Fees' },
            { id: 'SALARY', label: '💵 Staff Salary' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                border: '1px solid',
                borderColor: filterCategory === cat.id ? '#10b981' : '#e2e8f0',
                background: filterCategory === cat.id ? 'rgba(16, 185, 129, 0.12)' : '#f8fafc',
                color: filterCategory === cat.id ? '#059669' : '#64748b',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search invoice, customer, student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* ── Payments Ledger Table ── */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, textTransform: 'uppercase', fontSize: '11.5px' }}>
                <th style={{ padding: '12px 16px' }}>Invoice Ref & Date</th>
                <th style={{ padding: '12px 16px' }}>Customer / Student / Recipient</th>
                <th style={{ padding: '12px 16px' }}>Category & Service</th>
                <th style={{ padding: '12px 16px' }}>Amount (INR)</th>
                <th style={{ padding: '12px 16px' }}>Payment Mode</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Billing Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <Receipt size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                    <div style={{ fontWeight: 600, color: '#475569' }}>No payment entries found matching filter</div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.refId || p.id}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {p.date} · {p.time}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{p.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{p.customerPhone}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ color: '#334155', fontWeight: 600 }}>{p.category}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, fontSize: '14px', color: '#047857' }}>
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        {p.paymentMode}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> PAID
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(p)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#059669',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Printer size={13} /> View / Print Bill
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal 1: Create POS Bill & Record Payment ── */}
      {billModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              padding: '24px',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                    Create POS Bill & Tax Invoice
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                    Generates official salon receipt and syncs with payment history & inventory
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBillModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Recipient Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                    Recipient / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Maurya or Neha Verma"
                    value={billForm.customerName}
                    onChange={(e) => setBillForm({ ...billForm, customerName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={billForm.customerPhone}
                    onChange={(e) => setBillForm({ ...billForm, customerPhone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Bill Category Type */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setBillForm({ ...billForm, categoryType: 'PRODUCTS' })}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: billForm.categoryType === 'PRODUCTS' ? '#10b981' : '#334155',
                    background: billForm.categoryType === 'PRODUCTS' ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                    color: billForm.categoryType === 'PRODUCTS' ? '#34d399' : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🛍️ Product Sale
                </button>
                <button
                  type="button"
                  onClick={() => setBillForm({ ...billForm, categoryType: 'SERVICES' })}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: billForm.categoryType === 'SERVICES' ? '#10b981' : '#334155',
                    background: billForm.categoryType === 'SERVICES' ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                    color: billForm.categoryType === 'SERVICES' ? '#34d399' : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  💄 Salon Service
                </button>
                <button
                  type="button"
                  onClick={() => setBillForm({ ...billForm, categoryType: 'STUDENT_FEES' })}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: billForm.categoryType === 'STUDENT_FEES' ? '#10b981' : '#334155',
                    background: billForm.categoryType === 'STUDENT_FEES' ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                    color: billForm.categoryType === 'STUDENT_FEES' ? '#34d399' : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🎓 Academy Fee
                </button>
              </div>

              {/* Multi-Item Line-Items Section */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc' }}>
                    Purchased Items / Services:
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBillItem}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={12} /> + Add More Product / Service
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {billForm.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr auto', gap: '8px', alignItems: 'center' }}>
                      {/* Product Dropdown or Custom Name */}
                      {billForm.categoryType === 'PRODUCTS' && salonProducts.length > 0 ? (
                        <select
                          value={item.productId || ''}
                          onChange={(e) => handleItemProductChange(idx, e.target.value)}
                          style={{ padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px' }}
                        >
                          <option value="">-- Select Product --</option>
                          {salonProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemFieldChange(idx, 'name', e.target.value)}
                          placeholder="Treatment or item name"
                          style={{ padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px' }}
                        />
                      )}

                      {/* Qty */}
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemFieldChange(idx, 'qty', Number(e.target.value))}
                        placeholder="Qty"
                        style={{ padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px', textAlign: 'center' }}
                      />

                      {/* Unit Price */}
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemFieldChange(idx, 'price', Number(e.target.value))}
                        placeholder="Price"
                        style={{ padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px' }}
                      />

                      {/* Delete item */}
                      {billForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBillItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Mode & Taxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Payment Mode
                  </label>
                  <select
                    value={billForm.paymentMode}
                    onChange={(e) => setBillForm({ ...billForm, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px' }}
                  >
                    <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe)</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Debit / Credit Card">Debit / Credit Card</option>
                    <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    GST Tax (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={billForm.taxPercent}
                    onChange={(e) => setBillForm({ ...billForm, taxPercent: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={billForm.discount}
                    onChange={(e) => setBillForm({ ...billForm, discount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* Grand Total Banner */}
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11.5px', color: '#a7f3d0' }}>Subtotal: ₹{billSubtotal.toLocaleString()} + Tax: ₹{billTaxAmount.toLocaleString()}</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#34d399' }}>Final Payable Grand Total:</div>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>
                  ₹{billGrandTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setBillModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#ffffff', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Generate Bill & Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 2: View / Print Tax Invoice / Bill ── */}
      {selectedInvoice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              padding: '28px',
              color: '#0f172a',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #10b981', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>💄</span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#065f46', margin: 0 }}>
                    Golden Beauty Parlour & Academy
                  </h2>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                  Luxury Salon & Training Center · Varanasi, Uttar Pradesh · GSTIN: 09AABCU9603R1ZM
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: '#ecfdf5', color: '#059669', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: '1px solid #a7f3d0' }}>
                  TAX INVOICE / RECEIPT
                </span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                  {selectedInvoice.refId || selectedInvoice.id}
                </div>
              </div>
            </div>

            {/* Bill To Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Billed To Client:</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{selectedInvoice.customerName}</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Phone: {selectedInvoice.customerPhone}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Invoice Date & Time:</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {selectedInvoice.date} · {selectedInvoice.time || '11:00 AM'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Payment Mode: {selectedInvoice.paymentMode}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '8px 12px' }}>Particulars / Item Description</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total (INR)</th>
                </tr>
              </thead>
              <tbody>
                {(selectedInvoice.items && selectedInvoice.items.length > 0) ? (
                  selectedInvoice.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.qty || 1}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                        ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{selectedInvoice.category}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                      ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
                <tr style={{ background: '#ecfdf5', borderTop: '2px solid #10b981' }}>
                  <td colSpan={2} style={{ padding: '12px', fontWeight: 900, color: '#065f46', fontSize: '14px' }}>
                    Grand Total Paid (Received with Thanks)
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, color: '#065f46', fontSize: '16px' }}>
                    ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                ✨ Thank you for choosing Golden Beauty Parlour! Please visit again. ✨
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 800 }}>Golden Beauty Parlour</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Authorized Signatory</div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#ffffff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} /> Print Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParlourPaymentHistory;
