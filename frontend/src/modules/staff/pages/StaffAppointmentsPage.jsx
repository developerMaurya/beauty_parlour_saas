/**
 * @file StaffAppointmentsPage.jsx
 * @description Comprehensive Salon Appointments view & lifecycle management for staff.
 * Conforms to Phase 05 Section 12 & 13.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as apptApi from '../../../services/api/staff/appointmentFetcher.js';

export default function StaffAppointmentsPage() {
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'today', 'upcoming', 'history'
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (activeTab === 'today') {
        res = await apptApi.getTodayAppointments();
      } else if (activeTab === 'upcoming') {
        res = await apptApi.getUpcomingAppointments();
      } else if (activeTab === 'history') {
        res = await apptApi.getAppointmentHistory({ status: 'completed' });
      } else {
        res = await apptApi.getMyAppointments({
          search: search || undefined,
          status: selectedStatus || undefined,
        });
      }

      if (res?.data) {
        setAppointments(Array.isArray(res.data) ? res.data : res.data.appointments || []);
      }
    } catch (err) {
      console.warn('Appointments fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, selectedStatus]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') await apptApi.acceptAppointment(id);
      else if (action === 'reject') {
        const reason = window.prompt('Please enter reason for declining appointment:');
        if (!reason) return;
        await apptApi.rejectAppointment(id, reason);
      } else if (action === 'confirm') await apptApi.confirmAppointment(id);
      else if (action === 'check-in') await apptApi.checkInAppointment(id);
      else if (action === 'start') await apptApi.startAppointment(id);
      else if (action === 'pause') await apptApi.pauseAppointment(id);
      else if (action === 'resume') await apptApi.resumeAppointment(id);
      else if (action === 'complete') await apptApi.completeAppointment(id);

      success(`Appointment updated: ${action}`);
      loadAppointments();
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Operation failed');
    }
  };

  const filtered = appointments.filter((a) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const clientName = a.customer?.name?.toLowerCase() || '';
    const sName = a.service?.name?.toLowerCase() || '';
    return clientName.includes(term) || sName.includes(term);
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px', color: '#fff' }}>
            ✂️ In-Salon Appointments
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px' }}>
            Manage client check-ins, service progression, and post-service wrap-up
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'all', label: 'All My Bookings' },
            { id: 'today', label: "Today's Schedule" },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'history', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client name or service..."
          style={{
            flex: 1,
            minWidth: '240px',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '13.5px',
            outline: 'none',
          }}
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '13.5px',
            outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          <option value="assigned">Assigned</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="working">Working</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading salon bookings...</div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>✂️</div>
          <p style={{ margin: 0, fontSize: '15px', color: '#cbd5e1' }}>No appointments match your criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((appt) => (
            <div
              key={appt._id}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              {/* Left Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    color: '#ec4899',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}
                >
                  ✂️
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
                      {appt.customer?.name || 'Walk-in Guest'}
                    </h3>
                    <span style={statusBadgeStyle(appt.status)}>{appt.status}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>
                    <strong>{appt.service?.name || 'Beauty Service'}</strong> •{' '}
                    {appt.date ? new Date(appt.date).toLocaleDateString() : 'Date'} at {appt.scheduledTime || 'Slot'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Phone: {appt.customer?.phone || 'N/A'} • Payment:{' '}
                    <span style={{ color: appt.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                      {appt.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {appt.status === 'assigned' && (
                  <>
                    <button onClick={() => handleAction(appt._id, 'accept')} style={actionBtnStyle('#10b981')}>
                      Accept
                    </button>
                    <button onClick={() => handleAction(appt._id, 'reject')} style={actionBtnStyle('#ef4444')}>
                      Decline
                    </button>
                  </>
                )}

                {appt.status === 'accepted' && (
                  <button onClick={() => handleAction(appt._id, 'confirm')} style={actionBtnStyle('#3b82f6')}>
                    Confirm Client
                  </button>
                )}

                {appt.status === 'confirmed' && (
                  <button onClick={() => handleAction(appt._id, 'check-in')} style={actionBtnStyle('#f59e0b')}>
                    Check In Client
                  </button>
                )}

                {appt.status === 'checked_in' && (
                  <button onClick={() => handleAction(appt._id, 'start')} style={actionBtnStyle('#ec4899')}>
                    Start Service
                  </button>
                )}

                {appt.status === 'working' && (
                  <>
                    <button onClick={() => handleAction(appt._id, 'pause')} style={actionBtnStyle('#64748b')}>
                      Pause
                    </button>
                    <button onClick={() => handleAction(appt._id, 'complete')} style={actionBtnStyle('#10b981')}>
                      Complete Service
                    </button>
                  </>
                )}

                {appt.status === 'paused' && (
                  <button onClick={() => handleAction(appt._id, 'resume')} style={actionBtnStyle('#8b5cf6')}>
                    Resume
                  </button>
                )}

                <button
                  onClick={() => navigate(`/staff/appointments/${appt._id}`)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const actionBtnStyle = (color) => ({
  background: color,
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '12.5px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
});

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
  } else if (status === 'cancelled') {
    bg = 'rgba(239, 68, 68, 0.2)';
    color = '#f87171';
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
