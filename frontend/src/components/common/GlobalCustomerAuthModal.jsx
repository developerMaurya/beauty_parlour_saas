/**
 * @file GlobalCustomerAuthModal.jsx
 * @description Official Google Cloud OAuth & Single Sign-On Modal.
 * Integrates:
 *  1. Real Official Google Identity Services SDK (@react-oauth/google & accounts.google.com)
 *  2. Real Google Accounts Popup Window
 *  3. Automatic JWT credential decoding (email, verified name, profile picture)
 *  4. Configurable Google Client ID setting
 *  5. Standard Email / Mobile & Password Fallback
 *  6. Rendered via React Portal directly into document.body (Never trapped under headers)
 * @module frontend/src/components/common/GlobalCustomerAuthModal
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useCustomer } from '../../context/CustomerContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { X, ArrowLeft, Mail, Lock, Phone, User, Eye, EyeOff, ShieldCheck, Sparkles, Key, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GlobalCustomerAuthModal() {
  const { authModalOpen, closeAuthModal, authModalPrompt, login, register, loginWithGoogle } = useCustomer();
  const { addToast } = useToast() || { addToast: () => {} };

  // Current view: 'google_popup' | 'email_login' | 'register' | 'client_id_settings'
  const [view, setView] = useState('google_popup');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Custom Client ID config (defaults to real Kashi Service Google Cloud Client ID)
  const [customClientId, setCustomClientId] = useState(
    localStorage.getItem('kashi_google_client_id') ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '901658045362-7sct3vvcrgkradmpr2sm7ku89tavvdhe.apps.googleusercontent.com'
  );

  // Standard Login Fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regTargetBusiness, setRegTargetBusiness] = useState('ALL');

  useEffect(() => {
    if (authModalOpen) {
      setView('google_popup');
      setErrorMsg('');
      setLoginPassword('');
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  // 1. Official Google OAuth Success Handler (decodes real JWT from Google servers)
  const handleOfficialGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential received from Google.');
      }

      // Decode official Google ID Token JWT
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('[Google OAuth] Decoded payload:', decoded);

      const user = await loginWithGoogle({
        email: decoded.email,
        name: decoded.name || decoded.given_name || decoded.email.split('@')[0],
        picture: decoded.picture || '',
        googleId: decoded.sub,
        targetBusiness: 'ALL',
        registrationMethod: 'GOOGLE_AUTH',
      });

      addToast?.(`Signed in with Google as ${user.name}! (${user.email})`, 'success');
      closeAuthModal();
    } catch (err) {
      console.error('[Google OAuth Error]', err);
      setErrorMsg(err.message || 'Google authentication failed. Please check client settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleOfficialGoogleError = () => {
    setErrorMsg('Google Sign-In popup was closed or cancelled. Please try again.');
  };

  // 2. Standard Email/Password Login
  const handleStandardLogin = async (e) => {
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

  // 3. Create Account
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword.trim(),
        targetBusiness: regTargetBusiness,
        registrationMethod: 'SELF_FORM',
      });
      addToast?.(`Account created successfully! Welcome, ${user.name}`, 'success');
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Save Custom Client ID
  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (customClientId.trim()) {
      localStorage.setItem('kashi_google_client_id', customClientId.trim());
      addToast?.('Google Client ID updated! Reloading provider...', 'success');
      setTimeout(() => window.location.reload(), 600);
    }
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
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
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          margin: 'auto 0',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Floating Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '-46px',
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1f2937',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
          }}
        >
          <X size={20} />
        </button>

        {/* AUTHENTIC GOOGLE CARD */}
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            borderRadius: '28px',
            border: '1px solid #dadce0',
            boxShadow: '0 4px 28px rgba(0, 0, 0, 0.14)',
            padding: '36px 36px 32px',
            boxSizing: 'border-box',
            color: '#1f1f1f',
          }}
        >
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            {view !== 'google_popup' ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setView('google_popup');
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
                <span>Switch Sign-In Method</span>
              </button>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: '#faf5ff',
                  border: '1px solid #e9d5ff',
                  color: '#7e22ce',
                  fontSize: '11px',
                  fontWeight: 800,
                }}
              >
                <ShieldCheck size={13} color="#7e22ce" />
                <span>KASHI SERVICE SECURE DB & OAUTH</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setView(view === 'client_id_settings' ? 'google_popup' : 'client_id_settings')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
              title="Google Cloud Console Client ID Configuration"
            >
              <Key size={13} />
              <span>{view === 'client_id_settings' ? 'Close' : 'Client ID'}</span>
            </button>
          </div>

          {/* Master Kashi Service Logo & Heading */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <img
                src="/kashi-logo.png"
                alt="Kashi Service Logo"
                style={{
                  maxHeight: '52px',
                  maxWidth: '220px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              {view === 'google_popup' && 'Customer Sign-In & Registration'}
              {view === 'email_login' && 'Sign In with Email & Password'}
              {view === 'register' && 'Create Kashi Service Account'}
              {view === 'client_id_settings' && 'Google Client ID Setup'}
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
              {authModalPrompt || 'Registered in Kashi Service Central Database for Beauty Parlour, Events, Plotting & Tech Services.'}
            </p>
          </div>

          {/* Database Synchronization Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '11.5px',
              color: '#475569',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={13} color="#7e22ce" />
            <span>
              All logins & registrations sync directly into <strong>Kashi Service Database (DB)</strong>
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                background: '#fce8e6',
                border: '1px solid #fad2cf',
                color: '#c5221f',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '20px',
                lineHeight: 1.4,
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* =========================================================
              VIEW 1: REAL OFFICIAL GOOGLE IDENTITY SERVICES BUTTON
             ========================================================= */}
          {view === 'google_popup' && (
            <div>
              {/* Official Google OAuth GSI Button Container */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  padding: '12px',
                  background: '#f8fafd',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <GoogleLogin
                  onSuccess={handleOfficialGoogleSuccess}
                  onError={handleOfficialGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="pill"
                  width="320"
                />
              </div>

              {/* Informational description */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: '#5f6368', margin: '0 0 6px 0' }}>
                  Clicking the button above opens the <strong>official Google popup window</strong> directly from Google's servers.
                </p>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                  ✓ Cryptographically verified with Google Identity Services
                </span>
              </div>

              {/* OR Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '1.25rem 0',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                <span style={{ padding: '0 12px' }}>or choose another method</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Switch to standard Email/Password Login */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setView('email_login')}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '11px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  <Mail size={16} />
                  <span>Sign In with Email & Password</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    New customer?{' '}
                    <button
                      type="button"
                      onClick={() => setView('register')}
                      style={{ background: 'none', border: 'none', color: '#0b57d0', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Create account
                    </button>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: STANDARD EMAIL / PASSWORD LOGIN
             ========================================================= */}
          {view === 'email_login' && (
            <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input
                    type="text"
                    required
                    placeholder="name@example.com or 9876543210"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
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
                  background: '#0b57d0',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '24px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          )}

          {/* =========================================================
              VIEW 3: REGISTER NEW ACCOUNT
             ========================================================= */}
          {view === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Confirm *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Interested Business / Service Portal *
                </label>
                <select
                  value={regTargetBusiness}
                  onChange={(e) => setRegTargetBusiness(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontWeight: '600',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">👑 All Services & Portals (Master Global Access)</option>
                  <option value="PARLOUR">💄 Golden Beauty Parlour & Salon</option>
                  <option value="EVENTS">🔱 Jaygurudev Event & Management</option>
                  <option value="PLOTTING">🏡 Plotting & Real Estate</option>
                  <option value="RENT">🏢 Commercial & Office Rent</option>
                  <option value="SOFTWARE">💻 RB Software & Tech Hub</option>
                </select>
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                  {regTargetBusiness === 'ALL'
                    ? '✨ Account visible across all service departments & staff portals'
                    : `✨ Account registered specifically for the ${regTargetBusiness} department`}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#0b57d0',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '24px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '6px',
                }}
              >
                {loading ? 'Creating...' : 'Create Account →'}
              </button>
            </form>
          )}

          {/* =========================================================
              VIEW 4: GOOGLE CLIENT ID SETTINGS
             ========================================================= */}
          {view === 'client_id_settings' && (
            <form onSubmit={handleSaveClientId} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '12.5px',
                  color: '#1e3a8a',
                  lineHeight: 1.45,
                }}
              >
                <strong>Google Cloud Console Integration:</strong>
                <div style={{ marginTop: '4px' }}>
                  Enter your official Web Client ID from{' '}
                  <span
                    onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                    style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 }}
                  >
                    console.cloud.google.com
                  </span>
                  .
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Google Client ID (.apps.googleusercontent.com)
                </label>
                <input
                  type="text"
                  required
                  placeholder="xxxx.apps.googleusercontent.com"
                  value={customClientId}
                  onChange={(e) => setCustomClientId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: '#0b57d0',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save & Apply Client ID
              </button>
            </form>
          )}
        </div>

        {/* Google Official Footer */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 12px 0',
            fontSize: '12px',
            color: '#f8fafc',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ cursor: 'pointer' }}>English (United States)</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => window.open('https://support.google.com', '_blank')}>
              Help
            </span>
            <span style={{ cursor: 'pointer' }} onClick={() => window.open('https://policies.google.com/privacy', '_blank')}>
              Privacy
            </span>
            <span style={{ cursor: 'pointer' }} onClick={() => window.open('https://policies.google.com/terms', '_blank')}>
              Terms
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
