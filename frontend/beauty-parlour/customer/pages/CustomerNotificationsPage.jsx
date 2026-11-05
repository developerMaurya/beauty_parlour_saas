/**
 * @file CustomerNotificationsPage.jsx
 * @description Customer Notifications Hub & Omnichannel Alerts Configuration.
 * Displays appointment updates, payment alerts, and manages SMS, WhatsApp, Email, & Push preferences.
 * @module frontend/src/modules/customer/pages/CustomerNotificationsPage
 */

import React, { useState, useEffect } from 'react';
import * as notifApi from '../../../services/api/customer/notificationFetcher.js';
import * as prefApi from '../../../services/api/customer/notificationPreferenceFetcher.js';

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Preferences state
  const [prefs, setPrefs] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    push: true,
    appointmentReminders: true,
    paymentAlerts: true,
    promotions: false
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notifApi.getNotifications(unreadOnly ? { unread: true } : {});
      if (res.data?.success) {
        setNotifications(res.data.data?.notifications || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const res = await prefApi.getNotificationPreferences();
      if (res.data?.success && res.data.data) {
        setPrefs(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.error('Failed to load notification preferences', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, [unreadOnly]);

  const handleMarkRead = async (id) => {
    try {
      await notifApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n._id === id || n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setActionLoading(true);
      await notifApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setMsg({ type: 'success', text: 'All notifications marked as read.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to mark notifications read.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notifApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const handleSavePrefs = async (e) => {
    e.preventDefault();
    try {
      setSavingPrefs(true);
      await prefApi.updateNotificationPreferences(prefs);
      setMsg({ type: 'success', text: 'Notification preferences updated successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save preferences.' });
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Alerts & Notification Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Real-time appointment alerts, payment confirmations, and alert channel controls.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            style={{
              padding: '0.625rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: unreadOnly ? 'rgba(236, 72, 153, 0.2)' : 'rgba(30, 41, 59, 0.6)',
              color: unreadOnly ? '#ec4899' : '#cbd5e1',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {unreadOnly ? 'Showing Unread Only' : 'Show All'}
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            style={{
              padding: '0.625rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Mark All as Read
          </button>
        </div>
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

      {/* Main Grid: Feed & Preferences */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Left: Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              background: 'rgba(30, 41, 59, 0.4)',
              borderRadius: '16px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              color: '#94a3b8'
            }}>
              No alerts found.
            </div>
          ) : (
            notifications.map((n) => {
              const nid = n._id || n.id;
              const isUnread = !n.isRead && !n.read;
              return (
                <div
                  key={nid}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: isUnread ? 'rgba(236, 72, 153, 0.08)' : 'rgba(30, 41, 59, 0.6)',
                    border: `1px solid ${isUnread ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: isUnread ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.125rem'
                    }}>
                      🔔
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', color: '#f8fafc', fontWeight: 700 }}>
                          {n.title || 'Salon Alert'}
                        </h4>
                        {isUnread && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }} />
                        )}
                      </div>
                      <p style={{ margin: '0.375rem 0', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.4' }}>
                        {n.message || n.body}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isUnread && (
                      <button
                        onClick={() => handleMarkRead(nid)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(nid)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Notification Preferences Panel */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
              Alert Preferences
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.8125rem' }}>
              Select where you wish to receive booking and tracking notifications.
            </p>
          </div>

          <form onSubmit={handleSavePrefs} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
                Delivery Channels
              </span>
              {[
                { key: 'whatsapp', label: 'WhatsApp Updates' },
                { key: 'sms', label: 'SMS Notifications' },
                { key: 'email', label: 'Email Confirmations' },
                { key: 'push', label: 'Browser Push Notifications' }
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: '#f8fafc' }}>
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={!!prefs[item.key]}
                    onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                    style={{ accentColor: '#ec4899', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </label>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
                Notification Types
              </span>
              {[
                { key: 'appointmentReminders', label: 'Appointment Reminders' },
                { key: 'paymentAlerts', label: 'Invoices & Receipts' },
                { key: 'promotions', label: 'Seasonal Offers & Discounts' }
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem', cursor: 'pointer', fontSize: '0.875rem', color: '#f8fafc' }}>
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={!!prefs[item.key]}
                    onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                    style={{ accentColor: '#ec4899', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={savingPrefs}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                fontWeight: 600,
                cursor: savingPrefs ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}
            >
              {savingPrefs ? 'Saving Settings...' : 'Save Preferences'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
