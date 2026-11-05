/**
 * @file CustomerSettingsPage.jsx
 * @description Customer Account Settings & Security Management.
 * Manages password update, active devices, sessions revocation, and client privacy controls.
 * @module frontend/src/modules/customer/pages/CustomerSettingsPage
 */

import React, { useState, useEffect } from 'react';
import * as authApi from '../../../services/api/customer/authFetcher.js';
import * as secApi from '../../../services/api/customer/securityFetcher.js';

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = useState('security');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [devices, setDevices] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadSecurity = async () => {
    try {
      setLoading(true);
      const [devRes, histRes] = await Promise.allSettled([
        secApi.getDevices(),
        secApi.getLoginHistory()
      ]);
      if (devRes.status === 'fulfilled' && devRes.value.data?.success) {
        setDevices(devRes.value.data.data?.devices || devRes.value.data.data || []);
      }
      if (histRes.status === 'fulfilled' && histRes.value.data?.success) {
        setLoginHistory(histRes.value.data.data?.history || histRes.value.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load security settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurity();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      setActionLoading(true);
      const res = await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data?.success) {
        setMsg({ type: 'success', text: 'Password changed successfully.' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeAll = async () => {
    if (!window.confirm('Are you sure you want to log out of all other devices?')) return;
    try {
      setActionLoading(true);
      await secApi.revokeAllDevices();
      setMsg({ type: 'success', text: 'All other active sessions have been revoked.' });
      await loadSecurity();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to revoke sessions.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
          Account Security & Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Configure account credentials, review logged-in devices, and manage security authorizations.
        </p>
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

      {/* Grid: Password form & Devices list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Change Password Card */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
              Update Password
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.8125rem' }}>
              Ensure your account uses a secure password to protect personal treatment notes.
            </p>
          </div>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                fontWeight: 600,
                cursor: actionLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {actionLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Sessions & Active Devices */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
                Active Devices & Sessions
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.8125rem' }}>
                Devices with authorized access to your portal account.
              </p>
            </div>
            <button
              onClick={handleRevokeAll}
              disabled={actionLoading}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Revoke Others
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading device sessions...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem' }}>💻</span>
                    <strong style={{ color: '#f8fafc', fontSize: '0.875rem' }}>Current Active Session</strong>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>● Active Now</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Web Browser • Validated via Multi-Tenant JWT
                  </div>
                </div>
              </div>

              {devices.map((d, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.875rem' }}>{d.deviceName || d.userAgent || 'Authorized Browser'}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>IP: {d.ip || 'Masked'} • Last seen: {d.lastActive ? new Date(d.lastActive).toLocaleDateString() : 'Recent'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
