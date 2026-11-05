/**
 * @file AppointmentsCalendarPage.jsx
 * @description Dynamic 13-Stage Appointment Lifecycle Management with Double-Booking Conflict Prevention.
 * Conforms to Sections 29, 30, 31.
 * @module frontend/src/modules/admin/pages/AppointmentsCalendarPage
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  XCircle,
  AlertTriangle,
  UserX,
  RefreshCw,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  appointmentFetcher,
  serviceFetcher,
  staffFetcher,
  customerFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const AppointmentsCalendarPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedApptForReschedule, setSelectedApptForReschedule] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [appRes, sRes, stRes, cRes, bRes] = await Promise.all([
        appointmentFetcher.list({
          branchId: selectedBranchId || undefined,
          status: statusFilter || undefined,
        }),
        serviceFetcher.list({ limit: 100 }),
        staffFetcher.list({ branchId: selectedBranchId || undefined }),
        customerFetcher.list({ limit: 100 }),
        branchFetcher.list(),
      ]);
      setAppointments(appRes.data || []);
      setServices(sRes.data || []);
      setStaff(stRes.data || []);
      setCustomers(cRes.data || []);
      setBranches(bRes.data || []);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, selectedBranchId]);

  const handleCreateBooking = async (data) => {
    try {
      await appointmentFetcher.create({
        ...data,
        branch: data.branch || selectedBranchId || branches[0]?._id,
      });
      toast.success('Appointment scheduled successfully');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handleAction = async (actionFn, apptId, label) => {
    try {
      await actionFn(apptId);
      toast.success(`Appointment: ${label}`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${label.toLowerCase()}`);
    }
  };

  const handleReschedule = async (data) => {
    try {
      await appointmentFetcher.reschedule(selectedApptForReschedule._id, {
        date: data.date,
        scheduledTime: data.scheduledTime,
      });
      toast.success('Appointment rescheduled');
      loadData();
    } catch (err) {
      toast.error('Rescheduling failed');
    }
  };

  const bookingFields = [
    {
      name: 'customerId',
      label: 'Select Client',
      type: 'select',
      required: true,
      options: customers.map((c) => ({ label: `${c.name} (${c.phone})`, value: c._id })),
    },
    {
      name: 'serviceId',
      label: 'Select Service',
      type: 'select',
      required: true,
      options: services.map((s) => ({ label: `${s.name} - ₹${s.price} (${s.duration}m)`, value: s._id })),
    },
    {
      name: 'staffId',
      label: 'Assign Specialist (Optional)',
      type: 'select',
      options: staff.map((st) => ({ label: st.name, value: st._id })),
    },
    {
      name: 'branch',
      label: 'Salon Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
    { name: 'date', label: 'Appointment Date', type: 'date', required: true },
    { name: 'scheduledTime', label: 'Scheduled Time', type: 'time', required: true },
    {
      name: 'serviceMode',
      label: 'Service Mode',
      type: 'select',
      defaultValue: 'SALON',
      options: [
        { label: 'Salon Visit', value: 'SALON' },
        { label: 'Home Service Dispatch', value: 'HOME' },
      ],
    },
    { name: 'notes', label: 'Client / Booking Notes', type: 'textarea', span: 2 },
  ];

  const rescheduleFields = [
    { name: 'date', label: 'New Date', type: 'date', required: true },
    { name: 'scheduledTime', label: 'New Time', type: 'time', required: true },
  ];

  const columns = [
    {
      header: 'Booking #',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            #{row.bookingNumber || row._id.slice(-6).toUpperCase()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {new Date(row.date).toLocaleDateString()} · {row.scheduledTime}
          </div>
        </div>
      ),
    },
    {
      header: 'Client',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customer?.name || 'Walk-in'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.customer?.phone}</div>
        </div>
      ),
    },
    {
      header: 'Service / Mode',
      render: (row) => (
        <div>
          <div>{row.service?.name || 'Package Service'}</div>
          <div style={{ fontSize: '0.75rem', color: row.serviceMode === 'HOME' ? '#ec4899' : '#3b82f6', fontWeight: 600 }}>
            {row.serviceMode === 'HOME' ? 'Home Service Dispatch' : 'In-Salon Appointment'}
          </div>
        </div>
      ),
    },
    {
      header: 'Specialist',
      render: (row) => row.assignedStaff?.name || 'Unassigned',
    },
    {
      header: '13-Stage Status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor:
              row.status === 'completed'
                ? 'rgba(16, 185, 129, 0.15)'
                : row.status === 'working'
                ? 'rgba(59, 130, 246, 0.15)'
                : row.status === 'cancelled' || row.status === 'no_show'
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(245, 158, 11, 0.15)',
            color:
              row.status === 'completed'
                ? '#10b981'
                : row.status === 'working'
                ? '#3b82f6'
                : row.status === 'cancelled' || row.status === 'no_show'
                ? '#ef4444'
                : '#f59e0b',
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Lifecycle Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {row.status === 'pending' && (
            <button
              onClick={() => handleAction(appointmentFetcher.confirm, row._id, 'Confirmed')}
              className="btn btn-secondary btn-sm"
              title="Confirm"
            >
              Confirm
            </button>
          )}
          {row.status === 'confirmed' && (
            <button
              onClick={() => handleAction(appointmentFetcher.checkIn, row._id, 'Checked In')}
              className="btn btn-secondary btn-sm"
              title="Check In"
            >
              Check In
            </button>
          )}
          {['confirmed', 'checked_in', 'arrived'].includes(row.status) && (
            <button
              onClick={() => handleAction(appointmentFetcher.start, row._id, 'Working')}
              className="btn btn-primary btn-sm"
              title="Start"
            >
              <Play className="w-3 h-3" />
            </button>
          )}
          {row.status === 'working' && (
            <>
              <button
                onClick={() => handleAction(appointmentFetcher.pause, row._id, 'Paused')}
                className="btn btn-secondary btn-sm"
                title="Pause"
              >
                <Pause className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleAction(appointmentFetcher.complete, row._id, 'Completed')}
                className="btn btn-primary btn-sm"
                style={{ background: '#10b981', borderColor: '#10b981' }}
                title="Complete"
              >
                <CheckCircle className="w-3 h-3" />
              </button>
            </>
          )}
          {row.status === 'paused' && (
            <button
              onClick={() => handleAction(appointmentFetcher.resume, row._id, 'Resumed')}
              className="btn btn-primary btn-sm"
              title="Resume"
            >
              <Play className="w-3 h-3" />
            </button>
          )}
          {!['completed', 'cancelled', 'no_show'].includes(row.status) && (
            <>
              <button
                onClick={() => {
                  setSelectedApptForReschedule(row);
                  setRescheduleModalOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                title="Reschedule"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleAction(appointmentFetcher.cancel, row._id, 'Cancelled')}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444' }}
                title="Cancel"
              >
                <XCircle className="w-3 h-3" />
              </button>
            </>
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
            Appointment Calendar & Lifecycle Queue
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Schedule walk-ins, online appointments, and monitor the 13-stage service lifecycle
          </p>
        </div>
        <button
          onClick={() => setBookingModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      <DataTable
        columns={columns}
        data={appointments}
        isLoading={isLoading}
        searchPlaceholder="Search by booking #, client, specialist..."
        filters={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="working">Working / In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        }
      />

      <FormModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Schedule Client Appointment"
        fields={bookingFields}
        onSubmit={handleCreateBooking}
        submitText="Confirm Booking"
        size="large"
      />

      <FormModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title={`Reschedule Booking #${selectedApptForReschedule?.bookingNumber || ''}`}
        fields={rescheduleFields}
        onSubmit={handleReschedule}
        submitText="Update Appointment Time"
      />
    </div>
  );
};

export default AppointmentsCalendarPage;
