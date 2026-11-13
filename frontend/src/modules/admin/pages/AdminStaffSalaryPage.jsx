/**
 * @file AdminStaffSalaryPage.jsx
 * @description Master Staff Salary & Payroll Management for Central Admin.
 * Handles:
 *  - Department-wide Payroll calculation (Base pay, Allowances, Bonuses, Deductions, Net Salary)
 *  - 1-Click Salary Disbursement (Bank Transfer, UPI, Cash)
 *  - Salary Adjustments & Formal Payslip Generation across Parlour, Events, Plotting, Software & Rent
 * @module frontend/src/modules/admin/pages/AdminStaffSalaryPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Edit2,
  Filter,
  Search,
  RefreshCw,
  X,
  CreditCard,
  Building,
  Printer,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  getMasterPayroll,
  saveMasterPayroll,
  processSalaryDisbursement,
  updateSalaryAdjustments,
} from '../../../services/hrSharedStorage.js';

export default function AdminStaffSalaryPage() {
  const toast = useToast();

  // Theme Mode: 'light' (Bright White) by default, or 'dark'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('attendance_theme_mode') || 'light';
  });

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    localStorage.setItem('attendance_theme_mode', next);
  };

  const isLight = themeMode === 'light';

  const [payrollList, setPayrollList] = useState(getMasterPayroll);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('November 2026');
  const [search, setSearch] = useState('');

  // Modals
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Pay form
  const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');
  const [transactionRef, setTransactionRef] = useState('');

  // Adjust form
  const [adjustForm, setAdjustForm] = useState({
    bonus: 0,
    deductions: 0,
    allowances: 0,
  });

  const reloadData = () => {
    setPayrollList(getMasterPayroll());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const filteredList = useMemo(() => {
    return payrollList.filter((item) => {
      const matchesDept = selectedDept === 'ALL' || item.department?.toUpperCase() === selectedDept;
      const matchesStatus = selectedStatus === 'ALL' || item.paymentStatus === selectedStatus;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.staffName?.toLowerCase().includes(q) ||
        item.staffId?.toLowerCase().includes(q) ||
        item.designation?.toLowerCase().includes(q) ||
        item.transactionRef?.toLowerCase().includes(q);

      return matchesDept && matchesStatus && matchesSearch;
    });
  }, [payrollList, selectedDept, selectedStatus, search]);

  // Overall Financial KPIs
  const stats = useMemo(() => {
    let totalLiability = 0;
    let disbursed = 0;
    let pending = 0;
    let paidCount = 0;

    payrollList.forEach((p) => {
      totalLiability += p.netSalary || 0;
      if (p.paymentStatus === 'PAID') {
        disbursed += p.netSalary || 0;
        paidCount++;
      } else {
        pending += p.netSalary || 0;
      }
    });

    return { totalLiability, disbursed, pending, paidCount, totalEmployees: payrollList.length };
  }, [payrollList]);

  const handleOpenPay = (item) => {
    setActiveItem(item);
    setPaymentMode('BANK_TRANSFER');
    setTransactionRef(`NEFT-${item.department}-${Date.now().toString().slice(-6)}`);
    setPayModalOpen(true);
  };

  const handleSubmitPay = (e) => {
    e.preventDefault();
    if (!activeItem) return;

    const updated = processSalaryDisbursement({
      payrollId: activeItem.id,
      paymentMode,
      transactionRef: transactionRef.trim() || `TXN-${Date.now().toString().slice(-6)}`,
    });

    setPayrollList(updated);
    setPayModalOpen(false);
    toast.success(`Salary of ₹${activeItem.netSalary.toLocaleString('en-IN')} disbursed to ${activeItem.staffName}`);
  };

  const handleOpenAdjust = (item) => {
    setActiveItem(item);
    setAdjustForm({
      bonus: item.bonus || 0,
      deductions: item.deductions || 0,
      allowances: item.allowances || 0,
    });
    setAdjustModalOpen(true);
  };

  const handleSubmitAdjust = (e) => {
    e.preventDefault();
    if (!activeItem) return;

    const updated = updateSalaryAdjustments({
      payrollId: activeItem.id,
      bonus: adjustForm.bonus,
      deductions: adjustForm.deductions,
      allowances: adjustForm.allowances,
    });

    setPayrollList(updated);
    setAdjustModalOpen(false);
    toast.success(`Salary adjustments saved for ${activeItem.staffName}`);
  };

  const handleOpenPayslip = (item) => {
    setActiveItem(item);
    setPayslipModalOpen(true);
  };

  const departmentMeta = {
    PARLOUR: { emoji: '💄', name: 'Parlour', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
    EVENTS: { emoji: '🔱', name: 'Events', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    PLOTTING: { emoji: '🏡', name: 'Plotting', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    SOFTWARE: { emoji: '💻', name: 'Software', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    RENT: { emoji: '🏢', name: 'Rent', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  };

  const themeStyles = {
    cardBg: isLight ? '#ffffff' : '#1e293b',
    border: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
    textPrimary: isLight ? '#0f172a' : '#ffffff',
    textSecondary: isLight ? '#475569' : '#cbd5e1',
    textMuted: isLight ? '#64748b' : '#94a3b8',
    tableHeaderBg: isLight ? '#f8fafc' : '#0f172a',
    tableBorder: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.07)',
    hoverBg: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
    inputBg: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)',
    inputBorder: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)',
  };

  return (
    <div
      style={{
        maxWidth: '1420px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        color: themeStyles.textPrimary,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Top Header Card ── */}
      <div
        style={{
          background: isLight ? '#ffffff' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(251, 191, 36, 0.3)'}`,
          borderRadius: '16px',
          padding: '22px 26px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
            }}
          >
            💰
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: themeStyles.textPrimary, margin: 0 }}>
                Master Staff Salary & Payroll
              </h1>
              <span
                style={{
                  background: isLight ? '#dcfce7' : 'rgba(16, 185, 129, 0.15)',
                  color: isLight ? '#15803d' : '#34d399',
                  border: `1px solid ${isLight ? '#86efac' : 'rgba(16, 185, 129, 0.4)'}`,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                PAYROLL ENGINE
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: themeStyles.textMuted, fontSize: '13px' }}>
              Monthly staff salary ledger, deductions, bonuses, disbursement & payslip issuance
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Bright Light Mode'}
            style={{
              background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'}`,
              color: isLight ? '#0f172a' : '#ffffff',
              borderRadius: '10px',
              padding: '9px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: '700',
              transition: 'all 0.2s ease',
            }}
          >
            {isLight ? <Moon size={15} color="#6366f1" /> : <Sun size={15} color="#facc15" />}
            <span>{isLight ? '🌙 Dark Mode' : '☀️ Bright Mode'}</span>
          </button>

          <button
            type="button"
            onClick={reloadData}
            title="Sync Payroll Ledger"
            style={{
              background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'}`,
              color: themeStyles.textSecondary,
              borderRadius: '10px',
              padding: '9px 15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Payroll</span>
          </button>
        </div>
      </div>

      {/* ── KPI Financial Overview ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            border: `1px solid ${isLight ? '#bfdbfe' : '#3b82f633'}`,
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#1d4ed8' : '#60a5fa' }}>
              TOTAL PAYROLL LIABILITY
            </span>
            <DollarSign size={18} color={isLight ? '#1d4ed8' : '#60a5fa'} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: themeStyles.textPrimary, marginTop: '6px' }}>
            ₹{stats.totalLiability.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: isLight ? '#1e40af' : '#93c5fd', marginTop: '2px' }}>
            {selectedMonth} ({stats.totalEmployees} Staff members)
          </div>
        </div>

        <div
          style={{
            background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            border: `1px solid ${isLight ? '#86efac' : '#10b98133'}`,
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#15803d' : '#4ade80' }}>
              DISBURSED / PAID
            </span>
            <CheckCircle2 size={18} color={isLight ? '#15803d' : '#4ade80'} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: isLight ? '#15803d' : '#4ade80', marginTop: '6px' }}>
            ₹{stats.disbursed.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: isLight ? '#166534' : '#86efac', marginTop: '2px' }}>
            {stats.paidCount} of {stats.totalEmployees} employees paid
          </div>
        </div>

        <div
          style={{
            background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            border: `1px solid ${isLight ? '#fde68a' : '#f59e0b33'}`,
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#b45309' : '#fbbf24' }}>
              PENDING DISBURSEMENT
            </span>
            <Clock size={18} color={isLight ? '#b45309' : '#fbbf24'} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: isLight ? '#b45309' : '#fbbf24', marginTop: '6px' }}>
            ₹{stats.pending.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: isLight ? '#78350f' : '#fde68a', marginTop: '2px' }}>
            {stats.totalEmployees - stats.paidCount} employees awaiting payout
          </div>
        </div>
      </div>

      {/* ── Toolbar: Department & Status Filter ── */}
      <div
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.border}`,
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
        }}
      >
        {/* Department Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'ALL', label: '👑 All Departments' },
            { id: 'PARLOUR', label: '💄 Beauty Parlour' },
            { id: 'EVENTS', label: '🔱 Events & Decor' },
            { id: 'PLOTTING', label: '🏡 Plotting Realty' },
            { id: 'SOFTWARE', label: '💻 RB Software' },
            { id: 'RENT', label: '🏢 Office Rent' },
          ].map((tab) => {
            const active = selectedDept === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDept(tab.id)}
                style={{
                  background: active
                    ? isLight
                      ? '#fef3c7'
                      : 'rgba(250, 204, 21, 0.2)'
                    : isLight
                    ? '#f1f5f9'
                    : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${
                    active ? (isLight ? '#fbbf24' : '#facc15') : isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  color: active ? (isLight ? '#92400e' : '#fde047') : isLight ? '#334155' : '#94a3b8',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Status & Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              background: themeStyles.inputBg,
              border: `1px solid ${themeStyles.inputBorder}`,
              color: themeStyles.textPrimary,
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              outline: 'none',
            }}
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">✅ Paid Only</option>
            <option value="PENDING">⏳ Pending Only</option>
          </select>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: themeStyles.inputBg,
              border: `1px solid ${themeStyles.inputBorder}`,
              borderRadius: '6px',
              padding: '5px 10px',
            }}
          >
            <Search size={14} color={themeStyles.textMuted} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee / ref..."
              style={{
                background: 'transparent',
                border: 'none',
                color: themeStyles.textPrimary,
                fontSize: '12px',
                outline: 'none',
                width: '140px',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: themeStyles.textMuted, cursor: 'pointer', padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Master Payroll Table ── */}
      <div
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : '0 8px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1050px' }}>
            <thead>
              <tr
                style={{
                  background: themeStyles.tableHeaderBg,
                  borderBottom: `1px solid ${themeStyles.tableBorder}`,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: themeStyles.textMuted,
                }}
              >
                <th style={{ padding: '14px 16px', width: '40px' }}>#</th>
                <th style={{ padding: '14px 16px' }}>Staff Employee</th>
                <th style={{ padding: '14px 16px' }}>Department</th>
                <th style={{ padding: '14px 16px' }}>Base Salary</th>
                <th style={{ padding: '14px 16px' }}>Allowances</th>
                <th style={{ padding: '14px 16px' }}>Bonus</th>
                <th style={{ padding: '14px 16px' }}>Deductions</th>
                <th style={{ padding: '14px 16px' }}>Net Payable</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '50px 20px', color: themeStyles.textMuted }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
                    <div style={{ fontSize: '15px', color: themeStyles.textPrimary, fontWeight: '700' }}>
                      No payroll records match your filter criteria
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => {
                  const dept = departmentMeta[item.department?.toUpperCase()] || {
                    emoji: '👥',
                    name: item.department,
                    color: '#64748b',
                    bg: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
                  };

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: `1px solid ${themeStyles.tableBorder}`,
                        fontSize: '13px',
                        color: themeStyles.textPrimary,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = themeStyles.hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', color: themeStyles.textMuted, fontWeight: '700' }}>{idx + 1}</td>

                      {/* Staff Name & Role */}
                      <td style={{ padding: '14px 16px' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: themeStyles.textPrimary }}>{item.staffName}</div>
                          <div style={{ fontSize: '11px', color: themeStyles.textMuted }}>
                            {item.staffId} • {item.designation}
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: isLight ? `${dept.color}15` : dept.bg,
                            border: `1px solid ${dept.color}44`,
                            color: dept.color,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}
                        >
                          {dept.emoji} {dept.name}
                        </span>
                      </td>

                      {/* Base Salary */}
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: themeStyles.textPrimary }}>
                        ₹{item.baseSalary.toLocaleString('en-IN')}
                      </td>

                      {/* Allowances */}
                      <td style={{ padding: '14px 16px', color: isLight ? '#0369a1' : '#38bdf8', fontSize: '12px', fontWeight: '600' }}>
                        +₹{item.allowances.toLocaleString('en-IN')}
                      </td>

                      {/* Bonus */}
                      <td style={{ padding: '14px 16px', color: isLight ? '#15803d' : '#4ade80', fontSize: '12px', fontWeight: '600' }}>
                        +₹{item.bonus.toLocaleString('en-IN')}
                      </td>

                      {/* Deductions */}
                      <td style={{ padding: '14px 16px', color: item.deductions > 0 ? (isLight ? '#b91c1c' : '#f87171') : themeStyles.textMuted, fontSize: '12px', fontWeight: '600' }}>
                        {item.deductions > 0 ? `-₹${item.deductions.toLocaleString('en-IN')}` : '₹0'}
                      </td>

                      {/* Net Payable */}
                      <td style={{ padding: '14px 16px', fontWeight: '900', color: isLight ? '#b45309' : '#fbbf24', fontSize: '14px' }}>
                        ₹{item.netSalary.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        {item.paymentStatus === 'PAID' ? (
                          <div>
                            <span
                              style={{
                                background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.15)',
                                border: `1px solid ${isLight ? '#86efac' : 'rgba(34, 197, 94, 0.4)'}`,
                                color: isLight ? '#15803d' : '#4ade80',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                              }}
                            >
                              ✅ Paid
                            </span>
                            <div style={{ fontSize: '10px', color: themeStyles.textMuted, marginTop: '3px' }}>
                              {item.paymentMode} ({item.paidAt})
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
                              border: `1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.4)'}`,
                              color: isLight ? '#b45309' : '#fbbf24',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            ⏳ Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {item.paymentStatus !== 'PAID' && (
                            <button
                              type="button"
                              onClick={() => handleOpenPay(item)}
                              title="Disburse Salary"
                              style={{
                                background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.18)',
                                border: `1px solid ${isLight ? '#86efac' : 'rgba(34, 197, 94, 0.4)'}`,
                                color: isLight ? '#15803d' : '#4ade80',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenAdjust(item)}
                            title="Adjust Bonus/Deduction"
                            style={{
                              background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                              border: `1px solid ${isLight ? '#cbd5e1' : 'transparent'}`,
                              color: themeStyles.textSecondary,
                              padding: '5px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenPayslip(item)}
                            title="View Formal Payslip"
                            style={{
                              background: isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.15)',
                              border: `1px solid ${isLight ? '#bae6fd' : 'rgba(56, 189, 248, 0.3)'}`,
                              color: isLight ? '#0369a1' : '#38bdf8',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Eye size={12} />
                            <span>Slip</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          style={{
            padding: '12px 18px',
            background: themeStyles.tableHeaderBg,
            borderTop: `1px solid ${themeStyles.tableBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: themeStyles.textMuted,
          }}
        >
          <span>
            Total Disbursed: <strong style={{ color: themeStyles.textPrimary }}>₹{stats.disbursed.toLocaleString('en-IN')}</strong> of ₹{stats.totalLiability.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>
            Payslips automatically reflect in employee Staff Portal upon disbursement
          </span>
        </div>
      </div>

      {/* ── PAY SALARY MODAL ── */}
      {payModalOpen && activeItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: isLight ? '#ffffff' : '#1e293b',
              border: `1px solid ${isLight ? '#86efac' : 'rgba(34, 197, 94, 0.4)'}`,
              borderRadius: '16px',
              padding: '26px',
              color: themeStyles.textPrimary,
              boxShadow: isLight ? '0 10px 40px rgba(0,0,0,0.15)' : '0 10px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>💳</span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: themeStyles.textPrimary }}>
                  Disburse Salary: {activeItem.staffName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                style={{ background: 'none', border: 'none', color: themeStyles.textMuted, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                background: isLight ? '#f0fdf4' : 'rgba(15, 23, 42, 0.8)',
                border: `1px solid ${isLight ? '#bbf7d0' : 'transparent'}`,
                padding: '14px',
                borderRadius: '10px',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: isLight ? '#166534' : '#94a3b8' }}>Net Payable Amount</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: isLight ? '#15803d' : '#4ade80', margin: '4px 0' }}>
                ₹{activeItem.netSalary.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11px', color: isLight ? '#15803d' : '#cbd5e1' }}>
                {activeItem.designation} • {activeItem.department}
              </div>
            </div>

            <form onSubmit={handleSubmitPay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: themeStyles.textSecondary, marginBottom: '5px' }}>
                  Payment Mode *
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="UPI">UPI Instant Pay (GPay / PhonePe / Paytm)</option>
                  <option value="CASH">Cash in Hand</option>
                  <option value="CHEQUE">Company Bank Cheque</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: themeStyles.textSecondary, marginBottom: '5px' }}>
                  Transaction Reference / UTR Number
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. NEFT-HDFC-998822"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  style={{
                    background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                    color: themeStyles.textSecondary,
                    border: `1px solid ${isLight ? '#cbd5e1' : 'transparent'}`,
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)',
                  }}
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADJUST SALARY MODAL ── */}
      {adjustModalOpen && activeItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: isLight ? '#ffffff' : '#1e293b',
              border: `1px solid ${isLight ? '#fde68a' : 'rgba(250, 204, 21, 0.4)'}`,
              borderRadius: '16px',
              padding: '26px',
              color: themeStyles.textPrimary,
              boxShadow: isLight ? '0 10px 40px rgba(0,0,0,0.15)' : '0 10px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>⚙️</span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: themeStyles.textPrimary }}>
                  Adjust Salary: {activeItem.staffName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalOpen(false)}
                style={{ background: 'none', border: 'none', color: themeStyles.textMuted, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)',
                border: `1px solid ${isLight ? '#e2e8f0' : 'transparent'}`,
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '14px',
                color: themeStyles.textPrimary,
              }}
            >
              Base Salary: <strong>₹{activeItem.baseSalary.toLocaleString('en-IN')}</strong>
            </div>

            <form onSubmit={handleSubmitAdjust} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: themeStyles.textSecondary, marginBottom: '5px' }}>
                  Allowances (HRA / Conveyance)
                </label>
                <input
                  type="number"
                  value={adjustForm.allowances}
                  onChange={(e) => setAdjustForm({ ...adjustForm, allowances: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: themeStyles.textSecondary, marginBottom: '5px' }}>
                  Performance / Festival Bonus
                </label>
                <input
                  type="number"
                  value={adjustForm.bonus}
                  onChange={(e) => setAdjustForm({ ...adjustForm, bonus: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: themeStyles.textSecondary, marginBottom: '5px' }}>
                  Deductions (Unpaid leaves / Advance / PF)
                </label>
                <input
                  type="number"
                  value={adjustForm.deductions}
                  onChange={(e) => setAdjustForm({ ...adjustForm, deductions: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  style={{
                    background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                    color: themeStyles.textSecondary,
                    border: `1px solid ${isLight ? '#cbd5e1' : 'transparent'}`,
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #facc15, #eab308)',
                    color: '#0f172a',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(250, 204, 21, 0.25)',
                  }}
                >
                  Save Adjustments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FORMAL PAYSLIP MODAL ── */}
      {payslipModalOpen && activeItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              color: '#0f172a',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header / Brand */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="/kashi-logo.png"
                  alt="Kashi Service Logo"
                  style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
                />
                <div>
                  <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', color: '#6366f1', textTransform: 'uppercase' }}>
                    OFFICIAL SALARY VOUCHER
                  </span>
                  <h2 style={{ fontSize: '19px', fontWeight: '900', margin: '2px 0 0', color: '#0f172a' }}>
                    Kashi Service Group
                  </h2>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Multi-Business Enterprise • Varanasi (UP)
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayslipModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Employee Details Box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', margin: '16px 0', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Employee Name:</span>
                <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{activeItem.staffName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Department / Role:</span>
                <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{activeItem.department} • {activeItem.designation}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Payroll Month:</span>
                <strong>{activeItem.month}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Payment Status:</span>
                <strong style={{ color: activeItem.paymentStatus === 'PAID' ? '#16a34a' : '#d97706' }}>
                  {activeItem.paymentStatus === 'PAID' ? `PAID (${activeItem.paymentMode})` : 'PENDING'}
                </strong>
              </div>
            </div>

            {/* Earnings & Deductions Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12.5px' }}>
              {/* Earnings */}
              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  EARNINGS
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Basic Salary:</span>
                  <strong>₹{activeItem.baseSalary.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Allowances:</span>
                  <strong>₹{activeItem.allowances.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Bonus / Incentive:</span>
                  <strong>₹{activeItem.bonus.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  DEDUCTIONS
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Leave / PF / Advance:</span>
                  <strong style={{ color: '#dc2626' }}>₹{activeItem.deductions.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            {/* Net Total Box */}
            <div style={{ marginTop: '16px', borderTop: '2px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                  NET TAKE-HOME SALARY
                </div>
                {activeItem.transactionRef && (
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Ref: {activeItem.transactionRef}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>
                ₹{activeItem.netSalary.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Printer size={14} />
                <span>Print Payslip</span>
              </button>
              <button
                type="button"
                onClick={() => setPayslipModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const kpiCardStyle = (accent) => ({
  background: 'rgba(30, 41, 59, 0.7)',
  border: `1px solid ${accent}33`,
  borderRadius: '14px',
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
});

const modalInputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};

