/**
 * @file StaffLoginPage.jsx
 * @description Dedicated Staff Authentication Screen with Email & Password Only (No Salon/Tenant ID input required).
 * Supports automatic tenant resolution, dynamic vertical routing (Parlour, Event, Plotting, Software), and 1-click test credentials.
 * @module frontend/src/modules/staff/pages/StaffLoginPage
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Database, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useStaff } from '../../../context/StaffContext.jsx';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const { login, loginWithGoogle } = useStaff();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) return;
      const decoded = jwtDecode(credentialResponse.credential);
      setIsSubmitting(true);
      const res = await loginWithGoogle({
        email: decoded.email,
        name: decoded.name || decoded.given_name || decoded.email.split('@')[0],
        picture: decoded.picture || '',
        googleId: decoded.sub,
      });
      setIsSubmitting(false);

      if (res?.success) {
        const biz = (res.data?.user?.targetBusiness || 'PARLOUR').toUpperCase();
        if (biz === 'EVENTS') navigate('/staff/event-dashboard');
        else if (biz === 'PLOTTING') navigate('/staff/plotting-dashboard');
        else if (biz === 'SOFTWARE') navigate('/staff/software-dashboard');
        else navigate('/staff/dashboard');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Google login failed for staff: ' + err.message);
    }
  };

  // 4 Business Vertical Demo Accounts (Staff / Employee only - Rent excluded per requirements)
  const demoAccounts = [
    {
      id: 'PARLOUR',
      label: 'Parlour Stylist',
      emoji: '💄',
      email: 'staff@blossom.com',
      password: 'Staff@123',
      color: '#c084fc',
      route: '/staff/dashboard',
    },
    {
      id: 'EVENTS',
      label: 'Event Operations Lead',
      emoji: '🔱',
      email: 'vikram.event@kashiservice.com',
      password: 'Staff@123',
      color: '#fbbf24',
      route: '/staff/event-dashboard',
    },
    {
      id: 'PLOTTING',
      label: 'Real Estate Sales Officer',
      emoji: '🏡',
      email: 'rajesh.plot@kashiservice.com',
      password: 'Staff@123',
      color: '#4ade80',
      route: '/staff/plotting-dashboard',
    },
    {
      id: 'SOFTWARE',
      label: 'Software Engineer',
      emoji: '💻',
      email: 'aman.dev@kashiservice.com',
      password: 'Staff@123',
      color: '#38bdf8',
      route: '/staff/software-dashboard',
    },
  ];

  const handleSelectDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setSelectedDemo(acc.id);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password');
      return;
    }

    setIsSubmitting(true);
    const res = await login({ email, password });
    setIsSubmitting(false);

    if (res.success) {
      const biz = (res.data?.user?.targetBusiness || 'PARLOUR').toUpperCase();
      if (biz === 'EVENTS') {
        navigate('/staff/event-dashboard');
      } else if (biz === 'PLOTTING') {
        navigate('/staff/plotting-dashboard');
      } else if (biz === 'SOFTWARE') {
        navigate('/staff/software-dashboard');
      } else {
        navigate('/staff/dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Staff login failed. Please verify credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #faf5ff 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '36px 32px',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <img
              src="/kashi-logo.png"
              alt="Kashi Service Logo"
              style={{
                maxHeight: '68px',
                maxWidth: '250px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px', color: '#0f172a' }}>
            Staff & Employee Portal
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            Sign in with your email & password to access your vertical dashboard
          </p>
        </div>

        {/* 1-Click Demo Accounts by Business Vertical */}
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 14px',
            background: '#faf5ff',
            border: '1px solid #e9d5ff',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#7e22ce' }}>
              ⚡ 1-Click Auto Fill Vertical Test Staff
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {demoAccounts.map((acc) => {
              const isSelected = selectedDemo === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: isSelected ? `2px solid ${acc.color}` : '1px solid #e2e8f0',
                    background: isSelected ? '#ffffff' : '#f8fafc',
                    color: '#0f172a',
                    fontSize: '12px',
                    fontWeight: isSelected ? '750' : '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{acc.emoji}</span>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '750', color: isSelected ? '#0f172a' : '#334155' }}>{acc.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
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
          {/* Email Address Only */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Staff Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. staff@blossom.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSelectedDemo(null);
              }}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
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
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
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
                  color: '#64748b',
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
              background: 'linear-gradient(135deg, #7e22ce, #6b21a8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: '0 8px 20px rgba(126, 34, 206, 0.25)',
              transition: 'opacity 0.2s ease',
            }}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Staff Portal'}
          </button>
        </form>

        {/* OR Divider & Google Staff Sign-In */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 14px', color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ padding: '0 10px' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMsg('Google Sign-In was cancelled')}
            shape="pill"
            text="continue_with"
            width="320"
          />
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          Switch portal:&nbsp;
          <a href="/admin/login" style={{ color: '#7e22ce', fontWeight: 600, textDecoration: 'underline', marginRight: '8px' }}>Salon Admin</a>|
          <a href="/student/login" style={{ color: '#7e22ce', fontWeight: 600, textDecoration: 'underline', margin: '0 8px' }}>Academy</a>|
          <a href="/customer/login" style={{ color: '#7e22ce', fontWeight: 600, textDecoration: 'underline', marginLeft: '8px' }}>Customer</a>
        </div>
      </div>
    </div>
  );
}
