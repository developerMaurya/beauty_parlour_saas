/**
 * @file Login.jsx
 * @description Super Admin Luxury Split-Screen Authentication Screen
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Database, Layers, Eye, EyeOff, Check } from 'lucide-react';

export const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoCreds, setDemoCreds] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    let isMounted = true;
    const fetchCreds = async () => {
      try {
        const res = await fetch('/api/v1/common/demo-credentials');
        const data = await res.json();
        if (isMounted && data?.success && data?.data) {
          setDemoCreds(data.data.credentials?.superadmin);
        }
      } catch (e) {
        console.warn('Could not fetch demo credentials:', e);
      }
    };
    fetchCreds();
    return () => {
      isMounted = false;
    };
  }, []);

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
    const email = demoCreds?.email || 'superadmin@beautysaas.local';
    const pwd = demoCreds?.password || 'SuperAdmin@Secure2026!';
    setEmailOrUsername(email);
    setPassword(pwd);
    setErrorMsg('');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleInstantLogin = async () => {
    const email = demoCreds?.email || 'superadmin@beautysaas.local';
    const pwd = demoCreds?.password || 'SuperAdmin@Secure2026!';
    setEmailOrUsername(email);
    setPassword(pwd);
    setErrorMsg('');
    setIsLoading(true);
    try {
      await login(email, pwd);
      success('Master Super Admin authenticated! Opening Dashboard...', 'Welcome');
      navigate('/superadmin/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials or unauthorized role');
    } finally {
      setIsLoading(false);
    }
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
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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

          {/* Quick Demo Pre-fill & 1-Click Instant Login */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <Database className="w-3.5 h-3.5" />
              <span>Database Master Admin Credentials</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.85rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ padding: '2px 6px', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                superadmin@beautysaas.local
              </span>
              <span>•</span>
              <span style={{ padding: '2px 6px', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                SuperAdmin@Secure2026!
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                type="button"
                id="btn-autofill-creds"
                className="btn btn-secondary btn-sm"
                onClick={handleQuickFill}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.78rem' }}
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isCopied ? 'Filled!' : '⚡ Auto-Fill'}</span>
              </button>

              <button
                type="button"
                id="btn-instant-login"
                className="btn btn-primary btn-sm"
                onClick={handleInstantLogin}
                disabled={isLoading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.78rem' }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>🚀 1-Click Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
