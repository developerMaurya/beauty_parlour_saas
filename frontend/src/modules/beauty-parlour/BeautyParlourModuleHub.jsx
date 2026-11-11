/**
 * @file BeautyParlourModuleHub.jsx
 * @description Dedicated Beauty Parlour SaaS Showcase, Telemetry & Demo Hub (High-Contrast White Theme).
 * @module frontend/beauty-parlour/BeautyParlourModuleHub
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { getBeautyParlourOverview } from '@/services/api/kashi/kashiPlatformApi.js';

export default function BeautyParlourModuleHub({ onStartTrial }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getBeautyParlourOverview();
        if (res?.data) setData(res.data);
      } catch (err) {
        console.warn('Beauty parlour overview load:', err);
      }
    }
    load();
  }, []);

  const features = data?.primaryFeatures || [
    { name: 'Google Satellite GPS Staff Radar', status: 'ACTIVE', icon: '🛰️', desc: 'Real-time checked-in, checked-out, and on-leave staff radar tracking' },
    { name: 'Doorstep Home Service Dispatch', status: 'ACTIVE', icon: '🚗', desc: 'Real-time specialist route polyline, distance, and ETA countdown' },
    { name: 'Multi-Branch Parlour Operations', status: 'ACTIVE', icon: '🏢', desc: 'Centralized control for Flagship, Cyber City, and South Extension sanctuaries' },
    { name: 'Cosmetology Academy LMS', status: 'ACTIVE', icon: '🎓', desc: 'Admissions, student batches, training plans, and auto PDF certificates' },
    { name: 'POS Billing & GST Split Invoicing', status: 'ACTIVE', icon: '💳', desc: 'UPI QR codes, cash, cards, split payments, and customer loyalty wallets' },
    { name: 'Dynamic Service & Package Catalog', status: 'ACTIVE', icon: '✂️', desc: 'Variants, add-ons, features, and staff product assignment' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Top High-Contrast Banner ── */}
      <div
        style={{
          padding: '1.75rem 2rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #fff1f2 0%, #fdf2f8 100%)',
          border: '1px solid #fecdd3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(244, 63, 94, 0.05)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>💄</span>
            <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#881337', letterSpacing: '-0.02em' }}>
              Beauty Parlour, Luxury Salon & Academy SaaS
            </h2>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
            Production-ready multi-branch parlour ERP: Google Satellite GPS radar, biometric punches, doorstep visits & LMS
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              sessionStorage.setItem('current_tenant_slug', 'blossom-salon');
              navigate('/site/blossom-salon');
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
            }}
          >
            <span>💅 Live Storefront Demo</span>
          </button>

          <button
            onClick={() => onStartTrial({ id: 'beauty-parlour', name: 'Beauty Parlour & Luxury Salon SaaS' })}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              border: '1px solid #be185d',
              background: '#ffffff',
              color: '#be185d',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} />
            <span>Start 14-Day Free Trial</span>
          </button>

          <button
            onClick={() => onStartTrial({ id: 'beauty-parlour', name: 'Beauty Parlour & Luxury Salon SaaS', plan: 'Pro' })}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(190, 24, 93, 0.3)',
            }}
          >
            <span>💳 Buy / Subscribe License</span>
          </button>
        </div>
      </div>

      {/* ── 6 Core Feature Capabilities Grid (High Contrast) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>{feat.icon}</span>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {feat.name}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── Seeded Live Demo Sanctuaries ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Seeded Live Demo Parlours
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Launch instant sandbox with pre-configured staff GPS coords, treatments & booking slots
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {[
            {
              slug: 'blossom-salon',
              name: 'Blossom Luxury Beauty Parlour',
              branches: 'Bandra Flagship, Cyber City, Connaught Place',
              role: 'Flagship Sanctuary',
            },
            {
              slug: 'glamour-academy',
              name: 'Glamour Beauty Academy',
              branches: 'South Extension, Noida Sector 18',
              role: 'Cosmetology Institute',
            },
            {
              slug: 'serene-spa',
              name: 'Serene Wellness Sanctuary',
              branches: 'Golf Course Road, Delhi NCR',
              role: 'Ayurvedic Day Spa',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{t.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{t.branches}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    sessionStorage.setItem('current_tenant_slug', t.slug);
                    navigate(`/site/${t.slug}`);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  View Parlour
                </button>
                <button
                  onClick={() => navigate(`/admin/login?tenant=${t.slug}`)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#be185d',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Admin Login
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Beauty Parlour SaaS Pricing Plans (Trial & Buy Method) ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            Choose Your Beauty Parlour Plan & Instant Setup
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            All plans include 14-day free trial, custom domain setup, isolated database option, and zero lock-in.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            {
              name: 'Single Parlour Starter',
              badge: 'Self-Employed / Boutique',
              price: '₹1,999',
              period: '/month',
              features: [
                '1 Branch / Salon Studio',
                'Up to 5 Staff & Beauticians',
                'Online Appointments & Customer Portal',
                'GST POS Billing & Invoicing',
                'Free Subdomain: yourbrand.kashiservice.com',
              ],
              popular: false,
            },
            {
              name: 'Multi-Branch Parlour Chain',
              badge: 'Most Popular',
              price: '₹4,999',
              period: '/month',
              features: [
                'Up to 5 Parlour Branches',
                'Unlimited Staff & Doorstep Dispatch',
                'Live GPS Staff Radar (Satellite Map)',
                'Custom Domain & Free SSL Certificate',
                'WhatsApp & SMS Automated Reminders',
                'Advanced Stock & Inventory Auditing',
              ],
              popular: true,
            },
            {
              name: 'Enterprise & Academy Chain',
              badge: 'Flagship & Franchise',
              price: '₹9,999',
              period: '/month',
              features: [
                'Unlimited Branches & Locations',
                'Full Cosmetology Academy LMS & Admissions',
                'Dedicated Database Option (Isolated)',
                'Automated PDF Certificates & Transcripts',
                '24/7 Dedicated Account Manager',
                'Zero Processing Fee on Bookings',
              ],
              popular: false,
            },
          ].map((plan, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: '14px',
                border: plan.popular ? '2px solid #be185d' : '1px solid #e2e8f0',
                background: plan.popular ? '#fff1f2' : '#f8fafc',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: plan.popular ? '0 8px 24px rgba(190, 24, 93, 0.12)' : 'none',
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#be185d',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 12px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Most Popular
                </div>
              )}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: plan.popular ? '#be185d' : '#64748b' }}>
                    {plan.badge}
                  </span>
                </div>
                <h4 style={{ margin: '6px 0 12px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {plan.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155' }}>
                      <CheckCircle2 size={15} color={plan.popular ? '#be185d' : '#059669'} style={{ flexShrink: 0 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() =>
                    onStartTrial({
                      id: 'beauty-parlour',
                      name: `Beauty Parlour SaaS (${plan.name})`,
                      plan: plan.name,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: plan.popular ? '#be185d' : '#0f172a',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: plan.popular ? '0 4px 12px rgba(190, 24, 93, 0.25)' : 'none',
                  }}
                >
                  Start 14-Day Free Trial
                </button>
                <button
                  onClick={() =>
                    onStartTrial({
                      id: 'beauty-parlour',
                      name: `Beauty Parlour SaaS (${plan.name})`,
                      plan: plan.name,
                      isImmediatePurchase: true,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  💳 Buy Plan License (Instant Activation)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
