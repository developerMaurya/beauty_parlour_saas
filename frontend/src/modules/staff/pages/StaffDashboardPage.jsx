/**
 * @file StaffDashboardPage.jsx
 * @description Dynamic, real-time dashboard for staff members.
 * Conforms to Phase 05 Section 3 & 54.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import * as dashApi from '../../../services/api/staff/dashboardFetcher.js';
import * as attApi from '../../../services/api/staff/attendanceFetcher.js';
import * as apptApi from '../../../services/api/staff/appointmentFetcher.js';

export default function StaffDashboardPage() {
  const { staffUser, staffProfile, hasPermission } = useStaff();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [todayAppts, setTodayAppts] = useState([]);
  const [todayHome, setTodayHome] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [birthdays, setBirthdays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [ovRes, apptRes, attRes] = await Promise.allSettled([
        dashApi.getOverview(),
        dashApi.getToday(),
        attApi.getTodayAttendance(),
      ]);

      if (ovRes.status === 'fulfilled' && ovRes.value?.data) {
        setOverview(ovRes.value.data);
      }
      if (apptRes.status === 'fulfilled' && apptRes.value?.data) {
        setTodayAppts(apptRes.value.data.appointments || []);
        setTodayHome(apptRes.value.data.homeServices || []);
        setTasks(apptRes.value.data.tasks || []);
        setBirthdays(apptRes.value.data.birthdays || []);
        setAnnouncements(apptRes.value.data.announcements || []);
      }
      if (attRes.status === 'fulfilled' && attRes.value?.data) {
        setAttendanceToday(attRes.value.data);
      }
    } catch (err) {
      console.warn('Dashboard load failed:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Quick Check-In / Check-Out
  const handleCheckIn = async () => {
    try {
      setClockLoading(true);
      const res = await attApi.checkIn({ notes: 'Clocked in via dashboard' });
      success('Checked in successfully! Have a great day.');
      setAttendanceToday(res?.data || { status: 'present', checkIn: new Date() });
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Check-in failed');
    } finally {
      setClockLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setClockLoading(true);
      const res = await attApi.checkOut({ notes: 'Clocked out via dashboard' });
      success('Checked out successfully. Good job today!');
      setAttendanceToday(res?.data || { status: 'present', checkOut: new Date() });
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Check-out failed');
    } finally {
      setClockLoading(false);
    }
  };

  // Quick Appointment status update
  const handleApptAction = async (id, action) => {
    try {
      if (action === 'check-in') await apptApi.checkInAppointment(id);
      else if (action === 'start') await apptApi.startAppointment(id);
      else if (action === 'complete') await apptApi.completeAppointment(id);
      success(`Appointment ${action} updated!`);
      loadDashboardData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✂️</div>
          <div>Loading your specialist workspace...</div>
        </div>
      </div>
    );
  }

  const isCheckedIn = attendanceToday?.checkIn && !attendanceToday?.checkOut;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px', color: '#fff' }}>
            Welcome back, {staffProfile?.name || staffUser?.name || 'Specialist'}! ✨
          </h1>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px' }}>
            {staffProfile?.department || 'Salon Team'} • {staffProfile?.designation || 'Beauty Artist'} •{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Quick Attendance Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '13px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Shift Status</div>
            <div style={{ fontWeight: '600', color: isCheckedIn ? '#10b981' : '#f59e0b' }}>
              {isCheckedIn ? '🟢 Active On Duty' : '⚪ Not Clocked In'}
            </div>
          </div>

          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={clockLoading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              }}
            >
              ⏱️ Clock In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={clockLoading}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
              }}
            >
              🛑 Clock Out
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div style={kpiCardStyle}>
          <div style={kpiIconStyle('rgba(236, 72, 153, 0.15)', '#f472b6')}>✂️</div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Today's Salon Bookings</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              {overview?.todayAppointmentsCount ?? todayAppts.length}
            </div>
          </div>
        </div>

        {hasPermission('home_service') && (
          <div style={kpiCardStyle}>
            <div style={kpiIconStyle('rgba(59, 130, 246, 0.15)', '#60a5fa')}>🚗</div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Home Visits</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
                {overview?.todayHomeServicesCount ?? todayHome.length}
              </div>
            </div>
          </div>
        )}

        <div style={kpiCardStyle}>
          <div style={kpiIconStyle('rgba(16, 185, 129, 0.15)', '#34d399')}>📋</div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Active Tasks</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              {overview?.pendingTasksCount ?? tasks.length}
            </div>
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={kpiIconStyle('rgba(245, 158, 11, 0.15)', '#fbbf24')}>💰</div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Est. Month Commission</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              ₹{overview?.monthCommission ?? '0'}
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Banner if any */}
      {announcements.length > 0 && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#93c5fd',
            fontSize: '14px',
          }}
        >
          <span style={{ fontSize: '18px' }}>📢</span>
          <div style={{ flex: 1 }}>
            <strong>Announcement:</strong> {announcements[0]?.title} — {announcements[0]?.content}
          </div>
        </div>
      )}

      {/* Main Content Sections: Appointments & Home Services */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Salon Appointments */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✂️</span> Today's In-Salon Appointments
            </h2>
            <Link to="/staff/appointments" style={{ color: '#ec4899', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>
              View All →
            </Link>
          </div>

          {todayAppts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛋️</div>
              <p style={{ margin: 0, fontSize: '14px' }}>No in-salon appointments scheduled for today.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todayAppts.map((appt) => (
                <div
                  key={appt._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>
                      {appt.customer?.name || 'Walk-in Client'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                      {appt.service?.name || 'Service'} • {appt.scheduledTime || 'Slot'}
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span style={statusBadgeStyle(appt.status)}>{appt.status}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {appt.status === 'confirmed' && (
                      <button
                        onClick={() => handleApptAction(appt._id, 'check-in')}
                        style={actionBtnStyle('#3b82f6')}
                      >
                        Check In
                      </button>
                    )}
                    {appt.status === 'checked_in' && (
                      <button
                        onClick={() => handleApptAction(appt._id, 'start')}
                        style={actionBtnStyle('#10b981')}
                      >
                        Start
                      </button>
                    )}
                    {appt.status === 'working' && (
                      <button
                        onClick={() => handleApptAction(appt._id, 'complete')}
                        style={actionBtnStyle('#8b5cf6')}
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/staff/appointments/${appt._id}`)}
                      style={actionBtnStyle('#475569')}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Home Services / Tasks */}
        <div style={sectionCardStyle}>
          {hasPermission('home_service') ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚗</span> Today's Home Care Visits
                </h2>
                <Link to="/staff/home-services" style={{ color: '#3b82f6', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>
                  Manage Doorstep →
                </Link>
              </div>

              {todayHome.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏡</div>
                  <p style={{ margin: 0, fontSize: '14px' }}>No home visits scheduled today.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {todayHome.map((home) => (
                    <div
                      key={home._id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>
                          {home.customer?.name}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                          📍 {home.customer?.address || 'Client Address'}
                        </div>
                        <div style={{ marginTop: '6px' }}>
                          <span style={statusBadgeStyle(home.status)}>{home.status}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/staff/home-services/${home._id}`)}
                        style={actionBtnStyle('#3b82f6')}
                      >
                        Open Journey →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Daily Tasks for Non-Home Service Specialists */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋</span> Assigned Salon Tasks
                </h2>
                <Link to="/staff/tasks" style={{ color: '#10b981', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>
                  View All →
                </Link>
              </div>

              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
                  <p style={{ margin: 0, fontSize: '14px' }}>All caught up! No pending tasks.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tasks.slice(0, 4).map((t) => (
                    <div
                      key={t._id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#fff' }}>{t.title}</div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Today'}</div>
                      </div>
                      <span style={statusBadgeStyle(t.status)}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const kpiCardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  padding: '18px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const kpiIconStyle = (bg, color) => ({
  width: '46px',
  height: '46px',
  borderRadius: '12px',
  background: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
});

const sectionCardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '22px',
};

const actionBtnStyle = (color) => ({
  background: color,
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
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
  }
  return {
    background: bg,
    color: color,
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
  };
};
