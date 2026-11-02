/**
 * @file CustomerAppointmentsPage.jsx
 * @description Customer Appointments Hub & Status Filtering.
 * Supports lifecycle transitions, rescheduling, cancellation modals, and rebooking.
 * @module frontend/src/modules/customer/pages/CustomerAppointmentsPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as aptApi from '../../../services/api/customer/appointmentFetcher.js';

export default function CustomerAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ newDate: '', newStartTime: '11:00' });
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('Personal scheduling conflict');

  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await aptApi.getAppointments();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.appointments || []);
      setAppointments(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleModal) return;
    setActionLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await aptApi.rescheduleAppointment(rescheduleModal._id, rescheduleForm);
      setMsg({ type: 'success', text: 'Appointment rescheduled successfully!' });
      setRescheduleModal(null);
      await loadAppointments();
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Failed to reschedule appointment.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModal) return;
    setActionLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await aptApi.cancelAppointment(cancelModal._id, { reason: cancelReason });
      setMsg({ type: 'success', text: 'Appointment has been cancelled.' });
      setCancelModal(null);
      await loadAppointments();
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Failed to cancel appointment.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRebook = async (aptId) => {
    setActionLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const res = await aptApi.rebookAppointment(aptId, {
        date: tomorrow.toISOString().split('T')[0],
        scheduledStartTime: '12:00',
      });
      setMsg({ type: 'success', text: 'Service rebooked successfully for tomorrow!' });
      await loadAppointments();
      navigate(`/customer/appointments/${res?.data?._id}`);
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Rebooking failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = appointments.filter((a) => {
    if (activeTab === 'UPCOMING') return !['completed', 'cancelled', 'no_show'].includes(a.status);
    if (activeTab === 'COMPLETED') return a.status === 'completed';
    if (activeTab === 'CANCELLED') return a.status === 'cancelled';
    return true;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
            My Appointments
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Manage upcoming bookings, reschedule sessions, or rebook previous treatments.
          </p>
        </div>
        <NavLink
          to="/customer/book"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}
        >
          + Book New Appointment
        </NavLink>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '13.5px', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: msg.type === 'success' ? '#34d399' : '#f87171' }}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading appointments...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', color: '#94a3b8' }}>
          No appointments found in this view.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((apt) => {
            const isCompleted = apt.status === 'completed';
            const isCancelled = apt.status === 'cancelled';
            const isPendingOrConfirmed = !isCompleted && !isCancelled;

            return (
              <div
                key={apt._id}
                style={{
                  background: 'rgba(17, 24, 39, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isCancelled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: isCompleted ? '#10b981' : isCancelled ? '#ef4444' : '#38bdf8', padding: '3px 10px', borderRadius: '6px' }}>
                      {apt.status?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>#{apt.appointmentNumber}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>• {apt.serviceMode || 'IN_BRANCH'}</span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                    {apt.services?.[0]?.name || apt.packages?.[0]?.name || 'Beauty Treatment'}
                  </h3>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#cbd5e1' }}>
                    <span>🗓️ {apt.date}</span>
                    <span>⏰ {apt.scheduledStartTime}</span>
                    <span>📍 {apt.branchId?.name || 'Central Salon'}</span>
                    {apt.staffId && <span>👤 {apt.staffId.name}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Amount</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>₹{apt.totalAmount}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {isPendingOrConfirmed && (
                      <button
                        onClick={() => navigate(`/customer/appointments/${apt._id}/tracking`)}
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        📍 Track Service
                      </button>
                    )}

                    {isPendingOrConfirmed && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setRescheduleModal(apt);
                            setRescheduleForm({ newDate: apt.date, newStartTime: apt.scheduledStartTime });
                          }}
                          style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => setCancelModal(apt)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {isCompleted && (
                      <button
                        onClick={() => handleRebook(apt._id)}
                        disabled={actionLoading}
                        style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🔄 Rebook Service
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/customer/appointments/${apt._id}`)}
                      style={{ background: 'transparent', color: '#94a3b8', border: 'none', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '100%', maxWidth: '420px', background: '#111827', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>
              Reschedule Appointment #{rescheduleModal.appointmentNumber}
            </h3>
            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>New Date *</label>
                <input
                  type="date"
                  required
                  value={rescheduleForm.newDate}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>New Start Time *</label>
                <select
                  value={rescheduleForm.newStartTime}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, newStartTime: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                >
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRescheduleModal(null)}
                  style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {actionLoading ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '100%', maxWidth: '420px', background: '#111827', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: '0 0 10px' }}>
              Cancel Appointment #{cancelModal.appointmentNumber}
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
              Are you sure? Review our cancellation policy. If payment was made online, you may file a refund request.
            </p>
            <form onSubmit={handleCancelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Reason for Cancellation</label>
                <input
                  type="text"
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCancelModal(null)}
                  style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Nevermind
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
