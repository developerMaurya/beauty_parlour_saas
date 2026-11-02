/**
 * @file CustomerLoginPage.jsx
 * @description Customer Authentication Portal Login View.
 * Supports phone/email login, tenant resolution, and session persistence.
 * @module frontend/src/modules/customer/pages/CustomerLoginPage
 */

import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useCustomer } from '../../../context/CustomerContext.jsx';

export default function CustomerLoginPage() {
  const { login } = useCustomer();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Please verify your phone/email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0a0d14 70%)', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)' }}>
            💄
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Customer Portal
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Sign in to track appointments, services & offers
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Phone Number or Email
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 9811122233 or customer@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            First time visiting?{' '}
            <NavLink to="/customer/register" style={{ color: '#ec4899', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </NavLink>
          </p>
          <div style={{ marginTop: '12px' }}>
            <NavLink to="/public" style={{ color: '#64748b', fontSize: '12px', textDecoration: 'none' }}>
              ← Return to Public Salon Showcase
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
