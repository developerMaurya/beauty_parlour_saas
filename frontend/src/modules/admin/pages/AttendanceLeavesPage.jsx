/**
 * @file AttendanceLeavesPage.jsx
 * @description Staff Attendance, Leave Approvals/Rejections, and Salon Holidays Calendar.
 * Conforms to Sections 11, 12, 13.
 * @module frontend/src/modules/admin/pages/AttendanceLeavesPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Clock, Calendar, Palmtree, UserCheck, CheckCircle2 } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  attendanceFetcher,
  leaveFetcher,
  holidayFetcher,
  staffFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const AttendanceLeavesPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'leaves' | 'holidays'

  const [attendanceList, setAttendanceList] = useState([]);
  const [leavesList, setLeavesList] = useState([]);
  const [holidaysList, setHolidaysList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stRes, brRes] = await Promise.all([
        staffFetcher.list({ branchId: selectedBranchId || undefined }),
        branchFetcher.list(),
      ]);
      setStaffList(stRes.data || []);
      setBranches(brRes.data || []);

      if (activeTab === 'attendance') {
        const attRes = await attendanceFetcher.list({ branchId: selectedBranchId || undefined });
        setAttendanceList(attRes.data || []);
      } else if (activeTab === 'leaves') {
        const lRes = await leaveFetcher.list({ branchId: selectedBranchId || undefined });
        setLeavesList(lRes.data || []);
      } else {
        const hRes = await holidayFetcher.list({ branchId: selectedBranchId || undefined });
        setHolidaysList(hRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load HR data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedBranchId]);

  const handleCheckIn = async (data) => {
    try {
      await attendanceFetcher.checkIn(data);
      toast.success('Staff check-in recorded');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      await attendanceFetcher.checkOut({ attendanceId });
      toast.success('Staff checked out');
      loadData();
    } catch (err) {
      toast.error('Check-out failed');
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await leaveFetcher.approve(leaveId);
      toast.success('Leave request approved');
      loadData();
    } catch (err) {
      toast.error('Could not approve leave');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (!reason) return;
    try {
      await leaveFetcher.reject(leaveId, { reason });
      toast.success('Leave request rejected');
      loadData();
    } catch (err) {
      toast.error('Could not reject leave');
    }
  };

  const handleAddHoliday = async (data) => {
    try {
      await holidayFetcher.create(data);
      toast.success('Holiday created');
      loadData();
    } catch (err) {
      toast.error('Could not create holiday');
    }
  };

  const checkInFields = [
    {
      name: 'staffId',
      label: 'Staff Member',
      type: 'select',
      required: true,
      options: staffList.map((s) => ({ label: `${s.name} (${s.employeeId || s.phone})`, value: s._id })),
    },
    { name: 'notes', label: 'Check-In Notes', placeholder: 'e.g. Assigned to Station 2' },
  ];

  const holidayFields = [
    { name: 'name', label: 'Holiday Title', required: true, placeholder: 'e.g. Diwali Festival, New Year' },
    { name: 'date', label: 'Holiday Date', type: 'date', required: true },
    {
      name: 'branchId',
      label: 'Applicable Branch',
      type: 'select',
      options: [{ label: 'All Branches', value: '' }, ...branches.map((b) => ({ label: b.name, value: b._id }))],
    },
    { name: 'description', label: 'Holiday Description', type: 'textarea' },
  ];

  const attendanceColumns = [
    {
      header: 'Staff Member',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.staff?.name || 'Staff'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Date: {row.date ? new Date(row.date).toLocaleDateString() : 'Today'}
          </div>
        </div>
      ),
    },
    {
      header: 'Check In',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.85rem' }}>
            {row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
          </div>
          {row.lateMinutes > 0 && (
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
              {row.lateMinutes} mins late
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Check Out',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'On Duty'}
        </span>
      ),
    },
    {
      header: 'Hours Worked',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {row.workingHours ? `${row.workingHours.toFixed(1)} hrs` : 'In Progress'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            background:
              row.status === 'present'
                ? 'rgba(16, 185, 129, 0.15)'
                : row.status === 'late'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            color:
              row.status === 'present'
                ? '#10b981'
                : row.status === 'late'
                ? '#f59e0b'
                : '#ef4444',
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div>
          {!row.checkOut && (
            <button
              onClick={() => handleCheckOut(row._id)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Clock className="w-3.5 h-3.5" /> Check Out
            </button>
          )}
        </div>
      ),
    },
  ];

  const leaveColumns = [
    {
      header: 'Staff Member',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.staff?.name || 'Staff'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: {row.leaveType || 'General'}</div>
        </div>
      ),
    },
    {
      header: 'Duration',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div>From: {new Date(row.startDate).toLocaleDateString()}</div>
          <div>To: {new Date(row.endDate).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => <span style={{ fontSize: '0.85rem' }}>{row.reason || 'Personal'}</span>,
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            background:
              row.status === 'approved'
                ? 'rgba(16, 185, 129, 0.15)'
                : row.status === 'rejected'
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(245, 158, 11, 0.15)',
            color:
              row.status === 'approved'
                ? '#10b981'
                : row.status === 'rejected'
                ? '#ef4444'
                : '#f59e0b',
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApproveLeave(row._id)}
                className="btn btn-primary btn-sm"
                style={{ background: '#10b981', borderColor: '#10b981' }}
                title="Approve"
              >
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => handleRejectLeave(row._id)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444' }}
                title="Reject"
              >
                <X className="w-3.5 h-3.5" /> Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const holidayColumns = [
    {
      header: 'Holiday Name',
      accessor: 'name',
      render: (row) => (
        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
      ),
    },
    {
      header: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
    },
    {
      header: 'Branch Scope',
      render: (row) => row.branch?.name || 'All Branches',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Attendance, Leaves & Holidays
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track daily staff check-ins, approve leave requests, and manage salon holidays
          </p>
        </div>
        <div>
          {activeTab === 'attendance' && (
            <button
              onClick={() => setCheckInModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <UserCheck className="w-4 h-4" /> Record Check-In
            </button>
          )}
          {activeTab === 'holidays' && (
            <button
              onClick={() => setHolidayModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Declare Holiday
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Clock className="w-4 h-4" /> Daily Attendance
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Calendar className="w-4 h-4" /> Leave Approvals
        </button>
        <button
          onClick={() => setActiveTab('holidays')}
          className={`btn ${activeTab === 'holidays' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Palmtree className="w-4 h-4" /> Salon Holidays
        </button>
      </div>

      {activeTab === 'attendance' && (
        <DataTable
          columns={attendanceColumns}
          data={attendanceList}
          isLoading={isLoading}
          searchPlaceholder="Search attendance records..."
        />
      )}

      {activeTab === 'leaves' && (
        <DataTable
          columns={leaveColumns}
          data={leavesList}
          isLoading={isLoading}
          searchPlaceholder="Search leave requests..."
        />
      )}

      {activeTab === 'holidays' && (
        <DataTable
          columns={holidayColumns}
          data={holidaysList}
          isLoading={isLoading}
          searchPlaceholder="Search holidays..."
        />
      )}

      <FormModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        title="Record Staff Attendance"
        fields={checkInFields}
        onSubmit={handleCheckIn}
        submitText="Check In"
      />

      <FormModal
        isOpen={holidayModalOpen}
        onClose={() => setHolidayModalOpen(false)}
        title="Declare Salon Holiday"
        fields={holidayFields}
        onSubmit={handleAddHoliday}
        submitText="Save Holiday"
      />
    </div>
  );
};

export default AttendanceLeavesPage;
