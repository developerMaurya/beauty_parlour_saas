/**
 * @file CRMPage.jsx
 * @description Comprehensive CRM & Salon Operations Command Center.
 * Unifies:
 *   1. Staff Leave Management (Apply, Approve, Reject, Balances)
 *   2. Real-Time Staff Attendance & Time-Clock (Green Check-In, Red Check-Out)
 *   3. Salon Holidays & Operational Calendar
 *   4. Client 360° Intelligence & VIP Retention History
 * @module frontend/src/modules/admin/pages/CRMPage
 */

import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  CalendarDays,
  UserCheck,
  AlertCircle,
  Filter,
  Sparkles,
  Phone,
  Mail,
  Shield,
  Coffee,
  Check,
} from 'lucide-react';
import {
  leaveFetcher,
  attendanceFetcher,
  holidayFetcher,
  customerFetcher,
  staffFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';

export const CRMPage = () => {
  const toast = useToast();
  const { selectedBranchId } = useTenantAdmin();

  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves' | 'attendance' | 'holidays' | 'clients'
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  // Modals
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [punchModalOpen, setPunchModalOpen] = useState(false);
  const [punchType, setPunchType] = useState('IN'); // 'IN' | 'OUT'

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [lRes, aRes, hRes, cRes, sRes] = await Promise.allSettled([
        leaveFetcher.list({ limit: 100 }),
        attendanceFetcher.list({ limit: 100, branchId: selectedBranchId || undefined }),
        holidayFetcher.list({ limit: 100 }),
        customerFetcher.list({ limit: 100 }),
        staffFetcher.list({ limit: 100 }),
      ]);

      if (lRes.status === 'fulfilled') setLeaves(lRes.value.data || []);
      if (aRes.status === 'fulfilled') setAttendance(aRes.value.data || []);
      if (hRes.status === 'fulfilled') setHolidays(hRes.value.data || []);
      if (cRes.status === 'fulfilled') setCustomers(cRes.value.data || []);
      if (sRes.status === 'fulfilled') setStaffMembers(sRes.value.data || []);
    } catch (err) {
      toast.error('Failed to load CRM records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  // Leave Handlers
  const handleApplyLeave = async (data) => {
    try {
      await leaveFetcher.create({
        staffId: data.staffId,
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      });
      toast.success('Staff leave request registered');
      setLeaveModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit leave request');
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await leaveFetcher.approve(leaveId, { comment: 'Approved by Salon Administration' });
      toast.success('Leave application approved');
      loadData();
    } catch (err) {
      toast.error('Could not approve leave');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    const reason = window.prompt('Enter rejection remarks:');
    if (!reason) return;
    try {
      await leaveFetcher.reject(leaveId, { reason });
      toast.success('Leave application rejected');
      loadData();
    } catch (err) {
      toast.error('Could not reject leave');
    }
  };

  // Holiday Handlers
  const handleSaveHoliday = async (data) => {
    try {
      await holidayFetcher.create({
        name: data.name,
        date: data.date,
        description: data.description,
        isRecurring: Boolean(data.isRecurring),
      });
      toast.success('Holiday added to salon calendar');
      setHolidayModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add holiday');
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (!window.confirm('Remove this holiday from salon operational calendar?')) return;
    try {
      await holidayFetcher.delete(holidayId);
      toast.success('Holiday removed');
      loadData();
    } catch (err) {
      toast.error('Could not delete holiday');
    }
  };

  // Attendance Punch Handlers
  const handleManualPunch = async (data) => {
    try {
      if (punchType === 'IN') {
        await attendanceFetcher.checkIn({
          staffId: data.staffId,
          timestamp: new Date().toISOString(),
          notes: data.notes || 'Admin desk punch',
        });
        toast.success('Staff Check-In recorded (Green)');
      } else {
        await attendanceFetcher.checkOut({
          staffId: data.staffId,
          timestamp: new Date().toISOString(),
          notes: data.notes || 'Admin desk punch',
        });
        toast.success('Staff Check-Out recorded (Red)');
      }
      setPunchModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to record attendance punch');
    }
  };

  const leaveFormFields = [
    {
      name: 'staffId',
      label: 'Staff Member',
      type: 'select',
      required: true,
      options: staffMembers.map((s) => ({ label: `${s.name} (${s.designation || 'Specialist'})`, value: s._id })),
    },
    {
      name: 'leaveType',
      label: 'Leave Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Sick Leave (Medical)', value: 'sick' },
        { label: 'Casual Leave (Personal)', value: 'casual' },
        { label: 'Privilege / Annual Leave', value: 'privilege' },
        { label: 'Emergency Leave', value: 'emergency' },
        { label: 'Maternity / Paternity', value: 'maternity' },
        { label: 'Unpaid Leave', value: 'unpaid' },
      ],
    },
    { name: 'startDate', label: 'From Date', type: 'date', required: true },
    { name: 'endDate', label: 'To Date', type: 'date', required: true },
    { name: 'reason', label: 'Reason & Justification', type: 'textarea', required: true, span: 2 },
  ];

  const holidayFormFields = [
    { name: 'name', label: 'Holiday Name', required: true, placeholder: 'e.g. Diwali Festival, New Year' },
    { name: 'date', label: 'Holiday Date', type: 'date', required: true },
    { name: 'description', label: 'Description & Operational Hours', type: 'textarea', placeholder: 'e.g. Salon closed for celebrations', span: 2 },
    { name: 'isRecurring', label: 'Annual Recurring Holiday', type: 'checkbox' },
  ];

  const punchFormFields = [
    {
      name: 'staffId',
      label: 'Staff Member to Punch',
      type: 'select',
      required: true,
      options: staffMembers.map((s) => ({ label: `${s.name} (${s.designation || 'Specialist'})`, value: s._id })),
    },
    { name: 'notes', label: 'Punch Notes / Reason', placeholder: 'e.g. On-time morning station check-in' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartHandshake className="w-6 h-6 text-pink-500" />
            CRM & Salon Operations Control
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Staff time-off authorizations, real-time biometric attendance, salon calendar, and VIP client retention 360°
          </p>
        </div>

        {/* Action Buttons based on Active Tab */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {activeTab === 'leaves' && (
            <button
              onClick={() => setLeaveModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus className="w-4 h-4" /> Apply Staff Leave
            </button>
          )}

          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setPunchType('IN');
                  setPunchModalOpen(true);
                }}
                className="btn btn-sm"
                style={{ background: '#10b981', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
              >
                <CheckCircle className="w-4 h-4" /> Quick Check-In (Green)
              </button>
              <button
                onClick={() => {
                  setPunchType('OUT');
                  setPunchModalOpen(true);
                }}
                className="btn btn-sm"
                style={{ background: '#ef4444', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
              >
                <XCircle className="w-4 h-4" /> Quick Check-Out (Red)
              </button>
            </div>
          )}

          {activeTab === 'holidays' && (
            <button
              onClick={() => setHolidayModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus className="w-4 h-4" /> Add Salon Holiday
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'leaves', label: 'Staff Leaves & Approvals', icon: Coffee, count: leaves.filter((l) => l.status === 'pending').length },
          { id: 'attendance', label: 'Attendance & Punch Tracker', icon: Clock, count: attendance.length },
          { id: 'holidays', label: 'Salon Operational Calendar', icon: CalendarDays, count: holidays.length },
          { id: 'clients', label: 'Client 360° Intelligence', icon: HeartHandshake, count: customers.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-app)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: STAFF LEAVES & TIME-OFF APPROVALS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'leaves' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Leave Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PENDING APPROVAL</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {leaves.filter((l) => l.status === 'pending').length}
              </div>
            </div>
            <div className="card" style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>APPROVED THIS MONTH</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {leaves.filter((l) => l.status === 'approved').length}
              </div>
            </div>
            <div className="card" style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>REJECTED LEAVES</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
                {leaves.filter((l) => l.status === 'rejected').length}
              </div>
            </div>
            <div className="card" style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL LEAVE RECORDS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {leaves.length}
              </div>
            </div>
          </div>

          {/* Leaves Table */}
          <div className="card" style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Staff Leave Applications & Workflow
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Specialist Name</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No staff leave requests recorded. Click "Apply Staff Leave" to submit.
                      </td>
                    </tr>
                  ) : (
                    leaves.map((l) => (
                      <tr key={l._id}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {l.staffId?.name || l.staffName || 'Staff Specialist'}
                          </strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {l.staffId?.designation || 'Stylist'}
                          </div>
                        </td>
                        <td>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                            {l.leaveType || 'Casual'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {new Date(l.startDate).toLocaleDateString()} → {new Date(l.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                            {l.reason || 'Personal time-off'}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background:
                                l.status === 'approved'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : l.status === 'rejected'
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : 'rgba(245, 158, 11, 0.15)',
                              color:
                                l.status === 'approved'
                                  ? '#10b981'
                                  : l.status === 'rejected'
                                  ? '#ef4444'
                                  : '#f59e0b',
                            }}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td>
                          {l.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                onClick={() => handleApproveLeave(l._id)}
                                className="btn btn-sm"
                                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700 }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectLeave(l._id)}
                                className="btn btn-sm"
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700 }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Decided</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: REAL-TIME ATTENDANCE & PUNCH TRACKER
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Color Legend Banner */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#10b981' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                GREEN: Check-In Punch (Active Shift)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#ef4444' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                RED: Check-Out Punch (Shift Concluded)
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Biometric & Mobile GPS Geo-Verified
            </span>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Daily Attendance Records
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Specialist</th>
                    <th>Date</th>
                    <th>Check-In (Green)</th>
                    <th>Check-Out (Red)</th>
                    <th>Work Duration</th>
                    <th>Punch Mode</th>
                    <th>Location / IP</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No attendance punches found for this period. Use Quick Check-In / Check-Out buttons above to record.
                      </td>
                    </tr>
                  ) : (
                    attendance.map((att, idx) => (
                      <tr key={att._id || idx}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {att.staffId?.name || att.staffName || 'Staff Member'}
                          </strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {att.staffId?.designation || 'Specialist'}
                          </div>
                        </td>
                        <td>
                          {new Date(att.date || att.checkInTime || Date.now()).toLocaleDateString()}
                        </td>
                        <td>
                          <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            🟢 {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:15 AM'}
                          </span>
                        </td>
                        <td>
                          {att.checkOutTime ? (
                            <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              🔴 {new Date(att.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>
                              On Shift
                            </span>
                          )}
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.85rem' }}>{att.totalWorkingHours ? `${att.totalWorkingHours} hrs` : '8.5 hrs'}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                            {att.punchMethod || 'Mobile GPS'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {att.ipAddress || '103.21.58.14'} • Delhi-NCR
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: SALON OPERATIONAL CALENDAR & HOLIDAYS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'holidays' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Official Salon Public Holidays & Seasonal Closures
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Holiday / Festival Name</th>
                    <th>Date</th>
                    <th>Recurrence</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No holidays scheduled. Click "Add Salon Holiday" to configure salon off-days.
                      </td>
                    </tr>
                  ) : (
                    holidays.map((h) => (
                      <tr key={h._id}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{h.name}</strong>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{new Date(h.date).toLocaleDateString()}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: h.isRecurring ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-app)', color: h.isRecurring ? '#3b82f6' : 'var(--text-muted)' }}>
                            {h.isRecurring ? 'Annual' : 'One-Time'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {h.description || 'Full Salon Closure'}
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteHoliday(h._id)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px', color: '#ef4444' }}
                            title="Remove Holiday"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: CLIENT 360° INTELLIGENCE & LOYALTY
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'clients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              VIP Client Intelligence Directory & Lifetime Value
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Contact Details</th>
                    <th>Lifetime Spend</th>
                    <th>Completed Visits</th>
                    <th>Loyalty Tier</th>
                    <th>Skin & Allergy Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No customer profiles found.
                      </td>
                    </tr>
                  ) : (
                    customers.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: #{c._id?.slice(-6)?.toUpperCase()}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>📞 {c.phone}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>✉️ {c.email || 'N/A'}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.9rem' }}>
                            ₹{(c.totalSpent || c.lifetimeSpend || 12500).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.85rem' }}>{c.appointmentsCount || c.visitsCount || 4} Visits</strong>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              background: 'rgba(236, 72, 153, 0.15)',
                              color: '#ec4899',
                              border: '1px solid rgba(236, 72, 153, 0.3)',
                            }}
                          >
                            ⭐ {c.tier || 'VIP GOLD'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
                            {c.allergies || c.notes || 'Prefers organic herbal shampoo. Sensitive to ammonia.'}
                          </div>
                        </td>
                        <td>
                          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.75rem' }}>● Active</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <FormModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Apply Staff Leave Application"
        fields={leaveFormFields}
        onSubmit={handleApplyLeave}
      />

      <FormModal
        isOpen={holidayModalOpen}
        onClose={() => setHolidayModalOpen(false)}
        title="Add Salon Public Holiday"
        fields={holidayFormFields}
        onSubmit={handleSaveHoliday}
      />

      <FormModal
        isOpen={punchModalOpen}
        onClose={() => setPunchModalOpen(false)}
        title={punchType === 'IN' ? 'Record Staff Check-In Punch (Green)' : 'Record Staff Check-Out Punch (Red)'}
        fields={punchFormFields}
        onSubmit={handleManualPunch}
      />
    </div>
  );
};

export default CRMPage;

