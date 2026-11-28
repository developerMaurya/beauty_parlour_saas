/**
 * @file OwnerTenantPaymentLedgerPage.jsx
 * @description Dedicated Master Cockpit for Property Owners (Makan Malik) & Tenants (Kirayedaar)
 * Monthly Rent Disbursement, Owner Salary/Payout Ledger, Electricity Bill Settlement,
 * Monthly/Yearly Financial Filters & Statement Generator.
 * Location: /admin/rental-owner-payments
 */

import React, { useState, useMemo } from 'react';
import {
  Building,
  User,
  Users,
  DollarSign,
  Calendar,
  Receipt,
  Plus,
  Zap,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Printer,
  X,
  Phone,
  FileText,
  CreditCard,
  Briefcase
} from 'lucide-react';

export default function OwnerTenantPaymentLedgerPage() {
  const [activeTab, setActiveTab] = useState('owner-payouts'); // 'owner-payouts' | 'tenant-rent' | 'financial-report'
  const [selectedOwnerId, setSelectedOwnerId] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
  const [statementSlipModal, setStatementSlipModal] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Property Owners (Makan Malik)
  const [owners, setOwners] = useState([
    {
      id: 'OWN-01',
      name: 'Pandit Ramakant Mishra',
      phone: '9839012345',
      property: 'Ganga View Complex (4 Flats & 2 Shops)',
      location: 'Assi Ghat, Varanasi',
      monthlyExpectedRent: 65000,
      managementCommission: '10%',
      payoutBank: 'State Bank of India (A/C: 3892XXXX441)',
      upiId: 'ramakant.mishra@sbi',
    },
    {
      id: 'OWN-02',
      name: 'Dr. Virendra Nath Singh',
      phone: '9415088776',
      property: 'Ring Road Commercial Complex (Office Floors 1 & 2)',
      location: 'Ring Road Phase-2, Sarnath',
      monthlyExpectedRent: 120000,
      managementCommission: '8%',
      payoutBank: 'HDFC Bank (A/C: 5010XXXX892)',
      upiId: 'vns.singh@hdfcbank',
    },
    {
      id: 'OWN-03',
      name: 'Smt. Gayatri Devi Agrawal',
      phone: '9838112233',
      property: 'Mohansarai Logistics Godam & Warehouse Hub',
      location: 'NH-19 Bypass, Mohansarai',
      monthlyExpectedRent: 160000,
      managementCommission: '7%',
      payoutBank: 'Punjab National Bank (A/C: 0422XXXX109)',
      upiId: 'gayatri.agrawal@okaxis',
    },
  ]);

  // Payment Records Ledger (Both Owner Payouts & Tenant Rent Collections)
  const [paymentLedger, setPaymentLedger] = useState([
    {
      id: 'PAY-2026-11-01',
      ownerId: 'OWN-01',
      ownerName: 'Pandit Ramakant Mishra',
      property: 'Ganga View Complex (4 Flats & 2 Shops)',
      tenantName: 'Rajesh Sharma & 3 Others',
      month: 'November',
      year: '2026',
      date: '2026-11-05',
      totalCollectedRent: 65000,
      electricityBillStatus: 'Paid (₹4,850 Cleared)',
      agencyCommissionDeducted: 6500,
      maintenanceDeducted: 1500,
      netOwnerPayout: 57000,
      paymentMode: 'Direct Bank NEFT Transfer',
      refNumber: 'NEFT-SBI-98442109',
      status: 'Paid to Owner',
      remarks: 'Full rent collected, electricity bill cleared and net payout transferred to owner',
    },
    {
      id: 'PAY-2026-10-01',
      ownerId: 'OWN-01',
      ownerName: 'Pandit Ramakant Mishra',
      property: 'Ganga View Complex (4 Flats & 2 Shops)',
      tenantName: 'Rajesh Sharma & 3 Others',
      month: 'October',
      year: '2026',
      date: '2026-10-06',
      totalCollectedRent: 65000,
      electricityBillStatus: 'Paid (₹4,200 Cleared)',
      agencyCommissionDeducted: 6500,
      maintenanceDeducted: 1000,
      netOwnerPayout: 57500,
      paymentMode: 'Direct Bank NEFT Transfer',
      refNumber: 'NEFT-SBI-88219904',
      status: 'Paid to Owner',
      remarks: 'October rent cleared on time',
    },
    {
      id: 'PAY-2026-11-02',
      ownerId: 'OWN-02',
      ownerName: 'Dr. Virendra Nath Singh',
      property: 'Ring Road Commercial Complex (Office Floors 1 & 2)',
      tenantName: 'FinTech Solutions & MedHealth Clinic',
      month: 'November',
      year: '2026',
      date: '2026-11-08',
      totalCollectedRent: 120000,
      electricityBillStatus: 'Paid (₹11,400 Cleared)',
      agencyCommissionDeducted: 9600,
      maintenanceDeducted: 2400,
      netOwnerPayout: 108000,
      paymentMode: 'HDFC RTGS Transfer',
      refNumber: 'RTGS-HDFC-55102938',
      status: 'Paid to Owner',
      remarks: 'Commercial rent collected for 2 floors, 3-phase meter bill verified and settled',
    },
    {
      id: 'PAY-2026-11-03',
      ownerId: 'OWN-03',
      ownerName: 'Smt. Gayatri Devi Agrawal',
      property: 'Mohansarai Logistics Godam & Warehouse Hub',
      tenantName: 'Balaji Transport Hub & Courier Co.',
      month: 'November',
      year: '2026',
      date: '2026-11-10',
      totalCollectedRent: 160000,
      electricityBillStatus: 'Paid (₹18,900 Cleared)',
      agencyCommissionDeducted: 11200,
      maintenanceDeducted: 3800,
      netOwnerPayout: 145000,
      paymentMode: 'Direct Bank Transfer',
      refNumber: 'PNB-UTR-44910283',
      status: 'Paid to Owner',
      remarks: 'Warehouse rent payout processed after safety inspection and power bill verification',
    },
    {
      id: 'PAY-2026-12-01',
      ownerId: 'OWN-01',
      ownerName: 'Pandit Ramakant Mishra',
      property: 'Ganga View Complex (4 Flats & 2 Shops)',
      tenantName: 'Rajesh Sharma & 3 Others',
      month: 'December',
      year: '2026',
      date: '2026-12-01',
      totalCollectedRent: 65000,
      electricityBillStatus: 'Bill Pending (Meter Reading Due)',
      agencyCommissionDeducted: 6500,
      maintenanceDeducted: 1500,
      netOwnerPayout: 57000,
      paymentMode: 'UPI (PhonePe / GPay)',
      refNumber: 'PENDING-DEC-01',
      status: 'Advance Due',
      remarks: 'December advance booked, final disbursement pending meter reading',
    },
  ]);

  // New Payment Form
  const [paymentForm, setPaymentForm] = useState({
    ownerId: 'OWN-01',
    month: 'December',
    year: '2026',
    date: new Date().toISOString().split('T')[0],
    totalCollectedRent: '65000',
    electricityPaid: '4500',
    isElectricityCleared: 'Yes',
    commissionDeducted: '6500',
    maintenanceDeducted: '1500',
    paymentMode: 'Direct Bank NEFT Transfer',
    refNumber: 'NEFT-SBI-' + Math.floor(10000000 + Math.random() * 90000000),
    status: 'Paid to Owner',
    remarks: 'Monthly rent payout disbursed to owner after agency commission deduction',
  });

  // Calculate Net Payout dynamically for modal
  const modalNetPayout = useMemo(() => {
    const rent = parseFloat(paymentForm.totalCollectedRent) || 0;
    const comm = parseFloat(paymentForm.commissionDeducted) || 0;
    const maint = parseFloat(paymentForm.maintenanceDeducted) || 0;
    return Math.max(0, rent - comm - maint);
  }, [paymentForm]);

  // Handle owner selection in form
  const handleOwnerSelectInForm = (oId) => {
    const found = owners.find((o) => o.id === oId);
    if (found) {
      const commRate = parseFloat(found.managementCommission) || 10;
      const comm = (found.monthlyExpectedRent * commRate) / 100;
      setPaymentForm((prev) => ({
        ...prev,
        ownerId: oId,
        totalCollectedRent: String(found.monthlyExpectedRent),
        commissionDeducted: String(comm),
      }));
    }
  };

  const handleAddPaymentSubmit = (e) => {
    e.preventDefault();
    const ownerObj = owners.find((o) => o.id === paymentForm.ownerId) || owners[0];
    const rent = parseFloat(paymentForm.totalCollectedRent) || 0;
    const comm = parseFloat(paymentForm.commissionDeducted) || 0;
    const maint = parseFloat(paymentForm.maintenanceDeducted) || 0;
    const net = Math.max(0, rent - comm - maint);

    const newRecord = {
      id: 'PAY-' + Date.now(),
      ownerId: ownerObj.id,
      ownerName: ownerObj.name,
      property: ownerObj.property,
      tenantName: 'Primary Assigned Tenants',
      month: paymentForm.month,
      year: paymentForm.year,
      date: paymentForm.date,
      totalCollectedRent: rent,
      electricityBillStatus: paymentForm.isElectricityCleared === 'Yes' ? `Paid (₹${paymentForm.electricityPaid} Cleared)` : 'Unpaid (Pending)',
      agencyCommissionDeducted: comm,
      maintenanceDeducted: maint,
      netOwnerPayout: net,
      paymentMode: paymentForm.paymentMode,
      refNumber: paymentForm.refNumber || 'REF-' + Date.now(),
      status: paymentForm.status,
      remarks: paymentForm.remarks,
    };

    setPaymentLedger([newRecord, ...paymentLedger]);
    setAddPaymentModalOpen(false);
    showToast(`✅ Payout of ₹${net.toLocaleString()} for ${paymentForm.month} ${paymentForm.year} recorded for ${ownerObj.name}!`);
  };

  // Filtered Records
  const filteredLedger = useMemo(() => {
    return paymentLedger.filter((rec) => {
      const matchOwner = selectedOwnerId === 'ALL' || rec.ownerId === selectedOwnerId;
      const matchYear = selectedYear === 'ALL' || rec.year === selectedYear;
      const matchMonth = selectedMonth === 'ALL' || rec.month === selectedMonth;
      const matchSearch =
        rec.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.refNumber.toLowerCase().includes(searchTerm.toLowerCase());

      return matchOwner && matchYear && matchMonth && matchSearch;
    });
  }, [paymentLedger, selectedOwnerId, selectedYear, selectedMonth, searchTerm]);

  // Aggregate stats based on current filter
  const summaryStats = useMemo(() => {
    let totalGrossCollected = 0;
    let totalOwnerPayouts = 0;
    let totalCommissionEarned = 0;

    filteredLedger.forEach((r) => {
      totalGrossCollected += r.totalCollectedRent || 0;
      totalOwnerPayouts += r.netOwnerPayout || 0;
      totalCommissionEarned += r.agencyCommissionDeducted || 0;
    });

    return {
      grossRent: totalGrossCollected,
      ownerPayouts: totalOwnerPayouts,
      commission: totalCommissionEarned,
      recordsCount: filteredLedger.length,
    };
  }, [filteredLedger]);

  const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a', background: '#f8fafc', minHeight: '100vh', padding: '1.5rem', width: '100%' }}>
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', zIndex: 99999, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="#10b981" />
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2,132,199,0.25)' }}>
            <Building size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Rental Owner & Tenant Monthly Payout Ledger
              </h1>
              <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                Makan Malik & Kirayedaar Payout Master
              </span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
              Select any owner to view their monthly payment history, electricity bill status, salary/rent disbursements, and monthly/yearly financial statements.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setAddPaymentModalOpen(true)}
            style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(2,132,199,0.2)' }}
          >
            <Plus size={16} /> + Record Monthly Payout / Rent
          </button>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Total Gross Rent Collected</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>₹{summaryStats.grossRent.toLocaleString()}</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={20} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Net Disbursed to Owners (Makan Malik)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>₹{summaryStats.ownerPayouts.toLocaleString()}</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Agency Commission Retained</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7c3aed', marginTop: '2px' }}>₹{summaryStats.commission.toLocaleString()}</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Disbursement Statements</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#b45309', marginTop: '2px' }}>{summaryStats.recordsCount} Records</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Selection Control Panel */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', flex: 1 }}>
          {/* Owner Dropdown */}
          <div style={{ minWidth: '220px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '3px' }}>
              👤 Select Makan Malik (Owner):
            </label>
            <select
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700, color: '#0f172a', background: '#f8fafc' }}
            >
              <option value="ALL">All Property Owners ({owners.length})</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} — {o.property}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div style={{ minWidth: '140px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '3px' }}>
              📅 Select Month:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700, color: '#0f172a', background: '#f8fafc' }}
            >
              <option value="ALL">All Months (Yearly View)</option>
              {monthsList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div style={{ minWidth: '100px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '3px' }}>
              📆 Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700, color: '#0f172a', background: '#f8fafc' }}
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', minWidth: '240px' }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by owner, property or UTR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Main Ledger Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              Monthly Rent & Salary Payout Records
            </h2>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Showing {filteredLedger.length} filtered payout statements for {selectedOwnerId === 'ALL' ? 'all owners' : owners.find(o => o.id === selectedOwnerId)?.name}
            </div>
          </div>
          <button
            onClick={() => {
              window.print();
              showToast('Print dialog triggered for ledger statements!');
            }}
            style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> Print Statement
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Owner (Makan Malik)</th>
                <th style={{ padding: '12px 16px' }}>Month & Date</th>
                <th style={{ padding: '12px 16px' }}>Gross Rent Collected</th>
                <th style={{ padding: '12px 16px' }}>⚡ Bijli Bill Status</th>
                <th style={{ padding: '12px 16px' }}>Deductions</th>
                <th style={{ padding: '12px 16px' }}>Net Owner Payout</th>
                <th style={{ padding: '12px 16px' }}>Status & UTR</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Slip</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedger.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{row.ownerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>🏢 {row.property}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#0284c7' }}>{row.month} {row.year}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>📅 Paid: {row.date}</div>
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>
                    ₹{row.totalCollectedRent?.toLocaleString()}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: row.electricityBillStatus.includes('Paid') ? '#15803d' : '#b45309', background: row.electricityBillStatus.includes('Paid') ? '#dcfce7' : '#fef3c7', padding: '2px 7px', borderRadius: '4px' }}>
                      {row.electricityBillStatus}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '11.5px', color: '#dc2626', fontWeight: 600 }}>
                      -₹{row.agencyCommissionDeducted?.toLocaleString()} <span style={{ fontSize: '10px', color: '#64748b' }}>(Comm)</span>
                    </div>
                    {row.maintenanceDeducted > 0 && (
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        -₹{row.maintenanceDeducted?.toLocaleString()} (Maint)
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 900, color: '#059669', fontSize: '13.5px' }}>
                      ₹{row.netOwnerPayout?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>via {row.paymentMode}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, background: row.status.includes('Paid') ? '#ecfdf5' : '#fef3c7', color: row.status.includes('Paid') ? '#047857' : '#92400e', padding: '2px 6px', borderRadius: '4px' }}>
                      {row.status}
                    </span>
                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                      {row.refNumber}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setStatementSlipModal(row)}
                      style={{ padding: '6px 11px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0284c7', fontWeight: 700, fontSize: '11.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}
                    >
                      <Receipt size={12} /> View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: RECORD NEW MONTHLY OWNER PAYOUT ── */}
      {addPaymentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Record Monthly Rent Payout to Owner</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Calculate gross rent, commission, electricity status and net disbursement</div>
              </div>
              <button onClick={() => setAddPaymentModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Select Property Owner (Makan Malik) *</label>
                <select
                  value={paymentForm.ownerId}
                  onChange={(e) => handleOwnerSelectInForm(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                >
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} — {o.property} (Monthly Rent: ₹{o.monthlyExpectedRent.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Payout Month *</label>
                  <select
                    value={paymentForm.month}
                    onChange={(e) => setPaymentForm({ ...paymentForm, month: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Year *</label>
                  <input
                    type="text"
                    value={paymentForm.year}
                    onChange={(e) => setPaymentForm({ ...paymentForm, year: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Payment Date *</label>
                  <input
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* Financial Deductions Box */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Gross Rent Collected (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={paymentForm.totalCollectedRent}
                      onChange={(e) => setPaymentForm({ ...paymentForm, totalCollectedRent: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, color: '#0f172a' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Agency Commission (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentForm.commissionDeducted}
                      onChange={(e) => setPaymentForm({ ...paymentForm, commissionDeducted: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#dc2626', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Maintenance / Repair (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentForm.maintenanceDeducted}
                      onChange={(e) => setPaymentForm({ ...paymentForm, maintenanceDeducted: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {/* Bijli Bill Settlement Check */}
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#fffbeb', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', display: 'block', marginBottom: '4px' }}>
                      ⚡ Bijli Bill Paid by Tenant?
                    </label>
                    <select
                      value={paymentForm.isElectricityCleared}
                      onChange={(e) => setPaymentForm({ ...paymentForm, isElectricityCleared: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fcd34d', fontWeight: 700 }}
                    >
                      <option value="Yes">Yes (Cleared by Tenant)</option>
                      <option value="No">No (Pending / Advance Adjusted)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', display: 'block', marginBottom: '4px' }}>
                      Bijli Amount Cleared (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentForm.electricityPaid}
                      onChange={(e) => setPaymentForm({ ...paymentForm, electricityPaid: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fcd34d' }}
                    />
                  </div>
                </div>

                {/* Net Payout Banner */}
                <div style={{ marginTop: '12px', background: '#ecfdf5', borderRadius: '8px', padding: '10px 14px', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#065f46', fontWeight: 700 }}>
                    Net Disbursed to Owner:
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
                    ₹{modalNetPayout.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Mode & Reference */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Disbursement Mode</label>
                  <select
                    value={paymentForm.paymentMode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Direct Bank NEFT Transfer">Direct Bank NEFT Transfer</option>
                    <option value="UPI (PhonePe / GPay)">UPI (PhonePe / GPay)</option>
                    <option value="RTGS Transfer">RTGS Transfer</option>
                    <option value="Cash Payment">Cash Payment</option>
                    <option value="Bank Cheque">Bank Cheque</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>UTR / Reference Number</label>
                  <input
                    type="text"
                    value={paymentForm.refNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, refNumber: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setAddPaymentModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 22px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save & Disburse to Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: OWNER SALARY & RENT STATEMENT SLIP ── */}
      {statementSlipModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 800 }}>Kashi Estate & Property Agency</div>
              <h3 style={{ margin: '4px 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>🏡 Owner Monthly Rent Disbursement Voucher</h3>
              <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>Month: {statementSlipModal.month} {statementSlipModal.year}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Property Owner:</span>
                <strong>{statementSlipModal.ownerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Premises / Property:</span>
                <span>{statementSlipModal.property}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Disbursement Date:</span>
                <span>{statementSlipModal.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>⚡ Electricity Bill:</span>
                <span style={{ fontWeight: 700, color: '#15803d' }}>{statementSlipModal.electricityBillStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <span style={{ color: '#64748b' }}>Gross Rent Collected:</span>
                <strong>₹{statementSlipModal.totalCollectedRent?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#dc2626' }}>Less: Agency Commission:</span>
                <strong style={{ color: '#dc2626' }}>-₹{statementSlipModal.agencyCommissionDeducted?.toLocaleString()}</strong>
              </div>
              {statementSlipModal.maintenanceDeducted > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#dc2626' }}>Less: Maintenance / Repairs:</span>
                  <strong style={{ color: '#dc2626' }}>-₹{statementSlipModal.maintenanceDeducted?.toLocaleString()}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0f172a', paddingTop: '10px', fontSize: '15px' }}>
                <strong>Net Disbursed to Owner:</strong>
                <strong style={{ color: '#059669', fontSize: '17px' }}>₹{statementSlipModal.netOwnerPayout?.toLocaleString()}</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Transfer Mode: {statementSlipModal.paymentMode} · Ref UTR: <strong>{statementSlipModal.refNumber}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setStatementSlipModal(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast('Printing owner payout statement voucher!');
                }}
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={14} /> Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
