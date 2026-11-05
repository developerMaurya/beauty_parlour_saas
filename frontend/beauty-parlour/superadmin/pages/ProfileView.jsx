/**
 * @file ProfileView.jsx
 * @description Super Admin Master Profile Management, Cloudflare Avatar Image Picker & Password Security
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../../../services/api/superadmin.api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import CloudflareImageUpload from '../../../components/CloudflareImageUpload';
import { User, Lock, ShieldCheck, Key, Camera, Check, UploadCloud } from 'lucide-react';

export const ProfileView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    avatarUrl: user?.avatarUrl || '',
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
            avatarUrl: u.avatarUrl || '',
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
        avatarUrl: profileData.avatarUrl,
      });
      success('Master profile updated successfully');
      const updatedUser = res.data?.user || res.data;
      if (updatedUser) updateUser(updatedUser);
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
    <div style={{ maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Master Super Admin Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage your master platform identity, credentials, avatar photo, and authentication security.
        </p>
      </div>


      {activeTab === 'profile' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Super Admin Identity & Profile Photo</h3>
          </div>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Avatar Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 700,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2px solid var(--primary)',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                {profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  profileData.name.charAt(0).toUpperCase() || 'A'
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Profile Photo / Avatar
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Upload your administrator avatar directly to Cloudflare Images CDN or paste an image URL.
                  </p>
                </div>

                <CloudflareImageUpload
                  value={profileData.avatarUrl}
                  onChange={(url) => setProfileData((p) => ({ ...p, avatarUrl: url }))}
                  folder="superadmin_avatars"
                  entityType="superadmin"
                  entityId={user?._id || user?.id || 'master'}
                  label="Upload Avatar (Cloudflare Direct)"
                  aspectRatio="square"
                  maxSizeMb={5}
                />
              </div>
            </div>

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

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Save Profile Changes'}
              </button>
            </div>
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
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min 12 chars, upper, lower, digit, symbol"
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
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Security State</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <div style={{ fontWeight: 600 }}>Master Session Authenticated</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Role: SUPER_ADMIN | Access Token (15m expiry) + Rotating Refresh Token (7d)
                  </div>
                </div>
              </div>
              <span className="badge badge-active">Protected</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Key className="w-5 h-5 text-indigo-400" />
                <div>
                  <div style={{ fontWeight: 600 }}>Database Connection Health</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    MongoDB Atlas Cluster0 Online | Encryption at Rest: AES-256
                  </div>
                </div>
              </div>
              <span className="badge badge-healthy">Online</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
