/**
 * @file CustomerRequestsPage.jsx
 * @description Customer Helpdesk & Support Requests.
 * Allows submission of service queries, payment issues, complaints, and ticket tracking.
 * @module frontend/src/modules/customer/pages/CustomerRequestsPage
 */

import React, { useState, useEffect } from 'react';
import * as reqApi from '../../../services/api/customer/requestFetcher.js';

const REQUEST_TYPES = [
  { value: 'BOOKING_HELP', label: 'Booking Assistance' },
  { value: 'PAYMENT_ISSUE', label: 'Payment / Billing Query' },
  { value: 'REFUND', label: 'Refund Application' },
  { value: 'SERVICE_ISSUE', label: 'Treatment / Service Feedback' },
  { value: 'STAFF_ISSUE', label: 'Stylist / Specialist Feedback' },
  { value: 'APPOINTMENT_CHANGE', label: 'Appointment Rescheduling Help' },
  { value: 'COMPLAINT', label: 'Formal Complaint' },
  { value: 'GENERAL_SUPPORT', label: 'General Concierge Support' }
];

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'BOOKING_HELP',
    subject: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await reqApi.getRequests();
      if (res.data?.success) {
        setRequests(res.data.data?.requests || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load support requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const res = await reqApi.createRequest(formData);
      if (res.data?.success) {
        setCreateModal(false);
        setFormData({ type: 'BOOKING_HELP', subject: '', description: '', priority: 'MEDIUM' });
        setMsg({ type: 'success', text: 'Support ticket submitted successfully. Concierge will respond shortly.' });
        await loadRequests();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to submit ticket.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you wish to cancel this support request?')) return;
    try {
      await reqApi.cancelRequest(id);
      setMsg({ type: 'success', text: 'Ticket marked as cancelled.' });
      await loadRequests();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to cancel request.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Helpdesk & Concierge Tickets
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Submit tickets for booking adjustments, billing queries, complaints, and general assistance.
          </p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          + Submit New Ticket
        </button>
      </div>

      {msg.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${msg.type === 'error' ? '#ef4444' : '#10b981'}`,
          color: msg.type === 'error' ? '#ef4444' : '#10b981',
          fontSize: '0.875rem'
        }}>
          {msg.text}
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading support tickets...</div>
      ) : requests.length === 0 ? (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          <p style={{ margin: 0 }}>No active tickets. Everything looks great!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((r) => {
            const rid = r._id || r.id;
            const statusColor = r.status === 'RESOLVED' ? '#10b981' : r.status === 'CANCELLED' ? '#ef4444' : '#f59e0b';
            return (
              <div
                key={rid}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(255,255,255,0.06)',
                      color: '#cbd5e1'
                    }}>
                      {r.type?.replace(/_/g, ' ') || 'GENERAL'}
                    </span>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: `${statusColor}18`,
                      color: statusColor,
                      border: `1px solid ${statusColor}40`
                    }}>
                      {r.status || 'PENDING'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.0625rem', color: '#f8fafc', fontWeight: 700 }}>
                    {r.subject || 'Support Ticket'}
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {r.description || r.message}
                  </p>
                  {r.resolutionNotes && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontSize: '0.8125rem'
                    }}>
                      <strong>Admin Resolution:</strong> {r.resolutionNotes}
                    </div>
                  )}
                </div>

                {r.status !== 'CANCELLED' && r.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleCancel(rid)}
                    style={{
                      padding: '0.5rem 0.875rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Ticket Modal */}
      {createModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '520px'
          }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#f8fafc', fontSize: '1.25rem' }}>Submit Concierge Request</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Request Category</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                >
                  {REQUEST_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of the issue or inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Detailed Explanation</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide context, appointment ID, or relevant information..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High / Urgent</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  style={{ padding: '0.625rem 1rem', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
