import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  Heart,
  Star,
  Clock,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Gem,
  Smile,
  Check,
} from 'lucide-react';

export default function GoldenBeautyWebsite() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPlan, setSelectedPlan] = useState('BRIDAL_ROYALE');

  const servicesList = [
    {
      name: 'Royale Airbrush Bridal HD Makeover',
      category: 'BRIDAL',
      price: '₹14,999',
      originalPrice: '₹18,500',
      time: '180 mins',
      tag: 'Signature Bridal',
      desc: 'Exclusive celebrity HD Airbrush makeup with 3D mink lashes, contouring, high-shine glow setting, designer hair styling, jewelry fixing & dupatta draping.',
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pre-Bridal Radiance 7-Day Glow Spa',
      category: 'BRIDAL',
      price: '₹7,999',
      originalPrice: '₹10,500',
      time: '150 mins',
      tag: 'Bridal Prep',
      desc: 'Full-body aromatic gold polish, ultrasonic dead skin exfoliation, Moroccan body wrap, chocolate wax & 24K pure gold facial.',
      img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Brazilian Keratin & Protein Infusion Hair Spa',
      category: 'HAIR',
      price: '₹4,499',
      originalPrice: '₹6,000',
      time: '120 mins',
      tag: 'Best Seller',
      desc: 'Deep structural hair bonding, anti-frizz keratin protein therapy, split-end repair, steam infusion & mirror-glass shine blow dry.',
      img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Organic Balayage Highlights & Global Color',
      category: 'HAIR',
      price: '₹5,200',
      originalPrice: '₹7,000',
      time: '140 mins',
      tag: 'Trending Color',
      desc: 'Zero-ammonia imported Italian pigment balayage, custom sun-kissed shades, gloss toner treatment & bond-protecting hair bath.',
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Hydra-Oxygen Clinical Facial & Microdermabrasion',
      category: 'SKIN',
      price: '₹3,499',
      originalPrice: '₹4,800',
      time: '75 mins',
      tag: 'Clinical Glow',
      desc: '9-step medical-grade hydra-dermabrasion suction, pore deep detox, peptide serum infusion, LED phototherapy & cryo-tightening hammer.',
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'O3+ D-Tan & Diamond Crystal Polish',
      category: 'SKIN',
      price: '₹2,299',
      originalPrice: '₹3,000',
      time: '60 mins',
      tag: 'Instant Tan Removal',
      desc: 'Deep melanin de-pigmentation, crystal peel scrub, botanical lightening mask & anti-pollution protective serum shield.',
      img: 'https://images.unsplash.com/photo-1512290900672-1f02e6c5188d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'VIP Doorstep Wedding Specialist Dispatch',
      category: 'HOME',
      price: '₹16,500',
      originalPrice: '₹20,000',
      time: 'At Your Venue',
      tag: 'Home Service',
      desc: 'Senior bridal artist & hair stylist dispatched to your home or hotel room with mobile LED vanity studio and sanitized disposable kits.',
      img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Master Diploma in Cosmetology & Bridal Artistry',
      category: 'ACADEMY',
      price: '₹32,000',
      originalPrice: '₹45,000',
      time: '3 Months (Govt Recognized)',
      tag: 'Academy LMS',
      desc: 'Professional course with live client training, Airbrush machinery practice, skin histology, portfolio photoshoot & ISO certification.',
      img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const testimonials = [
    {
      name: 'Ananya Deshmukh',
      event: 'Bridal Makeover',
      stars: 5,
      review: 'Golden Beauty Parlour made my wedding day unforgettable! The airbrush HD makeup was flawless and lasted through 12 hours of rituals without a single touch-up.',
      city: 'Varanasi',
    },
    {
      name: 'Pooja Srivastava',
      event: 'Keratin & Hair Spa',
      stars: 5,
      review: 'Best luxury salon experience in the city. The staff was gentle, professional, and the hair keratin transformed my dry hair into silky smooth glass texture!',
      city: 'Bhadohi',
    },
    {
      name: 'Swati Agarwal',
      event: 'Hydra Facial & D-Tan',
      stars: 5,
      review: 'The clinical Hydra Facial gives an unbelievable instant glow. Loved the hygienic single-use kits and relaxing ambiance!',
      city: 'Varanasi',
    },
  ];

  const filteredServices = selectedCategory === 'ALL'
    ? servicesList
    : servicesList.filter(s => s.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', color: '#1a1016', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Top Announcement Ribbon ── */}
      <div
        style={{
          background: 'linear-gradient(90deg, #9f1239 0%, #be123c 50%, #881337 100%)',
          color: '#ffffff',
          padding: '9px 2rem',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          letterSpacing: '0.02em',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: '#fecdd3', color: '#9f1239', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>
            FESTIVE SURGE
          </span>
          <span>✨ Flat 25% OFF on Royale Bridal & Pre-Bridal Packages • Booking Code: GLAM25</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>📍 Sigra Mahmoorganj, Varanasi</span>
          <span>📞 +91 98765 43210</span>
          <span>🕒 09:00 AM - 09:00 PM</span>
        </div>
      </div>

      {/* ── World-Class Luxury Header ── */}
      <nav
        style={{
          padding: '1.25rem 2.5rem',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #fce7f3',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px -2px rgba(159, 18, 57, 0.06)',
        }}
      >
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => navigate('/storefront')}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 50%, #881337 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 18px rgba(190, 18, 60, 0.35)',
            }}
          >
            <Scissors size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#881337', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              GOLDEN BEAUTY
            </div>
            <div style={{ fontSize: '10.5px', color: '#be123c', fontWeight: 800, letterSpacing: '0.1em', marginTop: '2px' }}>
              LUXURY SALON & ACADEMY
            </div>
          </div>
        </div>

        {/* Center Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontWeight: 700, fontSize: '13.5px' }}>
          <span style={{ color: '#be123c', cursor: 'pointer' }} onClick={() => setSelectedCategory('ALL')}>All Services</span>
          <span style={{ color: '#475569', cursor: 'pointer' }} onClick={() => setSelectedCategory('BRIDAL')}>Bridal Couture</span>
          <span style={{ color: '#475569', cursor: 'pointer' }} onClick={() => setSelectedCategory('HAIR')}>Hair Therapy</span>
          <span style={{ color: '#475569', cursor: 'pointer' }} onClick={() => setSelectedCategory('SKIN')}>Hydra Aesthetics</span>
          <span style={{ color: '#475569', cursor: 'pointer' }} onClick={() => setSelectedCategory('HOME')}>Doorstep Home</span>
          <span style={{ color: '#475569', cursor: 'pointer' }} onClick={() => setSelectedCategory('ACADEMY')}>Academy LMS</span>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/book')}
            style={{
              padding: '11px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(244, 63, 94, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            <Calendar size={16} />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              background: '#fdf2f8',
              color: '#be123c',
              border: '1.5px solid #fbcfe8',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            ← Kashi Hub
          </button>
        </div>
      </nav>

      {/* ── Hero Showcase Section ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 2rem 4.5rem',
          background: 'linear-gradient(180deg, #fff1f2 0%, #faf9f6 100%)',
          borderBottom: '1px solid #fce7f3',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          {/* Left Text */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #fbcfe8',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#be123c',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(190, 18, 60, 0.08)',
              }}
            >
              <Sparkles size={15} color="#f43f5e" />
              <span>Varanasi's Premier Bridal Makeover & Aesthetic Sanctuary</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                color: '#881337',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Where Bridal Elegance Meets Modern Glamour
            </h1>

            <p style={{ fontSize: '1.12rem', color: '#475569', lineHeight: 1.65, maxWidth: '620px', marginBottom: '2.5rem' }}>
              Specializing in high-definition celebrity bridal makeovers, Russian hair styling, clinical Hydra-Facials, and doorstep wedding artists visiting your venue with mobile studios.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/book')}
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
                }}
              >
                <span>Book Instant Slot</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => setSelectedCategory('BRIDAL')}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#881337',
                  border: '2px solid #fbcfe8',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
              >
                👑 View Bridal Portfolio
              </button>
            </div>

            {/* Micro Stats */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #fce7f3' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#881337' }}>5,200+</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Happy Brides & Clients</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#881337' }}>4.9 ★</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Google Review Rating</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#881337' }}>100%</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Sanitized Sealed Tools</div>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '480px',
                borderRadius: '24px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 20px 40px rgba(159, 18, 57, 0.2)',
                border: '4px solid #ffffff',
              }}
            />

            {/* Floating Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                background: '#ffffff',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid #fce7f3',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fdf2f8', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>ISO 9001:2026 Certified</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Luxury Salon & Training Academy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Menu Section ── */}
      <section style={{ padding: '4.5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Exclusive Treatments & Packages
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#881337', margin: '0 0 8px' }}>
            Curated Beauty & Wellness Menu
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Choose from our specialized beauty categories below and book your slot with instant live confirmation.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[
            { id: 'ALL', label: 'All Services' },
            { id: 'BRIDAL', label: '👑 Bridal & Pre-Bridal' },
            { id: 'HAIR', label: '✂️ Keratin & Hair Spa' },
            { id: 'SKIN', label: '🌸 Hydra & Facials' },
            { id: 'HOME', label: '🚗 Doorstep Home Service' },
            { id: 'ACADEMY', label: '🎓 Academy LMS Diplomas' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: selectedCategory === c.id ? 800 : 600,
                border: selectedCategory === c.id ? 'none' : '1.5px solid #fce7f3',
                background: selectedCategory === c.id ? '#be123c' : '#ffffff',
                color: selectedCategory === c.id ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                boxShadow: selectedCategory === c.id ? '0 4px 12px rgba(190, 18, 60, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Services Grid Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.75rem' }}>
          {filteredServices.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #fce7f3',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(190, 18, 60, 0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div
                style={{
                  height: '190px',
                  backgroundImage: `url("${s.img}")`,
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    color: '#be123c',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {s.tag}
                </span>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock size={12} />
                  <span>{s.time}</span>
                </span>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{s.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through', marginRight: '6px' }}>
                      {s.originalPrice}
                    </span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#be123c' }}>{s.price}</span>
                  </div>

                  <button
                    onClick={() => navigate('/book')}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Book Now</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Client Testimonials ── */}
      <section style={{ padding: '4rem 2rem', background: '#fff', borderTop: '1px solid #fce7f3' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#881337', margin: '0 0 6px' }}>Words of Love from Our Brides</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Verified customer experiences across Varanasi and Eastern UP</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, idx) => (
              <div key={idx} style={{ padding: '1.5rem', borderRadius: '16px', background: '#faf9f6', border: '1px solid #fce7f3' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={16} fill="#e11d48" color="#e11d48" />
                  ))}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1rem' }}>
                  "{t.review}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{t.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#be123c', fontWeight: 700 }}>{t.event} • {t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#4c0519', color: '#fce7f3', padding: '3.5rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>GOLDEN BEAUTY PARLOUR</div>
            <p style={{ fontSize: '0.85rem', color: '#fbcfe8', lineHeight: 1.6, margin: 0 }}>
              Eastern UP's premier destination for luxury bridal HD makeovers, clinical Hydra-Facials, organic hair care, and professional cosmetology academy certifications.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '12px' }}>Sanctuary Address</div>
            <div style={{ fontSize: '0.85rem', color: '#fbcfe8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📍 Sigra Crossing, Opp. IP Sigra Mall, Varanasi (UP) - 221002</div>
              <div>📞 Phone: +91 98765 43210 / 0542-223344</div>
              <div>✉️ Email: contact@goldenbeautyparlour.com</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '12px' }}>Operational Timings</div>
            <div style={{ fontSize: '0.85rem', color: '#fbcfe8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Monday - Saturday: 09:00 AM - 09:00 PM</div>
              <div>Sunday: 10:00 AM - 08:30 PM</div>
              <div>Emergency Bridal Dispatches: 24/7 on call</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '12px', color: '#fbcfe8' }}>
          © 2026 Golden Beauty Parlour & Salon. Designed by World-Class UI/UX Agency. Powered by Kashi Service Enterprise Ecosystem.
        </div>
      </footer>
    </div>
  );
}
