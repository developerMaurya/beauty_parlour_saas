/**
 * @file RBSoftwareWebsite.jsx
 * @description Dedicated High-Tech Futuristic Software Agency & Digital Solutions Website for RB Software & Tech Hub.
 * Enterprise cloud SaaS, GST Billing POS, Mobile Apps, WhatsApp API Automations, Microservices.
 * @module frontend/src/modules/public/pages/RBSoftwareWebsite
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Cpu,
  Layers,
  Terminal,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Phone,
  MonitorCheck,
  Workflow,
  Lock,
} from 'lucide-react';

export default function RBSoftwareWebsite() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [activeFaq, setActiveFaq] = useState(null);

  const softwareProducts = [
    {
      id: 'PROD-1',
      name: 'OmniPOS Cloud Billing & Inventory ERP',
      category: 'Billing POS',
      tagline: 'Lightning fast thermal invoice printing, barcode scanning, multi-counter split billing & GST e-way bills.',
      techStack: ['Node.js', 'React', 'SQLite/Postgres', 'Web USB Printers'],
      badge: 'Flagship ERP',
      stats: '150ms Billing Latency',
      features: [
        'Multi-terminal counter checkout with offline sync',
        'Direct UPI Dynamic QR generated on thermal printer',
        'Automatic low stock radar & supplier purchase POs',
        'GST R1/3B instant JSON export for chartered accountants',
      ],
    },
    {
      id: 'PROD-2',
      name: 'Multi-Tenant Micro-SaaS Cloud Platform',
      category: 'Cloud SaaS',
      tagline: 'Deploy isolated white-label customer portals with auto-provisioned subdomains, SSL & multi-tenancy.',
      techStack: ['Docker', 'Nginx', 'MongoDB Sharding', 'Redis Cache'],
      badge: 'Cloud Native',
      stats: '99.99% Guaranteed SLA',
      features: [
        'Zero-trust isolated multi-tenant database partitioning',
        'Custom domain CNAME mapping with automated Let’s Encrypt SSL',
        'Role-based granular ACL (Owner, Manager, Staff, Cashier)',
        'Built-in Stripe, Razorpay & Cashfree recurring subscriptions',
      ],
    },
    {
      id: 'PROD-3',
      name: 'Native Android & iOS Mobile Client Apps',
      category: 'Mobile Apps',
      tagline: 'High-conversion customer booking, live order tracking & staff GPS attendance applications.',
      techStack: ['React Native', 'Flutter', 'Firebase Push', 'Mapbox GPS'],
      badge: 'Play Store Ready',
      stats: '4.9★ Store Rating',
      features: [
        'Biometric FaceID / Fingerprint instant customer sign-in',
        'Live technician & field staff live location tracking radar',
        'FCM Push notifications with deep links to offers',
        'Full offline cache support for remote operations',
      ],
    },
    {
      id: 'PROD-4',
      name: 'Enterprise WhatsApp Business Automation Engine',
      category: 'Automations',
      tagline: 'Official Meta Cloud API integration for automated transactional receipts, OTPs & interactive catalogs.',
      techStack: ['Meta Cloud API', 'Webhooks', 'BullMQ', 'Redis'],
      badge: 'Official Meta Partner',
      stats: '98% Open Rate',
      features: [
        'Instant PDF receipt & invoice delivery on bill generation',
        '2-Way interactive button chatbot with AI reply triage',
        'Automated appointment reminders & review feedback loops',
        'Verified Green Tick sender ID compliance handling',
      ],
    },
  ];

  const filteredProducts =
    selectedDomain === 'ALL'
      ? softwareProducts
      : softwareProducts.filter((p) => p.category.toLowerCase().includes(selectedDomain.toLowerCase()));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        color: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Top Ambient Cyber Glow ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Header ── */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(99, 102, 241, 0.5)',
              }}
            >
              <Code2 size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                RB Software <span style={{ color: '#818cf8' }}>& Tech Hub</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                High-Performance SaaS, Custom ERPs & Enterprise Mobile Platforms
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Back to Hub
            </button>
            <a
              href="tel:+919876543210"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Terminal size={15} />
              <span>Request Tech Demo</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 4rem',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            fontSize: '12px',
            fontWeight: 800,
            color: '#a5b4fc',
            marginBottom: '1.5rem',
          }}
        >
          <Sparkles size={14} color="#818cf8" />
          <span>Architected for Scale • High-Speed Cloud Microservices</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '960px',
            margin: '0 auto 1.5rem',
          }}
        >
          Engineering World-Class{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Digital Software & Cloud Platforms
          </span>{' '}
          for Modern Enterprises
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 2.75rem',
          }}
        >
          From high-frequency retail POS billing to white-label multi-tenant SaaS clouds and automated WhatsApp customer engagement engines — RB Software powers businesses with bulletproof code.
        </p>

        {/* Tech Badges Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '3.5rem',
          }}
        >
          {[
            '⚡ 150ms Billing Latency',
            '🔒 SOC-2 & ISO 27001 Ready Architecture',
            '🌐 Multi-Region Redundant Cloud',
            '📲 100k+ Daily API Requests Tested',
            '💬 Meta Cloud WhatsApp Certified',
          ].map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                color: '#cbd5e1',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Core Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1100px',
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          {[
            {
              icon: Server,
              title: 'Multi-Tenant SaaS Engineering',
              desc: 'Automated tenant provisioning, isolated database schemas, subdomain routing & automated SSL lifecycle.',
            },
            {
              icon: MonitorCheck,
              title: 'Smart Billing POS Systems',
              desc: 'Thermal printer driver integrations, offline checkout buffering, GST e-invoices & inventory variance tracking.',
            },
            {
              icon: Smartphone,
              title: 'Native Mobile Apps',
              desc: 'Cross-platform customer booking apps with GPS staff radar, biometric authentication & instant push notifications.',
            },
            {
              icon: MessageSquare,
              title: 'WhatsApp Automation Gateway',
              desc: 'High-throughput transactional PDF delivery, 24/7 interactive booking chatbots & customer feedback sync.',
            },
          ].map((card, idx) => {
            const CIcon = card.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                    marginBottom: '1rem',
                  }}
                >
                  <CIcon size={20} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Product Catalog Section ── */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#818cf8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Enterprise Software Suite
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>Production-Ready Systems</h2>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px',
              borderRadius: '10px',
            }}
          >
            {['ALL', 'Billing POS', 'Cloud SaaS', 'Mobile Apps', 'Automations'].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedDomain === dom ? '#6366f1' : 'transparent',
                  color: selectedDomain === dom ? '#ffffff' : '#94a3b8',
                }}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                    }}
                  >
                    {p.badge}
                  </span>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      color: '#34d399',
                    }}
                  >
                    {p.stats}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {p.tagline}
                </p>

                {/* Tech Stack Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                  {p.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#cbd5e1',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem' }}>
                  {p.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                      <CheckCircle2 size={15} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="tel:+919876543210"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                }}
              >
                <span>Schedule Live System Architecture Walkthrough</span>
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enterprise Cloud Infrastructure Section ── */}
      <section
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4.5rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#a5b4fc',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '1rem',
            }}
          >
            <Cloud size={14} />
            <span>Bank-Grade Cloud Infrastructure</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2.5rem' }}>
            Built With Modern Cloud Stack & Security Standards
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              textAlign: 'left',
            }}
          >
            {[
              { title: 'Multi-Tenant DB Isolation', desc: 'Separate MongoDB database connections per business tenant' },
              { title: 'Zero Cold-Start Caching', desc: 'In-memory Redis layer for sub-millisecond session validation' },
              { title: 'Automated Daily Snapshots', desc: 'Encrypted S3 cloud backups with point-in-time recovery' },
              { title: 'SSL & DDoS Mitigation', desc: 'Cloudflare enterprise DNS with automatic rate limiting' },
            ].map((infra, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                  {infra.title}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                  {infra.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '12.5px',
        }}
      >
        <p>© 2026 RB Software & Tech Hub • Kashi Service Ecosystem. Cloud Microservices & Enterprise App Engineering.</p>
      </footer>
    </div>
  );
}

