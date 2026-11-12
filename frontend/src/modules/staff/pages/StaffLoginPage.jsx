/**
 * @file StaffLoginPage.jsx
 * @description Dedicated Staff Authentication Screen with Email & Password Only (No Salon/Tenant ID input required).
 * Supports automatic tenant resolution, dynamic vertical routing (Parlour, Event, Plotting, Software), and 1-click test credentials.
 * @module frontend/src/modules/staff/pages/StaffLoginPage
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Database, Check, Sparkles } from 'lucide-react';
import { useStaff } from '../../../context/StaffContext.jsx';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const { login } = useStaff();
  const navigate = useNavigate();

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
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 14px',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
            }}
          >
            ⚡
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Staff & Employee Portal
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Sign in with your email & password to access your vertical dashboard
          </p>
        </div>

        {/* 1-Click Demo Accounts by Business Vertical */}
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 14px',
            background: 'rgba(236, 72, 153, 0.08)',
            border: '1px solid rgba(236, 72, 153, 0.25)',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#f472b6' }}>
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
                    border: isSelected ? `1.5px solid ${acc.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{acc.emoji}</span>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: acc.color }}>{acc.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
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
          {/* Email Address Only */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
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

          {/* Password */}
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
