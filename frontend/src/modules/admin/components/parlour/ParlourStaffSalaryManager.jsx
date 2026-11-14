/**
 * @file ParlourStaffSalaryManager.jsx
 * @description Master Staff & Employee Salary Management & Payroll CRUD for Golden Beauty Parlour.
 * Features:
 *   - Employee Roster with 1-click "Pay / Manage Salary" Action
 *   - Full Salary CRUD (Add, View, Edit, Delete)
 *   - Automatic Net Pay calculation: (Base + Bonus - Deductions)
 *   - Formal Printable Pay-Slips with company branding
 *   - Payment status tracking (PAID / PENDING / PROCESSING) with Bank, UPI, or Cash
 * @module frontend/src/modules/admin/components/parlour/ParlourStaffSalaryManager
 */

import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  X,
  Building,
  CreditCard,
  FileText,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function ParlourStaffSalaryManager({ showToast }) {
  // Staff Roster
  const [staffList, setStaffList] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_staff_roster');
      if (stored) return JSON.parse(stored);
      const seed = [
        { id: 'EMP-01', name: 'Suman Sharma', role: 'Senior Bridal Stylist', phone: '9876543211', baseSalary: 28000, status: 'ACTIVE' },
        { id: 'EMP-02', name: 'Priya Patel', role: 'Cosmetologist & Skin Specialist', phone: '9876543212', baseSalary: 24000, status: 'ACTIVE' },
        { id: 'EMP-03', name: 'Rekha Maurya', role: 'Academy Lead Trainer & Director', phone: '9876543213', baseSalary: 35000, status: 'ACTIVE' },
        { id: 'EMP-04', name: 'Aarti Gupta', role: 'Nail Art & Lash Extension Pro', phone: '9876543214', baseSalary: 20000, status: 'ACTIVE' },
        { id: 'EMP-05', name: 'Pooja Singh', role: 'Junior Hair & Makeover Assistant', phone: '9876543215', baseSalary: 16000, status: 'ACTIVE' },
      ];
      localStorage.setItem('parlour_staff_roster', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  // Salary Disbursements Records State
  const [salaries, setSalaries] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_staff_salary_records');
      if (stored) return JSON.parse(stored);
      const seed = [
        {
          id: 'SAL-2026-11-01',
          staffId: 'EMP-01',
          staffName: 'Suman Sharma',
          role: 'Senior Bridal Stylist',
          month: 'November 2026',
          baseSalary: 28000,
          bonus: 3500, // bridal incentive
          deductions: 500,
          netSalary: 31000,
          date: '2026-11-05',
          paymentMode: 'Bank Transfer (IMPS)',
          status: 'PAID',
          notes: 'Wedding season incentive added',
        },
        {
          id: 'SAL-2026-11-02',
          staffId: 'EMP-02',
          staffName: 'Priya Patel',
          role: 'Cosmetologist & Skin Specialist',
          month: 'November 2026',
          baseSalary: 24000,
          bonus: 1500,
          deductions: 0,
          netSalary: 25500,
          date: '2026-11-05',
          paymentMode: 'UPI (PhonePe)',
          status: 'PAID',
          notes: 'Regular monthly salary',
        },
        {
          id: 'SAL-2026-11-03',
          staffId: 'EMP-03',
          staffName: 'Rekha Maurya',
          role: 'Academy Lead Trainer & Director',
          month: 'November 2026',
          baseSalary: 35000,
          bonus: 5000,
          deductions: 0,
          netSalary: 40000,
          date: '2026-11-05',
          paymentMode: 'Bank Transfer (NEFT)',
          status: 'PAID',
          notes: 'Academy batch completion honorarium',
        },
        {
          id: 'SAL-2026-11-04',
          staffId: 'EMP-04',
          staffName: 'Aarti Gupta',
          role: 'Nail Art & Lash Extension Pro',
          month: 'November 2026',
          baseSalary: 20000,
          bonus: 0,
          deductions: 1000,
          netSalary: 19000,
          date: '2026-11-10',
          paymentMode: 'Cash',
          status: 'PENDING',
          notes: 'Pending counter cash verification',
        },
      ];
      localStorage.setItem('parlour_staff_salary_records', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [payslipModal, setPayslipModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('ALL');

  // Form state
  const [formState, setFormState] = useState({
    staffId: '',
    staffName: '',
    role: '',
    month: 'November 2026',
    baseSalary: 25000,
    bonus: 0,
    deductions: 0,
    paymentMode: 'Bank Transfer (IMPS)',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'PAID',
    notes: '',
  });

  // Open modal pre-filled for a specific employee
  const handleOpenForStaff = (emp) => {
    setEditingSalary(null);
    setFormState({
      staffId: emp.id,
      staffName: emp.name,
      role: emp.role,
      month: 'November 2026',
      baseSalary: emp.baseSalary,
      bonus: 0,
      deductions: 0,
      paymentMode: 'Bank Transfer (IMPS)',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'PAID',
      notes: '',
    });
    setSalaryModalOpen(true);
  };

  const handleEditSalary = (sal) => {
    setEditingSalary(sal);
    setFormState({
      staffId: sal.staffId,
      staffName: sal.staffName,
      role: sal.role,
      month: sal.month,
      baseSalary: sal.baseSalary,
      bonus: sal.bonus,
      deductions: sal.deductions,
      paymentMode: sal.paymentMode,
      paymentDate: sal.date,
      status: sal.status,
      notes: sal.notes || '',
    });
    setSalaryModalOpen(true);
  };

  const handleSaveSalary = (e) => {
    e.preventDefault();
    if (!formState.staffName.trim()) {
      alert('Please select or enter staff member name.');
      return;
    }

    const base = Number(formState.baseSalary) || 0;
    const bonus = Number(formState.bonus) || 0;
    const deductions = Number(formState.deductions) || 0;
    const net = Math.max(0, base + bonus - deductions);

    if (editingSalary) {
      // Update
      const updated = salaries.map((s) => {
        if (s.id === editingSalary.id) {
          return {
            ...s,
            staffName: formState.staffName,
            role: formState.role,
            month: formState.month,
            baseSalary: base,
            bonus,
            deductions,
            netSalary: net,
            date: formState.paymentDate,
            paymentMode: formState.paymentMode,
            status: formState.status,
            notes: formState.notes,
          };
        }
        return s;
      });
      setSalaries(updated);
      localStorage.setItem('parlour_staff_salary_records', JSON.stringify(updated));
      showToast?.(`Salary record for ${formState.staffName} updated!`);
    } else {
      // Create
      const newRec = {
        id: `SAL-${Date.now().toString().slice(-6)}`,
        staffId: formState.staffId || `EMP-${Date.now().toString().slice(-3)}`,
        staffName: formState.staffName,
        role: formState.role || 'Salon Staff',
        month: formState.month,
        baseSalary: base,
        bonus,
        deductions,
        netSalary: net,
        date: formState.paymentDate,
        paymentMode: formState.paymentMode,
        status: formState.status,
        notes: formState.notes,
      };
      const updated = [newRec, ...salaries];
      setSalaries(updated);
      localStorage.setItem('parlour_staff_salary_records', JSON.stringify(updated));
      showToast?.(`Salary disbursement of ₹${net.toLocaleString('en-IN')} added for ${formState.staffName}!`);
    }

    setSalaryModalOpen(false);
    setEditingSalary(null);
  };

  const handleDeleteSalary = (id, name) => {
    if (window.confirm(`Delete salary record #${id} for ${name}?`)) {
      const filtered = salaries.filter((s) => s.id !== id);
      setSalaries(filtered);
      localStorage.setItem('parlour_staff_salary_records', JSON.stringify(filtered));
      showToast?.(`Salary record for ${name} deleted.`);
      if (payslipModal?.id === id) setPayslipModal(null);
    }
  };

  const filteredSalaries = salaries.filter((s) => {
    if (monthFilter !== 'ALL' && s.month !== monthFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.staffName.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalDisbursed = salaries.filter((s) => s.status === 'PAID').reduce((acc, s) => acc + (s.netSalary || 0), 0);
  const pendingCount = salaries.filter((s) => s.status === 'PENDING').length;
  const pendingTotal = salaries.filter((s) => s.status === 'PENDING').reduce((acc, s) => acc + (s.netSalary || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Top Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={24} color="#7e22ce" />
            <span>Staff Payroll & Salary Management</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Manage employee base pay, incentives, deductions, 1-click salary disbursements, and printable payslips.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSalary(null);
            setFormState({
              staffId: staffList[0]?.id || '',
              staffName: staffList[0]?.name || '',
              role: staffList[0]?.role || '',
              month: 'November 2026',
              baseSalary: staffList[0]?.baseSalary || 25000,
              bonus: 0,
              deductions: 0,
              paymentMode: 'Bank Transfer (IMPS)',
              paymentDate: new Date().toISOString().split('T')[0],
              status: 'PAID',
              notes: '',
            });
            setSalaryModalOpen(true);
          }}
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
          <span>+ Add Salary Disbursement</span>
        </button>
      </div>

      {/* ── Metric Highlights ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Total Payroll Disbursed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>₹{totalDisbursed.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>Paid via Bank / UPI / Cash</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Pending Disbursements</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: pendingCount > 0 ? '#b45309' : '#15803d', marginTop: 4 }}>
              {pendingCount} ({pendingCount > 0 ? `₹${pendingTotal.toLocaleString('en-IN')}` : 'All Clear'})
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: 4 }}>Awaiting verification</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Active Staff Members</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{staffList.length} Stylists</div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>100% On-Premise Salon Team</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* ── Employee Roster with Quick Salary Action ── */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Salon Employee Roster</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Click "Pay / Manage Salary" to quickly disburse salary for any employee</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
          {staffList.map((emp) => (
            <div key={emp.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#7e22ce', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px' }}>{emp.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{emp.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700 }}>Base Salary</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>₹{emp.baseSalary.toLocaleString('en-IN')}/mo</div>
                </div>
                <button
                  onClick={() => handleOpenForStaff(emp)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#7e22ce',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <DollarSign size={13} />
                  <span>Pay Salary</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Salary Disbursements History Table ── */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Payroll Disbursements & Payslips
          </h3>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '12.5px', background: 'transparent', width: '130px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Staff Name & Role</th>
                <th style={{ padding: '12px 16px' }}>Payroll Month</th>
                <th style={{ padding: '12px 16px' }}>Base Pay</th>
                <th style={{ padding: '12px 16px' }}>Bonus / Incentive</th>
                <th style={{ padding: '12px 16px' }}>Deductions</th>
                <th style={{ padding: '12px 16px' }}>Net Paid</th>
                <th style={{ padding: '12px 16px' }}>Mode</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Users size={36} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 700 }}>No salary disbursement records found.</p>
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((sal) => (
                  <tr key={sal.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{sal.staffName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{sal.role}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>
                      {sal.month}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      ₹{sal.baseSalary.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: 700 }}>
                      +₹{sal.bonus.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#dc2626' }}>
                      -₹{sal.deductions.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 900, fontSize: '14px', color: '#7e22ce' }}>
                      ₹{sal.netSalary.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11.5px', color: '#475569' }}>
                      {sal.paymentMode}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          background: sal.status === 'PAID' ? '#ecfdf5' : '#fffbeb',
                          color: sal.status === 'PAID' ? '#15803d' : '#b45309',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 800,
                        }}
                      >
                        {sal.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setPayslipModal(sal)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          title="View / Print Official Payslip"
                        >
                          <Printer size={12} />
                          <span>Slip</span>
                        </button>
                        <button
                          onClick={() => handleEditSalary(sal)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', cursor: 'pointer' }}
                          title="Edit Salary Details"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteSalary(sal.id, sal.staffName)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff1f2', color: '#dc2626', cursor: 'pointer' }}
                          title="Delete Salary Record"
                        >
                          <Trash2 size={12} />
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

      {/* ── Add / Edit Salary Modal ── */}
      {salaryModalOpen && (
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
            if (e.target === e.currentTarget) setSalaryModalOpen(false);
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
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign size={20} color="#7e22ce" />
                <span>{editingSalary ? 'Edit Staff Salary' : 'Disburse Staff Salary'}</span>
              </h3>
              <button onClick={() => setSalaryModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSalary} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Staff Select */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Staff Member *</label>
                  <select
                    value={formState.staffName}
                    onChange={(e) => {
                      const emp = staffList.find((st) => st.name === e.target.value);
                      if (emp) {
                        setFormState({
                          ...formState,
                          staffId: emp.id,
                          staffName: emp.name,
                          role: emp.role,
                          baseSalary: emp.baseSalary,
                        });
                      } else {
                        setFormState({ ...formState, staffName: e.target.value });
                      }
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="">-- Choose Employee --</option>
                    {staffList.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Payroll Month *</label>
                  <select
                    value={formState.month}
                    onChange={(e) => setFormState({ ...formState, month: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="November 2026">November 2026</option>
                    <option value="December 2026">December 2026</option>
                    <option value="October 2026">October 2026</option>
                    <option value="September 2026">September 2026</option>
                  </select>
                </div>
              </div>

              {/* Salary Components */}
              <div style={{ background: '#faf5ff', padding: '12px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Base Salary (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formState.baseSalary}
                    onChange={(e) => setFormState({ ...formState, baseSalary: Math.max(0, parseFloat(e.target.value) || 0) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', display: 'block', marginBottom: 4 }}>+ Bonus / Tips (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.bonus}
                    onChange={(e) => setFormState({ ...formState, bonus: Math.max(0, parseFloat(e.target.value) || 0) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: 4 }}>- Deductions (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.deductions}
                    onChange={(e) => setFormState({ ...formState, deductions: Math.max(0, parseFloat(e.target.value) || 0) })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* Auto Calculated Net Salary */}
              <div style={{ background: '#f5f3ff', padding: '10px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#4c1d95' }}>Computed Net Salary to Disburse:</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7e22ce' }}>
                  ₹{(Math.max(0, (Number(formState.baseSalary) || 0) + (Number(formState.bonus) || 0) - (Number(formState.deductions) || 0))).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Mode & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Payment Mode</label>
                  <select
                    value={formState.paymentMode}
                    onChange={(e) => setFormState({ ...formState, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  >
                    <option value="Bank Transfer (IMPS)">Bank IMPS / NEFT</option>
                    <option value="UPI (PhonePe)">UPI (PhonePe / GPay)</option>
                    <option value="Cash">Cash at Counter</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Payment Date</label>
                  <input
                    type="date"
                    required
                    value={formState.paymentDate}
                    onChange={(e) => setFormState({ ...formState, paymentDate: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  >
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Notes / Reference Details</label>
                <input
                  type="text"
                  placeholder="e.g. Festival advance deducted / Bridal bonus"
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setSalaryModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 22px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  {editingSalary ? 'Save Changes' : 'Confirm Disbursement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View / Print Official Payslip Modal ── */}
      {payslipModal && (
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
            if (e.target === e.currentTarget) setPayslipModal(null);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ background: '#ecfdf5', color: '#15803d', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                ● OFFICIAL PAYSLIP • {payslipModal.month}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => window.print()}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Printer size={14} />
                  <span>Print Slip</span>
                </button>
                <button onClick={() => setPayslipModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Payslip Card Layout */}
            <div style={{ border: '2px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', background: '#faf5ff' }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid #d8b4fe', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#7e22ce', margin: 0 }}>GOLDEN BEAUTY PARLOUR & ACADEMY</h2>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Staff Salary Statement • Varanasi, UP</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '12.5px', marginBottom: '1rem' }}>
                <div>
                  <div style={{ color: '#64748b' }}>Employee Name:</div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{payslipModal.staffName}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Role & Designation:</div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{payslipModal.role}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Pay Slip Period:</div>
                  <div style={{ fontWeight: 700, color: '#7e22ce' }}>{payslipModal.month}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Payment Mode:</div>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>{payslipModal.paymentMode}</div>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown */}
              <div style={{ background: '#fff', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0', fontSize: '12.5px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#475569' }}>Monthly Base Pay</span>
                  <span style={{ fontWeight: 700 }}>₹{payslipModal.baseSalary.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#16a34a' }}>
                  <span>Performance Incentive / Tips</span>
                  <span style={{ fontWeight: 700 }}>+₹{payslipModal.bonus.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#dc2626' }}>
                  <span>Taxes / Leave Deductions</span>
                  <span style={{ fontWeight: 700 }}>-₹{payslipModal.deductions.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: 8, marginTop: 4, fontWeight: 900, fontSize: '15px', color: '#7e22ce' }}>
                  <span>Total Net Disbursed</span>
                  <span>₹{payslipModal.netSalary.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', fontSize: '11px', color: '#64748b' }}>
                <div>Date of Credit: {payslipModal.date}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>Director of Operations</div>
                  <div>Golden Beauty Parlour</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
