import React, { useState, useEffect } from 'react';
import { notificationFetcher } from '../../../services/api/student';

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationFetcher.getAll();
      if (res.success) {
        setNotifications(res.data || []);
      } else {
        setError(res.message || 'Failed to load notifications');
      }
    } catch (err) {
      setError(err.message || 'Error fetching student alert center');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationFetcher.readAll();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      alert(err.message || 'Error marking all as read');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationFetcher.read(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationFetcher.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting notification');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Alerts & Instant Notifications
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Real-time triggers for timetable changes, fee reminders, exam results, and certificate approvals.
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            style={{
              background: '#334155',
              color: '#f8fafc',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ✓ Mark All as Read
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading alerts...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Notifications</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>You are completely caught up with your academic updates.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(notif => {
            return (
              <div
                key={notif._id}
                style={{
                  background: notif.isRead ? '#1e293b' : 'rgba(245, 158, 11, 0.08)',
                  borderRadius: '12px',
                  border: notif.isRead ? '1px solid #334155' : '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ fontSize: '24px' }}>
                    {notif.type === 'PAYMENT' ? '💳' : notif.type === 'CLASS' ? '📅' : notif.type === 'CERTIFICATE' ? '🎓' : '📢'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>{notif.title}</h4>
                      {!notif.isRead && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                      )}
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {notif.message || notif.content}
                    </p>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {new Date(notif.createdAt || Date.now()).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif._id)}
                      style={{ background: 'transparent', border: 'none', color: '#f59e0b', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif._id)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
