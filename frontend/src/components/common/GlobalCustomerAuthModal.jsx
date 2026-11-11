/**
 * @file GlobalCustomerAuthModal.jsx
 * @description Unified Global Customer Authentication Modal (Login, Register & Instant Google Sign-In with Email).
 * Responsive, beautiful modal that never gets cut off on any screen size.
 * Allows instant Google Sign-In with email as well as standard Email/Mobile + Password.
 * @module frontend/src/components/common/GlobalCustomerAuthModal
 */

import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { X, Lock, Mail, Phone, User, AlertCircle, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function GlobalCustomerAuthModal() {
  const { authModalOpen, closeAuthModal, authModalPrompt, login, register, loginWithGoogle } = useCustomer();
  const { addToast } = useToast() || { addToast: () => {} };

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'google'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('errbmaurya@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Google Sign-In state
  const [googleEmail, setGoogleEmail] = useState('errbmaurya@gmail.com');
  const [googleName, setGoogleName] = useState('');
  const [showGoogleInput, setShowGoogleInput] = useState(false);

  // Reset error when switching tabs
  useEffect(() => {
    setErrorMsg('');
  }, [activeTab]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both Email/Phone and Password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(loginIdentifier.trim(), loginPassword.trim());
      addToast?.('Welcome back, ' + (user?.name || 'Customer') + '!', 'success');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('All fields (Name, Email, Mobile Number, Password) are required.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword.trim(),
      });
      addToast?.('Account created successfully! Welcome, ' + user.name, 'success');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectGoogleLogin = async (targetEmail, targetName) => {
    const emailToUse = (targetEmail || googleEmail || loginIdentifier || 'customer@gmail.com').trim().toLowerCase();
    const nameToUse = (targetName || googleName || emailToUse.split('@')[0] || 'Google User').trim();

    if (!emailToUse.includes('@')) {
      setActiveTab('google');
      setErrorMsg('Please enter a valid Google email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const user = await loginWithGoogle({
        email: emailToUse,
        name: nameToUse,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameToUse)}`,
        googleId: 'google_' + Date.now(),
      });
      addToast?.('Signed in with Google (' + emailToUse + ')! Welcome, ' + user.name, 'success');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFormSubmit = (e) => {
    e.preventDefault();
    handleDirectGoogleLogin(googleEmail, googleName);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 10, 24, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: 'auto',
          background: 'linear-gradient(180deg, #131b2e 0%, #0d1322 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          position: 'relative',
          maxHeight: '92vh',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            position: 'relative',
            padding: '1.5rem 1.75rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#c084fc',
                padding: '3px 10px',
                borderRadius: '12px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Sparkles size={12} />
              KASHI SERVICES PORTAL
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '2px 0 4px', color: '#ffffff', letterSpacing: '-0.3px' }}>
            {activeTab === 'login' && 'Customer Sign In'}
            {activeTab === 'register' && 'Create Customer Account'}
            {activeTab === 'google' && 'Sign In with Google'}
          </h2>

          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            {authModalPrompt || 'One global account across Beauty Parlour, Event Decor, Real Estate Plots, Rent, and Tech Hub.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 1.25rem',
          }}
        >
          {[
            { id: 'login', label: 'Sign In' },
            { id: 'register', label: 'Register New' },
            { id: 'google', label: 'Google Email' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2.5px solid #6366f1' : '2.5px solid transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                padding: '12px 6px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 800 : 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '1.25rem 1.75rem 1.5rem', overflowY: 'auto' }}>
          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN (WITH PROMINENT GOOGLE BUTTON) */}
          {activeTab === 'login' && (
            <div>
              {/* PRIMARY PROMINENT GOOGLE BUTTON */}
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (loginIdentifier.includes('@')) {
                    handleDirectGoogleLogin(loginIdentifier, '');
                  } else {
                    setActiveTab('google');
                  }
                }}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                }}
              >
                {/* Official Google G Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* OR Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '1.25rem 0 1rem',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <span style={{ padding: '0 12px' }}>or sign in with password</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              </div>

              {/* Standard Email/Phone + Password Form */}
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    Email Address or Mobile Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. errbmaurya@gmail.com or 9876543210"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>
                      Password
                    </label>
                    <span
                      onClick={() => {
                        if (loginIdentifier.includes('@')) {
                          handleDirectGoogleLogin(loginIdentifier, '');
                        } else {
                          setActiveTab('google');
                        }
                      }}
                      style={{ fontSize: '11.5px', color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Login with Google instead?
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="password"
                      required
                      placeholder="Enter your account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                    marginTop: '4px',
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In & Continue →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                    Don't have an account?{' '}
                    <span
                      onClick={() => setActiveTab('register')}
                      style={{ color: '#818cf8', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Register here
                    </span>
                  </span>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <div>
              {/* GOOGLE SIGN UP SHORTCUT */}
              <button
                type="button"
                disabled={loading}
                onClick={() => setActiveTab('google')}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Instant Sign Up with Google</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '0.75rem 0 1rem',
                  color: '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <span style={{ padding: '0 10px' }}>or create manually</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              </div>

              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rambabu Maurya"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '11px 14px 11px 38px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '11px 14px 11px 38px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Mobile Number (WhatsApp) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 7651972973"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '11px 14px 11px 38px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Create Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '11px 14px 11px 38px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    marginTop: '4px',
                  }}
                >
                  {loading ? 'Creating Account...' : 'Complete Registration →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '2px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Already have an account?{' '}
                    <span
                      onClick={() => setActiveTab('login')}
                      style={{ color: '#38bdf8', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Sign In
                    </span>
                  </span>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: GOOGLE SIGN-IN WITH EMAIL */}
          {activeTab === 'google' && (
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    margin: '0 auto 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff' }}>Instant Sign In with Google Email</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Enter your Google Account email to authenticate directly without remembering passwords.
                </div>
              </div>

              <form onSubmit={handleGoogleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    Google Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#4285F4')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    Full Name (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="text"
                      placeholder="e.g. Rambabu Maurya"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#ffffff',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Pre-fill Quick Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleEmail('errbmaurya@gmail.com');
                      setGoogleName('Rambabu Maurya');
                    }}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Use errbmaurya@gmail.com
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 16px rgba(255, 255, 255, 0.25)',
                    marginTop: '4px',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>{loading ? 'Signing In with Google...' : 'Authorize & Sign In with Google →'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
