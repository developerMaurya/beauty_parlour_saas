/**
 * @file StudentProfilePage.jsx
 * @description Student Academy Identity & Academic Record Page.
 * Conforms to Phase 06 Section 4.
 * @module frontend/src/modules/student/pages/StudentProfilePage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as profileApi from '../../../services/api/student/profileFetcher.js';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await profileApi.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading student profile...</div>;
  }

  const p = profile || {};
  const addr = p.address || {};
  const emg = p.emergencyContact || {};

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: p.photo ? `url(${p.photo}) center/cover` : 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            }}
          >
            {!p.photo && (p.name?.[0] || 'S')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>{p.name}</h1>
              <span style={statusBadgeStyle}>{p.status || 'ACTIVE'}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Student ID: <strong style={{ color: '#fff' }}>{p.studentId}</strong> • Admission No: <strong style={{ color: '#fff' }}>{p.admissionNumber || 'ADM-2026'}</strong>
            </div>
          </div>
        </div>

        <NavLink
          to="/student/profile/edit"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          ✏️ Edit Personal Details
        </NavLink>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Academic Details */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            🎓 Academic Enrollment Info
          </h2>
          <div style={rowStyle}>
            <span style={labelStyle}>Selected Plan:</span>
            <span style={valStyle}>{p.planId?.name || 'Academy Diploma'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Current Course:</span>
            <span style={valStyle}>{p.course || 'Cosmetology & Hair Artistry'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Academy Branch:</span>
            <span style={valStyle}>{p.branchId?.name || 'Central Campus'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Assigned Trainer:</span>
            <span style={valStyle}>{p.assignedTrainer?.name || 'Senior Academy Faculty'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Admission Date:</span>
            <span style={valStyle}>{p.admissionDate ? new Date(p.admissionDate).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        {/* Contact & Personal Details */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            👤 Personal & Contact Info
          </h2>
          <div style={rowStyle}>
            <span style={labelStyle}>Phone Number:</span>
            <span style={valStyle}>{p.phone || 'N/A'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Email Address:</span>
            <span style={valStyle}>{p.email || 'N/A'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Gender:</span>
            <span style={{ ...valStyle, textTransform: 'capitalize' }}>{p.gender || 'Female'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Residential Address:</span>
            <span style={valStyle}>
              {addr.street || ''} {addr.city ? `, ${addr.city}` : ''} {addr.state ? `, ${addr.state}` : ''}
            </span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Emergency Contact:</span>
            <span style={valStyle}>{emg.name ? `${emg.name} (${emg.relation || 'Parent'}): ${emg.phone}` : 'N/A'}</span>
          </div>
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
  padding: '22px',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  fontSize: '13px',
};

const labelStyle = {
  color: '#94a3b8',
};

const valStyle = {
  color: '#fff',
  fontWeight: '500',
};

const statusBadgeStyle = {
  background: 'rgba(16, 185, 129, 0.15)',
  color: '#10b981',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
};
