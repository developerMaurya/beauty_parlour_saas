/**
 * @file StaffNotificationsPage.jsx
 * @description Notifications Center, Preferences, Announcements & Birthdays for Staff.
 * Conforms to Phase 05 Section 37, 38, 39 & 40.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import * as notifApi from '../../../services/api/staff/notificationFetcher.js';
import * as annApi from '../../../services/api/staff/announcementFetcher.js';
import * as bdayApi from '../../../services/api/staff/birthdayFetcher.js';

export default function StaffNotificationsPage() {
  const { setUnreadCount } = useStaff();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications', 'announcements', 'birthdays', 'preferences'
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [preferences, setPreferences] = useState({
    appointment: true,
    chat: true,
    leave: true,
    attendance: true,
    payment: true,
    announcement: true,
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [nRes, aRes, bRes, pRes] = await Promise.allSettled([
        notifApi.getNotifications(),
        annApi.getAnnouncements(),
        bdayApi.getUpcomingBirthdays(),
        notifApi.getPreferences(),
      ]);

      if (nRes.status === 'fulfilled' && nRes.value?.data) {
        const list = Array.isArray(nRes.value.data) ? nRes.value.data : [];
        setNotifications(list);
        setUnreadCount(list.filter((x) => !x.read).length);
      }
      if (aRes.status === 'fulfilled' && aRes.value?.data) {
        setAnnouncements(Array.isArray(aRes.value.data) ? aRes.value.data : []);
      }
      if (bRes.status === 'fulfilled' && bRes.value?.data) {
        setBirthdays(Array.isArray(bRes.value.data) ? bRes.value.data : []);
      }
      if (pRes.status === 'fulfilled' && pRes.value?.data) {
        setPreferences((prev) => ({ ...prev, ...pRes.value.data }));
      }
    } catch (err) {
      console.warn('Notifications load err:', err);
    } finally {
      setLoading(false);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkRead = async (id) => {
    try {
      await notifApi.markNotificationRead(id);
      loadData();
    } catch (err) {
      console.warn(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notifApi.markAllNotificationsRead();
      success('All notifications marked as read.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to mark read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notifApi.deleteNotification(id);
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleTogglePref = async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    try {
      await notifApi.updatePreferences(updated);
      success('Notification preference updated.');
    } catch (err) {
      toastError('Failed to update preference');
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <span style={{ fontSize: '24px' }}>🔔</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Notifications & Salon Bulletin
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Appointment alerts, management broadcasts, colleague birthdays, and push settings
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'notifications', label: `Alerts (${notifications.filter((n) => !n.read).length})` },
            { id: 'announcements', label: `Announcements (${announcements.length})` },
            { id: 'birthdays', label: `Birthdays (${birthdays.length})` },
            { id: 'preferences', label: 'Preferences' },
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading alerts...</div>
      ) : activeTab === 'notifications' ? (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
              🔔 Activity & Appointment Alerts
            </h2>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                style={{ background: 'none', border: 'none', color: '#ec4899', fontSize: '12.5px', cursor: 'pointer', fontWeight: '600' }}
              >
                ✓ Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No notifications at this time.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    background: n.read ? 'rgba(15, 23, 42, 0.4)' : 'rgba(236, 72, 153, 0.1)',
                    border: n.read ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(236, 72, 153, 0.25)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                      {n.title || 'System Notification'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>
                      {n.message || n.body}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n._id)}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n._id)}
                      style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'announcements' ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            📢 Salon Official Announcements
          </h2>
          {announcements.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No announcements broadcasted.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.map((ann) => (
                <div
                  key={ann._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '18px',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{ann.title}</div>
                  <div style={{ fontSize: '13.5px', color: '#cbd5e1', marginTop: '6px' }}>{ann.content}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '8px' }}>
                    Published by Salon Management • {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'birthdays' ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            🎂 Upcoming Colleague Birthdays
          </h2>
          {birthdays.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No birthdays this month.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {birthdays.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '28px' }}>🎉</div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{b.name}</div>
                    <div style={{ fontSize: '12px', color: '#ec4899', marginTop: '2px', fontWeight: '600' }}>
                      Birthday: {b.date ? new Date(b.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Soon'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Preferences Tab */
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            ⚙️ Personal Notification Preferences
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'appointment', label: 'New Bookings & Schedule Changes', desc: 'Alerts when client bookings are assigned, rescheduled, or cancelled.' },
              { key: 'chat', label: 'Salon Internal Messages', desc: 'Direct message notifications from admin or reception.' },
              { key: 'leave', label: 'Leave & Correction Approvals', desc: 'Notifications when manager approves/rejects your submitted requests.' },
              { key: 'attendance', label: 'Attendance Reminders', desc: 'Prompts to clock in on shift arrival.' },
              { key: 'payment', label: 'Salary & Payslip Generation', desc: 'Alerts when monthly payslip or commissions are processed.' },
              { key: 'announcement', label: 'Salon Management Broadcasts', desc: 'Company announcements and policy changes.' },
            ].map((p) => (
              <div
                key={p.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>{p.label}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{p.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(preferences[p.key])}
                  onChange={() => handleTogglePref(p.key)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            ))}
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
