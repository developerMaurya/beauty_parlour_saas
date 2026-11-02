/**
 * @file StaffLoginPage.jsx
 * @description Dedicated Staff Authentication Screen with Business Tenant resolver.
 * @module frontend/src/modules/staff/pages/StaffLoginPage
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';

export default function StaffLoginPage() {
  const [searchParams] = useSearchParams();
  const initialTenant = searchParams.get('tenant') || localStorage.getItem('staff_tenant_id') || '';

  const [tenantId, setTenantId] = useState(initialTenant);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useStaff();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password');
      return;
    }

    setIsSubmitting(true);
    const res = await login({ email, password }, tenantId);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/staff/dashboard');
    } else {
      setErrorMsg(res.message || 'Staff login failed. Please verify credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 14px',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
            }}
          >
            ✂️
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Staff Member Portal
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Sign in to access your appointments, clients, and daily tasks
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tenant / Salon ID input if not pre-set */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Salon / Tenant ID
            </label>
            <input
              type="text"
              placeholder="e.g. salon-aura or tenant ObjectId"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Staff Email Address
            </label>
            <input
              type="email"
              placeholder="staff@salon.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '13px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
              transition: 'opacity 0.2s ease',
            }}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Staff Portal'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          Restricted access for authorized salon and academy staff members only.
        </div>
      </div>
    </div>
  );
}
