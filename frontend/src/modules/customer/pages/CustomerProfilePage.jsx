/**
 * @file CustomerProfilePage.jsx
 * @description Customer Personal Profile View & Edit.
 * Enforces mass-assignment protection on client side and validates inputs.
 * @module frontend/src/modules/customer/pages/CustomerProfilePage
 */

import React, { useState, useEffect } from 'react';
import * as profileApi from '../../../services/api/customer/profileFetcher.js';
import { useCustomer } from '../../../context/CustomerContext.jsx';

export default function CustomerProfilePage() {
  const { customer, refreshProfile } = useCustomer();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'female',
    dateOfBirth: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        gender: customer.gender || 'female',
        dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : '',
        city: customer.city || customer.address?.city || '',
        state: customer.state || customer.address?.state || '',
        country: customer.country || customer.address?.country || 'India',
        pincode: customer.pincode || customer.address?.pincode || '',
        emergencyContactName: customer.emergencyContact?.name || '',
        emergencyContactPhone: customer.emergencyContact?.phone || '',
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || null,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: form.pincode,
        emergencyContact: {
          name: form.emergencyContactName,
          phone: form.emergencyContactPhone,
        },
      };

      await profileApi.updateProfile(payload);
      await refreshProfile();
      setMsg({ type: 'success', text: 'Personal profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
          Customer Profile & Preferences
        </h1>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
          Manage your personal details, home service delivery address, and emergency contact.
        </p>
      </div>

      {msg.text && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '13.5px',
            background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: msg.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave} style={{ background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Full Name *</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Phone Number *</label>
            <input type="tel" name="phone" required value={form.phone} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>City</label>
            <input type="text" name="city" value={form.city} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>State</label>
            <input type="text" name="state" value={form.state} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Pincode</label>
            <input type="text" name="pincode" value={form.pincode} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Country</label>
            <input type="text" name="country" value={form.country} onChange={handleChange} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
            Emergency Contact Information
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Contact Name</label>
              <input type="text" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} placeholder="e.g. Ramesh Sharma (Spouse)" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Contact Phone</label>
              <input type="tel" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} placeholder="10-digit mobile" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
