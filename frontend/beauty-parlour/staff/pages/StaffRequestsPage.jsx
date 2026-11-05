/**
 * @file StaffRequestsPage.jsx
 * @description Unified Reusable Staff Request Portal for 14 operational request types.
 * Conforms to Phase 05 Section 34.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import * as reqApi from '../../../services/api/staff/requestFetcher.js';

export default function StaffRequestsPage() {
  const { success, error: toastError } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Submit Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'general_request',
    subject: '',
    description: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);

  const requestTypes = [
    { value: 'leave', label: 'Leave Application' },
    { value: 'attendance_correction', label: 'Attendance Timing Correction' },
    { value: 'skill_update', label: 'Skill / Specialization Update' },
    { value: 'document_update', label: 'Official Document Update' },
    { value: 'certificate', label: 'Certification Verification' },
    { value: 'salary_issue', label: 'Salary / Compensation Query' },
    { value: 'payment_issue', label: 'Payment / Tip Discrepancy' },
    { value: 'inventory_request', label: 'Stock / Product Replenishment' },
    { value: 'service_request', label: 'New Service Authorization' },
    { value: 'additional_work', label: 'Additional Work / Overtime' },
    { value: 'branch_transfer', label: 'Branch Transfer Request' },
    { value: 'schedule_change', label: 'Work Shift / Roster Adjustment' },
    { value: 'holiday_request', label: 'Holiday Roster Exchange' },
    { value: 'general_request', label: 'General Administrative Request' },
  ];

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reqApi.getRequests({
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      });
      if (res?.data) {
        setRequests(Array.isArray(res.data) ? res.data : res.data.requests || []);
      }
    } catch (err) {
      console.warn('Requests fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await reqApi.createRequest(formData);
      success('Operational request dispatched to Management!');
      setShowModal(false);
      setFormData({ type: 'general_request', subject: '', description: '', priority: 'medium' });
      loadRequests();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this request?')) return;
    try {
      await reqApi.cancelRequest(id);
      success('Request cancelled.');
      loadRequests();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📬</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Specialist Request Desk
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Submit tickets for branch transfers, shift exchanges, salary issues, and salon supplies
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#fff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '13.5px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)',
          }}
        >
          + Submit New Request
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
          }}
        >
          <option value="">All 14 Request Categories</option>
          {requestTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Requests List */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📬</div>
            <p style={{ margin: 0, fontSize: '14.5px' }}>No requests submitted under this view.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((r) => (
              <div
                key={r._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '18px 22px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }}>
                      {r.subject || r.type?.replace(/_/g, ' ')?.toUpperCase()}
                    </span>
                    <span style={priorityBadgeStyle(r.priority)}>{r.priority || 'NORMAL'}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
                    {r.description}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                    Category: <strong>{r.type?.replace(/_/g, ' ')}</strong> • Submitted:{' '}
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={statusBadgeStyle(r.status)}>{r.status}</span>
                  {r.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(r._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f87171',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Request Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Submit Operational Request</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Request Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  style={inputStyle}
                >
                  {requestTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  required
                  placeholder="e.g. Relocation request to Downtown Branch"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Detailed Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  required
                  placeholder="Provide comprehensive details for management review..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={btnPrimaryStyle}>
                  {submitting ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '10px',
  color: '#fff',
  fontSize: '13px',
  marginTop: '4px',
  boxSizing: 'border-box',
};

const btnPrimaryStyle = {
  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
};

const btnCancelStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '20px',
};

const modalContentStyle = {
  background: '#1e293b',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '16px',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
};

const priorityBadgeStyle = (priority) => ({
  background: priority === 'urgent' || priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
  color: priority === 'urgent' || priority === 'high' ? '#f87171' : '#60a5fa',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '10.5px',
  fontWeight: '700',
  textTransform: 'uppercase',
});

const statusBadgeStyle = (status) => ({
  background:
    status === 'approved' || status === 'completed'
      ? 'rgba(16, 185, 129, 0.2)'
      : status === 'rejected' || status === 'cancelled'
      ? 'rgba(239, 68, 68, 0.2)'
      : 'rgba(245, 158, 11, 0.2)',
  color:
    status === 'approved' || status === 'completed'
      ? '#34d399'
      : status === 'rejected' || status === 'cancelled'
      ? '#f87171'
      : '#fbbf24',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
