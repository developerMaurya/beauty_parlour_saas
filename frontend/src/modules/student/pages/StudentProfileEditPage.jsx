/**
 * @file StudentProfileEditPage.jsx
 * @description Student Profile Edit Form with Mass-Assignment Protection.
 * Allows updating authorized personal details (phone, address, emergency contact, photo)
 * while keeping academic and administrative fields read-only.
 * @module frontend/src/modules/student/pages/StudentProfileEditPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as profileApi from '../../../services/api/student/profileFetcher.js';

export default function StudentProfileEditPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    phone: '',
    gender: 'female',
    photo: '',
    skills: '',
    address: { street: '', city: '', state: '', postalCode: '' },
    emergencyContact: { name: '', phone: '', relation: '' },
    // Read-only reference
    studentId: '',
    admissionNumber: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await profileApi.getProfile();
        if (res.success && res.data) {
          const p = res.data;
          setForm({
            phone: p.phone || '',
            gender: p.gender || 'female',
            photo: p.photo || '',
            skills: Array.isArray(p.skills) ? p.skills.join(', ') : '',
            address: {
              street: p.address?.street || '',
              city: p.address?.city || '',
              state: p.address?.state || '',
              postalCode: p.address?.postalCode || '',
            },
            emergencyContact: {
              name: p.emergencyContact?.name || '',
              phone: p.emergencyContact?.phone || '',
              relation: p.emergencyContact?.relation || '',
            },
            studentId: p.studentId || '',
            admissionNumber: p.admissionNumber || '',
          });
        }
      } catch (err) {
        toastError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        phone: form.phone,
        gender: form.gender,
        photo: form.photo,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        address: form.address,
        emergencyContact: form.emergencyContact,
      };

      await profileApi.updateProfile(payload);
      success('Student profile updated successfully!');
      navigate('/student/profile');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading form...</div>;
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>Edit Personal Details</h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>
              Update your contact info and personal address
            </p>
          </div>
          <button onClick={() => navigate('/student/profile')} style={btnCancelStyle}>
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Readonly info notice */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: '8px', fontSize: '12.5px', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            🔒 <strong>Admin-Controlled Fields:</strong> Student ID (<span style={{ color: '#fff' }}>{form.studentId}</span>) and Admission Number (<span style={{ color: '#fff' }}>{form.admissionNumber}</span>) cannot be altered directly.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                style={inputStyle}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Profile Photo URL</label>
            <input
              type="text"
              value={form.photo}
              onChange={(e) => setForm((p) => ({ ...p, photo: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Specialist Skills (comma separated)</label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
              placeholder="e.g. Bridal Makeup, Hair Styling, Color Correction"
              style={inputStyle}
            />
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: '10px 0 0' }}>Residential Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <input
              type="text"
              placeholder="Street / Apartment"
              value={form.address.street}
              onChange={(e) => setForm((p) => ({ ...p, address: { ...p.address, street: e.target.value } }))}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="City"
              value={form.address.city}
              onChange={(e) => setForm((p) => ({ ...p, address: { ...p.address, city: e.target.value } }))}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              placeholder="State"
              value={form.address.state}
              onChange={(e) => setForm((p) => ({ ...p, address: { ...p.address, state: e.target.value } }))}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={form.address.postalCode}
              onChange={(e) => setForm((p) => ({ ...p, address: { ...p.address, postalCode: e.target.value } }))}
              style={inputStyle}
            />
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: '10px 0 0' }}>Emergency Contact</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              placeholder="Contact Name"
              value={form.emergencyContact.name}
              onChange={(e) => setForm((p) => ({ ...p, emergencyContact: { ...p.emergencyContact, name: e.target.value } }))}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Contact Phone"
              value={form.emergencyContact.phone}
              onChange={(e) => setForm((p) => ({ ...p, emergencyContact: { ...p.emergencyContact, phone: e.target.value } }))}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Relation (e.g. Mother)"
              value={form.emergencyContact.relation}
              onChange={(e) => setForm((p) => ({ ...p, emergencyContact: { ...p.emergencyContact, relation: e.target.value } }))}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => navigate('/student/profile')} style={btnCancelStyle}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                padding: '11px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '28px',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#94a3b8',
  marginBottom: '6px',
  fontWeight: '600',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#fff',
  fontSize: '13.5px',
  boxSizing: 'border-box',
  outline: 'none',
};

const btnCancelStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
};
