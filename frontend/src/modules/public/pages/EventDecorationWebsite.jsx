import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PartyPopper,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Camera,
  Music,
  Utensils,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Star,
  Award,
  Zap,
} from 'lucide-react';

export default function EventDecorationWebsite() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('ALL');

  const themes = [
    {
      title: 'Royale Heritage Floral Mandap & Floating Aisle',
      category: 'WEDDING',
      price: '₹3,50,000',
      tag: 'Royale Destination',
      desc: 'Hand-carved marble finish columns, cascading Dutch exotic flowers, crystal teardrop chandeliers, and a 50-foot glass illuminated water aisle.',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'Cinematic Concert LED Stage & 3D Lighting Truss',
      category: 'SANGEET',
      price: '₹1,95,000',
      tag: 'Sangeet & Cocktail',
      desc: 'P3 Ultra-HD curved LED backdrop wall, digital beam moving heads, CO2 cryogenic smoke jets, cold pyro sparks & concert sound line-array.',
      img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'Grand Floral Fairy-Light Entrance Tunnel',
      category: 'ENTRY',
      price: '₹1,10,000',
      tag: 'VIP Entrance',
      desc: '120-foot arched floral pathway with 10,000+ warm fairy bulbs, mirrored entrance pedestals, welcome hostess podium & fragrance mist nozzles.',
      img: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'Golden Royale Banquet & Velvet Dining Pavilion',
      category: 'BANQUET',
      price: '₹1,40,000',
      tag: '500+ Capacity',
      desc: 'Custom gold-rimmed glassware, champagne velvet chair draping, brass floral centerpieces, warm ambient ceiling canopy & live buffet counters.',
      img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'Corporate Summit Stage & Live Hybrid Broadcast',
      category: 'CORPORATE',
      price: '₹2,40,000',
      tag: 'Corporate & Tech',
      desc: 'Matte executive stage fabrication, acoustic sound dampening, dynamic presenter displays, multi-camera live switching & wireless mics.',
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80',
    },
    {
      title: 'High-Speed QR Gate Pass & Fast Check-In Scanner',
      category: 'TECH',
      price: '₹40,000',
      tag: 'Smart Gate Tech',
      desc: 'Digital WhatsApp wedding passes, laser barcode gate terminals, real-time guest attendance radar & instant VIP arrival SMS triggers.',
      img: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=700&q=80',
    },
  ];

  const filtered = selectedTheme === 'ALL' ? themes : themes.filter(t => t.category === selectedTheme);

  return (
    <div style={{ minHeight: '100vh', background: '#070a12', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Top Ribbon ── */}
      <div
        style={{
          background: 'linear-gradient(90deg, #3b0764 0%, #581c87 50%, #1e1b4b 100%)',
          color: '#ffffff',
          padding: '9px 2.5rem',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: '#a855f7', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>
            STAGE PRODUCTION
          </span>
          <span>🎪 Booking Open for 2026-2027 Wedding & Sangeet Season • Varanasi & Eastern UP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#e9d5ff' }}>
          <span>📍 Taj Nadesar & Grand Palace Heritage Venues</span>
          <span>📞 +91 98765 11223</span>
        </div>
      </div>

      {/* ── Futuristic High-Tech Nav ── */}
      <nav
        style={{
          padding: '1.25rem 2.5rem',
          background: 'rgba(7, 10, 18, 0.94)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/events')}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 50%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.45)',
            }}
          >
            <PartyPopper size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              JAY GURUDEV EVENTS
            </div>
            <div style={{ fontSize: '10.5px', color: '#c084fc', fontWeight: 800, letterSpacing: '0.1em', marginTop: '2px' }}>
              LUXURY WEDDINGS & STAGE ENGINEERING
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontWeight: 700, fontSize: '13.5px' }}>
          <span style={{ color: '#c084fc', cursor: 'pointer' }} onClick={() => setSelectedTheme('ALL')}>All Productions</span>
          <span style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => setSelectedTheme('WEDDING')}>Mandap & Stage</span>
          <span style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => setSelectedTheme('SANGEET')}>LED Truss & DJ</span>
          <span style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => setSelectedTheme('ENTRY')}>Grand Entryways</span>
          <span style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => setSelectedTheme('BANQUET')}>Banquets</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            ← Kashi Hub
          </button>
        </div>
      </nav>

      {/* ── Futuristic Hero Showcase ── */}
      <section
        style={{
          position: 'relative',
          padding: '5.5rem 2.5rem 5rem',
          background: 'radial-gradient(ellipse at 50% 0%, #3b0764 0%, #070a12 75%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#e9d5ff',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={15} color="#c084fc" />
            <span>Grand Spectacles • Concert AV • High-Definition Stage Visuals</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              color: '#ffffff',
            }}
          >
            Engineering Unforgettable{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #c084fc 0%, #e879f9 50%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Wedding & Stage Experiences
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.65, maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            We bring architectural floral mandaps, festival-grade curved LED stages, robotic concert lights, and seamless QR gate entry systems to Varanasi and Eastern UP.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTheme('WEDDING')}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 900,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.45)',
              }}
            >
              <span>Explore Wedding Staging</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Themes Catalog Grid ── */}
      <section style={{ padding: '4.5rem 2.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
            Stage Production & Decor Portfolios
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
            Engineered with high precision on-site fabrication, floral artistry and digital sound systems.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {filtered.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div
                style={{
                  height: '220px',
                  backgroundImage: `url("${t.img}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(168, 85, 247, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {t.tag}
                </span>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.85)',
                    color: '#f8fafc',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 900,
                  }}
                >
                  {t.price}
                </span>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                    {t.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} />
                    <span>Complete On-site Fabrication & Sound Crew Included</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#030712', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '3.5rem 2.5rem 2.5rem', textAlign: 'center', color: '#64748b' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto 1.5rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>JAY GURUDEV EVENT DECORATION</div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Luxury Mandap Staging, Concert DJ Truss, Curved LED Walls & Digital Gate Passes for Grand Weddings across UP.
          </p>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          © 2026 Jay Gurudev Event Decoration. High-Tech Event Engineering Wing of Kashi Service Enterprise Ecosystem.
        </div>
      </footer>
    </div>
  );
}
