/**
 * @file AdminLoginPage.jsx
 * @description Tenant Admin Login Screen with Tenant ID/Slug resolution, Dynamic DB Credential Auto-Fill, and Password Visibility Toggle.
 * @module frontend/src/modules/admin/pages/AdminLoginPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Building, ArrowRight, Eye, EyeOff, Database, Check } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoData, setDemoData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Dynamically load active demo credentials directly from Database
  useEffect(() => {
    let isMounted = true;
    const fetchDemoCredentials = async () => {
      try {
        const res = await fetch('/api/v1/common/demo-credentials');
        const data = await res.json();
        if (isMounted && data?.success && data?.data) {
          setDemoData(data.data);
          // If fields are empty, pre-populate slug from active DB tenant
          if (!tenantSlugOrId && data.data.tenant?.slug) {
            setTenantSlugOrId(data.data.tenant.slug);
          }
        }
      } catch (err) {
        console.warn('Could not fetch dynamic demo credentials:', err);
      }
    };

    fetchDemoCredentials();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAutoFill = () => {
    if (demoData?.credentials?.admin) {
      setTenantSlugOrId(demoData.credentials.admin.tenantSlug || 'blossom-salon');
      setEmail(demoData.credentials.admin.email || 'admin@parlour.local');
      setPassword(demoData.credentials.admin.password || 'Password@123');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      toast.success('Database demo credentials auto-filled successfully!');
    } else {
      setTenantSlugOrId('blossom-salon');
      setEmail('admin@parlour.local');
      setPassword('Password@123');
      toast.success('Default demo credentials auto-filled!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenantSlugOrId) {
      toast.error('Please enter your Salon / Studio ID or Slug');
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
          maxWidth: '460px',
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Multi-Tenant Business Operations Portal
          </p>
        </div>

        {/* Dynamic Database Auto-Fill Action Banner */}
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.85rem 1rem',
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database className="w-4 h-4 text-pink-400" />
            <div style={{ fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 600 }}>
              Live DB Credentials Ready
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 4px 10px rgba(236, 72, 153, 0.3)',
            }}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : null}
            {isCopied ? 'Filled!' : '⚡ Auto-Fill Credentials'}
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tenant Identifier */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                Salon / Studio ID or Slug
              </label>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                (Salon ka unique ID)
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Building
                className="w-4 h-4"
                style={{ position: 'absolute', left: '0.9rem', color: '#64748b' }}
              />
              <input
                type="text"
                value={tenantSlugOrId}
                onChange={(e) => setTenantSlugOrId(e.target.value)}
                placeholder="e.g. blossom-salon"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                Email Address
              </label>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                (Admin email id)
              </span>
            </div>
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

          {/* Password with View Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                Password
              </label>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                (Admin password)
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock
                className="w-4 h-4"
                style={{ position: 'absolute', left: '0.9rem', color: '#64748b' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
                style={{
                  paddingLeft: '2.6rem',
                  paddingRight: '2.8rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              marginTop: '0.5rem',
              height: '46px',
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

        {/* Dynamic Credentials Details Card */}
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Database Active Credentials
            </span>
            <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
              ● Live DB
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Salon ID / Slug:</span>
              <code style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                {demoData?.credentials?.admin?.tenantSlug || 'blossom-salon'}
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Admin Email:</span>
              <code style={{ color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                {demoData?.credentials?.admin?.email || 'admin@parlour.local'}
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Admin Password:</span>
              <code style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                {demoData?.credentials?.admin?.password || 'Password@123'}
              </code>
            </div>
          </div>
        </div>

        {/* Other Portals Switcher */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
          Switch portal:&nbsp;
          <a href="/superadmin/login" style={{ color: '#94a3b8', textDecoration: 'underline', marginRight: '8px' }}>Super Admin</a>|
          <a href="/staff/login" style={{ color: '#94a3b8', textDecoration: 'underline', margin: '0 8px' }}>Staff</a>|
          <a href="/student/login" style={{ color: '#94a3b8', textDecoration: 'underline', margin: '0 8px' }}>Academy</a>|
          <a href="/customer/login" style={{ color: '#94a3b8', textDecoration: 'underline', marginLeft: '8px' }}>Customer</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
