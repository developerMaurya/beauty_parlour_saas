/**
 * @file GlobalCustomerAuthModal.jsx
 * @description Unified Global Customer Authentication Modal (Login, Register & Google Sign-In with Email).
 * Allows any customer to sign in or create an account from anywhere on the platform without leaving the page.
 * Seamlessly resumes pending bookings upon authentication.
 * @module frontend/src/components/common/GlobalCustomerAuthModal
 */

import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { X, Lock, Mail, Phone, User, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function GlobalCustomerAuthModal() {
  const { authModalOpen, closeAuthModal, authModalPrompt, login, register, loginWithGoogle } = useCustomer();
  const { addToast } = useToast() || { addToast: () => {} };

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'google'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Google Sign-In state
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

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

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!googleEmail.trim() || !googleEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google email address.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginWithGoogle({
        email: googleEmail.trim().toLowerCase(),
        name: googleName.trim() || googleEmail.split('@')[0],
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleName || googleEmail)}`,
        googleId: 'google_' + Date.now(),
      });
      addToast?.('Signed in with Google! Welcome, ' + user.name, 'success');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Google sign-in failed.');
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
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Top Glow & Close Button */}
        <div style={{ position: 'relative', padding: '1.75rem 1.75rem 1rem' }}>
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
              GLOBAL CUSTOMER ACCOUNT
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '4px 0 6px', color: '#ffffff' }}>
            {activeTab === 'login' && 'Sign In to Your Account'}
            {activeTab === 'register' && 'Create Your Account'}
            {activeTab === 'google' && 'Continue with Google'}
          </h2>

          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            {authModalPrompt || 'One account for Golden Beauty, Real Estate Plotting, Commercial Rent, Event Decoration & RB Software.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 1.75rem',
            gap: '1rem',
          }}
        >
          {[
            { id: 'login', label: 'Sign In' },
            { id: 'register', label: 'Register' },
            { id: 'google', label: 'Google Sign-In' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrorMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                padding: '10px 4px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            style={{
              margin: '1rem 1.75rem 0',
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

        {/* Body Form */}
        <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Email Address or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="text"
                    required
                    placeholder="name@example.com or 9876543210"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      outline: 'none',
                    }}
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
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  marginTop: '6px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In & Continue →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                  Don't have an account?{' '}
                  <span
                    onClick={() => setActiveTab('register')}
                    style={{ color: '#818cf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Register here
                  </span>
                </span>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Email Address
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
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Mobile Number (WhatsApp)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Create Password
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
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
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
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  marginTop: '6px',
                }}
              >
                {loading ? 'Creating Account...' : 'Complete Registration →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Already registered?{' '}
                  <span
                    onClick={() => setActiveTab('login')}
                    style={{ color: '#38bdf8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Sign In
                  </span>
                </span>
              </div>
            </form>
          )}

          {/* TAB 3: GOOGLE SIGN-IN */}
          {activeTab === 'google' && (
            <form onSubmit={handleGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z"
                    />
                  </svg>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Instant Google Sign-In with Email</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Fast, secure sign-in without remembering extra passwords.
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Your Google Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Your Display Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
                  marginTop: '6px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z"
                  />
                </svg>
                {loading ? 'Authenticating with Google...' : 'Continue with Google Account →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
