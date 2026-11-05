/**
 * @file StaffAppointmentDetailPage.jsx
 * @description Comprehensive Appointment Details, Notes & Lifecycle for Staff.
 * Conforms to Phase 05 Section 12 & 13.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as apptApi from '../../../services/api/staff/appointmentFetcher.js';
import * as crmApi from '../../../services/api/staff/customerFetcher.js';

export default function StaffAppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await apptApi.getAppointment(id);
      if (res?.data) {
        setAppointment(res.data);
      }
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDetails();
  }, [id]);

  const handleAction = async (action) => {
    try {
      setActionLoading(true);
      if (action === 'check-in') await apptApi.checkInAppointment(id);
      else if (action === 'start') await apptApi.startAppointment(id);
      else if (action === 'pause') await apptApi.pauseAppointment(id);
      else if (action === 'resume') await apptApi.resumeAppointment(id);
      else if (action === 'complete') await apptApi.completeAppointment(id);
      else if (action === 'cancel-request') {
        const reason = window.prompt('Reason for cancellation request:');
        if (!reason) return;
        await apptApi.cancelAppointmentRequest(id, reason);
      }
      success(`Status updated: ${action}`);
      await loadDetails();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !appointment?.customer?._id) return;

    try {
      setAddingNote(true);
      await crmApi.addCustomerNote(appointment.customer._id, {
        note: newNote,
        category: 'appointment_note',
      });
      success('Professional service note recorded for client!');
      setNewNote('');
      await loadDetails();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading appointment details...</div>;
  }

  if (!appointment) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#cbd5e1' }}>
        <h2>Appointment not found</h2>
        <button onClick={() => navigate('/staff/appointments')} style={btnSecondaryStyle}>
          Back to Appointments
        </button>
      </div>
    );
  }

  const a = appointment;
  const c = a.customer || {};
  const s = a.service || {};

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
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
          <button onClick={() => navigate('/staff/appointments')} style={backLinkStyle}>
            ← Back to Appointments
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Appointment #{a._id?.slice(-6)?.toUpperCase()}
            </h1>
            <span style={statusBadgeStyle(a.status)}>{a.status}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Scheduled for {a.date ? new Date(a.date).toLocaleDateString() : 'Date'} at {a.scheduledTime || 'Slot'}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {a.status === 'confirmed' && (
            <button onClick={() => handleAction('check-in')} disabled={actionLoading} style={actionBtnStyle('#f59e0b')}>
              Check In Client
            </button>
          )}
          {a.status === 'checked_in' && (
            <button onClick={() => handleAction('start')} disabled={actionLoading} style={actionBtnStyle('#ec4899')}>
              Start Service
            </button>
          )}
          {a.status === 'working' && (
            <>
              <button onClick={() => handleAction('pause')} disabled={actionLoading} style={actionBtnStyle('#64748b')}>
                Pause
              </button>
              <button onClick={() => handleAction('complete')} disabled={actionLoading} style={actionBtnStyle('#10b981')}>
                Complete Service
              </button>
            </>
          )}
          {a.status === 'paused' && (
            <button onClick={() => handleAction('resume')} disabled={actionLoading} style={actionBtnStyle('#8b5cf6')}>
              Resume Service
            </button>
          )}
          {a.status !== 'completed' && a.status !== 'cancelled' && (
            <button
              onClick={() => handleAction('cancel-request')}
              disabled={actionLoading}
              style={{ ...btnSecondaryStyle, color: '#f87171' }}
            >
              Request Cancellation
            </button>
          )}
        </div>
      </div>

      {/* Grid: Client & Service Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Customer Information */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
              👤 Client Profile
            </h2>
            {c._id && (
              <button
                onClick={() => navigate(`/staff/customers/${c._id}`)}
                style={{ background: 'none', border: 'none', color: '#ec4899', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
              >
                View Full CRM →
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Name:</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>{c.name || 'Walk-in Guest'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Phone:</span>
              <span style={{ color: '#fff' }}>{c.phone || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Email:</span>
              <span style={{ color: '#fff' }}>{c.email || 'N/A'}</span>
            </div>
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={{ color: '#94a3b8' }}>Address:</span>
              <span style={{ color: '#fff' }}>{c.address || 'In Salon'}</span>
            </div>
          </div>
        </div>

        {/* Service & Pricing Details */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            ✨ Service Specifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Service Name:</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>{s.name || 'Beauty Treatment'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Duration:</span>
              <span style={{ color: '#fff' }}>{s.duration ? `${s.duration} mins` : 'Standard'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Price:</span>
              <span style={{ color: '#10b981', fontWeight: '700' }}>₹{a.amount || s.price || 0}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Payment Status:</span>
              <span style={{ color: a.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: '700' }}>
                {a.paymentStatus ? a.paymentStatus.toUpperCase() : 'PENDING'}
              </span>
            </div>
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={{ color: '#94a3b8' }}>Special Instructions:</span>
              <span style={{ color: '#cbd5e1' }}>{a.notes || a.specialInstructions || 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Client Service Note */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px', color: '#fff' }}>
          📝 Add Client Service Note
        </h2>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 12px' }}>
          Record hair formula, skin sensitivities, or client style preferences for future visits.
        </p>
        <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            placeholder="e.g. Client prefers ammonia-free shade 5.1 with subtle rose gold tone..."
            required
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={addingNote || !newNote.trim()}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {addingNote ? 'Saving...' : 'Save Note to CRM'}
            </button>
          </div>
        </form>
      </div>
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

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const actionBtnStyle = (color) => ({
  background: color,
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
});

const btnSecondaryStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

const backLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0,
  fontSize: '13px',
  marginBottom: '6px',
};

const statusBadgeStyle = (status) => {
  let bg = 'rgba(100, 116, 139, 0.2)';
  let color = '#94a3b8';
  if (status === 'confirmed' || status === 'accepted') {
    bg = 'rgba(59, 130, 246, 0.2)';
    color = '#60a5fa';
  } else if (status === 'working' || status === 'in_progress') {
    bg = 'rgba(236, 72, 153, 0.2)';
    color = '#f472b6';
  } else if (status === 'completed') {
    bg = 'rgba(16, 185, 129, 0.2)';
    color = '#34d399';
  } else if (status === 'checked_in') {
    bg = 'rgba(245, 158, 11, 0.2)';
    color = '#fbbf24';
  }
  return {
    background: bg,
    color: color,
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  };
};
