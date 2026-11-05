/**
 * @file PublicAboutPage.jsx
 * @description White-Label Luxury Beauty Parlour About & Heritage Showcase (Clean White Aesthetic).
 * @module frontend/src/modules/public/pages/PublicAboutPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as bizApi from '../../../services/api/public/businessFetcher.js';
import { Sparkles, Award, ShieldCheck, HeartHandshake, MapPin, Users, ArrowRight } from 'lucide-react';

export default function PublicAboutPage() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await bizApi.getBusinessInfo();
        const data = res?.data?.data || res?.data || res;
        if (data && typeof data === 'object') setBusiness(data);
      } catch (err) {
        console.error('Failed to load about info', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const name = business?.name || 'Blossom Luxury Beauty Parlour & Bridal Studio';
  const tagline = business?.websiteConfig?.tagline || business?.tagline || 'Haute Couture Beauty & Accredited Cosmetology';
  const aboutStory =
    business?.websiteConfig?.aboutStory ||
    business?.description ||
    'Established with a passion for bespoke Indian bridal elegance and clinical dermatology, our parlour delivers an unmatched sanctuary of organic facials, haute hair transformations, and accredited cosmetology artistry.';
  const founder = business?.websiteConfig?.founder || {
    name: 'Ananya Deshmukh',
    title: 'Founder & Master Aesthetician',
    bio: 'With over 16 years of international cosmetological experience across Paris, Mumbai, and Dubai, Ananya founded Blossom to harmonize ancient Ayurvedic herbal remedies with state-of-the-art dermatological technology.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  };

  const stats = [
    { label: 'Happy Guests Served', value: '25,000+', icon: <Users className="w-5 h-5 text-pink-600" /> },
    { label: 'Bridal Makeovers', value: '1,800+', icon: <Sparkles className="w-5 h-5 text-rose-600" /> },
    { label: 'Sanctuary Branches', value: '4 Studios', icon: <MapPin className="w-5 h-5 text-purple-600" /> },
    { label: 'Certified Beauticians', value: '45+ Masters', icon: <Award className="w-5 h-5 text-amber-600" /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #fff5f7 0%, #fffbf8 50%, #fdf2f8 100%)',
          border: '1px solid #fce7f3',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(190, 24, 93, 0.04)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid #fecdd3',
            color: '#be185d',
            fontSize: '12.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 6px rgba(190, 24, 93, 0.06)',
          }}
        >
          ✨ Our Heritage & Philosophy
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', maxWidth: '850px', margin: '0 auto', lineHeight: 1.2 }}>
          {name}
        </h1>
        <p style={{ color: '#be185d', fontSize: '1.15rem', fontWeight: 700, marginTop: '0.75rem', letterSpacing: '0.02em' }}>
          {tagline}
        </p>
        <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '780px', margin: '1.5rem auto 0', lineHeight: 1.75 }}>
          {aboutStory}
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <NavLink
            to="/book"
            style={{
              background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14.5px',
              boxShadow: '0 8px 20px rgba(190, 24, 93, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Reserve Your Ritual</span>
            <ArrowRight size={16} />
          </NavLink>
          <NavLink
            to="/branches"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14.5px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            Explore Sanctuaries
          </NavLink>
        </div>
      </section>

      {/* Quantitative Track Record */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {stats.map((s, idx) => (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fecdd3' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Pillars of Distinction */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            The Blossom Gold Standard
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.5rem' }}>Setting benchmarks in hospitality, clinical hygiene, and artistic mastery.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {[
            {
              title: 'Clinical Sterilization & Hygiene',
              desc: 'Hospital-grade autoclaved instruments, single-use client kits, and air-purified treatment chambers ensuring zero contamination.',
              icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
            },
            {
              title: 'Certified Cosmetology Masters',
              desc: 'Every senior stylist, aesthetician, and instructor holds international accreditation and completes 200+ hours of annual couture training.',
              icon: <Award className="w-6 h-6 text-amber-600" />,
            },
            {
              title: 'Dermatologically Curated Formulations',
              desc: 'We exclusively deploy cruelty-free, organic, and FDA-approved salon products that nourish skin, scalp, and nails sustainably.',
              icon: <HeartHandshake className="w-6 h-6 text-pink-600" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Spotlight Card */}
      {founder?.name && (
        <section
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #fff 100%)',
            border: '1px solid #fecdd3',
            borderRadius: '20px',
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap',
            boxShadow: '0 8px 24px rgba(190, 24, 93, 0.06)',
          }}
        >
          {founder.photoUrl && (
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '20px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '3px solid #ffffff',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={founder.photoUrl}
                alt={founder.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#be185d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Visionary Leadership
            </span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px' }}>{founder.name}</h3>
            <p style={{ fontSize: '0.9rem', color: '#be185d', fontWeight: 700, margin: '0 0 12px' }}>{founder.title}</p>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>{founder.bio}</p>
          </div>
        </section>
      )}
    </div>
  );
}
