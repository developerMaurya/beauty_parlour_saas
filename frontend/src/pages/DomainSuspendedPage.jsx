/**
 * @file DomainSuspendedPage.jsx
 * @description Access Restricted / Domain Suspended Screen when SuperAdmin blocks custom domain or tenant access.
 * @module frontend/src/pages/DomainSuspendedPage
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowRight, RefreshCw } from 'lucide-react';

export const DomainSuspendedPage = () => {
  const [searchParams] = useSearchParams();
  const customMessage =
    searchParams.get('msg') ||
    'Connect to Super Admin for access to your website portal.';
  const domain = searchParams.get('domain') || window.location.hostname;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #2e1065 0%, #090d16 100%)',
        padding: '24px',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(23, 23, 37, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '20px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#ef4444',
          }}
        >
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em', color: '#fff' }}>
          Portal Access Restricted
        </h1>

        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', fontSize: '12px', color: '#f87171', marginBottom: '20px' }}>
          Domain: <code>{domain}</code>
        </div>

        <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '28px' }}>
          {customMessage}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
          <a
            href="mailto:superadmin@beautysaas.local?subject=Portal%20Access%20Activation%20Request"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(236, 72, 153, 0.35)',
            }}
          >
            <Mail className="w-4 h-4" />
            Contact Super Admin Support
          </a>

          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 20px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        </div>

        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', fontSize: '12px', color: '#64748b' }}>
          Platform Administrator?{' '}
          <a href="/superadmin/login" style={{ color: '#a78bfa', textDecoration: 'underline' }}>
            Sign In to Super Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default DomainSuspendedPage;
