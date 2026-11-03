/**
 * @file StaffLoginPage.jsx
 * @description Dedicated Staff Authentication Screen with Dynamic DB Credential Auto-Fill and Password Visibility Toggle.
 * @module frontend/src/modules/staff/pages/StaffLoginPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Database, Check } from 'lucide-react';
import { useStaff } from '../../../context/StaffContext.jsx';

export default function StaffLoginPage() {
  const [searchParams] = useSearchParams();
  const initialTenant = searchParams.get('tenant') || localStorage.getItem('staff_tenant_id') || '';

  const [tenantId, setTenantId] = useState(initialTenant);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoData, setDemoData] = useState(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const { login } = useStaff();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchDemo = async () => {
      try {
        const res = await fetch('/api/v1/common/demo-credentials');
        const data = await res.json();
        if (isMounted && data?.success && data?.data) {
          setDemoData(data.data);
          if (!tenantId && data.data.tenant?.slug) {
            setTenantId(data.data.tenant.slug);
          }
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
    if (demoData?.credentials?.staff) {
      setTenantId(demoData.credentials.staff.tenantSlug || 'blossom-salon');
      setEmail(demoData.credentials.staff.email || 'staff@blossom.com');
      setPassword(demoData.credentials.staff.password || 'Staff@123');
    } else {
      setTenantId('blossom-salon');
      setEmail('staff@blossom.com');
      setPassword('Staff@123');
    }
    setIsAutoFilled(true);
    setTimeout(() => setIsAutoFilled(false), 2500);
  };

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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
            <span>Staff DB Login Ready</span>
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
          {/* Tenant / Salon ID */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Salon / Tenant ID or Slug
            </label>
            <input
              type="text"
              placeholder="e.g. blossom-salon"
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
              placeholder="staff@blossom.com"
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 14px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
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

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          Switch portal:&nbsp;
          <a href="/admin/login" style={{ color: '#94a3b8', textDecoration: 'underline', marginRight: '8px' }}>Salon Admin</a>|
          <a href="/student/login" style={{ color: '#94a3b8', textDecoration: 'underline', margin: '0 8px' }}>Academy</a>|
          <a href="/customer/login" style={{ color: '#94a3b8', textDecoration: 'underline', marginLeft: '8px' }}>Customer</a>
        </div>
      </div>
    </div>
  );
}
