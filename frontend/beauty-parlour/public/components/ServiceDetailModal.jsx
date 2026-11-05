/**
 * @file ServiceDetailModal.jsx
 * @description Deep-Dive Service Details, Architecture Documentation & Pricing Modal for Kashi Service.
 * @module frontend/src/modules/kashi-service/components/ServiceDetailModal
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

export default function ServiceDetailModal({ service, onClose, onSelectPlanForOnboarding }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture' | 'features' | 'pricing'

  if (!service) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          background: 'linear-gradient(145deg, #0d121f 0%, #131b2e 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: service.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              {service.icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                  {service.name}
                </h2>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {service.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                {service.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            padding: '0 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
            gap: '8px',
          }}
        >
          {[
            { id: 'overview', label: 'Overview & Verticals', icon: Layers },
            { id: 'architecture', label: 'Architecture & Documentation Notes', icon: Server },
            { id: 'features', label: 'Key Features & Capabilities', icon: Zap },
            { id: 'pricing', label: 'Subscription Plans & Trials', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${service.accentColor || '#6366f1'}` : '2px solid transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                  Supported Business Verticals & Modules
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  Each business vertical operates as an autonomous tenant with dedicated branding, isolated database records, and custom domains.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {(service.activeVerticals || []).map((v) => (
                  <div
                    key={v.id}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>{v.name}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: v.status === 'READY_NOW' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                          color: v.status === 'READY_NOW' ? '#34d399' : '#a5b4fc',
                        }}
                      >
                        {v.badge}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      {v.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE & DOCUMENTATION NOTES */}
          {activeTab === 'architecture' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 800, fontSize: '0.95rem' }}>
                  <Server className="w-4 h-4" />
                  <span>Kashi Service Multi-Tenancy Architecture Specifications</span>
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  Built with high-throughput Express.js, MongoDB database isolators, and automated DNS routing:
                </p>
              </div>

              {/* Documentation Bullet Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(service.documentationNotes || []).map((note, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: service.accentColor || '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 900,
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                      {note}
                    </div>
                  </div>
                ))}
              </div>

              {/* Domain Structure Note */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '12px',
                  marginTop: '6px',
                }}
              >
                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>OPTION A: PLATFORM SUBDOMAIN</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    riya.kashiservice.com
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                    Instant zero-config live domain. Automatically provisioned upon onboarding with pre-verified SSL.
                  </p>
                </div>

                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b' }}>OPTION B: WHITE-LABEL CUSTOM DOMAIN</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    www.riyabeauty.com
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                    Point CNAME to <code>cname.kashiservice.com</code>. Platform handles TLS handshake with custom salon branding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES */}
          {activeTab === 'features' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Standard Features Included with {service.name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {(service.features || []).map((feat, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span style={{ fontSize: '0.84rem', color: '#e2e8f0' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRICING & SUBSCRIPTIONS */}
          {activeTab === 'pricing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                  Subscription Tiers & 14-Day Free Trial
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Every new registration begins with a full-featured 14-day free trial. No credit card required.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {(service.plans || []).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '20px',
                      borderRadius: '18px',
                      background: p.isPopular ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: p.isPopular ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {p.isPopular && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '16px',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: 800,
                          background: '#6366f1',
                          color: '#fff',
                        }}
                      >
                        MOST POPULAR
                      </span>
                    )}

                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{p.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '8px 0 14px 0' }}>
                        <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#10b981' }}>
                          ₹{p.priceMonthly.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>/ month</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        {p.features.map((f, fi) => (
                          <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPlanForOnboarding(service, p)}
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}
                    >
                      Start Free Trial
                    </button>
                  </div>
                ))}
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
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            ⚡ Instant automated setup: Generates live website & admin dashboard in 60s
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Close
            </button>
            <button
              onClick={() => onSelectPlanForOnboarding(service, service.plans?.[0])}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <span>Onboard My Business</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

