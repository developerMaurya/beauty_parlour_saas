/**
 * @file GlobalCustomerAuthModal.jsx
 * @description Professional Global Customer Authentication Modal.
 * Offers clean gateway choice between:
 *  1. Continue with Google (Authentic Material 3 Google flow)
 *  2. Continue with Email & Password
 *  3. Create New Account
 * Fixes viewport cut-off with safe padding and scrollable container.
 * @module frontend/src/components/common/GlobalCustomerAuthModal
 */

import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { X, ArrowLeft, Mail, Lock, Phone, User, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function GlobalCustomerAuthModal() {
  const { authModalOpen, closeAuthModal, authModalPrompt, login, register, loginWithGoogle } = useCustomer();
  const { addToast } = useToast() || { addToast: () => {} };

  // Screen view: 'gateway' | 'google' | 'email_login' | 'register'
  const [view, setView] = useState('gateway');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [googleEmail, setGoogleEmail] = useState('errbmaurya@gmail.com');
  const [loginIdentifier, setLoginIdentifier] = useState('errbmaurya@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Fields
  const [regName, setRegName] = useState('Rambabu Maurya');
  const [regEmail, setRegEmail] = useState('errbmaurya@gmail.com');
  const [regPhone, setRegPhone] = useState('7651972973');
  const [regPassword, setRegPassword] = useState('');

  // Reset to gateway on modal open
  useEffect(() => {
    if (authModalOpen) {
      setView('gateway');
      setErrorMsg('');
      setLoginPassword('');
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  // 1. Google Authentication Submit
  const handleGoogleSubmit = async (targetEmail, targetName) => {
    const emailToUse = (targetEmail || googleEmail || 'errbmaurya@gmail.com').trim().toLowerCase();
    const nameToUse = targetName || (emailToUse.includes('@') ? emailToUse.split('@')[0] : 'Google User');

    if (!emailToUse.includes('@')) {
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
      addToast?.(`Signed in with Google (${emailToUse})! Welcome, ${user.name}`, 'success');
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Standard Email/Phone + Password Submit
  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both Email/Phone and Password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(loginIdentifier.trim(), loginPassword.trim());
      addToast?.(`Welcome back, ${user?.name || 'Customer'}!`, 'success');
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('All fields (Name, Email, Mobile, Password) are required.');
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
      addToast?.(`Account created successfully! Welcome, ${user.name}`, 'success');
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '36px 16px 40px',
        boxSizing: 'border-box',
        fontFamily: "'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      {/* Modal Container */}
      <div
        style={{
          width: '100%',
          maxWidth: view === 'google' ? '540px' : '480px',
          margin: 'auto 0',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          color: '#1f2937',
          transition: 'max-width 0.2s ease',
        }}
      >
        {/* Top Header Row with Close & Back Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px 14px',
            borderBottom: '1px solid #f1f5f9',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {view !== 'gateway' ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setView('gateway');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '6px 12px 6px 8px',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                }}
              >
                <Sparkles size={12} />
                GLOBAL CUSTOMER LOGIN
              </div>
            )}
          </div>

          <button
            onClick={closeAuthModal}
            aria-label="Close"
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            style={{
              margin: '14px 24px 0',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '13px',
              lineHeight: 1.4,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* =========================================================================
            VIEW 1: GATEWAY (User chooses Google or Email/Password)
           ========================================================================= */}
        {view === 'gateway' && (
          <div style={{ padding: '24px 28px 28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                Sign In to Your Account
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                {authModalPrompt || 'One unified account for Beauty Parlour, Event Decor, Plotting, Rent & Tech Hub.'}
              </p>
            </div>

            {/* Quick 1-Click Saved Account */}
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => handleGoogleSubmit('errbmaurya@gmail.com', 'Rambabu Maurya')}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.background = '#f0f7ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#ea4335',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '16px',
                    }}
                  >
                    R
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Rambabu Maurya</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>errbmaurya@gmail.com</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0b57d0', fontSize: '12.5px', fontWeight: 700 }}>
                  <span>1-Click Login</span>
                  <span>→</span>
                </div>
              </button>
            </div>

            {/* ACTION 1: CONTINUE WITH GOOGLE BUTTON */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setView('google')}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1.5px solid #d1d5db',
                  padding: '13px 18px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* ACTION 2: CONTINUE WITH EMAIL / MOBILE */}
              <button
                type="button"
                onClick={() => setView('email_login')}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '13px 18px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1e293b')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#0f172a')}
              >
                <Mail size={18} />
                <span>Continue with Email & Password</span>
              </button>
            </div>

            {/* Bottom Register Prompt */}
            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    padding: 0,
                  }}
                >
                  Create new account
                </button>
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: GOOGLE SIGN-IN (Material 3 Card UI matching user screenshot)
           ========================================================================= */}
        {view === 'google' && (
          <div style={{ padding: '28px 32px 32px' }}>
            {/* Google G Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <svg width="34" height="34" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#444746' }}>Google</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#1f1f1f', margin: '0 0 6px 0' }}>
              Sign in with Google
            </h1>
            <p style={{ fontSize: '14.5px', color: '#444746', margin: '0 0 20px 0' }}>
              Choose or enter your Google Account to continue to Kashi Services
            </p>

            {/* Quick 1-click Account Pill */}
            <div
              onClick={() => handleGoogleSubmit('errbmaurya@gmail.com', 'Rambabu Maurya')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: '#f8fafd',
                border: '1.5px solid #c4c7c5',
                borderRadius: '12px',
                marginBottom: '18px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0b57d0')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#c4c7c5')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#ea4335',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  R
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1f1f1f' }}>Rambabu Maurya</div>
                  <div style={{ fontSize: '12px', color: '#444746' }}>errbmaurya@gmail.com</div>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: '#0b57d0', fontWeight: 600 }}>1-Click Sign In</span>
            </div>

            {/* Material 3 Outlined Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleGoogleSubmit(googleEmail); }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', color: '#444746', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Or enter another Google Email
                </label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '10px 14px',
                    fontSize: '15px',
                    color: '#1f1f1f',
                    border: '1px solid #747775',
                    borderRadius: '6px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.border = '2px solid #0b57d0')}
                  onBlur={(e) => (e.target.style.border = '1px solid #747775')}
                />
              </div>

              {/* Guest mode note */}
              <div style={{ fontSize: '12.5px', color: '#444746', lineHeight: 1.45, marginBottom: '24px' }}>
                Not your computer? Use Guest mode to sign in privately.{' '}
                <span style={{ color: '#0b57d0', fontWeight: 600, cursor: 'pointer' }}>
                  Learn more
                </span>
              </div>

              {/* Bottom Action Row (Create account left, Next blue pill right) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0b57d0',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Create account
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: '#0b57d0',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 28px',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(11, 87, 208, 0.3)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0842a0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#0b57d0')}
                >
                  {loading ? 'Authenticating...' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: EMAIL & PASSWORD LOGIN
           ========================================================================= */}
        {view === 'email_login' && (
          <div style={{ padding: '24px 28px 28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                Sign In with Password
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Enter your registered email address or mobile number.
              </p>
            </div>

            <form onSubmit={handleEmailLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
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
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '11px 14px 11px 40px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Password
                  </label>
                  <span
                    onClick={() => setView('google')}
                    style={{ fontSize: '11.5px', color: '#0b57d0', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Use Google Sign-In instead
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '11px 40px 11px 40px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  marginTop: '6px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In & Continue →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Register here
                  </button>
                </span>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            VIEW 4: CREATE ACCOUNT (REGISTER)
           ========================================================================= */}
        {view === 'register' && (
          <div style={{ padding: '24px 28px 28px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                Create Customer Account
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Register to track bookings, leases, stage decors, and software requests.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rambabu Maurya"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Mobile Number (WhatsApp) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 7651972973"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      fontSize: '13px',
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
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  marginTop: '6px',
                }}
              >
                {loading ? 'Creating Account...' : 'Complete Registration →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('gateway')}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
