/**
 * @file PublicAboutPage.jsx
 * @description White-Label About Us page showcasing salon heritage, philosophy, team, and hygiene standards.
 * @module frontend/src/modules/public/pages/PublicAboutPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as bizApi from '../../../services/api/public/businessFetcher.js';
import { ShieldCheck, Award, Sparkles, HeartHandshake, Users, Star, Clock, CheckCircle } from 'lucide-react';

export default function PublicAboutPage() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await bizApi.getBusinessInfo();
        const data = res?.data?.data || res?.data || res;
        if (data && typeof data === 'object') {
          setBusiness(data);
        }
      } catch (err) {
        console.error('Failed to load business about info', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const name = business?.name || 'Glamour Cosmetology Academy & Luxury Salon';
  const tagline = business?.tagline || business?.websiteConfig?.tagline || 'Redefining Luxury Grooming & Professional Beauty Education';
  const aboutStory = business?.websiteConfig?.aboutStory ||
    'Established with a passion for aesthetic perfection and artistic innovation, our salon and academy brings international grooming standards, dermatologically formulated treatments, and couture artistry under one bespoke roof. From restorative rituals to transformative bridal styling, our team of internationally certified cosmetologists crafts every experience around your unique individuality.';

  const stats = business?.websiteConfig?.aboutStats?.length > 0
    ? business.websiteConfig.aboutStats.map((s, idx) => ({
        label: s.label,
        value: s.value,
        icon:
          idx === 0 ? (
            <Award className="w-6 h-6 text-pink-400" />
          ) : idx === 1 ? (
            <Users className="w-6 h-6 text-purple-400" />
          ) : idx === 2 ? (
            <Sparkles className="w-6 h-6 text-amber-400" />
          ) : (
            <Star className="w-6 h-6 text-sky-400" />
          ),
      }))
    : [
        { label: 'Years of Excellence', value: '12+', icon: <Award className="w-6 h-6 text-pink-400" /> },
        { label: 'Satisfied Patrons', value: '25,000+', icon: <Users className="w-6 h-6 text-purple-400" /> },
        { label: 'Master Specialists', value: '30+', icon: <Sparkles className="w-6 h-6 text-amber-400" /> },
        { label: 'Certified Graduates', value: '1,500+', icon: <Star className="w-6 h-6 text-sky-400" /> },
      ];

  const founder = business?.websiteConfig?.aboutFounder;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at top, rgba(236, 72, 153, 0.15), transparent 70%), #0f172a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#f472b6', fontSize: '12.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
          ✨ Our Heritage & Philosophy
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', maxWidth: '850px', margin: '0 auto', lineHeight: 1.2 }}>
          {name}
        </h1>
        <p style={{ color: '#ec4899', fontSize: '1.15rem', fontWeight: 600, marginTop: '0.75rem', letterSpacing: '0.02em' }}>
          {tagline}
        </p>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '780px', margin: '1.5rem auto 0', lineHeight: 1.75 }}>
          {aboutStory}
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <NavLink
            to="/book"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14.5px',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
            }}
          >
            Reserve Your Ritual
          </NavLink>
          <NavLink
            to="/branches"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14.5px',
            }}
          >
            Explore Sanctuaries
          </NavLink>
        </div>
      </section>

      {/* Stats Counter Bar */}
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
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '18px',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Pillars of Distinction */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>The Glamour Gold Standard</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>Setting benchmarks in hospitality, clinical hygiene, and artistic mastery.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {[
            {
              title: 'Clinical Sterilization & Hygiene',
              desc: 'Hospital-grade autoclaved instruments, single-use client kits, and air-purified treatment chambers ensuring zero contamination.',
              icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
            },
            {
              title: 'Certified Cosmetology Masters',
              desc: 'Every senior stylist, aesthetician, and instructor holds international accreditation and completes 200+ hours of annual couture training.',
              icon: <Award className="w-6 h-6 text-amber-400" />,
            },
            {
              title: 'Dermatologically Curated Formulations',
              desc: 'We exclusively deploy cruelty-free, organic, and FDA-approved salon products that nourish skin, scalp, and nails sustainably.',
              icon: <HeartHandshake className="w-6 h-6 text-pink-400" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(30, 41, 59, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Spotlight Card */}
      {founder?.name && (
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          {founder.photoUrl && (
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #ec4899',
                flexShrink: 0,
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
              }}
            >
              <img src={founder.photoUrl} alt={founder.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              DIRECTOR'S STATEMENT
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 2px 0' }}>
              {founder.name}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              {founder.role || 'Artistic Director & Founder'} • {founder.experienceYears || 12}+ Years Industry Leadership
            </div>
            {founder.quote && (
              <blockquote style={{ fontSize: '1rem', fontStyle: 'italic', color: '#cbd5e1', lineHeight: 1.6, margin: 0, borderLeft: '3px solid #ec4899', paddingLeft: '1rem' }}>
                "{founder.quote}"
              </blockquote>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

