/**
 * @file TenantProvisionedSuccessModal.jsx
 * @description Instant Tenant Provisioning Receipt & Access Launchpad (Clean White Theme).
 * Displays:
 *   1. Generated Public Website URL
 *   2. Private Admin Dashboard URL
 *   3. Login Credentials (Salon ID, Email, Password) with 1-click copy
 *   4. Direct 1-Click "Launch Admin Dashboard" and "View Storefront" buttons
 * @module frontend/src/modules/public/components/TenantProvisionedSuccessModal
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  ArrowRight,
  Globe,
  Key,
  X,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext.jsx';

export default function TenantProvisionedSuccessModal({ data, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [copiedField, setCopiedField] = useState(null);

  if (!data) return null;

  const tenant = data?.tenant || data;
  const credentials = data?.credentials || {
    email: data?.adminUser?.email || tenant?.email || 'admin@yourbusiness.com',
    password: data?.rawPassword || 'Password@123',
    tenantSlug: tenant?.slug || 'my-tenant',
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleGoToAdmin = () => {
    if (tenant?.slug) {
      localStorage.setItem('active_tenant_slug', tenant.slug);
      sessionStorage.setItem('current_tenant_slug', tenant.slug);
    }
    navigate(`/admin/login?tenant=${tenant?.slug || ''}`);
  };

  const handleGoToWebsite = () => {
    if (tenant?.slug) {
      sessionStorage.setItem('current_tenant_slug', tenant.slug);
      navigate(`/site/${tenant.slug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Celebration Header */}
        <div
          style={{
            padding: '2rem 2rem 1.5rem',
            background: '#ecfdf5',
            borderBottom: '1px solid #d1fae5',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>

          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
            }}
          >
            <CheckCircle2 size={34} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#065f46', margin: '0 0 6px' }}>
            {tenant?.name || 'Your Business'} is Live!
          </h2>
          <p style={{ fontSize: '13px', color: '#047857', margin: 0 }}>
            Database schemas generated • Admin account provisioned • 14-day free trial active
          </p>
        </div>

        {/* Credentials & Access URLs */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Credentials Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🔑 Your Private Admin Login Credentials
              </span>
              <button
                onClick={() => copyToClipboard(`Salon ID: ${credentials.tenantSlug}\nEmail: ${credentials.email}\nPassword: ${credentials.password}`, 'Credentials')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {copiedField === 'Credentials' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedField === 'Credentials' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Tenant ID / Slug</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>{credentials.tenantSlug}</div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Admin Email</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>{credentials.email}</div>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Admin Password</div>
                <div style={{ fontWeight: 800, color: '#059669', fontSize: '13px' }}>{credentials.password}</div>
              </div>
            </div>
          </div>

          {/* Action Launch Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleGoToAdmin}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
              }}
            >
              <span>Launch Admin Dashboard</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleGoToWebsite}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>View Public Storefront</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
