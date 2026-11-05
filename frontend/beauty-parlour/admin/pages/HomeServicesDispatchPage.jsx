/**
 * @file HomeServicesDispatchPage.jsx
 * @description First-Class Home Service Dispatch, Staff Journey Tracking, and Delay Alerts.
 * Conforms to Sections 32, 33, 34, 35, 36, 37, 38.
 * @module frontend/src/modules/admin/pages/HomeServicesDispatchPage
 */

import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  UserX,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { homeServiceFetcher, staffFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const HomeServicesDispatchPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeServices, setActiveServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reassign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedApptForAssign, setSelectedApptForAssign] = useState(null);

  // Tracking Modal
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [liveRes, stRes] = await Promise.all([
        homeServiceFetcher.getLive({ branchId: selectedBranchId || undefined }),
        staffFetcher.list({ branchId: selectedBranchId || undefined }),
      ]);
      setActiveServices(liveRes.data || []);
      setStaffList(stRes.data || []);
    } catch (err) {
      toast.error('Failed to load active home services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  const handleReassign = async (data) => {
    try {
      await homeServiceFetcher.reassign(selectedApptForAssign._id, {
        staffId: data.staffId,
        note: data.note,
      });
      toast.success('Specialist reassigned to home visit');
      loadData();
    } catch (err) {
      toast.error('Failed to reassign specialist');
    }
  };

  const handleViewTracking = async (appointmentId) => {
    try {
      const res = await homeServiceFetcher.getTracking(appointmentId);
      setTrackingDetails(res.data);
      setTrackingModalOpen(true);
    } catch (err) {
      toast.error('Could not load live tracking timeline');
    }
  };

  const assignFields = [
    {
      name: 'staffId',
      label: 'Select Available Specialist',
      type: 'select',
      required: true,
      options: staffList.map((s) => ({ label: `${s.name} (${s.designation?.name || 'Staff'})`, value: s._id })),
    },
    { name: 'note', label: 'Dispatch Instructions', placeholder: 'e.g. Carry portable makeup ring light & vanity kit' },
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
            Scheduled: {row.scheduledTime || 'Today'}
          </div>
        </div>
      ),
    },
    {
      header: 'Client & Address',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.customer?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            {row.customerAddress || row.customer?.address || 'Client Location'}
          </div>
        </div>
      ),
    },
    {
      header: 'Service / Specialist',
      render: (row) => (
        <div>
          <div>{row.service?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-color, #ec4899)', fontWeight: 600 }}>
            {row.assignedStaff?.name || 'Unassigned'}
          </div>
        </div>
      ),
    },
    {
      header: 'Journey Stage',
      render: (row) => {
        const stage = row.homeServiceTracking?.currentStatus || row.status;
        return (
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              backgroundColor:
                stage === 'completed'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : stage === 'working' || stage === 'arrived'
                  ? 'rgba(59, 130, 246, 0.15)'
                  : stage === 'on_the_way'
                  ? 'rgba(236, 72, 153, 0.15)'
                  : 'rgba(245, 158, 11, 0.15)',
              color:
                stage === 'completed'
                  ? '#10b981'
                  : stage === 'working' || stage === 'arrived'
                  ? '#3b82f6'
                  : stage === 'on_the_way'
                  ? '#ec4899'
                  : '#f59e0b',
            }}
          >
            {stage}
          </span>
        );
      },
    },
    {
      header: 'Punctuality',
      render: (row) => (
        <div>
          {row.isLate ? (
            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle className="w-3.5 h-3.5" /> Delay: {row.delayMinutes || 15}m
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              On Time
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => handleViewTracking(row._id)}
            className="btn btn-secondary btn-sm"
            title="View Live Tracking Timeline"
          >
            <Navigation className="w-3.5 h-3.5" /> Track
          </button>
          <button
            onClick={() => {
              setSelectedApptForAssign(row);
              setAssignModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Reassign Specialist"
          >
            <UserCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Live Home Service Dispatch & Tracking
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Monitor doorstep beauty sessions, specialist transit (On the Way → Arrived → Working), and client ETA
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Feed
        </button>
      </div>

      <DataTable
        columns={columns}
        data={activeServices}
        isLoading={isLoading}
        searchPlaceholder="Search active doorstep visits..."
      />

      <FormModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Reassign Home Visit Specialist #${selectedApptForAssign?.bookingNumber || ''}`}
        fields={assignFields}
        onSubmit={handleReassign}
        submitText="Dispatch Specialist"
      />

      {/* Tracking Details Modal */}
      {trackingModalOpen && (
        <div className="modal-backdrop" onClick={() => setTrackingModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Home Service Tracking Timeline
              </h3>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700 }}>Specialist: {trackingDetails?.assignedStaff?.name || 'Assigned'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Current Status: <strong style={{ color: '#ec4899' }}>{trackingDetails?.currentStatus || 'En Route'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Assigned', time: trackingDetails?.assignedAt },
                  { label: 'Accepted by Specialist', time: trackingDetails?.acceptedAt },
                  { label: 'Specialist On The Way', time: trackingDetails?.onTheWayAt },
                  { label: 'Arrived at Customer Doorstep', time: trackingDetails?.arrivedAt },
                  { label: 'Service Started', time: trackingDetails?.startedAt },
                  { label: 'Completed', time: trackingDetails?.completedAt },
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: step.time ? '#10b981' : 'var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.65rem',
                      }}
                    >
                      ✓
                    </div>
                    <span style={{ fontWeight: 600, flex: 1 }}>{step.label}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {step.time ? new Date(step.time).toLocaleTimeString() : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setTrackingModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeServicesDispatchPage;
