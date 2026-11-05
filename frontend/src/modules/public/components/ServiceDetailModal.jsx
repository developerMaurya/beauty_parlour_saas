/**
 * @file ServiceDetailModal.jsx
 * @description Deep-Dive Service Details, Architecture Documentation & Pricing Modal for Kashi Service (Clean White Theme).
 * @module frontend/src/modules/public/components/ServiceDetailModal
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Globe,
  Shield,
  Layers,
  Cpu,
  Zap,
  BookOpen,
  ArrowRight,
  Sparkles,
  Server,
  DollarSign,
  Star,
} from 'lucide-react';

export default function ServiceDetailModal({ service, onClose, onStartTrial }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture' | 'features' | 'pricing'

  if (!service) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
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
          maxWidth: '840px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
              }}
            >
              {service.icon || '🚀'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                  {service.name || service.title}
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#ecfdf5',
                    color: '#059669',
                  }}
                >
                  {service.status || 'Active'}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                {service.tagline || 'Multi-Tenant Business Solution'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
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
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', padding: '0 2rem', borderBottom: '1px solid #f1f5f9', gap: '1.5rem', background: '#ffffff' }}>
          {[
            { id: 'overview', label: 'Overview & Highlights' },
            { id: 'features', label: 'Included Modules' },
            { id: 'architecture', label: 'Architecture & Tech Notes' },
            { id: 'pricing', label: 'Plans & Pricing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 4px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                fontWeight: activeTab === tab.id ? 800 : 500,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, color: '#334155', fontSize: '13px', lineHeight: 1.6 }}>
          {activeTab === 'overview' && (
            <div>
              <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                About this Vertical
              </h4>
              <p style={{ marginBottom: '1.5rem' }}>
                {service.description || service.longDescription || 'Enterprise turnkey software designed for modern high-volume operations.'}
              </p>

              <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Key Capabilities
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {(service.keyFeatures || service.features || [
                  'Full Multi-Branch & Shift Management',
                  'Live Staff GPS Tracking Radar',
                  'Biometric Punch-Clock & Leaves',
                  'Client Booking & POS Billing',
                ]).map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Modules Included with Standard License
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {(service.modulesIncluded || [
                  'Admin Dashboard & KPIs',
                  'Live Google Maps Satellite Radar',
                  'Inventory & Supplies Ledger',
                  'POS Cash & Card Billing',
                  'Academy LMS & Digital Certificates',
                  'Customer Online Booking Storefront',
                ]).map((mod, i) => (
                  <div key={i} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '12px', marginBottom: '4px' }}>
                      ✓ {mod}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Ready-to-use with sample seeded database.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                Multi-Tenant Architecture Specifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong>Multi-Tenancy Mode:</strong> Partitioned Database with dynamic tenant header resolver.
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong>Domain Routing:</strong> Supports custom root domains (`yourbrand.com`) and subdomains (`brand.kashiservice.com`).
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong>Security & Auth:</strong> JWT HttpOnly cookies, bcrypt hashing, role permission matrix.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                License Plans
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {[
                  { name: 'Starter Plan', price: '₹1,999/mo', desc: 'Single location salon with full POS & GPS tracking' },
                  { name: 'Professional Plan', price: '₹4,999/mo', desc: 'Up to 5 branches, Academy LMS, and custom domain' },
                  { name: 'Enterprise White-Label', price: '₹9,999/mo', desc: 'Unlimited branches, isolated database, own app branding' },
                ].map((plan, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{plan.name}</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#4f46e5', margin: '6px 0' }}>{plan.price}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>{plan.desc}</div>
                    <button
                      onClick={() => onStartTrial(service, plan)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#4f46e5',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      💳 Buy Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 2rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
          <button
            onClick={() => onStartTrial(service)}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#4f46e5',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} />
            <span>💳 Buy SaaS License</span>
          </button>
        </div>
      </div>
    </div>
  );
}
