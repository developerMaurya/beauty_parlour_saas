/**
 * @file StaffProfileEditPage.jsx
 * @description Staff Member Profile Edit Form with protected field constraints.
 * Conforms to Phase 05 Section 4.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import * as profApi from '../../../services/api/staff/profileFetcher.js';

export default function StaffProfileEditPage() {
  const { staffUser, staffProfile, refreshStaffData } = useStaff();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'female',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await profApi.getProfile();
        const p = res?.data || staffProfile || {};
        setFormData({
          name: p.name || staffUser?.name || '',
          phone: p.phone || '',
          gender: p.gender || 'female',
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
          address: p.address || '',
          emergencyContact: p.emergencyContact || '',
          bankAccountName: p.bankDetails?.accountName || '',
          bankAccountNumber: p.bankDetails?.accountNumber || '',
          bankIfsc: p.bankDetails?.ifscCode || '',
        });
      } catch (err) {
        console.warn('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [staffProfile, staffUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        bankDetails: {
          accountName: formData.bankAccountName,
          accountNumber: formData.bankAccountNumber,
          ifscCode: formData.bankIfsc,
        },
      };

      await profApi.updateProfile(payload);
      success('Profile updated successfully!');
      await refreshStaffData();
      navigate('/staff/profile');
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading editor...</div>;
  }

  const p = staffProfile || {};

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: '#fff' }}>
            Edit Personal Information
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px' }}>
            Update your contact and bank details. Admin-controlled fields cannot be modified here.
          </p>
        </div>
        <button
          onClick={() => navigate('/staff/profile')}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Editable Personal Section */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            👤 Editable Personal Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Current Residential Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Street address, City, Pincode"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Emergency Contact (Name & Phone)</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Parent/Spouse: +91 98765 43210"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            🏦 Bank Payout Details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Account Holder Name</label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                placeholder="Name on bank passbook"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                placeholder="Bank Account Number"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>IFSC Code</label>
              <input
                type="text"
                name="bankIfsc"
                value={formData.bankIfsc}
                onChange={handleChange}
                placeholder="e.g. HDFC0001234"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Read-Only Admin Controlled Policy Display */}
        <div style={{ ...cardStyle, background: 'rgba(15, 23, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '16px' }}>🔒</span>
            <h2 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#f59e0b' }}>
              Admin-Controlled Fields (Read Only)
            </h2>
          </div>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 14px' }}>
            These parameters are managed by your Salon Administrator. To request adjustments, submit an official request under{' '}
            <strong style={{ color: '#ec4899' }}>My Requests</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={lockedFieldStyle}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Department</div>
              <div style={{ fontWeight: '600', color: '#cbd5e1' }}>{p.department || 'Service'}</div>
            </div>
            <div style={lockedFieldStyle}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Designation</div>
              <div style={{ fontWeight: '600', color: '#cbd5e1' }}>{p.designation || 'Specialist'}</div>
            </div>
            <div style={lockedFieldStyle}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Base Salary</div>
              <div style={{ fontWeight: '600', color: '#cbd5e1' }}>₹{p.salary || 'Protected'}</div>
            </div>
            <div style={lockedFieldStyle}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Commission Tier</div>
              <div style={{ fontWeight: '600', color: '#cbd5e1' }}>{p.commission ? `${p.commission}%` : 'Standard'}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/staff/profile')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
            }}
          >
            {submitting ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
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
  padding: '10px 14px',
  color: '#fff',
  fontSize: '13.5px',
  outline: 'none',
  boxSizing: 'border-box',
};

const lockedFieldStyle = {
  background: 'rgba(15, 23, 42, 0.6)',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.04)',
};
