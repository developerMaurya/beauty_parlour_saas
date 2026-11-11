/**
 * @file PublicGalleryPage.jsx
 * @description Dedicated Visual Portfolio & Gallery Showcase for Kashi Service Ecosystem.
 * High-resolution showcase covering Bridal Makeovers, Wedding Mandaps, Colony Layouts, Commercial Offices & Cloud Software.
 * @module frontend/src/modules/public/pages/PublicGalleryPage
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Scissors,
  PartyPopper,
  Compass,
  Key,
  Code2,
  ExternalLink,
  ArrowRight,
  Filter,
} from 'lucide-react';

const PORTFOLIO_ITEMS = [
  {
    id: 'p_01',
    category: 'BEAUTY',
    title: 'Royal HD Bridal Makeover & Hair Couture',
    client: 'Sneha & Rohit Wedding Gala',
    location: 'Taj Nadesar Palace, Varanasi',
    desc: 'HD airbrush bridal base, signature smokey eyes, and authentic 24k gold foil flower braid styling.',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    tag: 'Bridal Artistry',
    link: '/storefront',
  },
  {
    id: 'p_02',
    category: 'EVENTS',
    title: 'Grand Lotus Floral Mandap & Concert Truss',
    client: 'Singhania Destination Wedding',
    location: 'Grand Regal Palace, Varanasi',
    desc: 'Open-air floating lotus mandap, 120ft LED truss lighting wall, and computerized pyrotechnic entry path.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tag: 'Royal Stage Decor',
    link: '/events',
  },
  {
    id: 'p_03',
    category: 'PLOTTING',
    title: 'Kashi Green Valley City Township Layout',
    client: 'Phase-1 Residential Gated Enclave',
    location: 'Varanasi-Prayagraj Expressway Corridor',
    desc: 'Wide 40ft blacktop roads, underground electrification, RERA cleared clear title deeds, and landscaped park.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    tag: 'Colony Township',
    link: '/plotting',
  },
  {
    id: 'p_04',
    category: 'RENT',
    title: 'High-Tech Furnished Executive Suites & Cabins',
    client: 'Kashi Commercial Tower A',
    location: 'Cantt Ring Road Expressway',
    desc: 'Plug-and-play modern corporate offices, biometric door access, 100% DG power backup, and high-speed fiber.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    tag: 'Corporate Leasing',
    link: '/rent',
  },
  {
    id: 'p_05',
    category: 'SOFTWARE',
    title: 'OmniPOS Multi-Store Cloud ERP & Billing Engine',
    client: 'Retail Supermarket & Salon Enterprise',
    location: 'Cloud Infrastructure / AWS Cluster',
    desc: 'Sub-second thermal GST printing, live GPS staff dispatch radar, and real-time multi-tenant dashboard.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tag: 'Cloud Software',
    link: '/software',
  },
  {
    id: 'p_06',
    category: 'EVENTS',
    title: 'Neon Bohemian Sangeet & DJ Sound Stage',
    client: 'Verma Sangeet Festival',
    location: 'Riviera Riverfront Resort Lawns',
    desc: 'State-of-the-art JBL VTX line array audio system, kinetic beam lighting, and customized LED dance floor.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    tag: 'AV & Sound Stage',
    link: '/events',
  },
  {
    id: 'p_07',
    category: 'BEAUTY',
    title: 'Hydra-Infusion Glow Therapy & Cosmetology Lab',
    client: 'Sanctuary Aesthetics Clinic',
    location: 'Golden Beauty Flagship Studio',
    desc: 'Clinical deep-pore oxygenation, lymphatic drainage facial, and 24K gold serum infusion glow.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    tag: 'Skin Aesthetics',
    link: '/storefront',
  },
  {
    id: 'p_08',
    category: 'PLOTTING',
    title: 'Ganga View Enclave Premium Residential Plots',
    client: 'Phase-2 Riverside Plots',
    location: 'Ramnagar Ganga Ghat Proximity',
    desc: 'Scenic riverside residential community with instant Registry & Mutation, streetlights, and 24/7 security gate.',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    tag: 'Land Registry',
    link: '/plotting',
  },
];

export default function PublicGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filtered = selectedCategory === 'ALL'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', padding: '1rem 0 5rem', maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Header ── */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: '#faf5ff', border: '1px solid #e9d5ff', fontSize: '12px', fontWeight: 800, color: '#7e22ce', marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>PORTFOLIO & VISUAL SHOWCASE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 12px' }}>
          The Kashi Service Showcase
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          Explore our real-world productions across bridal beauty, wedding stage decor, residential colonies, commercial corporate leases, and cloud software.
        </p>
      </section>

      {/* ── Category Filter Tabs ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: 'All Projects' },
          { id: 'BEAUTY', label: '💄 Salon & Bridal' },
          { id: 'EVENTS', label: '🎉 Events & Stage Decor' },
          { id: 'PLOTTING', label: '🏗️ Plots & Townships' },
          { id: 'RENT', label: '🔑 Corporate Leases' },
          { id: 'SOFTWARE', label: '💻 Cloud Software' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: selectedCategory === tab.id ? 'none' : '1px solid #e2e8f0',
              background: selectedCategory === tab.id ? '#0f172a' : '#ffffff',
              color: selectedCategory === tab.id ? '#ffffff' : '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: selectedCategory === tab.id ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Gallery Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '999px',
                  }}
                >
                  {item.tag}
                </span>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  {item.client} • {item.location}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <NavLink
                to={item.link}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>Visit Vertical Showcase</span>
                <ArrowRight size={14} />
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

