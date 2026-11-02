/**
 * @file Login.jsx
 * @description Super Admin Luxury Split-Screen Authentication Screen
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

export const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setErrorMsg('Please enter both email/username and password');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      await login(emailOrUsername, password);
      success('Authentication successful! Loading control plane...', 'Welcome');
      navigate('/superadmin/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials or unauthorized role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmailOrUsername('superadmin@beautysaas.local');
    setPassword('SuperAdmin@Secure2026!');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Left Feature Showcase Banner */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
          borderRight: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '10px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              Beauty SaaS
            </span>
            <span className="brand-badge">Super Admin</span>
          </div>

          <h1 style={{ fontSize: '2.75rem', lineHeight: 1.15, marginBottom: '1.5rem', maxWidth: '500px' }}>
            Autonomous Multi-Tenant Control Plane.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '460px' }}>
            White-label beauty parlour, salon, spa and academy management with configurable multi-database architecture and zero-trust tenant isolation.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34D399',
              }}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Shared & Separate Multi-DB</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Per-tenant MongoDB databases with dynamic pooling
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Zero-Trust Isolation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Strict tenant context validation and immutable audit trails
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Super Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Enter your master administrative credentials to access the SaaS control panel.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--color-danger-bg)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  className="w-4 h-4"
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="superadmin@beautysaas.local"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Master Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  className="w-4 h-4"
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                'Authenticating...'
              ) : (
                <>
                  <span>Sign In to Control Plane</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Bootstrap Super Admin Credentials
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleQuickFill}
              style={{ width: '100%' }}
            >
              Auto-fill Master Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
