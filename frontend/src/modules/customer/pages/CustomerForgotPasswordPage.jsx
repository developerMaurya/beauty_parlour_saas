/**
 * @file CustomerForgotPasswordPage.jsx
 * @description Customer Forgot / Reset Password Request Portal.
 * Allows customers to request a password reset OTP or link.
 * @module frontend/src/modules/customer/pages/CustomerForgotPasswordPage
 */

import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerForgotPasswordPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered phone or email address.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #090d16 0%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        <button
          onClick={() => navigate('/customer/login')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '1.5rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
            }}
          >
            <KeyRound size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
            Forgot Password?
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Enter your registered mobile number or email and we will send you a verification code to reset your account credentials.
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '1.75rem',
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', margin: '0 0 6px' }}>
              Reset Link Sent!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px' }}>
              We have dispatched verification instructions to <strong>{identifier}</strong>. Please check your SMS and inbox.
            </p>
            <button
              onClick={() => navigate('/customer/login')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Phone Number or Email Address
              </label>
              <input
                type="text"
                placeholder="e.g. 9876543210 or user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                fontSize: '14.5px',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                marginTop: '6px',
              }}
            >
              {loading ? 'Sending OTP...' : 'Send Reset Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

