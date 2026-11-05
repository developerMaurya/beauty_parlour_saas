/**
 * @file TenantProvisionedSuccessModal.jsx
 * @description Instant Tenant Provisioning Receipt & Access Launchpad.
 * Displays:
 *   1. Generated Public Website URL
 *   2. Private Admin Dashboard URL
 *   3. Login Credentials (Salon ID, Email, Password) with 1-click copy
 *   4. Direct 1-Click "Launch Admin Dashboard" and "View Storefront" buttons
 * @module frontend/src/modules/kashi-service/components/TenantProvisionedSuccessModal
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
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';

export default function TenantProvisionedSuccessModal({ receiptData, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [copiedField, setCopiedField] = useState(null);

  if (!receiptData) return null;

  const { tenant, credentials, links } = receiptData;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleGoToAdmin = () => {
    // Save tenant context to local storage so admin login is immediate
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
        background: 'rgba(5, 8, 16, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          background: 'linear-gradient(145deg, #090e1a 0%, #151d30 100%)',
          borderRadius: '26px',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Celebration Header */}
        <div
          style={{
            padding: '2rem',
            background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              margin: '0 auto 14px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            }}
          >
            🎉
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>
            Congratulations! {tenant?.name || 'Your Business'} is Live
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Your multi-tenant website and private admin dashboard have been provisioned on Kashi Service.
          </p>
        </div>

        {/* Credentials & Access URLs Card */}
        <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Admin Login Credentials Box */}
          <div
            style={{
              padding: '18px 20px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>
              <Key className="w-4 h-4" />
              <span>Your Private Admin Login Credentials</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Salon / Tenant ID */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Salon / Tenant ID</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{credentials?.salonId || tenant?.slug}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials?.salonId || tenant?.slug, 'Salon ID')}
                  style={{ background: 'none', border: 'none', color: copiedField === 'Salon ID' ? '#10b981' : '#94a3b8', cursor: 'pointer' }}
                >
                  {copiedField === 'Salon ID' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Login Email */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Admin Email</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{credentials?.email}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials?.email, 'Email')}
                  style={{ background: 'none', border: 'none', color: copiedField === 'Email' ? '#10b981' : '#94a3b8', cursor: 'pointer' }}
                >
                  {copiedField === 'Email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Admin Password</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>{credentials?.password}</div>
              </div>
              <button
                onClick={() => copyToClipboard(credentials?.password, 'Password')}
                style={{ background: 'none', border: 'none', color: copiedField === 'Password' ? '#10b981' : '#94a3b8', cursor: 'pointer' }}
              >
                {copiedField === 'Password' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Direct Launch Targets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Target 1: Admin Dashboard */}
            <div
              style={{
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>
                  🏢 Private Admin Portal
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {tenant?.primaryDomain}/admin
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  Manage staff, appointments, billing POS, GPS radar & tracking
                </div>
              </div>

              <button
                onClick={handleGoToAdmin}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
              >
                <span>Launch Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Target 2: Public Website */}
            <div
              style={{
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                  🌐 Public Customer Website
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {tenant?.primaryDomain}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  Online booking, services, packages, branch locator & reviews
                </div>
              </div>

              <button
                onClick={handleGoToWebsite}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Custom Domain DNS Instruction (if applicable) */}
          {links?.customDomainConfig && (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '12px',
                color: '#fde68a',
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>🌐 Custom Domain DNS Setup:</div>
              <div>
                Point <strong>CNAME</strong> for <code>{links.customDomainConfig.domain}</code> to <code>{links.customDomainConfig.cnameTarget}</code>.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.25rem 2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Trial valid for 14 days • Full access to all business features
          </div>

          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

