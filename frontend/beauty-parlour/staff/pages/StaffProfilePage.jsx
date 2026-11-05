/**
 * @file StaffProfilePage.jsx
 * @description Staff Member Profile & Activity Timeline.
 * Conforms to Phase 05 Section 4.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import * as profApi from '../../../services/api/staff/profileFetcher.js';

export default function StaffProfilePage() {
  const { staffUser, staffProfile, refreshStaffData } = useStaff();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const [pRes, sRes, aRes] = await Promise.allSettled([
          profApi.getProfile(),
          profApi.getProfileSummary(),
          profApi.getActivity(),
        ]);
        if (pRes.status === 'fulfilled' && pRes.value?.data) {
          setProfile(pRes.value.data);
        }
        if (sRes.status === 'fulfilled' && sRes.value?.data) {
          setSummary(sRes.value.data);
        }
        if (aRes.status === 'fulfilled' && aRes.value?.data) {
          setActivity(Array.isArray(aRes.value.data) ? aRes.value.data : []);
        }
      } catch (err) {
        console.warn('Profile load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setUploadingPhoto(true);
      await profApi.uploadPhoto(formData);
      success('Profile photo updated successfully!');
      await refreshStaffData();
      const updated = await profApi.getProfile();
      if (updated?.data) setProfile(updated.data);
    } catch (err) {
      toastError(err?.response?.data?.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    try {
      setUploadingPhoto(true);
      await profApi.deletePhoto();
      success('Profile photo removed.');
      await refreshStaffData();
      const updated = await profApi.getProfile();
      if (updated?.data) setProfile(updated.data);
    } catch (err) {
      toastError(err?.response?.data?.message || 'Delete photo failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading profile...</div>;
  }

  const p = profile || staffProfile || {};

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Card */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: '#fff',
                border: '3px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {p.photo ? (
                <img src={p.photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                p.name?.charAt(0) || 'S'
              )}
            </div>

            <label
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#3b82f6',
                color: '#fff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }}
              title="Upload Photo"
            >
              📷
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
                {p.name || staffUser?.name}
              </h1>
              <span
                style={{
                  background: p.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: p.status === 'active' ? '#34d399' : '#f87171',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                {p.status || 'Active'}
              </span>
            </div>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '4px' }}>
              {p.designation || 'Specialist'} • {p.department || 'Salon Service Team'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Employee ID: <strong>{p.employeeId || p._id?.slice(-6) || 'EMP-1001'}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/staff/profile/edit')}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            ✏️ Edit Personal Details
          </button>
          {p.photo && (
            <button
              onClick={handleDeletePhoto}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Grid: Details & Admin Controlled Policy */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Personal Details */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            👤 Contact & Personal Info
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Email:</span>
              <span style={{ color: '#fff', fontWeight: '500' }}>{p.email || staffUser?.email}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Phone:</span>
              <span style={{ color: '#fff', fontWeight: '500' }}>{p.phone || 'Not specified'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Gender:</span>
              <span style={{ color: '#fff' }}>{p.gender || 'Not specified'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Date of Birth:</span>
              <span style={{ color: '#fff' }}>{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Joining Date:</span>
              <span style={{ color: '#fff' }}>{p.joiningDate ? new Date(p.joiningDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Emergency Contact:</span>
              <span style={{ color: '#fff' }}>{p.emergencyContact || 'None listed'}</span>
            </div>
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={{ color: '#94a3b8' }}>Address:</span>
              <span style={{ color: '#fff' }}>{p.address || 'Salon Base'}</span>
            </div>
          </div>
        </div>

        {/* Professional & Admin-Controlled Fields */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
              🏢 Professional Employment Info
            </h2>
            <span style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              Admin Controlled
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Employment Type:</span>
              <span style={{ color: '#fff', fontWeight: '500' }}>{p.employmentType || 'Full-time Specialist'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Primary Branch:</span>
              <span style={{ color: '#fff' }}>{p.primaryBranch?.name || p.branchId?.name || 'Main Salon'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Base Salary:</span>
              <span style={{ color: '#10b981', fontWeight: '600' }}>₹{p.salary ? p.salary.toLocaleString() : 'Confidential'}</span>
            </div>
            <div style={rowStyle}>
              <span style={{ color: '#94a3b8' }}>Commission Rate:</span>
              <span style={{ color: '#ec4899', fontWeight: '600' }}>{p.commission ? `${p.commission}%` : 'Standard Tier'}</span>
            </div>
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={{ color: '#94a3b8' }}>Assigned Skills:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '60%' }}>
                {Array.isArray(p.skills) && p.skills.length > 0 ? (
                  p.skills.map((s, i) => (
                    <span key={i} style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                      {typeof s === 'object' ? s.name : s}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#64748b' }}>None assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
          ⏱️ Recent Activity & Actions
        </h2>
        {activity.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No recent activities logged.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activity.slice(0, 5).map((act, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{act.action || act.description}</div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{act.module || 'Staff Portal'}</div>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  {act.createdAt ? new Date(act.createdAt).toLocaleString() : 'Recent'}
                </div>
              </div>
            ))}
          </div>
        )}
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
