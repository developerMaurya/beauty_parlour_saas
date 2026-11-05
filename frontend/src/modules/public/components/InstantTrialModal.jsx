/**
 * @file InstantTrialModal.jsx
 * @description Instant 14-Day Free Trial Demo Modal.
 * Displays pre-filled Demo Admin Email, Password & Salon Slug with 1-Click Direct Admin Dashboard Launch.
 * @module frontend/src/modules/public/components/InstantTrialModal
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Building,
  Key,
  Mail,
  Zap,
} from 'lucide-react';
import { useTenantAdmin } from '@/context/TenantAdminContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';

export default function InstantTrialModal({ isOpen, onClose, service = null, onOpenCustomWizard }) {
  const navigate = useNavigate();
  const { login } = useTenantAdmin();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen) return null;

  const demoTenantSlug = 'blossom-salon';
  const demoEmail = 'admin@parlour.local';
  const demoPassword = 'Password@123';

  const handleCopy = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success(`${fieldName} copied to clipboard!`);
  };

  const handleDirectLaunch = async () => {
    setIsLoading(true);
    try {
      await login({
        tenantSlugOrId: demoTenantSlug,
        email: demoEmail,
        password: demoPassword,
      });
      toast.success('Instant 14-Day Free Trial activated! Opening Admin Dashboard...');
      onClose();
      navigate('/admin/dashboard');
    } catch (err) {
      console.warn('Direct auto-login fallback:', err);
      // Fallback navigation with autologin query parameters
      onClose();
      navigate(`/admin/login?tenant=${demoTenantSlug}&email=${encodeURIComponent(demoEmail)}&pass=${encodeURIComponent(demoPassword)}&autologin=true`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 100%)',
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Zap size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Instant 14-Day Free Trial
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Pre-configured sandbox for {service?.name || 'Beauty Parlour SaaS'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>
              Live database tenant seeded with staff GPS tracking, services, inventory, and appointments.
            </div>
          </div>

          {/* Credentials Display Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Your Instant Demo Admin Credentials:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Field 1: Salon Slug */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={16} color="#64748b" />
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Salon Slug:</span>
                  <code style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4f46e5' }}>{demoTenantSlug}</code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(demoTenantSlug, 'Salon Slug')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: copiedField === 'Salon Slug' ? '#059669' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {copiedField === 'Salon Slug' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedField === 'Salon Slug' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Field 2: Admin Email */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#64748b" />
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Admin Email:</span>
                  <code style={{ fontSize: '0.88rem', fontWeight: 800, color: '#be185d' }}>{demoEmail}</code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(demoEmail, 'Admin Email')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: copiedField === 'Admin Email' ? '#059669' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {copiedField === 'Admin Email' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedField === 'Admin Email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Field 3: Admin Password */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={16} color="#64748b" />
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Password:</span>
                  <code style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>{demoPassword}</code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(demoPassword, 'Password')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: copiedField === 'Password' ? '#059669' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {copiedField === 'Password' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedField === 'Password' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action: 1-Click Launch */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleDirectLaunch}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '15px',
              cursor: isLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
              marginBottom: '10px',
            }}
          >
            {isLoading ? (
              <span>Authenticating Dashboard...</span>
            ) : (
              <>
                <Zap size={18} />
                <span>Enter Admin Dashboard Directly (Auto-Login)</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Secondary Action: Create Own Custom Trial */}
          {onOpenCustomWizard && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomWizard(service);
              }}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              ✨ Want to enter your own salon brand name? Create Custom Free Trial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

