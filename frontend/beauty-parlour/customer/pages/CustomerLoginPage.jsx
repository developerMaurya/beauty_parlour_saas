/**
 * @file CustomerLoginPage.jsx
 * @description Customer Authentication Portal Login View with Dynamic DB Auto-Fill and Password Visibility Toggle.
 * @module frontend/src/modules/customer/pages/CustomerLoginPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Eye, EyeOff, Database, Check } from 'lucide-react';
import { useCustomer } from '../../../context/CustomerContext.jsx';

export default function CustomerLoginPage() {
  const { login } = useCustomer();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoData, setDemoData] = useState(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDemo = async () => {
      try {
        const res = await fetch('/api/v1/common/demo-credentials');
        const data = await res.json();
        if (isMounted && data?.success && data?.data) {
          setDemoData(data.data);
        }
      } catch (e) {
        console.warn('Could not fetch demo credentials:', e);
      }
    };
    fetchDemo();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAutoFill = () => {
    if (demoData?.credentials?.customer) {
      setIdentifier(demoData.credentials.customer.phoneOrEmail || '9876543210');
      setPassword(demoData.credentials.customer.password || 'Customer@123');
    } else {
      setIdentifier('9876543210');
      setPassword('Customer@123');
    }
    setIsAutoFilled(true);
    setTimeout(() => setIsAutoFilled(false), 2500);
  };

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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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

        {/* Dynamic Database Auto-Fill Action Banner */}
        <div
          style={{
            marginBottom: '18px',
            padding: '10px 14px',
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#f1f5f9', fontWeight: 600 }}>
            <Database className="w-4 h-4 text-pink-400" />
            <span>Customer DB Login Ready</span>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isAutoFilled ? <Check className="w-3.5 h-3.5" /> : null}
            {isAutoFilled ? 'Filled!' : '⚡ Auto-Fill'}
          </button>
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
              placeholder="e.g. 9876543210 or customer@blossom.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '12px 42px 12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
            Switch portal:{' '}
            <NavLink to="/admin/login" style={{ color: '#ec4899', fontWeight: 700, textDecoration: 'none', marginRight: '10px' }}>
              Salon Admin
            </NavLink>
            <NavLink to="/staff/login" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>
              Staff Portal
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
