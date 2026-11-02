/**
 * @file ProfileView.jsx
 * @description Super Admin Master Profile Management & Password Security
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../../../services/api/superadmin.api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { User, Lock, ShieldCheck, Key, Check } from 'lucide-react';

export const ProfileView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authApi.getProfile();
        const u = res.data?.user || res.data;
        if (u) {
          setProfileData({
            name: u.name || '',
            email: u.email || '',
            username: u.username || '',
          });
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await authApi.updateProfile({
        name: profileData.name,
        email: profileData.email,
      });
      success('Master profile updated successfully');
      if (res.data?.user) updateUser(res.data.user);
    } catch (err) {
      error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('New password and confirmation do not match');
      return;
    }
    setIsSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      error(err.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Master Super Admin Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage your master platform identity, credentials, and authentication security.
        </p>
      </div>

      <div className="tabs-nav">
        {[
          { id: 'profile', label: 'Profile Details' },
          { id: 'password', label: 'Change Password' },
          { id: 'security', label: 'Active Session' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Super Admin Identity</h3>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.name}
                  onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username (System Identifier)</label>
              <input
                type="text"
                className="form-input"
                value={profileData.username}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Change Master Password</h3>
          </div>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Session Telemetry</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              <span>Assigned Security Role:</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>SUPER_ADMIN</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              <span>Session Isolation:</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>Active (JWT Authenticated)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              <span>Refresh Protocol:</span>
              <span>Enabled (7-day sliding window)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
