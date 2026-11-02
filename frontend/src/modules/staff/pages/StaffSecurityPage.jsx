/**
 * @file StaffSecurityPage.jsx
 * @description Staff Security, Password Change, Multi-Device Sessions & MFA.
 * Conforms to Phase 05 Section 2 & 49.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as authApi from '../../../services/api/staff/authFetcher.js';
import * as secApi from '../../../services/api/staff/securityFetcher.js';

export default function StaffSecurityPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Change Password
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPass, setChangingPass] = useState(false);

  // MFA
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await authApi.getSessions();
      if (res?.data) {
        setSessions(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.warn('Sessions load err:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toastError('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toastError('Password must be at least 8 characters long');
      return;
    }

    try {
      setChangingPass(true);
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      success('Password successfully changed! All active sessions refreshed.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      loadSessions();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Password update failed');
    } finally {
      setChangingPass(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!window.confirm('Disconnect this device session?')) return;
    try {
      await authApi.revokeSession(sessionId);
      success('Device session revoked.');
      loadSessions();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Revoke failed');
    }
  };

  const handleLogoutAllOther = async () => {
    if (!window.confirm('Log out from all other active phones and computers?')) return;
    try {
      await authApi.revokeAllOtherSessions();
      success('Logged out of all other devices.');
      loadSessions();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Revoke all failed');
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <button onClick={() => navigate('/staff/settings')} style={backLinkStyle}>
          ← Back to Account Settings
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          <span style={{ fontSize: '24px' }}>🔐</span>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
            Account Security & Device Sessions
          </h1>
        </div>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
          Manage your password credentials, multi-device logins, and two-factor authentication
        </p>
      </div>

      {/* Change Password */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
          🔑 Change Portal Password
        </h2>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                required
                placeholder="At least 8 characters"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                required
                placeholder="Repeat new password"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={changingPass}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Device Sessions */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
              📱 Active Logged-in Devices
            </h2>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Sessions authenticated with your staff credentials
            </div>
          </div>

          <button
            onClick={handleLogoutAllOther}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Logout Other Devices
          </button>
        </div>

        {loadingSessions ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading active sessions...</div>
        ) : sessions.length === 0 ? (
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: '#cbd5e1' }}>
            Current browser session is active.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map((sess) => (
              <div
                key={sess._id || sess.sessionId}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#fff', fontSize: '13.5px' }}>
                    {sess.userAgent ? sess.userAgent.slice(0, 50) + '...' : 'Staff Portal Client'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                    IP: {sess.ipAddress || 'Active IP'} • Last active:{' '}
                    {sess.lastActiveAt ? new Date(sess.lastActiveAt).toLocaleString() : 'Just now'}
                  </div>
                </div>

                <button
                  onClick={() => handleRevokeSession(sess.sessionId || sess._id)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                  }}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two-Factor Authentication Status */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
              🛡️ Two-Factor Authentication (2FA)
            </h2>
            <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
              Enhance login protection with an OTP authenticator app
            </div>
          </div>

          <span
            style={{
              background: mfaEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
              color: mfaEnabled ? '#34d399' : '#94a3b8',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
            }}
          >
            {mfaEnabled ? 'Enabled' : 'Disabled (Optional)'}
          </span>
        </div>
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

const backLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0,
  fontSize: '13px',
};

const labelStyle = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: '600',
  color: '#cbd5e1',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '10px',
  color: '#fff',
  fontSize: '13px',
  boxSizing: 'border-box',
};
