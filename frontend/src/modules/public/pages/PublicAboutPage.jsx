/**
 * @file PublicAboutPage.jsx
 * @description Dedicated Master About Page for Kashi Service Ecosystem.
 * Showcases heritage, mission, 5 enterprise verticals, leadership, and verified operational statistics.
 * @module frontend/src/modules/public/pages/PublicAboutPage
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Building,
  Users,
  Compass,
  Scissors,
  PartyPopper,
  Key,
  Code2,
  CheckCircle2,
  ArrowRight,
  Globe,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

export default function PublicAboutPage() {
  const navigate = useNavigate();

  const verticals = [
    {
      icon: Scissors,
      color: '#ec4899',
      bgColor: '#fdf2f8',
      name: 'Golden Beauty Parlour & Academy',
      title: 'Luxury Makeovers, Bridal Artistry & Cosmetology School',
      desc: 'Accredited bridal makeovers, clinical organic facials, and certified beauty training academy graduating high-earning cosmetologists.',
      route: '/storefront',
    },
    {
      icon: PartyPopper,
      color: '#a855f7',
      bgColor: '#faf5ff',
      name: 'Jay Gurudev Event & Decoration',
      title: 'Royal Mandapams, Concert Lighting & Banquets',
      desc: 'Bespoke destination wedding production, concert-grade sound & truss engineering, and high-speed QR gate security check-ins.',
      route: '/events',
    },
    {
      icon: Compass,
      color: '#059669',
      bgColor: '#ecfdf5',
      name: 'Real Estate Plotting & Colonies',
      title: 'RERA-Approved Residential Townships & Land Deeds',
      desc: 'Clear legal title land plots in prime Varanasi corridors with flexible 12-60 months EMI and immediate Sub-Registrar registration.',
      route: '/plotting',
    },
    {
      icon: Key,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      name: 'Office & Commercial Rent',
      title: 'Furnished Executive Cabins & Retail Showrooms',
      desc: 'Prime commercial properties, digital lease agreements, and 100% automated WhatsApp rent invoices and maintenance administration.',
      route: '/rent',
    },
    {
      icon: Code2,
      color: '#6366f1',
      bgColor: '#eef2ff',
      name: 'RB Software & Tech Hub',
      title: 'Cloud Micro-SaaS, OmniPOS & Mobile Engineering',
      desc: 'Ultra high-speed business software, native mobile apps, automated GST POS engines, and robust cloud APIs with 99.98% uptime.',
      route: '/software',
    },
  ];

  const milestones = [
    { label: 'Happy Customers Served', val: '50,000+', icon: Users, color: '#ec4899' },
    { label: 'Registered Business Verticals', val: '5 Pillars', icon: Building, color: '#2563eb' },
    { label: 'Specialists & Field Crew', val: '120+ Team', icon: Award, color: '#059669' },
    { label: 'Client Trust & Satisfaction', val: '99.8%', icon: ShieldCheck, color: '#7c3aed' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', padding: '1rem 0 5rem', maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Top Hero Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          borderRadius: '24px',
          padding: '4.5rem 2.5rem',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.1)', fontSize: '12px', fontWeight: 800, color: '#c7d2fe', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
          <Sparkles size={14} color="#818cf8" />
          <span>OFFICIAL HERITAGE & VISION • KASHI SERVICE</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 auto 1rem', maxWidth: '900px', lineHeight: 1.15 }}>
          Building the Future of Enterprise & Services Across Varanasi
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '780px', margin: '0 auto 2.5rem', lineHeight: 1.65 }}>
          <strong>Kashi Service</strong> unites five distinct world-class business enterprises under one unified umbrella of trust, speed, and uncompromising excellence.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/services')}
            style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
          >
            <span>Explore All 5 Services</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/contact')}
            style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}
          >
            Contact Headquarters
          </button>
        </div>
      </section>

      {/* ── 4 Milestones ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {milestones.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}15`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon size={22} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{m.val}</div>
              <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 700, marginTop: 4 }}>{m.label}</div>
            </div>
          );
        })}
      </section>

      {/* ── 5 Enterprise Pillars Showcase ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>The 5 Pillars</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 10px', letterSpacing: '-0.02em' }}>
            Comprehensive Solutions Under One Verified Name
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
            Each enterprise operates with specialized leadership, state-of-the-art infrastructure, and dedicated customer service.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {verticals.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: v.bgColor, color: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>{v.name}</div>
                      <div style={{ fontSize: '11px', color: v.color, fontWeight: 700 }}>{v.title}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                    {v.desc}
                  </p>
                </div>

                <NavLink
                  to={v.route}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '9px',
                    background: v.bgColor,
                    color: v.color,
                    fontWeight: 800,
                    fontSize: '12.5px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    border: `1px solid ${v.color}30`,
                  }}
                >
                  <Globe size={14} />
                  <span>Visit {v.name.split(' ')[0]} Official Website</span>
                  <ArrowRight size={13} />
                </NavLink>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Central Headquarters & Commitment ── */}
      <section
        style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontWeight: 800, fontSize: '12px', marginBottom: 8 }}>
            <MapPin size={16} />
            <span>CENTRAL HEADQUARTERS</span>
          </div>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>
            Rooted in Varanasi, Expanding Across India
          </h3>
          <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.65, margin: 0 }}>
            Headquartered at the sacred and commercial heart of Varanasi, Kashi Service bridges timeless traditional Indian hospitality with world-class digital innovation. From grand royal destination weddings along the Ganges to cutting-edge cloud software systems, we bring integrity, speed, and complete accountability to every engagement.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            'Verified RERA & Sub-Registrar legal clearance for all plot colonies',
            'ISO & Derm-certified beauty academy & professional parlour artists',
            'In-house floral, stage, sound & lighting engineering fleet',
            'Full digital transparency with automated WhatsApp invoices & EMI ledger',
          ].map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={14} />
              </div>
              <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{point}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
