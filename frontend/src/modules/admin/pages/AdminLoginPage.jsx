/**
 * @file AdminLoginPage.jsx
 * @description Tenant Admin Login Screen with Tenant ID/Slug resolution and Credential Authentication.
 * @module frontend/src/modules/admin/pages/AdminLoginPage
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useTenantAdmin();
  const toast = useToast();

  const [tenantSlugOrId, setTenantSlugOrId] = useState(
    localStorage.getItem('active_tenant_slug') || localStorage.getItem('active_tenant_id') || ''
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenantSlugOrId) {
      toast.error('Please enter your Salon/Studio Tenant Identifier or Domain');
      return;
    }
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login({ tenantSlugOrId, email, password });
      toast.success('Welcome back! Logged in successfully.');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || err.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 100%)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 20px -5px rgba(236, 72, 153, 0.4)',
            }}
          >
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Salon & Studio Admin
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Multi-Tenant Business Operations Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tenant Identifier */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
              Salon / Studio ID or Slug
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Building
                className="w-4 h-4"
                style={{ position: 'absolute', left: '0.9rem', color: '#64748b' }}
              />
              <input
                type="text"
                value={tenantSlugOrId}
                onChange={(e) => setTenantSlugOrId(e.target.value)}
                placeholder="e.g. blossom-salon or tenant-id"
                required
                className="form-input"
                style={{
                  paddingLeft: '2.6rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail
                className="w-4 h-4"
                style={{ position: 'absolute', left: '0.9rem', color: '#64748b' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parlour.local"
                required
                className="form-input"
                style={{
                  paddingLeft: '2.6rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock
                className="w-4 h-4"
                style={{ position: 'absolute', left: '0.9rem', color: '#64748b' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
                style={{
                  paddingLeft: '2.6rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              marginTop: '0.5rem',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              boxShadow: '0 10px 20px -5px rgba(236, 72, 153, 0.35)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
